// Permintaan.ts
import { IJabatan } from "../NewPermintaan/IJabatan";
import { IPersyaratan } from "./IPersyaratan";

export interface IPermintaan {
  id_permintaan: number;
  jumlah_pegawai: number;
  status_permintaan?: boolean | null;
  approved?: boolean | null;
  tanggal_permintaan: Date;
  id_jabatan: number;
  jabatan: IJabatan;
  id_user: string;
  persyaratan?: IPersyaratan[]; // Buat properti persyaratan bersifat opsional
  createdAt: Date;
  updatedAt: Date;
}
