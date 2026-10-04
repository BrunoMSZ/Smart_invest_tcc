export const PRESENCE_KEY = "smartinvest_presence";
export const PRESENCE_EVENT = "smartinvest:presence";

export const presenceOptions = [
  { id: "disponivel", label: "Disponível", dot: "bg-emerald-500" },
  { id: "ausente", label: "Ausente", dot: "bg-orange-500" },
  { id: "ocupado", label: "Ocupado", dot: "bg-red-500" },
  { id: "invisivel", label: "Invisível", dot: "bg-zinc-400" },
] as const;

export type PresenceId = (typeof presenceOptions)[number]["id"];

export function isPresenceId(value: string | null | undefined): value is PresenceId {
  return presenceOptions.some((option) => option.id === value);
}

export function presenceDot(id: string | null | undefined) {
  return presenceOptions.find((option) => option.id === id)?.dot || "bg-emerald-500";
}

export function presenceLabel(id: string | null | undefined) {
  return presenceOptions.find((option) => option.id === id)?.label || "Disponível";
}

export function readPresence(): PresenceId {
  if (typeof window === "undefined") return "disponivel";
  const saved = localStorage.getItem(PRESENCE_KEY);
  return isPresenceId(saved) ? saved : "disponivel";
}

export function writePresence(id: PresenceId) {
  localStorage.setItem(PRESENCE_KEY, id);
  window.dispatchEvent(new CustomEvent(PRESENCE_EVENT, { detail: id }));
}
