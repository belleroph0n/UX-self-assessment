import { h, extLink, uid } from "./dom";
import { app, go } from "./main";
import type { Answer, Assessment, Content, Criterion, ProfileQuestion } from "./types";
import { applies, criteriaFor, effectiveAnswer, meetsTierTarget, newAssessment, scoreMateriality, scoreUx } from "./scoring";
import { clearSaved, exportFile, parseImport } from "./store";

interface Page { title: string; node: Node; }
interface Step { path: string; label: string; progress?: string; complete?: boolean; }

const ANSWER_LABELS: Record<Answer, string> = { yes: "Yes", partial: "Partly", no: "No", na: "Doesn't apply" };
/** The single-file preview runs in a sandboxed frame where dialogs, printing and downloads are blocked. */
const PREVIEW = import.meta.env.MODE === "single";
const ask = (message: string) => (PREVIEW ? true : confirm(message));

const STATUS_LABELS = { mandatory: "Mandatory in NZ", recommended: "NZ guidance", "good-practice": "Good practice" };

// ---------------------------------------------------------------- steps

export function steps(content: Content, a: Assessment): Step[] {
  const list = criteriaFor(content, a.type);
  const out: Step[] = [
    { path: "service", label: "Service details", complete: !!a.service.name },
    { path: "profile", label: "Service profile",
      progress: `${content.profile.filter((p) => a.profile[p.id] !== undefined).length}/${content.profile.length}`,
      complete: content.profile.every((p) => a.profile[p.id] !== undefined) },
  ];
  for (const cat of content.categories) {
    const items = list.filter((c) => c.category === cat.id);
    if (!items.length) continue;
    const answered = items.filter((c) => effectiveAnswer(c, a)).length;
    out.push({ path: `q/${cat.id}`, label: cat.name, progress: `${answered}/${items.length}`, complete: answered === items.length });
  }
  const mDone = content.materiality.factors.filter((f) => a.materiality[f.id]).length;
  out.push({ path: "materiality", label: "Materiality", progress: `${mDone}/${content.materiality.factors.length}`,
             complete: mDone === content.materiality.factors.length });
  out.push({ path: "report", label: "Report" });
  return out;
}

function stepNav(content: Content, a: Assessment, path: string): HTMLElement {
  const all = steps(content, a);
  const i = all.findIndex((s) => s.path === path);
  const prev = all[i - 1], next = all[i + 1];
  return h("div", { class: "page-nav" },
    prev ? h("a", { href: `#/${prev.path}`, class: "button secondary" }, `Back: ${prev.label}`) : null,
    next ? h("a", { href: `#/${next.path}`, class: "button" }, next.path === "report" ? "See the report" : `Next: ${next.label}`) : null,
  );
}

function stepHeading(content: Content, a: Assessment, path: string, title: string): HTMLElement {
  const all = steps(content, a);
  const i = all.findIndex((s) => s.path === path);
  return h("div", { class: "step-heading" },
    h("p", { class: "step-count" }, `Step ${i + 1} of ${all.length}`),
    h("h1", {}, title));
}

const saveStatus = () => h("p", { id: "save-status", class: "save-status", role: "status" },
  app.saveFailed ? "Your browser isn't letting this tool save. Download the assessment file before you leave." : "");

// ---------------------------------------------------------------- router

export function renderPage(path: string, content: Content): Page {
  if (path === "home") return home(content);
  if (path === "about") return about(content);
  if (path === "sources") return sources(content);
  if (path === "privacy") return privacy();
  if (path === "accessibility") return accessibility();
  if (!app.state) return home(content);
  const a = app.state;
  if (path === "service") return service(content, a);
  if (path === "profile") return profile(content, a);
  if (path.startsWith("q/")) {
    const cat = content.categories.find((c) => c.id === path.slice(2));
    if (cat) return questions(content, a, cat.id);
  }
  if (path === "materiality") return materiality(content, a);
  if (path === "report") return report(content, a);
  return notFound();
}

// ---------------------------------------------------------------- home

