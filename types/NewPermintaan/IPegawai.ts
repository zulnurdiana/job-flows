// IPegawai.ts
import { IJabatan } from "./IJabatan";
import { IUser } from "./IUser";

export interface IPegawai {
  id_pegawai: number;
  nama_pegawai: string;
  email?: string | null;
  status_pegawai: string;
  tanggal_gabung?: Date | null;
  id_jabatan: number;
  jabatan: IJabatan;
  user?: IUser | null;
}
