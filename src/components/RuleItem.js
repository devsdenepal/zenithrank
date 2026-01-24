import { CheckCircle, Info, Clock, ArrowRight } from "lucide-react";

export default function RuleItem({ id, title, desc, type, hint }) {
  const configs = {
    completed: { icon: CheckCircle, color: "text-green-500", container: "p-3 rounded-xl border border-green-100 bg-green-50/50 dark:bg-green-900/10 dark:border-green-900/30 flex items-start gap-3" },
    active: { icon: Info, color: "text-primary", container: "p-3 rounded-xl border-2 border-primary bg-primary/5 flex items-start gap-3" },
    pending: { icon: Clock, color: "text-gray-400", container: "p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-background-dark flex items-start gap-3 opacity-60" },
  };

  const config = configs[type] || configs.pending;
  const Icon = config.icon;

  return (
    <div className={config.container} aria-live="polite">
      <Icon className={`size-4 shrink-0 mt-0.5 ${config.color}`} />
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-[#111418] dark:text-white leading-none mb-1">{title}</p>
        <p className="text-xs text-[#617589] dark:text-gray-400">{desc}</p>
        {type === "active" && hint && (
          <button className="mt-2 text-xs font-bold text-primary flex items-center gap-1">
            {hint} <ArrowRight className="size-3" />
          </button>
        )}
      </div>
    </div>
  );
}
