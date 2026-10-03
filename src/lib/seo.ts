// Search and link-preview metadata (domain trust pass, 2026-10-03; CLAUDE.md,
// "Domain trust"). Every description is assembled from words that are already
// on the site — the hero line, studies.ts, the case pages' title and dek,
// tools.ts and guides.ts — never new marketing copy, and never trimmed
// mid-sentence: if the joined version runs long, the shorter whole sentence wins.
// Titles are his name plus the terms people search for (the search pass, the
// same day; "The searches the site answers" below): his roles, his employer and
// each page's topic, all of them true and all of them on the site.
import { contact } from '../data/studies';

export const SITE = 'https://uttham.fyi';
export const NAME = 'Uttham Udatthu';

// What search engines show before they cut a line off.
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

// The site's emphasis markup (**, ^^) and the dek's {source} slot, stripped
// for plain-text surfaces.
export const plain = (text: string) =>
  text.replace(/\^\^|\*\*/g, '').replace(/\{source\}/g, '').replace(/\s+/g, ' ').trim();

// Joins whole sentences while they fit, else falls back to the next whole one:
// describe('Title', 'Dek') is "Title. Dek" when that fits in 155 characters,
// otherwise "Dek" alone.
const sentences = (parts: string[]) => parts.map(plain).filter(Boolean).map((p) => (/[.!?]$/.test(p) ? p : `${p}.`));
export const describe = (...parts: string[]) => {
  const clean = sentences(parts);
  for (let from = 0; from < clean.length; from++) {
    const joined = clean.slice(from).join(' ');
    if (joined.length <= DESCRIPTION_MAX) return joined;
  }
  return clean[clean.length - 1];
};
// All of the parts, joined, only if the whole fits; otherwise undefined, so a
// caller can fall back to describe() with other parts.
export const describeWhole = (...parts: string[]) => {
  const joined = sentences(parts).join(' ');
  return joined.length <= DESCRIPTION_MAX ? joined : undefined;
};
// The first whole sentence of a passage, its emphasis stripped.
export const firstSentence = (text: string) => plain(text).split(/(?<=[.!?])\s+/)[0];

// The link-preview cards, drawn from scripts/og/og-card.html in the site's own
// stock. A page without its own card uses the home one.
export type OgImage = { src: string; alt: string; width: number; height: number };
const card = (name: string, alt: string): OgImage => ({ src: `/og/${name}.jpg`, alt, width: 1200, height: 630 });
export const ogHome = card('home', 'Uttham Udatthu, design lead, systems thinker and builder: his portrait on an instant print with a hi! sticker');
export const ogCase: Record<string, OgImage> = {
  'a-line-of-card-height': card('a-line-of-card-height', 'From a glance to a decision: the old Meesho product feed beside the new one'),
  'meesho-mall': card('meesho-mall', 'From doubt to desire: the Meesho Mall landing page on a phone'),
};

// THE SEARCHES THE SITE ANSWERS (Uttham, 2026-10-03: "it should trigger for
// uttham, or product designer, design manager and all relevant scopes I
// hope"). Titles carry his name, the role terms a recruiter types and the
// employer; case and tool titles carry the employer-plus-topic long tail. Every
// term is TRUE and on the site: "design lead" is the hero; "Product Designer"
// is his title in the CV the hero links (Lead Product Designer, Meesho, since
// 2022) and his role on Mall (Senior Product Designer, 2022–2023, which the
// Mall Article carries, not the Person: see workLd); the pod of five is the
// product cards' Role fact. "Design manager" is NOT his title, so nothing here
// claims it — only visible copy he chooses could (see CLAUDE.md, "Domain
// trust"). No meta keywords (Google ignores them) and no hidden text.
//
// The homepage: name, role, employer in the title; the description is the
// hero's lead, word for word. It is his copy ("Uttham's copy is Uttham's"), so
// it is not recast in the third person or given "at Meesho" to carry search
// terms: the title already carries them. Keep it in step with the hero in
// src/pages/index.astro.
export const homeTitle = `${NAME} — Design Lead and Product Designer at Meesho`;
export const homeDescription = 'I’m a design lead, systems thinker and builder. I run the signals at the busy intersections where user needs cross business goals.';

// A case or tool page's search terms. `query` leads the title as a searcher
// would type it; `role` is what he was on that work, added after the name when
// it fits in 60; `about` is the page's subject and `keywords` its topic words,
// both for its JSON-LD only — never a meta keywords tag. A case's keywords are
// followed by its study's own scope (studies.ts).
type Search = { query: string; role?: string; about?: string; keywords: string[] };
export const caseSearch: Record<string, Search> = {
  // the Role fact: "Strategy and design lead for a pod of five"; the dek says
  // "Rethinking Meesho's product card", and its screens are a before and an after
  'a-line-of-card-height': {
    query: 'Meesho product card case study',
    role: 'design lead',
    about: 'Meesho product cards',
    keywords: ['Meesho', 'product card redesign', 'product listing page', 'product design', 'case study'],
  },
  // the Role fact: "Senior Product Designer", 2022–2023
  'meesho-mall': {
    query: 'Meesho Mall case study',
    role: 'product designer',
    about: 'Meesho Mall',
    keywords: ['Meesho Mall', 'Meesho', 'brand trust', 'e-commerce', 'product design', 'case study'],
  },
};
export const toolSearch: Record<string, Search> = {
  // "A research tool that plans, listens, synthesises and remembers", in AI Space
  resona: {
    query: 'Research allrounder: an AI research tool',
    about: 'UX research',
    keywords: ['AI research tool', 'UX research', 'research planning', 'research synthesis', 'research library', 'Meesho'],
  },
  // "A web app that looks like Meesho, with realistic user data, built for better research"
  'realistic-prototype': {
    query: 'Realistic prototype for user research',
    about: 'User research',
    keywords: ['realistic prototype', 'prototyping', 'user research', 'user testing', 'Meesho'],
  },
};

