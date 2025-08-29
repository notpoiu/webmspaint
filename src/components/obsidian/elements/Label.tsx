import { cn } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import type { ReactNode, CSSProperties } from "react";

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
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) return v;

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
      const alpha = String(parseFloat(a.toString()));
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }

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

  const placeholders: string[] = [];
  const replacements: string[] = [];
  const tokenSeed = `__RTX_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}__`;
  const makePh = (html: string) => {
    const token = `${tokenSeed}${placeholders.length}__`;
    placeholders.push(token);
    replacements.push(html);
    return token;
  };
  let s = String(input);
  s = s.replace(/<\s*b\s*>/gi, () => makePh("<b>"));
  s = s.replace(/<\s*\/\s*b\s*>/gi, () => makePh("</b>"));
  s = s.replace(/<\s*i\s*>/gi, () => makePh("<i>"));
  s = s.replace(/<\s*\/\s*i\s*>/gi, () => makePh("</i>"));
  s = s.replace(/<\s*u\s*>/gi, () => makePh("<u>"));
  s = s.replace(/<\s*\/\s*u\s*>/gi, () => makePh("</u>"));
  s = s.replace(/<\s*s\s*>/gi, () => makePh("<s>"));
  s = s.replace(/<\s*\/\s*s\s*>/gi, () => makePh("</s>"));
  s = s.replace(/<\s*br\s*\/?\s*>/gi, () => makePh("<br/>"));

  s = s.replace(/<\s*font([^>]*)>/gi, (_m, attrs: string) => {
    let color: string | null = null;
    let size: number | null = null;

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

  s = s.replace(/<\s*\/\s*font\s*>/gi, () => makePh("</span>"));
  s = escapeHtml(s);
  s = s.replace(/\r\n|\n|\r/g, "<br/>");

  placeholders.forEach((ph, i) => {
    s = s.split(ph).join(replacements[i]);
  });

  return s;
}

export default function Label({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const finalClassName = cn("text-left block text-white text-sm", className);

  if (typeof children === "string") {
    const htmlUnsafe = robloxRichTextToHtml(children);
    const html = DOMPurify.sanitize(htmlUnsafe, {
      ALLOWED_TAGS: ["b", "i", "u", "s", "br", "span"],
      ALLOWED_ATTR: ["style"],
    });
    return (
      <span
        className={finalClassName}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span className={finalClassName} style={style}>
      {children}
    </span>
  );
}
