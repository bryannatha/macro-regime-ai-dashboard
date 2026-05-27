import type { AssetPlaybook, Regime } from "@/lib/types";

const playbooks: Record<Regime, Omit<AssetPlaybook, "regime">> = {
  Goldilocks: {
    thesis: "Stable inflation and contained stress support balanced risk taking.",
    favor: ["Global equities", "Investment-grade credit", "IDR carry"],
    reduce: ["Cash overweights", "Deep downside hedges"],
    neutral: ["Gold", "BTC", "Long duration"],
  },
  "Liquidity Reflation": {
    thesis: "Improving liquidity and healthy risk appetite support liquid growth assets.",
    favor: ["BTC", "Nasdaq / growth equities", "Gold"],
    reduce: ["USD cash", "Short-vol defensives"],
    neutral: ["Oil", "IDR carry", "Treasury duration"],
  },
  "Commodity Inflation": {
    thesis: "Input costs are accelerating, rewarding real assets while pressuring importers.",
    favor: ["Energy equities", "Oil", "Gold"],
    reduce: ["Long duration", "Import-sensitive FX", "Rate-sensitive growth"],
    neutral: ["BTC", "Broad USD"],
  },
  Stagflation: {
    thesis: "Slowing activity alongside sticky inflation calls for resilience and hedges.",
    favor: ["Gold", "Commodity producers", "Inflation-linked bonds"],
    reduce: ["High-yield credit", "Long duration", "Cyclical equities"],
    neutral: ["BTC", "USD cash"],
  },
  "Hard Landing": {
    thesis: "Growth and credit deterioration favor preservation of capital and quality duration.",
    favor: ["Treasuries", "USD cash", "Quality defensives"],
    reduce: ["High-yield credit", "Cyclical equities", "Levered crypto beta"],
    neutral: ["Gold", "Oil"],
  },
  "Fiat Debasement": {
    thesis: "Broad monetary hedge demand rewards scarce, non-sovereign stores of value.",
    favor: ["Gold", "BTC", "Commodity basket"],
    reduce: ["Long-term nominal bonds", "Unhedged fiat cash"],
    neutral: ["Quality equities", "Oil", "IDR carry"],
  },
};

export function getPlaybook(regime: Regime): AssetPlaybook {
  return {
    regime,
    ...playbooks[regime],
  };
}
