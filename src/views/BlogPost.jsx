import React from "react";
import { ArrowLeft, Calendar, User, Clock, Music, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { getBlogPostBySlug, getAllBlogPosts } from "../lib/blog";
import SchemaJsonLd from "../components/SchemaJsonLd";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function BlogPost({ slug, onBackToHome, onGoToConfigurator, onNavigateBlog }) {
  const { language } = useLanguage();
  const post = getBlogPostBySlug(slug);
  const allPosts = getAllBlogPosts();
  const otherPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-white mb-4">
          {language === "en" ? "Article not found" : "Artikel nicht gefunden"}
        </h1>
        <button
          onClick={onBackToHome}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> {language === "en" ? "Back to Homepage" : "Zurück zur Startseite"}
        </button>
      </div>
    );
  }

  const ctaTitle = language === "en"
    ? (post.category === "Hochzeit" || post.category === "Hochzeit & Liebe"
        ? "Would you like to hear your custom wedding song?"
        : post.category === "Geburtstag"
        ? "Would you like to create a personalized birthday song?"
        : post.category === "Jubiläum"
        ? "Would you like to gift a custom anniversary song?"
        : "Would you like to hear your custom personalized song?")
    : (post.category === "Hochzeit" || post.category === "Hochzeit & Liebe"
        ? "Möchtest du euren eigenen Hochzeitssong hören?"
        : post.category === "Geburtstag"
        ? "Möchtest du ein persönliches Geburtstagslied erstellen?"
        : post.category === "Jubiläum"
        ? "Möchtest du einen persönlichen Jubiläumssong verschenken?"
        : "Möchtest du deinen eigenen persönlichen Song hören?");

  return (
    <article className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SchemaJsonLd type="blog" blogPost={post} />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span>{language === "en" ? "Back to Homepage" : "Zurück zur Startseite"}</span>
          </button>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-sm font-bold text-white hover:opacity-90 transition"
            >
              <img
                src="/images/logo-icon.png"
                alt="MyMusicMoment24 Logo"
                className="w-7 h-7 object-contain"
              />
              <span>MyMusicMoment<span className="text-amber-400">24</span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">
          <span className="text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-bold">
            {post.category || (language === "en" ? "Guide" : "Ratgeber")}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            {post.author || "Dirk Schmetzer"}
          </span>
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {post.readTime}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-[1.2] tracking-tight mb-6">
          {post.title}
        </h1>

        <div className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed bg-slate-900/90 border border-slate-800 border-l-4 border-l-amber-500 p-5 rounded-r-2xl mb-8 shadow-md">
          {post.excerpt}
        </div>

        {/* Hero Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-64 sm:h-96 md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl mb-10 group">
            <img
              src={post.coverImage}
              alt={post.title}
              width="1200"
              height="800"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
              <span className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow">
                {post.category || (language === "en" ? "Guide" : "Ratgeber")}
              </span>
              <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-slate-300 font-medium">
                MyMusicMoment24 • Seit 2024
              </span>
            </div>
          </div>
        )}

        {/* Rendered HTML content with High-Readability & Boxed Headings */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* CTA Box at bottom */}
        <div className="mt-16 bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
            <Music className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">{ctaTitle}</h3>
          <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
            {language === "en"
              ? "Configure your custom song in 5 simple steps from €19.99. Usually ready within 24 hours – includes 1 free revision loop."
              : "Konfiguriere jetzt unverbindlich deinen Song in 5 Schritten ab 19,99 €. Meist innerhalb von 24 Stunden fertig – inklusive 1 kostenloser Verbesserungsschleife."}
          </p>
          <button
            onClick={() => {
              onBackToHome();
              setTimeout(() => {
                const el = document.getElementById("konfigurator");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl transition shadow-xl shadow-amber-500/20 active:scale-95"
          >
            <span>{language === "en" ? "Configure Song Now" : "Jetzt Song konfigurieren"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weitere Ratgeber & Blog-Artikel */}
        {otherPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-6">
              <BookOpen className="w-4 h-4" />
              <span>{language === "en" ? "Related Guides & Song Topics" : "Weitere Ratgeber & Song-Themen"}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherPosts.map((op) => (
                <button
                  key={op.slug}
                  onClick={() => {
                    if (onNavigateBlog) {
                      onNavigateBlog(op.slug);
                    } else {
                      window.history.pushState({}, "", `/blog/${op.slug}`);
                      window.location.reload();
                    }
                  }}
                  className="text-left bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-4 rounded-2xl transition group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block mb-1.5">
                      {op.category || "Ratgeber"}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition line-clamp-2 mb-2">
                      {op.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {op.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{op.readTime || "5 Min."}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

