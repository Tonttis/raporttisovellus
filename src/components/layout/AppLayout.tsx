'use client';

import { Navbar } from './Navbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <footer className="bg-slate-900 text-slate-400 py-4 text-center text-sm mt-auto">
        © {new Date().getFullYear()} Tuotantoraportointijärjestelmä
      </footer>
    </div>
  );
}
