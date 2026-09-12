import React, { useState, useEffect } from "react";
import LandingPage from "./views/LandingPage";
import BlogPost from "./views/BlogPost";
import AuthorPage from "./views/AuthorPage";
import LegalPage from "./views/LegalPage";
import StreamingReleasePage from "./views/StreamingReleasePage";
import SupportPage from "./views/SupportPage";
import PayPalCheckout from "./components/PayPalCheckout";
import ConsentBanner from "./components/ConsentBanner";
import { trackPurchase } from "./lib/gtmPreview";
import { LanguageProvider } from "./context/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";

function AppMain() {
  const [currentRoute, setCurrentRoute] = useState({
    view: "home",
    slug: null,
  });

  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync with browser URL & routing
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (
        path === "/streaming" || 
        path === "/spotify-release" || 
        path === "/streaming-release" ||
        hash === "#/streaming" ||
        hash === "#/spotify-release"
      ) {
        setCurrentRoute({ view: "streaming", slug: null });
      } else if (path === "/support" || path === "/kontakt" || hash === "#/support") {
        setCurrentRoute({ view: "support", slug: null });
      } else if (path.startsWith("/blog/")) {
        const slug = path.replace("/blog/", "").replace(/\/$/, "");
        setCurrentRoute({ view: "blog", slug });
      } else if (path === "/autor-dirk-schmetzer" || path === "/ueber-uns-musikservice") {
        setCurrentRoute({ view: "author", slug: null });
      } else if (path === "/impressum") {
        setCurrentRoute({ view: "legal", slug: "impressum" });
      } else if (path === "/datenschutz") {
        setCurrentRoute({ view: "legal", slug: "datenschutz" });
      } else {
        setCurrentRoute({ view: "home", slug: null });
      }
    };

    handlePopState();
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);

    // Check for Stripe Checkout return (only for standard home page orders)
    const urlParams = new URLSearchParams(window.location.search);
    const isStreamingRoute = window.location.pathname.startsWith("/streaming") || window.location.hash.includes("streaming");
    
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
            alert(`🎉 Vielen Dank! Deine Zahlung via Stripe war erfolgreich (Bestell-Nr: ${txId}). Wir haben deinen Auftrag erhalten und eine Bestätigung an deine E-Mail gesendet!`);
          }
        })
        .catch(console.error)
        .finally(() => {
          window.history.replaceState({}, "", "/");
        });
    } else if (!isStreamingRoute && urlParams.get("stripe_cancel") === "true") {
      alert("Die Zahlung via Stripe wurde abgebrochen. Du kannst es jederzeit erneut versuchen.");
      window.history.replaceState({}, "", "/");
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const navigateToBlog = (slug) => {
    window.history.pushState({}, "", `/blog/${slug}`);
    setCurrentRoute({ view: "blog", slug });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToAuthor = () => {
    window.history.pushState({}, "", "/autor-dirk-schmetzer");
    setCurrentRoute({ view: "author", slug: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToSupport = () => {
    window.history.pushState({}, "", "/support");
    setCurrentRoute({ view: "support", slug: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToLegal = (type = "impressum") => {
    window.history.pushState({}, "", `/${type}`);
    setCurrentRoute({ view: "legal", slug: type });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToHome = (hash = "") => {
    window.history.pushState({}, "", hash ? `/${hash}` : "/");
    setCurrentRoute({ view: "home", slug: null });
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
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {currentRoute.view === "home" && (
        <LandingPage
          onOpenCheckout={handleOpenCheckout}
          onNavigateBlog={navigateToBlog}
          onNavigateAuthor={navigateToAuthor}
          onNavigateLegal={navigateToLegal}
          onNavigateSupport={navigateToSupport}
        />
      )}

      {currentRoute.view === "support" && (
        <SupportPage
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

      {/* Slide-over PayPal Checkout Drawer */}
      <PayPalCheckout
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        order={checkoutOrder}
      />

      {/* Floating Language Switcher on the Top Right */}
      <aside
        aria-label="Sprachauswahl / Language Selection"
        className="fixed top-20 right-3 sm:top-20 sm:right-6 z-40 transition-all duration-300"
      >
        <LanguageSwitcher />
      </aside>

      {/* GDPR Consent Banner with Google Consent Mode v2 */}
      <ConsentBanner />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppMain />
    </LanguageProvider>
  );
}
