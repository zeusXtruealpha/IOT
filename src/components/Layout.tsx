
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 antialiased">
      <Sidebar />
      <main className="ml-64 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
