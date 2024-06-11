const divisi = [
  {
    nama_divisi: "Finance & Operation",
    deskripsi_divisi:
      "Divisi ini bertanggung jawab atas manajemen keuangan dan operasional perusahaan. Mereka memastikan keuangan perusahaan berjalan lancar dan efisiensi operasional terjaga.",
  },
  {
    nama_divisi: "Health Care Solution",
    deskripsi_divisi:
      "Divisi ini fokus pada solusi kesehatan dan layanan terkait. Mereka mengembangkan solusi inovatif untuk meningkatkan layanan kesehatan dan kesejahteraan masyarakat.",
  },
  {
    nama_divisi: "Project & Service",
    deskripsi_divisi:
      "Divisi ini mengelola proyek-proyek perusahaan dan menyediakan layanan kepada klien. Mereka bertanggung jawab atas perencanaan, pelaksanaan, dan pengiriman proyek dengan sukses.",
  },
  {
    nama_divisi: "Research & Technical Solution",
    deskripsi_divisi:
      "Divisi ini fokus pada penelitian dan pengembangan solusi teknis. Mereka bekerja untuk menghasilkan solusi teknologi yang inovatif dan memberikan solusi teknis kepada klien.",
  },
  {
    nama_divisi: "Solution Design & Analyst",
    deskripsi_divisi:
      "Divisi ini berfokus pada analisis solusi dan desain. Mereka bertanggung jawab untuk menganalisis kebutuhan klien, merancang solusi yang sesuai, dan mengoptimalkan desain produk atau layanan.",
  },
  {
    nama_divisi: "Marketing & Sales",
    deskripsi_divisi:
      "Divisi ini menangani strategi pemasaran dan penjualan perusahaan. Mereka bertugas untuk memasarkan produk atau layanan perusahaan dan meningkatkan penjualan melalui strategi pemasaran yang efektif.",
  },
];

const jabatan = [
  {
    nama_jabatan: "Manager HRGA",
    deskripsi_jabatan: "Mengelola fungsi HR dan GA.",
    divisi: "Finance & Operation",
  },
  {
    nama_jabatan: "SPV HRGA",
    deskripsi_jabatan: "Mengawasi kegiatan HR dan GA.",
    divisi: "Finance & Operation",
  },
  {
    nama_jabatan: "HR Recruitment",
    deskripsi_jabatan: "Mengelola proses rekrutmen.",
    divisi: "Finance & Operation",
  },
  {
    nama_jabatan: "HR Organization Development",
    deskripsi_jabatan: "Mengembangkan struktur organisasi.",
    divisi: "Finance & Operation",
  },
  {
    nama_jabatan: "HR People Development",
    deskripsi_jabatan: "Mengelola pengembangan karyawan.",
    divisi: "Finance & Operation",
  },
  {
    nama_jabatan: "Legal",
    deskripsi_jabatan: "Menangani urusan hukum perusahaan.",
    divisi: "Finance & Operation",
  },
  {
    nama_jabatan: "GA",
    deskripsi_jabatan: "Mengelola administrasi umum.",
    divisi: "Finance & Operation",
  },
  {
    nama_jabatan: "Manager Finance & Accounting",
    deskripsi_jabatan: "Mengelola keuangan dan akuntansi.",
    divisi: "Finance & Operation",
  },
  {
    nama_jabatan: "SPV Finance & Accounting",
    deskripsi_jabatan: "Mengawasi kegiatan keuangan dan akuntansi.",
    divisi: "Finance & Operation",
  },
  {
    nama_jabatan: "Staff Finance",
    deskripsi_jabatan: "Mengelola transaksi keuangan.",
    divisi: "Finance & Operation",
  },
  {
    nama_jabatan: "Staff Accounting",
    deskripsi_jabatan: "Mengelola pencatatan akuntansi.",
    divisi: "Finance & Operation",
  },
  {
    nama_jabatan: "Manager Health Care Solution",
    deskripsi_jabatan: "Mengelola solusi kesehatan.",
    divisi: "Health Care Solution",
  },
  {
    nama_jabatan: "Project Manager",
    deskripsi_jabatan: "Mengelola proyek kesehatan.",
    divisi: "Health Care Solution",
  },
  {
    nama_jabatan: "IT Technical Support",
    deskripsi_jabatan: "Menyediakan dukungan teknis IT.",
    divisi: "Health Care Solution",
  },
  {
    nama_jabatan: "IT Pro",
    deskripsi_jabatan: "Mengelola infrastruktur IT.",
    divisi: "Health Care Solution",
  },
  {
    nama_jabatan: "Manager Project & Service",
    deskripsi_jabatan: "Mengelola proyek dan layanan.",
    divisi: "Project & Service",
  },
  {
    nama_jabatan: "Project Manager",
    deskripsi_jabatan: "Mengelola proyek perusahaan.",
    divisi: "Project & Service",
  },
  {
    nama_jabatan: "Web Developer",
    deskripsi_jabatan: "Mengembangkan aplikasi web.",
    divisi: "Project & Service",
  },
  {
    nama_jabatan: "Mobile Developer",
    deskripsi_jabatan: "Mengembangkan aplikasi mobile.",
    divisi: "Project & Service",
  },
  {
    nama_jabatan: "Manager Research & Technical Solution",
    deskripsi_jabatan: "Mengelola penelitian dan solusi teknis.",
    divisi: "Research & Technical Solution",
  },
  {
    nama_jabatan: "Manager Solution Design & Analyst",
    deskripsi_jabatan: "Mengelola desain dan analisis solusi.",
    divisi: "Solution Design & Analyst",
  },
  {
    nama_jabatan: "System Analyst",
    deskripsi_jabatan: "Menganalisis sistem.",
    divisi: "Solution Design & Analyst",
  },
  {
    nama_jabatan: "Product Developer",
    deskripsi_jabatan: "Mengembangkan produk.",
    divisi: "Solution Design & Analyst",
  },
  {
    nama_jabatan: "UI/UX",
    deskripsi_jabatan: "Merancang antarmuka dan pengalaman pengguna.",
    divisi: "Solution Design & Analyst",
  },
  {
    nama_jabatan: "Technical Writer",
    deskripsi_jabatan: "Menulis dokumentasi teknis.",
    divisi: "Solution Design & Analyst",
  },
  {
    nama_jabatan: "Admin",
    deskripsi_jabatan: "Mengelola tugas administratif.",
    divisi: "Solution Design & Analyst",
  },
  {
    nama_jabatan: "Pre Sales IT Consultant",
    deskripsi_jabatan: "Menyediakan konsultasi pra-penjualan IT.",
    divisi: "Marketing & Sales",
  },
];

