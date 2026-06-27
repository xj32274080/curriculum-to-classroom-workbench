// Small UI helpers shared across components.

/** Clipboard write with a legacy fallback so copy works even without the API. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function isBlank(s: string | undefined | null): boolean {
  return !s || !s.trim();
}

/** Sets a value at a dotted path, returning a new object (immutable update). */
export function setByPath<T extends Record<string, unknown>>(root: T, path: string, value: unknown): T {
  const next = clone(root) as T;
  const parts = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cursor: any = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (cursor[key] === undefined) cursor[key] = {};
    cursor = cursor[key];
  }
  const last = parts[parts.length - 1];
  // Array-valued textareas (keywords, abilities, ...) are newline-separated.
  if (Array.isArray(cursor[last])) {
    cursor[last] = String(value)
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
  } else {
    cursor[last] = value;
  }
  return next;
}

/** Triggers a browser download of a Blob under the given filename. */
export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Triggers a browser download of text content as a file. */
export function downloadText(filename: string, text: string): void {
  downloadBlob(filename, new Blob([text], { type: "text/markdown;charset=utf-8" }));
}

/** Strips filename-illegal characters; keeps CJK. */
export function sanitizeFilename(name: string): string {
  return (name || "教学设计").replace(/[\\/:*?"<>|《》]/g, "").trim() || "教学设计";
}

/**
 * Extracts a clean topic name for filenames. If the topic contains a
 * 《...》 title (e.g. "《精卫填海》神话阅读"), the bracketed text ("精卫填海")
 * is used; otherwise the sanitized full topic is used.
 */
export function extractTopicName(topic: string): string {
  const match = (topic || "").match(/《([^》]+)》/);
  return sanitizeFilename(match ? match[1] : topic || "");
}
