"use client";
import H1 from "@/components/ui/h1";

const error = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center max-w-5xl m-auto space-y-10 px-3 text-center">
      <H1>Error Page | 404</H1>
      <p>Something went wrong</p>
    </div>
  );
};

export default error;
