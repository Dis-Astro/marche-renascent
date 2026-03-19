import logoCingoli from "@/assets/logo-cingoli.png";

const Grazie = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border px-6 h-14 flex items-center">
        <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer" className="-my-1">
          <img src={logoCingoli} alt="Impresa Cingoli" className="h-10" />
        </a>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-primary text-2xl font-bold">✓</span>
          </div>

          <h1 className="text-3xl font-extrabold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            Candidatura inviata correttamente
          </h1>

          <p className="text-muted-foreground text-sm mb-2">Abbiamo ricevuto la tua richiesta e la prenderemo in carico al più presto.</p>
          <p className="text-muted-foreground text-sm">Ti contatteremo dopo una prima valutazione tecnica.</p>

          <div className="flex flex-col gap-3 mt-8">
            <a
              href="/"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 text-sm font-bold rounded tracking-wide hover:opacity-90 transition-opacity"
            >
              Torna alla home
            </a>
            <a href="/candidatura" className="text-sm text-primary hover:underline font-medium">
              Compila una nuova candidatura
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Grazie;