function home(content: Content): Page {
  const saved = app.state;
  const n = (t: "simple" | "detailed") => criteriaFor(content, t).length;
  const typeName = uid("type");
  const fileId = uid("file");
  const importMsg = h("div", { role: "alert", class: "import-message" });

  const start = (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const type = (new FormData(form).get("type") as "simple" | "detailed") ?? "simple";
    if (saved && (saved.service.name || Object.keys(saved.answers).length) &&
        !ask("Starting a new assessment replaces the one saved in this browser. Download it first if you want to keep it. Start a new assessment?")) return;
    app.replace(newAssessment(content, type));
    go("service");
  };

  const onFile = async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const result = parseImport(await file.text(), content);
    if (result.error) {
      importMsg.replaceChildren(h("p", { class: "error" }, result.error));
      return;
    }
    app.replace(result.assessment!);
    importMsg.replaceChildren(
      h("p", {}, `Imported the assessment of ${result.assessment!.service.name || "an unnamed service"}.`),
      ...result.warnings.map((w) => h("p", { class: "warn" }, w)),
      h("p", {}, h("a", { href: "#/report", class: "button" }, "See the report"), " ",
        h("a", { href: "#/service", class: "button secondary" }, "Review the answers")));
  };

  return { title: "UX self assessment", node: h("div", { class: "home" },
    h("h1", {}, "Check the quality of your application's user experience"),
    h("p", { class: "lede" }, "This is a freely available resource designed to assist product and delivery teams in considering key criteria to optimise the User Experience (UX) with their application."),
    h("p", {}, "The assessment covers questions that would make the most difference to the UX. It provides a report containing a UX health score, application materiality, and any supporting recommendations. It is only intended as a guide and should not replace advice from experienced UX practitioners."),
    h("p", {}, "The questions cover accessibility, usability, content, brand, security and privacy, reliability, support, legal obligations, content management and governance, and measurement. They're based on NZ Government standards and international good practice."),
    saved && (saved.service.name || Object.keys(saved.answers).length) ? h("section", { class: "panel" },
      h("h2", {}, "Continue where you left off"),
      h("p", {}, `You have an assessment of ${saved.service.name || "an unnamed service"} saved in this browser.`),
      h("p", {}, h("a", { href: "#/service", class: "button" }, "Continue the assessment"), " ",
        h("a", { href: "#/report", class: "button secondary" }, "See the report"))) : null,
    h("section", {},
      h("h2", {}, "Start a new assessment"),
      h("form", { onsubmit: start },
        h("fieldset", {},
          h("legend", {}, "Which assessment do you want to complete?"),
          h("div", { class: "choice-cards" },
            h("label", { class: "choice" },
              h("input", { type: "radio", name: "type", value: "simple", checked: true, id: typeName }),
              h("span", {}, h("strong", {}, `Simple: ${n("simple")} questions`),
                h("span", { class: "hint" }, "The most important criteria in every category. Takes 10-15 minutes. ", h("strong", {}, "Recommended.")))),
            h("label", { class: "choice" },
              h("input", { type: "radio", name: "type", value: "detailed" }),
              h("span", {}, h("strong", {}, `Detailed: ${n("detailed")} questions`),
                h("span", { class: "hint" }, "Every criterion, with evidence to look for. Suits a full review or audit."))))),
        h("button", { type: "submit" }, "Start the assessment"))),
    h("section", {},
      h("h2", {}, "Open a saved assessment file"),
      h("p", {}, "If you downloaded an assessment from this tool, you can open it here to review or update it."),
      h("label", { for: fileId, class: "label" }, "Assessment file (.json)"),
      h("input", { type: "file", id: fileId, accept: ".json,application/json", onchange: onFile }),
      importMsg),
    h("section", { class: "note" },
      h("h2", {}, "Your answers stay with you"),
      h("p", {}, "Nothing you enter is sent anywhere. Answers are saved in this browser only, so download the assessment file to keep a copy or share it. ",
        h("a", { href: "#/privacy" }, "Read the privacy statement"), "."))) };
}

// ---------------------------------------------------------------- service details

