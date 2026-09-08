export function StatusPill({ state }: { state: string }) {
  return <span className="status" data-state={state.toLowerCase()}>{state}</span>;
}
