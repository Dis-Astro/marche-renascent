import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const GTM_SCRIPT_ID = "gtm-script";
const GTM_NOSCRIPT_ID = "gtm-noscript";
const CANDIDATURA_PATH = "/candidatura";

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/** Remove all iubenda / GTM overlays from the DOM */
const purgeGtmOverlays = () => {
  // Remove iubenda cookie banner overlays
  document.querySelectorAll('[class*="iubenda"], #iubenda-cs-banner').forEach((el) => el.remove());
  // Remove GTM injected elements
  const gtmScript = document.getElementById(GTM_SCRIPT_ID);
  const gtmNoscript = document.getElementById(GTM_NOSCRIPT_ID);
  if (gtmScript) gtmScript.remove();
  if (gtmNoscript) gtmNoscript.remove();
};

const GtmInjector = () => {
  const location = useLocation();

  useEffect(() => {
    const browserWindow = window as WindowWithIdleCallback;

    if (location.pathname.startsWith(CANDIDATURA_PATH)) {
      console.info("[gtm] purging overlays on candidatura route");
      purgeGtmOverlays();
      return;
    }

    let isDisposed = false;
    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const loadGtm = async () => {
      try {
        const { data } = await supabase.functions.invoke("gtm-config");
        if (isDisposed || !data?.enabled || !data?.gtm_id) return;

        const gtmId = data.gtm_id.trim();
        if (!gtmId.startsWith("GTM-")) return;

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

    if (browserWindow.requestIdleCallback) {
      idleId = browserWindow.requestIdleCallback(() => {
        void loadGtm();
      }, { timeout: 2000 });
    } else {
      timeoutId = browserWindow.setTimeout(() => {
        void loadGtm();
      }, 1200);
    }

    return () => {
      isDisposed = true;
      if (idleId !== null) {
        browserWindow.cancelIdleCallback?.(idleId);
      }
      if (timeoutId !== null) {
        browserWindow.clearTimeout(timeoutId);
      }
    };
  }, [location.pathname]);

  return null;
};

export default GtmInjector;
