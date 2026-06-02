import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="container mx-auto max-w-5xl flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-slate-800">
          Receipt Scanner
        </Link>
        <nav className="flex gap-4">
          <Link to="/" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
          <Link to="/scanner" className="text-slate-600 hover:text-slate-900">Scanner</Link>
          <Link to="/profile" className="text-slate-600 hover:text-slate-900">Profile</Link>
          <Link to="/login" className="text-slate-600 hover:text-slate-900">Login</Link>
          <Link to="/register" className="text-slate-600 hover:text-slate-900">Register</Link>
        </nav>
      </div>
    </header>
  );
};
