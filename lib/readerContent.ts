/**
 * Text-only rendition of every slide for the mobile reader (and as a complete,
 * accessible transcript). Built from lib/slideContent.ts so the two never drift.
 */
import { formatPercent, formatVND } from "./format";
import {
  ILLUSTRATIVE_LABEL,
  benefits,
  billingCycle,
  cardNetworks,
  cashbackTerms,
  cashbackTypes,
  cic,
  closing,
  combo,
  debitCredit,
  eligibility,
  fees,
  mcc,
  minimumPayment,
  opening,
  roadmap,
  security,
  slideIndex,
  spending,
  transactionParties,
  utilization,
} from "./slideContent";

export type ReaderTone = "default" | "example" | "caveat" | "warning" | "key";

export type ReaderSection = {
  title?: string;
  tone?: ReaderTone;
  text?: string;
  items?: readonly string[];
  ordered?: boolean;
  rows?: readonly { label: string; value: string }[];
};

export type ReaderSlide = {
  number: number;
  title: string;
  headline: string;
  subheadline?: string;
  sections: ReaderSection[];
};

const key = (text: string): ReaderSection => ({ tone: "key", text });

const sectionsBySlide: Record<string, { headline: string; subheadline?: string; sections: ReaderSection[] }> = {
  opening: {
    headline: opening.headline,
    subheadline: opening.subheadline,
    sections: [{ items: opening.tags }, key(opening.keyMessage)],
  },
  roadmap: {
    headline: roadmap.headline,
    sections: [
      { ordered: true, items: roadmap.chapters.map((c) => `${c.title} (slide ${c.slides})`) },
      key(roadmap.keyMessage),
    ],
  },
  "debit-credit": {
    headline: debitCredit.headline,
    sections: [
      { title: `${debitCredit.debit.label} · ${debitCredit.debit.alias}`, items: debitCredit.debit.points },
      { title: `${debitCredit.credit.label} · ${debitCredit.credit.alias}`, items: debitCredit.credit.points },
      {
        title: ILLUSTRATIVE_LABEL,
        tone: "example",
        items: [`Debit: ${debitCredit.debit.example}`, `Credit: ${debitCredit.credit.example}`],
      },
      key(debitCredit.keyMessage),
    ],
  },
  "transaction-parties": {
    headline: transactionParties.headline,
    sections: [
      { title: "Năm thành phần", ordered: true, items: transactionParties.actors.map((a) => `${a.name}: ${a.description}`) },
      { title: transactionParties.flowTitle, ordered: true, items: transactionParties.flow },
      { title: transactionParties.detailsTitle, tone: "caveat", items: transactionParties.details },
    ],
  },
  "card-networks": {
    headline: cardNetworks.headline,
    sections: [
      { title: "Mạng lưới", items: [cardNetworks.networks.join(" · ")] },
      { title: cardNetworks.rolesTitle, items: cardNetworks.roles },
      { title: cardNetworks.distinctionsTitle, tone: "caveat", items: cardNetworks.distinctions },
      key(cardNetworks.keyMessage),
    ],
  },
  "billing-cycle": {
    headline: billingCycle.headline,
    sections: [
      {
        title: ILLUSTRATIVE_LABEL,
        tone: "example",
        rows: [
          ...billingCycle.events.map((e) => ({ label: e.label, value: e.date })),
          { label: "Khoảng thời gian", value: `${billingCycle.totalDays} ngày` },
        ],
        text: billingCycle.outcome,
      },
      { title: "Định nghĩa", items: billingCycle.definitions.map((d) => `${d.term}: ${d.description}`) },
      { title: "Lưu ý", tone: "caveat", items: billingCycle.caveats },
      key(billingCycle.keyMessage),
    ],
  },
  benefits: {
    headline: benefits.headline,
    sections: [
      { ordered: true, items: benefits.items.map((b) => `${b.title}: ${b.description}`) },
      { title: "Lưu ý", tone: "caveat", items: benefits.caveats },
      key(benefits.keyMessage),
    ],
  },
  "minimum-payment": {
    headline: minimumPayment.headline,
    sections: [
      { title: minimumPayment.full.title, text: minimumPayment.full.description },
      { title: minimumPayment.minimum.title, tone: "warning", text: minimumPayment.minimum.description },
      {
        title: minimumPayment.calculationTitle,
        tone: "example",
        rows: minimumPayment.calculation.inputs,
        text: minimumPayment.calculation.formula,
      },
      { title: "Lưu ý", tone: "caveat", items: minimumPayment.caveats },
      key(minimumPayment.keyMessage),
    ],
  },
  fees: {
    headline: fees.headline,
    sections: [
      ...fees.groups.map((g) => ({
        title: g.title,
        ordered: false,
        items: fees.items
          .filter((f) => f.group === g.id)
          .map((f) => `${f.n}. ${f.name}${f.qualifier ? ` (${f.qualifier})` : ""}`),
      })),
      { title: fees.checklistTitle, items: fees.checklist },
      key(fees.keyMessage),
    ],
  },
  cic: {
    headline: cic.headline,
    sections: [
      { title: cic.aboutTitle, items: cic.about },
      { title: cic.principlesTitle, items: cic.principles },
      { title: cic.oversimplifyTitle, tone: "caveat", items: cic.oversimplify },
      { title: cic.actionsTitle, items: cic.actions },
      key(cic.keyMessage),
    ],
  },
  "cashback-types": {
    headline: cashbackTypes.headline,
    sections: [
      ...cashbackTypes.types.map((t) => ({ title: `${t.n}. ${t.title}`, items: [t.example, t.note] })),
      key(cashbackTypes.keyMessage),
    ],
  },
  mcc: {
    headline: mcc.headline,
    sections: [
      { title: mcc.definitionTitle, text: mcc.definition },
      { title: mcc.impactTitle, items: mcc.impact },
      { title: mcc.examplesTitle, tone: "example", items: mcc.examples },
      { title: mcc.caveatsTitle, tone: "caveat", items: mcc.caveats },
      key(mcc.keyMessage),
    ],
  },
  "cashback-terms": {
    headline: cashbackTerms.headline,
    sections: [
      {
        title: cashbackTerms.filtersTitle,
        ordered: true,
        items: cashbackTerms.filters.map((f) => `${f.title} (${f.term}): ${f.question}`),
      },
      { title: cashbackTerms.exclusionsTitle, tone: "caveat", items: cashbackTerms.exclusions },
      {
        title: cashbackTerms.exampleTitle,
        tone: "example",
        rows: [
          ...cashbackTerms.example.rows,
          { label: cashbackTerms.example.actualLabel, value: cashbackTerms.example.formula },
          { label: cashbackTerms.example.effectiveLabel, value: formatPercent(cashbackTerms.example.effectiveRate) },
        ],
      },
      key(cashbackTerms.keyMessage),
    ],
  },
  spending: {
    headline: spending.headline,
    sections: [
      {
        title: spending.chartTitle,
        tone: "example",
        rows: [
          ...spending.categories.map((c) => ({ label: c.label, value: formatVND(c.amount) })),
          { label: spending.totalLabel, value: `${formatVND(spending.total)}${spending.totalSuffix}` },
        ],
      },
      { title: spending.methodTitle, ordered: true, items: spending.method },
      key(spending.keyMessage),
    ],
  },
  combo: {
    headline: combo.headline,
    sections: [
      { title: "Công thức", text: combo.formula.full },
      {
        title: combo.comparisonTitle,
        tone: "example",
        rows: combo.cards.map((c) => ({
          label: c.name,
          value: `${combo.labels.benefit} ${formatVND(c.benefit)} · ${combo.labels.fees} ${formatVND(c.fees)} · ${combo.labels.net} ${formatVND(c.net, { sign: true })}`,
        })),
      },
      { title: combo.conclusionTitle, items: combo.conclusions },
      { title: combo.rulesTitle, items: combo.rules },
      key(combo.keyMessage),
    ],
  },
  eligibility: {
    headline: eligibility.headline,
    sections: [
      ...eligibility.clusters.map((cl) => ({
        title: cl.title,
        items: eligibility.factors.filter((f) => f.cluster === cl.id).map((f) => `${f.n}. ${f.text}`),
      })),
      { title: "Lưu ý", tone: "caveat" as const, items: eligibility.caveats },
      key(eligibility.keyMessage),
    ],
  },
  utilization: {
    headline: utilization.headline,
    sections: [
      { title: "Định nghĩa", items: utilization.definitions.map((d) => `${d.term}: ${d.description}`) },
      {
        title: utilization.exampleTitle,
        tone: "example",
        rows: utilization.levels.map((l) => ({
          label: `Hạn mức ${formatVND(utilization.limit)}; dư nợ ${formatVND(l.balance)}`,
          value: formatPercent(l.ratio),
        })),
        text: `30%: ${utilization.referenceNote}.`,
      },
      { title: utilization.principlesTitle, items: utilization.principles },
      key(utilization.keyMessage),
    ],
  },
  security: {
    headline: security.headline,
    sections: [
      { title: security.financialTitle, ordered: true, items: security.financialRules },
      { title: security.securityTitle, ordered: true, tone: "warning", items: security.securityRules },
      key(security.keyMessage),
    ],
  },
  closing: {
    headline: closing.headline,
    subheadline: closing.statement,
    sections: [{ items: closing.reminders }, key(closing.finalRule), { text: closing.qa }],
  },
};

export const readerSlides: ReaderSlide[] = slideIndex.map((entry) => {
  const content = sectionsBySlide[entry.id];
  return { number: entry.number, title: entry.title, ...content };
});
