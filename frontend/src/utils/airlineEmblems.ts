// High-Resolution Embedded Vector Emblems for Airlines (0ms latency, 100% reliable, zero CORS/network delay)

export const encodeSvgToDataUri = (svg: string): string => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
};

const makeCircleLogo = (
  bgColor: string,
  fgColor: string,
  code: string,
  svgContent: string,
  subText?: string
) => {
  return encodeSvgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgColor}" />
          <stop offset="100%" stop-color="${bgColor}" stop-opacity="0.88" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.18" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#bgGrad)" filter="url(#shadow)" stroke="#ffffff" stroke-width="3" />
      <g transform="translate(10, 10)">
        ${svgContent}
      </g>
      ${subText ? `<text x="60" y="104" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="11" font-weight="900" fill="${fgColor}" text-anchor="middle" letter-spacing="1.5">${subText}</text>` : ''}
    </svg>
  `);
};

export const AIRLINE_EMBLEMS: Record<string, string> = {
  // --- IRAN AIRLINES (شرکت‌های هواپیمایی ایران) ---

  // Iran Air (IR - Homa / هما ایران ایر) - The iconic Homa bird
  IR: makeCircleLogo(
    '#002244',
    '#ffffff',
    'IR',
    `
      <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.4" />
      <path d="M52 14 C70 14 84 27 84 45 C84 61 72 74 56 76 C52 76 46 71 46 67 C46 63 52 59 52 55 C52 49 43 45 34 47 C27 49 25 55 25 61 C25 74 38 82 54 82 C75 82 92 65 92 44 C92 23 72 10 52 10 C32 10 17 23 15 42 C19 31 34 18 52 14 Z" fill="#ffffff" />
      <circle cx="68" cy="30" r="4" fill="#facc15" />
    `,
    'IRAN AIR'
  ),

  // Mahan Air (W5 - هواپیمایی ماهان) - Signature emerald green wings
  W5: makeCircleLogo(
    '#00703c',
    '#ffffff',
    'W5',
    `
      <path d="M14 62 Q50 16 86 62 Q50 38 14 62 Z" fill="#ffffff" />
      <path d="M26 68 Q50 34 74 68 Q50 50 26 68 Z" fill="#ffffff" opacity="0.75" />
      <circle cx="50" cy="30" r="8" fill="#ffffff" />
      <path d="M46 30 L54 30 M50 26 L50 34" stroke="#00703c" stroke-width="2" stroke-linecap="round" />
    `,
    'MAHAN AIR'
  ),

  // Sepehran Airlines (IS - هواپیمایی سپهران) - Red soaring falcon
  IS: makeCircleLogo(
    '#d92128',
    '#ffffff',
    'IS',
    `
      <path d="M18 64 C34 26 66 26 82 64 C68 50 32 50 18 64 Z" fill="#ffffff" />
      <circle cx="50" cy="32" r="10" fill="#ffffff" />
      <path d="M30 72 C44 58 56 58 70 72 C58 64 42 64 30 72 Z" fill="#ffffff" opacity="0.8" />
    `,
    'SEPEHRAN'
  ),

  // Ata Airlines (I3 - هواپیمایی آتا) - Crimson ATA chevron wings
  I3: makeCircleLogo(
    '#c8102e',
    '#ffffff',
    'I3',
    `
      <path d="M24 72 L50 20 L76 72 L62 72 L50 46 L38 72 Z" fill="#ffffff" />
      <path d="M42 60 L50 44 L58 60 Z" fill="#c8102e" />
      <path d="M16 52 Q50 30 84 52 Q50 40 16 52 Z" fill="#facc15" opacity="0.9" />
    `,
    'ATA AIR'
  ),

  // Zagros Airlines (ZV - هواپیمایی زاگرس) - Royal blue Zagros eagle
  ZV: makeCircleLogo(
    '#004b87',
    '#ffffff',
    'ZV',
    `
      <path d="M20 68 L80 24 L58 24 L20 52 Z" fill="#ffffff" />
      <path d="M42 68 L80 42 L80 68 Z" fill="#ffffff" />
      <path d="M30 74 L70 74" stroke="#facc15" stroke-width="3" stroke-linecap="round" />
    `,
    'ZAGROS'
  ),

  // Kish Air (Y9 - هواپیمایی کیش‌ایر) - Azure blue waves & sun
  Y9: makeCircleLogo(
    '#00a3e0',
    '#ffffff',
    'Y9',
    `
      <path d="M16 52 C38 30 62 30 84 52 C64 44 36 44 16 52 Z" fill="#ffffff" />
      <path d="M26 66 C42 48 58 48 74 66 C58 60 42 60 26 66 Z" fill="#ffffff" opacity="0.8" />
      <circle cx="50" cy="28" r="9" fill="#facc15" />
    `,
    'KISH AIR'
  ),

  // Qeshm Air (QB - هواپیمایی قشم‌ایر) - Ruby red stylized bird
  QB: makeCircleLogo(
    '#d71920',
    '#ffffff',
    'QB',
    `
      <path d="M26 38 Q50 12 74 38 Q50 64 26 38 Z" fill="#ffffff" />
      <circle cx="50" cy="56" r="15" fill="#ffffff" />
      <circle cx="50" cy="56" r="7" fill="#d71920" />
    `,
    'QESHM AIR'
  ),

  // Iran Aseman Airlines (EP - هواپیمایی آسمان) - Cobalt blue winged star
  EP: makeCircleLogo(
    '#003399',
    '#ffffff',
    'EP',
    `
      <path d="M20 58 C38 26 62 26 80 58 C62 42 38 42 20 58 Z" fill="#ffffff" />
      <circle cx="50" cy="26" r="8" fill="#facc15" />
      <path d="M50 36 L54 44 L62 44 L56 50 L58 58 L50 52 L42 58 L44 50 L38 44 L46 44 Z" fill="#ffffff" />
    `,
    'ASEMAN'
  ),

  // Taban Air (HH - هواپیمایی تابان) - Orange & golden sunrise
  HH: makeCircleLogo(
    '#e65100',
    '#ffffff',
    'HH',
    `
      <circle cx="50" cy="50" r="30" fill="#ffffff" />
      <circle cx="50" cy="50" r="16" fill="#e65100" />
      <path d="M20 50 L80 50 M50 20 L50 80" stroke="#facc15" stroke-width="3" stroke-linecap="round" />
    `,
    'TABAN AIR'
  ),

  // Caspian Airlines (RV - هواپیمایی کاسپین) - Sea teal wave wings
  RV: makeCircleLogo(
    '#006699',
    '#ffffff',
    'RV',
    `
      <path d="M20 64 Q50 20 80 64 Q50 46 20 64 Z" fill="#ffffff" />
      <path d="M30 72 Q50 40 70 72 Q50 58 30 72 Z" fill="#38bdf8" />
      <circle cx="50" cy="28" r="7" fill="#ffffff" />
    `,
    'CASPIAN'
  ),

  // Meraj Airlines (JI - هواپیمایی معراج) - Regal purple crown wings
  JI: makeCircleLogo(
    '#662d91',
    '#ffffff',
    'JI',
    `
      <path d="M20 62 L50 22 L80 62 L64 62 L50 42 L36 62 Z" fill="#ffffff" />
      <circle cx="50" cy="22" r="6" fill="#facc15" />
      <path d="M36 68 L64 68" stroke="#facc15" stroke-width="3" stroke-linecap="round" />
    `,
    'MERAJ AIR'
  ),

  // Varesh Airlines (VR - هواپیمایی وارش) - Mazandaran emerald rainbird
  VR: makeCircleLogo(
    '#008559',
    '#ffffff',
    'VR',
    `
      <path d="M16 48 Q50 12 84 48 Q50 84 16 48 Z" fill="#ffffff" />
      <circle cx="50" cy="48" r="14" fill="#008559" />
      <path d="M44 48 L56 48" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
    `,
    'VARESH'
  ),

  // FlyPersia (FP - هواپیمایی فلای پرشیا) - Amber eagle
  FP: makeCircleLogo(
    '#f39200',
    '#ffffff',
    'FP',
    `
      <path d="M24 66 L50 26 L76 66 L50 52 Z" fill="#ffffff" />
      <circle cx="50" cy="38" r="6" fill="#f39200" />
      <path d="M34 72 L66 72" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
    `,
    'FLY PERSIA'
  ),

  // Karun Airlines (NV - هواپیمایی کارون / نفت) - Blue oil & sky wings
  NV: makeCircleLogo(
    '#005a9c',
    '#ffffff',
    'NV',
    `
      <path d="M20 64 C42 32 58 32 80 64 Z" fill="#ffffff" />
      <circle cx="50" cy="30" r="8" fill="#facc15" />
      <path d="M32 70 L68 70" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
    `,
    'KARUN AIR'
  ),

  // Pars Air (PR - هواپیمایی پارس‌ایر) - Midnight blue tailwing
  PR: makeCircleLogo(
    '#0f2d59',
    '#ffffff',
    'PR',
    `
      <path d="M22 66 L50 22 L78 66 L50 50 Z" fill="#00a3e0" />
      <path d="M32 66 L50 34 L68 66 Z" fill="#ffffff" />
    `,
    'PARS AIR'
  ),

  // Iran Airtour (B9 / IV - هواپیمایی ایران ایرتور) - Red arrow wings
  B9: makeCircleLogo(
    '#e30613',
    '#ffffff',
    'B9',
    `
      <path d="M26 72 L50 22 L74 72 Z" fill="#ffffff" />
      <circle cx="50" cy="42" r="9" fill="#e30613" />
      <path d="M20 54 L80 54" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
    `,
    'AIR TOUR'
  ),
  IV: makeCircleLogo(
    '#e30613',
    '#ffffff',
    'IV',
    `
      <path d="M26 72 L50 22 L74 72 Z" fill="#ffffff" />
      <circle cx="50" cy="42" r="9" fill="#e30613" />
      <path d="M20 54 L80 54" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
    `,
    'AIR TOUR'
  ),

  // Saha Airlines (IRZ - هواپیمایی ساها) - Blue heraldic crest
  IRZ: makeCircleLogo(
    '#1e40af',
    '#ffffff',
    'IRZ',
    `
      <path d="M18 50 L50 18 L82 50 L50 82 Z" fill="#ffffff" />
      <circle cx="50" cy="50" r="14" fill="#1e40af" />
    `,
    'SAHA AIR'
  ),

  // Chabahar Airlines (IKV - هواپیمایی چابهار) - Sun and sea breeze
  IKV: makeCircleLogo(
    '#ea580c',
    '#ffffff',
    'IKV',
    `
      <path d="M20 64 C38 32 62 32 80 64 Z" fill="#ffffff" />
      <circle cx="50" cy="36" r="9" fill="#ffffff" />
      <path d="M30 70 L70 70" stroke="#0284c7" stroke-width="3" stroke-linecap="round" />
    `,
    'CHABAHAR'
  ),

  // Yazd Air (DZD - هواپیمایی یزد ایر) - Desert gold wings
  DZD: makeCircleLogo(
    '#b45309',
    '#ffffff',
    'DZD',
    `
      <path d="M26 66 L50 22 L74 66 L50 48 Z" fill="#ffffff" />
      <circle cx="50" cy="34" r="7" fill="#facc15" />
    `,
    'YAZD AIR'
  ),

  // Ava Airlines (VAA - هواپیمایی آوا) - Sky azure wings
  VAA: makeCircleLogo(
    '#0284c7',
    '#ffffff',
    'VAA',
    `
      <path d="M20 70 L50 22 L80 70 L64 70 L50 46 L36 70 Z" fill="#38bdf8" />
      <circle cx="50" cy="28" r="7" fill="#ffffff" />
    `,
    'AVA AIR'
  ),

  // Pouya Air (PY - هواپیمایی پویا) - Blue cargo & passenger wings
  PY: makeCircleLogo(
    '#1d4ed8',
    '#ffffff',
    'PY',
    `
      <path d="M16 54 Q50 16 84 54 Q50 36 16 54 Z" fill="#ffffff" />
      <circle cx="50" cy="46" r="10" fill="#ffffff" />
    `,
    'POUYA AIR'
  ),

  // Arvan Airlines (A1 - هواپیمایی آروان)
  A1: makeCircleLogo(
    '#4f46e5',
    '#ffffff',
    'A1',
    `
      <path d="M26 70 L50 26 L74 70 Z" fill="#ffffff" />
      <path d="M38 56 L62 56" stroke="#4f46e5" stroke-width="3" stroke-linecap="round" />
    `,
    'ARVAN'
  ),

  // Tehran Airline (TEH - هواپیمایی طهران)
  TEH: makeCircleLogo(
    '#334155',
    '#ffffff',
    'TEH',
    `
      <path d="M22 66 L50 22 L78 66 Z" fill="#38bdf8" />
      <circle cx="50" cy="42" r="8" fill="#ffffff" />
    `,
    'TEHRAN'
  ),

  // --- MIDDLE EAST & REGIONAL (خاورمیانه و بین‌المللی) ---

  // Turkish Airlines (TK - ترکیش ایرلاینز) - Red circle with white goose/crescent
  TK: makeCircleLogo(
    '#c8102e',
    '#ffffff',
    'TK',
    `
      <circle cx="50" cy="50" r="34" fill="#ffffff" />
      <circle cx="55" cy="50" r="28" fill="#c8102e" />
      <circle cx="64" cy="44" r="5" fill="#ffffff" />
      <path d="M42 46 C50 38 60 38 70 46 C60 42 50 42 42 46 Z" fill="#ffffff" />
    `,
    'TURKISH'
  ),

  // Pegasus Airlines (PC - پگاسوس) - Yellow and red wing
  PC: makeCircleLogo(
    '#f59e0b',
    '#c8102e',
    'PC',
    `
      <path d="M20 64 C38 28 62 28 80 64 C62 48 38 48 20 64 Z" fill="#c8102e" />
      <circle cx="50" cy="36" r="8" fill="#ffffff" />
    `,
    'PEGASUS'
  ),

  // AJet / AnadoluJet (VF)
  VF: makeCircleLogo(
    '#0284c7',
    '#ffffff',
    'VF',
    `
      <path d="M20 64 L50 22 L80 64 Z" fill="#dc2626" />
      <circle cx="50" cy="42" r="8" fill="#ffffff" />
    `,
    'AJET'
  ),

  // SunExpress (XQ)
  XQ: makeCircleLogo(
    '#ea580c',
    '#ffffff',
    'XQ',
    `
      <circle cx="50" cy="50" r="30" fill="#2563eb" />
      <circle cx="50" cy="50" r="16" fill="#facc15" />
    `,
    'SUNEXPRESS'
  ),

  // Emirates (EK - هواپیمایی امارات) - Iconic red badge with bold typography
  EK: makeCircleLogo(
    '#d71920',
    '#ffffff',
    'EK',
    `
      <rect x="15" y="24" width="70" height="52" rx="12" fill="#ffffff" opacity="0.15" />
      <text x="50" y="58" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">EK</text>
    `,
    'EMIRATES'
  ),

  // Flydubai (FZ - فلای دبی) - Blue and orange wings
  FZ: makeCircleLogo(
    '#0077b6',
    '#ffffff',
    'FZ',
    `
      <path d="M20 58 Q50 16 80 58 Q50 36 20 58 Z" fill="#f77f00" />
      <circle cx="50" cy="32" r="8" fill="#ffffff" />
      <path d="M30 68 Q50 48 70 68" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" />
    `,
    'FLYDUBAI'
  ),

  // Etihad Airways (EY - هواپیمایی اتحاد) - Gold geometric falcon
  EY: makeCircleLogo(
    '#b45309',
    '#ffffff',
    'EY',
    `
      <path d="M22 66 L50 22 L78 66 Z" fill="#fef08a" />
      <circle cx="50" cy="38" r="7" fill="#b45309" />
    `,
    'ETIHAD'
  ),

  // Air Arabia (G9 - ایرعربیا) - Red flying seagull
  G9: makeCircleLogo(
    '#d71920',
    '#ffffff',
    'G9',
    `
      <circle cx="50" cy="50" r="28" fill="#ffffff" />
      <circle cx="50" cy="50" r="14" fill="#d71920" />
      <path d="M20 50 L80 50" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
    `,
    'AIR ARABIA'
  ),

  // Qatar Airways (QR - قطر ایرویز) - Burgundy Arabian Oryx
  QR: makeCircleLogo(
    '#5c0632',
    '#ffffff',
    'QR',
    `
      <circle cx="50" cy="50" r="30" fill="#ffffff" />
      <circle cx="50" cy="50" r="18" fill="#5c0632" />
      <path d="M44 26 L50 14 L56 26" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
    `,
    'QATAR'
  ),

  // Saudia (SV - هواپیمایی سعودی) - Deep green crossed swords & palm
  SV: makeCircleLogo(
    '#005a36',
    '#ffffff',
    'SV',
    `
      <circle cx="50" cy="50" r="30" fill="none" stroke="#facc15" stroke-width="2.5" />
      <path d="M28 66 C44 34 56 34 72 66 Z" fill="#facc15" />
      <circle cx="50" cy="32" r="7" fill="#ffffff" />
    `,
    'SAUDIA'
  ),

  // Flynas (XY - فلای‌ناس)
  XY: makeCircleLogo(
    '#0d9488',
    '#ffffff',
    'XY',
    `
      <circle cx="50" cy="50" r="28" fill="#ec4899" />
      <circle cx="50" cy="50" r="14" fill="#ffffff" />
    `,
    'FLYNAS'
  ),

  // Flyadeal (F3 - ادیل)
  F3: makeCircleLogo(
    '#6b21a8',
    '#ffffff',
    'F3',
    `
      <circle cx="50" cy="50" r="28" fill="#a3e635" />
      <circle cx="50" cy="50" r="14" fill="#6b21a8" />
    `,
    'FLYADEAL'
  ),

  // Kuwait Airways (KU - کویت ایرویز)
  KU: makeCircleLogo(
    '#0284c7',
    '#ffffff',
    'KU',
    `
      <path d="M22 58 C40 26 60 26 78 58 Z" fill="#ffffff" />
      <circle cx="50" cy="32" r="8" fill="#ffffff" />
    `,
    'KUWAIT'
  ),

  // Jazeera Airways (J9 - جزیره ایرویز)
  J9: makeCircleLogo(
    '#0369a1',
    '#ffffff',
    'J9',
    `
      <circle cx="50" cy="50" r="28" fill="#ffffff" />
      <circle cx="50" cy="50" r="14" fill="#0369a1" />
    `,
    'JAZEERA'
  ),

  // Oman Air (WY - عمان ایر)
  WY: makeCircleLogo(
    '#b91c1c',
    '#ffffff',
    'WY',
    `
      <circle cx="50" cy="50" r="28" fill="#047857" />
      <circle cx="50" cy="50" r="14" fill="#ffffff" />
    `,
    'OMAN AIR'
  ),

  // SalamAir (OV - سلام‌ایر)
  OV: makeCircleLogo(
    '#16a34a',
    '#ffffff',
    'OV',
    `
      <circle cx="50" cy="50" r="28" fill="#0284c7" />
      <circle cx="50" cy="50" r="14" fill="#ffffff" />
    `,
    'SALAMAIR'
  ),

  // Iraqi Airways (IA - هواپیمایی عراق)
  IA: makeCircleLogo(
    '#006837',
    '#ffffff',
    'IA',
    `
      <path d="M22 58 C40 28 60 28 78 58 Z" fill="#ffffff" />
      <circle cx="50" cy="34" r="8" fill="#ffffff" />
    `,
    'IRAQI'
  ),

  // Fly Baghdad (UR - فلای بغداد)
  UR: makeCircleLogo(
    '#0284c7',
    '#ffffff',
    'UR',
    `
      <path d="M22 66 L50 22 L78 66 Z" fill="#ef4444" />
      <circle cx="50" cy="44" r="8" fill="#ffffff" />
    `,
    'BAGHDAD'
  ),

  // Middle East Airlines (ME - خاورمیانه / لبنان)
  ME: makeCircleLogo(
    '#dc2626',
    '#ffffff',
    'ME',
    `
      <circle cx="50" cy="50" r="32" fill="#ffffff" />
      <path d="M44 66 L50 32 L56 66 Z" fill="#16a34a" />
    `,
    'MEA'
  ),

  // Royal Jordanian (RJ - اردن)
  RJ: makeCircleLogo(
    '#854d0e',
    '#ffffff',
    'RJ',
    `
      <path d="M26 62 L50 26 L74 62 Z" fill="#fef08a" />
      <circle cx="50" cy="38" r="6" fill="#854d0e" />
    `,
    'JORDAN'
  ),

  // Azerbaijan Airlines (J2 - آذربایجان)
  J2: makeCircleLogo(
    '#0284c7',
    '#ffffff',
    'J2',
    `
      <circle cx="50" cy="50" r="26" fill="#ef4444" />
      <circle cx="50" cy="50" r="14" fill="#16a34a" />
    `,
    'AZAL'
  ),

  // Georgian Airways (A9 - گرجستان)
  A9: makeCircleLogo(
    '#dc2626',
    '#ffffff',
    'A9',
    `
      <path d="M22 66 L50 22 L78 66 Z" fill="#ffffff" />
      <circle cx="50" cy="42" r="8" fill="#dc2626" />
    `,
    'GEORGIAN'
  ),

  // Lufthansa (LH - لوفتهانزا) - The classic crane
  LH: makeCircleLogo(
    '#05164d',
    '#ffc000',
    'LH',
    `
      <circle cx="50" cy="50" r="34" fill="#ffc000" />
      <circle cx="50" cy="50" r="28" fill="#05164d" />
      <path d="M34 56 C44 40 56 40 66 56 C56 48 44 48 34 56 Z" fill="#ffc000" />
    `,
    'LUFTHANSA'
  ),

  // British Airways (BA - بریتیش ایرویز)
  BA: makeCircleLogo(
    '#075aaa',
    '#ffffff',
    'BA',
    `
      <path d="M20 50 Q50 30 80 50 Q50 70 20 50 Z" fill="#eb2226" />
      <path d="M30 50 Q50 36 70 50 Q50 64 30 50 Z" fill="#ffffff" />
    `,
    'BRITISH'
  ),

  // Air France (AF - ایر فرانس)
  AF: makeCircleLogo(
    '#002157',
    '#ffffff',
    'AF',
    `
      <path d="M20 65 L50 20 L80 65 Z" fill="#ed1b24" />
      <path d="M32 65 L50 34 L68 65 Z" fill="#ffffff" />
    `,
    'AIR FRANCE'
  ),

  // KLM (KL - کی ال ام) - Royal blue crown
  KL: makeCircleLogo(
    '#00a1de',
    '#ffffff',
    'KL',
    `
      <circle cx="34" cy="38" r="5" fill="#ffffff" />
      <circle cx="50" cy="32" r="6" fill="#ffffff" />
      <circle cx="66" cy="38" r="5" fill="#ffffff" />
      <path d="M26 48 L74 48 L68 64 L32 64 Z" fill="#ffffff" />
    `,
    'KLM'
  )
};

export const generateDynamicAirlineEmblem = (name?: string, code?: string): string => {
  let displayCode = (code || '').trim().toUpperCase();
  if (!displayCode && name) {
    const cleanLatin = name.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase();
    if (cleanLatin) {
      displayCode = cleanLatin;
    } else {
      displayCode = name.trim().slice(0, 3);
    }
  }
  displayCode = displayCode || 'AIR';

  const colors = [
    { bg: '#003399', fg: '#ffffff', accent: '#38bdf8' },
    { bg: '#00703c', fg: '#ffffff', accent: '#34d399' },
    { bg: '#c8102e', fg: '#ffffff', accent: '#fca5a5' },
    { bg: '#662d91', fg: '#ffffff', accent: '#c4b5fd' },
    { bg: '#00a3e0', fg: '#ffffff', accent: '#7dd3fc' },
    { bg: '#b45309', fg: '#ffffff', accent: '#fde047' },
    { bg: '#006699', fg: '#ffffff', accent: '#5eead4' }
  ];
  let hash = 0;
  for (let i = 0; i < displayCode.length; i++) {
    hash = (hash + displayCode.charCodeAt(i)) % colors.length;
  }
  const color = colors[hash];

  return encodeSvgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="dynGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color.bg}" />
          <stop offset="100%" stop-color="${color.accent}" />
        </linearGradient>
        <filter id="dynShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.18" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#dynGrad)" filter="url(#dynShadow)" stroke="#ffffff" stroke-width="3" />
      <path d="M30 76 C52 38 68 38 90 76 C72 62 48 62 30 76 Z" fill="#ffffff" opacity="0.35" />
      <circle cx="60" cy="38" r="9" fill="#ffffff" opacity="0.9" />
      <text x="60" y="74" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="28" font-weight="900" fill="${color.fg}" text-anchor="middle" letter-spacing="2">${displayCode}</text>
    </svg>
  `);
};

