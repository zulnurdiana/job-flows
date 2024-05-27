const { divisi, jabatan } = require("./divisi-jabatan-data");
const { PrismaClient } = require("@prisma/client");
const { placeholderJobs } = require("./placeholder-data");
const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    placeholderJobs.map(async (job) => {
      await prisma.job.upsert({
        where: {
          slug: job.slug,
        },
        update: job,
        create: job,
      });
    }),
  );
  await Promise.all(
    divisi.map(async (d) => {
      await prisma.divisi.upsert({
        where: {
          nama_divisi: d.nama_divisi,
        },
        update: {
          deskripsi_divisi: d.deskripsi_divisi,
        },
        create: {
          nama_divisi: d.nama_divisi,
          deskripsi_divisi: d.deskripsi_divisi,
        },
      });
    }),
  );

  await Promise.all(
    jabatan.map(async (jab) => {
      const divisi = await prisma.divisi.findUnique({
        where: { nama_divisi: jab.divisi },
      });

      if (!divisi) {
        console.error(
          `Divisi dengan nama "${jab.divisi}" tidak ditemukan. Pastikan divisi sudah ada sebelum menambahkan jabatan.`,
        );
        return;
      }

      await prisma.jabatan.upsert({
        where: {
          nama_jabatan: jab.nama_jabatan,
        },
        update: {
          id_divisi: divisi.id_divisi,
          deskripsi_jabatan: jab.deskripsi_jabatan,
        },
        create: {
          id_divisi: divisi.id_divisi,
          nama_jabatan: jab.nama_jabatan,
          deskripsi_jabatan: jab.deskripsi_jabatan,
        },
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error while seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
