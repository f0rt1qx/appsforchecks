export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-gray-200 p-4 text-center text-sm text-gray-500 mt-auto">
      <div className="container mx-auto max-w-5xl">
        &copy; {new Date().getFullYear()} Receipt Scanner. All rights reserved.
      </div>
    </footer>
  );
};
