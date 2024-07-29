"use client";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="container mx-auto min-h-screen space-y-8 py-12">
      <>
        <h1
          className={
            "text-4xl font-semibold text-center dark:text-slate-200 text-gray-800"
          }
        >
          Oops! Something went wrong
        </h1>
        <p className="text-sm text-slate-500 max-w-lg text-center mx-auto">
          {error.message}
        </p>
      </>
    </div>
  );
}
