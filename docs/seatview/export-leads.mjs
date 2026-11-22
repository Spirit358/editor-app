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
const esc = s => /[",\n]/.test(String(s)) ? `"${String(s).replace(/"/g, '""')}"` : String(s);
const rows = VENUES.map(v => ({
  wave: wave[v.region], priority: v.cap >= 50000 || arena(v) ? 'A' : 'B', venue: v.name, city: v.city, country: v.country,
  capacity: v.cap, sport: v.sport, tenant_or_operator: v.tenant, likely_buyer: buyer(v), demo_link: `${base}/seatview/#${v.id}`,
  status: 'not contacted', contact_name: '', contact_role: '', notes: '',
})).sort((a, b) => a.wave - b.wave || a.priority.localeCompare(b.priority) || b.capacity - a.capacity);
const cols = Object.keys(rows[0]);
writeFileSync(new URL('leads.csv', here), [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n') + '\n');
console.log(`leads.csv: ${rows.length} venues`);
