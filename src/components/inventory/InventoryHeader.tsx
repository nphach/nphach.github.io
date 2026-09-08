import type { ReactNode } from "react";

type InventoryHeaderProps = {
  title: string;
  titleId: string;
  subtitle: ReactNode;
  stats: ReactNode;
};

export function InventoryHeader({
  title,
  titleId,
  subtitle,
  stats,
}: InventoryHeaderProps) {
  return (
    <header className="lcdInventoryHeader">
      <div className="lcdInventoryHeaderPrimary">
        <h2 className="lcdSectionTitle lcdInventoryHeaderTitle" id={titleId}>
          {title}
        </h2>
        <p className="lcdInventoryHeaderSub">{subtitle}</p>
      </div>
      <div className="lcdInventoryHeaderStats">{stats}</div>
    </header>
  );
}
