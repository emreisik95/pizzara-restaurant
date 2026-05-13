import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { headers } from "next/headers";
import { AdminShell } from "./AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") || "";
  const session = await readSession();
  const isLogin = pathname.endsWith("/admin/login");

  if (!session && !isLogin) redirect("/admin/login");

  if (isLogin || !session) {
    return (
      <div className="min-h-screen bg-bosco text-crema flex items-center justify-center px-4">
        {children}
      </div>
    );
  }

  return <AdminShell pathname={pathname}>{children}</AdminShell>;
}
