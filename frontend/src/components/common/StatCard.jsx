const StatCard = ({ title, value, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "border-blue-200",
    green: "border-green-200",
    red: "border-red-200",
    purple: "border-purple-200",
    yellow: "border-yellow-200",
  };

  return (
    <div
      className={`
        bg-white
        rounded-2xl
        border
        shadow-sm
        p-4 sm:p-5
        ${colorClasses[color]}
      `}
    >
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-800">
        {value}
      </h3>

      {subtitle && (
        <p className="mt-2 text-sm text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;