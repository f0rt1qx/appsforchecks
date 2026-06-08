import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Scan, User } from 'lucide-react';
import { useAppStore } from '@/store';

const navItems = [
  { path: '/dashboard', label: 'Дашборд', icon: <LayoutDashboard size={20} /> },
  { path: '/scan', label: 'Сканировать чек', icon: <Scan size={20} /> },
  { path: '/profile', label: 'Профиль', icon: <User size={20} /> },
];

export const Sidebar = () => {
  const location = useLocation();
  const logout = useAppStore((state) => state.logout);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-white/[0.07] bg-surface lg:flex">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Scan size={20} />
          </div>
          <div>
            <span className="text-white">Receipt</span>
            <span className="text-light">Scanner</span>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 py-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`smooth-transition relative flex items-center gap-3 rounded-xl px-4 py-3 ${
                isActive
                  ? 'bg-elevated text-white'
                  : 'text-text-muted hover:bg-elevated/50 hover:text-white'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.07] p-4">
        <Link
          to="/login"
          onClick={logout}
          className="smooth-transition flex items-center gap-3 rounded-xl px-4 py-3 text-text-muted hover:bg-elevated/50 hover:text-white"
        >
          <LogOut size={20} />
          <span className="font-medium">Выйти</span>
        </Link>
      </div>
    </aside>
  );
};
