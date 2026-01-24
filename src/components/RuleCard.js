// Deprecated: kept for backwards compatibility. Use RuleItem and RuleList instead.
export default function RuleCard(props) {
  // temporary passthrough to preserve existing import sites
  const { default: RuleItem } = require("./RuleItem");
  return RuleItem(props);
}
