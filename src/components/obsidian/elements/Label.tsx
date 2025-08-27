import { cn } from "@/lib/utils";

/**
 * Escapes HTML-sensitive characters in a string by replacing them with their corresponding HTML entities.
 *
 * Converts &, <, >, double quotes (") and single quotes (') to their safe HTML entity equivalents to prevent HTML injection when injecting text into HTML.
 *
 * @param input - The raw text to escape.
 * @returns The escaped string with HTML-sensitive characters replaced by entities.
 */
function escapeHtml(input: string) {
	return input
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/**
 * Validate and normalize a CSS color-like string into a safe CSS color expression.
 *
 * Accepts hex colors (#RGB or #RRGGBB), `rgb(r, g, b)`, `rgba(r, g, b, a)`, or bare numeric triplets `r, g, b`.
 * Numeric components are validated (r/g/b: 0–255, a: 0–1). Alpha in `rgba` is canonicalized (parsed via parseFloat).
 *
 * @param value - Input color string (may contain surrounding whitespace).
 * @returns A normalized CSS color string (`#...`, `rgb(r, g, b)`, or `rgba(r, g, b, a)`) when valid, otherwise `null`.
 */
function sanitizeColor(value: string): string | null {
	const v = value.trim();
	if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) return v;

	const rgbMatch = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(v);
	if (rgbMatch) {
		const r = Number(rgbMatch[1]);
		const g = Number(rgbMatch[2]);
		const b = Number(rgbMatch[3]);
		if (r <= 255 && g <= 255 && b <= 255) {
			return `rgb(${r}, ${g}, ${b})`;
		}
	}

	const rgbaMatch = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|0?\.\d+|1(\.0+)?)\s*\)$/i.exec(v);
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

/**
 * Convert a Roblox Rich Text string into sanitized HTML.
 *
 * This function preserves a safe subset of formatting (bold, italic, underline, strikethrough, and line breaks),
 * converts `<font color="...">` and `size="..."` into `<span style="...">` using validated color and clamped font-size,
 * escapes all other HTML to prevent injection, and converts newlines to `<br/>`.
 *
 * If `input` is falsy the function returns an empty string.
 *
 * @param input - The Roblox Rich Text source to convert.
 * @returns A sanitized HTML string representing the input's formatting.
 */
function robloxRichTextToHtml(input: string): string {
	if (!input) return "";

	const placeholders: string[] = [];
	const replacements: string[] = [];
	const makePh = (html: string) => {
		const token = `__ROBLOX_RTX_${placeholders.length}__`;
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

/**
 * Render a small, left-aligned label. String children are converted from Roblox Rich Text to sanitized HTML; non-string children are rendered as-is.
 *
 * @param children - If a string, treated as Roblox Rich Text and converted to sanitized HTML before being set via `dangerouslySetInnerHTML`. If not a string, rendered normally as React children.
 * @param className - Optional additional class names appended to the component's base classes ("text-left block text-white text-sm").
 * @returns A span element containing the rendered label.
 */
export default function Label({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const finalClassName = cn(
		"text-left block text-white text-sm",
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