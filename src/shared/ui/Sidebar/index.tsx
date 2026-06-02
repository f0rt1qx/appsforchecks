import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Scan, User, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Дашборд', icon: <LayoutDashboard size={20} /> },
    { path: '/scanner', label: 'Сканировать чек', icon: <Scan size={20} /> },
    { path: '/profile', label: 'Профиль', icon: <User size={20} /> },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-[rgba(255,255,255,0.07)] flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <div className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Scan size={20} />
          </div>
          <div>
            <span className="text-white">Receipt</span>
            <span className="text-light">Scanner</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl smooth-transition relative ${
                isActive 
                  ? 'text-white bg-elevated' 
                  : 'text-text-muted hover:text-white hover:bg-elevated/50'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[rgba(255,255,255,0.07)]">
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-white hover:bg-elevated/50 smooth-transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Выйти</span>
        </Link>
      </div>
    </aside>
  );
};
