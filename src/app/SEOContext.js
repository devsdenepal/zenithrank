"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const SEOContext = createContext();

const INITIAL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>EcoGarden | Sustainable Living Supplies</title>
    <meta name="description" content="Discover sustainable solutions for your urban oasis. Shop eco-friendly garden tools, composters, and plant care essentials.">
</head>
<body>
    <h1>Welcome to EcoGarden</h1>
    <p>Discover sustainable solutions for your urban oasis.</p>
    <img src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800" alt="Lush Garden">
    <a href="/about">About our mission</a>
</body>
</html>`;

// Each rule defines a title/description used in the UI and is evaluated
// by the matching function in validate().
const SEED_RULES = [
  { id: "h1", title: "H1 Tag", desc: "Exactly one <h1> must exist in the body.", type: "pending" },
  { id: "meta", title: "Meta Description", desc: "A 50–160 character meta description must exist in the <head>.", type: "pending" },
  { id: "title", title: "Title Tag", desc: "A concise, descriptive <title> element should exist in the <head>.", type: "pending" },
  { id: "title_length", title: "Title Length", desc: "Best practice: titles should be 15–70 characters.", type: "pending" },
  { id: "meta_length", title: "Meta Length", desc: "Best practice: meta descriptions should be 50–160 characters.", type: "pending" },
  { id: "alt", title: "Alt Text", desc: "All <img> tags must have descriptive alt attributes.", type: "pending" },
  { id: "canonical", title: "Canonical URL", desc: "A <link rel=\"canonical\"> should point to the preferred URL.", type: "pending" },
  { id: "viewport", title: "Viewport Meta", desc: "A viewport meta tag is required for mobile friendliness.", type: "pending" },
  { id: "lang", title: "Lang Attribute", desc: "<html lang=\"...\"> tells browsers and search engines the page language.", type: "pending" },
  { id: "charset", title: "Charset", desc: "A <meta charset=\"UTF-8\"> ensures correct text rendering.", type: "pending" },
  { id: "headings", title: "Heading Hierarchy", desc: "Headings must flow h1 → h2 → h3 with no skipped levels.", type: "pending" },
  { id: "favicon", title: "Favicon", desc: "A <link rel=\"icon\"> brands the browser tab.", type: "pending" },
  { id: "internal_link", title: "Internal Links", desc: "Pages should link to other pages on the same site.", type: "pending" },
  { id: "descriptive_links", title: "Descriptive Link Text", desc: "Anchor text like \"click here\" is bad for SEO and accessibility.", type: "pending" },
  { id: "og_title", title: "OG Title", desc: "Social preview title: meta[property=\"og:title\"]", type: "pending" },
  { id: "og_description", title: "OG Description", desc: "Social preview description: meta[property=\"og:description\"]", type: "pending" },
  { id: "og_image", title: "OG Image", desc: "Social preview image: meta[property=\"og:image\"]", type: "pending" },
  { id: "og_url", title: "OG URL", desc: "Canonical social URL: meta[property=\"og:url\"]", type: "pending" },
  { id: "og_type", title: "OG Type", desc: "Content type: meta[property=\"og:type\"] (e.g. website)", type: "pending" },
  { id: "og_locale", title: "OG Locale", desc: "Locale: meta[property=\"og:locale\"] (e.g. en_US)", type: "pending" },
  { id: "og_site_name", title: "OG Site Name", desc: "Brand name: meta[property=\"og:site_name\"]", type: "pending" },
  { id: "twitter", title: "Twitter Cards", desc: "twitter:card, twitter:title, twitter:description and twitter:image", type: "pending" },
  { id: "img_dimensions", title: "Image Dimensions", desc: "All <img> tags should have width and height attributes.", type: "pending" },
  { id: "img_lazy", title: "Lazy Loading", desc: "Below-the-fold images should use loading=\"lazy\".", type: "pending" },
  { id: "schema", title: "JSON-LD Schema", desc: "Structured data script type=\"application/ld+json\" should be present and valid.", type: "pending" },
  { id: "robots", title: "Robots Meta", desc: "Checks for presence of meta[name=\"robots\"] and indexing directives.", type: "pending" },
];

export const SEOProvider = ({ children }) => {
    const [htmlContent, setHtmlContent] = useState(INITIAL_HTML);

    const [validationResults, setValidationResults] = useState(() => {
        const results = {};
        SEED_RULES.forEach((r) => { results[r.id] = { title: r.title, desc: r.desc, type: "pending" }; });
        return results;
    });

    const n = (prev, id, type, desc) => ({
        ...prev,
        [id]: { ...prev[id], type, desc },
    });

    const validate = useCallback((content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        setValidationResults((prev) => {
            let results = { ...prev };
            const head = doc.querySelector("head");
            const body = doc.body;

            // 1. Single H1 Rule (Must be in body)
            const bodyH1s = body ? body.querySelectorAll("h1") : [];
            if (bodyH1s.length === 1) {
                results = n(results, "h1", "completed", "Primary header is present and unique.");
            } else if (bodyH1s.length === 0) {
                results = n(results, "h1", "active", "Missing <h1> tag in the document body.");
            } else {
                results = n(results, "h1", "active", "Found multiple <h1> tags. SEO requires exactly one.");
            }

            // 2. Meta Description Rule
            const metaDesc = head ? head.querySelector('meta[name="description"]') : null;
            const metaContent = metaDesc ? metaDesc.getAttribute("content") : null;
            const trimmedDesc = metaContent ? metaContent.trim() : "";

            if (metaDesc && trimmedDesc.length > 0) {
                results = n(results, "meta", "completed", "Meta description is present.");
            } else if (!metaDesc) {
                results = n(results, "meta", "active", "Missing <meta name=\"description\"> in <head>.");
            } else {
                results = n(results, "meta", "active", "Meta description content cannot be empty.");
            }

            // 2b. Meta Description Length
            if (metaDesc && trimmedDesc.length > 0) {
                if (trimmedDesc.length >= 50 && trimmedDesc.length <= 160) {
                    results = n(results, "meta_length", "completed", `Length ${trimmedDesc.length} chars — ideal range.`);
                } else if (trimmedDesc.length < 50) {
                    results = n(results, "meta_length", "active", `${trimmedDesc.length} chars — too short (aim 50–160).`);
                } else {
                    results = n(results, "meta_length", "active", `${trimmedDesc.length} chars — too long (aim 50–160).`);
                }
            } else {
                results = n(results, "meta_length", "active", "Add a meta description to check its length.");
            }

            // 3. Image Alt Rule
            const imgs = doc.querySelectorAll("img");
            const imgArray = Array.from(imgs);
            if (imgArray.length === 0) {
                results = n(results, "alt", "pending", "No images found to validate.");
            } else {
                const invalidImgs = imgArray.filter(img => !img.hasAttribute("alt") || (img.getAttribute("alt") || "").trim().length === 0);
                if (invalidImgs.length === 0) {
                    results = n(results, "alt", "completed", "All images have valid alt attributes.");
                } else {
                    results = n(results, "alt", "active", `${invalidImgs.length} image(s) missing alt text.`);
                }
            }

            // 3b. Image Dimensions
            if (imgArray.length === 0) {
                results = n(results, "img_dimensions", "pending", "No images found to validate.");
            } else {
                const missingDims = imgArray.filter(img => !img.hasAttribute("width") || !img.hasAttribute("height"));
                if (missingDims.length === 0) {
                    results = n(results, "img_dimensions", "completed", "All images declare width and height.");
                } else {
                    results = n(results, "img_dimensions", "active", `${missingDims.length} image(s) missing width/height.`);
                }
            }

            // 3c. Lazy Loading
            if (imgArray.length === 0) {
                results = n(results, "img_lazy", "pending", "No images found to validate.");
            } else {
                const notLazy = imgArray.filter(img => !img.hasAttribute("loading"));
                if (notLazy.length === 0) {
                    results = n(results, "img_lazy", "completed", "All images declare a loading strategy.");
                } else {
                    results = n(results, "img_lazy", "active", `${notLazy.length} image(s) missing loading attribute.`);
                }
            }

            // 4. Title tag
            const titleTag = head ? head.querySelector("title") : null;
            const titleText = titleTag ? titleTag.textContent : null;
            if (titleTag && titleText && titleText.trim().length > 0) {
                results = n(results, "title", "completed", "Title is present and non-empty.");
            } else {
                results = n(results, "title", "active", "Missing or empty <title> element in <head>.");
            }

            // 4b. Title length
            if (titleTag && titleText && titleText.trim().length > 0) {
                const len = titleText.trim().length;
                if (len >= 15 && len <= 70) {
                    results = n(results, "title_length", "completed", `Length ${len} chars — ideal range.`);
                } else if (len < 15) {
                    results = n(results, "title_length", "active", `${len} chars — too short (aim 15–70).`);
                } else {
                    results = n(results, "title_length", "active", `${len} chars — too long (aim 15–70).`);
                }
            } else {
                results = n(results, "title_length", "active", "Add a title to check its length.");
            }

            // 5. Canonical link
            const canonicalLink = head ? head.querySelector('link[rel="canonical"]') : null;
            const canonicalHref = canonicalLink ? canonicalLink.getAttribute("href") : null;
            if (canonicalLink && canonicalHref && canonicalHref.trim().length > 0) {
                results = n(results, "canonical", "completed", "Canonical link found.");
            } else {
                results = n(results, "canonical", "active", "Missing or empty canonical <link> in <head>.");
            }

            // 6. Viewport
            const viewportMeta = head ? head.querySelector('meta[name="viewport"]') : null;
            if (viewportMeta) {
                results = n(results, "viewport", "completed", "Viewport meta tag present.");
            } else {
                results = n(results, "viewport", "active", "Missing <meta name=\"viewport\"> for mobile support.");
            }

            // 7. Lang attribute
            const htmlEl = doc.documentElement;
            const langAttr = htmlEl ? htmlEl.getAttribute("lang") : null;
            if (langAttr && langAttr.trim().length > 0) {
                results = n(results, "lang", "completed", `<html lang="${langAttr.trim()}"> present.`);
            } else {
                results = n(results, "lang", "active", "Missing or empty lang attribute on <html>.");
            }

            // 8. Charset
            const charsetMeta = head ? head.querySelector("meta[charset]") : null;
            if (charsetMeta) {
                results = n(results, "charset", "completed", "Charset meta tag present.");
            } else {
                results = n(results, "charset", "active", "Missing <meta charset> — add <meta charset=\"UTF-8\">.");
            }

            // 9. Heading hierarchy
            const headingTags = body ? body.querySelectorAll("h1, h2, h3, h4, h5, h6") : [];
            let levels = [];
            headingTags.forEach((el) => levels.push(parseInt(el.tagName[1], 10)));
            let starting = levels.length ? levels[0] : 0;
            let hierarchyOK = true;
            let issue = "";
            if (levels.length === 0) {
                hierarchyOK = false;
                issue = "No headings found.";
            } else if (starting !== 1) {
                hierarchyOK = false;
                issue = "Document must start with an <h1>.";
            } else {
                for (let i = 1; i < levels.length; i++) {
                    if (levels[i] > levels[i - 1] + 1) {
                        hierarchyOK = false;
                        issue = `Skipped heading level: h${levels[i - 1]} → h${levels[i]}.`;
                        break;
                    }
                }
            }
            if (hierarchyOK) {
                results = n(results, "headings", "completed", "Heading hierarchy is clean.");
            } else {
                results = n(results, "headings", "active", issue);
            }

            // 10. Favicon
            const favicon = head
                ? head.querySelector('link[rel~="icon"], link[rel="shortcut icon"]')
                : null;
            if (favicon && favicon.getAttribute("href")) {
                results = n(results, "favicon", "completed", "Favicon link found.");
            } else {
                results = n(results, "favicon", "active", "Missing <link rel=\"icon\"> in <head>.");
            }

            // 11. Internal links + descriptive text
            const anchors = doc.querySelectorAll("a[href]");
            const linkText = (el) => (el.textContent || "").trim();
            if (anchors.length === 0) {
                results = n(results, "internal_link", "active", "No links found — add at least one internal link.");
                results = n(results, "descriptive_links", "active", "No links found to evaluate.");
            } else {
                const internal = Array.from(anchors).filter((a) => {
                    const href = a.getAttribute("href") || "";
                    if (/^(https?:)?\/\//i.test(href)) {
                        try {
                            return new URL(href, window.location.origin).origin === window.location.origin;
                        } catch {
                            return false;
                        }
                    }
                    if (href.startsWith("#") || /^[a-z]+:/i.test(href)) return false;
                    return href.startsWith("/") || href.startsWith("./") || href.trim().length > 0;
                });
                if (internal.length > 0) {
                    results = n(results, "internal_link", "completed", `${internal.length} internal link(s) found.`);
                } else {
                    results = n(results, "internal_link", "active", "Add at least one link to another page on your site.");
                }

                const generic = ["click here", "here", "read more", "learn more", "link"];
                const badLinks = Array.from(anchors).filter((a) => {
                    const text = linkText(a).toLowerCase();
                    return text === "" || generic.includes(text);
                });
                if (badLinks.length === 0) {
                    results = n(results, "descriptive_links", "completed", "All anchor text is descriptive.");
                } else {
                    results = n(results, "descriptive_links", "active", `${badLinks.length} link(s) using generic text like "click here".`);
                }
            }

            // 12-16. Open Graph
            const og = (prop) => {
                const el = head ? head.querySelector(`meta[property="${prop}"]`) : null;
                const value = el ? el.getAttribute("content") : null;
                return value && value.trim().length > 0 ? value.trim() : null;
            };
            const ogRules = [
                ["og_title", "OG title"],
                ["og_description", "OG description"],
                ["og_image", "OG image"],
                ["og_url", "OG URL"],
                ["og_type", "OG type"],
                ["og_locale", "OG locale"],
                ["og_site_name", "OG site name"],
            ];
            ogRules.forEach(([id, label]) => {
                const value = og(id);
                if (value) {
                    results = n(results, id, "completed", `${label} present.`);
                } else {
                    results = n(results, id, "active", `Missing or empty ${label}.`);
                }
            });

            // 17. Twitter Cards
            const tw = (name) => {
                const el = head ? head.querySelector(`meta[name="${name}"]`) : null;
                const value = el ? el.getAttribute("content") : null;
                return value && value.trim().length > 0 ? value.trim() : null;
            };
            const card = tw("twitter:card");
            if (card) {
                const tTitle = tw("twitter:title");
                const tDesc = tw("twitter:description");
                const tImg = tw("twitter:image");
                if (tTitle && tDesc && tImg) {
                    results = n(results, "twitter", "completed", "twitter:card, twitter:title, twitter:description and twitter:image present.");
                } else {
                    const missing = [];
                    if (!tTitle) missing.push("twitter:title");
                    if (!tDesc) missing.push("twitter:description");
                    if (!tImg) missing.push("twitter:image");
                    results = n(results, "twitter", "active", `Missing: ${missing.join(", ")}.`);
                }
            } else {
                results = n(results, "twitter", "active", "Add <meta name=\"twitter:card\" content=\"summary_large_image\"> plus title/description/image.");
            }

            // 18. JSON-LD Schema
            const ld = head ? head.querySelector('script[type="application/ld+json"]') : null;
            if (ld && ld.textContent && ld.textContent.trim().length > 0) {
                try {
                    JSON.parse(ld.textContent);
                    results = n(results, "schema", "completed", "Valid JSON-LD schema found.");
                } catch (err) {
                    results = n(results, "schema", "active", "Found JSON-LD but it's invalid JSON.");
                }
            } else {
                results = n(results, "schema", "active", "Missing JSON-LD <script type=\"application/ld+json\">.");
            }

            // 19. Robots meta
            const robots = head ? head.querySelector('meta[name="robots"]') : null;
            if (robots && robots.getAttribute("content")) {
                const content = robots.getAttribute("content").toLowerCase();
                if (content.includes("noindex")) {
                    results = n(results, "robots", "active", "Robots set to noindex (page will not be indexed).");
                } else {
                    results = n(results, "robots", "completed", `Robots meta present: ${robots.getAttribute("content")}`);
                }
            } else {
                results = n(results, "robots", "pending", "No robots meta tag found. Default crawling rules apply.");
            }

            return results;
        });
    }, []);

    useEffect(() => {
        validate(htmlContent);
    }, [htmlContent, validate]);

    return (
        <SEOContext.Provider value={{ htmlContent, setHtmlContent, validationResults }}>
            {children}
        </SEOContext.Provider>
    );
};

export const useSEO = () => {
    const context = useContext(SEOContext);
    if (!context) {
        throw new Error("useSEO must be used within an SEOProvider");
    }
    return context;
};