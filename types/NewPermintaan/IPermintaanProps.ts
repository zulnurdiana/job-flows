import { IJabatan } from "./NewPermintaan/IJabatan";
import { IDivisi } from "./NewPermintaan/IDivisi";
import { IUser } from "./NewPermintaan/IUser";
import { IPegawai } from "./NewPermintaan/IPegawai";

export interface NewPermintaanFormProps {
  jabatan: IJabatan[];
  divisi: IDivisi[];
  user: IUser;
  pegawai: IPegawai[];
}