function service(content: Content, a: Assessment): Page {
  const field = (key: keyof Assessment["service"], label: string, opts: { type?: string; hint?: string; autocomplete?: string } = {}) => {
    const id = uid("svc");
    const hintId = opts.hint ? `${id}-hint` : null;
    return h("div", { class: "field" },
      h("label", { for: id, class: "label" }, label),
      opts.hint ? h("p", { id: hintId!, class: "hint" }, opts.hint) : null,
      h("input", { id, type: opts.type ?? "text", value: a.service[key], "aria-describedby": hintId, autocomplete: opts.autocomplete ?? "off",
        oninput: (e: Event) => { a.service[key] = (e.currentTarget as HTMLInputElement).value; app.changed(); } }));
  };
  return { title: "Service details", node: h("div", {},
    stepHeading(content, a, "service", "Service details"),
    h("p", {}, "These details appear on the report."),
    h("form", { onsubmit: (e: Event) => { e.preventDefault(); go("profile"); } },
      field("name", "Service or application name"),
      field("organisation", "Organisation", { autocomplete: "organization" }),
      field("url", "Web address", { type: "url", hint: "For example, https://www.example.govt.nz", autocomplete: "url" }),
      field("assessor", "Completed by", { autocomplete: "name" }),
      field("date", "Assessment date", { type: "date" }),
      h("p", { class: "hint" }, `Assessment type: ${a.type === "simple" ? "Simple" : "Detailed"} (${criteriaFor(content, a.type).length} questions). To change it, start a new assessment from the home page.`)),
    saveStatus(),
    stepNav(content, a, "service")) };
}

// ---------------------------------------------------------------- profile

function profile(content: Content, a: Assessment): Page {
  const list = criteriaFor(content, a.type);
  const q = (p: ProfileQuestion) => {
    const name = uid("profile");
    const hintId = p.hint ? `${name}-hint` : null;
    const affected = list.filter((c) => c.applies_to === p.id).length;
    return h("fieldset", { class: "question", "aria-describedby": hintId },
      h("legend", {}, p.question),
      p.hint ? h("p", { id: hintId!, class: "hint" }, p.hint) : null,
      h("div", { class: "options two" },
        ...[true, false].map((v) => h("label", { class: "option" },
          h("input", { type: "radio", name, value: String(v), checked: a.profile[p.id] === v,
            onchange: () => { a.profile[p.id] = v; app.changed(); } }),
          h("span", {}, v ? "Yes" : "No")))),
      affected ? h("p", { class: "hint small" }, `Affects ${affected} question${affected > 1 ? "s" : ""} in this assessment.`) : null);
  };
  return { title: "Service profile", node: h("div", {},
    stepHeading(content, a, "profile", "Service profile"),
    h("p", {}, "Some questions only apply to certain kinds of service. Questions that don't apply are left out of the score."),
    ...content.profile.map(q),
    saveStatus(),
    stepNav(content, a, "profile")) };
}

// ---------------------------------------------------------------- questions

function questionBlock(c: Criterion, a: Assessment, detailed: boolean): HTMLElement {
  const name = `answer-${c.id}`;
  const noteId = uid("note");
  const tags = h("p", { class: "tags" },
    c.critical ? h("span", { class: "tag critical" }, "Critical") : null,
    h("span", { class: `tag ${c.nz_status}` }, STATUS_LABELS[c.nz_status]));
  return h("fieldset", { class: "question", id: `q-${c.id}` },
    h("legend", {}, h("span", { class: "qid" }, c.id), " ", c.question),
    tags,
    c.critical ? h("p", { class: "hint small" }, "A 'No' to a critical question caps the overall score at 60 and is listed first in the report.") : null,
    h("div", { class: "options" },
      ...(["yes", "partial", "no", "na"] as Answer[]).map((v) => h("label", { class: "option" },
        h("input", { type: "radio", name, value: v, checked: a.answers[c.id] === v,
          onchange: () => { a.answers[c.id] = v; app.changed(); } }),
        h("span", {}, ANSWER_LABELS[v])))),
    h("details", { class: "more", open: detailed ? true : null },
      h("summary", {}, "What to look for"),
      h("dl", {},
        h("dt", {}, "Evidence"), h("dd", {}, c.evidence),
        h("dt", {}, "Based on"), h("dd", {}, c.source),
        c.link.url ? [h("dt", {}, "Guidance"), h("dd", {}, extLink(c.link.url, c.link.label))] : null)),
    h("details", { class: "more", open: a.notes[c.id] ? true : null },
      h("summary", {}, a.notes[c.id] ? "Your note" : "Add a note"),
      h("label", { for: noteId, class: "label" }, `Note for ${c.id} (optional)`),
      h("textarea", { id: noteId, rows: 3, oninput: (e: Event) => {
        const v = (e.currentTarget as HTMLTextAreaElement).value;
        if (v) a.notes[c.id] = v; else delete a.notes[c.id];
        app.changed();
      } }, a.notes[c.id] ?? "")));
}

