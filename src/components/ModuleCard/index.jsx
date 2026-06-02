export const ModuleCard = ({ icon, title, description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-surface border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 hover:bg-elevated smooth-transition cursor-pointer group"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white smooth-transition">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-text-muted text-sm">{description}</p>
    </div>
  );
};
