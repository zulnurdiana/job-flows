const { divisi, jabatan, pegawai } = require("./divisi-jabatan-pegawai-data");
const { PrismaClient } = require("@prisma/client");
const { placeholderJobs } = require("./placeholder-data");
const { kriteria } = require("./kriteria-data");
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
    kriteria.map(async (kriter) => {
      await prisma.kriteria.upsert({
        where: {
          nama_kriteria: kriter.nama_kriteria,
        },
        update: kriter,
        create: kriter,
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

  await Promise.all(
    pegawai.map(async (p) => {
      const jabatan = await prisma.jabatan.findUnique({
        where: { id_jabatan: p.id_jabatan },
      });

      if (!jabatan) {
        console.error(
          `Jabatan dengan ID "${p.id_jabatan}" tidak ditemukan. Pastikan jabatan sudah ada sebelum menambahkan pegawai.`,
        );
        return;
      }

      const existingPegawai = await prisma.pegawai.findUnique({
        where: { nama_pegawai: p.nama_pegawai },
      });

      const dataToUpsert = {
        nama_pegawai: p.nama_pegawai,
        status_pegawai: p.status_pegawai,
        id_jabatan: jabatan.id_jabatan,
        email: p.email || undefined,
        tgl_bergabung: p.tgl_gabung || undefined, // Menggunakan tgl_gabung sebagai tgl_bergabung
        tgl_berakhir: p.tgl_selesai || undefined, // Menggunakan tgl_selesai sebagai tgl_berakhir
      };

      await prisma.pegawai.upsert({
        where: {
          id_pegawai: existingPegawai ? existingPegawai.id_pegawai : 0,
        },
        update: dataToUpsert,
        create: dataToUpsert,
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Database seeded successfully");
  })
  .catch(async (e) => {
    console.error("Error while seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