function questions(content: Content, a: Assessment, catId: string): Page {
  const cat = content.categories.find((c) => c.id === catId)!;
  const items = criteriaFor(content, a.type).filter((c) => c.category === catId);
  const shown = items.filter((c) => applies(c, a.profile));
  const hidden = items.length - shown.length;
  return { title: cat.name, node: h("div", {},
    stepHeading(content, a, `q/${catId}`, cat.name),
    h("p", { class: "lede" }, cat.description),
    hidden ? h("p", { class: "note" }, `${hidden} question${hidden > 1 ? "s don't" : " doesn't"} apply based on your `,
      h("a", { href: "#/profile" }, "service profile"), " and won't be scored.") : null,
    ...shown.map((c) => questionBlock(c, a, a.type === "detailed")),
    saveStatus(),
    stepNav(content, a, `q/${catId}`)) };
}

// ---------------------------------------------------------------- materiality

function materiality(content: Content, a: Assessment): Page {
  const m = content.materiality;
  const factor = (f: Content["materiality"]["factors"][number]) => {
    const name = `mat-${f.id}`;
    return h("fieldset", { class: "question" },
      h("legend", {}, h("span", { class: "qid" }, f.factor), " ", f.question),
      h("div", { class: "scale" },
        ...f.anchors.map((text, i) => h("label", { class: "option" },
          h("input", { type: "radio", name, value: String(i + 1), checked: a.materiality[f.id] === i + 1,
            onchange: () => { a.materiality[f.id] = i + 1; app.changed(); } }),
          h("span", {}, h("strong", {}, `${i + 1}`), " ", text)))));
  };
  const tierSelectId = uid("tier"), reasonId = uid("reason");
  const result = scoreMateriality(content, a);
  return { title: "Materiality", node: h("div", {},
    stepHeading(content, a, "materiality", "Materiality"),
    h("p", { class: "lede" }, "How much does this service matter if it doesn't work well? Rate each factor from 1 to 5. The materiality rating is reported separately and doesn't change the UX health score."),
    ...m.factors.map(factor),
    h("section", { class: "panel" },
      h("h2", {}, "Service tier"),
      h("p", {}, result.suggestedTier
        ? `Based on the answers so far, the suggested tier is ${result.suggestedTier.name}. `
        : "A suggested tier appears once you've rated the factors. ",
        "Tier definitions are proposals and haven't been agreed yet. ", h("a", { href: "#/about" }, "See the tier definitions"), "."),
      h("div", { class: "field" },
        h("label", { for: tierSelectId, class: "label" }, "Agreed tier, if different from the suggestion (optional)"),
        h("select", { id: tierSelectId, onchange: (e: Event) => { a.agreed_tier = (e.currentTarget as HTMLSelectElement).value; app.changed(); } },
          h("option", { value: "" }, "Use the suggested tier"),
          ...content.tiers.tiers.map((t) => h("option", { value: t.id, selected: a.agreed_tier === t.id }, t.name)))),
      h("div", { class: "field" },
        h("label", { for: reasonId, class: "label" }, "Reason for the agreed tier (optional)"),
        h("textarea", { id: reasonId, rows: 2, oninput: (e: Event) => { a.agreed_tier_reason = (e.currentTarget as HTMLTextAreaElement).value; app.changed(); } }, a.agreed_tier_reason))),
    saveStatus(),
    stepNav(content, a, "materiality")) };
}

// ---------------------------------------------------------------- report

const fmt = (n: number | null, dp = 0) => (n === null ? "-" : n.toFixed(dp));

