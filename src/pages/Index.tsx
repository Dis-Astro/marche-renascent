import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck, FileText, HardHat, Landmark,
  Award, Users, MapPin, ClipboardCheck,
  FileSignature, Building2, Hammer,
  ChevronDown, Menu, X, ArrowUpRight } from
"lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const services = [
{
  num: "01",
  icon: <FileCheck className="w-5 h-5" />,
  title: "Analisi del Modello 02",
  text: "Verifica immediata della fattibilità legale del subentro e gestione pratiche USR ferme."
},
{
  num: "02",
  icon: <FileText className="w-5 h-5" />,
  title: "Gestione Burocrazia",
  text: "Sblocco SAL arretrati, varianti ferme e interazione diretta con i tecnici USR."
},
{
  num: "03",
  icon: <HardHat className="w-5 h-5" />,
  title: "Esecuzione Rapida",
  text: "Squadre pronte a entrare in cantiere entro 7 giorni dal subentro formale."
},
{
  num: "04",
  icon: <Landmark className="w-5 h-5" />,
  title: "Solidità Finanziaria",
  text: "Impresa storica dal 1920. Non chiediamo anticipi per comprare i materiali."
}];


const processSteps = [
{ num: "01", icon: <ClipboardCheck className="w-5 h-5" />, title: "Analisi Legale", text: "Verifichiamo contratto e stato SAL per tutelarti nel cambio impresa." },
{ num: "02", icon: <FileSignature className="w-5 h-5" />, title: "Piano Subentro", text: "Prepariamo il Modello 02 e la documentazione per l'USR in 72h." },
{ num: "03", icon: <Building2 className="w-5 h-5" />, title: "Sblocco USR", text: "Dialoghiamo con i tecnici per approvare varianti e sbloccare fondi." },
{ num: "04", icon: <Hammer className="w-5 h-5" />, title: "Riavvio Lavori", text: "Il cantiere riparte con cronoprogramma certo fino alla consegna." }];


const faqItems = [
{ q: "Se cambio impresa perdo il contributo?", a: "No. Gestiamo noi la procedura di voltura (Modello 02) per garantire la continuità del finanziamento USR senza rischi per te." },
{ q: "L'altra impresa mi chiede penali, cosa faccio?", a: "Il nostro ufficio legale analizza il tuo contratto gratuitamente per proteggerti da richieste illegittime e sbloccare la situazione." },
{ q: "Quanto tempo serve per ripartire?", a: "Se la documentazione è disponibile, possiamo formalizzare il subentro ed entrare in cantiere fisicamente in meno di 30 giorni." },
{ q: "Vi occupate delle pratiche USR ferme?", a: "Sì, è la nostra specialità. Sblocchiamo varianti, SAL non pagati e integrazioni documentali che tengono fermo il cantiere da mesi." },
{ q: "Non ho tutti i documenti: posso inviare la candidatura?", a: "Sì. Per i Privati molte voci sono facoltative. Compila quello che hai e ti contatteremo per il resto." }];


// ─── DUAL CTA ─────────────────────────────────────────────────────────────────

