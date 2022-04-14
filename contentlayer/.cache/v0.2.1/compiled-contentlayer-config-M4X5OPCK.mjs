// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
import path from "path";
import remarkGfm from "remark-gfm";
import remarkFootnotes from "remark-footnotes";
import remarkMath from "remark-math";

// lib/remark-extract-frontmatter.ts
import { visit } from "unist-util-visit";
import yaml from "js-yaml";
function extractFrontmatter() {
  return (tree, file) => {
    visit(tree, "yaml", (node) => {
      file.data.frontmatter = yaml.load(node.value);
    });
  };
}

// lib/remark-code-title.ts
import { visit as visit2 } from "unist-util-visit";
function remarkCodeTitles() {
  return (tree) => visit2(tree, "code", (node, index, parent) => {
    const nodeLang = node.lang || "";
    let language = "";
    let title = "";
    if (nodeLang.includes(":")) {
      language = nodeLang.slice(0, nodeLang.search(":"));
      title = nodeLang.slice(nodeLang.search(":") + 1, nodeLang.length);
    }
    if (!title) {
      return;
    }
    const className = "remark-code-title";
    const titleNode = {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [{ type: "mdxJsxAttribute", name: "className", value: className }],
      children: [{ type: "text", value: title }],
      data: { _xdmExplicitJsx: true }
    };
    parent.children.splice(index, 0, titleNode);
    node.lang = language;
  });
}

// lib/remark-toc-headings.ts
import { visit as visit3 } from "unist-util-visit";
import slugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { remark } from "remark";
function remarkTocHeadings() {
  return (tree, file) => {
    const toc = [];
    visit3(tree, "heading", (node) => {
      const textContent = toString(node);
      toc.push({
        value: textContent,
        url: "#" + slugger.slug(textContent),
        depth: node.depth
      });
    });
    file.data.toc = toc;
  };
}
async function extractTocHeadings(markdown) {
  const vfile = await remark().use(remarkTocHeadings).process(markdown);
  return vfile.data.toc;
}

// lib/remark-img-to-jsx.ts
import { visit as visit4 } from "unist-util-visit";
import sizeOf from "image-size";
import fs from "fs";
function remarkImgToJsx() {
  return (tree) => {
    visit4(tree, (node) => node.type === "paragraph" && node.children.some((n) => n.type === "image"), (node) => {
      const imageNode = node.children.find((n) => n.type === "image");
      if (fs.existsSync(`${process.cwd()}/public${imageNode.url}`)) {
        const dimensions = sizeOf(`${process.cwd()}/public${imageNode.url}`);
        imageNode.type = "mdxJsxFlowElement", imageNode.name = "Image", imageNode.attributes = [
          { type: "mdxJsxAttribute", name: "alt", value: imageNode.alt },
          { type: "mdxJsxAttribute", name: "src", value: imageNode.url },
          { type: "mdxJsxAttribute", name: "width", value: dimensions.width },
          { type: "mdxJsxAttribute", name: "height", value: dimensions.height }
        ];
        node.type = "div";
        node.children = [imageNode];
      }
    });
  };
}

// contentlayer.config.ts
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeCitation from "rehype-citation";
import rehypePrismPlus from "rehype-prism-plus";
import rehypePresetMinify from "rehype-preset-minify";
var root = process.cwd();
var computedFields = {
  readingTime: { type: "json", resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, "")
  },
  toc: { type: "string", resolve: (doc) => extractTocHeadings(doc.body.raw) }
};
var Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "blog/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" } },
    lastmod: { type: "date" },
    draft: { type: "boolean" },
    summary: { type: "string" },
    images: { type: "list", of: { type: "string" } },
    authors: { type: "list", of: { type: "string" } },
    layout: { type: "string" },
    bibliography: { type: "string" },
    canonicalUrl: { type: "string" }
  },
  computedFields
}));
var Authors = defineDocumentType(() => ({
  name: "Authors",
  filePathPattern: "authors/**/*.mdx",
  contentType: "mdx",
  fields: {
    name: { type: "string", required: true },
    avatar: { type: "string" },
    occupation: { type: "string" },
    company: { type: "string" },
    email: { type: "string" },
    twitter: { type: "string" },
    linkedin: { type: "string" },
    github: { type: "string" },
    layout: { type: "string" }
  },
  computedFields
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "data",
  contentDirInclude: ["blog", "authors"],
  documentTypes: [Blog, Authors],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      extractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      [remarkFootnotes, { inlineNotes: true }],
      remarkMath,
      remarkImgToJsx
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeKatex,
      [rehypeCitation, { path: path.join(root, "data") }],
      [rehypePrismPlus, { ignoreMissing: true }],
      rehypePresetMinify
    ]
  }
});
export {
  Authors,
  Blog,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-M4X5OPCK.mjs.map
