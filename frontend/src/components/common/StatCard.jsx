const StatCard = ({ title, value, subtitle, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
  };

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${colorClasses[color]} bg-white`}
    >
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-3 text-3xl font-bold text-slate-800">{value}</h3>
      {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
};

export default StatCard;