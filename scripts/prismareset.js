const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    // Menghapus semua data dari tabel
    await prisma.$transaction([
      prisma.persyaratan.deleteMany({}),
      prisma.permintaan.deleteMany({}),
      prisma.pegawai.deleteMany({}),
      prisma.jabatan.deleteMany({}),
      prisma.divisi.deleteMany({}),
      prisma.job.deleteMany({}),
      prisma.kriteria.deleteMany({}),
      prisma.user.deleteMany({}),
      prisma.account.deleteMany({}),
      prisma.session.deleteMany({}),
    ]);

    // Mengatur ulang sequence auto-increment primary key hanya untuk id_jabatan
    await prisma.$executeRaw`ALTER SEQUENCE jabatan_id_jabatan_seq RESTART WITH 1`;

    console.log("Database telah direset.");
  } catch (error) {
    console.error("Terjadi kesalahan saat mereset database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
