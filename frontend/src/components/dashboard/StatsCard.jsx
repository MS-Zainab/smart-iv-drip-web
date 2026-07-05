function StatsCard({ title, value, subtitle, color = "bg-cyan-500" }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-2">{subtitle}</p>}
        </div>

        <div className={`w-12 h-12 rounded-2xl ${color} opacity-90`} />
      </div>
    </div>
  );
}

export default StatsCard;