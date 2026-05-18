import { getSetting } from "@/lib/db";
import { THEME_DEFAULTS, THEME_KEYS } from "@/lib/theme";
import { SettingsForm, type SettingsField } from "./SettingsForm";

export const dynamic = "force-dynamic";

const FIELDS: SettingsField[] = [
  { key: "hero_eyebrow", label: "Logo / Marka", type: "input", section: "Marka & Hero" },
  { key: "hero_title", label: "Hero Başlık (satır için Enter)", type: "textarea", section: "Marka & Hero" },
  { key: "hero_subtitle", label: "Hero Alt Metin", type: "textarea", section: "Marka & Hero" },
  { key: "hero_image", label: "Hero Görseli", type: "image", section: "Marka & Hero" },

  { key: "address", label: "Adres", type: "input", section: "İletişim" },
  { key: "phone", label: "Telefon", type: "input", section: "İletişim" },
  { key: "instagram", label: "Instagram", type: "input", section: "İletişim" },
  { key: "hours", label: "Çalışma Saatleri", type: "input", section: "İletişim" },

  { key: "reservation_enabled", label: "Rezervasyon Bölümünü Göster", type: "toggle", section: "Rezervasyon" },

  { key: "theme_primary", label: "Birincil (Kırmızı)", type: "color", section: "Tema Renkleri", help: "Butonlar, vurgular, başlıklar." },
  { key: "theme_primary_dark", label: "Birincil - Koyu", type: "color", section: "Tema Renkleri", help: "Hover ve gölgeler." },
  { key: "theme_secondary", label: "İkincil (Yeşil)", type: "color", section: "Tema Renkleri", help: "Yan panel, ikinci kategori." },
  { key: "theme_secondary_dark", label: "İkincil - Koyu", type: "color", section: "Tema Renkleri" },
  { key: "theme_bg", label: "Arka Plan (Krema)", type: "color", section: "Tema Renkleri", help: "Kart yüzeyleri." },
  { key: "theme_bg_light", label: "Arka Plan - Açık", type: "color", section: "Tema Renkleri", help: "Sayfa arka planı." },
  { key: "theme_text", label: "Metin (Mürekkep)", type: "color", section: "Tema Renkleri" },
];

export default function SettingsPage() {
  const values: Record<string, string> = {};
  for (const f of FIELDS) {
    if (f.type === "toggle") values[f.key] = getSetting(f.key, "1");
    else values[f.key] = getSetting(f.key, "");
  }
  for (const k of THEME_KEYS) {
    if (!values[k]) values[k] = THEME_DEFAULTS[k];
  }
  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl uppercase text-rosso mb-1">Site Ayarları</h1>
      <p className="font-serif italic text-bosco-700 mb-6 text-sm sm:text-base">
        Marka, iletişim ve tema renklerini buradan güncelle. Renkler kaydedince tüm siteye uygulanır.
      </p>
      <SettingsForm initial={values} fields={FIELDS} />
    </div>
  );
}
