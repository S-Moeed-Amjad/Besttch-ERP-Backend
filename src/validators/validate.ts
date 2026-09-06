import { ZodType } from "zod";
import { ApiError } from "../utils/ApiError";

// Pin only the Output generic (not ZodSchema<T>, which pins Input = Output = T
// and breaks inference for schemas with .default()/.coerce, where they differ).
export function parseOrThrow<T>(schema: ZodType<T, any, any>, input: unknown): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join(".") || "_";
      errors[field] = [...(errors[field] ?? []), issue.message];
    }
    throw ApiError.unprocessable("Validation failed", errors);
  }

  return result.data;
}
