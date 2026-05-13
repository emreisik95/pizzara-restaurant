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
] as const;

export default function SettingsPage() {
  const values: Record<string, string> = {};
  for (const [k] of KEYS) values[k] = getSetting(k, "");
  return (
    <div>
      <h1 className="font-display text-3xl mb-4">Site Ayarları</h1>
      <SettingsForm initial={values} fields={KEYS as unknown as [string, string, string][]} />
    </div>
  );
}
