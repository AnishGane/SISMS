const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="border-base-300 bg-base-100/80 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all"
      style={{
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <p className="text-base-content/70 mb-1 text-sm font-semibold">{label}</p>

      <p className="text-base-content text-base font-bold">{payload[0].value} units</p>
    </div>
  );
};

export default CustomTooltip;
