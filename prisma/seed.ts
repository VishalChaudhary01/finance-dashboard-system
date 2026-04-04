import { prisma } from "../src/config/prisma";
import { hashValue } from "../src/common/utils/bcrypt";

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@finance.com" },
    select: { id: true },
  });

  if (adminExists) {
    console.log("Admin user already exists, skipping seed.");
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@finance.com",
      passwordHash: await hashValue("Admin@1234"),
      role: "ADMIN",
    },
    omit: { passwordHash: true },
  });

  console.log(`Admin user created: ${user.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
