// IJabatan.ts

export interface IJabatan {
  id_jabatan: number;
  id_divisi: number;
  nama_jabatan: string;
  deskripsi_jabatan?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
