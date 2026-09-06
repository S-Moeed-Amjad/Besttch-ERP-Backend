import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

const PORT = env.port || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
