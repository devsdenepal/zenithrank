import React from "react";
import { useSEO } from "../../app/SEOContext";

export default function OGPreview() {
  const { htmlContent } = useSEO();
  if (!htmlContent) return null;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const head = doc.querySelector("head");
    const ogTitle = head ? (head.querySelector('meta[property="og:title"]') ? head.querySelector('meta[property="og:title"]').getAttribute("content") : "") : "";
    const ogDesc = head ? (head.querySelector('meta[property="og:description"]') ? head.querySelector('meta[property="og:description"]').getAttribute("content") : "") : "";
    const ogImage = head ? (head.querySelector('meta[property="og:image"]') ? head.querySelector('meta[property="og:image"]').getAttribute("content") : "") : "";

    return (
      <div className="p-3 border rounded-lg bg-white dark:bg-background-dark flex gap-3">
        <div className="w-20 h-14 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
          {ogImage ? <img src={ogImage} alt="OG" className="object-cover w-full h-full" /> : <div className="text-xs text-[#617589]">No image</div>}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{ogTitle || "(No OG title)"}</div>
          <div className="text-xs text-[#617589] mt-1">{ogDesc || "(No OG description)"}</div>
        </div>
      </div>
    );
  } catch (e) {
    return null;
  }
}
