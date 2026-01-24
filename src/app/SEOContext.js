"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const SEOContext = createContext();

const INITIAL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>EcoGarden | Sustainable Living Supplies</title>
</head>
<body>
    <p>Discover sustainable solutions for your urban oasis.</p>
    <img src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800" alt="Lush Garden">
    <button>Shop Now</button>
</body>
</html>`;

export const SEOProvider = ({ children }) => {
    const [htmlContent, setHtmlContent] = useState(INITIAL_HTML);

    const [validationResults, setValidationResults] = useState({
        h1: { title: "H1 Tag", desc: "Exactly one <h1> must exist in the body.", type: "pending" },
        meta: { title: "Meta Description", desc: "A non-empty meta description must exist in the <head>.", type: "pending" },
        title: { title: "Title Tag", desc: "A concise <title> element should exist in the <head>.", type: "pending" },
        alt: { title: "Alt Text", desc: "All <img> tags must have descriptive alt attributes.", type: "pending" },
        canonical: { title: "Canonical URL", desc: "A <link rel=\"canonical\"> should point to the preferred URL.", type: "pending" },
        viewport: { title: "Viewport Meta", desc: "A viewport meta tag is required for mobile friendliness.", type: "pending" },
        og_title: { title: "OG Title", desc: "Social preview title: meta[property=\"og:title\"]", type: "pending" },
        og_description: { title: "OG Description", desc: "Social preview description: meta[property=\"og:description\"]", type: "pending" },
        og_image: { title: "OG Image", desc: "Social preview image: meta[property=\"og:image\"]", type: "pending" },
        schema: { title: "JSON-LD Schema", desc: "Structured data script type=\"application/ld+json\" should be present and valid.", type: "pending" },
        robots: { title: "Robots Meta", desc: "Checks for presence of meta[name=\"robots\"] and indexing directives.", type: "pending" },
    });

    const validate = useCallback((content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        setValidationResults((prev) => {
            const results = { ...prev };

            // 1. Single H1 Rule (Must be in body)
            const bodyH1s = doc.body ? doc.body.querySelectorAll("h1") : [];
            if (bodyH1s.length === 1) {
                results.h1 = { ...results.h1, type: "completed", desc: "Primary header is present and unique." };
            } else if (bodyH1s.length === 0) {
                results.h1 = { ...results.h1, type: "active", desc: "Missing <h1> tag in the document body." };
            } else {
                results.h1 = { ...results.h1, type: "active", desc: "Found multiple <h1> tags. SEO requires exactly one." };
            }

            // 2. Meta Description Rule (In head, non-empty)
            const head = doc.querySelector("head");
            const metaDesc = head ? head.querySelector('meta[name="description"]') : null;
            const metaContent = metaDesc ? metaDesc.getAttribute("content") : null;

            if (metaDesc && metaContent && metaContent.trim().length > 0) {
                results.meta = { ...results.meta, type: "completed", desc: "Meta description is optimized." };
            } else if (!metaDesc) {
                results.meta = { ...results.meta, type: "active", desc: "Missing <meta name=\"description\"> in <head>." };
            } else {
                results.meta = { ...results.meta, type: "active", desc: "Meta description content cannot be empty." };
            }

            // 3. Image Alt Rule (All images must have non-empty alt)
            const imgs = doc.querySelectorAll("img");
            const imgArray = Array.from(imgs);

            if (imgArray.length === 0) {
                results.alt = { ...results.alt, type: "pending", desc: "No images found to validate." };
            } else {
                const invalidImgs = imgArray.filter(img => !img.hasAttribute("alt") || img.getAttribute("alt").trim().length === 0);
                if (invalidImgs.length === 0) {
                    results.alt = { ...results.alt, type: "completed", desc: "All images have valid alt attributes." };
                } else {
                    results.alt = { ...results.alt, type: "active", desc: `${invalidImgs.length} image(s) missing alt text.` };
                }
            }

            // 4. Title tag (head)
            const titleTag = head ? head.querySelector("title") : null;
            const titleText = titleTag ? titleTag.textContent : null;
            if (titleTag && titleText && titleText.trim().length > 0) {
                results.title = { ...results.title, type: "completed", desc: "Title is present and non-empty." };
            } else {
                results.title = { ...results.title, type: "active", desc: "Missing or empty <title> element in <head>." };
            }

            // 5. Canonical link
            const canonicalLink = head ? head.querySelector('link[rel="canonical"]') : null;
            const canonicalHref = canonicalLink ? canonicalLink.getAttribute("href") : null;
            if (canonicalLink && canonicalHref && canonicalHref.trim().length > 0) {
                results.canonical = { ...results.canonical, type: "completed", desc: "Canonical link found." };
            } else {
                results.canonical = { ...results.canonical, type: "active", desc: "Missing or empty canonical <link> in <head>." };
            }

            // 6. Viewport
            const viewportMeta = head ? head.querySelector('meta[name="viewport"]') : null;
            if (viewportMeta) {
                results.viewport = { ...results.viewport, type: "completed", desc: "Viewport meta tag present." };
            } else {
                results.viewport = { ...results.viewport, type: "active", desc: "Missing <meta name=\"viewport\"> for mobile support." };
            }

            // 7. Open Graph (og:title, og:description, og:image)
            const ogTitle = head ? head.querySelector('meta[property="og:title"]') : null;
            const ogDesc = head ? head.querySelector('meta[property="og:description"]') : null;
            const ogImage = head ? head.querySelector('meta[property="og:image"]') : null;

            if (ogTitle && ogTitle.getAttribute("content") && ogTitle.getAttribute("content").trim().length > 0) {
                results.og_title = { ...results.og_title, type: "completed", desc: "OG title present." };
            } else {
                results.og_title = { ...results.og_title, type: "active", desc: "Missing or empty meta[property=\"og:title\"]." };
            }

            if (ogDesc && ogDesc.getAttribute("content") && ogDesc.getAttribute("content").trim().length > 0) {
                results.og_description = { ...results.og_description, type: "completed", desc: "OG description present." };
            } else {
                results.og_description = { ...results.og_description, type: "active", desc: "Missing or empty meta[property=\"og:description\"]." };
            }

            if (ogImage && ogImage.getAttribute("content") && ogImage.getAttribute("content").trim().length > 0) {
                results.og_image = { ...results.og_image, type: "completed", desc: "OG image present." };
            } else {
                results.og_image = { ...results.og_image, type: "active", desc: "Missing or empty meta[property=\"og:image\"]." };
            }

            // 8. JSON-LD Schema
            const ld = head ? head.querySelector('script[type="application/ld+json"]') : null;
            if (ld && ld.textContent && ld.textContent.trim().length > 0) {
                try {
                    JSON.parse(ld.textContent);
                    results.schema = { ...results.schema, type: "completed", desc: "Valid JSON-LD schema found." };
                } catch (err) {
                    results.schema = { ...results.schema, type: "active", desc: "Found JSON-LD but it's invalid JSON." };
                }
            } else {
                results.schema = { ...results.schema, type: "active", desc: "Missing JSON-LD <script type=\"application/ld+json\">." };
            }

            // 9. Robots meta
            const robots = head ? head.querySelector('meta[name="robots"]') : null;
            if (robots && robots.getAttribute("content")) {
                const content = robots.getAttribute("content").toLowerCase();
                if (content.includes("noindex")) {
                    results.robots = { ...results.robots, type: "active", desc: "Robots set to noindex (page will not be indexed)." };
                } else {
                    results.robots = { ...results.robots, type: "completed", desc: `Robots meta present: ${robots.getAttribute("content")}` };
                }
            } else {
                results.robots = { ...results.robots, type: "pending", desc: "No robots meta tag found. Default crawling rules apply." };
            }

            // Persistence: earlier checks already updated h1/meta/alt states.

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

