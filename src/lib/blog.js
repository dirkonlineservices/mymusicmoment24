import { marked } from "marked";

// Raw markdown imports from content/blog directory
const blogFiles = {
  de: import.meta.glob("/content/blog/*.md", { query: "?raw", import: "default", eager: true }),
  en: import.meta.glob("/content/blog/en/*.md", { query: "?raw", import: "default", eager: true }),
};

/**
 * Lightweight frontmatter parser
 */
function parseFrontmatter(rawContent) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: rawContent };
  }

  const yamlBlock = match[1];
  const markdownBody = match[2];
  const data = {};

  yamlBlock.split(/\r?\n/).forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Clean quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });

  return { data, content: markdownBody };
}

/**
 * Returns all published blog posts with metadata
 */
export function getAllBlogPosts(lang = "de") {
  const posts = [];
  const files = blogFiles[lang === "en" ? "en" : "de"];

  for (const path in files) {
    const rawContent = files[path];
    const { data, content } = parseFrontmatter(rawContent);
    const slug = data.slug || path.replace(/^.*[\\\/]/, "").replace(/\.md$/, "");

    // Strip leading duplicate H1 (# Title) from markdown body if present
    const cleanedContent = content.replace(/^\s*#\s+[^\r\n]+\r?\n+/, "");

    posts.push({
      ...data,
      lang: lang === "en" ? "en" : "de",
      // deutscher Slug = interne Kennung, gleich in beiden Sprachen
      key: lang === "en" ? data.deSlug || slug : slug,
      slug,
      content: cleanedContent,
      html: marked.parse(cleanedContent),
    });
  }

  return posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

/**
 * Get a specific post by slug
 */
export function getBlogPostBySlug(slug, lang = "de") {
  return getAllBlogPosts(lang).find((p) => p.slug === slug) || null;
}

/** Artikel über den deutschen Slug in der gewünschten Sprache */
export function getBlogPostByKey(key, lang = "de") {
  return getAllBlogPosts(lang).find((p) => p.key === key) || null;
}
