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
    <div className="flex gap-1">
      {status !== "confirmed" && (
        <button onClick={() => update("confirmed")} className="rounded px-2 py-1 text-xs bg-emerald-500/30 hover:bg-emerald-500/50">Onayla</button>
      )}
      {status !== "cancelled" && (
        <button onClick={() => update("cancelled")} className="rounded px-2 py-1 text-xs bg-cream/10 hover:bg-cream/20">İptal</button>
      )}
      <button onClick={remove} className="rounded px-2 py-1 text-xs bg-red-500/30 hover:bg-red-500/50">Sil</button>
      {pending && <span className="text-xs text-cream/60">...</span>}
    </div>
  );
}