// "<query> — Uttham Udatthu, <role>" when that fits in 60, else without the role.
export const searchTitle = (s: Search) => {
  const full = s.role ? `${s.query} — ${NAME}, ${s.role}` : '';
  return full && full.length <= TITLE_MAX ? full : `${s.query} — ${NAME}`;
};

// The employer, once, so the Person's worksFor and a case's `about` name the
// same thing. Its Wikipedia page ties it to the company search engines know.
export const meesho = {
  '@type': 'Organization',
  '@id': `${SITE}/#meesho`,
  name: 'Meesho',
  url: 'https://www.meesho.com/',
  sameAs: ['https://en.wikipedia.org/wiki/Meesho'],
};

// The one Person every page points back to. sameAs is the profiles that say
// the same name: LinkedIn (on the contact panel) and the GitHub account that
// owns this site's repository. Both handles put the family name first
// (udatthu-uttham), hence the alternateName. Roles, employer and education are
// what the site says (the hero, the case facts, the CV it links); knowsAbout
// is only what the site shows him doing.
export const personId = `${SITE}/#person`;
export const person = {
  '@type': 'Person',
  '@id': personId,
  name: NAME,
  givenName: 'Uttham',
  familyName: 'Udatthu',
  alternateName: 'Udatthu Uttham',
  jobTitle: 'Design Lead',
  description: 'Design lead, systems thinker and builder',
  url: `${SITE}/`,
  worksFor: meesho,
  hasOccupation: [
    // the hero, and the product cards' Role fact
    { '@type': 'Occupation', name: 'Design Lead', description: 'Strategy and design lead for a pod of five at Meesho' },
    // the CV: "Meesho — Lead Product Designer (Apr 2022 – Present)"
    { '@type': 'Occupation', name: 'Product Designer', alternateName: 'Lead Product Designer' },
    // No dated job titles here. The Mall case's Role fact (Senior Product
    // Designer, 2022–2023) overlaps the CV's Lead Product Designer since Apr
    // 2022, and one Person with two titles at one employer for one period reads
    // as a contradiction to anything building a profile from it. A case's role
    // is his role on that work, so it rides on the case's Article (workLd,
    // `role`) instead.
  ],
  knowsAbout: [
    'Product design',
    'Design leadership', // How I lead; a pod of five
    'Product strategy', // Mall's scope
    'Design systems', // the card framework; the CV
    'Information architecture', // "the right information architecture for browsing cards"
    'Interaction design',
    'UX research', // Mall's research rounds; Research allrounder
    'Experiment design', // the product cards' scope
    'E-commerce',
    'Prototyping', // the realistic prototype
    'AI-assisted design workflows', // "Design workflows, boosted by AI."; AI Space
  ],
  // the CV: B.Tech in Industrial Design, 2012–2016
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'National Institute of Technology Rourkela',
    sameAs: 'https://en.wikipedia.org/wiki/National_Institute_of_Technology,_Rourkela',
  },
  sameAs: [contact.linkedin, 'https://github.com/udatthu-uttham'],
};
const author = { '@type': 'Person', '@id': personId, name: NAME, url: `${SITE}/` };

// A case study (an Article) or a tool page (a CreativeWork): the work, by the
// Person, about its topic and the employer, with a two-step trail back to the
// homepage. A case's `role` is the page's own Role fact (and its Timeline, when
// that is a span of years): what he was on that work. It qualifies `creator`
// as a schema.org Role around the same Person, so the Person keeps one current
// set of titles; `author` stays the plain Person, which is what Google reads
// for an Article.
export type WorkRole = { name: string; start?: string; end?: string };
export const workLd = (p: {
  url: string;
  name: string;
  headline: string;
  description: string;
  image: string;
  type?: 'Article' | 'CreativeWork';
  about?: string;
  keywords?: string[];
  role?: WorkRole;
}) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': p.type ?? 'CreativeWork',
      '@id': `${p.url}#work`,
      url: p.url,
      mainEntityOfPage: p.url,
      name: p.name,
      headline: p.headline,
      description: p.description,
      image: p.image,
      inLanguage: 'en',
      // a case study is Meesho work, so it is about Meesho too; a tool is
      // about its subject
      ...(p.type === 'Article' && { articleSection: 'Case study' }),
      ...((p.about || p.type === 'Article') && {
        about: [
          ...(p.about ? [{ '@type': 'Thing', name: p.about }] : []),
          ...(p.type === 'Article' ? [{ '@type': 'Organization', '@id': meesho['@id'], name: meesho.name }] : []),
        ],
      }),
      ...(p.keywords?.length && { keywords: [...new Set(p.keywords)].join(', ') }),
      author,
      creator: p.role
        ? {
            '@type': 'Role',
            roleName: p.role.name,
            ...(p.role.start && { startDate: p.role.start }),
            ...(p.role.end && { endDate: p.role.end }),
            creator: author,
          }
        : author,
      isPartOf: { '@id': `${SITE}/#website` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: NAME, item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: p.name, item: p.url },
      ],
    },
  ],
});

// Warns at build time when a title or description outgrows what a results page
// shows, so a later copy change is caught before it ships.
export const checkLengths = (path: string, title: string, description: string) => {
  if (title.length > TITLE_MAX) console.warn(`[seo] ${path}: title is ${title.length} characters (max ${TITLE_MAX}): ${title}`);
  if (description.length > DESCRIPTION_MAX) console.warn(`[seo] ${path}: description is ${description.length} characters (max ${DESCRIPTION_MAX})`);
};
