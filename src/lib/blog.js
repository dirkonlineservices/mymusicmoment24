import { marked } from "marked";

// Raw markdown imports from content/blog directory
const blogFiles = import.meta.glob("/content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

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
export function getAllBlogPosts() {
  const posts = [];

  for (const path in blogFiles) {
    const rawContent = blogFiles[path];
    const { data, content } = parseFrontmatter(rawContent);
    const slug = data.slug || path.replace(/^.*[\\\/]/, "").replace(/\.md$/, "");

    posts.push({
      ...data,
      slug,
      content,
      html: marked.parse(content),
    });
  }

  return posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

/**
 * Get a specific post by slug
 */
export function getBlogPostBySlug(slug) {
  const allPosts = getAllBlogPosts();
  return allPosts.find((p) => p.slug === slug) || null;
}
