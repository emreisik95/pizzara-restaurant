import { listReservations } from "@/lib/db";
import { ReservationActions } from "./ReservationActions";

export const dynamic = "force-dynamic";

function statusClasses(status: string) {
  if (status === "confirmed") return "bg-bosco text-crema";
  if (status === "cancelled") return "bg-rosso text-crema";
  return "bg-ink/10 text-ink/70";
}

function statusLabel(status: string) {
  if (status === "confirmed") return "Onaylı";
  if (status === "cancelled") return "İptal";
  return "Bekliyor";
}

export default function ReservationsPage() {
  const rows = listReservations();
  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl uppercase text-rosso mb-1">Rezervasyonlar</h1>
      <p className="font-serif italic text-bosco-700 mb-5 text-sm sm:text-base">{rows.length} kayıt</p>

      {/* Mobile cards */}
      <ul className="grid gap-3 md:hidden">
        {rows.map((r) => (
          <li
            key={r.id}
            className="rounded-2xl bg-crema p-4 ring-1 ring-ink/5 shadow-[0_18px_40px_-28px_rgba(20,12,8,0.4)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display uppercase tracking-tight text-lg leading-tight">{r.name}</p>
                <a
                  href={`tel:${r.phone}`}
                  className="text-sm text-bosco-700 underline underline-offset-2"
                >
                  {r.phone}
                </a>
              </div>
              <span
                className={`text-[10px] uppercase font-semibold tracking-[0.2em] px-2.5 py-1 rounded-full shrink-0 ${statusClasses(r.status)}`}
              >
                {statusLabel(r.status)}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-ink/55 col-span-2 -mb-1">
                Tarih
              </dt>
              <dd className="col-span-2 font-medium">
                {new Date(r.date).toLocaleString("tr-TR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </dd>
              <div className="col-span-1">
                <dt className="text-[10px] uppercase tracking-[0.2em] text-ink/55">Kişi</dt>
                <dd className="font-medium">{r.guests}</dd>
              </div>
              {r.note && (
                <div className="col-span-2">
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-ink/55 mt-1">Not</dt>
                  <dd className="text-ink/75 text-sm">{r.note}</dd>
                </div>
              )}
            </dl>
            <div className="mt-3 -mx-1 flex flex-wrap gap-1.5">
              <ReservationActions id={r.id} status={r.status} />
            </div>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="rounded-2xl bg-crema p-10 text-center text-ink/55 font-serif italic ring-1 ring-ink/5">
            Henüz rezervasyon yok.
          </li>
        )}
      </ul>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl ring-1 ring-ink/5 bg-crema shadow-[0_18px_40px_-28px_rgba(20,12,8,0.4)]">
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
                <td className="p-3">
                  <a href={`tel:${r.phone}`} className="underline hover:text-rosso">
                    {r.phone}
                  </a>
                </td>
                <td className="p-3">{new Date(r.date).toLocaleString("tr-TR")}</td>
                <td className="p-3">{r.guests}</td>
                <td className="p-3 max-w-[220px] truncate text-ink/70">{r.note}</td>
                <td className="p-3">
                  <span
                    className={`text-[10px] uppercase font-semibold tracking-[0.2em] px-2.5 py-1 rounded-full ${statusClasses(r.status)}`}
                  >
                    {statusLabel(r.status)}
                  </span>
                </td>
                <td className="p-3">
                  <ReservationActions id={r.id} status={r.status} />
                </td>
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
