import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const GTM_SCRIPT_ID = "gtm-script";
const GTM_NOSCRIPT_ID = "gtm-noscript";

const GtmInjector = () => {
  useEffect(() => {
    const loadGtm = async () => {
      try {
        const { data } = await supabase.functions.invoke("gtm-config");
        if (!data?.enabled || !data?.gtm_id) return;

        const gtmId = data.gtm_id.trim();
        if (!gtmId.startsWith("GTM-")) return;

        // Inject head script
        if (!document.getElementById(GTM_SCRIPT_ID)) {
          const script = document.createElement("script");
          script.id = GTM_SCRIPT_ID;
          script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
          document.head.appendChild(script);
        }

        // Inject noscript iframe
        if (!document.getElementById(GTM_NOSCRIPT_ID)) {
          const noscript = document.createElement("noscript");
          noscript.id = GTM_NOSCRIPT_ID;
          const iframe = document.createElement("iframe");
          iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
          iframe.height = "0";
          iframe.width = "0";
          iframe.style.display = "none";
          iframe.style.visibility = "hidden";
          noscript.appendChild(iframe);
          document.body.insertBefore(noscript, document.body.firstChild);
        }
      } catch (e) {
        console.error("GTM load error:", e);
      }
    };

    loadGtm();
  }, []);

  return null;
};

export default GtmInjector;
