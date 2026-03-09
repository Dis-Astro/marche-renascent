import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import roadmapImg from "@/assets/roadmap.jpg";
import {
  FileCheck,
  FileText,
  HardHat,
  Landmark,
  Award,
  Users,
  MapPin,
  ClipboardCheck,
  FileSignature,
  Building2,
  Hammer,
  ChevronDown,
  Menu,
  X,
  ArrowUpRight } from
"lucide-react";

import sisma001 from "@/assets/sisma-001.jpg";
import sisma002 from "@/assets/sisma-002.jpg";
import sisma003 from "@/assets/sisma-003.jpg";
import sisma004 from "@/assets/sisma-004.jpg";
import sismaBefore from "@/assets/sisma-before.jpg";
import sisma005 from "@/assets/sisma-005.jpg";
import sismaAfter from "@/assets/sisma-after.jpg";
import logoCingoli from "@/assets/logo-cingoli.png";

// ─── BEFORE/AFTER SLIDER ──────────────────────────────────────────────────────
const BeforeAfterSlider = ({ before, after }: {before: string;after: string;}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition(x / rect.width * 100);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) updatePosition(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden cursor-col-resize select-none touch-none shadow-lg"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}>
      
      {/* After (full) */}
      <img src={after} alt="Dopo i lavori" className="absolute inset-0 w-full h-full object-cover" />
      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={before}
          alt="Prima dei lavori"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100vw", maxWidth: "none" }} />
        
      </div>
      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground shadow-lg"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <span className="text-primary-foreground text-xs font-bold">⇔</span>
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-3 left-3 bg-foreground/70 text-background text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
        Prima
      </span>
      <span className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
        Dopo
      </span>
    </div>);

};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const services = [
{
  num: "01",
  icon: <FileCheck className="w-5 h-5" />,
  title: "Presa in carico (24 ore)",
  text: "Esaminiamo lo stato e il contesto dell'immobile."
},
{
  num: "02",
  icon: <FileText className="w-5 h-5" />,
  title: "Documenti e orientamento",
  text: "Raccogliamo e analizziamo la documentazione necessaria per definire con precisione lo stato della pratica al fine di individuare criticità, rischi e opportunità."
},
{
  num: "03",
  icon: <HardHat className="w-5 h-5" />,
  title: "Piano operativo",
  text: "Definiamo il percorso operativo per arrivare all'avvio dei lavori, anche attraverso un confronto diretto con il tecnico incaricato."
},
{
  num: "04",
  icon: <Landmark className="w-5 h-5" />,
  title: "Struttura e continuità",
  text: "Realizziamo gli interventi programmati nel rispetto dei tempi garantendo aggiornamenti periodici per monitorare l'avanzamento."
}];


const processSteps = [
{
  num: "01",
  icon: <ClipboardCheck className="w-5 h-5" />,
  title: "Valutazione iniziale",
  text: "Esaminiamo lo stato e il contesto dell'immobile. "
},
{
  num: "02",
  icon: <FileSignature className="w-5 h-5" />,
  title: "Documenti e perimetro",
  text: "Raccogliamo e analizziamo la documentazione necessaria per definire con precisione lo stato della pratica al fine di individuare criticità, rischi e opportunità."
},
{
  num: "03",
  icon: <Building2 className="w-5 h-5" />,
  title: "Percorso amministrativo",
  text: "Definiamo il percorso operativo per arrivare all'avvio dei lavori supportando il tecnico incaricato."
},
{
  num: "04",
  icon: <Hammer className="w-5 h-5" />,
  title: "Esecuzione lavori",
  text: "Realizziamo gli interventi programmati nel rispetto dei tempi garantendo aggiornamenti periodici per monitorare l'avanzamento."
}];


