import type { OutfitItem, OutfitSlot, GeneratedOutfit, ItemCategory } from './types'

const depop = (q: string) => ({ name: 'Depop', url: `https://www.depop.com/search/?q=${encodeURIComponent(q)}`, icon: '♻' })
const asos  = (q: string) => ({ name: 'ASOS',  url: `https://www.asos.com/search/?q=${encodeURIComponent(q)}`,  icon: '⬝' })
const shop  = (q: string) => ({ name: 'Shop',  url: `https://www.google.com/search?q=${encodeURIComponent(q)}&tbm=shop`, icon: '→' })

function makeItem(
  id: string,
  category: ItemCategory,
  name: string,
  brand: string,
  price: number,
  tier: OutfitItem['tier'],
  description: string,
  colors: string[],
  tags: string[],
  searchTerm: string,
): OutfitItem {
  return {
    id, category, name, brand, price, tier, description, colors, tags,
    retailers: [depop(searchTerm), asos(searchTerm), shop(`${brand} ${name}`)],
  }
}

export function generateMockOutfit(prompt: string): GeneratedOutfit {
  const p = prompt.toLowerCase()

  // Dark Academia
  if (p.includes('dark') || p.includes('academia') || p.includes('bookworm')) {
    return darkAcademia()
  }
  // Quiet Luxury / Parisian
  if (p.includes('quiet') || p.includes('luxury') || p.includes('parisian')) {
    return quietLuxury()
  }
  // Gorpcore / outdoor
  if (p.includes('gorp') || p.includes('outdoor') || p.includes('technical')) {
    return gorpcore()
  }
  // Streetwear / skate
  if (p.includes('street') || p.includes('skate') || p.includes('hype')) {
    return streetwear()
  }

  // Default: editorial chic
  return editorialChic()
}

