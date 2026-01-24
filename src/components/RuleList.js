import RuleItem from "./RuleItem";

export default function RuleList({ rules = [] }) {
  if (!rules || rules.length === 0) {
    return <div className="p-4 text-sm text-[#617589]">No rules configured for this lesson.</div>;
  }

  return (
    <div className="space-y-3">
      {rules.map((r) => (
        <RuleItem key={r.id} {...r} />
      ))}
    </div>
  );
}
