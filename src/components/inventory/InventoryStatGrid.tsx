type InventoryStat = {
  label: string;
  value: string;
};

type InventoryStatGridProps = {
  stats: readonly InventoryStat[];
};

export function InventoryStatGrid({ stats }: InventoryStatGridProps) {
  return (
    <dl className="lcdInventoryStatGrid">
      {stats.map((stat) => (
        <div key={stat.label} className="lcdInventoryStat">
          <dt className="lcdInventoryStatLabel">{stat.label}</dt>
          <dd className="lcdInventoryStatValue">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
