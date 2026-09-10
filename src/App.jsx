import React, { useState, useEffect } from "react";
import LandingPage from "./views/LandingPage";
import BlogPost from "./views/BlogPost";
import PayPalCheckout from "./components/PayPalCheckout";
import ConsentBanner from "./components/ConsentBanner";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState({
    view: "home",
    slug: null,
  });

  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync with browser URL
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/blog/")) {
        const slug = path.replace("/blog/", "").replace(/\/$/, "");
        setCurrentRoute({ view: "blog", slug });
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

  const navigateToHome = () => {
    window.history.pushState({}, "", "/");
    setCurrentRoute({ view: "home", slug: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        />
      )}

      {currentRoute.view === "blog" && (
        <BlogPost
          slug={currentRoute.slug || "individueller-hochzeitssong"}
          onBackToHome={navigateToHome}
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
