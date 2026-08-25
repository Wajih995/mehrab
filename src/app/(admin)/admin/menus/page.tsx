import { MenuManager } from "@/components/admin/menu-manager";
import { getMainNav } from "@/lib/repositories/navigation";

export const dynamic = "force-dynamic";

export default async function AdminMenusPage() {
  const nav = await getMainNav();
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl">Menus</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit the storefront&apos;s main navigation — menus, dropdown columns
          and links. Changes go live as soon as you save.
        </p>
      </div>
      <MenuManager initialNav={nav} />
    </div>
  );
}