function report(content: Content, a: Assessment): Page {
  const ux = scoreUx(content, a);
  const mat = scoreMateriality(content, a);
  const meets = meetsTierTarget(content, ux, mat.tier);
  const target = mat.tier ? content.scoring.ratings.find((r) => r.id === mat.tier!.target_rating) : null;
  const bands = content.scoring.ratings;
  const bandText = bands.map((r, i) => {
    const upper = i === 0 ? "" : `-${bands[i - 1].min - 1}`;
    return i === 0 ? `${cap(r.colour)} ${r.min}+ ${r.label}` : r.min === 0 ? `${cap(r.colour)} below ${bands[i - 1].min} ${r.label}` : `${cap(r.colour)} ${r.min}${upper} ${r.label}`;
  }).join(", ") + ". Any critical failure shows red.";

  const incomplete = ux.unanswered > 0 || mat.answered < mat.total;

  return { title: "Report", node: h("div", { class: "report" },
    h("div", { class: "report-head" },
      h("p", { class: "step-count no-print" }, `Step ${steps(content, a).length} of ${steps(content, a).length}`),
      h("h1", {}, `UX self assessment: ${a.service.name || "Unnamed application"}`),
      h("dl", { class: "meta" },
        a.service.organisation ? [h("dt", {}, "Organisation"), h("dd", {}, a.service.organisation)] : null,
        a.service.url ? [h("dt", {}, "Web address"), h("dd", {}, a.service.url)] : null,
        h("dt", {}, "Assessment"), h("dd", {}, `${a.type === "simple" ? "Simple" : "Detailed"}, question set v${content.meta.content_version}`),
        a.service.assessor ? [h("dt", {}, "Completed by"), h("dd", {}, a.service.assessor)] : null,
        h("dt", {}, "Date"), h("dd", {}, a.service.date || "-"))),
    incomplete ? h("p", { class: "note warn" },
      `The assessment isn't finished: ${ux.unanswered} question${ux.unanswered === 1 ? "" : "s"} and ${mat.total - mat.answered} materiality factor${mat.total - mat.answered === 1 ? "" : "s"} not answered. Results are based on the answers so far.`) : null,
    h("div", { class: "actions no-print" },
      PREVIEW ? h("p", { class: "note" }, "This is a preview. Printing and downloading the assessment file work on the published site.") : [
        h("button", { type: "button", onclick: () => window.print() }, "Print or save as PDF"),
        h("button", { type: "button", class: "secondary", onclick: () => exportFile(a) }, "Download assessment file")],
      h("button", { type: "button", class: "secondary", onclick: () => {
        if (ask("This deletes the assessment saved in this browser. Download the assessment file first if you want to keep it. Delete it?")) {
          clearSaved(); app.replace(null); go("home");
        } } }, "Delete saved assessment")),

    h("section", { "aria-labelledby": "s1" },
      h("h2", { id: "s1" }, "UX health score"),
      h("div", { class: `result tone-${ux.colour ?? "none"}` },
        h("p", { class: "big" }, h("span", { class: "figure" }, fmt(ux.final)), h("span", { class: "outof" }, " out of 100")),
        h("p", { class: "rating" }, ux.rating ? ux.rating.label : "Not scored yet"),
        ux.criticalFailures.length ? h("p", {}, `Capped at ${content.scoring.critical_cap} because of ${ux.criticalFailures.length} critical failure${ux.criticalFailures.length > 1 ? "s" : ""}: `,
          ux.criticalFailures.map((c) => c.id).join(", "), ".") : null),
      h("p", { class: "hint small" }, bandText),
      h("p", {}, `${ux.answered} answered, ${ux.na} not applicable, ${ux.unanswered} not answered, out of ${ux.total} questions.`)),

    h("section", { "aria-labelledby": "s2" },
      h("h2", { id: "s2" }, "Materiality"),
      h("p", { class: "hint" }, "Reported separately. It isn't part of the UX health score."),
      h("div", { class: `result mat-${mat.level?.colour ?? "none"}` },
        h("p", { class: "big" }, h("span", { class: "figure" }, mat.rating ?? "-"), h("span", { class: "outof" }, " out of 5")),
        h("p", { class: "rating" }, mat.level?.label ?? "Not rated yet"),
        mat.level ? h("p", {}, mat.level.meaning) : null),
      h("p", { class: "hint small" }, "Green 1 Immaterial, Yellow-green 2 Low, Yellow 3 Moderate, Orange 4 High, Red 5 Critical."),
      h("dl", { class: "facts" },
        h("dt", {}, "Weighted average of factors"), h("dd", {}, fmt(mat.average, 2)),
        h("dt", {}, "Deciding factors rated 5"), h("dd", {}, String(mat.floorHits)),
        h("dt", {}, "Service tier"), h("dd", {}, mat.tier ? `${mat.tier.name} (${mat.agreedTier ? "agreed" : "suggested"})` : "-"),
        mat.agreedTier && a.agreed_tier_reason ? [h("dt", {}, "Reason for agreed tier"), h("dd", {}, a.agreed_tier_reason)] : null,
        h("dt", {}, "Target for this tier"), h("dd", {}, mat.tier ? String(mat.tier.target_rating_text ?? target?.label ?? "-") : "-"),
        h("dt", {}, "Meets the tier target"), h("dd", {}, meets === null ? "-" : meets ? "Yes" : "No"))),

    h("section", { "aria-labelledby": "s3" },
      h("h2", { id: "s3" }, "Key recommendations"),
      ux.key.length ? h("table", {},
        h("caption", { class: "visually-hidden" }, "Key recommendations, most important first"),
        h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "Rank"), h("th", { scope: "col" }, "Question"),
          h("th", { scope: "col" }, "Recommendation"), h("th", { scope: "col" }, "Supporting link"))),
        h("tbody", {}, ...ux.key.map((r, i) => h("tr", {},
          h("td", { "data-label": "Rank" }, String(i + 1)),
          h("td", { "data-label": "Question" }, r.criterion.id, r.criticalFailure ? h("span", { class: "tag critical" }, "Critical") : null),
          h("td", { "data-label": "Recommendation" }, r.criterion.recommendation),
          h("td", { "data-label": "Supporting link" }, extLink(r.criterion.link.url, r.criterion.link.label))))))
        : h("p", {}, ux.answered ? "No recommendations: every answered question is a 'Yes'." : "Recommendations appear once you've answered questions.")),

    h("section", { "aria-labelledby": "s4" },
      h("h2", { id: "s4" }, "Results by category"),
      h("table", {},
        h("caption", { class: "visually-hidden" }, "Score for each category"),
        h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "Category"), h("th", { scope: "col", class: "num" }, "Questions answered"),
          h("th", { scope: "col", class: "num" }, "Score"), h("th", { scope: "col", class: "num" }, "Out of"), h("th", { scope: "col", class: "num" }, "Percentage"))),
        h("tbody", {}, ...ux.categories.map((c) => h("tr", {},
          h("th", { scope: "row" }, c.category.name),
          h("td", { class: "num", "data-label": "Questions answered" }, `${c.answered}/${c.asked}`),
          h("td", { class: "num", "data-label": "Score" }, fmt(c.score, 1)),
          h("td", { class: "num", "data-label": "Out of" }, String(c.category.points)),
          h("td", { class: "num", "data-label": "Percentage" }, c.percent === null ? "-" : `${Math.round(c.percent * 100)}%`)))))),

    ux.recommendations.length > ux.key.length ? h("section", { "aria-labelledby": "s5" },
      h("h2", { id: "s5" }, "All recommendations"),
      ...ux.categories.filter((c) => ux.recommendations.some((r) => r.criterion.category === c.category.id)).map((c) =>
        h("div", { class: "rec-group" },
          h("h3", {}, c.category.name),
          h("ul", {}, ...ux.recommendations.filter((r) => r.criterion.category === c.category.id).map((r) =>
            h("li", {},
              h("p", {}, h("strong", {}, `${r.criterion.id} (${ANSWER_LABELS[r.answer]}): `), r.criterion.recommendation),
              a.notes[r.criterion.id] ? h("p", { class: "hint" }, `Note: ${a.notes[r.criterion.id]}`) : null,
              r.criterion.link.url ? h("p", { class: "small" }, extLink(r.criterion.link.url, r.criterion.link.label)) : null)))))) : null,

    h("section", { class: "note" },
      h("h2", {}, "Reading the two measures together"),
      h("p", {}, "The UX health score shows how well the service supports a good experience now. Materiality shows how much it matters if it doesn't. A High or Critical service that doesn't meet its tier target should be fixed before a less material service with the same score.")),
    h("p", { class: "no-print" }, h("a", { href: "#/materiality", class: "button secondary" }, "Back: Materiality"))) };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------------------------------------------------------------- static pages

