"use client";
import H1 from "@/components/ui/h1";
import {
  createPermintaanSchema,
  createPermintaanValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
import LoadingButton from "@/components/LoadingButton";
import createPermintaan from "./actions";
import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NewPermintaanFormProps } from "../../../../../../types/NewPermintaan/IPermintaanProps";
import { IPegawai } from "../../../../../../types/NewPermintaan/IPegawai";

const NewPermintaanForm = ({
  jabatan,
  divisi,
  user,
  pegawai,
}: NewPermintaanFormProps) => {
  const id_divisi = user.pegawai?.jabatan.id_divisi;
  const id_jabatan = user.pegawai?.jabatan.id_jabatan;

  const [filteredPegawai, setFilteredPegawai] = useState<IPegawai[]>([]);
  const [selectedJabatan, setSelectedJabatan] = useState<number | null>(null);
  const [jumlahPegawai, setJumlahPegawai] = useState<number>(0);
  const [penggantiPegawai, setPenggantiPegawai] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<createPermintaanValues>({
    resolver: zodResolver(createPermintaanSchema),
    defaultValues: {
      jumlah_pegawai: "0",
      id_jabatan: "0",
    },
  });

  const {
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting },
  } = form;

  const filteredJabatan = id_divisi
    ? jabatan.filter((jab) => jab.id_divisi === id_divisi)
    : [];

  useEffect(() => {
    if (selectedJabatan) {
      setFilteredPegawai(
        pegawai.filter((p) => p.jabatan.id_jabatan === selectedJabatan),
      );
    } else {
      setFilteredPegawai([]);
    }
  }, [selectedJabatan, pegawai]);

  useEffect(() => {
    const jumlah = parseInt(watch("jumlah_pegawai"), 10);
    if (!isNaN(jumlah)) {
      setJumlahPegawai(jumlah);
      setPenggantiPegawai(Array(jumlah).fill(0));
    }
  }, [watch("jumlah_pegawai")]);

  const handlePenggantiChange = (index: number, value: number) => {
    const updatedPengganti = [...penggantiPegawai];
    updatedPengganti[index] = value;
    setPenggantiPegawai(updatedPengganti);
  };

  const getAvailablePegawai = (index: number) => {
    const selectedIds = penggantiPegawai.filter((_, i) => i !== index);
    return filteredPegawai.filter(
      (pegawai) => !selectedIds.includes(pegawai.id_pegawai),
    );
  };

  async function onSubmit(values: createPermintaanValues) {
    if (penggantiPegawai.some((id) => id === 0)) {
      setErrorMessage(
        `Jumlah pegawai tidak sesuai dengan jumlah yang diminta.`,
      );
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === "object" && value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      }
    });

    try {
      await createPermintaan(formData, penggantiPegawai); // Mengirimkan penggantiPegawai
    } catch (error) {
      alert("Something went wrong");
    }
  }

  return (
    <main className="m-auto max-w-5xl my-4 space-y-4 px-4">
      <Breadcrumb className="bg-gray-100 p-4 rounded-lg">
        <BreadcrumbList className="flex space-x-2 text-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Formulir Permintaan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center">
        <H1 className="text-3xl font-extrabold text-gray-800">
          Formulir Tambah <br /> Permintaan Pegawai
        </H1>
      </div>
      <Form {...form}>
        <form
          className="space-y-6 max-w-3xl m-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={control}
            name="jumlah_pegawai"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Pegawai</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="mt-1 p-2 border rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="id_jabatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job type</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    defaultValue=""
                    className="mt-1 p-2 border rounded-md"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      field.onChange(e);
                      setSelectedJabatan(Number(e.target.value));
                    }}
                  >
                    <option value="" hidden>
                      Select Job
                    </option>
                    {filteredJabatan.map((jab) => (
                      <option key={jab.id_jabatan} value={jab.id_jabatan}>
                        {jab.nama_jabatan}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {jumlahPegawai > 0 && (
            <div className="space-y-4">
              {Array.from({ length: jumlahPegawai }).map((_, index) => (
                <FormItem key={index}>
                  <FormLabel>Pengganti Pegawai {index + 1}</FormLabel>
                  <FormControl>
                    <Select
                      className="mt-1 p-2 border rounded-md"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        handlePenggantiChange(index, Number(e.target.value));
                      }}
                    >
                      <option value="" hidden>
                        Select Pegawai
                      </option>
                      {getAvailablePegawai(index).map((pegawai) => (
                        <option
                          key={pegawai.id_pegawai}
                          value={pegawai.id_pegawai}
                        >
                          {pegawai.nama_pegawai}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </FormItem>
              ))}
            </div>
          )}

          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}

          <LoadingButton
            type="submit"
            className="w-full"
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </form>
      </Form>
    </main>
  );
};

export default NewPermintaanForm;
