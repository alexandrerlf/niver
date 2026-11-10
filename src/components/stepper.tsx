import { Icon } from "@/components/icons";

const STEPS = ["Modelo", "Dados da festa", "Publicar"];

export function Stepper({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol className="flex items-center gap-2 text-sm font-semibold" aria-label="Etapas">
      {STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step}
            aria-current={active ? "step" : undefined}
            className={`flex items-center gap-2 ${index > 0 ? "before:mr-0.5 before:h-px before:w-4 before:bg-line sm:before:w-8" : ""}`}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs ${
                active
                  ? "bg-coral text-on-coral"
                  : done
                    ? "bg-leaf/15 text-leaf"
                    : "bg-sunken text-muted"
              }`}
            >
              {done ? <Icon name="check" className="size-3.5" /> : index + 1}
            </span>
            <span className={active ? "text-ink" : "text-muted max-sm:sr-only"}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}
