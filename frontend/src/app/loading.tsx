export default function Loading() {
  return (
    <div className="min-h-screen bg-isoko-dark grid place-items-center" role="status" aria-live="polite">
      <div className="text-center text-white">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-isoko-accent" />
        <p className="text-sm font-bold tracking-wide">Loading Isoko y&apos;Ubworozi…</p>
      </div>
    </div>
  );
}
