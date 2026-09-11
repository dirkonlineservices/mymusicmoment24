import React, { useEffect } from "react";

export default function SchemaJsonLd({ type = "home", blogPost = null }) {
  useEffect(() => {
    let schemaData = [];

    // Base Organization & LocalBusiness Schema for GEO & E-E-A-T
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://www.mymusicmoment24.de/#organization",
      name: "MyMusicMoment24",
      legalName: "DS Online Services - Dirk Schmetzer",
      url: "https://www.mymusicmoment24.de",
      logo: "https://www.mymusicmoment24.de/images/logo.png",
      image: "https://www.mymusicmoment24.de/images/hochzeit.jpg",
      description: "Personalisierte Lieder und individuelle Songs mit modernster KI-Technologie in Studioqualität ab 19,99 €.",
      telephone: "+49-151-23456789",
      email: "info@mymusicmoment24.de",
      priceRange: "19,99 € - 34,97 €",
      currenciesAccepted: "EUR",
      paymentAccepted: "PayPal, Kreditkarte, Apple Pay, Google Pay, SEPA",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Riedgrasweg 30",
        postalCode: "70599",
        addressLocality: "Stuttgart",
        addressRegion: "Baden-Württemberg",
        addressCountry: "DE",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 48.7185,
        longitude: 9.2045,
      },
      areaServed: [
        { "@type": "Country", name: "Germany" },
        { "@type": "Country", name: "Austria" },
        { "@type": "Country", name: "Switzerland" }
      ],
      founder: {
        "@type": "Person",
        name: "Dirk Schmetzer",
        jobTitle: "Gründer & Musikproduzent",
        sameAs: [
          "https://www.mymusicmoment24.de/autor-dirk-schmetzer",
          "https://www.youtube.com/@MyMusicMoment24"
        ]
      },
      sameAs: [
        "https://www.youtube.com/@MyMusicMoment24",
        "https://github.com/dirkonlineservices/mymusicmoment24"
      ],
    };

    schemaData.push(organizationSchema);

    if (type === "home") {
      // Product Schema (Merchant Listings & Rezensions-Snippets Ready)
      const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Personalisierter Song mit Namen & Geschichte (MP3 & Text)",
        image: [
          "https://www.mymusicmoment24.de/images/hochzeit.jpg",
          "https://www.mymusicmoment24.de/images/geburtstag.jpg",
          "https://www.mymusicmoment24.de/images/duett.jpg"
        ],
        description: "Dein individuelles Lied mit eigenem Namen und persönlicher Geschichte für Geburtstag, Hochzeit, Hochzeitstag oder Jubiläum. Professionelle KI-Komposition in Studioqualität in 24h fertig.",
        sku: "MMM24-SONG-01",
        mpn: "MMM24-CUSTOM-AUDIO",
        brand: {
          "@type": "Brand",
          name: "MyMusicMoment24",
        },
        offers: {
          "@type": "Offer",
          url: "https://www.mymusicmoment24.de/#konfigurator",
          priceCurrency: "EUR",
          price: "19.99",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
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
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "135",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Tanja S.",
            },
            datePublished: "2026-02-14",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
            reviewBody: "Ich habe meinem Mann zu unserer Silberhochzeit ein individuelles Hochzeitslied schenken wollen. Als der Song lief, haben alle geweint – vor Freude und Rührung! Absolute Empfehlung.",
          },
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Jörn M.",
            },
            datePublished: "2026-01-20",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
            reviewBody: "Für den 50. Geburtstag meines besten Kumpels ein Geburtstagslied mit Namen und allen alten Insider-Geschichten erstellen lassen. Der absolute Abräumer auf der Party!",
          },
        ],
      };

      // FAQ Schema
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Wie lange dauert die Erstellung meines Songs?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In der Regel ist dein Song innerhalb von 24 bis 48 Stunden fertig. Mit unserem Express-Zuschlag erhältst du deinen Song innerhalb von 12 Stunden.",
            },
          },
          {
            "@type": "Question",
            name: "In welchem Format erhalte ich meinen fertigen Song?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Du erhältst deinen Song als hochauflösende MP3-Datei sowie unkomprimierte WAV-Datei in Studioqualität per sicherem Download-Link.",
            },
          },
          {
            "@type": "Question",
            name: "Darf ich den Song öffentlich abspielen oder verschenken?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja! Du erhältst die vollen privaten Nutzungsrechte für Feiern, Hochzeiten, Videos und persönliche Geschenke.",
            },
          },
        ],
      };

      schemaData.push(productSchema, faqSchema);
    } else if (type === "blog" && blogPost) {
      // BlogPosting Schema
      const blogPostingSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blogPost.title,
        description: blogPost.excerpt,
        author: {
          "@type": "Person",
          name: blogPost.author || "Dirk Schmetzer",
        },
        datePublished: blogPost.date,
        publisher: {
          "@type": "Organization",
          name: "MyMusicMoment24",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://www.mymusicmoment24.de/blog/${blogPost.slug}`,
        },
      };

      schemaData.push(blogPostingSchema);
    }

    // Insert into DOM head
    const scriptId = "mmm24-json-ld";
    let existingScript = document.getElementById(scriptId);
    if (!existingScript) {
      existingScript = document.createElement("script");
      existingScript.id = scriptId;
      existingScript.type = "application/ld+json";
      document.head.appendChild(existingScript);
    }
    existingScript.text = JSON.stringify(schemaData);

    return () => {
      const script = document.getElementById(scriptId);
      if (script) script.remove();
    };
  }, [type, blogPost]);

  return null;
}
