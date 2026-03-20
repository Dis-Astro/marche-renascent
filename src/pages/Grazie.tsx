const Grazie = () => {
  console.log("[grazie] component rendering");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f0eb", display: "flex", flexDirection: "column" }}>
      <nav style={{ borderBottom: "1px solid #e5e0db", padding: "0 24px", height: 56, display: "flex", alignItems: "center" }}>
        <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer">
          <strong style={{ color: "#7a2a3a", fontSize: 18 }}>Impresa Cingoli</strong>
        </a>
      </nav>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "2px solid #7a2a3a",
              backgroundColor: "rgba(122,42,58,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 28,
              color: "#7a2a3a",
              fontWeight: "bold",
            }}
          >
            ✓
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#2e2e2e", marginBottom: 16, fontFamily: "Outfit, sans-serif" }}>
            Candidatura inviata correttamente
          </h1>

          <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
            Abbiamo ricevuto la tua richiesta e la prenderemo in carico al più presto.
          </p>
          <p style={{ color: "#666", fontSize: 14 }}>
            Ti contatteremo dopo una prima valutazione tecnica.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
            <a
              href="/"
              style={{
                display: "inline-block",
                backgroundColor: "#7a2a3a",
                color: "#fff",
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 700,
                borderRadius: 4,
                textDecoration: "none",
                letterSpacing: "0.5px",
              }}
            >
              Torna alla home
            </a>
            <a href="/candidatura" style={{ fontSize: 14, color: "#7a2a3a", fontWeight: 500 }}>
              Compila una nuova candidatura
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Grazie;
