// Regenerates leads.csv from public/seatview/stadiums.js.
// Usage: node docs/seatview/export-leads.mjs [https://your-domain]
import { readFileSync, writeFileSync } from 'node:fs';
const here = new URL('.', import.meta.url);
const src = readFileSync(new URL('../../public/seatview/stadiums.js', here), 'utf8');
const { VENUES } = await import('data:text/javascript,' + encodeURIComponent(src));
const base = (process.argv[2] || 'https://YOUR-DOMAIN').replace(/\/$/, '');
const wave = { uk: 1, europe: 2, world: 3 };
const arena = v => ['basketball', 'hockey'].includes(v.sport);
const buyer = v => arena(v) ? 'Venue operator (box office / commercial)' : /Ministry|Council|Trust|Venues|Consortium|Operating|Management|LLDC|Sport City|SA$/i.test(v.tenant) ? 'Venue owner / operator' : 'Club or governing body (Head of Ticketing, CRO)';
// Existing 3D seat-view tools found by web search (Nov 2026). "not found" means no evidence turned up, not proof there is none.
const EXISTING = {
  'tottenham': ['yes', 'Ticketmaster Virtual Venue (Jan 2022)'],
  'emirates': ['yes', 'Ticketmaster 3D Virtual Venue, incl. Club & Box level'],
  'hill-dickinson': ['yes', 'Ticketmaster Virtual Venue (Dec 2024)'],
  'celtic-park': ['yes', 'Ticketmaster Virtual Venue'],
  'principality': ['yes', 'Virtual Venue guide on stadium FAQ'],
  'co-op-live': ['yes', 'Ticketmaster Virtual Venue (Jun 2025)'],
  'luz': ['yes', '3D Digital Venue (2021)'],
  'metropolitano': ['likely', '3D Digital Venue built Atletico stadium platform'],
  'twickenham': ['likely', 'named as 3D Digital Venue client'],
  'stamford-bridge': ['partial', '3D seating planner for corporate hospitality'],
  'old-trafford': ['likely', 'listed on 3D Digital Venue seat-view directory'],
  'etihad': ['likely', 'listed on 3D Digital Venue seat-view directory'],
  'anfield': ['likely', 'listed on 3D Digital Venue seat-view directory'],
  'st-james-park': ['likely', 'listed on 3D Digital Venue seat-view directory'],
  'villa-park': ['likely', 'listed on 3D Digital Venue seat-view directory'],
  'yankee': ['resale only', 'StubHub virtual view'],
  'dodger': ['resale only', 'StubHub virtual view'],
  'fenway': ['resale only', 'StubHub virtual view'],
};
const esc = s => /[",\n]/.test(String(s)) ? `"${String(s).replace(/"/g, '""')}"` : String(s);
const rows = VENUES.map(v => ({
  wave: wave[v.region], priority: v.cap >= 50000 || arena(v) ? 'A' : 'B', venue: v.name, city: v.city, country: v.country,
  capacity: v.cap, sport: v.sport, tenant_or_operator: v.tenant, likely_buyer: buyer(v), demo_link: `${base}/seatview/#${v.id}`,
  existing_3d_view: (EXISTING[v.id] || [v.region === 'world' && ['USA', 'Canada'].includes(v.country) ? 'likely' : 'not found'])[0],
  existing_source: (EXISTING[v.id] || [, v.region === 'world' && ['USA', 'Canada'].includes(v.country) ? 'Ticketmaster Virtual Venue covers 110+ N. American venues' : ''])[1],
  status: 'not contacted', contact_name: '', contact_role: '', notes: '',
})).sort((a, b) => a.wave - b.wave || a.priority.localeCompare(b.priority) || b.capacity - a.capacity);
const cols = Object.keys(rows[0]);
writeFileSync(new URL('leads.csv', here), [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n') + '\n');
console.log(`leads.csv: ${rows.length} venues`);