function darkAcademia(): GeneratedOutfit {
  const slots: OutfitSlot[] = [
    {
      category: 'hat',
      label: 'Hat',
      selected: null,
      options: [
        makeItem('h1', 'hat', 'Wide-Brim Wool Fedora', 'Lock & Co.', 420, 'luxury', 'Hand-blocked pure wool felt. The definitive scholarly silhouette.', ['#3d3028','#1a1a1a'], ['wool','vintage'], 'wide brim wool fedora'),
        makeItem('h2', 'hat', 'Vintage Wool Beret', 'Kangol', 65,  'mid',    'Authentic French cut, worn tilted for that studied-carelessness.', ['#2a2018','#4a3828'], ['beret','vintage'], 'wool beret vintage'),
        makeItem('h3', 'hat', 'Thrifted Fedora',    'Depop Find', 18, 'budget', 'Secondhand gem. Check eBay or Depop for original 70s shapes.', ['#5a4a38'], ['thrifted'], 'vintage fedora thrifted'),
        makeItem('h4', 'hat', 'Bucket Hat Tweed',   'Burberry', 280, 'premium', 'House-check tweed in forest tones. Intellectual authority.', ['#3a4028'], ['tweed','burberry'], 'burberry tweed bucket hat'),
      ],
    },
    {
      category: 'outerwear',
      label: 'Outerwear',
      selected: null,
      options: [
        makeItem('o1', 'outerwear', 'Double-Breasted Wool Overcoat',  'Toteme',    1850, 'luxury',  'Camel cashmere-blend. Falls mid-calf, wide lapels. The centrepiece.', ['#c4a47c','#1a1a1a'], ['wool','overcoat'], 'toteme overcoat'),
        makeItem('o2', 'outerwear', 'Heritage Tweed Blazer',           'Cordings',   380, 'premium', 'Donegal tweed with elbow patches. Westminster at its finest.', ['#5a4a30'], ['tweed','blazer'], 'heritage tweed blazer elbow patch'),
        makeItem('o3', 'outerwear', 'Vintage Wool Coat',               'ASOS',        90, 'mid',     'Sourced from ASOS Marketplace vintage. Look for 80s structured shoulders.', ['#3d3028','#4a3820'], ['vintage','wool'], 'vintage wool coat 80s'),
        makeItem('o4', 'outerwear', 'Charity Shop Blazer',             'Thrifted',    12, 'budget',  'Check Oxfam and British Heart Foundation. Tweed or herringbone, ideally.', ['#4a3820'], ['thrifted'], 'vintage blazer charity shop'),
      ],
    },
    {
      category: 'top',
      label: 'Top',
      selected: null,
      options: [
        makeItem('t1', 'top', 'Silk Turtleneck',         'Equipment',  290, 'luxury',  'Pebble-weight silk. Tucked or untucked — both correct.', ['#f0ece3','#1a1a1a','#3d3028'], ['silk','turtleneck'], 'silk turtleneck'),
        makeItem('t2', 'top', 'Merino Roll-Neck',        'Uniqlo',      45, 'mid',     'Fine-gauge merino in cognac or forest green. Workhorse of the genre.', ['#8a5a30','#2a4020'], ['merino','rollneck'], 'merino roll neck jumper'),
        makeItem('t3', 'top', 'Oxford Poplin Shirt',     'Thomas Pink', 180, 'premium', 'White or cream poplin, worn open-collared under a blazer.', ['#fafaf8','#f0ece3'], ['shirt','oxford'], 'oxford poplin shirt'),
        makeItem('t4', 'top', 'Charity Shop Knitwear',   'Thrifted',    10, 'budget',  'Cable-knit or Aran patterns. The more worn-in, the better.', ['#c4a47c','#8a7050'], ['thrifted','knitwear'], 'vintage knitwear charity shop'),
      ],
    },
    {
      category: 'bottom',
      label: 'Bottom',
      selected: null,
      options: [
        makeItem('b1', 'bottom', 'Wide-Leg Herringbone Trousers', 'Ralph Lauren', 650, 'luxury',  'Pleated, high-waisted. The silhouette that launched a thousand dissertations.', ['#3d3028','#2a2418'], ['herringbone','trousers'], 'herringbone wide leg trousers'),
        makeItem('b2', 'bottom', 'Plaid Wool Trousers',           'Zara',          60, 'mid',     'Window-pane or glen plaid in earthy tones. High-waisted works best.', ['#5a4a30','#3a3028'], ['plaid','trousers'], 'plaid wool trousers'),
        makeItem('b3', 'bottom', 'Midi Pleated Skirt',            'COS',           95, 'premium', 'Wool-blend midi length. Knife pleats that move with elegance.', ['#1a1a1a','#3d3028'], ['skirt','pleated'], 'pleated midi skirt wool'),
        makeItem('b4', 'bottom', 'Vintage Cord Trousers',         'Depop Find',    20, 'budget',  'Corduroy in brown or forest. Wide-leg, from any decent vintage dealer.', ['#5a3a20','#2a4020'], ['corduroy','vintage'], 'vintage corduroy trousers wide leg'),
      ],
    },
    {
      category: 'bag',
      label: 'Bag',
      selected: null,
      options: [
        makeItem('bg1', 'bag', 'Leather Satchel Bag',     'Cambridge Satchel', 220, 'premium', 'British-made. The original scholar\'s companion. Tan or burgundy.', ['#8a4a20','#5a2018'], ['leather','satchel'], 'cambridge satchel leather'),
        makeItem('bg2', 'bag', 'Mini Hermès Kelly',        'Hermès',           9500, 'luxury',  'The gold standard. Box calf, gold hardware. Investment dressing.', ['#8a4a20'], ['hermes','kelly'], 'hermes kelly bag'),
        makeItem('bg3', 'bag', 'Woven Leather Tote',       'Mango',              75, 'mid',     'Clean lines, minimal hardware. Books and journals fit perfectly.', ['#c4a47c','#3d3028'], ['tote','leather'], 'woven leather tote bag'),
        makeItem('bg4', 'bag', 'Canvas Book Bag',          'Depop Find',          8, 'budget',  'Battered canvas, ideally with something written on it. Literary credential.', ['#c4a47c','#f0ece3'], ['canvas','tote'], 'canvas tote bag vintage'),
      ],
    },
    {
      category: 'shoes',
      label: 'Shoes',
      selected: null,
      options: [
        makeItem('s1', 'shoes', 'Leather Oxford Brogues',   'Loake',       350, 'premium', 'Goodyear-welted, dainite sole. Will outlast your actual education.', ['#3d2010','#1a1a1a'], ['leather','oxford'], 'leather brogue oxford'),
        makeItem('s2', 'shoes', 'Suede Chelsea Boots',      'Church\'s',   680, 'luxury',  'Tan suede, elastic gusset. The appropriate footwear for everything.', ['#8a5a30','#5a3a20'], ['suede','chelsea'], 'suede chelsea boots brown'),
        makeItem('s3', 'shoes', 'Mary Jane Block Heels',    'ASOS',         65, 'mid',     'Low block heel, two-strap. Pairs impeccably with wide-leg trousers.', ['#1a1a1a','#8a4a20'], ['maryjane','heels'], 'mary jane block heel shoes'),
        makeItem('s4', 'shoes', 'Vintage Leather Loafers',  'Depop Find',   22, 'budget',  'Any decade will do. Slip-on ease, scholarly credibility.', ['#3d2010','#1a1a1a'], ['loafers','vintage'], 'vintage leather loafers'),
      ],
    },
  ]
  return {
    vibeName: 'The Studied Scholar',
    trendScore: 8.4,
    trendStatus: 'Timeless Classic',
    summary: 'Dark academia is less a trend than a state of mind — all tweed, leather, dim libraries and the suggestion that you are perpetually between brilliant thoughts.',
    outfitEquation: 'wool overcoat + roll-neck + herringbone trouser + brogue = intellectual authority',
    stylingNotes: [
      'Layer the roll-neck under the blazer, never under and over — one or the other.',
      'Allow the trouser break to graze the top of your shoe, no shorter.',
      'The hat should look as though you\'ve owned it since university.',
    ],
    sustainabilityScore: 72,
    slots,
  }
}

