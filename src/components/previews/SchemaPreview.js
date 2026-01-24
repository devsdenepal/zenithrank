import React from "react";
import { useSEO } from "../../app/SEOContext";

const PROPS = [
  { key: "@type", candidates: ["@type", "type"] },
  { key: "name", candidates: ["name", "headline"] },
  { key: "description", candidates: ["description", "abstract"] },
  { key: "image", candidates: ["image", "imageObject", "thumbnailUrl"] },
  { key: "url", candidates: ["url", "@id", "mainEntityOfPage", "sameAs"] },
  { key: "@id", candidates: ["@id", "id"] },
];

function pickReadable(val) {
  if (val == null) return null;
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) return val.map(v => pickReadable(v)).filter(Boolean).join(", ");
  // object: prefer common identity fields
  const candidates = ["url", "@id", "id", "name", "@type", "type"];
  for (const c of candidates) {
    if (Object.prototype.hasOwnProperty.call(val, c) && val[c]) return pickReadable(val[c]);
  }
  // fallback to JSON snippet
  try {
    return JSON.stringify(val);
  } catch (e) {
    return String(val);
  }
}

function analyzeSchema(obj) {
  const found = {};

  // If the schema uses @graph, use the first graph node as the target
  if (obj && obj['@graph'] && Array.isArray(obj['@graph']) && obj['@graph'].length > 0) {
    obj = obj['@graph'][0];
  }

  function findCandidateValue(o, candidates) {
    for (const c of candidates) {
      if (Object.prototype.hasOwnProperty.call(o, c) && o[c] !== undefined) return { key: c, value: o[c] };
    }
    return { key: null, value: undefined };
  }

  PROPS.forEach((spec) => {
    let result = findCandidateValue(obj, spec.candidates);
    let val = result.value;
    // special-case: if candidate is mainEntityOfPage it may be an object with '@id'
    if (spec.key === 'url' && val && typeof val === 'object') {
      const id = val['@id'] || val.id || val.url;
      if (id) {
        result = { key: Object.keys(val).find(k => ['@id','id','url'].includes(k)) || spec.candidates[0], value: id };
        val = result.value;
      }
    }

    const readable = pickReadable(val);
    if (readable === null || readable === undefined || (typeof readable === "string" && readable.trim() === "")) {
      found[spec.key] = { ok: false, value: null, foundKey: result.key };
    } else {
      found[spec.key] = { ok: true, value: readable, foundKey: result.key };
    }
  });

  return found;
}

export default function SchemaPreview() {
  const { htmlContent } = useSEO();
  if (!htmlContent) return null;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const head = doc.querySelector("head");
    const ld = head ? head.querySelector('script[type="application/ld+json"]') : null;
    const jsonText = ld ? ld.textContent.trim() : null;
    let pretty = null;
    let analysis = null;
    if (jsonText) {
      try {
        let parsed = null;
        try {
          parsed = JSON.parse(jsonText);
        } catch (err) {
          // Try a forgiving fallback: collapse newlines and excessive whitespace (helps fix
          // cases where strings were split across lines in the editor).
          try {
            const compact = jsonText.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
            parsed = JSON.parse(compact);
          } catch (err2) {
            parsed = null;
          }
        }

        if (parsed) {
          // support arrays or single objects - analyze first object if array
          const target = Array.isArray(parsed) ? parsed[0] : parsed;
          pretty = JSON.stringify(parsed, null, 2);
          analysis = analyzeSchema(target || {});
        } else {
          pretty = jsonText;
        }
      } catch (e) {
        pretty = jsonText;
      }
    }

    return (
      <div className="p-3 border rounded-lg bg-white dark:bg-background-dark">
        <p className="text-xs text-[#617589]">Structured Data (JSON-LD)</p>

        {analysis ? (
          <div className="mt-2 space-y-2">
            {PROPS.map((spec) => {
              const entry = analysis[spec.key];
              return (
                <div key={spec.key} className="flex items-start gap-2">
                  <div className={entry && entry.ok ? "text-green-500" : "text-yellow-500"}>
                    {entry && entry.ok ? "✓" : "—"}
                  </div>
                  <div className="text-xs text-[#617589]">
                    <strong className="text-sm text-[#111418] dark:text-white">{spec.key}</strong>
                    {entry && entry.foundKey ? (
                      <span className="ml-2 text-[11px] text-[#94a3b8]">matched: {entry.foundKey}</span>
                    ) : null}
                    : {entry && entry.ok ? entry.value : "(missing)"}
                  </div>
                </div>
              );
            })}
            <pre className="mt-2 text-[11px] text-[#263238] dark:text-gray-200 overflow-auto max-h-44 bg-gray-50 dark:bg-gray-800 p-2 rounded">{pretty || "(No JSON-LD detected)"}</pre>
          </div>
        ) : (
          <pre className="mt-2 text-[11px] text-[#263238] dark:text-gray-200 overflow-auto max-h-44 bg-gray-50 dark:bg-gray-800 p-2 rounded">{pretty || "(No JSON-LD detected)"}</pre>
        )}
      </div>
    );
  } catch (e) {
    return null;
  }
}
