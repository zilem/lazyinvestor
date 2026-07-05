import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "positive" | "negative" | "neutral";
};

export function Badge({
  tone = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium";
  const toneStyles = {
    positive:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    negative:
      "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    neutral:
      "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
  }[tone];
  return <span className={`${base} ${toneStyles} ${className}`} {...props} />;
}