function quietLuxury(): GeneratedOutfit {
  const slots: OutfitSlot[] = [
    {
      category: 'outerwear', label: 'Outerwear', selected: null,
      options: [
        makeItem('ql-o1', 'outerwear', 'Cashmere Long Coat',      'The Row',    3800, 'luxury',  'Oatmeal cashmere. No logos. This is the pinnacle.', ['#e8dcc8','#c4b898'], ['cashmere','luxury'], 'cashmere long coat cream'),
        makeItem('ql-o2', 'outerwear', 'Wool-Cashmere Blend Coat', 'Toteme',     980, 'premium', 'Ecru or camel. Straight-cut, below knee. Silent confidence.', ['#c8b88a','#e8dcc8'], ['wool','cashmere'], 'toteme wool coat'),
        makeItem('ql-o3', 'outerwear', 'Tailored Blazer',          'Arket',      220, 'mid',     'Boxy, double-breasted in cream or oatmeal. No fastening required.', ['#e8dcc8','#f0e8d8'], ['blazer','tailored'], 'cream tailored blazer'),
        makeItem('ql-o4', 'outerwear', 'Vintage Camel Coat',       'Depop Find',  45, 'budget',  'Search "camel wool coat vintage". Longer the better.', ['#c8a870'], ['vintage','camel'], 'camel coat vintage'),
      ],
    },
    {
      category: 'top', label: 'Top', selected: null,
      options: [
        makeItem('ql-t1', 'top', 'Lightweight Cashmere Knit',   'Brunello Cucinelli', 950, 'luxury',  'Oyster or ecru. Whisper-weight. Tuck half into trousers.', ['#e8dcc8','#c4b898'], ['cashmere'], 'cashmere knit top'),
        makeItem('ql-t2', 'top', 'Silk Slip Cami',              'Equipment',           290, 'premium', 'In champagne or ivory. Visible bra strap: intentional.', ['#f0e8d0','#e8d8c0'], ['silk','cami'], 'silk cami top'),
        makeItem('ql-t3', 'top', 'Ribbed Tank',                 'Zara',                 28, 'mid',     'Stretch rib in neutral. Foundation piece for every quiet luxury look.', ['#e8dcc8','#f0ece3'], ['ribbed','tank'], 'ribbed tank top neutral'),
        makeItem('ql-t4', 'top', 'Linen Poplin Shirt',          'Uniqlo',               35, 'budget',  'White or cream. Barely-tucked, collar open.', ['#fafaf8'], ['linen','shirt'], 'linen shirt white'),
      ],
    },
    {
      category: 'bottom', label: 'Bottom', selected: null,
      options: [
        makeItem('ql-b1', 'bottom', 'Wide-Leg Wool Trousers', 'The Row',  1200, 'luxury',  'Oatmeal or stone. High-rise, draping. Perfection.', ['#e8dcc8','#c8b898'], ['wool','wide-leg'], 'wide leg wool trousers cream'),
        makeItem('ql-b2', 'bottom', 'Tailored Straight Trousers', 'Arket',  160, 'premium', 'Cream or camel ponte. Mid-rise, clean line.', ['#e8dcc8'], ['tailored','trousers'], 'tailored straight trousers'),
        makeItem('ql-b3', 'bottom', 'Linen Wide-Leg Trousers', 'Zara',      55, 'mid',     'Linen-blend in ecru. Wrinkles are part of it.', ['#e8d8b8'], ['linen','wide-leg'], 'linen wide leg trousers'),
        makeItem('ql-b4', 'bottom', 'Cream Denim Straight', 'Primark',      18, 'budget',  'Clean, no distressing. Cream or raw-hem white.', ['#f0ece3'], ['denim','straight'], 'cream straight jeans'),
      ],
    },
    {
      category: 'bag', label: 'Bag', selected: null,
      options: [
        makeItem('ql-bg1', 'bag', 'Birkin 30',        'Hermès',      18000, 'luxury',  'Togo leather, gold hardware. The original. No explanation required.', ['#c4a47c','#e8dcc8'], ['hermes'], 'hermes birkin'),
        makeItem('ql-bg2', 'bag', 'Cassette Bag',     'Bottega Veneta', 2800, 'luxury', 'Intrecciato weave in oyster or clay. The understated flex.', ['#c8b898'], ['bottega','woven'], 'bottega veneta cassette'),
        makeItem('ql-bg3', 'bag', 'Structured Tote',  'Mango',         110, 'mid',     'Clean rectangular tote in cream leather. No logos.', ['#e8dcc8'], ['tote','leather'], 'structured leather tote cream'),
        makeItem('ql-bg4', 'bag', 'Simple Leather Bag','Depop Find',    30, 'budget',  'Search "minimal leather shoulder bag". Unbranded preferred.', ['#c4a47c','#e8d8b8'], ['leather','minimal'], 'minimal leather bag'),
      ],
    },
    {
      category: 'shoes', label: 'Shoes', selected: null,
      options: [
        makeItem('ql-s1', 'shoes', 'Kitten Heel Mule',    'Manolo Blahnik', 680, 'luxury',  'Nude to you. Square toe, minimal hardware. Perfect proportion.', ['#c8b898','#e8d8c0'], ['kitten','mule'], 'kitten heel mule shoe'),
        makeItem('ql-s2', 'shoes', 'Ballet Flat',          'Toteme',         380, 'premium', 'Tan or nude calf leather. Ribbon tie optional.', ['#c4a47c','#e8d8c0'], ['ballet','flat'], 'ballet flat leather'),
        makeItem('ql-s3', 'shoes', 'Pointed Flat Loafer',  'COS',             90, 'mid',     'Clean lines, no embellishment. In cream or sand.', ['#c8b898'], ['loafer','pointed'], 'pointed flat loafer cream'),
        makeItem('ql-s4', 'shoes', 'Simple Leather Flat',  'Primark',         20, 'budget',  'Plain leather-look flat. Let the rest do the talking.', ['#c8b898','#1a1a1a'], ['flat','leather'], 'plain leather flat shoe'),
      ],
    },
  ]
  return {
    vibeName: 'The Quiet Authority',
    trendScore: 9.1,
    trendStatus: 'Trending Now',
    summary: 'No logos. No noise. Just extraordinary fabric and the confidence that comes from not needing to explain yourself. Quiet luxury speaks in cashmere and restraint.',
    outfitEquation: 'cashmere knit + wide-leg trouser + leather flat + structured bag = old money without the inheritance',
    stylingNotes: [
      'Everything should fit as though it was made for you, even when it wasn\'t.',
      'Neutrals only. If in doubt, choose oatmeal.',
      'One gold piece of jewellery. Never more.',
    ],
    sustainabilityScore: 40,
    slots,
  }
}