function about(content: Content): Page {
  const t = content.tiers;
  const labels = t.field_labels ?? {};
  const rows = ["materiality", "when_to_use", "availability", "support_hours", "p1_incident", "p2_incident", "rto", "rpo",
    "monitoring", "maintenance", "health_check_frequency", "target_rating_text", "remediation", "reporting"];
  return { title: "How the UX self assessment works", node: h("div", { class: "prose wide" },
    h("h1", {}, "How the UX self assessment works"),
    h("h2", {}, "The questions"),
    h("p", {}, `The question set (v${content.meta.content_version}) has ${content.criteria.length} criteria in ${content.categories.length} categories. The simple assessment uses the ${criteriaFor(content, "simple").length} most important. They're drawn from NZ Government standards and legislation and international good practice. `,
      h("a", { href: "#/sources" }, "See the sources"), "."),
    h("h2", {}, "The UX health score"),
    h("p", {}, `Each category is worth a share of 100 points. Answers score Yes ${content.scoring.answer_points.yes}, Partly ${content.scoring.answer_points.partial} and No ${content.scoring.answer_points.no}. Questions that don't apply are left out and the remaining categories are scaled back up to 100. A 'No' to any critical question caps the score at ${content.scoring.critical_cap}.`),
    h("table", {}, h("caption", {}, "Ratings"),
      h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "Score"), h("th", { scope: "col" }, "Rating"))),
      h("tbody", {}, ...content.scoring.ratings.map((r) => h("tr", {}, h("td", {}, `${r.min} or more`), h("td", {}, r.label))))),
    h("h2", {}, "Materiality"),
    h("p", {}, `Materiality rates how much the service matters, from 1 (Immaterial) to 5 (Critical), using ${content.materiality.factors.length} factors. The rating is the weighted average of the factors, rounded. If user dependence, organisation dependence or consequence of failure is rated 5, materiality is at least ${content.materiality.floor_minimum}.`),
    h("h2", {}, "Service tiers"),
    h("p", {}, "The materiality rating suggests a service tier. These tier definitions are proposals and haven't been agreed yet."),
    h("div", { class: "table-scroll", tabindex: 0, role: "region", "aria-label": "Service tier definitions" },
      h("table", { class: "tiers" }, h("caption", { class: "visually-hidden" }, "Proposed service tiers"),
        h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "Measure"), ...t.tiers.map((x) => h("th", { scope: "col" }, x.name)))),
        h("tbody", {}, ...rows.map((k) => h("tr", {}, h("th", { scope: "row" }, labels[k] ?? k), ...t.tiers.map((x) => h("td", {}, x[k] ?? ""))))))),
    h("h2", {}, "Licence"),
    h("p", {}, `The question set is licensed under ${content.meta.licence ?? "CC BY 4.0"}. The source code is published on GitHub for peer review.`)) };
}

