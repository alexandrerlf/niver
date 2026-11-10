export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Carregando">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton mt-4 h-11 w-64 max-w-full" />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="skeleton aspect-[9/14] rounded-3xl" />
        ))}
      </div>
    </main>
  );
}