function gorpcore(): GeneratedOutfit {
  const slots: OutfitSlot[] = [
    {
      category: 'outerwear', label: 'Outerwear', selected: null,
      options: [
        makeItem('gc-o1', 'outerwear', 'GORE-TEX Shell Jacket',   'Arc\'teryx',    700, 'luxury',  'Alpha SV or equivalent. Weatherproof monument to technical excellence.', ['#2a3428','#1a2a1a'], ['gore-tex','technical'], 'arcteryx shell jacket'),
        makeItem('gc-o2', 'outerwear', 'Fleece-Lined Jacket',     'Patagonia',     240, 'premium', 'Synchilla or similar. Worn unbuttoned, slightly too large.', ['#3a4a28','#8a7a50'], ['fleece','patagonia'], 'patagonia fleece jacket'),
        makeItem('gc-o3', 'outerwear', 'Trail Windbreaker',       'The North Face', 95, 'mid',     'Packable, technical, functional. In earth or muted tones only.', ['#4a5a38','#3a3a28'], ['windbreaker','trail'], 'trail windbreaker jacket'),
        makeItem('gc-o4', 'outerwear', 'Vintage Anorak',          'Depop Find',     25, 'budget',  'Any outdoor brand from the 90s. Check Berghaus, Karrimor, Helly Hansen.', ['#5a6a40','#3a4a30'], ['vintage','anorak'], 'vintage anorak outdoor'),
      ],
    },
    {
      category: 'top', label: 'Top', selected: null,
      options: [
        makeItem('gc-t1', 'top', 'Merino Base Layer',    'Icebreaker',  150, 'premium', '200-weight merino. The foundation of all intelligent dressing.', ['#5a6a40','#c8b898'], ['merino','baselayer'], 'merino base layer top'),
        makeItem('gc-t2', 'top', 'Technical Long-Sleeve', 'Salomon',    120, 'mid',     'DRY nylon blend. Fitted, moisture-wicking, unexpectedly stylish.', ['#3a4a38','#1a1a1a'], ['technical','longsleeve'], 'technical long sleeve top'),
        makeItem('gc-t3', 'top', 'Patterned Thermal',    'Uniqlo',       25, 'budget',  'HEATTECH long-sleeve in olive or forest. Worn as a standalone.', ['#3a4a28','#4a3a20'], ['thermal','longsleeve'], 'heattech thermal top'),
        makeItem('gc-t4', 'top', 'Mountain Research Tee', 'Mountain Research', 95, 'mid', 'Japanese outdoor label. Graphic or plain, both work.', ['#5a6a40'], ['graphic','tee'], 'mountain research t-shirt'),
      ],
    },
    {
      category: 'bottom', label: 'Bottom', selected: null,
      options: [
        makeItem('gc-b1', 'bottom', 'Tactical Cargo Trousers', 'Arc\'teryx',  480, 'luxury',  'Atom or similar. Articulated knee, DWR finish. Technical authority.', ['#3a4a28','#2a3a20'], ['cargo','technical'], 'arcteryx cargo trousers'),
        makeItem('gc-b2', 'bottom', 'Outdoor Technical Pant', 'Patagonia',   195, 'premium', 'Quandary or similar. Clean-cut outdoor utility.', ['#4a5a38','#3a4a28'], ['outdoor','pant'], 'patagonia outdoor pant'),
        makeItem('gc-b3', 'bottom', 'Trail Running Short',    'Salomon',      75, 'mid',     'Worn over compression tight for the full look.', ['#2a3428'], ['shorts','trail'], 'trail running shorts'),
        makeItem('gc-b4', 'bottom', 'Cargo Trousers',         'Primark',      20, 'budget',  'Simple cargo in olive or khaki. Wide-leg.', ['#5a6a40','#3a4a20'], ['cargo','trousers'], 'cargo trousers olive'),
      ],
    },
    {
      category: 'shoes', label: 'Shoes', selected: null,
      options: [
        makeItem('gc-s1', 'shoes', 'Trail Running Shoe',      'Salomon XT-6',  160, 'premium', 'Chunky sole, aggressive tread. The gorpcore icon.', ['#2a3428','#8a4a20'], ['trail','runners'], 'salomon xt-6 trail shoe'),
        makeItem('gc-s2', 'shoes', 'Gore-Tex Hiking Boot',    'Danner',         380, 'luxury',  'Full-grain leather, Vibram sole. Outlasts everything.', ['#3d2010','#1a1a1a'], ['hiking','boot'], 'gore-tex hiking boot leather'),
        makeItem('gc-s3', 'shoes', 'Waterproof Sneaker',      'On Running',     150, 'mid',     'Cloudventure or similar. Clean outdoor aesthetic.', ['#1a1a1a','#5a6a40'], ['waterproof','sneaker'], 'waterproof trail sneaker'),
        makeItem('gc-s4', 'shoes', 'Old-School Trail Runner', 'New Balance',     80, 'budget',  '993 or similar chunky runner. Works for street as well as trail.', ['#8a8880','#1a1a1a'], ['trail','runner'], 'new balance trail runner'),
      ],
    },
    {
      category: 'bag', label: 'Bag', selected: null,
      options: [
        makeItem('gc-bg1', 'bag', 'Technical Daypack',   'Arc\'teryx', 350, 'luxury',  'Granville or similar. Clean, urban-technical, no external strapping.', ['#1a1a1a','#2a3428'], ['backpack','technical'], 'arcteryx daypack backpack'),
        makeItem('gc-bg2', 'bag', 'Running Vest',        'Salomon',    120, 'premium', 'Worn as a top layer. Ultra hydration vest for the committed.', ['#2a3428'], ['vest','running'], 'salomon running vest'),
        makeItem('gc-bg3', 'bag', 'Padded Shoulder Bag', 'Eastpak',     55, 'mid',     'Technical padded small messenger. Keeps equipment safe.', ['#1a1a1a','#3a4a28'], ['messenger','padded'], 'padded shoulder bag'),
        makeItem('gc-bg4', 'bag', 'Utility Bum Bag',     'Depop Find',  15, 'budget',  'Any technical bum bag, ideally in forest or stone.', ['#5a6a40','#4a3a20'], ['bumbag','utility'], 'utility bum bag outdoor'),
      ],
    },
  ]
  return {
    vibeName: 'The Technical Romantic',
    trendScore: 8.7,
    trendStatus: 'Emerging',
    summary: 'Gorpcore is outdoor performance gear worn as fashion — and worn well. The appeal is in the contrast: technical seriousness against everyday urban context.',
    outfitEquation: 'shell jacket + technical base layer + cargo pant + trail runner = mountain-ready street credibility',
    stylingNotes: [
      'Earth tones and technical blacks only. No bright primary colours.',
      'Mix performance levels — a luxury shell with budget cargo is part of the point.',
      'The bag should suggest you could leave for a trail at any moment.',
    ],
    sustainabilityScore: 58,
    slots,
  }
}