function sources(content: Content): Page {
  return { title: "Sources", node: h("div", { class: "prose" },
    h("h1", {}, "Sources"),
    h("p", {}, "The standards, legislation and guidance the questions are based on. Links were checked when the question set was released."),
    h("ul", { class: "sources" }, ...content.sources.map((s) => h("li", {},
      h("p", {}, extLink(s.url, s.name)),
      h("p", { class: "hint small" }, [s.publisher, s.status].filter(Boolean).join(". "))))))};
}

function privacy(): Page {
  return { title: "Privacy", node: h("div", { class: "prose" },
    h("h1", {}, "Privacy statement"),
    h("p", {}, "This tool doesn't collect, store or send any personal information. There are no accounts, no tracking and no analytics."),
    h("p", {}, "What you enter is saved only in your own browser's local storage, on your device, so you can come back to it. It stays there until you delete it from the report page or clear your browser data. Anyone with access to your browser profile could see it."),
    h("p", {}, "If you download an assessment file, you control where it goes and who you share it with."),
    h("p", {}, "Links to guidance open other websites, which have their own privacy policies.")) };
}

function accessibility(): Page {
  return { title: "Accessibility", node: h("div", { class: "prose" },
    h("h1", {}, "Accessibility statement"),
    h("p", {}, "This tool aims to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA, in line with the NZ Government Web Accessibility Standard."),
    h("p", {}, "Every change is checked automatically with the ", extLink("https://www.deque.com/axe/axe-core/", "Axe accessibility engine"), ". Automated checks only find some issues, so manual testing with keyboard and screen readers is planned before formal release."),
    h("p", {}, "The text uses ", extLink("https://www.brailleinstitute.org/about-us/news/braille-institute-launches-enhanced-atkinson-hyperlegible-font-to-make-reading-easier/", "Atkinson Hyperlegible"), ", a typeface designed for readers with low vision. Colours are always paired with text, so no information depends on colour alone."),
    h("p", {}, "If something in this tool doesn't work for you, please raise an issue on the project's GitHub page.")) };
}

function notFound(): Page {
  return { title: "Page not found", node: h("div", {},
    h("h1", {}, "Page not found"),
    h("p", {}, "Check the address, or ", h("a", { href: "#/" }, "go to the home page"), ".")) };
}
