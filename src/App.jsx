import React, { useState, useEffect } from "react";
import LandingPage from "./views/LandingPage";
import BlogPost from "./views/BlogPost";
import AuthorPage from "./views/AuthorPage";
import LegalPage from "./views/LegalPage";
import PayPalCheckout from "./components/PayPalCheckout";
import ConsentBanner from "./components/ConsentBanner";

export default function App() {
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
      if (path.startsWith("/blog/")) {
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
    return () => window.removeEventListener("popstate", handlePopState);
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

      {/* GDPR Consent Banner with Google Consent Mode v2 */}
      <ConsentBanner />
    </div>
  );
}
