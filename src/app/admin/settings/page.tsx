import { getSetting } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

const KEYS = [
  ["hero_eyebrow", "Logo / Marka", "input"],
  ["hero_title", "Hero Başlık (Satırlar için Enter)", "textarea"],
  ["hero_subtitle", "Hero Alt Metin", "textarea"],
  ["hero_image", "Hero Görseli", "image"],
  ["address", "Adres", "input"],
  ["phone", "Telefon", "input"],
  ["instagram", "Instagram", "input"],
  ["hours", "Çalışma Saatleri", "input"],
  ["reservation_enabled", "Rezervasyon Bölümünü Göster", "toggle"],
] as const;

export default function SettingsPage() {
  const values: Record<string, string> = {};
  for (const [k, , t] of KEYS) values[k] = getSetting(k, t === "toggle" ? "1" : "");
  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl uppercase text-rosso mb-1">Site Ayarları</h1>
      <p className="font-serif italic text-bosco-700 mb-6">Hero, iletişim ve çalışma saatleri buradan güncellenir.</p>
      <SettingsForm initial={values} fields={KEYS as unknown as [string, string, string][]} />
    </div>
  );
}
