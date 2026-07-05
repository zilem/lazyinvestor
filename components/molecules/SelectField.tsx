import type { ReactNode, SelectHTMLAttributes } from "react";
import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";

type Option = { value: string; label: string };

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  id: string;
  options: Option[];
  hint?: ReactNode;
};

export function SelectField({
  label,
  id,
  options,
  hint,
  className,
  ...selectProps
}: SelectFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={id}>{label}</Label>
      <Select id={id} {...selectProps}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {hint ? (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</span>
      ) : null}
    </div>
  );
}