const faqItems = [
{
  q: "Se cambio impresa perdo il contributo?",
  a: "Dipende dalla situazione specifica. Valutiamo lo stato della pratica e dei lavori per indicarti i passaggi necessari. Non possiamo garantire esiti, ma ti diamo un quadro chiaro di cosa serve."
},
{
  q: "L'altra impresa mi chiede penali, cosa faccio?",
  a: "Il primo passo è inquadrare il contratto in essere e lo stato dei lavori. Se emergono aspetti legali, ti indichiamo di rivolgerti a un Progettista qualificato per la tutela dei tuoi interessi."
},
{
  q: "Quanto tempo serve per ripartire?",
  a: "I tempi dipendono da molti fattori, incluse le tempistiche degli enti e dell'USR che non sono sotto il nostro controllo. Ti forniamo una roadmap con milestone chiare, distinguendo ciò che possiamo gestire direttamente."
},
{
  q: "Vi occupate delle pratiche USR ferme?",
  a: "Non ci sostituiamo alle figure previste per legge. Orientiamo e ci coordiniamo con il progettista, se presente, per raccogliere e predisporre ciò che serve ai fini della pratica."
},
{
  q: "Non ho tutti i documenti: posso inviare la candidatura?",
  a: "Sì, invia ciò che hai a disposizione. Dopo una prima analisi ti indicheremo cosa manca e come procedere."
}];


// ─── DUAL CTA ─────────────────────────────────────────────────────────────────

const DualCTA = ({ variant = "light" }: {variant?: "light" | "dark";}) => {
  const navigate = useNavigate();
  const isLight = variant === "light";
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        onClick={() => navigate("/candidatura?tipo=proprietario")}
        className="flex-1 sm:flex-none bg-primary text-primary-foreground px-7 py-3.5 text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity rounded">
        
        Sono un Proprietario
      </button>
      <button
        onClick={() => navigate("/candidatura?tipo=progettista")}
        className={`flex-1 sm:flex-none px-7 py-3.5 text-sm font-bold tracking-widest uppercase rounded border-2 transition-colors ${
        isLight ?
        "border-foreground text-foreground hover:bg-foreground hover:text-background" :
        "border-white text-white hover:bg-white hover:text-foreground"}`
        }>
        
        Sono un Progettista
      </button>
    </div>);

};
// ─── ROADMAP CARD ─────────────────────────────────────────────────────────────

const RoadmapCard = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="rounded-xl overflow-hidden shadow-lg h-64 md:h-80 cursor-pointer group relative">
        
        <img
          src={roadmapImg}
          alt="Roadmap – Cronologia di una Commessa Sisma 2016"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        

        <div className="absolute inset-0 bg-transparent group-hover:bg-foreground/5 transition-colors flex items-center justify-center">
          <span className="bg-background/60 backdrop-blur-sm text-foreground px-4 py-2 rounded text-sm font-bold">
            Clicca per ingrandire
          </span>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {open &&
      <div
        className="fixed inset-0 z-[100] bg-foreground/90 flex items-center justify-center p-4 cursor-pointer"
        onClick={() => setOpen(false)}>
        
          <button
          className="absolute top-4 right-4 text-background hover:text-primary transition-colors z-10"
          onClick={() => setOpen(false)}>
          
            <X className="w-8 h-8" />
          </button>
          <img
          src={roadmapImg}
          alt="Roadmap – Cronologia di una Commessa Sisma 2016"
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()} />
        
        </div>
      }
    </>);

};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const Index = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showMobileChoice, setShowMobileChoice] = useState(false);

  const navLinks = [
  { label: "Come Operiamo", href: "#servizi" },
  { label: "Chi Siamo", href: "#chi-siamo" }];


  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-transparent">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
          <a
            href="https://impresacingoli.it"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center -my-2">
            
            <img src={logoCingoli} alt="Cingoli – Consolidamento Restauro" className="h-16" />
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((l) =>
            <li key={l.href}>
                <button
                onClick={() => scrollTo(l.href)}
                className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors">
                
                  {l.label}
                </button>
              </li>
            )}
            <li>
              <button
                onClick={() => navigate("/candidatura?tipo=proprietario")}
                className="bg-primary text-primary-foreground px-5 py-2 text-sm font-bold rounded hover:opacity-90 transition-opacity">
                
                Candidati
              </button>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen &&
        <div className="md:hidden bg-background border-t border-border px-6 py-4 flex flex-col gap-4">
            {navLinks.map((l) =>
          <button
            key={l.href}
            onClick={() => scrollTo(l.href)}
            className="text-sm font-semibold text-left text-foreground/80 hover:text-primary">
            
                {l.label}
              </button>
          )}
            <button
            onClick={() => {
              navigate("/candidatura?tipo=proprietario");
              setMobileOpen(false);
            }}
            className="bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold rounded">
            
              Candidati ora
            </button>
          </div>
        }
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <header className="relative bg-background pt-16 pb-24 overflow-hidden" id="hero">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase text-primary mb-4">
              Ricostruzione post‑sisma 2016
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight text-foreground mb-6"
              style={{ fontFamily: "Outfit, sans-serif" }}>
              
              Casa danneggiata dal sisma 2016? <span className="text-primary">
