import React from "react";
import { ArrowLeft, Calendar, User, Clock, Music, ArrowRight, Share2 } from "lucide-react";
import { getBlogPostBySlug } from "../lib/blog";
import SchemaJsonLd from "../components/SchemaJsonLd";

export default function BlogPost({ slug, onBackToHome, onGoToConfigurator }) {
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Artikel nicht gefunden</h1>
        <button
          onClick={onBackToHome}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Zurück zur Startseite
        </button>
      </div>
    );
  }

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
            <span>Zurück zur Übersicht</span>
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Music className="w-4 h-4 text-orange-500" />
            <span>MyMusicMoment24</span>
          </div>
        </div>
      </header>

      {/* Article Header */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-8">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          <span className="text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            {post.category || "Ratgeber"}
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
            prose-ul:text-slate-300 prose-ul:my-4 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* CTA Box at bottom */}
        <div className="mt-16 bg-gradient-to-br from-orange-500/20 via-slate-900 to-slate-900 border border-orange-500/30 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
            <Music className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Möchtest du euren eigenen Hochzeitssong hören?</h3>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Konfiguriere jetzt unverbindlich deinen Song in 5 Schritten. Innerhalb von 24 Stunden ist dein persönliches Lied fertig.
          </p>
          <button
            onClick={() => {
              onBackToHome();
              setTimeout(() => {
                const el = document.getElementById("konfigurator");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition shadow-xl shadow-orange-500/20"
          >
            <span>Jetzt Song konfigurieren</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
