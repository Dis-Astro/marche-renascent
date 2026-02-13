import { useNavigate } from "react-router-dom";
import MedievalBuilding from "@/components/MedievalBuilding";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section - Full viewport */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* Top bar */}
        <header className="w-full flex items-center justify-between px-8 md:px-16 pt-8">
          <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer" className="group">
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Cingoli</h1>
          </a>
          <div className="flex items-center gap-6">
            <span className="hidden md:inline text-[11px] text-muted-foreground tracking-[0.3em] uppercase">Consolidamento</span>
            <span className="hidden md:inline text-[11px] text-muted-foreground tracking-[0.3em] uppercase">Restauro</span>
          </div>
        </header>

        {/* Main hero content */}
        <div className="flex-1 flex items-center px-8 md:px-16 pb-16">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left column - Text */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-primary" />
                <span className="text-[11px] text-primary tracking-[0.3em] uppercase font-medium">
                  Ricostruzione post-sisma
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
                Recupera il tuo{" "}
                <span className="text-primary italic">edificio storico</span>
              </h2>

              <p className="text-foreground/60 text-base md:text-lg leading-relaxed max-w-md">
                Professionisti specializzati nella ricostruzione e nel consolidamento di edifici storici nelle Marche.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => navigate("/candidatura")}
                  className="bg-primary text-primary-foreground px-8 py-4 text-[13px] font-bold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                >
                  Candida il tuo edificio
                </button>
                <span className="text-muted-foreground text-[11px] tracking-wide">
                  Meno di 2 min.
                </span>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-3 pt-4">
                <div className="border border-primary text-primary px-5 py-2 text-[11px] font-bold tracking-[0.2em] uppercase">
                  Marche
                </div>
                <div className="border border-primary text-primary px-5 py-2 text-[11px] font-bold tracking-[0.2em] uppercase">
                  Post‑Sisma
                </div>
              </div>
            </div>

            {/* Right column - Illustration + accent */}
            <div className="relative flex items-center justify-center">
              {/* Large background text */}
              <span className="absolute text-[140px] md:text-[200px] font-bold text-primary/[0.04] tracking-tighter select-none pointer-events-none leading-none">
                C
              </span>

              {/* Decorative line */}
              <div className="absolute top-0 right-0 w-[1px] h-32 bg-primary/20 hidden lg:block" />
              <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-primary/20 hidden lg:block" />

              <MedievalBuilding className="w-56 md:w-72 lg:w-80 relative z-10" />
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="w-full border-t border-border px-8 md:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-foreground/80 text-sm font-semibold">
            Il tuo edificio può tornare a vivere.
          </p>
          <p className="text-muted-foreground text-[12px] leading-relaxed max-w-sm text-center md:text-right">
            Ti aiutiamo a valutare gratuitamente il tuo caso. Analizziamo la situazione e ti guidiamo nel percorso di ricostruzione.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
