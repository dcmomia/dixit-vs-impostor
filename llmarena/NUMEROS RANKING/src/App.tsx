import { useState } from 'react';

export type MarkerVariant =
  | 'goldClassic'
  | 'silverClockwork'
  | 'bronzePatina'
  | 'goldFiligree'
  | 'silverGearBloom'
  | 'bronzeIndustrial'
  | 'amberArc'
  | 'blueLens'
  | 'smokedLens'
  | 'bronzeMechanism'
  | 'rubyGear'
  | 'clockFace';

export interface Marker {
  id: number;
  name: string;
  number?: '1' | '2' | '3';
  variant: MarkerVariant;
  material: string;
  note: string;
}

export const markers: Marker[] = [
  {
    id: 1,
    name: 'Oro relojero',
    number: '1',
    variant: 'goldClassic',
    material: 'Latón dorado pulido',
    note: 'Moneda clásica con maquinaria grabada en relieve.',
  },
  {
    id: 2,
    name: 'Plata mecánica',
    number: '2',
    variant: 'silverClockwork',
    material: 'Acero plateado envejecido',
    note: 'Disco plateado con numerales y engranajes expuestos.',
  },
  {
    id: 3,
    name: 'Bronce con pátina',
    number: '3',
    variant: 'bronzePatina',
    material: 'Bronce antiguo oxidado',
    note: 'Aro horario sobrio con borde verdoso y desgaste.',
  },
  {
    id: 4,
    name: 'Filigrana imperial',
    number: '1',
    variant: 'goldFiligree',
    material: 'Oro ornamental con gemas',
    note: 'Corona dentada con detalles de joyería victoriana.',
  },
  {
    id: 5,
    name: 'Flor de engranajes',
    number: '2',
    variant: 'silverGearBloom',
    material: 'Plata industrial satinado',
    note: 'Conjunto de ruedas dentadas ensambladas alrededor del núcleo.',
  },
  {
    id: 6,
    name: 'Mecanismo remachado',
    number: '3',
    variant: 'bronzeIndustrial',
    material: 'Bronce forjado con remaches',
    note: 'Anillo industrial robusto con interior mecánico abierto.',
  },
  {
    id: 7,
    name: 'Ámbar eléctrico',
    number: '1',
    variant: 'amberArc',
    material: 'Oro dentado y cristal ámbar',
    note: 'Orbe traslúcido con brillo arcano azul.',
  },
  {
    id: 8,
    name: 'Zafiro de acero',
    number: '2',
    variant: 'blueLens',
    material: 'Acero azul templado',
    note: 'Cristal profundo encerrado en una corona de engranaje.',
  },
  {
    id: 9,
    name: 'Lente ahumada',
    variant: 'smokedLens',
    material: 'Vidrio oscuro y metal ennegrecido',
    note: 'Indicador dormido con mecanismo apenas visible bajo el cristal.',
  },
  {
    id: 10,
    name: 'Bronce de cámara',
    number: '3',
    variant: 'bronzeMechanism',
    material: 'Bronce oxidado y rueda interior',
    note: 'Versión compacta con aro técnico y núcleo pesado.',
  },
  {
    id: 11,
    name: 'Rubí catalítico',
    number: '3',
    variant: 'rubyGear',
    material: 'Cobre rosado y gema rubí',
    note: 'Marcador energético con cristal rojo y aro dentado.',
  },
  {
    id: 12,
    name: 'Cronómetro antiguo',
    variant: 'clockFace',
    material: 'Bronce cepillado',
    note: 'Esfera relojera clásica con agujas finas.',
  },
];

const range = (count: number) => Array.from({ length: count }, (_, index) => index);

const polar = (cx: number, cy: number, radius: number, angle: number) => {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
};

