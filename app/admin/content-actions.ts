"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { slugify } from "@/lib/admin/validate";
import { StorageUnavailableError } from "@/lib/events/store";
import { contentTag, readCollection, undoCollection, writeCollection } from "@/lib/content";
import { collectionSpec } from "@/lib/content/schema";
import { readContentForm, toContentItem, validateContent, validateCross, type ContentErrors, type ContentFormValues } from "@/lib/content/validate";
import { EVENTS_TAG } from "@/lib/events";

export interface ContentFormState {
  error?: string;
  fieldErrors?: ContentErrors;
  values?: ContentFormValues;
}

/** Every public page reads through the content cache, and most are prerendered. */
function refresh(key: string): void {
  updateTag(contentTag(key));
  // Weekly sessions are also events: refresh the events cache and calendar feed.
  if (key === "weekly") updateTag(EVENTS_TAG);
  revalidatePath("/", "layout");
}

function specOrThrow(key: string) {
  const spec = collectionSpec(key);
  if (!spec) throw new Error("Unknown collection");
  return spec;
}

function failure(err: unknown, key: string): string {
  if (err instanceof StorageUnavailableError) return err.message;
  console.error(`[admin] ${key} save failed:`, err);
  return "Saving failed — nothing was changed. Try again in a moment.";
}

export async function saveContentItem(_prev: ContentFormState, form: FormData): Promise<ContentFormState> {
  await requireAdmin();
  const key = String(form.get("collection") ?? "");
  const spec = specOrThrow(key);

  const values = readContentForm(spec, form);
  const fieldErrors = validateCross(spec, values, validateContent(spec, values));
  if (Object.keys(fieldErrors).length) return { error: "Some details need fixing.", fieldErrors, values };

  try {
    // Read storage directly, not the cache: saving from a stale list could
    // quietly undo someone else's change made a minute ago.
    const { items } = await readCollection(key);
    const editingId = String(form.get("id") ?? "").trim();
    let id: string;
    if (spec.single) {
      id = items[0]?.id ?? key;
    } else if (editingId) {
      if (!items.some(i => i.id === editingId)) return { error: "That entry no longer exists — someone may have deleted it.", values };
      id = editingId;
    } else {
      const base = slugify(String(values[spec.titleField] ?? "")) || spec.key;
      id = base;
      for (let n = 2; items.some(i => i.id === id); n++) id = `${base}-${n}`;
    }
    const item = toContentItem(spec, id, values);
    const next = spec.single
      ? [item]
      : items.some(i => i.id === id) ? items.map(i => (i.id === id ? item : i)) : [...items, item];
    await writeCollection(key, next);
  } catch (err) {
    return { error: failure(err, key), values };
  }

  refresh(key);
  redirect(`/admin/content/${key}?saved=1`);
}

export async function deleteContentItem(form: FormData): Promise<void> {
  await requireAdmin();
  const key = String(form.get("collection") ?? "");
  specOrThrow(key);
  const id = String(form.get("id") ?? "");
  try {
    const { items } = await readCollection(key);
    if (items.some(i => i.id === id)) await writeCollection(key, items.filter(i => i.id !== id));
  } catch (err) {
    failure(err, key);
    redirect(`/admin/content/${key}?error=1`);
  }
  refresh(key);
  redirect(`/admin/content/${key}?deleted=1`);
}

export async function moveContentItem(form: FormData): Promise<void> {
  await requireAdmin();
  const key = String(form.get("collection") ?? "");
  specOrThrow(key);
  const id = String(form.get("id") ?? "");
  const step = form.get("dir") === "up" ? -1 : 1;
  try {
    const { items } = await readCollection(key);
    const i = items.findIndex(x => x.id === id);
    const j = i + step;
    if (i >= 0 && j >= 0 && j < items.length) {
      const next = [...items];
      [next[i], next[j]] = [next[j], next[i]];
      await writeCollection(key, next);
    }
  } catch (err) {
    failure(err, key);
    redirect(`/admin/content/${key}?error=1`);
  }
  refresh(key);
  redirect(`/admin/content/${key}`);
}

export async function undoContent(form: FormData): Promise<void> {
  await requireAdmin();
  const key = String(form.get("collection") ?? "");
  specOrThrow(key);
  let ok = false;
  try {
    ok = await undoCollection(key);
  } catch (err) {
    failure(err, key);
    redirect(`/admin/content/${key}?error=1`);
  }
  refresh(key);
  redirect(`/admin/content/${key}?${ok ? "undone=1" : "error=1"}`);
}
