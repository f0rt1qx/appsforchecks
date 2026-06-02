import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-base text-text-primary flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};
