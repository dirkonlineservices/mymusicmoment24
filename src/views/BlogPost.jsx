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
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-8">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          <span className="text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            {post.category || (language === "en" ? "Guide" : "Ratgeber")}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            {post.author || "Dirk Schmetzer"}
          </span>
          {post.readTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readTime}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        <p className="text-lg text-slate-300 font-light leading-relaxed border-l-4 border-orange-500 pl-4 mb-8">
          {post.excerpt}
        </p>

        <hr className="border-slate-800 my-8" />

        {/* Rendered HTML content */}
        <div
          className="prose prose-invert prose-orange max-w-none 
            prose-headings:text-white prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-5
            prose-strong:text-white prose-strong:font-bold
            prose-ul:text-slate-300 prose-ul:my-4 prose-li:my-1
            prose-a:text-amber-400 hover:prose-a:text-amber-300"
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

