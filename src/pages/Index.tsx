import { useNavigate } from "react-router-dom";
import MedievalBuilding from "@/components/MedievalBuilding";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 text-center">
        <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer">
          <h2 className="text-3xl font-bold text-primary tracking-tight">Cingoli</h2>
        </a>
        <p className="text-sm text-muted-foreground tracking-widest uppercase mt-1">
          Consolidamento &nbsp;–&nbsp; Restauro
        </p>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <MedievalBuilding className="w-48 md:w-56 mb-8" />

        <div className="text-center max-w-md mx-auto space-y-2 mb-10">
          <div className="inline-block bg-primary text-primary-foreground px-5 py-2 text-lg font-bold tracking-wide">
            MARCHE
          </div>
          <div className="inline-block bg-primary text-primary-foreground px-5 py-2 text-base font-bold tracking-wide ml-2">
            POST‑SISMA
          </div>
          <p className="text-foreground/80 text-base leading-relaxed mt-4">
            Recupera il tuo edificio storico con professionisti specializzati nella ricostruzione e nel consolidamento.
          </p>
        </div>

        {/* Persuasive */}
        <section className="max-w-md mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Il tuo edificio può tornare a vivere.
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Ti aiutiamo a valutare gratuitamente il tuo caso.<br />
            Analizziamo la situazione tecnica e ti guidiamo nel percorso di ricostruzione.<br />
            Nessun impegno, solo una prima valutazione professionale.
          </p>
        </section>

        {/* CTA */}
        <button
          onClick={() => navigate("/candidatura")}
          className="bg-primary text-primary-foreground px-10 py-4 text-base font-bold tracking-wide hover:opacity-90 transition-opacity"
        >
          CANDIDA IL TUO EDIFICIO
        </button>
        <p className="text-muted-foreground text-xs mt-3">
          Richiede meno di 2 minuti.
        </p>
      </main>
    </div>
  );
};

export default Index;
