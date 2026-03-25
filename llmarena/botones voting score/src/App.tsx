export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-14 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-violet-300">Assets generados</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Fichas sin texto</h1>
          <p className="mx-auto max-w-2xl text-slate-300">
            Versiones limpias de las tres insignias, listas para usar en UI o exportar.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-3">
          <article className="space-y-4 text-center">
            <img
              src="/images/finalizar-partida-sin-texto.png"
              alt="Insignia de finalizar partida sin texto"
              className="mx-auto w-full max-w-[320px] drop-shadow-[0_12px_30px_rgba(76,88,255,0.35)]"
            />
            <a
              href="/images/finalizar-partida-sin-texto.png"
              download
              className="inline-block text-sm text-violet-200 transition hover:text-violet-100"
            >
              Descargar PNG
            </a>
          </article>

          <article className="space-y-4 text-center">
            <img
              src="/images/nueva-ronda-sin-texto.png"
              alt="Insignia de nueva ronda sin texto"
              className="mx-auto w-full max-w-[320px] drop-shadow-[0_12px_30px_rgba(66,214,226,0.28)]"
            />
            <a
              href="/images/nueva-ronda-sin-texto.png"
              download
              className="inline-block text-sm text-violet-200 transition hover:text-violet-100"
            >
              Descargar PNG
            </a>
          </article>

          <article className="space-y-4 text-center">
            <img
              src="/images/resetear-marcadores-sin-texto.png"
              alt="Insignia de resetear marcadores sin texto"
              className="mx-auto w-full max-w-[320px] drop-shadow-[0_12px_30px_rgba(179,190,255,0.3)]"
            />
            <a
              href="/images/resetear-marcadores-sin-texto.png"
              download
              className="inline-block text-sm text-violet-200 transition hover:text-violet-100"
            >
              Descargar PNG
            </a>
          </article>
        </section>
      </div>
    </main>
  );
}
