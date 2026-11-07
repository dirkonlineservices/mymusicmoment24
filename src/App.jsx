import React, { useState, useEffect, lazy, Suspense } from "react";
import LandingPage from "./views/LandingPage";
const BlogPost = lazy(() => import("./views/BlogPost"));
const AuthorPage = lazy(() => import("./views/AuthorPage"));
const LegalPage = lazy(() => import("./views/LegalPage"));
const StreamingReleasePage = lazy(() => import("./views/StreamingReleasePage"));
const SupportPage = lazy(() => import("./views/SupportPage"));
const B2BPage = lazy(() => import("./views/B2BPage"));
const PayPalCheckout = lazy(() => import("./components/PayPalCheckout"));
import ConsentBanner from "./components/ConsentBanner";
import { trackPurchase } from "./lib/gtmPreview";
import { LanguageProvider } from "./context/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { getBlogPostBySlug, getBlogPostByKey } from "./lib/blog";
import { SITE_URL, blogPostMeta, staticPageMeta, notFoundMeta } from "./lib/pageMeta";
import { langFromPath, toInternalPath, localizePath, alternatePath } from "./lib/i18nRoutes";

// Titel, Beschreibung und Canonical beim Seitenwechsel im Browser aktualisieren
function syncDocumentMeta(route) {
  const lang = route.lang;
  const internal = toInternalPath(window.location.pathname) || "/";
  const post = route.view === "blog" ? getBlogPostByKey(route.slug, lang) : null;
  const meta = post
    ? blogPostMeta(post)
    : staticPageMeta(internal, lang) || { ...notFoundMeta(lang), canonicalPath: window.location.pathname };
  const url = `${SITE_URL}${meta.canonicalPath}`;

  document.title = meta.title;
  const set = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  set('meta[name="description"]', "content", meta.description);
  set('link[rel="canonical"]', "href", url);
  set('meta[property="og:url"]', "content", url);
  set('meta[property="og:title"]', "content", meta.title);
  set('meta[property="og:description"]', "content", meta.description);
  set('meta[name="twitter:title"]', "content", meta.title);
  set('meta[name="twitter:description"]', "content", meta.description);
}

// Seite aus der aktuellen Adresse bestimmen (auch für den ersten Render)
function routeFromLocation() {
  if (typeof window === "undefined") return { view: "home", slug: null, lang: "de" };
  const lang = langFromPath(window.location.pathname);
  // Intern wird mit deutschen Pfaden gearbeitet (/en/privacy → /datenschutz)
  const path = toInternalPath(window.location.pathname) || "/";
  const hash = window.location.hash;
  return { ...matchRoute(path, hash), lang };
}

