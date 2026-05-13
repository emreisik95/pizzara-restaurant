import { listReservations } from "@/lib/db";
import { ReservationActions } from "./ReservationActions";

export const dynamic = "force-dynamic";

export default function ReservationsPage() {
  const rows = listReservations();
  return (
    <div>
      <h1 className="font-display text-3xl mb-4">Rezervasyonlar</h1>
      <p className="text-cream/70 text-sm mb-4">{rows.length} kayıt</p>
      <div className="overflow-x-auto rounded-2xl ring-1 ring-cream/10">
        <table className="w-full text-sm">
          <thead className="bg-brand-950/60 text-cream/80 text-xs uppercase tracking-wider">
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
              <tr key={r.id} className="border-t border-cream/10">
                <td className="p-3">{r.name}</td>
                <td className="p-3"><a href={`tel:${r.phone}`} className="underline">{r.phone}</a></td>
                <td className="p-3">{new Date(r.date).toLocaleString("tr-TR")}</td>
                <td className="p-3">{r.guests}</td>
                <td className="p-3 max-w-[200px] truncate">{r.note}</td>
                <td className="p-3">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded ${
                    r.status === "confirmed" ? "bg-emerald-500/30" :
                    r.status === "cancelled" ? "bg-red-500/30" : "bg-cream/10"
                  }`}>{r.status}</span>
                </td>
                <td className="p-3"><ReservationActions id={r.id} status={r.status} /></td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-cream/60">Henüz rezervasyon yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
