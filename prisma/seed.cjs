const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.branch.createMany({
    data: [
      { id: "ALL", name: "Mặc định (ALL)" },
      { id: "BTX", name: "Bùi Thị Xuân" },
      { id: "TK", name: "Thuỵ Khuê" },
      { id: "OCEAN", name: "Ocean Park" },
      { id: "NVC", name: "Nguyễn Văn Cừ" },
      { id: "SGP", name: "Sài Gòn Pearl" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Seeded branches");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
