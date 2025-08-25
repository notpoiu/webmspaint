import { cn } from "@/lib/utils";

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeColor(value: string): string | null {
  const v = value.trim();

  // Allow #RGB or #RRGGBB
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) return v;

  // Allow rgb(r,g,b) with 0-255 ints
  const rgbMatch =
    /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(v);
  if (rgbMatch) {
    const r = Number(rgbMatch[1]);
    const g = Number(rgbMatch[2]);
    const b = Number(rgbMatch[3]);
    if (r <= 255 && g <= 255 && b <= 255) {
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  // Allow rgba(r,g,b,a) with 0-255 ints and alpha 0..1
  const rgbaMatch =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|0?\.\d+|1(\.0+)?)\s*\)$/i.exec(
      v
    );
  if (rgbaMatch) {
    const r = Number(rgbaMatch[1]);
    const g = Number(rgbaMatch[2]);
    const b = Number(rgbaMatch[3]);
    const a = Number(rgbaMatch[4]);
    if (r <= 255 && g <= 255 && b <= 255 && a >= 0 && a <= 1) {
      // Normalize alpha to trimmed string to avoid 1.
      const alpha = String(parseFloat(a.toString()));
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }

  // Support simple "r,g,b" form by converting to rgb(r,g,b)
  const triplet = /^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/.exec(v);
  if (triplet) {
    const r = Number(triplet[1]);
    const g = Number(triplet[2]);
    const b = Number(triplet[3]);
    if (r <= 255 && g <= 255 && b <= 255) {
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  return null;
}

function robloxRichTextToHtml(input: string): string {
  if (!input) return "";

  // Placeholders map
  const placeholders: string[] = [];
  const replacements: string[] = [];
  const makePh = (html: string) => {
    const token = `__ROBLOX_RTX_${placeholders.length}__`;
    placeholders.push(token);
    replacements.push(html);
    return token;
  };

  let s = String(input);

  // Normalize newlines first (we'll convert to <br/> after escaping)
  // We'll preserve explicit <br> tags too.

  // Preserve simple tags exactly matching <b>,</b>, etc. (no attributes)
  s = s.replace(/<\s*b\s*>/gi, () => makePh("<b>"));
  s = s.replace(/<\s*\/\s*b\s*>/gi, () => makePh("</b>"));
  s = s.replace(/<\s*i\s*>/gi, () => makePh("<i>"));
  s = s.replace(/<\s*\/\s*i\s*>/gi, () => makePh("</i>"));
  s = s.replace(/<\s*u\s*>/gi, () => makePh("<u>"));
  s = s.replace(/<\s*\/\s*u\s*>/gi, () => makePh("</u>"));
  s = s.replace(/<\s*s\s*>/gi, () => makePh("<s>"));
  s = s.replace(/<\s*\/\s*s\s*>/gi, () => makePh("</s>"));

  // Preserve <br>, <br/>, <br /> variations
  s = s.replace(/<\s*br\s*\/?\s*>/gi, () => makePh("<br/>"));

  // Handle <font ...> -> <span style="...">
  s = s.replace(/<\s*font([^>]*)>/gi, (_m, attrs: string) => {
    let color: string | null = null;
    let size: number | null = null;

    // Extract attributes safely
    const attrRegex = /(\w+)\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+)/g;
    let match: RegExpExecArray | null;
    while ((match = attrRegex.exec(attrs)) !== null) {
      const name = match[1].toLowerCase();
      let raw = match[2];
      if (
        (raw.startsWith('"') && raw.endsWith('"')) ||
        (raw.startsWith("'") && raw.endsWith("'"))
      ) {
        raw = raw.slice(1, -1);
      }
      if (name === "color") {
        const c = sanitizeColor(raw);
        if (c) color = c;
      } else if (name === "size") {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n)) {
          // Clamp to a reasonable range
          size = Math.min(Math.max(n, 6), 72);
        }
      }
    }

    const styles: string[] = [];
    if (color) styles.push(`color: ${color}`);
    if (size !== null) styles.push(`font-size: ${size}px`);
    const styleAttr = styles.length ? ` style=\"${styles.join("; ")}\"` : "";
    return makePh(`<span${styleAttr}>`);
  });

  // Closing font -> closing span
  s = s.replace(/<\s*\/\s*font\s*>/gi, () => makePh("</span>"));

  // Escape everything else
  s = escapeHtml(s);

  // Convert remaining newlines to <br/>
  s = s.replace(/\r\n|\n|\r/g, "<br/>");

  // Restore placeholders
  placeholders.forEach((ph, i) => {
    s = s.split(ph).join(replacements[i]);
  });

  return s;
}

export default function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const finalClassName = cn(
    "text-left block text-white text-sm opacity-80",
    className
  );

  if (typeof children === "string") {
    const html = robloxRichTextToHtml(children);
    return (
      <span
        className={finalClassName}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <span className={finalClassName}>{children}</span>;
}
