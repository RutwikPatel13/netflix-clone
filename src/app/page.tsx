export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-netflix-red">Netflix Clone</h1>
        <p className="text-xl text-netflix-lightGray">
          A modern streaming platform built with Next.js 14, TypeScript, and Supabase
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <div className="rounded-lg bg-netflix-darkGray p-4">
            <p className="text-sm text-netflix-lightGray">✅ Next.js 14 + TypeScript</p>
          </div>
          <div className="rounded-lg bg-netflix-darkGray p-4">
            <p className="text-sm text-netflix-lightGray">✅ Tailwind CSS</p>
          </div>
          <div className="rounded-lg bg-netflix-darkGray p-4">
            <p className="text-sm text-netflix-lightGray">✅ Supabase Ready</p>
          </div>
        </div>
      </div>
    </main>
  );
}

