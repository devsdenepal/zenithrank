import React from "react";
import { useSEO } from "../../app/SEOContext";

export default function MetaPreview() {
  const { htmlContent } = useSEO();
  if (!htmlContent) return null;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const head = doc.querySelector("head");
    const title = head ? (head.querySelector("title") ? head.querySelector("title").textContent : "") : "";
    const metaDesc = head ? (head.querySelector('meta[name="description"]') ? head.querySelector('meta[name="description"]').getAttribute("content") : "") : "";

    return (
      <div className="p-3 border rounded-lg bg-white dark:bg-background-dark">
        <p className="text-xs text-[#617589]">Search Result Preview</p>
        <div className="mt-2">
          <div className="text-sm font-semibold text-primary">{title || "(No title)"}</div>
          <div className="text-xs text-[#617589] mt-1">{metaDesc || "(No description)"}</div>
        </div>
      </div>
    );
  } catch (e) {
    return null;
  }
}
