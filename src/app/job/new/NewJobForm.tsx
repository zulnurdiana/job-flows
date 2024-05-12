"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import H1 from "@/components/ui/h1";
import { createJobsSchema, createJobValue } from "@/lib/validation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
import { jobTypes, locationTypes } from "@/lib/job-types";
import LocationInput from "@/components/LocationInput";
import { X } from "lucide-react";

const NewJobForm = () => {
  const form = useForm<createJobValue>({
    resolver: zodResolver(createJobsSchema),
  });

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(value: createJobValue) {
    alert(JSON.stringify(value, null, 2));
  }

  return (
    <main className="max-w-[350px] sm:max-w-3xl m-auto space-y-10 my-10">
      <div className="space-y-5 text-center">
        <H1>Find your best developer</H1>
        <p className="text-muted-foreground">
          Get your joob posting seen by thousand job seekers
        </p>
      </div>
      <div className="border rounded-lg space-y-4 p-4">
        <h2 className="font-semibold">Job Details</h2>
        <p className="text-muted-foreground">
          Provide job description and detail
        </p>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <FormControl>
                    <Select>
                      <option value="" hidden>
                        Select Job Type
                      </option>
                      {jobTypes.map((jobType) => (
                        <option value={jobType} key={jobType}>
                          {jobType}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="companyLogo"
              render={({ field: { value, ...fieldValues } }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type="file"
                      accept="image/*"
                      // handle jika user menginput lebih dari 1 image
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        fieldValues.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Select>
                      <option value="" hidden>
                        Select an option
                      </option>
                      {locationTypes.map((locationType) => (
                        <option value={locationType} key={locationType}>
                          {locationType}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Location</FormLabel>
                  <FormControl>
                    <LocationInput
                      onLocationSelected={field.onChange}
                      ref={field.ref}
                    />
                  </FormControl>
                  {watch("location") && (
                    <button
                      type="button"
                      onClick={() =>
                        setValue("location", "", { shouldValidate: true })
                      }
                      className="flex items-center gap-2"
                    >
                      <X size={20} />
                      <span>{watch("location")}</span>
                    </button>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </main>
  );
};

export default NewJobForm;
