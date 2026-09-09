import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f6faf7]" role="status" aria-live="polite" aria-label="Loading Isoko y'Ubworozi">
      <span className="sr-only">Loading Isoko y&apos;Ubworozi…</span>
      <div className="h-20 border-b border-black/5 bg-white/80" />
      <section className="bg-isoko-dark px-5 py-24 sm:px-8 lg:py-32">
        <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div className="space-y-6">
            <Skeleton className="h-7 w-56 bg-white/12" />
            <Skeleton className="h-14 w-full max-w-2xl bg-white/12 sm:h-20" />
            <Skeleton className="h-14 w-4/5 max-w-xl bg-white/12 sm:h-20" />
            <Skeleton className="h-24 w-full max-w-xl bg-white/10" />
            <div className="flex gap-3"><Skeleton className="h-12 w-36 bg-white/12" /><Skeleton className="h-12 w-36 bg-white/12" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-36 rounded-3xl bg-white/10" />)}
          </div>
        </div>
      </section>
      <section className="section-shell grid gap-5 py-16 md:grid-cols-3">
        {[0, 1, 2].map((item) => <Skeleton key={item} className="h-64 rounded-3xl bg-isoko-dark/8" />)}
      </section>
    </main>
  );
}
