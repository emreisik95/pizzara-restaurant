import { db, getSetting, setSetting } from "./db";

export function ensureSeed() {
  if (getSetting("seeded") === "1") return;

  const insertCat = db.prepare(
    "INSERT OR IGNORE INTO categories(slug, name, sort_order) VALUES(?,?,?)"
  );
  const cats: [string, string, number][] = [
    ["tumu", "Tümü", 0],
    ["makarna", "Makarna", 1],
    ["pizza", "Pizza", 2],
    ["atistirmalik", "Atıştırmalık", 3],
    ["icecek", "İçecek", 4],
  ];
  for (const c of cats) insertCat.run(...c);

  const insertItem = db.prepare(
    "INSERT INTO menu_items(name, description, price, category_slug, image, sort_order) VALUES(?,?,?,?,?,?)"
  );
  const items: [string, string, number, string, string, number][] = [
    [
      "Arancini Topları",
      "Acılı pirinç, mozzarella, parmesan ve marinara soslu, çıtır lezzet topları.",
      320,
      "atistirmalik",
      "/placeholder/arancini.jpg",
      0,
    ],
    [
      "Fettucine Bolognese",
      "Bolonez sos, taze fettucine, parmesan peyniri.",
      320,
      "makarna",
      "/placeholder/fettucine.jpg",
      1,
    ],
    [
      "Margherita Pizza",
      "San marzano domates sos, mozzarella, fesleğen, zeytinyağı.",
      360,
      "pizza",
      "/placeholder/margherita.jpg",
      2,
    ],
    [
      "Quattro Formaggi",
      "Dört peynir karışımı; mozzarella, gorgonzola, parmesan, fontina.",
      420,
      "pizza",
      "/placeholder/quattro.jpg",
      3,
    ],
    [
      "Penne Arrabiata",
      "Acı domates sos, sarımsak, kırmızı biber, taze fesleğen.",
      290,
      "makarna",
      "/placeholder/penne.jpg",
      4,
    ],
    [
      "Bruschetta Pomodoro",
      "Izgara ekmek, domates, sarımsak, taze fesleğen, zeytinyağı.",
      180,
      "atistirmalik",
      "/placeholder/bruschetta.jpg",
      5,
    ],
    [
      "Ev Yapımı Limonata",
      "Taze limon, nane, bir tutam tuz.",
      90,
      "icecek",
      "/placeholder/limonata.jpg",
      6,
    ],
    [
      "Espresso",
      "Tek shot, italyan stili.",
      60,
      "icecek",
      "/placeholder/espresso.jpg",
      7,
    ],
  ];
  for (const it of items) insertItem.run(...it);

  setSetting("hero_eyebrow", "PIZZARA RESTAURANT");
  setSetting("hero_title", "İYİ MALZEME\nGERÇEK LEZZET");
  setSetting(
    "hero_subtitle",
    "Taze malzemeler, ustaca dokunuşlar. Her tabakta gerçek İtalyan ruhu."
  );
  setSetting("hero_image", "/placeholder/hero.jpg");
  setSetting("address", "Bağdat Cad. No:172, Kadıköy / İstanbul");
  setSetting("phone", "+90 545 116 41 42");
  setSetting("instagram", "@pizzararestaurant");
  setSetting("hours", "Her gün 12:00 - 23:00");
  setSetting("reservation_enabled", "1");

  setSetting("seeded", "1");
}
