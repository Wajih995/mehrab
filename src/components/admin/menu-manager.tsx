"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { saveMainNav } from "@/actions/navigation";
import type { MegaMenuSection } from "@/types";

type MenuColumn = NonNullable<MegaMenuSection["columns"]>[number];

/**
 * Admin editor for the storefront main navigation.
 *
 * Works on a local draft of MegaMenuSection[]; "Save menu" persists it via a
 * Server Action (demo store or DB) and the storefront header re-renders with
 * the new structure on the next request.
 */
export function MenuManager({
  initialNav,
}: {
  initialNav: MegaMenuSection[];
}) {
  const router = useRouter();
  const [sections, setSections] = useState<MegaMenuSection[]>(() =>
    structuredClone(initialNav)
  );
  const [pending, startTransition] = useTransition();

  /* ── immutable draft updates ─────────────────────────────── */

  const patchSection = (si: number, patch: Partial<MegaMenuSection>) =>
    setSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, ...patch } : s))
    );

  const moveSection = (si: number, dir: -1 | 1) =>
    setSections((prev) => {
      const ti = si + dir;
      if (ti < 0 || ti >= prev.length) return prev;
      const next = [...prev];
      [next[si], next[ti]] = [next[ti], next[si]];
      return next;
    });

  const removeSection = (si: number) =>
    setSections((prev) => prev.filter((_, i) => i !== si));

  const addSection = () =>
    setSections((prev) => [
      ...prev,
      { label: "New Menu", href: "/", columns: [] },
    ]);

  const patchColumn = (si: number, ci: number, patch: Partial<MenuColumn>) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === si
          ? {
              ...s,
              columns: s.columns?.map((c, j) =>
                j === ci ? { ...c, ...patch } : c
              ),
            }
          : s
      )
    );

  const removeColumn = (si: number, ci: number) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, columns: s.columns?.filter((_, j) => j !== ci) } : s
      )
    );

  const addColumn = (si: number) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === si
          ? {
              ...s,
              columns: [
                ...(s.columns ?? []),
                { heading: "New Column", items: [] },
              ],
            }
          : s
      )
    );

  const patchItem = (
    si: number,
    ci: number,
    ii: number,
    patch: Partial<{ label: string; href: string }>
  ) =>
    patchColumn(si, ci, {
      items: sections[si].columns![ci].items.map((it, k) =>
        k === ii ? { ...it, ...patch } : it
      ),
    });

  const removeItem = (si: number, ci: number, ii: number) =>
    patchColumn(si, ci, {
      items: sections[si].columns![ci].items.filter((_, k) => k !== ii),
    });

  const addItem = (si: number, ci: number) =>
    patchColumn(si, ci, {
      items: [
        ...sections[si].columns![ci].items,
        { label: "New Link", href: "/" },
      ],
    });

  /* ── persist ─────────────────────────────────────────────── */

  const handleSave = () =>
    startTransition(async () => {
      const res = await saveMainNav(sections);
      if (res.ok) {
        toast.success("Menu saved — the storefront is updated");
        router.refresh();
      } else {
        toast.error(res.error ?? "Save failed");
      }
    });

  return (
    <div className="space-y-5">
      {sections.map((section, si) => (
        <div key={si} className="rounded-xl border border-border bg-background">
          {/* Section header row */}
          <div className="flex flex-wrap items-end gap-3 p-5">
            <div className="min-w-40 flex-1">
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Menu label
              </Label>
              <Input
                value={section.label}
                onChange={(e) => patchSection(si, { label: e.target.value })}
              />
            </div>
            <div className="min-w-40 flex-1">
              <Label className="mb-1.5 block text-xs text-muted-foreground">
                Link
              </Label>
              <Input
                value={section.href}
                onChange={(e) => patchSection(si, { href: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                id={`enabled-${si}`}
                checked={!section.disabled}
                onCheckedChange={(on) =>
                  patchSection(si, { disabled: !on || undefined })
                }
              />
              <Label htmlFor={`enabled-${si}`} className="text-xs">
                {section.disabled ? (
                  <Badge variant="outline" className="text-muted-foreground">
                    Disabled
                  </Badge>
                ) : (
                  <Badge>Live</Badge>
                )}
              </Label>
            </div>
            <div className="flex items-center gap-1 pb-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Move up"
                disabled={si === 0}
                onClick={() => moveSection(si, -1)}
              >
                <ChevronUp className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Move down"
                disabled={si === sections.length - 1}
                onClick={() => moveSection(si, 1)}
              >
                <ChevronDown className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${section.label}`}
                onClick={() => {
                  if (window.confirm(`Delete the "${section.label}" menu?`))
                    removeSection(si);
                }}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>

          {/* Dropdown columns */}
          <Separator />
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide2 text-muted-foreground">
                Dropdown columns
              </p>
              <Button variant="outline" size="sm" onClick={() => addColumn(si)}>
                <Plus className="size-3.5" /> Add column
              </Button>
            </div>

            {!section.columns?.length && (
              <p className="text-sm text-muted-foreground">
                No dropdown — this menu is a plain link.
              </p>
            )}

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {section.columns?.map((col, ci) => (
                <div
                  key={ci}
                  className="rounded-lg border border-border/70 bg-secondary/20 p-4"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      value={col.heading}
                      onChange={(e) =>
                        patchColumn(si, ci, { heading: e.target.value })
                      }
                      className="h-8 text-xs font-medium uppercase"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      aria-label={`Delete column ${col.heading}`}
                      onClick={() => removeColumn(si, ci)}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {col.items.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-2">
                        <Input
                          value={item.label}
                          placeholder="Label"
                          onChange={(e) =>
                            patchItem(si, ci, ii, { label: e.target.value })
                          }
                          className="h-8"
                        />
                        <Input
                          value={item.href}
                          placeholder="/link"
                          onChange={(e) =>
                            patchItem(si, ci, ii, { href: e.target.value })
                          }
                          className="h-8"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          aria-label={`Remove ${item.label}`}
                          onClick={() => removeItem(si, ci, ii)}
                        >
                          <Trash2 className="size-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => addItem(si, ci)}
                    >
                      <Plus className="size-3.5" /> Add link
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {section.featured && (
              <p className="text-xs text-muted-foreground">
                This menu also shows the &ldquo;{section.featured.title}&rdquo;
                featured tile in its dropdown.
              </p>
            )}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={addSection}>
          <Plus className="size-4" /> Add menu
        </Button>
        <Button onClick={handleSave} disabled={pending}>
          {pending ? "Saving…" : "Save menu"}
        </Button>
      </div>
    </div>
  );
}
