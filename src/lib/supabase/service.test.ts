import { afterEach, describe, expect, it, vi } from "vitest";
import { createServiceClient } from "@/lib/supabase/service";

describe("cliente com a chave secreta", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("aceita a chave com o nome antigo do Supabase", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://exemplo.supabase.co");
    vi.stubEnv("SUPABASE_SECRET_KEY", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "sb_secret_teste");
    expect(() => createServiceClient()).not.toThrow();
  });

  it("explica qual variável falta", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://exemplo.supabase.co");
    vi.stubEnv("SUPABASE_SECRET_KEY", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    expect(() => createServiceClient()).toThrow("SUPABASE_SECRET_KEY");
  });
});
