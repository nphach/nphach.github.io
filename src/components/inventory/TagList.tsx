type TagListProps = {
  tags: readonly string[];
  label?: string;
  labelId?: string;
  ariaLabel?: string;
};

export function TagList({ tags, label, labelId, ariaLabel }: TagListProps) {
  return (
    <>
      {label ? (
        <p className="lcdInventoryDetailLabel" id={labelId}>
          {label}
        </p>
      ) : null}
      <ul
        aria-label={ariaLabel}
        aria-labelledby={labelId}
        className="lcdTagList"
      >
        {tags.map((tag) => (
          <li key={tag} className="lcdTag">
            {tag}
          </li>
        ))}
      </ul>
    </>
  );
}
