// Search and link-preview metadata (domain trust pass, 2026-10-03; CLAUDE.md,
// "Domain trust"). Every title and description is assembled from words that
// are already on the site — the hero line, studies.ts, the case pages' title and
// dek, tools.ts and guides.ts — never new marketing copy, and never trimmed
// mid-sentence: if the joined version runs long, the shorter whole sentence wins.
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
export const describe = (...parts: string[]) => {
  const clean = parts.map(plain).filter(Boolean);
  for (let from = 0; from < clean.length; from++) {
    const joined = clean
      .slice(from)
      .map((p) => (/[.!?]$/.test(p) ? p : `${p}.`))
      .join(' ');
    if (joined.length <= DESCRIPTION_MAX) return joined;
  }
  return clean[clean.length - 1];
};

// The link-preview cards, drawn from scripts/og/og-card.html in the site's own
// stock. A page without its own card uses the home one.
export type OgImage = { src: string; alt: string; width: number; height: number };
const card = (name: string, alt: string): OgImage => ({ src: `/og/${name}.jpg`, alt, width: 1200, height: 630 });
export const ogHome = card('home', 'Uttham Udatthu, design lead, systems thinker and builder: his portrait on an instant print with a hi! sticker');
export const ogCase: Record<string, OgImage> = {
  'a-line-of-card-height': card('a-line-of-card-height', 'From a glance to a decision: the old Meesho product feed beside the new one'),
  'meesho-mall': card('meesho-mall', 'From doubt to desire: the Meesho Mall landing page on a phone'),
};

// The one Person every page points back to. sameAs is the profiles that say
// the same name: LinkedIn (on the contact panel) and the GitHub account that
// owns this site's repository.
export const personId = `${SITE}/#person`;
export const person = {
  '@type': 'Person',
  '@id': personId,
  name: NAME,
  jobTitle: 'Design Lead',
  description: 'Design lead, systems thinker and builder',
  url: `${SITE}/`,
  sameAs: [contact.linkedin, 'https://github.com/udatthu-uttham'],
};
const author = { '@type': 'Person', '@id': personId, name: NAME, url: `${SITE}/` };

// A case study or a tool page: the work, by the Person, with a two-step trail
// back to the homepage.
export const workLd = (p: { url: string; name: string; headline: string; description: string; image: string }) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CreativeWork',
      '@id': `${p.url}#work`,
      url: p.url,
      mainEntityOfPage: p.url,
      name: p.name,
      headline: p.headline,
      description: p.description,
      image: p.image,
      inLanguage: 'en',
      author,
      creator: author,
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
