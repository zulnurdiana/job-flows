import { IJabatan } from "./IJabatan";
import { IDivisi } from "./IDivisi";
import { IUser } from "./IUser";
import { IPegawai } from "./IPegawai";

export interface NewPermintaanFormProps {
  jabatan: IJabatan[];
  divisi: IDivisi[];
  user: IUser;
  pegawai: IPegawai[];
}
