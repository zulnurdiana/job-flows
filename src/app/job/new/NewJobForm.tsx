"use client";
import H1 from "@/components/ui/h1";
import React from "react";

const NewJobForm = () => {
  return (
    <main className="max-w-[350px] sm:max-w-3xl m-auto space-y-10 my-10">
      <div className="space-y-5 text-center">
        <H1>Find your best developer</H1>
        <p className="text-muted-foreground">
          Get your joob posting seen by thousand job seekers
        </p>
      </div>
      <div className="border rounded-lg space-y-6 p-4"></div>
    </main>
  );
};

export default NewJobForm;
