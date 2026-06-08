import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Scan, User } from 'lucide-react';

const mobileNavItems = [
  { path: '/dashboard', label: 'Дашборд', icon: <LayoutDashboard size={18} /> },
  { path: '/scan', label: 'Скан', icon: <Scan size={18} /> },
  { path: '/profile', label: 'Профиль', icon: <User size={18} /> },
];

export const Layout = () => {
  return (
    <div className="min-h-screen bg-base text-text-primary">
      <Sidebar />
      <main className="min-h-screen p-5 pb-24 lg:ml-64 lg:p-8">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-3 border-t border-white/[0.07] bg-surface/95 backdrop-blur lg:hidden">
        {mobileNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="smooth-transition flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium text-text-muted hover:text-white"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};
