import "@fontsource/atkinson-hyperlegible-next/400.css";
import "@fontsource/atkinson-hyperlegible-next/700.css";
import "./styles.css";
import data from "./generated/content.json";
import type { Assessment, Content } from "./types";
import { newAssessment } from "./scoring";
import { loadSaved, save } from "./store";
import { renderPage, steps } from "./views";

const SITE_NAME = "UX self assessment";

export const content = data as unknown as Content;

export const app = {
  state: (loadSaved() ?? null) as Assessment | null,
  saveFailed: false,
  ensure(): Assessment {
    if (!this.state) this.state = newAssessment(content);
    return this.state;
  },
  /** Call after any change to the assessment. */
  changed(): void {
    if (!this.state) return;
    const ok = save(this.state);
    const status = document.getElementById("save-status");
    if (status) {
      status.textContent = ok ? "Your answers are saved in this browser." :
        "Your browser isn't letting this tool save. Download the assessment file before you leave.";
      status.classList.toggle("warn", !ok);
    }
    this.saveFailed = !ok;
    renderStepNav();
  },
  replace(a: Assessment | null): void {
    this.state = a;
    if (a) save(a);
  },
};

function route(): string {
  const hash = location.hash.replace(/^#\/?/, "");
  return hash || "home";
}

export function go(path: string): void {
  if (location.hash === `#/${path}`) render();
  else location.hash = `#/${path}`;
}

function renderStepNav(): void {
  const nav = document.getElementById("step-nav");
  if (!nav) return;
  const current = route();
  const inAssessment = app.state && steps(content, app.state).some((s) => s.path === current);
  nav.hidden = !inAssessment;
  if (!inAssessment || !app.state) return;
  const wide = window.matchMedia("(min-width: 60rem)").matches;
  const prevOpen = nav.querySelector("details")?.open;
  const details = document.createElement("details");
  details.className = "steps-toggle";
  details.open = wide || !!prevOpen;
  const summary = document.createElement("summary");
  summary.textContent = "All steps";
  details.append(summary, renderStepsList(current));
  nav.replaceChildren(details);
}

function renderStepsList(current: string): HTMLElement {
  const list = document.createElement("ol");
  list.className = "steps";
  for (const s of steps(content, app.state!)) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#/${s.path}`;
    a.textContent = s.label;
    if (s.path === current) a.setAttribute("aria-current", "step");
    li.appendChild(a);
    if (s.progress) {
      const p = document.createElement("span");
      p.className = "step-progress" + (s.complete ? " done" : "");
      p.textContent = s.progress;
      li.appendChild(p);
    }
    list.appendChild(li);
  }
  return list;
}

window.matchMedia("(min-width: 60rem)").addEventListener("change", () => renderStepNav());

function render(): void {
  const main = document.getElementById("main")!;
  const page = renderPage(route(), content);
  document.title = page.title === SITE_NAME ? SITE_NAME : `${page.title} - ${SITE_NAME}`;
  main.replaceChildren(page.node);
  renderStepNav();
  const h1 = main.querySelector("h1");
  if (h1 && document.body.dataset.ready) {
    h1.setAttribute("tabindex", "-1");
    h1.focus();
  }
  document.body.dataset.ready = "1";
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
document.getElementById("content-version")!.textContent = `Question set v${content.meta.content_version}`;
render();
