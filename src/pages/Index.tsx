import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MedievalBuilding from "@/components/MedievalBuilding";
import { featureCards, howItWorks, faqItems } from "@/config/featureCards";
import { ChevronDown } from "lucide-react";

const DualCTA = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => navigate("/candidatura?tipo=privato")}
          className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 text-[13px] font-bold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
        >
          Sono un privato
        </button>
        <button
          onClick={() => navigate("/candidatura?tipo=professionista")}
          className="w-full sm:w-auto border-2 border-primary text-primary px-8 py-4 text-[13px] font-bold tracking-[0.15em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Sono un professionista
        </button>
      </div>
      <p className="text-muted-foreground text-[11px] tracking-wide text-center sm:text-left">
        Compilazione rapida
      </p>
    </div>
  );
};

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showMobileChoice, setShowMobileChoice] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 md:px-16 pt-6 pb-2">
        <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer">
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Cingoli</h1>
        </a>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-[11px] text-muted-foreground tracking-[0.3em] uppercase">Consolidamento</span>
          <span className="hidden md:inline text-[11px] text-muted-foreground tracking-[0.3em] uppercase">Restauro</span>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center px-6 md:px-16 py-12 md:py-20">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-primary" />
              <span className="text-[11px] text-primary tracking-[0.3em] uppercase font-medium">
                Ricostruzione post-sisma
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.08] tracking-tight">
              Recupera il tuo{" "}
              <span className="text-primary italic">edificio storico</span>
            </h2>

            <p className="text-foreground/60 text-base md:text-lg leading-relaxed max-w-md">
              Professionisti specializzati nella ricostruzione e nel consolidamento di edifici storici nelle Marche.
            </p>

            <p className="text-muted-foreground text-sm italic">
              Valutazione preliminare gratuita. Compila anche se non hai tutti i documenti.
            </p>

            <DualCTA />

            <div className="flex items-center gap-3 pt-2">
              <div className="border border-primary text-primary px-5 py-2 text-[11px] font-bold tracking-[0.2em] uppercase">
                Marche
              </div>
              <div className="border border-primary text-primary px-5 py-2 text-[11px] font-bold tracking-[0.2em] uppercase">
                Post‑Sisma
              </div>
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="relative flex items-center justify-center">
            <span className="absolute text-[160px] md:text-[220px] font-bold text-primary/[0.04] tracking-tighter select-none pointer-events-none leading-none">
              C
            </span>
            <div className="absolute top-0 right-0 w-[1px] h-32 bg-primary/20 hidden lg:block" />
            <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-primary/20 hidden lg:block" />
            <MedievalBuilding className="w-48 md:w-64 lg:w-72 text-primary relative z-10" />
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-6 md:px-16 py-16 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map((card, i) => (
              <div key={i} className="space-y-4">
                <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-widest">Immagine {i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-16 py-16 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">
            Come funziona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((s, i) => (
              <div key={i} className="text-center space-y-3">
                <span className="text-4xl font-bold text-primary/20">{s.step}</span>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <DualCTA />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-16 py-16 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Domande frequenti</h2>
          <div className="divide-y divide-border">
            {faqItems.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="text-sm text-muted-foreground pb-4">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom strip */}
      <div className="w-full border-t border-border px-6 md:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-foreground/80 text-sm font-semibold">
          Il tuo edificio può tornare a vivere.
        </p>
        <p className="text-muted-foreground text-[12px] leading-relaxed max-w-sm text-center md:text-right">
          Ti aiutiamo a valutare gratuitamente il tuo caso.
        </p>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        {showMobileChoice ? (
          <div className="bg-background border-t border-border p-4 space-y-2">
            <button
              onClick={() => navigate("/candidatura?tipo=privato")}
              className="w-full bg-primary text-primary-foreground py-3 text-[13px] font-bold tracking-[0.15em] uppercase"
            >
              Sono un privato
            </button>
            <button
              onClick={() => navigate("/candidatura?tipo=professionista")}
              className="w-full border-2 border-primary text-primary py-3 text-[13px] font-bold tracking-[0.15em] uppercase"
            >
              Sono un professionista
            </button>
            <button
              onClick={() => setShowMobileChoice(false)}
              className="w-full text-muted-foreground text-xs py-1"
            >
              Chiudi
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowMobileChoice(true)}
            className="w-full bg-primary text-primary-foreground py-4 text-[13px] font-bold tracking-[0.15em] uppercase"
          >
            Candidati
          </button>
        )}
      </div>

      {/* Spacer for mobile sticky */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default Index;
