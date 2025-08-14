'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  CurrencyDollarIcon, 
  CreditCardIcon, 
  BellIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Expenses', href: '/expenses', icon: CurrencyDollarIcon },
  { name: 'EMIs', href: '/emis', icon: CreditCardIcon },
  { name: 'Loans', href: '/loans', icon: CreditCardIcon },
  { name: 'Reminders', href: '/reminders', icon: BellIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md mt-16">
      <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}