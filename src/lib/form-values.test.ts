import { describe, expect, it } from "vitest";
import { parseDetails } from "@/lib/invitation";
import { formError } from "@/lib/form-values";

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("erro de formulário", () => {
  const filled = {
    child_name: "Lia",
    age: "6",
    event_date: "2026-10-11",
    event_time: "15:00",
    location_name: "Buffet",
    maps_url: "",
    message: "Venha!",
    gifts: "Livros\nBlocos",
    rsvp_deadline: "2026-10-12",
  };

  it("mantém o que foi digitado e limpa só o campo com erro", () => {
    const data = form(filled);
    const parsed = parseDetails(data);
    expect(parsed.success).toBe(false);
    const state = formError(data, parsed.error!);
    expect(state.error).toBe("O prazo de confirmação precisa ser até o dia da festa.");
    expect(state.field).toBe("rsvp_deadline");
    expect(state.values).toMatchObject({ child_name: "Lia", event_date: "2026-10-11", gifts: "Livros\nBlocos" });
    expect(state.values).not.toHaveProperty("rsvp_deadline");
  });

  it("mantém a caixa marcada", () => {
    const data = form({ ...filled, child_name: "", rsvp_deadline: "", guardian_consent: "on" });
    const state = formError(data, parseDetails(data).error!);
    expect(state.field).toBe("child_name");
    expect(state.values?.guardian_consent).toBe("on");
    expect(state.values).not.toHaveProperty("child_name");
  });
});
