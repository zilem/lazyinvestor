import type { ReactNode } from "react";

type TrackerLayoutProps = {
  form: ReactNode;
  results: ReactNode;
};

export function TrackerLayout({ form, results }: TrackerLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            lazyinvestor
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Track how any ticker would have performed from a given start date.
          </p>
        </header>
        {form}
        {results}
      </main>
    </div>
  );
}
