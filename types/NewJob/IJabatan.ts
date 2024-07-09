// IJabatan.ts
import { IDivisi } from "../NewPermintaan/IDivisi";

export interface IJabatan {
  id_jabatan: number;
  id_divisi: number;
  nama_jabatan: string;
  deskripsi_jabatan?: string | null;
  divisi: IDivisi;
  createdAt: Date;
  updatedAt: Date;
}
