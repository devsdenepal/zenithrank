import React from "react";
import { useSEO } from "../../app/SEOContext";

export default function RobotsPreview() {
  const { htmlContent } = useSEO();
  if (!htmlContent) return null;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const head = doc.querySelector("head");
    const robots = head ? head.querySelector('meta[name="robots"]') : null;
    const content = robots ? robots.getAttribute("content") : null;

    return (
      <div className="p-3 border rounded-lg bg-white dark:bg-background-dark">
        <p className="text-xs text-[#617589]">Robots</p>
        <div className="mt-2 text-sm">{content ? content : "(No robots meta)"}</div>
      </div>
    );
  } catch (e) {
    return null;
  }
}
