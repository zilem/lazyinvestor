import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", ...props }: LabelProps) {
  const base =
    "text-sm font-medium text-zinc-700 dark:text-zinc-300";
  return <label className={`${base} ${className}`} {...props} />;
}
