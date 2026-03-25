import { PositionMarkerAsset, type MarkerData } from "./components/PositionMarkerAsset";

const portraitIcons = {
  first: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="40" r="18" fill="rgba(255,247,221,0.92)" />
      <path d="M29 84C33 65 43 56 50 56C57 56 67 65 71 84" fill="rgba(255,243,214,0.88)" />
      <path d="M31 32C36 14 58 10 69 22C66 19 60 19 56 22C55 12 40 12 31 32Z" fill="rgba(120,72,18,0.78)" />
      <circle cx="44" cy="40" r="2.6" fill="#7B4A17" />
      <circle cx="57" cy="40" r="2.6" fill="#7B4A17" />
      <path d="M45 50C48 53 52 53 55 50" stroke="#9A5B1B" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  ),
  second: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="38" r="17" fill="rgba(252,252,254,0.95)" />
      <path d="M28 84C31 66 42 56 50 56C58 56 69 66 72 84" fill="rgba(233,239,249,0.9)" />
      <path d="M31 34C34 16 46 10 58 12C71 14 75 27 72 39C69 25 61 22 54 22C47 22 39 26 31 34Z" fill="rgba(109,71,35,0.8)" />
      <rect x="35" y="36" width="12" height="9" rx="4.5" stroke="#5E6572" strokeWidth="3" />
      <rect x="53" y="36" width="12" height="9" rx="4.5" stroke="#5E6572" strokeWidth="3" />
      <path d="M47 40H53" stroke="#5E6572" strokeWidth="3" strokeLinecap="round" />
      <circle cx="42" cy="40.5" r="2" fill="#5E6572" />
      <circle cx="58" cy="40.5" r="2" fill="#5E6572" />
      <path d="M45 50C48 52 52 52 55 50" stroke="#8E5C3C" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  third: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="40" r="18" fill="rgba(255,234,208,0.96)" />
      <path d="M27 84C31 66 41 56 50 56C59 56 69 66 73 84" fill="rgba(251,208,157,0.74)" />
      <path d="M24 43C30 18 47 9 68 16C77 19 81 30 79 42C73 29 60 22 47 24C37 26 30 31 24 43Z" fill="rgba(88,40,28,0.84)" />
      <circle cx="43" cy="41" r="2.5" fill="#7A3F2A" />
      <circle cx="57" cy="41" r="2.5" fill="#7A3F2A" />
      <path d="M42 51C48 56 54 56 60 51" stroke="#C36E45" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  fourth: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="39" r="17" fill="rgba(245,244,244,0.94)" />
      <path d="M29 84C33 67 42 58 50 58C58 58 67 67 71 84" fill="rgba(150,175,204,0.58)" />
      <path d="M29 38C30 19 43 12 57 14C68 15 73 25 71 36C67 29 61 26 56 25C46 24 38 28 29 38Z" fill="rgba(35,38,51,0.78)" />
      <rect x="36" y="35" width="11" height="8" rx="4" stroke="#4A536E" strokeWidth="3" />
      <rect x="53" y="35" width="11" height="8" rx="4" stroke="#4A536E" strokeWidth="3" />
      <path d="M47 39H53" stroke="#4A536E" strokeWidth="3" strokeLinecap="round" />
      <circle cx="42" cy="39" r="2" fill="#4A536E" />
      <circle cx="58" cy="39" r="2" fill="#4A536E" />
      <path d="M45 49C48 51 52 51 55 49" stroke="#90604C" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  last: (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="39" r="17" fill="rgba(255,226,214,0.94)" />
      <path d="M28 84C31 66 42 56 50 56C58 56 69 66 72 84" fill="rgba(255,120,77,0.4)" />
      <path d="M27 40C31 18 47 11 61 13C72 15 77 24 74 38C69 29 60 24 53 23C44 22 35 27 27 40Z" fill="rgba(92,25,18,0.84)" />
      <circle cx="43" cy="40" r="2.6" fill="#712116" />
      <circle cx="57" cy="40" r="2.6" fill="#712116" />
      <path d="M43 52C48 49 52 49 57 52" stroke="#7D2415" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  ),
};

