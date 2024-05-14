"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import LoadingButton from "./LoadingButton";

const FormSubmitButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  const { pending } = useFormStatus();
  return <LoadingButton type="submit" loading={pending} {...props} />;
};

export default FormSubmitButton;