function TickRing({
  count,
  inner,
  outer,
  stroke,
  strokeWidth = 4,
  opacity = 1,
  startAngle = 0,
  centerX = 160,
  centerY = 160,
}: {
  count: number;
  inner: number;
  outer: number;
  stroke: string;
  strokeWidth?: number;
  opacity?: number;
  startAngle?: number;
  centerX?: number;
  centerY?: number;
}) {
  return (
    <>
      {range(count).map((index) => {
        const angle = startAngle + (index * 360) / count;
        const start = polar(centerX, centerY, inner, angle);
        const end = polar(centerX, centerY, outer, angle);

        return (
          <line
            key={`${stroke}-${centerX}-${centerY}-${index}`}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

function Rivets({
  count,
  radius,
  size,
  fill,
  stroke,
  centerX = 160,
  centerY = 160,
}: {
  count: number;
  radius: number;
  size: number;
  fill: string;
  stroke: string;
  centerX?: number;
  centerY?: number;
}) {
  return (
    <>
      {range(count).map((index) => {
        const point = polar(centerX, centerY, radius, (index * 360) / count);

        return (
          <g key={`${fill}-${centerX}-${centerY}-${index}`}>
            <circle cx={point.x} cy={point.y} r={size} fill={fill} stroke={stroke} strokeWidth="2.5" />
            <line
              x1={point.x - size * 0.45}
              y1={point.y - size * 0.45}
              x2={point.x + size * 0.45}
              y2={point.y + size * 0.45}
              stroke={stroke}
              strokeWidth="1.1"
              opacity="0.55"
            />
          </g>
        );
      })}
    </>
  );
}

function GearTeeth({
  count,
  radius,
  toothWidth,
  toothHeight,
  fill,
  centerX = 160,
  centerY = 160,
  opacity = 1,
}: {
  count: number;
  radius: number;
  toothWidth: number;
  toothHeight: number;
  fill: string;
  centerX?: number;
  centerY?: number;
  opacity?: number;
}) {
  return (
    <>
      {range(count).map((index) => (
        <rect
          key={`${fill}-${centerX}-${centerY}-tooth-${index}`}
          x={centerX - toothWidth / 2}
          y={centerY - radius - toothHeight}
          width={toothWidth}
          height={toothHeight}
          rx={Math.min(3, toothWidth / 4)}
          fill={fill}
          opacity={opacity}
          transform={`rotate(${(index * 360) / count} ${centerX} ${centerY})`}
        />
      ))}
    </>
  );
}

function GearWheel({
  x,
  y,
  radius,
  innerRadius,
  fill,
  stroke,
  teeth = 14,
  toothHeight = 11,
  opacity = 1,
}: {
  x: number;
  y: number;
  radius: number;
  innerRadius: number;
  fill: string;
  stroke: string;
  teeth?: number;
  toothHeight?: number;
  opacity?: number;
}) {
  const toothWidth = Math.max(8, (2 * Math.PI * radius) / teeth / 2.65);

  return (
    <g opacity={opacity}>
      <GearTeeth
        count={teeth}
        radius={radius}
        toothWidth={toothWidth}
        toothHeight={toothHeight}
        fill={fill}
        centerX={x}
        centerY={y}
      />
      <circle cx={x} cy={y} r={radius} fill={fill} stroke={stroke} strokeWidth="4" />
      <circle cx={x} cy={y} r={innerRadius} fill="none" stroke={stroke} strokeWidth="4" />
      <circle cx={x} cy={y} r="7" fill={stroke} opacity="0.85" />
    </g>
  );
}

function Numeral({
  value,
  fill,
  stroke,
  size,
  y = 192,
  filter,
}: {
  value: string;
  fill: string;
  stroke: string;
  size: number;
  y?: number;
  filter?: string;
}) {
  return (
    <text
      x="160"
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={size}
      fontFamily="Georgia, 'Times New Roman', serif"
      fill={fill}
      stroke={stroke}
      strokeWidth="4"
      paintOrder="stroke fill"
      letterSpacing="2"
      filter={filter}
    >
      {value}
    </text>
  );
}

function TitlePlate() {
  return (
    <svg viewBox="0 0 900 360" className="w-full h-auto drop-shadow-[0_18px_24px_rgba(0,0,0,0.55)]" aria-hidden="true">
      <defs>
        <linearGradient id="titleFrame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b4aaa0" />
          <stop offset="32%" stopColor="#675f5b" />
          <stop offset="68%" stopColor="#958981" />
          <stop offset="100%" stopColor="#4e4845" />
        </linearGradient>
        <linearGradient id="titlePlate" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#58514d" />
          <stop offset="50%" stopColor="#3c3735" />
          <stop offset="100%" stopColor="#59514d" />
        </linearGradient>
        <linearGradient id="titleText" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f1d09a" />
          <stop offset="42%" stopColor="#c48b4f" />
          <stop offset="100%" stopColor="#82542f" />
        </linearGradient>
        <filter id="titleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      <rect x="42" y="44" width="816" height="248" rx="34" fill="url(#titleFrame)" stroke="#d9cec3" strokeWidth="3" />
      <rect x="58" y="60" width="784" height="216" rx="26" fill="url(#titlePlate)" stroke="#2f2a28" strokeWidth="3" />
      <rect x="72" y="74" width="756" height="188" rx="22" fill="none" stroke="#807770" strokeWidth="2" opacity="0.45" />

      {[ [70,82], [830,82], [70,254], [830,254] ].map(([cx, cy], index) => (
        <g key={index}>
          <circle cx={cx} cy={cy} r="14" fill="#8a8078" stroke="#4d4643" strokeWidth="3" />
          <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} stroke="#574f4a" strokeWidth="3" />
        </g>
      ))}

      <path d="M88 98 q16 -18 32 0" fill="none" stroke="#92887f" strokeWidth="2" opacity="0.45" />
      <path d="M812 98 q-16 -18 -32 0" fill="none" stroke="#92887f" strokeWidth="2" opacity="0.45" />
      <path d="M88 238 q16 18 32 0" fill="none" stroke="#92887f" strokeWidth="2" opacity="0.45" />
      <path d="M812 238 q-16 18 -32 0" fill="none" stroke="#92887f" strokeWidth="2" opacity="0.45" />

      <text
        x="450"
        y="145"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="74"
        letterSpacing="2.5"
        fill="url(#titleText)"
        stroke="#2c1f16"
        strokeWidth="4"
        paintOrder="stroke fill"
        filter="url(#titleShadow)"
      >
        VARIACIONES DE
      </text>
      <text
        x="450"
        y="236"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="122"
        letterSpacing="1.5"
        fill="url(#titleText)"
        stroke="#2a1b14"
        strokeWidth="5"
        paintOrder="stroke fill"
        filter="url(#titleShadow)"
      >
        MARCADORES
      </text>
    </svg>
  );
}

export function MarkerArt({ variant, number }: { variant: MarkerVariant; number?: '1' | '2' | '3' }) {
  const uid = variant;

  let content = null;

  switch (variant) {
    case 'goldClassic':
      content = (
        <>
          <circle cx="160" cy="160" r="124" fill={`url(#goldMetal-${uid})`} stroke="#f4d886" strokeWidth="7" />
          <circle cx="160" cy="160" r="102" fill={`url(#goldCore-${uid})`} stroke="#d8a948" strokeWidth="8" />
          <TickRing count={48} inner={104} outer={120} stroke="#9a6e1f" strokeWidth={2.8} opacity={0.62} />
          <g opacity="0.18">
            <GearWheel x={118} y={116} radius={28} innerRadius={11} fill="#c29438" stroke="#8f6a25" teeth={12} toothHeight={8} />
            <GearWheel x={207} y={126} radius={18} innerRadius={7} fill="#c29438" stroke="#8f6a25" teeth={10} toothHeight={7} />
            <GearWheel x={198} y={198} radius={24} innerRadius={9} fill="#c29438" stroke="#8f6a25" teeth={11} toothHeight={8} />
            <GearWheel x={121} y={197} radius={17} innerRadius={6} fill="#c29438" stroke="#8f6a25" teeth={9} toothHeight={6} />
          </g>
          <circle cx="160" cy="160" r="84" fill="#f7e1a0" opacity="0.18" />
          {number && <Numeral value={number} fill="#f7e09b" stroke="#8b641b" size={138} />}
        </>
      );
      break;

    case 'silverClockwork':
      content = (
        <>
          <circle cx="160" cy="160" r="126" fill={`url(#silverMetal-${uid})`} stroke="#efefef" strokeWidth="6" />
          <circle cx="160" cy="160" r="104" fill="#bbb4ad" stroke="#6f6964" strokeWidth="8" />
          <g opacity="0.9">
            <GearWheel x={116} y={196} radius={38} innerRadius={14} fill="#8d847d" stroke="#514c47" teeth={14} toothHeight={11} opacity={0.85} />
            <GearWheel x={206} y={199} radius={32} innerRadius={12} fill="#847a73" stroke="#4b4642" teeth={13} toothHeight={10} opacity={0.85} />
            <GearWheel x={208} y={109} radius={23} innerRadius={8} fill="#8a7f77" stroke="#4c4742" teeth={11} toothHeight={8} opacity={0.85} />
          </g>
          <path d="M88 118 A74 74 0 0 1 232 118" fill="none" stroke="#615a55" strokeWidth="3" opacity="0.65" />
          <text x="108" y="102" fill="#4d4743" fontSize="17" fontFamily="Georgia, serif">XI</text>
          <text x="154" y="95" fill="#4d4743" fontSize="18" fontFamily="Georgia, serif">XII</text>
          <text x="206" y="102" fill="#4d4743" fontSize="17" fontFamily="Georgia, serif">I</text>
          <circle cx="160" cy="160" r="78" fill={`url(#silverDark-${uid})`} stroke="#f1f1f1" strokeWidth="6" />
          <circle cx="160" cy="160" r="63" fill={`url(#silverMetal-${uid})`} stroke="#8a8f96" strokeWidth="5" />
          {number && <Numeral value={number} fill="#dfe4eb" stroke="#606870" size={132} y={190} />}
        </>
      );
      break;

    case 'bronzePatina':
      content = (
        <>
          <circle cx="160" cy="160" r="124" fill={`url(#bronzeMetal-${uid})`} stroke="#9f714b" strokeWidth="8" />
          <circle cx="160" cy="160" r="102" fill={`url(#patina-${uid})`} opacity="0.58" />
          <circle cx="160" cy="160" r="99" fill="none" stroke="#5d4b3d" strokeWidth="6" />
          <TickRing count={12} inner={108} outer={122} stroke="#8d6a47" strokeWidth={5} opacity={0.82} startAngle={15} />
          <circle cx="160" cy="160" r="77" fill={`url(#bronzeDark-${uid})`} opacity="0.3" />
          <circle cx="160" cy="160" r="84" fill="none" stroke="#7e654c" strokeWidth="5" opacity="0.9" />
          {number && <Numeral value={number} fill="#cb9f6b" stroke="#5a402d" size={128} />}
        </>
      );
      break;

    case 'goldFiligree':
      content = (
        <>
          <GearTeeth count={38} radius={124} toothWidth={14} toothHeight={14} fill="#c69228" opacity={0.95} />
          <circle cx="160" cy="160" r="122" fill={`url(#goldMetal-${uid})`} stroke="#805e15" strokeWidth="6" />
          <circle cx="160" cy="160" r="96" fill="#2f2315" stroke="#d2a33d" strokeWidth="6" />
          <circle cx="160" cy="160" r="84" fill="none" stroke="#efc96f" strokeWidth="4" strokeDasharray="2 8" opacity="0.85" />
          <circle cx="160" cy="160" r="76" fill={`url(#goldCore-${uid})`} stroke="#d6aa4d" strokeWidth="7" />
          {range(10).map((index) => {
            const a = (index * 360) / 10;
            const p = polar(160, 160, 99, a);
            const p2 = polar(160, 160, 112, a + 10);
            return (
              <path
                key={`filigree-${index}`}
                d={`M ${p.x} ${p.y} Q 160 160 ${p2.x} ${p2.y}`}
                fill="none"
                stroke="#f1d17f"
                strokeWidth="2"
                opacity="0.45"
              />
            );
          })}
          {[45, 135, 225, 315].map((angle, index) => {
            const p = polar(160, 160, 112, angle);
            return (
              <g key={`gem-${index}`}>
                <circle cx={p.x} cy={p.y} r="12" fill="#f7f0df" stroke="#d4b15b" strokeWidth="4" />
                <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" opacity="0.95" />
              </g>
            );
          })}
          {number && <Numeral value={number} fill="#f3dd97" stroke="#8f6218" size={134} />}
        </>
      );
      break;

    case 'silverGearBloom':
      content = (
        <>
          <GearWheel x={160} y={82} radius={30} innerRadius={10} fill="#9ea7b0" stroke="#5e6670" teeth={14} toothHeight={10} opacity={0.92} />
          <GearWheel x={91} y={117} radius={36} innerRadius={12} fill="#8c959e" stroke="#59616a" teeth={14} toothHeight={11} opacity={0.95} />
          <GearWheel x={230} y={117} radius={36} innerRadius={12} fill="#8c959e" stroke="#59616a" teeth={14} toothHeight={11} opacity={0.95} />
          <GearWheel x={83} y={200} radius={34} innerRadius={11} fill="#8b949d" stroke="#59616a" teeth={13} toothHeight={10} opacity={0.95} />
          <GearWheel x={237} y={200} radius={34} innerRadius={11} fill="#8b949d" stroke="#59616a" teeth={13} toothHeight={10} opacity={0.95} />
          <GearWheel x={160} y={240} radius={30} innerRadius={10} fill="#9ea7b0" stroke="#5e6670" teeth={14} toothHeight={10} opacity={0.92} />
          <circle cx="160" cy="160" r="94" fill={`url(#silverMetal-${uid})`} stroke="#f2f4f7" strokeWidth="6" />
          <circle cx="160" cy="160" r="66" fill={`url(#silverDark-${uid})`} stroke="#7a828b" strokeWidth="6" />
          {number && <Numeral value={number} fill="#e8edf3" stroke="#68717a" size={126} />}
        </>
      );
      break;

    case 'bronzeIndustrial':
      content = (
        <>
          <circle cx="160" cy="160" r="124" fill={`url(#bronzeMetal-${uid})`} stroke="#785743" strokeWidth="8" />
          <Rivets count={10} radius={113} size={9} fill="#a8744c" stroke="#5d4030" />
          <circle cx="160" cy="160" r="92" fill="#4f392b" stroke="#8a6548" strokeWidth="5" />
          <circle cx="160" cy="160" r="78" fill="none" stroke="#2c221b" strokeWidth="28" strokeDasharray="18 10" opacity="0.92" />
          <circle cx="160" cy="160" r="60" fill={`url(#patina-${uid})`} opacity="0.3" />
          <circle cx="160" cy="160" r="66" fill={`url(#bronzeDark-${uid})`} stroke="#7f5c43" strokeWidth="5" opacity="0.95" />
          {number && <Numeral value={number} fill="#cb9865" stroke="#563928" size={124} />}
        </>
      );
      break;

    case 'amberArc':
      content = (
        <>
          <GearTeeth count={34} radius={124} toothWidth={14} toothHeight={14} fill="#d0a53a" opacity={0.95} />
          <circle cx="160" cy="160" r="122" fill="#342714" stroke="#8a6730" strokeWidth="6" />
          <circle cx="160" cy="160" r="110" fill="none" stroke="#d6b05c" strokeWidth="4" opacity="0.55" />
          <circle cx="160" cy="160" r="86" fill={`url(#amberGlass-${uid})`} stroke="#d6a74b" strokeWidth="8" />
          <ellipse cx="124" cy="119" rx="32" ry="16" fill="#ffffff" opacity="0.42" transform="rotate(-26 124 119)" />
          <path d="M143 206 C156 182 148 168 160 146 C172 126 168 108 181 92" stroke="#7cd6ff" strokeWidth="4" fill="none" opacity="0.7" />
          <path d="M179 179 C170 168 175 152 163 138" stroke="#7cd6ff" strokeWidth="2.7" fill="none" opacity="0.65" />
          {number && <Numeral value={number} fill="#bcecff" stroke="#52a9ff" size={128} filter={`url(#blueGlow-${uid})`} />}
        </>
      );
      break;

    case 'blueLens':
      content = (
        <>
          <GearTeeth count={32} radius={124} toothWidth={14} toothHeight={13} fill="#9fa9b3" opacity={0.95} />
          <circle cx="160" cy="160" r="122" fill={`url(#silverDark-${uid})`} stroke="#b8c0ca" strokeWidth="7" />
          <circle cx="160" cy="160" r="98" fill="#6d7785" stroke="#c9d3de" strokeWidth="6" opacity="0.92" />
          <circle cx="160" cy="160" r="78" fill={`url(#blueGlass-${uid})`} stroke="#a7bacd" strokeWidth="7" />
          <ellipse cx="126" cy="121" rx="28" ry="14" fill="#eef5ff" opacity="0.48" transform="rotate(-24 126 121)" />
          {number && <Numeral value={number} fill="#dbe6f7" stroke="#607084" size={126} />}
        </>
      );
      break;

    case 'smokedLens':
      content = (
        <>
          <circle cx="160" cy="160" r="124" fill="#2b2d33" stroke="#777c85" strokeWidth="6" />
          <circle cx="160" cy="160" r="110" fill="#1a1f28" stroke="#313844" strokeWidth="5" />
          <circle cx="160" cy="160" r="94" fill={`url(#smokeGlass-${uid})`} stroke="#555b64" strokeWidth="5" />
          <circle cx="160" cy="160" r="64" fill="none" stroke="#5d635d" strokeWidth="4" opacity="0.22" />
          <TickRing count={8} inner={26} outer={87} stroke="#59615e" strokeWidth={3} opacity={0.2} />
          <circle cx="160" cy="160" r="42" fill="none" stroke="#59615e" strokeWidth="6" opacity="0.17" strokeDasharray="18 10" />
          <ellipse cx="134" cy="120" rx="52" ry="23" fill="#ffffff" opacity="0.1" transform="rotate(-22 134 120)" />
        </>
      );
      break;

    case 'bronzeMechanism':
      content = (
        <>
          <circle cx="160" cy="160" r="124" fill={`url(#bronzeMetal-${uid})`} stroke="#8e6b54" strokeWidth="7" />
          <Rivets count={8} radius={112} size={8} fill="#a0714f" stroke="#5b3e2e" />
          <circle cx="160" cy="160" r="95" fill="#4a3326" stroke="#7d5d46" strokeWidth="6" />
          <circle cx="160" cy="160" r="79" fill="none" stroke="#241b15" strokeWidth="20" strokeDasharray="15 8" opacity="0.9" />
          <circle cx="160" cy="160" r="67" fill={`url(#patina-${uid})`} opacity="0.34" />
          <circle cx="160" cy="160" r="70" fill={`url(#bronzeDark-${uid})`} stroke="#7b5d47" strokeWidth="4" />
          {number && <Numeral value={number} fill="#c99a6d" stroke="#52382a" size={124} />}
        </>
      );
      break;

    case 'rubyGear':
      content = (
        <>
          <GearTeeth count={30} radius={124} toothWidth={16} toothHeight={15} fill="#b77851" opacity={0.95} />
          <circle cx="160" cy="160" r="122" fill={`url(#bronzeMetal-${uid})`} stroke="#d1a188" strokeWidth="6" />
          <circle cx="160" cy="160" r="101" fill="#69232b" stroke="#9e5763" strokeWidth="6" />
          <circle cx="160" cy="160" r="81" fill={`url(#rubyGlass-${uid})`} stroke="#f19aa8" strokeWidth="6" />
          <ellipse cx="128" cy="120" rx="29" ry="14" fill="#fff0f4" opacity="0.42" transform="rotate(-28 128 120)" />
          {number && <Numeral value={number} fill="#ffd3da" stroke="#8c2b37" size={122} filter={`url(#rubyGlow-${uid})`} />}
        </>
      );
      break;

    case 'clockFace':
      content = (
        <>
          <circle cx="160" cy="160" r="124" fill={`url(#bronzeDark-${uid})`} stroke="#826551" strokeWidth="7" />
          <circle cx="160" cy="160" r="108" fill={`url(#clockMetal-${uid})`} stroke="#4f3c31" strokeWidth="6" />
          <TickRing count={12} inner={100} outer={116} stroke="#8f735f" strokeWidth={4} opacity={0.9} />
          <TickRing count={60} inner={104} outer={112} stroke="#6d5849" strokeWidth={1.6} opacity={0.7} />
          <circle cx="160" cy="160" r="10" fill="#6f5b49" stroke="#271c16" strokeWidth="3" />
          <line x1="160" y1="160" x2="160" y2="92" stroke="#c4b3a4" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="160" y1="160" x2="214" y2="182" stroke="#b59b85" strokeWidth="5" strokeLinecap="round" />
          <line x1="160" y1="160" x2="125" y2="111" stroke="#796253" strokeWidth="2.6" strokeLinecap="round" opacity="0.85" />
        </>
      );
      break;

    default:
      content = null;
  }

  return (
    <svg
      viewBox="0 0 320 320"
      className="h-full w-full drop-shadow-[0_16px_20px_rgba(0,0,0,0.56)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`goldMetal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff2b7" />
          <stop offset="34%" stopColor="#d5a845" />
          <stop offset="72%" stopColor="#9a6e1f" />
          <stop offset="100%" stopColor="#f7d77c" />
        </linearGradient>
        <radialGradient id={`goldCore-${uid}`} cx="36%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff1b4" />
          <stop offset="60%" stopColor="#d4a244" />
          <stop offset="100%" stopColor="#9f7221" />
        </radialGradient>
        <linearGradient id={`silverMetal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fbff" />
          <stop offset="30%" stopColor="#babfc8" />
          <stop offset="68%" stopColor="#838b95" />
          <stop offset="100%" stopColor="#ecf2f8" />
        </linearGradient>
        <radialGradient id={`silverDark-${uid}`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#eef1f5" />
          <stop offset="55%" stopColor="#9da5af" />
          <stop offset="100%" stopColor="#5b646e" />
        </radialGradient>
        <linearGradient id={`bronzeMetal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ddb08b" />
          <stop offset="36%" stopColor="#a77450" />
          <stop offset="72%" stopColor="#684733" />
          <stop offset="100%" stopColor="#c08960" />
        </linearGradient>
        <radialGradient id={`bronzeDark-${uid}`} cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#c09269" />
          <stop offset="62%" stopColor="#7c563e" />
          <stop offset="100%" stopColor="#4b3328" />
        </radialGradient>
        <radialGradient id={`patina-${uid}`} cx="42%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#8d8e64" stopOpacity="0.38" />
          <stop offset="48%" stopColor="#647160" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#2f5a53" stopOpacity="0.55" />
        </radialGradient>
        <radialGradient id={`amberGlass-${uid}`} cx="36%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#ffdd8b" />
          <stop offset="45%" stopColor="#c88329" />
          <stop offset="100%" stopColor="#6a340c" />
        </radialGradient>
        <radialGradient id={`blueGlass-${uid}`} cx="38%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#aec7f2" />
          <stop offset="42%" stopColor="#45679b" />
          <stop offset="100%" stopColor="#172542" />
        </radialGradient>
        <radialGradient id={`smokeGlass-${uid}`} cx="38%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#7f8994" stopOpacity="0.34" />
          <stop offset="46%" stopColor="#2a3240" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0e1217" stopOpacity="0.95" />
        </radialGradient>
        <radialGradient id={`rubyGlass-${uid}`} cx="38%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#ffb6c1" />
          <stop offset="38%" stopColor="#c1304a" />
          <stop offset="100%" stopColor="#4f0a16" />
        </radialGradient>
        <radialGradient id={`clockMetal-${uid}`} cx="40%" cy="34%" r="76%">
          <stop offset="0%" stopColor="#8b7968" />
          <stop offset="52%" stopColor="#5f4d40" />
          <stop offset="100%" stopColor="#2f231d" />
        </radialGradient>
        <filter id={`blueGlow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#77d8ff" floodOpacity="0.82" />
        </filter>
        <filter id={`rubyGlow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ff7087" floodOpacity="0.5" />
        </filter>
      </defs>

      {content}
    </svg>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 80 80" className="h-10 w-10 opacity-80 drop-shadow-[0_0_18px_rgba(255,255,255,0.42)]" aria-hidden="true">
      <path d="M40 4 L48 32 L76 40 L48 48 L40 76 L32 48 L4 40 L32 32 Z" fill="#f2f1ff" />
    </svg>
  );
}

function App() {
  const [selected, setSelected] = useState<Marker | null>(null);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#393836] px-3 py-6 text-stone-100 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-[860px] rounded-[2.2rem] border border-[#4d4a48] bg-[linear-gradient(180deg,#3d3b3a_0%,#2d2d2d_100%)] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-5">
        <div className="relative overflow-hidden rounded-[1.9rem] border border-[#5d5955] bg-[radial-gradient(circle_at_50%_16%,rgba(138,190,186,0.17),transparent_22%),radial-gradient(circle_at_16%_18%,rgba(255,229,168,0.07),transparent_20%),radial-gradient(circle_at_86%_20%,rgba(169,197,223,0.1),transparent_18%),linear-gradient(180deg,#122038_0%,#0e1830_34%,#0c1530_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-5">
          <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:repeating-linear-gradient(to_right,transparent_0,transparent_calc(33.333%-1px),rgba(195,163,102,0.3)_calc(33.333%-1px),rgba(195,163,102,0.3)_33.333%),repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(25%-1px),rgba(195,163,102,0.22)_calc(25%-1px),rgba(195,163,102,0.22)_25%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_10%_8%,rgba(255,245,210,0.9)_0_1px,transparent_1.5px),radial-gradient(circle_at_28%_4%,rgba(255,255,255,0.55)_0_1px,transparent_1.5px),radial-gradient(circle_at_92%_18%,rgba(255,228,177,0.8)_0_1px,transparent_1.5px),radial-gradient(circle_at_82%_38%,rgba(220,233,255,0.55)_0_1px,transparent_1.5px),radial-gradient(circle_at_3%_46%,rgba(255,237,204,0.5)_0_1px,transparent_1.5px),radial-gradient(circle_at_96%_62%,rgba(255,255,255,0.65)_0_1px,transparent_1.5px)]" />
          <div className="pointer-events-none absolute -left-14 top-8 h-56 w-56 rounded-full border border-[#d9c495]/20" />
          <div className="pointer-events-none absolute left-8 top-16 h-40 w-40 rounded-full border border-[#d9c495]/10" />
          <div className="pointer-events-none absolute right-[-3rem] top-16 h-64 w-64 rounded-full border border-[#d9c495]/15" />
          <div className="pointer-events-none absolute bottom-[27%] left-[11%] h-80 w-80 rounded-full border border-[#d9c495]/10" />
          <div className="pointer-events-none absolute bottom-[11%] right-[6%] h-56 w-56 rounded-full border border-[#d9c495]/8" />

          <div className="relative z-10 mx-auto w-full max-w-[680px] pb-3 pt-2 sm:pb-5 sm:pt-1">
            <TitlePlate />
          </div>

          <section className="relative z-10 rounded-[1.8rem] border border-[#746a60] bg-[linear-gradient(180deg,rgba(17,22,43,0.92),rgba(10,17,34,0.95))] px-2 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_20px_40px_rgba(0,0,0,0.25)] sm:px-4 sm:py-5" aria-label="Variaciones de marcadores steampunk">
            <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] bg-[radial-gradient(circle_at_50%_49%,rgba(255,215,128,0.12),transparent_24%),radial-gradient(circle_at_50%_18%,rgba(195,229,255,0.08),transparent_15%),radial-gradient(circle_at_50%_78%,rgba(100,145,214,0.07),transparent_19%)]" />
            <div className="grid grid-cols-3 gap-x-1 gap-y-3 sm:gap-x-3 sm:gap-y-5">
              {markers.map((marker) => (
                <button
                  key={marker.id}
                  type="button"
                  onClick={() => setSelected(marker)}
                  className="group relative aspect-square p-1 text-left transition-transform duration-300 hover:scale-[1.028] focus:outline-none focus-visible:scale-[1.028]"
                  aria-label={marker.name}
                >
                  <div className="mx-auto h-full w-full max-w-[255px]">
                    <MarkerArt variant={marker.variant} number={marker.number} />
                  </div>
                  <span className="sr-only">{marker.name}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="pointer-events-none absolute bottom-4 right-4 z-10 sm:bottom-6 sm:right-5">
            <Sparkle />
          </div>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-xl rounded-[2rem] border border-[#6c6258] bg-[linear-gradient(180deg,#151f32_0%,#0f1728_100%)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 rounded-[1.6rem] border border-[#5e554c] bg-[radial-gradient(circle_at_50%_40%,rgba(208,182,120,0.16),transparent_25%),linear-gradient(180deg,#151b2c,#0b1220)] p-4">
              <div className="mx-auto aspect-square max-w-[340px]">
                <MarkerArt variant={selected.variant} number={selected.number} />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-[0.72rem] uppercase tracking-[0.35em] text-[#c1b19e]">Marcador {selected.id.toString().padStart(2, '0')}</p>
              <h2 className="text-2xl font-semibold tracking-wide text-[#e3c287] sm:text-[2rem]">{selected.name}</h2>
              <p className="text-sm uppercase tracking-[0.22em] text-[#8fa1b5]">{selected.material}</p>
              <p className="mx-auto max-w-md text-sm leading-6 text-stone-300/85">{selected.note}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-full border border-[#a67b45] bg-[linear-gradient(180deg,#c68c44,#8c5a25)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#fff7ea] transition hover:brightness-110"
            >
              Cerrar vista
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
