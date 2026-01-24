import React, { useState } from "react";
import MetaPreview from "./MetaPreview";
import OGPreview from "./OGPreview";
import SchemaPreview from "./SchemaPreview";
import RobotsPreview from "./RobotsPreview";

const TABS = [
  { id: "meta", label: "Search" },
  { id: "og", label: "Social" },
  { id: "schema", label: "Schema" },
  { id: "robots", label: "Robots" },
];

export default function PreviewPane() {
  const [active, setActive] = useState("meta");

  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex gap-2 mb-3">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} className={`text-xs font-semibold px-2 py-1 rounded ${active === t.id ? "bg-primary/10 text-primary" : "text-[#617589]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {active === "meta" && <MetaPreview />}
        {active === "og" && <OGPreview />}
        {active === "schema" && <SchemaPreview />}
        {active === "robots" && <RobotsPreview />}
      </div>
    </div>
  );
}