// Fungsi untuk menghasilkan tanggal acak dalam 2 tahun terakhir
function getRandomDateWithinTwoYears() {
  const now = new Date();
  const past = new Date(now.setFullYear(now.getFullYear() - 2));
  const randomDate = new Date(
    past.getTime() + Math.random() * (Date.now() - past.getTime()),
  );
  return randomDate;
}

const pegawai = [
  {
    nama_pegawai: "Andi",
    status_pegawai: "Aktif",
    id_jabatan: 1,
  },
  {
    nama_pegawai: "Budi",
    status_pegawai: "Aktif",
    id_jabatan: 2,
  },
  {
    nama_pegawai: "Citra",
    status_pegawai: "Aktif",
    id_jabatan: 3,
  },
  {
    nama_pegawai: "Dewi",
    status_pegawai: "Aktif",
    id_jabatan: 4,
  },
  {
    nama_pegawai: "Eko",
    status_pegawai: "Aktif",
    id_jabatan: 5,
  },
  {
    nama_pegawai: "Fajar",
    status_pegawai: "Aktif",
    id_jabatan: 6,
  },
  {
    nama_pegawai: "Gita",
    status_pegawai: "Aktif",
    id_jabatan: 7,
  },
  {
    nama_pegawai: "Hendra",
    status_pegawai: "Aktif",
    id_jabatan: 8,
  },
  {
    nama_pegawai: "Indra",
    status_pegawai: "Aktif",
    id_jabatan: 9,
  },
  {
    nama_pegawai: "Joko",
    status_pegawai: "Aktif",
    id_jabatan: 10,
  },
  {
    nama_pegawai: "Kiki",
    status_pegawai: "Aktif",
    id_jabatan: 11,
  },
  {
    nama_pegawai: "Lina",
    status_pegawai: "Aktif",
    id_jabatan: 12,
  },
  {
    nama_pegawai: "Mira",
    status_pegawai: "Aktif",
    id_jabatan: 13,
  },
  {
    nama_pegawai: "Nina",
    status_pegawai: "Aktif",
    id_jabatan: 14,
  },
  {
    nama_pegawai: "Oki",
    status_pegawai: "Aktif",
    id_jabatan: 15,
  },
  {
    nama_pegawai: "Putu",
    status_pegawai: "Aktif",
    id_jabatan: 16,
  },
  {
    nama_pegawai: "Qori",
    status_pegawai: "Aktif",
    id_jabatan: 17,
  },
  {
    nama_pegawai: "Rini",
    status_pegawai: "Cuti",
    id_jabatan: 18,
  },
  {
    nama_pegawai: "Sinta",
    status_pegawai: "Cuti",
    id_jabatan: 19,
  },
  {
    nama_pegawai: "Tina",
    status_pegawai: "Cuti",
    id_jabatan: 20,
  },
  {
    nama_pegawai: "Udin",
    status_pegawai: "Cuti",
    id_jabatan: 21,
  },
  {
    nama_pegawai: "Vina",
    status_pegawai: "Cuti",
    id_jabatan: 22,
  },
  {
    nama_pegawai: "Wawan",
    status_pegawai: "Cuti",
    id_jabatan: 22,
  },
  {
    nama_pegawai: "Xena",
    status_pegawai: "Cuti",
    id_jabatan: 22,
  },
  {
    nama_pegawai: "Yudi",
    status_pegawai: "Cuti",
    id_jabatan: 25,
  },
  {
    nama_pegawai: "Zara",
    status_pegawai: "Cuti",
    id_jabatan: 25,
  },
  {
    nama_pegawai: "Asep",
    status_pegawai: "Cuti",
    id_jabatan: 25,
  },
  {
    nama_pegawai: "Beni",
    status_pegawai: "Nonaktif",
    id_jabatan: 1,
  },
  {
    nama_pegawai: "Cici",
    status_pegawai: "Nonaktif",
    id_jabatan: 2,
  },
  {
    nama_pegawai: "Dodi",
    status_pegawai: "Nonaktif",
    id_jabatan: 3,
  },
  {
    nama_pegawai: "Evi",
    status_pegawai: "Nonaktif",
    id_jabatan: 4,
  },
  {
    nama_pegawai: "Fani",
    status_pegawai: "Nonaktif",
    id_jabatan: 5,
  },
  {
    nama_pegawai: "Gilang",
    status_pegawai: "Nonaktif",
    id_jabatan: 6,
  },
  {
    nama_pegawai: "Hana",
    status_pegawai: "Nonaktif",
    id_jabatan: 7,
  },
  {
    nama_pegawai: "Iwan",
    status_pegawai: "Nonaktif",
    id_jabatan: 8,
  },
  {
    nama_pegawai: "Jeni",
    status_pegawai: "Nonaktif",
    id_jabatan: 9,
  },
  {
    nama_pegawai: "Karin",
    status_pegawai: "Nonaktif",
    id_jabatan: 10,
  },
  {
    nama_pegawai: "Lutfi",
    status_pegawai: "Nonaktif",
    id_jabatan: 11,
  },
  {
    nama_pegawai: "Miko",
    status_pegawai: "Nonaktif",
    id_jabatan: 12,
  },
  {
    nama_pegawai: "Novi",
    status_pegawai: "Nonaktif",
    id_jabatan: 13,
  },
  {
    nama_pegawai: "Omar",
    status_pegawai: "Nonaktif",
    id_jabatan: 14,
  },
  {
    nama_pegawai: "Putra",
    status_pegawai: "Nonaktif",
    id_jabatan: 15,
  },
  {
    nama_pegawai: "Qila",
    status_pegawai: "Nonaktif",
    id_jabatan: 16,
  },
  {
    nama_pegawai: "Reno",
    status_pegawai: "Nonaktif",
    id_jabatan: 17,
  },
  {
    nama_pegawai: "Sari",
    status_pegawai: "Nonaktif",
    id_jabatan: 18,
  },
  {
    nama_pegawai: "Tomi",
    status_pegawai: "Nonaktif",
    id_jabatan: 19,
  },
  {
    nama_pegawai: "Uli",
    status_pegawai: "Nonaktif",
    id_jabatan: 20,
  },
  {
    nama_pegawai: "Vito",
    status_pegawai: "Nonaktif",
    id_jabatan: 21,
  },
  {
    nama_pegawai: "Wina",
    status_pegawai: "Nonaktif",
    id_jabatan: 22,
  },
  {
    nama_pegawai: "Xander",
    status_pegawai: "Nonaktif",
    id_jabatan: 22,
  },
  {
    nama_pegawai: "Yana",
    status_pegawai: "Nonaktif",
    id_jabatan: 23,
  },
  {
    nama_pegawai: "Zaki",
    status_pegawai: "Nonaktif",
    id_jabatan: 25,
  },
];

// Menambahkan email dan tanggal_gabung secara manual
pegawai.forEach((p) => {
  p.email = `${p.nama_pegawai.toLowerCase()}@qtasnim.com`;
  p.tanggal_gabung = getRandomDateWithinTwoYears();
});

module.exports = { divisi, jabatan, pegawai };
