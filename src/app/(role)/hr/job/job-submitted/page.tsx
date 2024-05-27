import H1 from "@/components/ui/h1";

const page = () => {
  return (
    <div className="max-w-5x flex justify-center flex-col items-center space-y-5 m-auto px-3 my-10 text-center min-h-[400px]">
      <H1>Thank you for submitting your job</H1>
      <p>Your job posting has been submitted and is pending for approval</p>
    </div>
  );
};

export default page;
