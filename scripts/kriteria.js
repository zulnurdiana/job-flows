import prisma from "./prisma";

async function getAllKriteria() {
  const kriteria = await prisma.kriteria.findMany();
  return kriteria.map((kriteria) => kriteria.nama_kriteria);
}

let namaKriteria = [];

async function initializeKriteria() {
  namaKriteria = await getAllKriteria();
}

initializeKriteria();

export default namaKriteria;
