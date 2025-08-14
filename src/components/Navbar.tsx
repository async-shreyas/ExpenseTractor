'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';

export default function Navbar() {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              ExpenseTracker
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {session && (
              <>
                <NotificationBell />
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}