function matchRoute(path, hash) {
  if (
    path === "/streaming" || 
    path === "/spotify-release" || 
    path === "/streaming-release" ||
    hash === "#/streaming" ||
    hash === "#/spotify-release"
  ) {
    return ({ view: "streaming", slug: null });
  } else if (path === "/support" || path === "/kontakt" || hash === "#/support") {
    return ({ view: "support", slug: null });
  } else if (
    path === "/b2b" || 
    path === "/kooperation" || 
    path === "/b2b-dienstleistungen" || 
    path === "/agenturen" || 
    hash === "#/b2b"
  ) {
    return ({ view: "b2b", slug: null });
  } else if (path.startsWith("/blog/")) {
    const slug = path.replace("/blog/", "").replace(/\/$/, "");
    return ({ view: "blog", slug });
  } else if (path === "/autor-dirk-schmetzer" || path === "/ueber-uns-musikservice") {
    return ({ view: "author", slug: null });
  } else if (path === "/impressum") {
    return ({ view: "legal", slug: "impressum" });
  } else if (path === "/datenschutz") {
    return ({ view: "legal", slug: "datenschutz" });
  } else if (path === "/agb") {
    return ({ view: "legal", slug: "agb" });
  } else if (path === "/widerruf") {
    return ({ view: "legal", slug: "widerruf" });
  } else {
    // Check if path matches a blog post slug directly (e.g. /personalisierte-geburtstagslieder)
    const cleanPath = path.replace(/^\//, "").replace(/\/$/, "");
    const matchedPost = cleanPath ? getBlogPostBySlug(cleanPath) : null;
    if (matchedPost) {
      return ({ view: "blog", slug: matchedPost.slug });
    } else {
      return ({ view: "home", slug: null });
    }
  }
}

function AppMain() {
  const [currentRoute, setCurrentRoute] = useState(routeFromLocation);
  const lang = currentRoute.lang;

  const [checkoutOrder, setCheckoutOrder] = useState(null);

  useEffect(() => {
    syncDocumentMeta(currentRoute);
  }, [currentRoute]);

  // Interne (deutsche) Adresse in der aktuellen Sprache öffnen
  const go = (internalPath, route) => {
    window.history.pushState({}, "", localizePath(internalPath, lang));
    setCurrentRoute({ ...route, lang });
  };

  // Sprachumschalter: gleiche Seite in der anderen Sprache
  const changeLanguage = (newLang) => {
    const target = alternatePath(window.location.pathname, newLang) || localizePath("/", newLang);
    window.history.pushState({}, "", `${target}${window.location.hash}`);
    setCurrentRoute(routeFromLocation());
  };
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync with browser URL & routing
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(routeFromLocation());
    };

    handlePopState();
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);

    // Check for Stripe Checkout return (only for standard home page orders)
    const urlParams = new URLSearchParams(window.location.search);
    const currentLang = langFromPath(window.location.pathname);
    const isStreamingRoute = stripLangPrefix(window.location.pathname).startsWith("/streaming") || window.location.hash.includes("streaming");
    
    if (!isStreamingRoute && urlParams.get("stripe_success") === "true" && urlParams.get("session_id")) {
      const sessionId = urlParams.get("session_id");
      fetch("/api/verify-stripe-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const txId = data.order?.transactionId || sessionId;
            trackPurchase(txId, {
              price: Number(data.order?.amount) || 19.99,
              name: data.order?.orderName || "Personalisierter Song",
              id: "personalized-song",
            });
            alert(
              currentLang === "en"
                ? `🎉 Thank you! Your Stripe payment was successful (Order ID: ${txId}). We have received your order and sent a confirmation to your email!`
                : `🎉 Vielen Dank! Deine Zahlung via Stripe war erfolgreich (Bestell-Nr: ${txId}). Wir haben deinen Auftrag erhalten und eine Bestätigung an deine E-Mail gesendet!`
            );
          }
        })
        .catch(console.error)
        .finally(() => {
          window.history.replaceState({}, "", localizePath("/", currentLang));
        });
    } else if (!isStreamingRoute && urlParams.get("stripe_cancel") === "true") {
      alert(
        currentLang === "en"
          ? "The Stripe payment was cancelled. You can try again at any time."
          : "Die Zahlung via Stripe wurde abgebrochen. Du kannst es jederzeit erneut versuchen."
      );
      window.history.replaceState({}, "", localizePath("/", currentLang));
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const navigateToBlog = (slug) => {
    go(`/${slug}`, { view: "blog", slug });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToAuthor = () => {
    go("/autor-dirk-schmetzer", { view: "author", slug: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToSupport = () => {
    go("/support", { view: "support", slug: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToB2B = () => {
    go("/b2b", { view: "b2b", slug: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToLegal = (type = "impressum") => {
    go(`/${type}`, { view: "legal", slug: type });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToHome = (hash = "") => {
    go(hash ? `/${hash}` : "/", { view: "home", slug: null });
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleOpenCheckout = (order) => {
    setCheckoutOrder(order);
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <LanguageProvider language={lang} onChangeLanguage={changeLanguage} path={window.location.pathname}>
    <div className="relative min-h-screen bg-[#faf8f5] text-stone-900">
      {currentRoute.view === "home" && (
        <LandingPage
          onOpenCheckout={handleOpenCheckout}
          onNavigateBlog={navigateToBlog}
          onNavigateAuthor={navigateToAuthor}
          onNavigateLegal={navigateToLegal}
          onNavigateSupport={navigateToSupport}
          onNavigateB2B={navigateToB2B}
        />
      )}

      <Suspense fallback={<div className="min-h-screen bg-[#faf8f5]" />}>
      {currentRoute.view === "support" && (
        <SupportPage
          onBackToHome={() => navigateToHome()}
          onGoToConfigurator={() => navigateToHome("#konfigurator")}
        />
      )}

      {currentRoute.view === "b2b" && (
        <B2BPage
          onBackToHome={() => navigateToHome()}
          onGoToConfigurator={() => navigateToHome("#konfigurator")}
        />
      )}

      {currentRoute.view === "streaming" && (
        <StreamingReleasePage
          onBackToHome={() => navigateToHome()}
          onOpenCheckout={handleOpenCheckout}
        />
      )}

      {currentRoute.view === "blog" && (
        <BlogPost
          slug={currentRoute.slug || "individueller-hochzeitssong"}
          onBackToHome={() => navigateToHome()}
          onGoToConfigurator={() => navigateToHome("#konfigurator")}
          onNavigateBlog={navigateToBlog}
        />
      )}

      {currentRoute.view === "author" && (
        <AuthorPage
          onBackToHome={() => navigateToHome()}
          onGoToConfigurator={() => navigateToHome("#konfigurator")}
        />
      )}

      {currentRoute.view === "legal" && (
        <LegalPage
          type={currentRoute.slug || "impressum"}
          onBackToHome={() => navigateToHome()}
          onSwitchTab={(type) => navigateToLegal(type)}
        />
      )}

      </Suspense>

      {/* Kasse wird erst beim ersten Öffnen geladen */}
      {checkoutOrder && (
        <Suspense fallback={null}>
          <PayPalCheckout
            isOpen={isCheckoutOpen}
            onClose={handleCloseCheckout}
            order={checkoutOrder}
          />
        </Suspense>
      )}

      {/* Floating Language Switcher on the Top Right (Startseite; alle Unterseiten haben ihn direkt im eigenen Header) */}
      <aside
        aria-label="Sprachauswahl / Language Selection"
        className={
          currentRoute.view === "home"
            ? "hidden sm:block fixed sm:top-28 sm:right-6 z-40 transition-all duration-300"
            : "hidden"
        }
      >
        <LanguageSwitcher />
      </aside>

      {/* GDPR Consent Banner with Google Consent Mode v2 */}
      <ConsentBanner />
    </div>
    </LanguageProvider>
  );
}

export default function App() {
  return <AppMain />;
}
