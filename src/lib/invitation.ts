import { z } from "zod";

export const ART_BUCKET = "invitation-art";
export const MAX_ART_BYTES = 8 * 1024 * 1024;
export const ART_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type InvitationStatus = "draft" | "published";

export type Invitation = {
  id: string;
  owner_id: string;
  slug: string;
  status: InvitationStatus;
  child_name: string;
  age: number | null;
  event_date: string | null;
  event_time: string | null;
  location_name: string;
  maps_url: string | null;
  message: string;
  gifts: string[];
  image_path: string | null;
  html_template: string | null;
  template_id: string | null;
  created_at: string;
  updated_at: string;
};

export const PUBLIC_COLUMNS =
  "id, slug, status, child_name, age, event_date, event_time, location_name, maps_url, message, gifts, image_path, html_template";

export type PublicInvitation = Pick<
  Invitation,
  | "id"
  | "slug"
  | "status"
  | "child_name"
  | "age"
  | "event_date"
  | "event_time"
  | "location_name"
  | "maps_url"
  | "message"
  | "gifts"
  | "image_path"
  | "html_template"
>;

export const detailsSchema = z.object({
  child_name: z.string().trim().min(1, "Informe o nome.").max(120),
  age: z.coerce.number().int().min(0).max(120).nullable(),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data."),
  event_time: z.string().regex(/^[0-2]\d:[0-5]\d$/, "Informe o horário."),
  location_name: z.string().trim().min(1, "Informe o local.").max(200),
  maps_url: z
    .union([z.literal(""), z.url({ protocol: /^https$/, error: "Use um link https." })])
    .transform((value) => value || null),
  message: z.string().trim().max(500),
  gifts: z.array(z.string().trim().min(1).max(160)).max(20),
});

export type Details = z.infer<typeof detailsSchema>;

export function parseDetails(form: FormData) {
  const age = String(form.get("age") ?? "").trim();
  return detailsSchema.safeParse({
    child_name: form.get("child_name"),
    age: age === "" ? null : age,
    event_date: form.get("event_date"),
    event_time: form.get("event_time"),
    location_name: form.get("location_name"),
    maps_url: String(form.get("maps_url") ?? "").trim(),
    message: form.get("message") ?? "",
    gifts: String(form.get("gifts") ?? "")
      .split("\n")
      .map((gift) => gift.trim())
      .filter(Boolean),
  });
}

export function hasEventDetails(invitation: Invitation) {
  return Boolean(
    invitation.child_name &&
      invitation.event_date &&
      invitation.event_time &&
      invitation.location_name,
  );
}

export function makeSlug(name: string, age: number | null, random: string) {
  const base = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return [base || "convite", age === null ? null : `${age}-anos`, random].filter(Boolean).join("-");
}