export const getReliableAirlineLogo = (codeOrName?: string, currentLogoUrl?: string): string => {
  // If user uploaded a valid base64 image (PNG, JPEG, WebP) or SVG data URI, preserve it
  if (
    currentLogoUrl &&
    currentLogoUrl.startsWith('data:image/') &&
    !currentLogoUrl.includes('data:image/svg+xml;utf8') &&
    currentLogoUrl.length > 50
  ) {
    return currentLogoUrl;
  }

  // Extract IATA / ICAO code if present in URL
  let code = '';
  if (currentLogoUrl) {
    const match = currentLogoUrl.match(/\/airlines\/([A-Za-z0-9]+)\.(png|svg|webp)/i);
    if (match) code = match[1].toUpperCase();
  }

  const rawText = (codeOrName || '').trim();
  const text = rawText.toUpperCase();

  // If code is already a known 2-3 letter IATA code
  if (!code && text.length <= 3 && text.length >= 2 && AIRLINE_EMBLEMS[text]) {
    code = text;
  }

  // Comprehensive Persian & English keyword matching
  if (!code || !AIRLINE_EMBLEMS[code]) {
    if (text.includes('MAHAN') || text.includes('ماهان') || text === 'W5') code = 'W5';
    else if (text.includes('IRAN AIR') || text.includes('ایران ایر') || text.includes('هما') || text === 'IR') code = 'IR';
    else if (text.includes('SEPEHR') || text.includes('سپهران') || text === 'IS') code = 'IS';
    else if (text.includes('ZAGROS') || text.includes('زاگرس') || text === 'ZV') code = 'ZV';
    else if (text.includes('ATA') || text.includes('آتا') || text === 'I3') code = 'I3';
    else if (text.includes('KISH') || text.includes('کیش') || text === 'Y9') code = 'Y9';
    else if (text.includes('QESHM') || text.includes('قشم') || text === 'QB') code = 'QB';
    else if (text.includes('ASEMAN') || text.includes('آسمان') || text === 'EP') code = 'EP';
    else if (text.includes('TABAN') || text.includes('تابان') || text === 'HH') code = 'HH';
    else if (text.includes('CASPIAN') || text.includes('کاسپین') || text === 'RV') code = 'RV';
    else if (text.includes('MERAJ') || text.includes('معراج') || text === 'JI') code = 'JI';
    else if (text.includes('VARESH') || text.includes('وارش') || text === 'VR') code = 'VR';
    else if (text.includes('PERSIA') || text.includes('پرشیا') || text === 'FP') code = 'FP';
    else if (text.includes('KARUN') || text.includes('کارون') || text.includes('نفت') || text === 'NV') code = 'NV';
    else if (text.includes('PARS') || text.includes('پارس') || text === 'PR') code = 'PR';
    else if (text.includes('AIRTOUR') || text.includes('ایرتور') || text === 'B9' || text === 'IV') code = 'B9';
    else if (text.includes('SAHA') || text.includes('ساها') || text === 'IRZ') code = 'IRZ';
    else if (text.includes('CHABAHAR') || text.includes('چابهار') || text === 'IKV') code = 'IKV';
    else if (text.includes('YAZD') || text.includes('یزد') || text === 'DZD') code = 'DZD';
    else if (text.includes('AVA') || text.includes('آوا') || text === 'VAA') code = 'VAA';
    else if (text.includes('POUYA') || text.includes('پویا') || text === 'PY') code = 'PY';
    else if (text.includes('ARVAN') || text.includes('آروان') || text === 'A1') code = 'A1';
    else if (text.includes('TEHRAN') || text.includes('طهران') || text.includes('تهران') || text === 'TEH') code = 'TEH';
    else if (text.includes('TURKISH') || text.includes('ترکیش') || text === 'TK') code = 'TK';
    else if (text.includes('PEGASUS') || text.includes('پگاسوس') || text === 'PC') code = 'PC';
    else if (text.includes('AJET') || text.includes('ANADOLU') || text === 'VF') code = 'VF';
    else if (text.includes('SUNEXPRESS') || text === 'XQ') code = 'XQ';
    else if (text.includes('EMIRATES') || text.includes('امارات') || text === 'EK') code = 'EK';
    else if (text.includes('FLYDUBAI') || text.includes('فلای دبی') || text.includes('فلایدبی') || text === 'FZ') code = 'FZ';
    else if (text.includes('ETIHAD') || text.includes('اتحاد') || text === 'EY') code = 'EY';
    else if (text.includes('ARABIA') || text.includes('العربیه') || text === 'G9') code = 'G9';
    else if (text.includes('QATAR') || text.includes('قطر') || text === 'QR') code = 'QR';
    else if (text.includes('IRAQI') || text.includes('عراقی') || text.includes('العراقیة') || text === 'IA') code = 'IA';
    else if (text.includes('BAGHDAD') || text.includes('بغداد') || text === 'UR') code = 'UR';
    else if (text.includes('SAUDI') || text.includes('سعودی') || text === 'SV') code = 'SV';
    else if (text.includes('NAS') || text.includes('ناس') || text === 'XY') code = 'XY';
    else if (text.includes('ADEAL') || text.includes('ادیل') || text === 'F3') code = 'F3';
    else if (text.includes('KUWAIT') || text.includes('کویت') || text === 'KU') code = 'KU';
    else if (text.includes('JAZEERA') || text.includes('جزیره') || text === 'J9') code = 'J9';
    else if (text.includes('OMAN') || text.includes('عمان') || text === 'WY') code = 'WY';
    else if (text.includes('SALAM') || text.includes('سلام') || text === 'OV') code = 'OV';
    else if (text.includes('MIDDLE EAST') || text.includes('لبنان') || text === 'ME') code = 'ME';
    else if (text.includes('JORDAN') || text.includes('اردن') || text === 'RJ') code = 'RJ';
    else if (text.includes('AZERBAIJAN') || text.includes('آذربایجان') || text === 'J2') code = 'J2';
    else if (text.includes('GEORGIAN') || text.includes('گرجستان') || text === 'A9') code = 'A9';
    else if (text.includes('LUFTHANSA') || text.includes('لوفتهانزا') || text.includes('لوفت هانزا') || text === 'LH') code = 'LH';
    else if (text.includes('BRITISH') || text.includes('بریتیش') || text === 'BA') code = 'BA';
    else if (text.includes('AIR FRANCE') || text.includes('ایرفرانس') || text === 'AF') code = 'AF';
    else if (text.includes('KLM') || text === 'KL') code = 'KL';
    else if (text.includes('SINGAPORE') || text.includes('سنگاپور') || text === 'SQ') code = 'SQ';
    else if (text.includes('SCOOT') || text === 'TR') code = 'TR';
    else if (text.includes('CATHAY') || text.includes('کاتای') || text === 'CX') code = 'CX';
    else if (text.includes('CHINA SOUTHERN') || text === 'CZ') code = 'CZ';
    else if (text.includes('CHINA EASTERN') || text === 'MU') code = 'MU';
    else if (text.includes('AIR CHINA') || text === 'CA') code = 'CA';
    else if (text.includes('HAINAN') || text === 'HU') code = 'HU';
    else if (text.includes('ALL NIPPON') || text === 'NH') code = 'NH';
    else if (text.includes('JAPAN AIR') || text === 'JL') code = 'JL';
    else if (text.includes('KOREAN') || text === 'KE') code = 'KE';
    else if (text.includes('ASIANA') || text === 'OZ') code = 'OZ';
    else if (text.includes('EVA AIR') || text === 'BR') code = 'BR';
    else if (text.includes('THAI') || text === 'TG') code = 'TG';
    else if (text.includes('MALAYSIA') || text === 'MH') code = 'MH';
    else if (text.includes('AIRASIA') || text === 'AK') code = 'AK';
    else if (text.includes('GARUDA') || text === 'GA') code = 'GA';
    else if (text.includes('VIETNAM') || text === 'VN') code = 'VN';
    else if (text.includes('PHILIPPINE') || text === 'PR') code = 'PR';
    else if (text.includes('PAKISTAN') || text === 'PK') code = 'PK';
    else if (text.includes('AIR INDIA') || text === 'AI') code = 'AI';
    else if (text.includes('INDIGO') || text === '6E') code = '6E';
    else if (text.includes('SPICEJET') || text === 'SG') code = 'SG';
    else if (text.includes('AMERICAN') || text === 'AA') code = 'AA';
    else if (text.includes('DELTA') || text === 'DL') code = 'DL';
    else if (text.includes('UNITED') || text === 'UA') code = 'UA';
    else if (text.includes('SOUTHWEST') || text === 'WN') code = 'WN';
    else if (text.includes('JETBLUE') || text === 'B6') code = 'B6';
    else if (text.includes('ALASKA') || text === 'AS') code = 'AS';
    else if (text.includes('SPIRIT') || text === 'NK') code = 'NK';
    else if (text.includes('FRONTIER') || text === 'F9') code = 'F9';
    else if (text.includes('AIR CANADA') || text === 'AC') code = 'AC';
    else if (text.includes('WESTJET') || text === 'WS') code = 'WS';
    else if (text.includes('AEROMEXICO') || text === 'AM') code = 'AM';
    else if (text.includes('COPA') || text === 'CM') code = 'CM';
    else if (text.includes('AVIANCA') || text === 'AV') code = 'AV';
    else if (text.includes('LATAM') || text === 'LA') code = 'LA';
    else if (text.includes('ETHIOPIAN') || text === 'ET') code = 'ET';
    else if (text.includes('EGYPTAIR') || text === 'MS') code = 'MS';
    else if (text.includes('MAROC') || text === 'AT') code = 'AT';
    else if (text.includes('KENYA') || text === 'KQ') code = 'KQ';
    else if (text.includes('SOUTH AFRICAN') || text === 'SA') code = 'SA';
    else if (text.includes('QANTAS') || text === 'QF') code = 'QF';
    else if (text.includes('VIRGIN') || text === 'VA') code = 'VA';
    else if (text.includes('JETSTAR') || text === 'JQ') code = 'JQ';
    else if (text.includes('NEW ZEALAND') || text === 'NZ') code = 'NZ';
    else if (text.includes('RYANAIR') || text === 'FR') code = 'FR';
    else if (text.includes('EASYJET') || text === 'U2') code = 'U2';
    else if (text.includes('WIZZ') || text === 'W6') code = 'W6';
    else if (text.includes('IBERIA') || text === 'IB') code = 'IB';
    else if (text.includes('ALITALIA') || text.includes('ITA AIRWAYS') || text === 'AZ') code = 'AZ';
    else if (text.includes('FINNAIR') || text === 'AY') code = 'AY';
    else if (text.includes('SWISS') || text === 'LX') code = 'LX';
    else if (text.includes('AUSTRIAN') || text === 'OS') code = 'OS';
    else if (text.includes('BRUSSELS') || text === 'SN') code = 'SN';
    else if (text.includes('AEROFLOT') || text === 'SU') code = 'SU';
  }

  // 1. If currentLogoUrl is a valid image link (HTTP/HTTPS, relative, or data URI), ALWAYS use and return it!
  if (currentLogoUrl && /^(https?:|\/|data:image)/i.test(currentLogoUrl.trim())) {
    return currentLogoUrl.trim();
  }

  // 2. If we have a 2-3 letter IATA/ICAO code, return official Charter118 CDN logo image link
  const cleanCode = code || (text.length >= 2 && text.length <= 3 ? text : '');
  if (cleanCode && /^[A-Z0-9]{2,3}$/.test(cleanCode)) {
    return `https://cdn.charter118.ir/static/img/airlines/${cleanCode}.png`;
  }

  // 3. If vector emblem is available, use it
  if (code && AIRLINE_EMBLEMS[code]) {
    return AIRLINE_EMBLEMS[code];
  }

  // 4. Fallback to clean dynamic vector emblem
  return generateDynamicAirlineEmblem(codeOrName, code);
};
