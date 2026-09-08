import { StatusPill } from "./status-pill";

export type MetaRow = { label: string; value: string };

export function ObjectCard({
  kind,
  title,
  summary,
  status,
  meta = [],
}: {
  kind: string;
  title: string;
  summary: string;
  status: string;
  meta?: MetaRow[];
}) {
  return (
    <article className="card">
      <div>
        <div className="card-top">
          <div className="eyebrow">{kind}</div>
          <StatusPill state={status} />
        </div>
        <h3>{title}</h3>
        <p>{summary}</p>
      </div>
      {meta.length > 0 && (
        <dl className="meta">
          {meta.map((row) => (
            <div className="meta-row" key={`${row.label}-${row.value}`}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}
