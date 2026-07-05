import type { InputHTMLAttributes, ReactNode } from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  hint?: ReactNode;
};

export function FormField({ label, id, hint, className, ...inputProps }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...inputProps} />
      {hint ? (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</span>
      ) : null}
    </div>
  );
}
