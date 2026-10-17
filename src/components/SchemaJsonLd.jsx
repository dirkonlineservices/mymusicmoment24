import React, { useEffect } from "react";
import { PRODUCTS } from "../data/products";
import { translations } from "../i18n/translations";

/**
 * Helper to build Google Merchant Center & Rich Results compliant Product Schema
 */
function createProductSchema(prod) {
  const imageUrl = prod.image?.startsWith("http")
    ? prod.image
    : `https://www.mymusicmoment24.de${prod.image || "/images/hochzeit.jpg"}`;

  const canonicalUrl = prod.url || (
    prod.id === "hochzeit"
      ? "https://www.mymusicmoment24.de/individuelle-hochzeitsgeschenke"
      : prod.id === "geburtstag"
      ? "https://www.mymusicmoment24.de/personalisierte-geburtstagslieder"
      : prod.id === "jubilaeum" || prod.id === "jubilaum"
      ? "https://www.mymusicmoment24.de/jubilaum-song"
      : prod.id === "streaming"
      ? "https://www.mymusicmoment24.de/streaming"
      : "https://www.mymusicmoment24.de/#shop"
  );

  return {
    "@type": "Product",
    // Eindeutige Kennung pro Produkt, sonst verschmilzt Google mehrere Produkte zu einem
    "@id": canonicalUrl.includes("#")
      ? `https://www.mymusicmoment24.de/#product-${prod.id}`
      : `${canonicalUrl}#product`,
    name: prod.title,
    image: [imageUrl],
    description: prod.description,
    sku: `MMM24-${(prod.id || "CUSTOM").toUpperCase()}`,
    mpn: `MMM24-${(prod.id || "CUSTOM").toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: "MyMusicMoment24",
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "EUR",
      price: (prod.price || 19.99).toFixed(2),
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        "@id": "https://www.mymusicmoment24.de/#organization",
        name: "MyMusicMoment24",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "DE",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        merchantReturnDays: 0,
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0.00",
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "DE",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
        },
      },
    },
    // Nur mit echten, belegbaren Bewertungen ausgeben
    ...(prod.reviewsCount > 0 ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (prod.rating || 5.0).toFixed(1),
        reviewCount: String(prod.reviewsCount || 2),
        bestRating: "5",
        worstRating: "1",
      },
    } : {}),
  };
}

export default function SchemaJsonLd({ type = "home", blogPost = null }) {
  useEffect(() => {
    const schemaItems = [];

    // 1. Organization & LocalBusiness Schema (Always Present)
    const organizationSchema = {
      "@type": "LocalBusiness",
      "@id": "https://www.mymusicmoment24.de/#organization",
      name: "MyMusicMoment24",
      legalName: "Dirk Schmetzer - DS Online Services",
      url: "https://www.mymusicmoment24.de",
      logo: {
        "@type": "ImageObject",
        url: "https://www.mymusicmoment24.de/images/logo.png",
        width: "512",
        height: "512",
      },
      image: "https://www.mymusicmoment24.de/images/hochzeit.jpg",
      description: "Personalisierte Musikstücke und Songs mit KI und echter menschlicher Qualitätsprüfung. Dein Unikat für Hochzeit, Geburtstag und Jubiläum.",
      telephone: "+49-1590-6122744",
      email: "info@mymusicmoment24.de",
      priceRange: "€€",
      currenciesAccepted: "EUR",
      paymentAccepted: "PayPal, Kreditkarte, Debitkarte, Apple Pay, SEPA-Lastschrift, Banküberweisung",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Riedgrasweg 30",
        addressLocality: "Stuttgart",
        postalCode: "70599",
        addressCountry: "DE",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 48.7183,
        longitude: 9.2081,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      founder: {
        "@type": "Person",
        "@id": "https://www.mymusicmoment24.de/autor-dirk-schmetzer#person",
        name: "Dirk Schmetzer",
        jobTitle: "Gründer, Musikproduzent & Webentwickler",
        image: "https://www.mymusicmoment24.de/images/dirk-schmetzer.png",
        sameAs: [
          "https://www.mymusicmoment24.de/autor-dirk-schmetzer",
          "https://www.youtube.com/@MyMusicMoment24",
        ],
      },
      sameAs: [
        "https://www.youtube.com/@MyMusicMoment24",
        "https://www.mymusicmoment24.de/autor-dirk-schmetzer",
      ],
    };

    schemaItems.push(organizationSchema);

    // 2. All Individual Catalog Products (Resolves Google Merchant Center missing prices & availability)
    // Nur einzeln kaufbare Produkte; Zusatzoptionen (Express, Song-Urkunde) gibt es nur im Konfigurator
    const allCatalogProducts = [
      ...PRODUCTS.filter((p) => p.id !== "urkunde"),
      {
        id: "gutschein",
        title: "Geschenkgutschein für ein Wunschlied",
        price: 19.99,
        image: "/images/gutschein.jpg",
        url: "https://www.mymusicmoment24.de/#gutschein",
        description: "Geschenkgutschein für einen persönlichen Song nach Wahl, als druckfertiges PDF per E-Mail, einlösbar für jeden Anlass und jedes Genre.",
      },
      {
        id: "streaming",
        title: "Spotify & Streaming-Release (Apple Music, YouTube Music)",
        price: 4.99,
        image: "/images/logo.png",
        url: "https://www.mymusicmoment24.de/streaming",
        description: "Offizielle Veröffentlichung deines personalisierten Songs auf Spotify, Apple Music, YouTube Music & Amazon Music.",
      },
    ];

    if (type === "home") {
      // Add all products to Schema on homepage
      allCatalogProducts.forEach((p) => {
        schemaItems.push(createProductSchema(p));
      });

      // FAQ Schema
      const faqSchema = {
        "@type": "FAQPage",
        "@id": "https://www.mymusicmoment24.de/#faq",
        // Gleiche Fragen und Antworten wie die sichtbare FAQ auf der Startseite
        mainEntity: (translations.de.faq.items || []).map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      };

      schemaItems.push(faqSchema);
    } else if (type === "blog" && blogPost) {
      // BlogPosting Schema
      const blogPostingSchema = {
        "@type": "BlogPosting",
        "@id": `https://www.mymusicmoment24.de/${blogPost.slug}#article`,
        headline: blogPost.title,
        description: blogPost.excerpt,
        image: blogPost.image || "https://www.mymusicmoment24.de/images/hochzeit.jpg",
        author: {
          "@type": "Person",
          "@id": "https://www.mymusicmoment24.de/autor-dirk-schmetzer#person",
          name: blogPost.author || "Dirk Schmetzer",
          url: "https://www.mymusicmoment24.de/autor-dirk-schmetzer",
        },
        datePublished: blogPost.date,
        dateModified: blogPost.dateModified || blogPost.date,
        publisher: {
          "@type": "Organization",
          "@id": "https://www.mymusicmoment24.de/#organization",
          name: "MyMusicMoment24",
          logo: {
            "@type": "ImageObject",
            url: "https://www.mymusicmoment24.de/images/logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://www.mymusicmoment24.de/${blogPost.slug}`,
        },
      };

      schemaItems.push(blogPostingSchema);

      // Match blog post with corresponding product for Google Merchant Center
      if (blogPost.slug.includes("geburtstag")) {
        const p = allCatalogProducts.find((x) => x.id === "geburtstag");
        if (p) schemaItems.push(createProductSchema({ ...p, url: `https://www.mymusicmoment24.de/${blogPost.slug}` }));
      } else if (blogPost.slug.includes("hochzeit")) {
        const p = allCatalogProducts.find((x) => x.id === "hochzeit");
        if (p) schemaItems.push(createProductSchema({ ...p, url: `https://www.mymusicmoment24.de/${blogPost.slug}` }));
      } else if (blogPost.slug.includes("jubilaum") || blogPost.slug.includes("jubilaeum")) {
        const p = allCatalogProducts.find((x) => x.id === "jubilaeum");
        if (p) schemaItems.push(createProductSchema({ ...p, url: `https://www.mymusicmoment24.de/${blogPost.slug}` }));
      } else {
        // Fallback song product
        const p = allCatalogProducts.find((x) => x.id === "hochzeit");
        if (p) schemaItems.push(createProductSchema({ ...p, url: `https://www.mymusicmoment24.de/${blogPost.slug}` }));
      }
    } else if (type === "streaming") {
      const streamingProd = allCatalogProducts.find((x) => x.id === "streaming");
      if (streamingProd) schemaItems.push(createProductSchema(streamingProd));
    }

    // Insert into DOM head as @graph (Google recommended)
    const scriptId = "mmm24-json-ld";
    let existingScript = document.getElementById(scriptId);
    if (!existingScript) {
      existingScript = document.createElement("script");
      existingScript.id = scriptId;
      existingScript.type = "application/ld+json";
      document.head.appendChild(existingScript);
    }
    existingScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schemaItems,
    });

    return () => {
      const script = document.getElementById(scriptId);
      if (script) script.remove();
    };
  }, [type, blogPost]);

  return null;
}