LA RIPARIAMO NOI.
              </span>
            </h1>
            <p className="text-foreground/60 text-base md:text-lg leading-relaxed max-w-lg mx-auto md:mx-0 mb-2">
              La nostra impresa ha oltre 90 anni di esperienza. Valutiamo lo stato del tuo immobile e definiamo un
              percorso operativo chiaro. Entro 24 ore prendiamo in carico la richiesta e indichiamo cosa serve per
              procedere.
            </p>

            <DualCTA variant="light" />

            {/* Badges */}
            <div className="flex items-center gap-3 mt-6 justify-center md:justify-start">
              

              
            </div>
          </div>

          {/* Hero image */}
          <div className="flex-1 w-full md:w-auto">
            <div className="w-full h-72 md:h-96 rounded-xl shadow-lg overflow-hidden relative">
              <img src={sisma001} alt="Danni del sisma 2016" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Curved separator */}
        <div className="absolute bottom-0 left-0 w-full leading-[0]">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60C400 60 600 0 1440 0V60H0Z" fill="hsl(var(--muted))" />
          </svg>
        </div>
      </header>

      {/* ── SOCIAL PROOF MARQUEE ───────────────────────────────────────────── */}
      <div className="bg-foreground text-background py-3 overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-marquee gap-0">
          {["Presa in carico entro 24 ore", "Valutazione della situazione del tuo immobile",
          "Disponibilità a supportare i tecnici incaricati",
          "Indicazioni chiare sugli adempimenti necessari",
          "Trasparenza sui tempi di realizzazione",
          "Oltre 90 anni di esperienza a tua disposizione",
          "Presa in carico entro 24 ore",
          "Valutazione della situazione del tuo immobile",
          "Disponibilità a supportare i tecnici incaricati",
          "Indicazioni chiare sugli adempimenti necessari",
          "Trasparenza sui tempi di realizzazione",
          "Oltre 90 anni di esperienza a tua disposizione"].
          map((t, i) =>
          <span key={i} className="mx-10 text-sm font-semibold opacity-90">
              {t} •
            </span>
          )}
        </div>
      </div>

      {/* ── SERVICES GRID ──────────────────────────────────────────────────── */}
      <section className="bg-muted py-20" id="servizi">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary block mb-2">
              ​
            </span>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-foreground"
              style={{ fontFamily: "Outfit, sans-serif" }}>Come operiamo
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            {processSteps.map((s, i) =>
            <>
                <div
                key={s.num}
                className="flex flex-col items-center text-center max-w-[200px] mx-auto md:mx-0 bg-muted p-6 rounded-xl flex-1 shadow-sm">
                
                  <div
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-sm mb-4"
                  style={{ fontFamily: "Outfit, sans-serif" }}>
                  
                    {s.num}
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
                    {s.title}
                  </h3>
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-3">
                    {s.icon}
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{s.text}</p>
                </div>
                {i < processSteps.length - 1 &&
              <div
                key={`line-${i}`}
                className="hidden md:block flex-none w-8 h-0.5 bg-border self-center mt-0 relative top-[-20px]" />

              }
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── COMMITMENT (DARK) ──────────────────────────────────────────────── */}
      <section className="bg-foreground text-background py-20" id="chi-siamo">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <span className="font-bold tracking-[0.25em] uppercase block mb-4 bg-transparent text-[sidebar-primary-foreground] text-stone-950">
              ​
            </span>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-background mb-5 leading-tight"
              style={{ fontFamily: "Outfit, sans-serif" }}>
              
              Il nostro impegno,
              <br />
              la tua tranquillità.
            </h2>
            <p className="text-background/70 text-base leading-relaxed mb-8 max-w-lg">
              Lavoriamo con metodo, responsabilità, proattività coadiuvando le attività di cantiere e le pratiche
              burocratiche affinché tutto vada avanti a gonfie vele per raggiungere prima possibile il tuo e il nostro
              obiettivo.
            </p>
            
















            
            <DualCTA variant="dark" />
          </div>

          <div className="flex-1 w-full relative">
            <div className="w-full h-72 rounded-xl relative overflow-hidden shadow-lg">
              <img
                alt="Edificio storico restaurato"
                className="w-full h-full object-cover"
                src="/lovable-uploads/966fc589-225e-48bb-979b-cba765517e76.jpg" />
              

              <div className="absolute bottom-6 left-[-1rem] bg-primary text-primary-foreground p-4 rounded-lg shadow-xl">
                <span
                  className="block text-3xl font-extrabold leading-none"
                  style={{ fontFamily: "Outfit, sans-serif" }}>
                  
                  {" "}
                  90+
                </span>
                <span className="text-xs opacity-90"> Anni di Storia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVIZI: VIDEO + ROADMAP ─────────────────────────────────────── */}
      <section className="bg-background py-20" id="process">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-foreground"
              style={{ fontFamily: "Outfit, sans-serif" }}>
              
              In Breve:
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Video */}
            <div className="rounded-xl overflow-hidden shadow-lg h-64 md:h-80">
              <video className="w-full h-full object-cover" controls preload="metadata" poster="">
                <source src="/videos/Tornare_a_Casa_Post-Sisma_720.mp4" type="video/mp4" />
              </video>
            </div>
            {/* Roadmap - click to open full */}
            <RoadmapCard />
          </div>
        </div>
      </section>

      {/* ── GALLERY + BEFORE/AFTER ─────────────────────────────────────── */}
      <section className="bg-muted py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary block mb-2">
              I Nostri Interventi
            </span>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-foreground"
              style={{ fontFamily: "Outfit, sans-serif" }}>
              
              Prima e dopo il nostro intervento
            </h2>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl overflow-hidden shadow-md h-56 md:h-64">
              <img
                alt="Torre civica post-sisma"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                src="/lovable-uploads/0265aa35-915a-46b9-a659-3a9dd6d717ce.jpg" />
              
            </div>
            <div className="rounded-xl overflow-hidden shadow-md h-56 md:h-64">
              <img
                alt="Edificio storico in fase di messa in sicurezza"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                src="/lovable-uploads/951e1249-02c2-4c63-a8f5-b224882692a4.jpg" />
              
            </div>
            <div className="rounded-xl overflow-hidden shadow-md h-56 md:h-64">
              <img
                alt="Macerie post-sisma 2016"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                src="/lovable-uploads/26095a14-729f-4065-abf2-be01e0b935c5.jpg" />
              
            </div>
            <div className="rounded-xl overflow-hidden shadow-md h-56 md:h-64">
              <img
                src={sisma005}
                alt="Palazzo storico restaurato post-sisma"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              
            </div>
          </div>

          {/* Before / After slider */}
          <div className="max-w-2xl mx-auto">
            <p
              className="text-center text-sm font-bold text-foreground mb-3 uppercase tracking-widest"
              style={{ fontFamily: "Outfit, sans-serif" }}>
              
              ​
            </p>
            <BeforeAfterSlider before={sismaBefore} after={sismaAfter} />
          </div>

          <div className="text-center mt-10">
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">​</p>
            <DualCTA variant="light" />
          </div>
        </div>
      </section>




      {/* ── CTA BOX / CONTATTI ─────────────────────────────────────────────── */}
      <section className="bg-muted py-20" id="contatti">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-foreground rounded-2xl p-10 text-center relative overflow-hidden">
            <span
              className="absolute inset-0 pointer-events-none select-none flex items-center justify-center text-[15vw] font-extrabold opacity-[0.03] text-background leading-none"
              style={{ fontFamily: "Outfit, sans-serif" }}>
              
              CINGOLI
            </span>
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary block mb-3 relative">
              Contattaci Ora
            </span>
            <h2
              className="text-2xl md:text-3xl font-extrabold text-background mb-4 relative"
              style={{ fontFamily: "Outfit, sans-serif" }}>
              
              Richiedi un contatto gratuito
            </h2>
            <p className="text-background/70 text-base mb-6 relative">
              Entro 24 ore prendiamo in carico la richiesta e indichiamo i prossimi passi e le informazioni necessarie
              per valutare correttamente il caso.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              <button
                onClick={() => navigate("/candidatura?tipo=proprietario")}
                className="bg-primary text-primary-foreground px-8 py-3.5 text-sm font-bold tracking-widest uppercase rounded hover:opacity-90 transition-opacity">
                
                Sono un Proprietario
              </button>
              <button
                onClick={() => navigate("/candidatura?tipo=progettista")}
                className="border-2 border-background/30 text-background px-8 py-3.5 text-sm font-bold tracking-widest uppercase rounded hover:bg-background hover:text-foreground transition-colors">
                
                Sono un Progettista
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-foreground text-background py-14 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div>
              <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer">
                <img
                  src={logoCingoli}
                  alt="Cingoli – Consolidamento Restauro"
                  className="h-14 brightness-0 invert mb-3" />
                
              </a>
              <p className="text-background/60 text-sm">Dal 1933.</p>
            </div>
            <div>
              <h4 className="text-background font-bold text-lg mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                Link Rapidi
              </h4>
              <ul className="space-y-2">
                {[
                ["Servizi", "#servizi"],
                ["Come Lavoriamo", "#process"],
                ["Chi Siamo", "#chi-siamo"],
                ["FAQ", "#faq"]].
                map(([l, h]) =>
                <li key={h}>
                    <button
                    onClick={() => document.querySelector(h)?.scrollIntoView({ behavior: "smooth" })}
                    className="text-sm text-background/60 hover:text-primary transition-colors">
                    
                      {l}
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-background font-bold text-lg mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                Contatti
              </h4>
              <p className="text-background/60 text-sm">Via Acquaviva 11, 64100 Teramo (TE)</p>
              <p className="text-background/60 text-sm">cingoli@impresacingoli.it</p>
              <a
                href="https://impresacingoli.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline mt-1 block">
                
                impresacingoli.it
              </a>
            </div>
          </div>
          <div className="border-t border-background/10 pt-6 text-center">
            <p className="text-background/40 text-sm">© 2026 Cingoli SRL. Tutti i diritti riservati.</p>
          </div>
        </div>
        {/* Watermark */}
        <div
          className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 text-[15vw] font-extrabold text-background/[0.03] pointer-events-none select-none whitespace-nowrap"
          style={{ fontFamily: "Outfit, sans-serif" }}>
          
          CINGOLI
        </div>
      </footer>

      {/* ── MOBILE STICKY CTA ──────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        {showMobileChoice ?
        <div className="bg-background border-t border-border p-4 space-y-2">
            <button
            onClick={() => navigate("/candidatura?tipo=proprietario")}
            className="w-full bg-primary text-primary-foreground py-3 text-sm font-bold tracking-widest uppercase rounded">
            
              Sono un Proprietario
            </button>
            <button
            onClick={() => navigate("/candidatura?tipo=progettista")}
            className="w-full border-2 border-primary text-primary py-3 text-sm font-bold tracking-widest uppercase rounded">
            
              Sono un Progettista
            </button>
            <button onClick={() => setShowMobileChoice(false)} className="w-full text-muted-foreground text-xs py-1">
              Chiudi
            </button>
          </div> :

        <button
          onClick={() => setShowMobileChoice(true)}
          className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold tracking-widest uppercase">
          
            Candidati ora
          </button>
        }
      </div>
      <div className="h-16 md:hidden" />
    </div>);

};

export default Index;