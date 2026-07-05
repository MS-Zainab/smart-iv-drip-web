const SectionCard = ({ title, children, actionText }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        {actionText && (
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            {actionText}
          </button>
        )}
      </div>

      {children}
    </div>
  );
};

export default SectionCard;