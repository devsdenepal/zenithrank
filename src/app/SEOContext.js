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
    <h1>Welcome to EcoGarden</h1>
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
        alt: { title: "Alt Text", desc: "All <img> tags must have descriptive alt attributes.", type: "pending" },
        canonical: { title: "Canonical URL", desc: "Not checked yet.", type: "pending" },
        mobile: { title: "Mobile Friendly", desc: "Viewport meta tag validation.", type: "pending" },
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

            // Persistence: If any of the above were completed and are no longer valid, they revert to active/pending via logic above.
            // Canonical & Mobile remain pending as per current scope.

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

