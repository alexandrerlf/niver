import type { FormState } from "@/app/actions";
import { Icon } from "@/components/icons";

export function ErrorMessage({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p
      role="alert"
      className={`flex animate-rise items-start gap-2 rounded-2xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger ${className}`}
    >
      <Icon name="alert" className="mt-px size-[18px]" />
      {children}
    </p>
  );
}

export function NoticeMessage({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p
      role="status"
      className={`flex animate-rise items-start gap-2 rounded-2xl bg-leaf/10 px-4 py-3 text-sm font-semibold text-leaf ${className}`}
    >
      <Icon name="check" className="mt-px size-[18px]" />
      {children}
    </p>
  );
}

export function FormFeedback({ state, className = "" }: { state: FormState; className?: string }) {
  return (
    <div className={`space-y-2 empty:hidden ${className}`}>
      {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
      {state.notice && <NoticeMessage>{state.notice}</NoticeMessage>}
    </div>
  );
}
