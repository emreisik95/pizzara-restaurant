import { listCategories, listMenu } from "@/lib/db";
import { ensureSeed } from "@/lib/seed";
import { MenuAdmin } from "./MenuAdmin";
import { CategoryAdmin } from "./CategoryAdmin";

export const dynamic = "force-dynamic";

export default function AdminHome() {
  ensureSeed();
  const cats = listCategories();
  const items = listMenu(false);
  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl uppercase text-rosso mb-1">Menü Yönetimi</h1>
      <p className="font-serif italic text-bosco-700 mb-6">Ürünleri ekle, düzenle, kategoriler arasında sırala.</p>

      <CategoryAdmin categories={cats} />

      <MenuAdmin
        categories={cats.map((c) => ({ slug: c.slug, name: c.name }))}
        items={items.map((i) => ({
          id: i.id,
          name: i.name,
          description: i.description,
          price: i.price,
          category_slug: i.category_slug,
          image: i.image,
          is_active: !!i.is_active,
          sort_order: i.sort_order,
        }))}
      />
    </div>
  );
}
