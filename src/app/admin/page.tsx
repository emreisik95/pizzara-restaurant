import { listCategories, listMenu } from "@/lib/db";
import { ensureSeed } from "@/lib/seed";
import { MenuAdmin } from "./MenuAdmin";

export const dynamic = "force-dynamic";

export default function AdminHome() {
  ensureSeed();
  const cats = listCategories();
  const items = listMenu(false);
  return (
    <div>
      <h1 className="font-display text-3xl mb-4">Menü Yönetimi</h1>
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
