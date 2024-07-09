// Persyaratan.ts
import { IPermintaan } from "./IPermintaan";

export interface IPersyaratan {
  id_persyaratan: number;
  pengalaman_kerja: string;
  pendidikan: string;
  umur_min: number;
  umur_max: number;
  status_pernikahan: string;
  description?: string | null;
  id_user: string;
  id_permintaan: number;
  permintaan: IPermintaan;
  id_job?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
