import type { FormState } from "@/app/actions";

export function FormFeedback({ state }: { state: FormState }) {
  return (
    <>
      {state.error && (
        <p role="alert" className="mb-3 text-sm font-semibold text-danger">
          {state.error}
        </p>
      )}
      {state.notice && (
        <p role="status" className="mb-3 text-sm font-semibold text-leaf">
          {state.notice}
        </p>
      )}
    </>
  );
}