const DualCTA = ({ variant = "light" }: {variant?: "light" | "dark";}) => {
  const navigate = useNavigate();
  const isLight = variant === "light";
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        onClick={() => navigate("/candidatura?tipo=privato")}
        className="flex-1 sm:flex-none bg-primary text-primary-foreground px-7 py-3.5 text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity rounded">

        Sono un Privato
      </button>
      <button
        onClick={() => navigate("/candidatura?tipo=professionista")}
        className={`flex-1 sm:flex-none px-7 py-3.5 text-sm font-bold tracking-widest uppercase rounded border-2 transition-colors ${
        isLight ?
        "border-foreground text-foreground hover:bg-foreground hover:text-background" :
        "border-white text-white hover:bg-white hover:text-foreground"}`
        }>

        Sono un Professionista
      </button>
    </div>);

};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const Index = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showMobileChoice, setShowMobileChoice] = useState(false);

  const navLinks = [
  { label: "Servizi", href: "#servizi" },
  { label: "Come Lavoriamo", href: "#process" },
  { label: "Chi Siamo", href: "#chi-siamo" },
  { label: "FAQ", href: "#faq" }];


  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer"
          className="text-xl font-extrabold tracking-tight text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
            Cingoli SRL
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((l) =>
            <li key={l.href}>
                <button onClick={() => scrollTo(l.href)}
              className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors">
                  {l.label}
                </button>
              </li>
            )}
            <li>
              <button onClick={() => navigate("/candidatura?tipo=privato")}
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
          <button key={l.href} onClick={() => scrollTo(l.href)}
          className="text-sm font-semibold text-left text-foreground/80 hover:text-primary">
                {l.label}
              </button>
          )}
            <button onClick={() => {navigate("/candidatura?tipo=privato");setMobileOpen(false);}}
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
              Pronto Intervento Sisma 2016
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight text-foreground mb-6" style={{ fontFamily: "Outfit, sans-serif" }}>
              Cantiere Sisma 2016 Fermo?{" "}
              <span className="text-primary">Lo Sblocchiamo in 30 Giorni.</span>
            </h1>
            <p className="text-foreground/60 text-base md:text-lg leading-relaxed max-w-lg mx-auto md:mx-0 mb-2">
              Specialisti nel subentro immediato per pratiche USR bloccate e lavori abbandonati in Marche e Umbria.
              Non lasciare che la tua casa resti uno scheletro.
            </p>
            <p className="text-muted-foreground text-sm italic mb-2">
              Valutazione preliminare gratuita. Compila anche se non hai tutti i documenti.
            </p>
            <DualCTA variant="light" />

            {/* Badges */}
            <div className="flex items-center gap-3 mt-6 justify-center md:justify-start">
              <span className="border border-primary text-primary px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] uppercase">Marche</span>
              <span className="border border-primary text-primary px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] uppercase">Post‑Sisma</span>
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="flex-1 w-full md:w-auto">
            <div className="w-full h-72 md:h-96 rounded-xl bg-muted flex items-center justify-center shadow-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,hsl(var(--muted))_0px,hsl(var(--muted))_10px,hsl(var(--muted-foreground)/0.05)_10px,hsl(var(--muted-foreground)/0.05)_20px)]" />
              <span className="relative text-muted-foreground text-xs uppercase tracking-widest">Foto edificio</span>
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
          {[
          "Sbloccati 3 Cantieri a Visso questo mese",
          "Pratica USR Camerino: APPROVATA",
          "Cantiere Sarnano: RIAVVIATO",
          "Gestione Modello 02 Immediata",
          "100+ Anni di Esperienza",
          "Sbloccati 3 Cantieri a Visso questo mese",
          "Pratica USR Camerino: APPROVATA",
          "Cantiere Sarnano: RIAVVIATO",
          "Gestione Modello 02 Immediata",
          "100+ Anni di Esperienza"].
          map((t, i) =>
          <span key={i} className="mx-10 text-sm font-semibold opacity-90">{t} •</span>
          )}
        </div>
      </div>

      {/* ── SERVICES GRID ──────────────────────────────────────────────────── */}
      <section className="bg-muted py-20" id="servizi">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary block mb-2">
              Cosa Offriamo
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
              Come ti sblocchiamo il cantiere<br className="hidden md:block" /> in 4 step
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) =>
            <div key={s.num}
            className="bg-background rounded-lg p-6 border border-border relative flex flex-col hover:-translate-y-1 hover:border-primary transition-all duration-300">
                <span className="absolute top-4 right-4 text-2xl font-extrabold text-foreground/[0.07]" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {s.num}
                </span>
                <h3 className="text-base font-bold text-foreground mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>{s.title}</h3>
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.text}</p>
                <div className="mt-4 text-primary hover:translate-x-1 hover:-translate-y-1 transition-transform w-fit">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── COMMITMENT (DARK) ──────────────────────────────────────────────── */}
      <section className="bg-foreground text-background py-20" id="chi-siamo">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary block mb-4">
              Il Nostro Impegno
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-background mb-5 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Costruito per Durare —<br />Affidabilità Garantita
            </h2>
            <p className="text-background/70 text-base leading-relaxed mb-8 max-w-lg">
              Troppe imprese sono nate dal nulla per il Superbonus e sono sparite. Noi siamo qui dal 1920.
              Quando prendiamo un impegno, lo portiamo a termine. Nessuna sorpresa, solo cantieri finiti.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-background/10 pt-6">
              <div className="flex gap-3 items-start">
                <Award className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-background text-sm">Responsabilità</p>
                  <p className="text-background/60 text-sm">Garanzia diretta sui lavori</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Users className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-background text-sm">Team Esperto</p>
                  <p className="text-background/60 text-sm">Solo maestranze qualificate</p>
                </div>
              </div>
            </div>
            <DualCTA variant="dark" />
          </div>

          <div className="flex-1 w-full relative">
            <div className="w-full h-72 rounded-xl bg-background/5 border border-background/10 relative overflow-hidden">
              <div className="absolute bottom-6 left-[-1rem] bg-primary text-primary-foreground p-4 rounded-lg shadow-xl">
                <span className="block text-3xl font-extrabold leading-none" style={{ fontFamily: "Outfit, sans-serif" }}>90+</span>
                <span className="text-xs opacity-90">Anni di Storia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS STEPS ──────────────────────────────────────────────────── */}
      <section className="bg-background py-20" id="process">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary block mb-2">
              Come Lavoriamo
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
              Sblocchiamo il Tuo Cantiere<br className="hidden md:block" /> in 4 Step
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            {processSteps.map((s, i) =>
            <>
                <div key={s.num} className="flex flex-col items-center text-center max-w-[200px] mx-auto md:mx-0 bg-muted p-6 rounded-xl flex-1 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
                    {s.num}
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>{s.title}</h3>
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-3">{s.icon}</div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{s.text}</p>
                </div>
                {i < processSteps.length - 1 &&
              <div key={`line-${i}`} className="hidden md:block flex-none w-8 h-0.5 bg-border self-center mt-0 relative top-[-20px]" />
              }
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── PROBLEM / EMPATHY ──────────────────────────────────────────────── */}
      <section className="bg-muted py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary block mb-4">
            Il Problema
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6" style={{ fontFamily: "Outfit, sans-serif" }}>
            La tua casa è ancora uno scheletro?<br />Ti Capiamo.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Imprese fallite, burocrazia USR incagliata, SAL non pagati. Conosciamo l'incubo.<br />
            Non serve aspettare ancora: serve un intervento tecnico d'urto.
          </p>
          <DualCTA variant="light" />
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="bg-background py-20" id="faq">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary block mb-2">
              Dubbi?
            </span>
            <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
              Risposte alle Tue Domande
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqItems.map((faq, i) =>
            <div key={i} className="border border-border rounded-lg overflow-hidden bg-muted">
                <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-muted hover:bg-accent transition-colors">

                  <span className="text-sm font-bold text-foreground pr-4" style={{ fontFamily: "Outfit, sans-serif" }}>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${openFaq === i ? "max-h-40" : "max-h-0"}`}>
                  <p className="px-5 py-4 text-sm text-muted-foreground border-t border-border bg-background">{faq.a}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA BOX / CONTATTI ─────────────────────────────────────────────── */}
      <section className="bg-muted py-20" id="contatti">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-foreground rounded-2xl p-10 text-center relative overflow-hidden">
            <span className="absolute inset-0 pointer-events-none select-none flex items-center justify-center text-[15vw] font-extrabold opacity-[0.03] text-background leading-none" style={{ fontFamily: "Outfit, sans-serif" }}>CINGOLI</span>
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary block mb-3 relative">
              Contattaci Ora
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-background mb-4 relative" style={{ fontFamily: "Outfit, sans-serif" }}>
              Richiedi Analisi Cantiere Gratuita
            </h2>
            <p className="text-background/70 text-base mb-6 relative">
              Scegli il tuo profilo e compila la scheda. Ti diremo se possiamo sbloccare la tua pratica in 24 ore.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              <button
                onClick={() => navigate("/candidatura?tipo=privato")}
                className="bg-primary text-primary-foreground px-8 py-3.5 text-sm font-bold tracking-widest uppercase rounded hover:opacity-90 transition-opacity">

                Sono un Privato
              </button>
              <button
                onClick={() => navigate("/candidatura?tipo=professionista")}
                className="border-2 border-background/30 text-background px-8 py-3.5 text-sm font-bold tracking-widest uppercase rounded hover:bg-background hover:text-foreground transition-colors">

                Sono un Professionista
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
              <h4 className="text-background font-bold text-lg mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Cingoli SRL</h4>
              <p className="text-background/60 text-sm">Ricostruzione e Riqualificazione.<br />Dal 1920.</p>
            </div>
            <div>
              <h4 className="text-background font-bold text-lg mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Link Rapidi</h4>
              <ul className="space-y-2">
                {[["Servizi", "#servizi"], ["Come Lavoriamo", "#process"], ["Chi Siamo", "#chi-siamo"], ["FAQ", "#faq"]].map(([l, h]) =>
                <li key={h}>
                    <button onClick={() => document.querySelector(h)?.scrollIntoView({ behavior: "smooth" })}
                  className="text-sm text-background/60 hover:text-primary transition-colors">
                      {l}
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-background font-bold text-lg mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Contatti</h4>
              <p className="text-background/60 text-sm">Via Roma 123, Macerata</p>
              <p className="text-background/60 text-sm">info@impresacingoli.it</p>
              <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer"
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
        <div className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 text-[15vw] font-extrabold text-background/[0.03] pointer-events-none select-none whitespace-nowrap" style={{ fontFamily: "Outfit, sans-serif" }}>
          CINGOLI SRL
        </div>
      </footer>

      {/* ── MOBILE STICKY CTA ──────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        {showMobileChoice ?
        <div className="bg-background border-t border-border p-4 space-y-2">
            <button onClick={() => navigate("/candidatura?tipo=privato")}
          className="w-full bg-primary text-primary-foreground py-3 text-sm font-bold tracking-widest uppercase rounded">
              Sono un Privato
            </button>
            <button onClick={() => navigate("/candidatura?tipo=professionista")}
          className="w-full border-2 border-primary text-primary py-3 text-sm font-bold tracking-widest uppercase rounded">
              Sono un Professionista
            </button>
            <button onClick={() => setShowMobileChoice(false)}
          className="w-full text-muted-foreground text-xs py-1">
              Chiudi
            </button>
          </div> :

        <button onClick={() => setShowMobileChoice(true)}
        className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold tracking-widest uppercase">
            Candidati ora
          </button>
        }
      </div>
      <div className="h-16 md:hidden" />
    </div>);

};

export default Index;