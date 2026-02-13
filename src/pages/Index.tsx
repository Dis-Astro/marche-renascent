import { useNavigate } from "react-router-dom";
import MedievalBuilding from "@/components/MedievalBuilding";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-2 text-center">
        <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer">
          <h2 className="text-4xl font-bold text-primary tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Cingoli
          </h2>
        </a>
        <div className="flex items-center justify-center gap-8 mt-1">
          <span className="text-xs text-muted-foreground tracking-[0.25em] uppercase">Consolidamento</span>
          <span className="text-xs text-muted-foreground tracking-[0.25em] uppercase">Restauro</span>
        </div>
      </header>

      {/* Hero - flyer-style layout */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        <div className="w-full max-w-sm mx-auto relative mt-4 mb-6">
          {/* Building illustration */}
          <div className="flex justify-center">
            <MedievalBuilding className="w-52 md:w-60" />
          </div>

          {/* Overlapping text blocks - positioned to the right like the flyer */}
          <div className="absolute top-8 right-0 flex flex-col items-end gap-2">
            <div className="bg-primary text-primary-foreground px-5 py-2 text-lg font-bold tracking-wider">
              MARCHE
            </div>
            <div className="bg-primary text-primary-foreground px-5 py-1.5 text-sm font-bold tracking-wider">
              POST‑SISMA
            </div>
          </div>

          {/* Subtitle text - right aligned like flyer */}
          <div className="absolute bottom-16 right-0 max-w-[55%] text-right">
            <p className="text-foreground/80 text-sm leading-relaxed italic">
              Recupera il tuo edificio storico con professionisti specializzati nella ricostruzione e nel consolidamento.
            </p>
          </div>
        </div>

        {/* CTA - flyer style box */}
        <div className="w-full max-w-sm mx-auto flex flex-col items-end mt-2">
          <button
            onClick={() => navigate("/candidatura")}
            className="bg-primary text-primary-foreground px-8 py-3 text-sm font-bold tracking-wider hover:opacity-90 transition-opacity"
          >
            CANDIDA IL TUO EDIFICIO
          </button>
          <p className="text-muted-foreground text-[11px] mt-2 mr-1">
            Richiede meno di 2 minuti.
          </p>
        </div>

        {/* Persuasive section */}
        <section className="max-w-sm mx-auto mt-12 mb-4">
          <h2 className="text-xl font-bold text-foreground mb-3">
            Il tuo edificio può tornare a vivere.
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Ti aiutiamo a valutare gratuitamente il tuo caso.<br />
            Analizziamo la situazione tecnica e ti guidiamo nel percorso di ricostruzione.<br />
            Nessun impegno, solo una prima valutazione professionale.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Index;