const markerData: MarkerData[] = [
  {
    variant: "first",
    placeLabel: "1",
    name: "Irene",
    subtitle: "La protectora",
    delta: "+4",
    score: 4,
    initials: "IR",
    icon: portraitIcons.first,
  },
  {
    variant: "second",
    placeLabel: "2",
    name: "Juan",
    subtitle: "Don de gentes",
    delta: "+4",
    score: 4,
    initials: "JU",
    icon: portraitIcons.second,
  },
  {
    variant: "third",
    placeLabel: "3",
    name: "Tina",
    subtitle: "El impostor",
    delta: "+2",
    score: 2,
    initials: "TI",
    icon: portraitIcons.third,
  },
  {
    variant: "fourth",
    placeLabel: "4",
    name: "Trini",
    subtitle: "La viajera",
    delta: "+0",
    score: 0,
    initials: "TR",
    icon: portraitIcons.fourth,
  },
  {
    variant: "last",
    placeLabel: "Último",
    name: "Santi",
    subtitle: "El finalista",
    delta: "+0",
    score: 0,
    initials: "SA",
    icon: portraitIcons.last,
  },
];

const specs = [
  { label: "1º", tone: "Oro real", detail: "Relieves cálidos, ribete brillante, joya central y badge ceremonial." },
  { label: "2º", tone: "Plata mecánica", detail: "Acabado pulido con panel frío, remaches y reflejo metálico suave." },
  { label: "3º", tone: "Bronce turquesa", detail: "Patina steampunk, cobre antiguo y acentos verdiazules ornamentales." },
  { label: "4º", tone: "Hierro oscuro", detail: "Acero ennegrecido con contraste bajo y brillo azulado discreto." },
  { label: "Último", tone: "Ascua / lava", detail: "Bordes incandescentes, fondo carbonizado y gradientes rojos de derrota." },
];

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#171516] text-white">
      <div className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(231,201,118,0.22),_transparent_32%),radial-gradient(circle_at_20%_30%,_rgba(88,126,180,0.18),_transparent_24%),radial-gradient(circle_at_80%_72%,_rgba(255,107,61,0.14),_transparent_22%),linear-gradient(180deg,_#2b241e_0%,_#1a1718_36%,_#0f1016_100%)]" />
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_center,_rgba(255,255,255,0.16)_0,_transparent_2px)] [background-size:54px_54px]" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full border border-amber-200/15" />
        <div className="absolute left-6 top-40 h-96 w-96 rounded-full border border-amber-100/10" />
        <div className="absolute right-[-6rem] top-0 h-[28rem] w-[28rem] rounded-full border border-amber-100/10" />
        <div className="absolute bottom-24 right-6 h-80 w-80 rounded-full border border-sky-100/10" />

        <main className="relative mx-auto flex min-h-screen w-full max-w-[1300px] flex-col gap-10 px-4 py-10 md:px-8 xl:px-12">
          <header className="mx-auto max-w-4xl text-center">
            <p className="mb-3 inline-flex rounded-full border border-amber-200/20 bg-amber-100/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-100/80">
              Assets de marcadores
            </p>
            <h1 className="bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 bg-clip-text text-5xl font-black uppercase tracking-[0.12em] text-transparent md:text-7xl">
              Puestos 1, 2, 3, 4 y último
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-balance text-base leading-7 text-stone-300 md:text-lg">
              Implementación en React + Tailwind con cajas estilo tablero steampunk. Cada asset está construido como componente reutilizable y parametrizable por variante, color, puntuación y etiqueta de puesto.
            </p>
          </header>

          <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30 backdrop-blur-sm md:p-6 xl:p-8">
            {markerData.map((marker) => (
              <PositionMarkerAsset key={marker.variant} {...marker} />
            ))}
          </section>

          <section className="grid gap-4 rounded-[2rem] border border-white/10 bg-black/20 p-5 backdrop-blur-sm md:grid-cols-2 xl:grid-cols-5">
            {specs.map((item) => (
              <article
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20"
              >
                <div className="text-sm font-black uppercase tracking-[0.24em] text-amber-200/85">{item.label}</div>
                <div className="mt-2 text-xl font-bold text-white">{item.tone}</div>
                <p className="mt-2 text-sm leading-6 text-stone-300">{item.detail}</p>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
