// IDivisi.ts
export interface IDivisi {
  id_divisi: number;
  nama_divisi: string;
  deskripsi_divisi?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
