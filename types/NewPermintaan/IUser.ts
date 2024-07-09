// IUser.ts
import { IPegawai } from "./IPegawai";

export interface IUser {
  id: string;
  name?: string | null;
  password?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  umur?: number | null;
  pendidikan?: string | null;
  alamat?: string | null;
  jenis_kelamin?: string | null;
  status_pernikahan?: string | null;
  cv?: string | null;
  role?: string | null;
  screening_approved?: boolean | null;
  pegawai?: IPegawai | null;
  createdAt: Date;
  updatedAt: Date;
}
