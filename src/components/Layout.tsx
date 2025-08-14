'use client';

import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}