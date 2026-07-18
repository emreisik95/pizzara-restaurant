import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { Reservation } from "@/components/Reservation";
import { Footer } from "@/components/Footer";
import { listCategories, listMenu, getSetting } from "@/lib/db";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default function Home() {
  ensureSeed();
  const categories = listCategories();
  const items = listMenu(true);

  const brand = getSetting("hero_eyebrow", "PIZZARA RESTAURANT");
  const reservationEnabled = getSetting("reservation_enabled", "1") === "1";
  const address = getSetting("address", "İstanbul");
  const phone = getSetting("phone", "+90 000 000 00 00");
  const instagram = getSetting("instagram", "@pizzararestaurant");
  const hours = getSetting("hours", "Her gün 12:00 - 23:00");
  const hero = {
    eyebrow: brand,
    title: getSetting("hero_title", "İYİ MALZEME\nGERÇEK LEZZET"),
    subtitle: getSetting(
      "hero_subtitle",
      "Taze malzeme, ustaca dokunuş. Her tabakta gerçek İtalyan ruhu."
    ),
    image: getSetting("hero_image", "/placeholder/hero.jpg"),
    hours,
    reservationEnabled,
  };

  return (
    <>
      <Header brand={brand} reservationEnabled={reservationEnabled} />
      <main id="main-content">
        <Hero {...hero} />
        <MenuSection
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          items={items.map((i) => ({
            id: i.id,
            name: i.name,
            description: i.description,
            price: i.price,
            category_slug: i.category_slug,
            image: i.image,
          }))}
        />
        {reservationEnabled && <Reservation />}
      </main>
      <Footer
        brand={brand}
        address={address}
        phone={phone}
        instagram={instagram}
        hours={hours}
      />
    </>
  );
}
