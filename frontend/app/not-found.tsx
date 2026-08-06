import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 p-6">
      <h1 className="text-4xl font-bold text-sky-400 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-400 mb-6">The requested dashboard page could not be found.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors font-medium"
      >
        Return to MES Dashboard
      </Link>
    </div>
  );
}
