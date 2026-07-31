/** Shared upload validation used by every admin upload surface. */

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const DOC_TYPES = ["application/pdf"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const ALLOWED_EXTENSIONS = [
  "jpg", "jpeg", "png", "webp", "gif", "avif",
  "pdf", "mp4", "webm", "mov",
];

const BLOCKED_EXTENSIONS = [
  "exe", "sh", "bat", "cmd", "com", "msi", "js", "mjs", "php", "py", "rb",
  "jar", "dll", "so", "bin", "app", "scr", "ps1", "html", "htm", "svg",
];

export const MAX_UPLOAD_BYTES = {
  image: 10 * 1024 * 1024,
  document: 15 * 1024 * 1024,
  video: 100 * 1024 * 1024,
};

export type UploadKind = "image" | "document" | "video" | "any";

/** Strips paths and unsafe characters so a filename can never traverse or execute. */
export const sanitizeFileName = (name: string) => {
  const base = name.split(/[\\/]/).pop() || "file";
  return base
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "")
    .slice(-80)
    .toLowerCase();
};

export const fileExtension = (name: string) =>
  (sanitizeFileName(name).split(".").pop() || "").toLowerCase();

/** Returns an error message, or null when the file is safe to upload. */
export const validateUpload = (file: File, kind: UploadKind = "any"): string | null => {
  const ext = fileExtension(file.name);

  if (!ext) return "File must have a valid extension";
  if (BLOCKED_EXTENSIONS.includes(ext)) return "This file type is not allowed";
  if (!ALLOWED_EXTENSIONS.includes(ext)) return `.${ext} files are not allowed`;

  const allowedTypes =
    kind === "image" ? IMAGE_TYPES
    : kind === "document" ? DOC_TYPES
    : kind === "video" ? VIDEO_TYPES
    : [...IMAGE_TYPES, ...DOC_TYPES, ...VIDEO_TYPES];

  if (!allowedTypes.includes(file.type)) return "Unsupported file type";

  const limit =
    kind === "video" ? MAX_UPLOAD_BYTES.video
    : kind === "document" ? MAX_UPLOAD_BYTES.document
    : kind === "image" ? MAX_UPLOAD_BYTES.image
    : MAX_UPLOAD_BYTES.video;

  if (file.size <= 0) return "File is empty";
  if (file.size > limit) return `File is too large (max ${Math.round(limit / 1024 / 1024)}MB)`;

  return null;
};

/** Collision-free, sanitized storage path. */
export const buildStoragePath = (folder: string, fileName: string) => {
  const ext = fileExtension(fileName);
  const safeFolder = folder.replace(/[^a-z0-9_-]/gi, "");
  return `${safeFolder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
};