function streetwear(): GeneratedOutfit {
  const slots: OutfitSlot[] = [
    {
      category: 'outerwear', label: 'Outerwear', selected: null,
      options: [
        makeItem('sw-o1', 'outerwear', 'Varsity Jacket',     'Needles',      420, 'luxury',  'Rebuild series. Patchwork, intentionally clashing. Japanese archive gold.', ['#1a1a1a','#8a1a1a'], ['varsity','japanese'], 'needles rebuild varsity jacket'),
        makeItem('sw-o2', 'outerwear', 'Coach Jacket',       'Supreme',      280, 'premium', 'Seasonal, classic shape. Worn oversized.', ['#1a1a1a','#3a3a28'], ['coach','jacket'], 'supreme coach jacket'),
        makeItem('sw-o3', 'outerwear', 'Cargo Puffer',       'Nike',         180, 'mid',     'Oversized insulation, multiple pockets. Utility credibility.', ['#1a1a1a','#3a3a28'], ['puffer','cargo'], 'nike cargo puffer jacket'),
        makeItem('sw-o4', 'outerwear', 'Vintage Windbreaker','Depop Find',    20, 'budget',  'Retro Nike or Adidas from the archive. Shell-suit energy is acceptable.', ['#1a1a4a','#3a1a1a'], ['vintage','windbreaker'], 'vintage windbreaker nike adidas'),
      ],
    },
    {
      category: 'top', label: 'Top', selected: null,
      options: [
        makeItem('sw-t1', 'top', 'Graphic Tee',    'Palace',     80, 'mid',     'Season release. Worn under an open overshirt.', ['#f0ece3','#1a1a1a'], ['graphic','tee'], 'palace graphic t-shirt'),
        makeItem('sw-t2', 'top', 'Logo Crewneck',  'Stone Island', 350, 'luxury', 'Ribbed cuffs, arm badge. The OG outdoor-streetwear hybrid.', ['#1a1a1a','#4a3a20'], ['crewneck','logo'], 'stone island crewneck'),
        makeItem('sw-t3', 'top', 'Long-Sleeve Tee','Carhartt WIP', 65, 'mid',    'Chest logo, boxy fit. Foundational piece of the genre.', ['#1a1a1a','#3a3a28'], ['longsleeve','carhartt'], 'carhartt long sleeve t-shirt'),
        makeItem('sw-t4', 'top', 'Vintage Tee',    'Depop Find',   12, 'budget', 'Band tee or sports team. The more faded, the better.', ['#f0ece3','#c8b898'], ['vintage','tee'], 'vintage graphic t-shirt'),
      ],
    },
    {
      category: 'bottom', label: 'Bottom', selected: null,
      options: [
        makeItem('sw-b1', 'bottom', 'Baggy Jeans',         'Levi\'s 550',   160, 'premium', 'Relaxed, high-waisted, slight taper. The current shape.', ['#3a4a6a','#1a2a4a'], ['jeans','baggy'], 'levis 550 baggy jeans'),
        makeItem('sw-b2', 'bottom', 'Nylon Track Pant',    'Nike ACG',      140, 'mid',     'Shell fabric, tapered. Wearable everywhere you need to move fast.', ['#1a1a1a','#2a3a1a'], ['trackpant','nylon'], 'nylon track pants'),
        makeItem('sw-b3', 'bottom', 'Cargo Shorts',        'Carhartt WIP',   75, 'mid',     'Work-style cargo. Mid-thigh, multiple pockets.', ['#5a4a30','#3a3a28'], ['cargo','shorts'], 'cargo shorts'),
        makeItem('sw-b4', 'bottom', 'Vintage Jeans',       'Depop Find',     25, 'budget',  'Wrangler or Lee from Depop. Loose fit, light wash.', ['#3a4a6a'], ['vintage','jeans'], 'vintage loose fit jeans'),
      ],
    },
    {
      category: 'shoes', label: 'Shoes', selected: null,
      options: [
        makeItem('sw-s1', 'shoes', 'Air Jordan 1',        'Nike',          180, 'premium', 'OG colourway. Chicago, Bred, or Shadow. The original flex.', ['#1a1a1a','#8a1a1a'], ['jordan','sneaker'], 'air jordan 1 retro'),
        makeItem('sw-s2', 'shoes', 'Yeezy 350',           'Adidas',        320, 'luxury',  'Boost cushion, Primeknit upper. Still the shoe for a reason.', ['#c8b898','#3a3a28'], ['yeezy','sneaker'], 'yeezy 350 boost sneaker'),
        makeItem('sw-s3', 'shoes', 'AF1 Low',             'Nike',           90, 'mid',     'All white or triple-black. The utility sneaker.', ['#fafaf8','#1a1a1a'], ['af1','sneaker'], 'nike air force 1'),
        makeItem('sw-s4', 'shoes', 'Vintage Trainer',     'Depop Find',     35, 'budget',  'New Balance 574 or similar from Depop. Heritage shape in deadstock.', ['#c8b898','#1a1a1a'], ['vintage','trainer'], 'vintage new balance trainer'),
      ],
    },
    {
      category: 'bag', label: 'Bag', selected: null,
      options: [
        makeItem('sw-bg1', 'bag', 'Mini Backpack',    'Supreme',       200, 'premium', 'Logo backpack. Small, function over form.', ['#1a1a1a'], ['backpack','supreme'], 'supreme mini backpack'),
        makeItem('sw-bg2', 'bag', 'Crossbody Bag',    'Carhartt WIP',   80, 'mid',     'Essential crossbody. Multiple compartments, durable.', ['#3a3a28','#1a1a1a'], ['crossbody','carhartt'], 'carhartt crossbody bag'),
        makeItem('sw-bg3', 'bag', 'Vintage Tote',     'Depop Find',     10, 'budget',  'Screen-printed canvas from any cultural institution or band.', ['#f0ece3'], ['tote','canvas'], 'canvas tote bag vintage'),
        makeItem('sw-bg4', 'bag', 'Technical Sling',  'Nike',           45, 'mid',     'Heritage sling. One strap, multiple zip pockets.', ['#1a1a1a'], ['sling','nike'], 'nike heritage sling bag'),
      ],
    },
  ]
  return {
    vibeName: 'The Archive Edit',
    trendScore: 7.8,
    trendStatus: 'Trending Now',
    summary: 'Streetwear in 2026 is about the archive — not the drop. Knowing the references matters more than owning the latest piece. Vintage with intention.',
    outfitEquation: 'graphic tee + baggy denim + heritage trainer + crossbody = knowing the history',
    stylingNotes: [
      'One statement piece max. Everything else supports it.',
      'Proportion is everything: oversized top, tapered or baggy bottom.',
      'The vintage-to-new ratio should be at least 2:1.',
    ],
    sustainabilityScore: 68,
    slots,
  }
}

