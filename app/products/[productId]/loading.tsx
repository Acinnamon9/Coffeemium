export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-[#fbf8f3]">
      <header className="h-16 border-b border-[#eadfd3] bg-white" />

      <main className="container mx-auto px-4 py-12 sm:py-20">
        <div className="mb-8 h-5 w-28 rounded bg-[#eadfd3]" />

        <section className="grid overflow-hidden rounded-3xl border border-[#eadfd3] bg-white shadow-sm md:grid-cols-2">
          <div className="bg-[#f4ede5] p-6 sm:p-10">
            <div className="aspect-square w-full rounded-2xl bg-[#e8ddd1]" />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <div className="mb-4 h-4 w-32 rounded bg-[#eadfd3]" />
            <div className="h-12 w-4/5 rounded bg-[#e8ddd1]" />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full rounded bg-[#eadfd3]" />
              <div className="h-4 w-5/6 rounded bg-[#eadfd3]" />
            </div>
            <div className="mt-8 h-9 w-32 rounded bg-[#e8ddd1]" />
            <div className="mt-7">
              <div className="mb-3 h-4 w-28 rounded bg-[#eadfd3]" />
              <div className="flex gap-2">
                <div className="h-8 w-16 rounded-full bg-[#f2e8dc]" />
                <div className="h-8 w-20 rounded-full bg-[#f2e8dc]" />
                <div className="h-8 w-16 rounded-full bg-[#f2e8dc]" />
              </div>
            </div>
            <div className="mt-8 h-14 w-full rounded-full bg-[#d8c7b8] sm:w-40" />
          </div>
        </section>
      </main>

      <footer className="h-32 bg-[#2b211b]" />
    </div>
  );
}
