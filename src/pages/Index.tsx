import { useNavigate } from "react-router-dom";
import MedievalBuilding from "@/components/MedievalBuilding";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between py-10 px-6">
      {/* Header */}
      <header className="text-center mb-2">
        <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer">
          <h1 className="text-5xl font-bold text-primary tracking-tight">Cingoli</h1>
        </a>
        <div className="flex items-center justify-center gap-10 mt-2">
          <span className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase">Consolidamento</span>
          <span className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase">Restauro</span>
        </div>
      </header>

      {/* Central composition */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* Tags */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-primary text-primary-foreground px-6 py-2.5 text-base font-bold tracking-[0.15em]">
            MARCHE
          </div>
          <div className="bg-primary text-primary-foreground px-6 py-2.5 text-base font-bold tracking-[0.15em]">
            POST‑SISMA
          </div>
        </div>

        {/* Illustration */}
        <MedievalBuilding className="w-44 md:w-52 mb-10" />

        {/* Copy */}
        <p className="text-foreground/75 text-center text-[15px] leading-relaxed max-w-xs italic mb-10">
          Recupera il tuo edificio storico con professionisti specializzati nella ricostruzione e nel consolidamento.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/candidatura")}
          className="bg-primary text-primary-foreground px-10 py-3.5 text-sm font-bold tracking-[0.15em] hover:opacity-90 transition-opacity mb-2"
        >
          CANDIDA IL TUO EDIFICIO
        </button>
        <p className="text-muted-foreground text-[11px] tracking-wide">
          Richiede meno di 2 minuti.
        </p>
      </div>

      {/* Persuasive footer section */}
      <section className="text-center max-w-xs mt-12">
        <h2 className="text-lg font-bold text-foreground mb-3">
          Il tuo edificio può tornare a vivere.
        </h2>
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          Ti aiutiamo a valutare gratuitamente il tuo caso.
          Analizziamo la situazione tecnica e ti guidiamo nel percorso di ricostruzione.
          Nessun impegno, solo una prima valutazione professionale.
        </p>
      </section>
    </div>
  );
};

export default Index;