function editorialChic(): GeneratedOutfit {
  const slots: OutfitSlot[] = [
    {
      category: 'hat', label: 'Hat', selected: null,
      options: [
        makeItem('ec-h1', 'hat', 'Wide Brim Felt Hat',  'Maison Michel',  480, 'luxury',  'French-made. Rabbit felt. The hat that ends discussions.', ['#1a1a1a','#3d3028'], ['felt','brim'], 'maison michel wide brim hat'),
        makeItem('ec-h2', 'hat', 'Structured Cap',      'Jacquemus',      150, 'premium', 'La Casquette in any neutral. Fashion-week standard.', ['#c8b898','#1a1a1a'], ['cap','structured'], 'jacquemus la casquette'),
        makeItem('ec-h3', 'hat', 'Bucket Hat',          'Carhartt WIP',    50, 'mid',     'Washed cotton, droopy brim. Versatile enough for everything.', ['#3a3a28','#5a4a30'], ['bucket','cotton'], 'carhartt bucket hat'),
        makeItem('ec-h4', 'hat', 'Thrifted Cloche',     'Charity Shop',    12, 'budget',  'Any 1920s-inspired cloche. Editorial by default.', ['#1a1a1a','#3d3028'], ['cloche','thrifted'], 'vintage cloche hat'),
      ],
    },
    {
      category: 'outerwear', label: 'Outerwear', selected: null,
      options: [
        makeItem('ec-o1', 'outerwear', 'Leather Trench Coat',   'Bottega Veneta', 4200, 'luxury',  'Butter-soft lamb nappa. Structured shoulders, belted waist. Icon.', ['#8a6a40','#1a1a1a'], ['leather','trench'], 'leather trench coat'),
        makeItem('ec-o2', 'outerwear', 'Structured Wool Blazer', 'Jacquemus',      480, 'premium', 'Oversize shoulder, strong construction. Worn loose.', ['#c8b898','#1a1a1a'], ['blazer','structured'], 'structured wool blazer oversized'),
        makeItem('ec-o3', 'outerwear', 'Trench Coat',            'Zara',            90, 'mid',     'Classic shape in camel or ecru. Mid-length, belted.', ['#c8a870','#e8dcc8'], ['trench','camel'], 'trench coat camel'),
        makeItem('ec-o4', 'outerwear', 'Vintage Blazer',         'Depop Find',      18, 'budget',  'Any decade. Oversized shoulders preferred.', ['#3a3028','#5a4a30'], ['vintage','blazer'], 'vintage oversized blazer'),
      ],
    },
    {
      category: 'top', label: 'Top', selected: null,
      options: [
        makeItem('ec-t1', 'top', 'Sheer Silk Blouse',   'Nanushka',  380, 'premium', 'Fluid, semi-sheer. Tucked loosely, one button open too many.', ['#f0ece3','#c8b898'], ['silk','blouse'], 'sheer silk blouse'),
        makeItem('ec-t2', 'top', 'Ribbed Scoop Tank',   'Toteme',    180, 'premium', 'Second-skin rib in black or ecru. The perfect base.', ['#1a1a1a','#e8dcc8'], ['ribbed','tank'], 'ribbed scoop neck tank'),
        makeItem('ec-t3', 'top', 'Basic Camisole',      'COS',        35, 'mid',     'Slip cami in ivory or nude. Foundation of the modern wardrobe.', ['#e8dcc8','#c8b898'], ['cami','slip'], 'satin camisole top'),
        makeItem('ec-t4', 'top', 'Vintage Silk Shirt',  'Depop Find', 20, 'budget',  'Printed or plain. From any era. The more fluid, the better.', ['#e8dcc8'], ['vintage','silk'], 'vintage silk shirt'),
      ],
    },
    {
      category: 'bottom', label: 'Bottom', selected: null,
      options: [
        makeItem('ec-b1', 'bottom', 'Satin Bias-Cut Skirt', 'The Row',  990, 'luxury',  'True bias-cut satin. Moves like water. Worn floor-length.', ['#c8b898','#1a1a1a'], ['satin','bias-cut'], 'satin bias cut skirt'),
        makeItem('ec-b2', 'bottom', 'Tailored Wide Trousers', 'Toteme', 340, 'premium', 'High-rise, wide, creased. In stone or black.', ['#e8dcc8','#1a1a1a'], ['wide-leg','tailored'], 'wide leg tailored trousers'),
        makeItem('ec-b3', 'bottom', 'Satin Midi Skirt',      'Mango',    65, 'mid',     'Bias-cut approximation. In champagne or black satin.', ['#c8b898','#1a1a1a'], ['satin','midi'], 'satin midi skirt'),
        makeItem('ec-b4', 'bottom', 'Vintage Slip Skirt',    'Depop',    15, 'budget',  'Any 90s slip. Layered under or worn solo.', ['#c8b898'], ['slip','vintage'], 'vintage slip skirt 90s'),
      ],
    },
    {
      category: 'bag', label: 'Bag', selected: null,
      options: [
        makeItem('ec-bg1', 'bag', 'Chanel Classic Flap', 'Chanel',   8500, 'luxury',  'Lambskin or caviar. Chain strap. The definitive bag.', ['#1a1a1a','#c8a870'], ['chanel','flap'], 'chanel classic flap bag'),
        makeItem('ec-bg2', 'bag', 'Mini Cloud Bag',      'Jacquemus', 550, 'premium', 'Le Chiquito. Conceptually small. Actually worn.', ['#c8b898','#1a1a1a'], ['jacquemus','mini'], 'jacquemus mini bag'),
        makeItem('ec-bg3', 'bag', 'Crescent Bag',        'Mango',      85, 'mid',     'Half-moon shoulder bag. Sculptural shape at an accessible price.', ['#8a6a40','#1a1a1a'], ['crescent','shoulder'], 'crescent moon shoulder bag'),
        makeItem('ec-bg4', 'bag', 'Vintage Clutch',      'Depop Find', 15, 'budget',  'Any beaded, silk, or satin clutch from any era.', ['#c8b898'], ['clutch','vintage'], 'vintage clutch bag'),
      ],
    },
    {
      category: 'shoes', label: 'Shoes', selected: null,
      options: [
        makeItem('ec-s1', 'shoes', 'Strappy Heel Sandal',  'The Row',    980, 'luxury',  'Minimal, architectural. In nude to foot tone.', ['#c8b898'], ['sandal','heel'], 'strappy heel sandal minimal'),
        makeItem('ec-s2', 'shoes', 'Pointed Kitten Heel',  'Gianvito Rossi', 620, 'luxury', 'The Margaux slingback. Perpetually correct.', ['#c8b898','#1a1a1a'], ['kitten','pointed'], 'gianvito rossi margaux'),
        makeItem('ec-s3', 'shoes', 'Square-Toe Mule',      'Zara',          45, 'mid',     'Block heel, square toe. The fashion-girl default.', ['#1a1a1a','#c8b898'], ['mule','square-toe'], 'square toe mule heels'),
        makeItem('ec-s4', 'shoes', 'Vintage Slingback',    'Depop Find',     25, 'budget',  'Any decade with a pointy or square toe. Never round.', ['#c8b898','#1a1a1a'], ['slingback','vintage'], 'vintage slingback shoes'),
      ],
    },
  ]
  return {
    vibeName: 'The Editorial Dream',
    trendScore: 8.8,
    trendStatus: 'Timeless Classic',
    summary: 'This is fashion at its most deliberately considered — each piece selected not for trend but for effect. The look that says you have somewhere important to be, and people will be watching.',
    outfitEquation: 'silk blouse + bias-cut skirt + kitten heel + structured bag = the cover shot',
    stylingNotes: [
      'The blouse tuck should be deliberate but appear accidental.',
      'Bare legs in winter. Opaque black tights in summer. There are no rules.',
      'Jewellery is architectural. One piece, statement scale.',
    ],
    sustainabilityScore: 52,
    slots,
  }
}
