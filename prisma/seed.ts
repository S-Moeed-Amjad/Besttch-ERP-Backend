import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ROLE_DEFS = [
  { name: "super_admin", displayName: "Super Admin", description: "Highest-level system owner. Full access to every module, user, and setting." },
  { name: "admin", displayName: "Admin", description: "Business manager. Manages clients, staff, CRM, inventory, logistics, invoices, and reports." },
  { name: "staff", displayName: "Staff", description: "Daily operational user with access to assigned work only." },
  { name: "client", displayName: "Client", description: "External client-portal user, limited to their own account, invoices, and orders." },
];

const PERMISSION_DEFS = [
  "users.view",
  "users.create",
  "users.update",
  "users.delete",
  "users.manage_status",
  "dashboard.view",
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: PERMISSION_DEFS,
  admin: ["users.view", "users.create", "users.update", "users.delete", "users.manage_status", "dashboard.view"],
  staff: ["dashboard.view"],
  client: [],
};

const FAKE_STAFF_NAMES = [
  "Amara Chen", "Diego Fernandez", "Priya Sharma", "Liam O'Connor", "Sofia Rossi",
];
const FAKE_CLIENT_NAMES = [
  "Grace Kim", "Noah Williams", "Fatima Al-Sayed", "Lucas Silva", "Emily Johnson",
];

async function main() {
  console.log("Seeding roles...");
  const roles: Record<string, { id: number }> = {};
  for (const def of ROLE_DEFS) {
    const role = await prisma.role.upsert({
      where: { name: def.name },
      update: { displayName: def.displayName, description: def.description },
      create: def,
    });
    roles[def.name] = role;
  }

  console.log("Seeding permissions...");
  const permissions: Record<string, { id: number }> = {};
  for (const name of PERMISSION_DEFS) {
    const permission = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    permissions[name] = permission;
  }

  console.log("Seeding role_permission...");
  for (const [roleName, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
    for (const permissionName of permissionNames) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roles[roleName].id,
            permissionId: permissions[permissionName].id,
          },
        },
        update: {},
        create: { roleId: roles[roleName].id, permissionId: permissions[permissionName].id },
      });
    }
  }

  console.log("Seeding admin user...");
  const adminPassword = "Admin@123";
  const adminHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: "admin@besttech.com" },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@besttech.com",
      password: adminHash,
      roleId: roles.super_admin.id,
      status: "active",
    },
  });

  console.log("Seeding sample staff and client users...");
  const samplePassword = await bcrypt.hash("Password@123", 10);

  for (const [i, name] of FAKE_STAFF_NAMES.entries()) {
    const email = `${slugify(name)}@besttech.com`;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        password: samplePassword,
        roleId: roles.staff.id,
        status: i % 4 === 0 ? "inactive" : "active",
        phone: `+1-555-01${10 + i}`,
      },
    });
  }

  for (const [i, name] of FAKE_CLIENT_NAMES.entries()) {
    const email = `${slugify(name)}@clientmail.com`;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        password: samplePassword,
        roleId: roles.client.id,
        status: i % 5 === 0 ? "inactive" : "active",
        phone: `+1-555-02${10 + i}`,
      },
    });
  }

  console.log("\nSeed complete.\n");
  console.log("========================================");
  console.log(" Seeded admin login");
  console.log(" Email:    admin@besttech.com");
  console.log(` Password: ${adminPassword}`);
  console.log("========================================");
  console.log(" Sample staff/client users password: Password@123\n");
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
