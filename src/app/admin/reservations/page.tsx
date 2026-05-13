import { listReservations } from "@/lib/db";
import { ReservationActions } from "./ReservationActions";

export const dynamic = "force-dynamic";

export default function ReservationsPage() {
  const rows = listReservations();
  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl uppercase text-rosso mb-1">Rezervasyonlar</h1>
      <p className="font-serif italic text-bosco-700 mb-6">{rows.length} kayıt</p>

      <div className="overflow-x-auto rounded-2xl ring-1 ring-ink/5 bg-crema shadow-[0_18px_40px_-28px_rgba(20,12,8,0.4)]">
        <table className="w-full text-sm">
          <thead className="bg-bosco text-crema text-[11px] uppercase tracking-[0.18em]">
            <tr>
              <th className="text-left p-3">Ad</th>
              <th className="text-left p-3">Telefon</th>
              <th className="text-left p-3">Tarih</th>
              <th className="text-left p-3">Kişi</th>
              <th className="text-left p-3">Not</th>
              <th className="text-left p-3">Durum</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-ink/5">
                <td className="p-3 font-semibold">{r.name}</td>
                <td className="p-3"><a href={`tel:${r.phone}`} className="underline hover:text-rosso">{r.phone}</a></td>
                <td className="p-3">{new Date(r.date).toLocaleString("tr-TR")}</td>
                <td className="p-3">{r.guests}</td>
                <td className="p-3 max-w-[220px] truncate text-ink/70">{r.note}</td>
                <td className="p-3">
                  <span className={`text-[10px] uppercase font-semibold tracking-[0.2em] px-2.5 py-1 rounded-full ${
                    r.status === "confirmed" ? "bg-bosco text-crema" :
                    r.status === "cancelled" ? "bg-rosso text-crema" : "bg-ink/10 text-ink/70"
                  }`}>{r.status}</span>
                </td>
                <td className="p-3"><ReservationActions id={r.id} status={r.status} /></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-ink/50 font-serif italic">
                  Henüz rezervasyon yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
