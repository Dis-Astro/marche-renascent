import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const GTM_SCRIPT_ID = "gtm-script";
const GTM_NOSCRIPT_ID = "gtm-noscript";
const GTM_SUPPRESSION_STYLE_ID = "gtm-suppression-style";
const CANDIDATURA_PATH = "/candidatura";
const SUPPRESSION_ATTRIBUTE = "data-gtm-suppressed";
const GTM_RELATED_SELECTOR = [
  '[class*="iubenda"]',
  '[id*="iubenda"]',
  '#iubenda-cs-banner',
  'iframe[src*="iubenda"]',
  'script[src*="iubenda"]',
  'link[href*="iubenda"]',
  'iframe[src*="googletagmanager.com"]',
  'script[src*="googletagmanager.com"]',
].join(', ');

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const removeElement = (element: Element | null) => {
  if (element) {
    element.remove();
  }
};

const purgeGtmOverlays = (root: ParentNode = document) => {
  const rootElement = root instanceof Element ? root : null;

  if (rootElement?.matches(GTM_RELATED_SELECTOR)) {
    rootElement.remove();
    return;
  }

  root.querySelectorAll(GTM_RELATED_SELECTOR).forEach((element) => element.remove());
  removeElement(document.getElementById(GTM_SCRIPT_ID));
  removeElement(document.getElementById(GTM_NOSCRIPT_ID));
};

const ensureSuppressionStyle = () => {
  if (!document.head || document.getElementById(GTM_SUPPRESSION_STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = GTM_SUPPRESSION_STYLE_ID;
  style.textContent = `
    body[${SUPPRESSION_ATTRIBUTE}="true"] [class*="iubenda"],
    body[${SUPPRESSION_ATTRIBUTE}="true"] [id*="iubenda"],
    body[${SUPPRESSION_ATTRIBUTE}="true"] #iubenda-cs-banner,
    body[${SUPPRESSION_ATTRIBUTE}="true"] iframe[src*="iubenda"],
    body[${SUPPRESSION_ATTRIBUTE}="true"] script[src*="iubenda"],
    body[${SUPPRESSION_ATTRIBUTE}="true"] link[href*="iubenda"],
    body[${SUPPRESSION_ATTRIBUTE}="true"] iframe[src*="googletagmanager.com"],
    body[${SUPPRESSION_ATTRIBUTE}="true"] script[src*="googletagmanager.com"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;

  document.head.appendChild(style);
};

const setRouteSuppression = (enabled: boolean) => {
  if (!document.body) {
    return;
  }

  ensureSuppressionStyle();

  if (enabled) {
    document.body.setAttribute(SUPPRESSION_ATTRIBUTE, 'true');
    return;
  }

  document.body.removeAttribute(SUPPRESSION_ATTRIBUTE);
};

const isTrackedNode = (node: Node): node is Element => {
  if (!(node instanceof Element)) {
    return false;
  }

  return node.matches(GTM_RELATED_SELECTOR) || node.id === GTM_SCRIPT_ID || node.id === GTM_NOSCRIPT_ID || Boolean(node.querySelector(GTM_RELATED_SELECTOR));
};

const GtmInjector = () => {
  const location = useLocation();
  const isCandidaturaRoute = location.pathname.startsWith(CANDIDATURA_PATH);

  useLayoutEffect(() => {
    setRouteSuppression(isCandidaturaRoute);

    if (isCandidaturaRoute) {
      purgeGtmOverlays();
    }
  }, [isCandidaturaRoute]);

  useEffect(() => {
    const browserWindow = window as WindowWithIdleCallback;

    if (isCandidaturaRoute) {
      console.info('[gtm] suppressing GTM/iubenda on candidatura route');
      purgeGtmOverlays();

      const observer = new MutationObserver((mutations) => {
        let shouldPurgeDocument = false;

        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (!isTrackedNode(node)) {
              return;
            }

            shouldPurgeDocument = true;
            purgeGtmOverlays(node);
          });
        }

        if (shouldPurgeDocument) {
          purgeGtmOverlays();
        }
      });

      observer.observe(document.documentElement, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
      };
    }

    let isDisposed = false;
    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const loadGtm = async () => {
      try {
        const { data } = await supabase.functions.invoke('gtm-config');
        if (isDisposed || !data?.enabled || !data?.gtm_id) return;

        const gtmId = data.gtm_id.trim();
        if (!gtmId.startsWith('GTM-')) return;

        if (!document.getElementById(GTM_SCRIPT_ID)) {
          const script = document.createElement('script');
          script.id = GTM_SCRIPT_ID;
          script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
          document.head.appendChild(script);
        }

        if (!document.getElementById(GTM_NOSCRIPT_ID)) {
          const noscript = document.createElement('noscript');
          noscript.id = GTM_NOSCRIPT_ID;
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
          iframe.height = '0';
          iframe.width = '0';
          iframe.style.display = 'none';
          iframe.style.visibility = 'hidden';
          noscript.appendChild(iframe);
          document.body.insertBefore(noscript, document.body.firstChild);
        }
      } catch (e) {
        console.error('GTM load error:', e);
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
  }, [isCandidaturaRoute]);

  return null;
};

export default GtmInjector;
