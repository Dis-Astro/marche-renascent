import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, Download, X, Mail, Settings, Code } from "lucide-react";

type Candidatura = {
  id: string;
  created_at: string;
  tipo: string;
  nome: string;
  email: string;
  telefono: string;
  comune: string;
  denominazione: string | null;
  referente: string | null;
  stato: string;
  descrizione: string | null;
  tipologia: string | null;
  file_url: string | null;
  payload: any;
};

const STATI = ["nuova", "in valutazione", "chiusa"];

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [candidature, setCandidature] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"candidature" | "email" | "gtm">("candidature");

  // Filters
  const [filterTipo, setFilterTipo] = useState("");
  const [filterStato, setFilterStato] = useState("");
  const [search, setSearch] = useState("");

  // Detail
  const [selected, setSelected] = useState<Candidatura | null>(null);

  // Email config
  const [emailConfig, setEmailConfig] = useState<any>({});
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");

  const handleLogin = async () => {
    setAuthError("");
    try {
      const { data, error } = await supabase.functions.invoke("admin-auth", {
        body: { password },
      });
      if (error || !data?.success) {
        setAuthError("Password errata");
        return;
      }
      setAuthed(true);
      sessionStorage.setItem("admin_token", password);
    } catch {
      setAuthError("Errore di connessione");
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchData();
  }, [authed]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("admin-data", {
        body: { password: sessionStorage.getItem("admin_token"), action: "list" },
      });
      if (data?.candidature) setCandidature(data.candidature);
      if (data?.emailConfig) setEmailConfig(data.emailConfig);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const updateStato = async (id: string, stato: string) => {
    await supabase.functions.invoke("admin-data", {
      body: { password: sessionStorage.getItem("admin_token"), action: "update-stato", id, stato },
    });
    setCandidature((prev) => prev.map((c) => (c.id === id ? { ...c, stato } : c)));
    if (selected?.id === id) setSelected({ ...selected, stato });
  };

  const saveEmailConfig = async () => {
    setEmailSaving(true);
    setEmailMsg("");
    try {
      await supabase.functions.invoke("admin-data", {
        body: { password: sessionStorage.getItem("admin_token"), action: "save-email", config: emailConfig },
      });
      setEmailMsg("Salvato!");
    } catch {
      setEmailMsg("Errore");
    }
    setEmailSaving(false);
  };

  const sendTestEmail = async () => {
    setEmailMsg("Invio test...");
    try {
      await supabase.functions.invoke("admin-data", {
        body: { password: sessionStorage.getItem("admin_token"), action: "test-email" },
      });
      setEmailMsg("Email di test inviata!");
    } catch {
      setEmailMsg("Errore invio test");
    }
  };

  const exportXlsx = async () => {
    try {
      const token = sessionStorage.getItem("admin_token");
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-candidature?token=${token}`;
      const res = await fetch(url, {
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "candidature.xlsx";
      a.click();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = useMemo(() => {
    return candidature.filter((c) => {
      if (filterTipo && c.tipo !== filterTipo) return false;
      if (filterStato && c.stato !== filterStato) return false;
      if (search) {
        const s = search.toLowerCase();
        const text = `${c.nome} ${c.email} ${c.comune} ${c.denominazione || ""} ${c.referente || ""}`.toLowerCase();
        if (!text.includes(s)) return false;
      }
      return true;
    });
  }, [candidature, filterTipo, filterStato, search]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-xs space-y-4">
          <h1 className="text-xl font-bold text-foreground text-center">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password"
            className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {authError && <p className="text-destructive text-sm">{authError}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-primary text-primary-foreground py-3 text-sm font-bold"
          >
            Accedi
          </button>
        </div>
      </div>
    );
  }

  const inputClass = "w-full border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="min-h-screen bg-background">
      <meta name="robots" content="noindex" />
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">Admin – Cingoli</h1>
        <div className="flex items-center gap-2">
          <button onClick={exportXlsx} className="flex items-center gap-2 border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> XLSX
          </button>
          <button
            onClick={() => { sessionStorage.removeItem("admin_token"); setAuthed(false); }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Esci
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border px-6 flex gap-0">
        <button
          onClick={() => setTab("candidature")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === "candidature" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          Candidature
        </button>
        <button
          onClick={() => setTab("email")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === "email" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
          }`}
        >
          <Settings className="w-4 h-4 inline mr-1" /> Email
        </button>
      </div>

      {tab === "candidature" && (
        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca..."
              className="border border-border bg-background text-foreground px-3 py-2 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} className="border border-border bg-background text-foreground px-3 py-2 text-sm">
              <option value="">Tutti i tipi</option>
              <option value="proprietario">Proprietario</option>
              <option value="progettista">Progettista</option>
            </select>
            <select value={filterStato} onChange={(e) => setFilterStato(e.target.value)} className="border border-border bg-background text-foreground px-3 py-2 text-sm">
              <option value="">Tutti gli stati</option>
              {STATI.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="text-sm text-muted-foreground self-center">{filtered.length} risultati</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Data</th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Tipo</th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Denominazione</th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Comune</th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Referente</th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Email</th>
                  <th className="py-2 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Stato</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 pr-4 text-muted-foreground">{new Date(c.created_at).toLocaleDateString("it")}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 ${c.tipo === "progettista" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {c.tipo || "–"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-medium text-foreground">{c.denominazione || c.nome || "–"}</td>
                    <td className="py-3 pr-4 text-foreground">{c.comune}</td>
                    <td className="py-3 pr-4 text-foreground">{c.referente || c.nome || "–"}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{c.email}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={c.stato || "nuova"}
                        onChange={(e) => { e.stopPropagation(); updateStato(c.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className="border border-border bg-background text-foreground px-2 py-1 text-xs"
                      >
                        {STATI.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && <p className="text-sm text-muted-foreground mt-4">Caricamento...</p>}
        </div>
      )}

      {tab === "email" && (
        <div className="p-6 max-w-lg space-y-4">
          <h2 className="text-lg font-bold text-foreground">Configurazione Email</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailConfig.enabled ?? true}
              onChange={(e) => setEmailConfig({ ...emailConfig, enabled: e.target.checked })}
              className="accent-primary"
            />
            <span className="text-sm font-semibold text-foreground">Invio email attivo</span>
          </label>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">From name</label>
              <input value={emailConfig.from_name || ""} onChange={(e) => setEmailConfig({ ...emailConfig, from_name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">From email</label>
              <input value={emailConfig.from_email || ""} onChange={(e) => setEmailConfig({ ...emailConfig, from_email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Reply-to</label>
              <input value={emailConfig.reply_to || ""} onChange={(e) => setEmailConfig({ ...emailConfig, reply_to: e.target.value })} className={inputClass} placeholder="Facoltativo" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Destinatari (separati da virgola)</label>
              <input value={emailConfig.to_recipients || ""} onChange={(e) => setEmailConfig({ ...emailConfig, to_recipients: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">CC</label>
              <input value={emailConfig.cc || ""} onChange={(e) => setEmailConfig({ ...emailConfig, cc: e.target.value })} className={inputClass} placeholder="Facoltativo" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">BCC</label>
              <input value={emailConfig.bcc || ""} onChange={(e) => setEmailConfig({ ...emailConfig, bcc: e.target.value })} className={inputClass} placeholder="Facoltativo" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Template oggetto</label>
              <input value={emailConfig.subject_template || ""} onChange={(e) => setEmailConfig({ ...emailConfig, subject_template: e.target.value })} className={inputClass} placeholder="[Candidatura] {tipo} – {comune} – {referente}" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={saveEmailConfig} disabled={emailSaving} className="bg-primary text-primary-foreground px-6 py-2 text-sm font-bold hover:opacity-90 disabled:opacity-50">
              Salva
            </button>
            <button onClick={sendTestEmail} className="border border-border text-foreground px-6 py-2 text-sm font-semibold hover:bg-muted">
              <Mail className="w-4 h-4 inline mr-1" /> Invia test
            </button>
          </div>
          {emailMsg && <p className="text-sm text-muted-foreground">{emailMsg}</p>}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-background border border-border w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Dettaglio candidatura</h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Tipo:</span> <strong>{selected.tipo}</strong></div>
                <div><span className="text-muted-foreground">Stato:</span> <strong>{selected.stato}</strong></div>
                <div><span className="text-muted-foreground">Data:</span> {new Date(selected.created_at).toLocaleString("it")}</div>
                <div><span className="text-muted-foreground">Nome:</span> {selected.nome}</div>
                <div><span className="text-muted-foreground">Email:</span> {selected.email}</div>
                <div><span className="text-muted-foreground">Telefono:</span> {selected.telefono}</div>
                <div><span className="text-muted-foreground">Comune:</span> {selected.comune}</div>
                <div><span className="text-muted-foreground">Denominazione:</span> {selected.denominazione || "–"}</div>
                <div><span className="text-muted-foreground">Referente:</span> {selected.referente || "–"}</div>
              </div>

              {selected.file_url && (
                <div>
                  <span className="text-muted-foreground">Allegato:</span>{" "}
                  <a href={selected.file_url} target="_blank" className="text-primary underline">Visualizza</a>
                </div>
              )}

              {selected.payload && (
                <div>
                  <h3 className="font-bold text-foreground mt-4 mb-2">Dati completi</h3>
                  <pre className="bg-muted p-3 text-xs overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selected.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
