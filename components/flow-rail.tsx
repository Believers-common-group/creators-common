const steps = ["Creator", "Work", "Experience", "Surface"];

export function FlowRail() {
  return (
    <div className="flow" aria-label="Creators Common object flow">
      {steps.map((step, index) => (
        <div className="flow-step" key={step}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step}</strong>
        </div>
      ))}
    </div>
  );
}
