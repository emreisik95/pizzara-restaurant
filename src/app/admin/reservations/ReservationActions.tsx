"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function ReservationActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  async function update(next: string) {
    await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    start(() => router.refresh());
  }

  async function remove() {
    if (!confirm("Silinsin mi?")) return;
    await fetch(`/api/admin/reservations/${id}`, { method: "DELETE" });
    start(() => router.refresh());
  }

  return (
    <div className="flex gap-1 items-center">
      {status !== "confirmed" && (
        <button onClick={() => update("confirmed")} className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] bg-bosco/15 text-bosco-700 hover:bg-bosco/25">Onayla</button>
      )}
      {status !== "cancelled" && (
        <button onClick={() => update("cancelled")} className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] bg-ink/10 hover:bg-ink/15">İptal</button>
      )}
      <button onClick={remove} className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] bg-rosso/15 text-rosso-700 hover:bg-rosso/25">Sil</button>
      {pending && <span className="text-xs text-ink/50">...</span>}
    </div>
  );
}
