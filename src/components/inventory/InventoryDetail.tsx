import type { ReactNode } from "react";

type InventoryDetailProps = {
  label: string;
  labelId?: string;
  labelledBy?: string;
  children: ReactNode;
};

export function InventoryDetail({
  label,
  labelId,
  labelledBy,
  children,
}: InventoryDetailProps) {
  return (
    <article
      aria-labelledby={labelledBy ?? labelId}
      className="lcdInventoryDetail"
    >
      <p
        className="lcdInventoryDetailLabel lcdInventoryDetailHeader"
        id={labelId}
      >
        <span aria-hidden="true">&gt; </span>
        {label}
      </p>
      <div className="lcdInventoryDetailBody">{children}</div>
    </article>
  );
}

export function InventoryDetailSection({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="lcdInventoryDetailSection">{children}</div>;
}
