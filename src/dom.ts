// Tiny helper for building DOM elements safely. Text is always set as text,
// never as HTML, so content from imported files can't inject markup.

type Child = Node | string | number | null | undefined | false | Child[];
type Attrs = Record<string, string | number | boolean | null | undefined | EventListener>;

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    if (key.startsWith("on") && typeof value === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (key === "class") {
      el.className = String(value);
    } else if (value === true) {
      el.setAttribute(key, "");
    } else {
      el.setAttribute(key, String(value));
    }
  }
  append(el, children);
  return el;
}

function append(el: Node, children: Child[]): void {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    if (Array.isArray(child)) append(el, child);
    else el.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

/** A link that opens external guidance in a new tab, announcing that it does. */
export function extLink(url: string, label: string): HTMLElement {
  if (!url) return h("span", {}, label);
  return h("a", { href: url, target: "_blank", rel: "noopener noreferrer" }, label,
    h("span", { class: "visually-hidden" }, " (opens in a new tab)"));
}

let idCounter = 0;
export const uid = (prefix = "id") => `${prefix}-${++idCounter}`;
