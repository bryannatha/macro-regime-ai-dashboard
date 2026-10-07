# CURRENT / REVISED-HISTORY DIAGNOSTIC

Generated: 2026-10-06T16:15:16.786Z
Status: **COMPLETE**
Methodology: US-MACRO-0.3
Requested monthly snapshots: 2015-01 through 2025-12
Warm-up period: 2013-11 through 2014-12 (14 months)

> Current revised historical values and current seasonal factors are not point-in-time vintages. This diagnostic does not claim true vintage validation or point-in-time performance.

Revised-history observations retain their actual source release and retrieval timestamps. Historical alignment uses the observation period only; it does not claim that the value or seasonal adjustment was known at that time.

## Source Gaps

- federal-reserve-h41-liquidity: H.4.1 Table 5 total assets are Wednesday-only; the approved balance-sheet proxy requires a weekly-average total-assets input.
- growth.housing: No admitted source is registered for this configured family (The approved housing source family has not been implemented.)
- creditConditions.bankVolume: A required family input is unavailable or invalid.
- growth.housing: Eligible primary-slot coverage is below the 60% family floor.
- labor.claims: A required family input is unavailable or invalid.
- liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid.
- 2025-10: CPI core YoY window is NOT EVALUATED; exact index endpoint(s) unavailable: 2025-10-01.
- inflation anchor has 50% coverage and 1/2 eligible families (cpi: A required family input is unavailable or invalid.).
- inflation.cpi: A required family input is unavailable or invalid.
- labor.householdLabor: A required family input is unavailable or invalid.

## Episode Review

- 2017-2019 expansion (2017-01 to 2019-12): 36/36 snapshots evaluated; 0 NOT EVALUATED; manual review still required.
- 2020 shock and rebound (2020-01 to 2020-12): 12/12 snapshots evaluated; 0 NOT EVALUATED; manual review still required.
- 2021 reflation (2021-01 to 2021-12): 12/12 snapshots evaluated; 0 NOT EVALUATED; manual review still required.
- 2022 inflation and tightening (2022-01 to 2022-12): 12/12 snapshots evaluated; 0 NOT EVALUATED; manual review still required.
- 2023-2024 disinflation and soft landing (2023-01 to 2024-12): 24/24 snapshots evaluated; 0 NOT EVALUATED; manual review still required.
- 2025 mixed episodes (2025-01 to 2025-12): 11/12 snapshots evaluated; 1 NOT EVALUATED; manual review still required.

## Regime Episodes

| Regime | Start | End | Months |
| --- | --- | --- | ---: |
| MIXED | 2015-04 | 2015-06 | 3 |
| MIXED | 2016-03 | 2016-05 | 3 |
| MIXED | 2017-02 | 2017-02 | 1 |
| MIXED | 2017-08 | 2017-08 | 1 |
| MIXED | 2017-10 | 2017-12 | 3 |
| MIXED | 2018-02 | 2018-03 | 2 |
| MIXED | 2018-11 | 2019-01 | 3 |
| MIXED | 2019-08 | 2019-08 | 1 |
| MIXED | 2020-02 | 2020-02 | 1 |
| CONTRACTION_RECESSIONARY | 2020-04 | 2020-06 | 3 |
| MIXED | 2020-07 | 2020-09 | 3 |
| MIXED | 2021-02 | 2021-03 | 2 |
| INFLATIONARY_EXPANSION | 2021-04 | 2021-12 | 9 |
| MIXED | 2022-03 | 2022-03 | 1 |
| INFLATIONARY_EXPANSION | 2022-05 | 2022-06 | 2 |
| INFLATIONARY_EXPANSION | 2022-09 | 2022-11 | 3 |
| INFLATIONARY_EXPANSION | 2023-02 | 2023-11 | 10 |
| MIXED | 2023-12 | 2023-12 | 1 |
| MIXED | 2024-05 | 2025-02 | 10 |
| MIXED | 2025-06 | 2025-09 | 4 |

## Investigation Flags

| Flag | Start | End | Months | Details |
| --- | --- | --- | ---: | --- |
| PROLONGED_MIXED_NO_ENVELOPE | 2024-05 | 2025-02 | 10 | MIXED/no-envelope persisted for 10 consecutive months. |
| THRESHOLD_SENSITIVE | 2021-02 | 2021-02 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 100, coherent-cutoff agreement 100. |
| THRESHOLD_SENSITIVE | 2022-03 | 2022-03 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2022-06 | 2022-06 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2022-09 | 2022-09 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2023-06 | 2023-06 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 93.75, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2023-07 | 2023-07 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2023-08 | 2023-08 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2023-09 | 2023-09 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2023-10 | 2023-10 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 93.75, coherent-cutoff agreement 0. |
| THRESHOLD_SENSITIVE | 2023-11 | 2023-11 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2023-12 | 2023-12 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2024-06 | 2024-06 | 1 | Threshold sensitivity is MODERATELY_SENSITIVE; single-cutoff agreement 96.875, coherent-cutoff agreement 100. |
| THRESHOLD_SENSITIVE | 2024-07 | 2024-07 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2024-08 | 2024-08 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2024-09 | 2024-09 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2024-10 | 2024-10 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2024-11 | 2024-11 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2024-12 | 2024-12 | 1 | Threshold sensitivity is MODERATELY_SENSITIVE; single-cutoff agreement 96.875, coherent-cutoff agreement 100. |
| THRESHOLD_SENSITIVE | 2025-01 | 2025-01 | 1 | Threshold sensitivity is MODERATELY_SENSITIVE; single-cutoff agreement 96.875, coherent-cutoff agreement 100. |
| THRESHOLD_SENSITIVE | 2025-02 | 2025-02 | 1 | Threshold sensitivity is MODERATELY_SENSITIVE; single-cutoff agreement 96.875, coherent-cutoff agreement 100. |
| THRESHOLD_SENSITIVE | 2025-06 | 2025-06 | 1 | Threshold sensitivity is MODERATELY_SENSITIVE; single-cutoff agreement 96.875, coherent-cutoff agreement 100. |
| THRESHOLD_SENSITIVE | 2025-07 | 2025-07 | 1 | Threshold sensitivity is MODERATELY_SENSITIVE; single-cutoff agreement 96.875, coherent-cutoff agreement 100. |
| THRESHOLD_SENSITIVE | 2025-08 | 2025-08 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |
| THRESHOLD_SENSITIVE | 2025-09 | 2025-09 | 1 | Threshold sensitivity is FRAGILE; single-cutoff agreement 96.875, coherent-cutoff agreement 50. |

## Historical Validation Review

This reviewer summary interprets the diagnostic snapshots; it does not retune thresholds or claim point-in-time validation.

- 132 monthly snapshots were generated. 131 are `PROVISIONAL`; October 2025 is `INSUFFICIENT_DATA` and `NOT_EVALUATED`. No snapshot is `NORMAL`.
- Label counts: 66 snapshots have no resolved label, 39 are `MIXED`, 24 are `INFLATIONARY_EXPANSION`, and 3 are `CONTRACTION_RECESSIONARY`.
- Adjacent resolved-label transitions, counting entry to or exit from `MIXED`, are 1 in 2020, 1 in 2021, and 1 in 2023; 0 in other years. There are no adjacent direct transitions between two different named regimes.
- Longest `MIXED` run: 10 months, 2024-05 through 2025-02. A second 4-month run is 2025-06 through 2025-09. No missing month is converted to `MIXED`.
- Threshold sensitivity across the 66 snapshots with sensitivity results: 42 `ROBUST`, 6 `MODERATELY_SENSITIVE`, and 18 `FRAGILE`.

| Inspection window | Data Quality range | Regime Clarity range (available snapshots) |
| --- | ---: | ---: |
| 2017-2019 | 58-60 | 78-78 (11 of 36) |
| 2020 | 60-60 | 67-93 (7 of 12) |
| 2021 | 60-61 | 49-98 (11 of 12) |
| 2022 | 61-61 | 49-94 (6 of 12) |
| 2023-2024 | 61-62 | 48-96 (19 of 24) |
| 2025 | 57-62 | 49-69 (6 of 12) |

Data Quality ranges from 56 to 62 over the full 2015-2025 calendar. The low-to-moderate values reflect documented history and release-metadata limits; they should not be read as model confidence. Clarity is null for snapshots without a resolved regime.

### Factor Score Contributions

The table reports the arithmetic mean factor stress score and mean coverage by window; it is not a weighted decomposition of any particular regime verdict. A dash means the factor was not scoreable.

| Window | Inflation | Growth | Labor | Policy/Rates | Credit | Liquidity |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2017-2019 | 24.4 / 1.00 | 27.5 / 0.875 | 27.1 / 0.75 | 32.8 / 1.00 | 30.6 / 0.70 | - / 0.50 |
| 2020 | 16.9 / 1.00 | 47.2 / 0.875 | 59.7 / 0.75 | 11.4 / 1.00 | 49.9 / 0.70 | - / 0.50 |
| 2021 | 60.1 / 1.00 | 17.7 / 0.875 | 22.6 / 0.75 | 1.6 / 1.00 | 26.6 / 0.70 | - / 0.50 |
| 2022 | 89.6 / 1.00 | 44.6 / 0.875 | 10.6 / 0.75 | 19.2 / 1.00 | 30.2 / 0.70 | - / 0.50 |
| 2023-2024 | 61.2 / 1.00 | 31.6 / 0.875 | 33.4 / 0.75 | 66.1 / 1.00 | 51.0 / 0.70 | - / 0.50 |
| 2025 | 44.6 / 0.958 | 33.9 / 0.875 | 47.1 / 0.754 | 67.5 / 1.00 | 40.9 / 0.70 | - / 0.50 |

### Review Findings

- The 2020 contraction label lasts April-June, followed by `MIXED`; that broad timing is economically plausible but uses revised observations, so it is not evidence of contemporaneous signal availability.
- High inflation stress appears through the 2021-2023 inflationary-expansion episodes. The separated 2022 episodes and the 2024-2025 prolonged `MIXED` period merit rule-level manual review; no thresholds were adjusted.
- Persistent source gaps constrain interpretation: the disclosed H.8 bank-volume break leaves that family unavailable in all 132 snapshots; the DOL claims series is absent in 129 because the official PDF provides rolling history; the weekly-average H.4.1 total-assets input and housing family are unavailable throughout. These are source limitations, not inferred regime flips.
- October 2025 alone lacks the exact CPI YoY endpoint. It remains `NOT_EVALUATED`; the rule verdicts are `UNKNOWN`, and November resumes evaluation. Inflation coverage averages 0.958 in 2025 because only that snapshot is masked.
- The Treasury source amendment supplies Policy/Rates coverage of 1.00 in every diagnostic snapshot. The previous branch had no accepted public Policy/Rates series, so this run cannot estimate a before/after source-driven regime change. The report is current/revised history, not vintage backtesting.
- Historical snapshots remain `PROVISIONAL` throughout. The label sparsity, low Data Quality range, unavailable supporting families, and 18 fragile sensitivity results make this diagnostic a review-needed validation, not a pass for unqualified production interpretation.

## Monthly Snapshots

The following JSON retains factor scores/bounds/coverage/readiness, regime status and label, Data Quality, Regime Clarity, rule diagnostics, tensions, directions, Transition Risk, A/B threshold sensitivity, and source gaps.

```json
[
  {
    "period": "2015-01",
    "asOf": "2015-01-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 56,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 11.569887206944927,
        "coverage": 1,
        "bounds": {
          "lower": 11.569887206944927,
          "upper": 11.569887206944927
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 1.0833333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 13.902240771177045,
        "coverage": 0.875,
        "bounds": {
          "lower": 12.164460674779914,
          "upper": 24.664460674779914
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 7.666666666666667,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.83272847239496,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.87454635429622,
          "upper": 45.87454635429622
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 21.658054047799343,
        "coverage": 1,
        "bounds": {
          "lower": 21.658054047799343,
          "upper": 21.658054047799343
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.0634920634920637,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.43357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.703500000000002,
          "upper": 52.703500000000005
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 2.9612223519497594,
          "upper": 52.96122235194976
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 89.8492693881262,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 34.12545364570378,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.5945737536887541
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2015-02",
    "asOf": "2015-02-28T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 12.376099768049194,
        "coverage": 1,
        "bounds": {
          "lower": 12.376099768049194,
          "upper": 12.376099768049194
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 1.1666666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 27.335111738170383,
        "coverage": 0.875,
        "bounds": {
          "lower": 23.918222770899085,
          "upper": 36.418222770899085
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 7.75,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.571894976389206,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.678921232291906,
          "upper": 45.678921232291906
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1.0833333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 21.0469898353468,
        "coverage": 1,
        "bounds": {
          "lower": 21.0469898353468,
          "upper": 21.0469898353468
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.138888888888889,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.43357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.703500000000002,
          "upper": 52.703500000000005
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 86.2290345219528,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 34.321078767708094,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 53.918222770899085,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.6124725356234095
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2015-03",
    "asOf": "2015-03-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 12.7287112472221,
        "coverage": 1,
        "bounds": {
          "lower": 12.7287112472221,
          "upper": 12.7287112472221
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 1.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 35.12977865875778,
        "coverage": 0.875,
        "bounds": {
          "lower": 30.738556326413057,
          "upper": 43.23855632641306
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 7.833333333333333,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 29.059112001847364,
        "coverage": 0.75,
        "bounds": {
          "lower": 21.794334001385522,
          "upper": 46.79433400138552
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1.1666666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 20.776000656167934,
        "coverage": 1,
        "bounds": {
          "lower": 20.776000656167934,
          "upper": 20.776000656167934
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.2261904761904763,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.43357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.703500000000002,
          "upper": 52.703500000000005
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 83.16627726901912,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 31.76144367358694,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 60.73855632641306,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.2803729727602233
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2015-04",
    "asOf": "2015-04-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 57,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 12.950373612351592,
        "coverage": 1,
        "bounds": {
          "lower": 12.950373612351592,
          "upper": 12.950373612351592
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 1.3333333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 40.543028219699416,
        "coverage": 0.875,
        "bounds": {
          "lower": 35.47514969223699,
          "upper": 47.97514969223699
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 7.916666666666667,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 30.557666333519023,
        "coverage": 0.75,
        "bounds": {
          "lower": 22.918249750139267,
          "upper": 47.91824975013927
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1.25,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 18.56641947376137,
        "coverage": 1,
        "bounds": {
          "lower": 18.56641947376137,
          "upper": 18.56641947376137
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.3134920634920637,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.63785714285714,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.8465,
          "upper": 52.846500000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 4.654747986197261,
          "upper": 54.654747986197265
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 79.53804080220425,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 27.081750249860733,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0.47514969223698955,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0.47514969223698955,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 65.47514969223698,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 1.4343230639320748
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2015-05",
    "asOf": "2015-05-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 57,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 12.346694843202535,
        "coverage": 1,
        "bounds": {
          "lower": 12.346694843202535,
          "upper": 12.346694843202535
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 1.4166666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 44.765708180690886,
        "coverage": 0.875,
        "bounds": {
          "lower": 39.16999465810453,
          "upper": 51.66999465810453
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 32.5802554486252,
        "coverage": 0.75,
        "bounds": {
          "lower": 24.435191586468903,
          "upper": 49.4351915864689
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1.3333333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 22.236242989725255,
        "coverage": 1,
        "bounds": {
          "lower": 22.236242989725255,
          "upper": 22.236242989725255
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.392857142857143,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.63785714285714,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.8465,
          "upper": 52.846500000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 15.927590768773992,
          "upper": 65.927590768774
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 76.64749466081753,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 25.564808413531097,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 4.169994658104528,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 4.169994658104528,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 69.16999465810453,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 1.301464916033801
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2015-06",
    "asOf": "2015-06-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 57,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 12.927595382819266,
        "coverage": 1,
        "bounds": {
          "lower": 12.927595382819266,
          "upper": 12.927595382819266
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 1.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 46.766665351721926,
        "coverage": 0.875,
        "bounds": {
          "lower": 40.92083218275668,
          "upper": 53.42083218275668
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8.083333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 28.17645218400715,
        "coverage": 0.75,
        "bounds": {
          "lower": 21.132339138005364,
          "upper": 46.132339138005364
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1.4166666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 24.192785084968932,
        "coverage": 1,
        "bounds": {
          "lower": 24.192785084968932,
          "upper": 24.192785084968932
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.4801587301587302,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.63785714285714,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.8465,
          "upper": 52.846500000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 22.546235164128785,
          "upper": 72.54623516412879
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 76.93801538549572,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 26.579167817243317,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 5.920832182756683,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 5.920832182756683,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 70.92083218275668,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.5104247237103898
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2015-07",
    "asOf": "2015-07-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 12.748829655933534,
        "coverage": 1,
        "bounds": {
          "lower": 12.748829655933534,
          "upper": 12.748829655933534
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 1.5833333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 49.64236242105567,
        "coverage": 0.875,
        "bounds": {
          "lower": 43.43706711842371,
          "upper": 55.93706711842371
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8.166666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 26.450640984037708,
        "coverage": 0.75,
        "bounds": {
          "lower": 19.837980738028282,
          "upper": 44.83798073802828
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1.5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 24.78781247391704,
        "coverage": 1,
        "bounds": {
          "lower": 24.78781247391704,
          "upper": 24.78781247391704
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.5674603174603177,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 31.140000000000004,
        "coverage": 0.7,
        "bounds": {
          "lower": 21.798000000000002,
          "upper": 51.798
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 24.30552448569652,
          "upper": 74.30552448569652
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 76.63437893122203,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 24.062932881576288,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 8.437067118423712,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 8.437067118423712,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 73.43706711842371,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.4965537433640588
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2015-08",
    "asOf": "2015-08-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 13.15779744919169,
        "coverage": 1,
        "bounds": {
          "lower": 13.15779744919169,
          "upper": 13.15779744919169
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 1.6666666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 44.425828238002474,
        "coverage": 0.875,
        "bounds": {
          "lower": 38.87259970825217,
          "upper": 51.37259970825217
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8.25,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 26.96502719921411,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.223770399410583,
          "upper": 45.22377039941058
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1.5833333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 25.210908575376774,
        "coverage": 1,
        "bounds": {
          "lower": 25.210908575376774,
          "upper": 25.210908575376774
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.6507936507936507,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 31.140000000000004,
        "coverage": 0.7,
        "bounds": {
          "lower": 21.798000000000002,
          "upper": 51.798
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 20.798494738294423,
          "upper": 70.79849473829442
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 78.34442899687596,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 28.627400291747833,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 3.8725997082521673,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 3.8725997082521673,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 68.87259970825217,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.6555909917465019
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2015-09",
    "asOf": "2015-09-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 12.998288620315698,
        "coverage": 1,
        "bounds": {
          "lower": 12.998288620315698,
          "upper": 12.998288620315698
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 1.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 36.87793244233176,
        "coverage": 0.875,
        "bounds": {
          "lower": 32.26819088704029,
          "upper": 44.76819088704029
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8.333333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 28.616055141160405,
        "coverage": 0.75,
        "bounds": {
          "lower": 21.462041355870305,
          "upper": 46.462041355870305
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1.6666666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 26.080469897305683,
        "coverage": 1,
        "bounds": {
          "lower": 26.080469897305683,
          "upper": 26.080469897305683
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.734126984126984,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 31.140000000000004,
        "coverage": 0.7,
        "bounds": {
          "lower": 21.798000000000002,
          "upper": 51.798
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 16.379050896589007,
          "upper": 66.379050896589
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 80.61471123842279,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 30.23180911295971,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 62.26819088704029,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.2620924478121678
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2015-10",
    "asOf": "2015-10-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 13.10932092953689,
        "coverage": 1,
        "bounds": {
          "lower": 13.10932092953689,
          "upper": 13.10932092953689
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 1.8333333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 46.77215122115359,
        "coverage": 0.875,
        "bounds": {
          "lower": 40.92563231850939,
          "upper": 53.42563231850939
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8.416666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 30.757269397018565,
        "coverage": 0.75,
        "bounds": {
          "lower": 23.067952047763924,
          "upper": 48.067952047763924
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1.75,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 25.543820762570864,
        "coverage": 1,
        "bounds": {
          "lower": 25.543820762570864,
          "upper": 25.543820762570864
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.8174603174603177,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 36.11785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 25.282500000000002,
          "upper": 55.282500000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 11.303826170607095,
          "upper": 61.303826170607095
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 75.62461145826707,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 26.574367681490607,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 5.925632318509393,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 5.925632318509393,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 70.9256323185094,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.18736263205738624
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2015-11",
    "asOf": "2015-11-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 14.569951042938499,
        "coverage": 1,
        "bounds": {
          "lower": 14.569951042938499,
          "upper": 14.569951042938499
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 1.9166666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 55.0801663439869,
        "coverage": 0.875,
        "bounds": {
          "lower": 48.19514555098854,
          "upper": 60.69514555098854
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8.5,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 30.27424111959225,
        "coverage": 0.75,
        "bounds": {
          "lower": 22.70568083969419,
          "upper": 47.70568083969419
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1.8333333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 26.801862179120604,
        "coverage": 1,
        "bounds": {
          "lower": 26.801862179120604,
          "upper": 26.801862179120604
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.892857142857143,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 36.11785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 25.282500000000002,
          "upper": 55.282500000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 6.8837508146478825,
          "upper": 56.88375081464788
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 73.84511228330196,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 19.304854449011458,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 13.195145550988542,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 13.195145550988542,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 78.19514555098854,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.21151925995973597
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2015-12",
    "asOf": "2015-12-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 15.707000826221698,
        "coverage": 1,
        "bounds": {
          "lower": 15.707000826221698,
          "upper": 15.707000826221698
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 58.46672337330393,
        "coverage": 0.875,
        "bounds": {
          "lower": 51.15838295164094,
          "upper": 63.65838295164094
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8.583333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.438166871095053,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.57862515332129,
          "upper": 45.57862515332129
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1.9166666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 29.08312066878617,
        "coverage": 1,
        "bounds": {
          "lower": 29.08312066878617,
          "upper": 29.08312066878617
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.9801587301587302,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 36.11785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 25.282500000000002,
          "upper": 55.282500000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 5.484291341277742,
          "upper": 55.48429134127774
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 73.71777187096392,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 16.341617048359062,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 16.158382951640938,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 16.158382951640938,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 81.15838295164093,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.26149048061779867
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-01",
    "asOf": "2016-01-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 19.839435878452175,
        "coverage": 1,
        "bounds": {
          "lower": 19.839435878452175,
          "upper": 19.839435878452175
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.0833333333333335,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 47.38370396135387,
        "coverage": 0.875,
        "bounds": {
          "lower": 41.46074096618464,
          "upper": 53.96074096618464
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8.666666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 25.864444820013006,
        "coverage": 0.75,
        "bounds": {
          "lower": 19.398333615009754,
          "upper": 44.398333615009754
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 26.99224839940144,
        "coverage": 1,
        "bounds": {
          "lower": 26.99224839940144,
          "upper": 26.99224839940144
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.0555555555555554,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 37.69071428571429,
        "coverage": 0.7,
        "bounds": {
          "lower": 26.383500000000005,
          "upper": 56.38350000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 3.148175964199524,
          "upper": 53.148175964199524
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 78.65175073976337,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 26.039259033815362,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 6.460740966184638,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 6.460740966184638,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 71.46074096618463,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.16511823728165842
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-02",
    "asOf": "2016-02-29T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 20.09512120313565,
        "coverage": 1,
        "bounds": {
          "lower": 20.09512120313565,
          "upper": 20.09512120313565
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.1666666666666665,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 40.766982830553914,
        "coverage": 0.875,
        "bounds": {
          "lower": 35.67110997673468,
          "upper": 48.17110997673468
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8.75,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.34246768887856,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.50685076665892,
          "upper": 45.50685076665892
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2.0833333333333335,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 24.431962698808093,
        "coverage": 1,
        "bounds": {
          "lower": 24.431962698808093,
          "upper": 24.431962698808093
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.134920634920635,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 37.69071428571429,
        "coverage": 0.7,
        "bounds": {
          "lower": 26.383500000000005,
          "upper": 56.38350000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 1.6817271517191426,
          "upper": 51.681727151719144
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 81.07498263379271,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 29.58827043647673,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0.7662311798703278,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0.6711099767346766,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 65.67110997673467,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.1281631860828636
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-03",
    "asOf": "2016-03-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 57,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 18.66339474416224,
        "coverage": 1,
        "bounds": {
          "lower": 18.66339474416224,
          "upper": 18.66339474416224
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 38.61580214662814,
        "coverage": 0.875,
        "bounds": {
          "lower": 33.78882687829962,
          "upper": 46.28882687829962
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8.833333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 30.154386914678025,
        "coverage": 0.75,
        "bounds": {
          "lower": 22.615790186008518,
          "upper": 47.61579018600852
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2.1666666666666665,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 22.484700554576488,
        "coverage": 1,
        "bounds": {
          "lower": 22.484700554576488,
          "upper": 22.484700554576488
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.2222222222222223,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 37.69071428571429,
        "coverage": 0.7,
        "bounds": {
          "lower": 26.383500000000005,
          "upper": 56.38350000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 1.4209322034085092,
          "upper": 51.42093220340851
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 81.27345253185504,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 28.711173121700376,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 63.78882687829962,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.6871710909117645
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-04",
    "asOf": "2016-04-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 57,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 19.43095131851236,
        "coverage": 1,
        "bounds": {
          "lower": 19.43095131851236,
          "upper": 19.43095131851236
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.3333333333333335,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 47.730781428802025,
        "coverage": 0.875,
        "bounds": {
          "lower": 41.764433750201775,
          "upper": 54.264433750201775
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 8.916666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 32.8503725590871,
        "coverage": 0.75,
        "bounds": {
          "lower": 24.637779419315322,
          "upper": 49.63777941931532
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2.25,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 20.281570751593417,
        "coverage": 1,
        "bounds": {
          "lower": 20.281570751593417,
          "upper": 20.281570751593417
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.3055555555555554,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 39.45,
        "coverage": 0.7,
        "bounds": {
          "lower": 27.615,
          "upper": 57.615
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 4.478013661464702,
          "upper": 54.4780136614647
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 76.5594885756853,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 25.362220580684678,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 6.764433750201775,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 6.764433750201775,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 71.76443375020177,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.7708881711938842
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-05",
    "asOf": "2016-05-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 57,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 20.157896295278437,
        "coverage": 1,
        "bounds": {
          "lower": 20.157896295278437,
          "upper": 20.157896295278437
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.4166666666666665,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 59.71210196274166,
        "coverage": 0.875,
        "bounds": {
          "lower": 52.248089217398956,
          "upper": 64.74808921739896
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 31.510393565313915,
        "coverage": 0.75,
        "bounds": {
          "lower": 23.632795173985436,
          "upper": 48.632795173985436
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2.3333333333333335,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 19.7891698788831,
        "coverage": 1,
        "bounds": {
          "lower": 19.7891698788831,
          "upper": 19.7891698788831
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.388888888888889,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 39.45,
        "coverage": 0.7,
        "bounds": {
          "lower": 27.615,
          "upper": 57.615
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 9.391670705906513,
          "upper": 59.39167070590651
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 71.19342454907283,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 15.409807077879481,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 17.405985512677393,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 17.248089217398956,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 82.24808921739896,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.5868971726995853
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-06",
    "asOf": "2016-06-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 20.03121257098833,
        "coverage": 1,
        "bounds": {
          "lower": 20.03121257098833,
          "upper": 20.03121257098833
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 53.871655917982345,
        "coverage": 0.875,
        "bounds": {
          "lower": 47.13769892823455,
          "upper": 59.63769892823455
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9.083333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 32.34270922161223,
        "coverage": 0.75,
        "bounds": {
          "lower": 24.257031916209176,
          "upper": 49.25703191620917
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2.4166666666666665,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 19.516225279205642,
        "coverage": 1,
        "bounds": {
          "lower": 19.516225279205642,
          "upper": 19.516225279205642
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.4761904761904763,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 39.45,
        "coverage": 0.7,
        "bounds": {
          "lower": 27.615,
          "upper": 57.615
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 14.580205781673808,
          "upper": 64.58020578167381
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 72.08331085384343,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 20.39351364275378,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 12.16891149922288,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 12.137698928234549,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 77.13769892823456,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.2671905933903873
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-07",
    "asOf": "2016-07-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 19.427460050739853,
        "coverage": 1,
        "bounds": {
          "lower": 19.427460050739853,
          "upper": 19.427460050739853
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.5833333333333335,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 38.234132806212195,
        "coverage": 0.875,
        "bounds": {
          "lower": 33.45486620543567,
          "upper": 45.95486620543567
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9.166666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 30.785607934558858,
        "coverage": 0.75,
        "bounds": {
          "lower": 23.089205950919144,
          "upper": 48.089205950919144
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2.5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 17.847926204912433,
        "coverage": 1,
        "bounds": {
          "lower": 17.847926204912433,
          "upper": 17.847926204912433
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.5555555555555554,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 39.65714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 27.759999999999998,
          "upper": 57.760000000000005
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 15.93716601665732,
          "upper": 65.93716601665732
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 77.86329173254998,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 29.04513379456433,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 63.45486620543567,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.5629778094589533
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-08",
    "asOf": "2016-08-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 21.673788684915433,
        "coverage": 1,
        "bounds": {
          "lower": 21.673788684915433,
          "upper": 21.673788684915433
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.6666666666666665,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 24.84536361883234,
        "coverage": 0.875,
        "bounds": {
          "lower": 21.739693166478297,
          "upper": 34.2396931664783
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9.25,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 29.492184371920004,
        "coverage": 0.75,
        "bounds": {
          "lower": 22.119138278940003,
          "upper": 47.11913827894
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2.5833333333333335,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 17.862759643916828,
        "coverage": 1,
        "bounds": {
          "lower": 17.862759643916828,
          "upper": 17.862759643916828
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.6468253968253967,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 39.65714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 27.759999999999998,
          "upper": 57.760000000000005
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 14.599359232514573,
          "upper": 64.59935923251457
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 82.84038124972668,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 34.55465040597544,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 1.6737886849154329,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 51.7396931664783,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.562523913946833
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-09",
    "asOf": "2016-09-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 22.200679043090616,
        "coverage": 1,
        "bounds": {
          "lower": 22.200679043090616,
          "upper": 22.200679043090616
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 28.275180683741517,
        "coverage": 0.875,
        "bounds": {
          "lower": 24.740783098273827,
          "upper": 37.24078309827382
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9.333333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.776923800047328,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.832692850035496,
          "upper": 45.8326928500355
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2.6666666666666665,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 18.18590914235145,
        "coverage": 1,
        "bounds": {
          "lower": 18.18590914235145,
          "upper": 18.18590914235145
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.7301587301587302,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 39.65714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 27.759999999999998,
          "upper": 57.760000000000005
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 12.642742592599078,
          "upper": 62.64274259259908
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 82.0610561279001,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 36.36798619305512,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 2.2006790430906165,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 54.74078309827382,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.40951319022675126
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-10",
    "asOf": "2016-10-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 23.016408078796907,
        "coverage": 1,
        "bounds": {
          "lower": 23.016408078796907,
          "upper": 23.016408078796907
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.8333333333333335,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 37.00689449147205,
        "coverage": 0.875,
        "bounds": {
          "lower": 32.38103268003805,
          "upper": 44.88103268003805
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9.416666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 28.958221912405065,
        "coverage": 0.75,
        "bounds": {
          "lower": 21.7186664343038,
          "upper": 46.7186664343038
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2.75,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 17.453697751676376,
        "coverage": 1,
        "bounds": {
          "lower": 17.453697751676376,
          "upper": 17.453697751676376
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.8095238095238093,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 36.20357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 25.3425,
          "upper": 55.3425
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 11.712075015121535,
          "upper": 61.712075015121535
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 79.42923699769365,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 33.13537539875886,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 3.016408078796907,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 62.38103268003805,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.060826189277873866
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-11",
    "asOf": "2016-11-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 22.446111082150175,
        "coverage": 1,
        "bounds": {
          "lower": 22.446111082150175,
          "upper": 22.446111082150175
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 2.9166666666666665,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 42.781880140515796,
        "coverage": 0.875,
        "bounds": {
          "lower": 37.43414512295132,
          "upper": 49.93414512295132
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9.5,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 28.659473301862672,
        "coverage": 0.75,
        "bounds": {
          "lower": 21.494604976397003,
          "upper": 46.494604976397
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2.8333333333333335,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 21.663380234660693,
        "coverage": 1,
        "bounds": {
          "lower": 21.663380234660693,
          "upper": 21.663380234660693
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.888888888888889,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 36.20357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 25.3425,
          "upper": 55.3425
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 10.787029108956526,
          "upper": 60.787029108956524
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 77.47521045790037,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 30.951506105753175,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 4.880256205101496,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 2.434145122951321,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 67.43414512295132,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.43498786165678816
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2016-12",
    "asOf": "2016-12-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 25.022218315433665,
        "coverage": 1,
        "bounds": {
          "lower": 25.022218315433665,
          "upper": 25.022218315433665
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 39.242634068607096,
        "coverage": 0.875,
        "bounds": {
          "lower": 34.337304810031206,
          "upper": 46.837304810031206
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9.583333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 31.685800277809495,
        "coverage": 0.75,
        "bounds": {
          "lower": 23.764350208357122,
          "upper": 48.76435020835712
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 2.9166666666666665,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 24.780667327200238,
        "coverage": 1,
        "bounds": {
          "lower": 24.780667327200238,
          "upper": 24.780667327200238
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.9722222222222223,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 36.20357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 25.3425,
          "upper": 55.3425
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 11.743966929299274,
          "upper": 61.743966929299276
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 78.02191385576354,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 33.18491350540246,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 5.0222183154336655,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 64.31508649459755,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.5238930041852385
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-01",
    "asOf": "2017-01-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 28.554786458783326,
        "coverage": 1,
        "bounds": {
          "lower": 28.554786458783326,
          "upper": 28.554786458783326
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.0833333333333335,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 34.549646240385975,
        "coverage": 0.875,
        "bounds": {
          "lower": 30.230940460337727,
          "upper": 42.73094046033773
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9.666666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 31.52604273990507,
        "coverage": 0.75,
        "bounds": {
          "lower": 23.644532054928803,
          "upper": 48.6445320549288
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 22.51040663082801,
        "coverage": 1,
        "bounds": {
          "lower": 22.51040663082801,
          "upper": 22.51040663082801
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.051587301587301,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 35.56428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 24.895,
          "upper": 54.895
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 12.922988377713398,
          "upper": 62.922988377713395
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 78.06837096999459,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 39.91025440385452,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 8.554786458783326,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 56.6761540015544,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.016143422300873844
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-02",
    "asOf": "2017-02-28T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 58,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 29.766512619641546,
        "coverage": 1,
        "bounds": {
          "lower": 29.766512619641546,
          "upper": 29.766512619641546
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.1666666666666665,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 29.56109724898035,
        "coverage": 0.875,
        "bounds": {
          "lower": 25.865960092857804,
          "upper": 38.365960092857804
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9.75,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 29.563290814040652,
        "coverage": 0.75,
        "bounds": {
          "lower": 22.172468110530488,
          "upper": 47.17246811053049
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3.0833333333333335,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 22.23578057215353,
        "coverage": 1,
        "bounds": {
          "lower": 22.23578057215353,
          "upper": 22.23578057215353
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.126984126984127,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 35.56428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 24.895,
          "upper": 54.895
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 15.87614265260254,
          "upper": 65.87614265260254
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 79.65011921987696,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 42.59404450911106,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 9.766512619641546,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 51.09944747321626,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.8879535150437268
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-03",
    "asOf": "2017-03-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 24.54673612988924,
        "coverage": 1,
        "bounds": {
          "lower": 24.54673612988924,
          "upper": 24.54673612988924
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 31.627780620363065,
        "coverage": 0.875,
        "bounds": {
          "lower": 27.67430804281768,
          "upper": 40.174308042817685
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9.833333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.21417210266593,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.41062907699945,
          "upper": 45.41062907699945
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3.1666666666666665,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 25.914658598635064,
        "coverage": 1,
        "bounds": {
          "lower": 25.914658598635064,
          "upper": 25.914658598635064
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.218253968253968,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 35.56428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 24.895,
          "upper": 54.895
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 14.986194408419376,
          "upper": 64.98619440841938
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 81.83858805977309,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 39.13610705288979,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 4.54673612988924,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 57.674308042817685,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.18114668450807114
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-04",
    "asOf": "2017-04-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 22.70288714664609,
        "coverage": 1,
        "bounds": {
          "lower": 22.70288714664609,
          "upper": 22.70288714664609
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.3333333333333335,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 24.169184364940868,
        "coverage": 0.875,
        "bounds": {
          "lower": 21.14803631932326,
          "upper": 33.64803631932326
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 9.916666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.395471646644904,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.546603734983677,
          "upper": 45.54660373498368
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3.25,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 25.11361658784927,
        "coverage": 1,
        "bounds": {
          "lower": 25.11361658784927,
          "upper": 25.11361658784927
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.2936507936507935,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.80142857142857,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.961000000000002,
          "upper": 52.961000000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 13.397593251564711,
          "upper": 63.397593251564714
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 84.9885043517756,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 37.156283411662415,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 2.7028871466460913,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 51.14803631932326,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.6412968250589013
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-05",
    "asOf": "2017-05-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 19.937951328466482,
        "coverage": 1,
        "bounds": {
          "lower": 19.937951328466482,
          "upper": 19.937951328466482
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.4166666666666665,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 16.497367002513016,
        "coverage": 0.875,
        "bounds": {
          "lower": 14.43519612719889,
          "upper": 26.93519612719889
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 28.696762097529472,
        "coverage": 0.75,
        "bounds": {
          "lower": 21.522571573147104,
          "upper": 46.522571573147104
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3.3333333333333335,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 26.559242857433667,
        "coverage": 1,
        "bounds": {
          "lower": 26.559242857433667,
          "upper": 26.559242857433667
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.380952380952381,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.80142857142857,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.961000000000002,
          "upper": 52.961000000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 11.030877968284978,
          "upper": 61.030877968284976
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 87.3808500771763,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 33.477428426852896,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.5269093907598674
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-06",
    "asOf": "2017-06-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 19.190055155151313,
        "coverage": 1,
        "bounds": {
          "lower": 19.190055155151313,
          "upper": 19.190055155151313
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 16.269048338566673,
        "coverage": 0.875,
        "bounds": {
          "lower": 14.235417296245839,
          "upper": 26.73541729624584
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10.083333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.63112792466011,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.723345943495083,
          "upper": 45.72334594349508
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3.4166666666666665,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 27.928476231374383,
        "coverage": 1,
        "bounds": {
          "lower": 27.928476231374383,
          "upper": 27.928476231374383
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.468253968253968,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.80142857142857,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.961000000000002,
          "upper": 52.961000000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 13.877260414054824,
          "upper": 63.877260414054824
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 87.70052929845313,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 34.27665405650492,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.14686629936213613
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-07",
    "asOf": "2017-07-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 19.005317978330616,
        "coverage": 1,
        "bounds": {
          "lower": 19.005317978330616,
          "upper": 19.005317978330616
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.5833333333333335,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 12.895334056867906,
        "coverage": 0.875,
        "bounds": {
          "lower": 11.283417299759417,
          "upper": 23.783417299759417
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10.166666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.1591734542331,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.369380090674824,
          "upper": 45.369380090674824
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3.5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 29.261807754569652,
        "coverage": 1,
        "bounds": {
          "lower": 29.261807754569652,
          "upper": 29.261807754569652
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.5476190476190474,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 31.72357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.2065,
          "upper": 52.206500000000005
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 15.87223614726133,
          "upper": 65.87223614726133
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 88.72723597279754,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 34.630619909325176,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.10903614452854038
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-08",
    "asOf": "2017-08-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 58,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 19.268964954417882,
        "coverage": 1,
        "bounds": {
          "lower": 19.268964954417882,
          "upper": 19.268964954417882
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.6666666666666665,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 25.624512815877637,
        "coverage": 0.875,
        "bounds": {
          "lower": 22.421448713892932,
          "upper": 34.92144871389293
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10.25,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.714211178213844,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.785658383660383,
          "upper": 45.78565838366038
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3.5833333333333335,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 28.38378930984877,
        "coverage": 1,
        "bounds": {
          "lower": 28.38378930984877,
          "upper": 28.38378930984877
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.638888888888889,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 31.72357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.2065,
          "upper": 52.206500000000005
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 18.572105721121144,
          "upper": 68.57210572112115
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 84.63377299934471,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 34.21434161633962,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 52.42144871389293,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.685997065588928
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-09",
    "asOf": "2017-09-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 20.682553743827874,
        "coverage": 1,
        "bounds": {
          "lower": 20.682553743827874,
          "upper": 20.682553743827874
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 33.67471517352036,
        "coverage": 0.875,
        "bounds": {
          "lower": 29.465375776830314,
          "upper": 41.965375776830314
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10.333333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 29.002256268472337,
        "coverage": 0.75,
        "bounds": {
          "lower": 21.751692201354253,
          "upper": 46.75169220135425
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3.6666666666666665,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 27.702578945504673,
        "coverage": 1,
        "bounds": {
          "lower": 27.702578945504673,
          "upper": 27.702578945504673
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.718253968253968,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 31.72357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.2065,
          "upper": 52.206500000000005
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 18.654771820835926,
          "upper": 68.65477182083592
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 81.5263920288616,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 33.71717796699756,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0.6825537438278744,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 59.465375776830314,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.02618009522689091
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-10",
    "asOf": "2017-10-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 58,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 20.84025771195376,
        "coverage": 1,
        "bounds": {
          "lower": 20.84025771195376,
          "upper": 20.84025771195376
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.8333333333333335,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 28.540181780496386,
        "coverage": 0.875,
        "bounds": {
          "lower": 24.972659057934337,
          "upper": 37.47265905793434
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10.416666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 30.59555377342957,
        "coverage": 0.75,
        "bounds": {
          "lower": 22.94666533007218,
          "upper": 47.94666533007218
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3.75,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 28.587430591344003,
        "coverage": 1,
        "bounds": {
          "lower": 28.587430591344003,
          "upper": 28.587430591344003
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.801587301587301,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.77785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.844500000000004,
          "upper": 50.84450000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 20.16108333263,
          "upper": 70.16108333263
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 83.37358677780462,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 32.89359238188158,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0.8402577119537611,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 54.97265905793434,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 1.0088175614995198
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-11",
    "asOf": "2017-11-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 58,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 21.393046052512602,
        "coverage": 1,
        "bounds": {
          "lower": 21.393046052512602,
          "upper": 21.393046052512602
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 3.9166666666666665,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 12.401521693754963,
        "coverage": 0.875,
        "bounds": {
          "lower": 10.851331482035594,
          "upper": 23.351331482035594
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10.5,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 31.452442335400047,
        "coverage": 0.75,
        "bounds": {
          "lower": 23.589331751550034,
          "upper": 48.589331751550034
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3.8333333333333335,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 28.560146899146545,
        "coverage": 1,
        "bounds": {
          "lower": 28.560146899146545,
          "upper": 28.560146899146545
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.884920634920635,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.77785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.844500000000004,
          "upper": 50.84450000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 20.694062761023105,
          "upper": 70.6940627610231
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 88.16985047453498,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 32.80371430096257,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 1.3930460525126023,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.34147206342975966
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2017-12",
    "asOf": "2017-12-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 58,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 21.48477716985636,
        "coverage": 1,
        "bounds": {
          "lower": 21.48477716985636,
          "upper": 21.48477716985636
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 4.572589698922017,
        "coverage": 0.875,
        "bounds": {
          "lower": 4.001015986556765,
          "upper": 16.501015986556766
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10.583333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 30.001861590374414,
        "coverage": 0.75,
        "bounds": {
          "lower": 22.50139619278081,
          "upper": 47.50139619278081
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 3.9166666666666665,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 29.988271791767538,
        "coverage": 1,
        "bounds": {
          "lower": 29.988271791767538,
          "upper": 29.988271791767538
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.964285714285714,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.77785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.844500000000004,
          "upper": 50.84450000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 20.490784401955352,
          "upper": 70.49078440195535
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 88.49623114216577,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 33.983380977075555,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 1.4847771698563612,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.6513591309604716
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-01",
    "asOf": "2018-01-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 58,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 21.84963464495819,
        "coverage": 1,
        "bounds": {
          "lower": 21.84963464495819,
          "upper": 21.84963464495819
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.083333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 5.67652660496985,
        "coverage": 0.875,
        "bounds": {
          "lower": 4.966960779348619,
          "upper": 17.466960779348618
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10.666666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 28.12104780719911,
        "coverage": 0.75,
        "bounds": {
          "lower": 21.090785855399332,
          "upper": 46.09078585539933
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 30.268518576747006,
        "coverage": 1,
        "bounds": {
          "lower": 30.268518576747006,
          "upper": 30.268518576747006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.0476190476190474,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.79285714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.855000000000004,
          "upper": 50.855000000000004
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 22.280299522493547,
          "upper": 72.28029952249355
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 88.9162642433802,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 35.758848789558854,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 1.84963464495819,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.18890668909942177
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-02",
    "asOf": "2018-02-28T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 58,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 22.76064844803095,
        "coverage": 1,
        "bounds": {
          "lower": 22.76064844803095,
          "upper": 22.76064844803095
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.166666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 8.579982199366103,
        "coverage": 0.875,
        "bounds": {
          "lower": 7.50748442444534,
          "upper": 20.00748442444534
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10.75,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 26.482245270517392,
        "coverage": 0.75,
        "bounds": {
          "lower": 19.861683952888043,
          "upper": 44.86168395288804
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4.083333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 32.8798867654002,
        "coverage": 1,
        "bounds": {
          "lower": 32.8798867654002,
          "upper": 32.8798867654002
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.123015873015873,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.79285714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.855000000000004,
          "upper": 50.855000000000004
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 24.450907400330284,
          "upper": 74.45090740033028
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 89.28499481413358,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 37.898964495142906,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 2.760648448030949,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.9815676500885995
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-03",
    "asOf": "2018-03-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 58,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 26.892700567221056,
        "coverage": 1,
        "bounds": {
          "lower": 26.892700567221056,
          "upper": 26.892700567221056
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 16.46379855554834,
        "coverage": 0.875,
        "bounds": {
          "lower": 14.405823736104796,
          "upper": 26.905823736104796
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10.833333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 23.553434890778913,
        "coverage": 0.75,
        "bounds": {
          "lower": 17.665076168084184,
          "upper": 42.665076168084184
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4.166666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 32.598855180920296,
        "coverage": 1,
        "bounds": {
          "lower": 32.598855180920296,
          "upper": 32.598855180920296
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.2063492063492065,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.79285714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.855000000000004,
          "upper": 50.855000000000004
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 26.27745404094694,
          "upper": 76.27745404094694
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 88.2352973715223,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 44.22762439913687,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 6.8927005672210555,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 48.107299432778944,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.8979178571021373
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-04",
    "asOf": "2018-04-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 27.519859946004647,
        "coverage": 1,
        "bounds": {
          "lower": 27.519859946004647,
          "upper": 27.519859946004647
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.333333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 19.58827325579475,
        "coverage": 0.875,
        "bounds": {
          "lower": 17.139739098820407,
          "upper": 29.639739098820407
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 10.916666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 21.147366443162827,
        "coverage": 0.75,
        "bounds": {
          "lower": 15.86052483237212,
          "upper": 40.86052483237212
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4.25,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 32.31737945358644,
        "coverage": 1,
        "bounds": {
          "lower": 32.31737945358644,
          "upper": 32.31737945358644
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.2896825396825395,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 28.48857142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 19.942,
          "upper": 49.94200000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 24.83442290492517,
          "upper": 74.83442290492516
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 87.64341693775786,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 46.65933511363252,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 7.519859946004647,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 47.480140053995356,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.06645698764256025
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-05",
    "asOf": "2018-05-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 30.97712309827852,
        "coverage": 1,
        "bounds": {
          "lower": 30.97712309827852,
          "upper": 30.97712309827852
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.416666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 19.474044590426608,
        "coverage": 0.875,
        "bounds": {
          "lower": 17.03978901662328,
          "upper": 29.53978901662328
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 19.961565131273375,
        "coverage": 0.75,
        "bounds": {
          "lower": 14.971173848455031,
          "upper": 39.97117384845503
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4.333333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 33.15061013947471,
        "coverage": 1,
        "bounds": {
          "lower": 33.15061013947471,
          "upper": 33.15061013947471
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.376984126984127,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 28.48857142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 19.942,
          "upper": 49.94200000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 22.589599849439345,
          "upper": 72.58959984943934
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 86.22157068967492,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 51.00594924982349,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 10.977123098278518,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 44.02287690172148,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.55083225731688
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-06",
    "asOf": "2018-06-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 31.171155522858765,
        "coverage": 1,
        "bounds": {
          "lower": 31.171155522858765,
          "upper": 31.171155522858765
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 17.63833055691055,
        "coverage": 0.875,
        "bounds": {
          "lower": 15.433539237296731,
          "upper": 27.93353923729673
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11.083333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 21.902986591951457,
        "coverage": 0.75,
        "bounds": {
          "lower": 16.427239943963592,
          "upper": 41.42723994396359
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4.416666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 34.61737613446475,
        "coverage": 1,
        "bounds": {
          "lower": 34.61737613446475,
          "upper": 34.61737613446475
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.4603174603174605,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 28.48857142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 19.942,
          "upper": 49.94200000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 22.00184691208913,
          "upper": 72.00184691208912
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 86.33023456046284,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 39.74391557889517,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 1.171155522858765,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 43.82884447714123,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.22522783778658
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-07",
    "asOf": "2018-07-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 32.90739172669349,
        "coverage": 1,
        "bounds": {
          "lower": 32.90739172669349,
          "upper": 32.90739172669349
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.583333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 21.27665760685372,
        "coverage": 0.875,
        "bounds": {
          "lower": 18.617075405997006,
          "upper": 31.117075405997006
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11.166666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 22.328001581105337,
        "coverage": 0.75,
        "bounds": {
          "lower": 16.746001185829,
          "upper": 41.746001185829
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4.5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 33.74499737526254,
        "coverage": 1,
        "bounds": {
          "lower": 33.74499737526254,
          "upper": 33.74499737526254
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.5436507936507935,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 26.14714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 18.303,
          "upper": 48.303000000000004
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 21.07072211165024,
          "upper": 71.07072211165024
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 84.58477361850575,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 48.71031277951583,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 10.456313965344833,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 42.09260827330651,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.6771843017327583
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-08",
    "asOf": "2018-08-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 29.49387577384472,
        "coverage": 1,
        "bounds": {
          "lower": 29.49387577384472,
          "upper": 29.49387577384472
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.666666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 17.374183685951497,
        "coverage": 0.875,
        "bounds": {
          "lower": 15.202410725207558,
          "upper": 27.702410725207557
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11.25,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 23.8418096188574,
        "coverage": 0.75,
        "bounds": {
          "lower": 17.88135721414305,
          "upper": 42.88135721414305
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4.583333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 34.62023125212243,
        "coverage": 1,
        "bounds": {
          "lower": 34.62023125212243,
          "upper": 34.62023125212243
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.634920634920635,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 26.14714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 18.303,
          "upper": 48.303000000000004
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 20.306590627398325,
          "upper": 70.30659062739832
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 87.3167906587517,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 37.11864278585695,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 45.50612422615528,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.2431215873907164
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-09",
    "asOf": "2018-09-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 27.352211013090766,
        "coverage": 1,
        "bounds": {
          "lower": 27.352211013090766,
          "upper": 27.352211013090766
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 19.582739918164414,
        "coverage": 0.875,
        "bounds": {
          "lower": 17.134897428393863,
          "upper": 29.634897428393863
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11.333333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 26.01279509139035,
        "coverage": 0.75,
        "bounds": {
          "lower": 19.509596318542762,
          "upper": 44.50959631854276
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4.666666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 38.18380885873895,
        "coverage": 1,
        "bounds": {
          "lower": 38.18380885873895,
          "upper": 38.18380885873895
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.7103174603174605,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 26.14714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 18.303,
          "upper": 48.303000000000004
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 20.07121598450171,
          "upper": 70.0712159845017
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 85.53425219716478,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 42.842614694548004,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 7.352211013090766,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 47.647788986909234,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.3713210669224254
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-10",
    "asOf": "2018-10-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 27.69580075013942,
        "coverage": 1,
        "bounds": {
          "lower": 27.69580075013942,
          "upper": 27.69580075013942
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.833333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 30.34979802125472,
        "coverage": 0.875,
        "bounds": {
          "lower": 26.55607326859788,
          "upper": 39.056073268597885
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11.416666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.513168899741373,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.63487667480603,
          "upper": 45.63487667480603
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4.75,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 41.3011576239478,
        "coverage": 1,
        "bounds": {
          "lower": 41.3011576239478,
          "upper": 41.3011576239478
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.7976190476190474,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 26.316428571428574,
        "coverage": 0.7,
        "bounds": {
          "lower": 18.4215,
          "upper": 48.42150000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 22.001179001321255,
          "upper": 72.00117900132125
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 79.66217850307542,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 42.06092407533339,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 7.695800750139419,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 53.86027251845846,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.02325622407867156
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-11",
    "asOf": "2018-11-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 59,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 27.496028570318217,
        "coverage": 1,
        "bounds": {
          "lower": 27.496028570318217,
          "upper": 27.496028570318217
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 4.916666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 38.312301940477006,
        "coverage": 0.875,
        "bounds": {
          "lower": 33.52326419791738,
          "upper": 46.02326419791738
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11.5,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 29.406809681972305,
        "coverage": 0.75,
        "bounds": {
          "lower": 22.05510726147923,
          "upper": 47.05510726147923
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4.833333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 40.43443514696363,
        "coverage": 1,
        "bounds": {
          "lower": 40.43443514696363,
          "upper": 40.43443514696363
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.876984126984127,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 26.316428571428574,
        "coverage": 0.7,
        "bounds": {
          "lower": 18.4215,
          "upper": 48.42150000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 24.702482071735044,
          "upper": 74.70248207173505
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 76.98248028374836,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 36.47276437240084,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 7.496028570318217,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 61.02723562759916,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 1.230344535102701
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2018-12",
    "asOf": "2018-12-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 59,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 26.392761701561376,
        "coverage": 1,
        "bounds": {
          "lower": 26.392761701561376,
          "upper": 26.392761701561376
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 44.71580268522843,
        "coverage": 0.875,
        "bounds": {
          "lower": 39.12632734957488,
          "upper": 51.62632734957488
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11.583333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 31.046878807490668,
        "coverage": 0.75,
        "bounds": {
          "lower": 23.285159105618,
          "upper": 48.285159105618
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 4.916666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 41.961501072673784,
        "coverage": 1,
        "bounds": {
          "lower": 41.961501072673784,
          "upper": 41.961501072673784
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.9523809523809526,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 26.316428571428574,
        "coverage": 0.7,
        "bounds": {
          "lower": 18.4215,
          "upper": 48.42150000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 23.081211511680145,
          "upper": 73.08121151168015
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 74.16033994136707,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 33.107602595943376,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 10.519089051136255,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 4.126327349574879,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 67.7335656480135,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.9561236485051472
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-01",
    "asOf": "2019-01-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 59,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 23.23954029475542,
        "coverage": 1,
        "bounds": {
          "lower": 23.23954029475542,
          "upper": 23.23954029475542
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.083333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 42.313333621118275,
        "coverage": 0.875,
        "bounds": {
          "lower": 37.02416691847849,
          "upper": 49.52416691847849
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11.666666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 32.95017718735193,
        "coverage": 0.75,
        "bounds": {
          "lower": 24.712632890513948,
          "upper": 49.712632890513945
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 43.0696672012832,
        "coverage": 1,
        "bounds": {
          "lower": 43.0696672012832,
          "upper": 43.0696672012832
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.035714285714286,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 31.994285714285713,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.395999999999997,
          "upper": 52.396
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 17.669324737797986,
          "upper": 67.66932473779798
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 73.52290976481281,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 28.71537337627693,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 5.263707213233914,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 2.0241669184784925,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 67.0241669184785,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.774029394435749
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-02",
    "asOf": "2019-02-28T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 21.96389911308871,
        "coverage": 1,
        "bounds": {
          "lower": 21.96389911308871,
          "upper": 21.96389911308871
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.166666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 52.225451577880854,
        "coverage": 0.875,
        "bounds": {
          "lower": 45.69727013064575,
          "upper": 58.19727013064575
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11.75,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 30.737022335236386,
        "coverage": 0.75,
        "bounds": {
          "lower": 23.05276675142729,
          "upper": 48.052766751427285
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5.083333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 42.94867981580649,
        "coverage": 1,
        "bounds": {
          "lower": 42.94867981580649,
          "upper": 42.94867981580649
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.111111111111111,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 31.994285714285713,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.395999999999997,
          "upper": 52.396
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 11.883109306474399,
          "upper": 61.883109306474395
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 70.61212201441028,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 23.766628982442963,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 12.66116924373446,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 10.697270130645748,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 75.69727013064575,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.11958615391499672
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-03",
    "asOf": "2019-03-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 21.918943698482426,
        "coverage": 1,
        "bounds": {
          "lower": 21.918943698482426,
          "upper": 21.918943698482426
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 50.484446094222974,
        "coverage": 0.875,
        "bounds": {
          "lower": 44.173890332445104,
          "upper": 56.673890332445104
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11.833333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 29.6372179983627,
        "coverage": 0.75,
        "bounds": {
          "lower": 22.227913498772025,
          "upper": 47.227913498772025
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5.166666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 42.674150060639505,
        "coverage": 1,
        "bounds": {
          "lower": 42.674150060639505,
          "upper": 42.674150060639505
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.194444444444445,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 31.994285714285713,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.395999999999997,
          "upper": 52.396
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 11.70567936800755,
          "upper": 61.70567936800755
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 71.60619478707059,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 25.24505336603732,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 11.09283403092753,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 9.173890332445104,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 74.1738903324451,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.5717875950463802
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-04",
    "asOf": "2019-04-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 22.676162048402958,
        "coverage": 1,
        "bounds": {
          "lower": 22.676162048402958,
          "upper": 22.676162048402958
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.333333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 44.86294683647743,
        "coverage": 0.875,
        "bounds": {
          "lower": 39.25507848191775,
          "upper": 51.75507848191775
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 11.916666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 26.75644021075586,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.067330158066895,
          "upper": 45.067330158066895
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5.25,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 41.79026495541435,
        "coverage": 1,
        "bounds": {
          "lower": 41.79026495541435,
          "upper": 41.79026495541435
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.277777777777778,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.880714285714287,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.9165,
          "upper": 50.9165
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 16.93209845510046,
          "upper": 66.93209845510046
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 75.10768708210566,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 30.92108356648521,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 6.931240530320707,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 4.255078481917749,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 69.25507848191775,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.7123852316962775
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-05",
    "asOf": "2019-05-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 20.974311813961513,
        "coverage": 1,
        "bounds": {
          "lower": 20.974311813961513,
          "upper": 20.974311813961513
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.416666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 41.19518128782153,
        "coverage": 0.875,
        "bounds": {
          "lower": 36.04578362684384,
          "upper": 48.54578362684384
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 25.21968148389207,
        "coverage": 0.75,
        "bounds": {
          "lower": 18.914761112919052,
          "upper": 43.91476111291905
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5.333333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 42.39780654352545,
        "coverage": 1,
        "bounds": {
          "lower": 42.39780654352545,
          "upper": 42.39780654352545
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.365079365079365,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.880714285714287,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.9165,
          "upper": 50.9165
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 19.42692341886916,
          "upper": 69.42692341886917
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 76.43340494362401,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 32.05955070104246,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 2.020095440805356,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 1.0457836268438427,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 66.04578362684384,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.5674629812104537
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-06",
    "asOf": "2019-06-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 22.224012784590336,
        "coverage": 1,
        "bounds": {
          "lower": 22.224012784590336,
          "upper": 22.224012784590336
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 41.352771083784894,
        "coverage": 0.875,
        "bounds": {
          "lower": 36.18367469831178,
          "upper": 48.68367469831178
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12.083333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 24.69019343333993,
        "coverage": 0.75,
        "bounds": {
          "lower": 18.51764507500495,
          "upper": 43.51764507500495
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5.416666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 38.53773362651178,
        "coverage": 1,
        "bounds": {
          "lower": 38.53773362651178,
          "upper": 38.53773362651178
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.444444444444445,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.880714285714287,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.9165,
          "upper": 50.9165
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 17.45182139000663,
          "upper": 67.45182139000663
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 78.42741978491792,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 33.54033808627855,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 3.4076874829021193,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 1.1836746983117834,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 66.18367469831179,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.0850393058960619
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-07",
    "asOf": "2019-07-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 23.29048607813067,
        "coverage": 1,
        "bounds": {
          "lower": 23.29048607813067,
          "upper": 23.29048607813067
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.583333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 33.72581803593741,
        "coverage": 0.875,
        "bounds": {
          "lower": 29.510090781445232,
          "upper": 42.01009078144523
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12.166666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.0601219525781,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.295091464433575,
          "upper": 45.295091464433575
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5.5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 38.01100915632411,
        "coverage": 1,
        "bounds": {
          "lower": 38.01100915632411,
          "upper": 38.01100915632411
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.531746031746032,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 30.08785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 21.061500000000002,
          "upper": 51.06150000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 10.633208077193288,
          "upper": 60.63320807719329
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 80.78348166992978,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 36.28039529668544,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 3.2904860781306695,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 59.51009078144523,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.0680712522442728
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-08",
    "asOf": "2019-08-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 59,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 25.20124297906449,
        "coverage": 1,
        "bounds": {
          "lower": 25.20124297906449,
          "upper": 25.20124297906449
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.666666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 27.632266957870577,
        "coverage": 0.875,
        "bounds": {
          "lower": 24.178233588136756,
          "upper": 36.678233588136756
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12.25,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 26.493575158885875,
        "coverage": 0.75,
        "bounds": {
          "lower": 19.870181369164406,
          "upper": 44.870181369164406
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5.583333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 30.114942754077866,
        "coverage": 1,
        "bounds": {
          "lower": 30.114942754077866,
          "upper": 30.114942754077866
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.619047619047619,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 30.08785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 21.061500000000002,
          "upper": 51.06150000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 7.0600731172524,
          "upper": 57.0600731172524
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 84.44858066446373,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 40.33106160990008,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 5.201242979064489,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 53.97699060907227,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.5161221594415455
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-09",
    "asOf": "2019-09-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 23.937346518859634,
        "coverage": 1,
        "bounds": {
          "lower": 23.937346518859634,
          "upper": 23.937346518859634
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 22.997418495952967,
        "coverage": 0.875,
        "bounds": {
          "lower": 20.122741183958848,
          "upper": 32.62274118395885
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12.333333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 26.079200889080784,
        "coverage": 0.75,
        "bounds": {
          "lower": 19.55940066681059,
          "upper": 44.55940066681059
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5.666666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 29.662323883371634,
        "coverage": 1,
        "bounds": {
          "lower": 29.662323883371634,
          "upper": 29.662323883371634
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.698412698412699,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 30.08785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 21.061500000000002,
          "upper": 51.06150000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 6.546383115758819,
          "upper": 56.54638311575882
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 86.26463332637329,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 39.377945852049045,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 3.937346518859634,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 50.12274118395885,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.009197174665298569
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-10",
    "asOf": "2019-10-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 23.644017627871754,
        "coverage": 1,
        "bounds": {
          "lower": 23.644017627871754,
          "upper": 23.644017627871754
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.833333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 28.816765757279104,
        "coverage": 0.875,
        "bounds": {
          "lower": 25.214670037619214,
          "upper": 37.714670037619214
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12.416666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 24.98676657015372,
        "coverage": 0.75,
        "bounds": {
          "lower": 18.74007492761529,
          "upper": 43.74007492761529
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5.75,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 27.01767554656822,
        "coverage": 1,
        "bounds": {
          "lower": 27.01767554656822,
          "upper": 27.01767554656822
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.785714285714286,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 34.20714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 23.945,
          "upper": 53.94500000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 6.4740778743454355,
          "upper": 56.47407787434543
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 84.34988614436409,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 39.903942700256465,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 3.6440176278717544,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 55.214670037619214,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.18349893644993287
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-11",
    "asOf": "2019-11-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 23.883624502370914,
        "coverage": 1,
        "bounds": {
          "lower": 23.883624502370914,
          "upper": 23.883624502370914
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 5.916666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 34.618375884825475,
        "coverage": 0.875,
        "bounds": {
          "lower": 30.29107889922229,
          "upper": 42.791078899222285
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12.5,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 25.509807397079538,
        "coverage": 0.75,
        "bounds": {
          "lower": 19.132355547809652,
          "upper": 44.13235554780965
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5.833333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 28.52852100315932,
        "coverage": 1,
        "bounds": {
          "lower": 28.52852100315932,
          "upper": 28.52852100315932
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.861111111111111,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 34.20714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 23.945,
          "upper": 53.94500000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 5.888522099774693,
          "upper": 55.88852209977469
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 82.37730514603578,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 36.09254560314863,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 3.883624502370914,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 60.291078899222285,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.2581002883297434
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2019-12",
    "asOf": "2019-12-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 60,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 24.96158246354507,
        "coverage": 1,
        "bounds": {
          "lower": 24.96158246354507,
          "upper": 24.96158246354507
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 40.399359310845,
        "coverage": 0.875,
        "bounds": {
          "lower": 35.349439396989375,
          "upper": 47.849439396989375
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12.583333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.235953021825846,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.426964766369384,
          "upper": 45.42696476636938
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 5.916666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 27.878111768141263,
        "coverage": 1,
        "bounds": {
          "lower": 27.878111768141263,
          "upper": 27.878111768141263
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.944444444444445,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 34.20714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 23.945,
          "upper": 53.94500000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 5.827626779940778,
          "upper": 55.82762677994078
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 79.9838467773112,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 34.53461769717569,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 5.311021860534446,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0.349439396989375,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 65.34943939698937,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.24183474165557772
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-01",
    "asOf": "2020-01-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 60,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 26.502614262417765,
        "coverage": 1,
        "bounds": {
          "lower": 26.502614262417765,
          "upper": 26.502614262417765
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.083333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 60.95050286654394,
        "coverage": 0.875,
        "bounds": {
          "lower": 53.33169000822595,
          "upper": 65.83169000822595
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12.666666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 26.796305339012665,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.0972290042595,
          "upper": 45.0972290042595
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 25.983389229124242,
        "coverage": 1,
        "bounds": {
          "lower": 25.983389229124242,
          "upper": 25.983389229124242
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.027777777777778,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.25785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.5805,
          "upper": 52.5805
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 7.923546146423686,
          "upper": 57.92354614642369
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 71.61269816422288,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 20.670924254191817,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 24.834304270643713,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 18.331690008225948,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 81.82907574580818,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "DETERIORATING",
      "weightedScore": 0.8,
      "scoreRange": {
        "lower": 0.8,
        "upper": 0.8
      },
      "dispersion": 2,
      "votes": {
        "growth": "STRONGLY_DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.2834421066726156
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-02",
    "asOf": "2020-02-29T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 60,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 27.09137368302939,
        "coverage": 1,
        "bounds": {
          "lower": 27.09137368302939,
          "upper": 27.09137368302939
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.166666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 61.76687396869256,
        "coverage": 0.875,
        "bounds": {
          "lower": 54.04601472260599,
          "upper": 66.54601472260599
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12.75,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 24.236706706954436,
        "coverage": 0.75,
        "bounds": {
          "lower": 18.177530030215827,
          "upper": 43.17753003021583
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6.083333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 23.358142305974003,
        "coverage": 1,
        "bounds": {
          "lower": 23.358142305974003,
          "upper": 23.358142305974003
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.103174603174603,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.25785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.5805,
          "upper": 52.5805
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 13.070952409015636,
          "upper": 63.07095240901563
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 71.60849826037816,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 20.5453589604234,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 26.137388405635377,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 19.04601472260599,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 81.9546410395766,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.7370027514290722
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-03",
    "asOf": "2020-03-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 60,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 20.405379120894366,
        "coverage": 1,
        "bounds": {
          "lower": 20.405379120894366,
          "upper": 20.405379120894366
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 89.212646929411,
        "coverage": 0.875,
        "bounds": {
          "lower": 78.06106606323462,
          "upper": 90.56106606323462
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12.833333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 50.22514102441582,
        "coverage": 0.75,
        "bounds": {
          "lower": 37.668855768311865,
          "upper": 62.668855768311865
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6.166666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 14.298154316016223,
        "coverage": 1,
        "bounds": {
          "lower": 14.298154316016223,
          "upper": 14.298154316016223
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.190476190476191,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 32.25785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 22.5805,
          "upper": 52.5805
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 2.6772760008263283,
          "upper": 52.677276000826325
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 64.89616046925855,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 0.40537912089436645,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 43.466445184128986,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "UNKNOWN",
        "support": 50.729921831546484,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 100,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "weightedScore": 1.6,
      "scoreRange": {
        "lower": 1.6,
        "upper": 1.6
      },
      "dispersion": 2,
      "votes": {
        "growth": "STRONGLY_DETERIORATING",
        "labor": "STRONGLY_DETERIORATING",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.7372685667319634
    },
    "transitionRisk": {
      "level": "ELEVATED",
      "reasonCodes": [
        "two_strongly_deteriorating_factors"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-04",
    "asOf": "2020-04-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "CONTRACTION_RECESSIONARY",
    "dataQuality": 60,
    "regimeClarity": 93,
    "factors": {
      "inflation": {
        "score": 10.440388597460476,
        "coverage": 1,
        "bounds": {
          "lower": 10.440388597460476,
          "upper": 10.440388597460476
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.333333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 85.71428571428571,
        "coverage": 0.875,
        "bounds": {
          "lower": 75,
          "upper": 87.5
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 12.916666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 100,
        "coverage": 0.75,
        "bounds": {
          "lower": 75,
          "upper": 100
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6.25,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 13.934393611097565,
        "coverage": 1,
        "bounds": {
          "lower": 13.934393611097565,
          "upper": 13.934393611097565
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.273809523809524,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 51.52357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 36.0665,
          "upper": 66.0665
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 60.5,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "TRUE",
        "support": 85,
        "failedOrUnknownGates": []
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 100,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "DETERIORATING",
      "weightedScore": 1,
      "scoreRange": {
        "lower": 1,
        "upper": 1
      },
      "dispersion": 2,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "STRONGLY_DETERIORATING",
        "credit": "DETERIORATING"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -3.389947305388785
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-05",
    "asOf": "2020-05-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "CONTRACTION_RECESSIONARY",
    "dataQuality": 60,
    "regimeClarity": 93,
    "factors": {
      "inflation": {
        "score": 9.06875852114415,
        "coverage": 1,
        "bounds": {
          "lower": 9.06875852114415,
          "upper": 9.06875852114415
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.416666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 85.71428571428571,
        "coverage": 0.875,
        "bounds": {
          "lower": 75,
          "upper": 87.5
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 100,
        "coverage": 0.75,
        "bounds": {
          "lower": 75,
          "upper": 100
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6.333333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 14.047635156378497,
        "coverage": 1,
        "bounds": {
          "lower": 14.047635156378497,
          "upper": 14.047635156378497
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.353174603174603,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 51.52357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 36.0665,
          "upper": 66.0665
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 60.5,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "TRUE",
        "support": 85,
        "failedOrUnknownGates": []
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 100,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -4.622643199513787
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-06",
    "asOf": "2020-06-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "CONTRACTION_RECESSIONARY",
    "dataQuality": 60,
    "regimeClarity": 93,
    "factors": {
      "inflation": {
        "score": 9.988410239806734,
        "coverage": 1,
        "bounds": {
          "lower": 9.988410239806734,
          "upper": 9.988410239806734
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 85.71428571428571,
        "coverage": 0.875,
        "bounds": {
          "lower": 75,
          "upper": 87.5
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13.083333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 100,
        "coverage": 0.75,
        "bounds": {
          "lower": 75,
          "upper": 100
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6.416666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 13.028425550405627,
        "coverage": 1,
        "bounds": {
          "lower": 13.028425550405627,
          "upper": 13.028425550405627
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.440476190476191,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 51.52357142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 36.0665,
          "upper": 66.0665
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 60.5,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "TRUE",
        "support": 85,
        "failedOrUnknownGates": []
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 100,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -2.4031919736260177
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-07",
    "asOf": "2020-07-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 60,
    "regimeClarity": 89,
    "factors": {
      "inflation": {
        "score": 13.978801981893854,
        "coverage": 1,
        "bounds": {
          "lower": 13.978801981893854,
          "upper": 13.978801981893854
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.583333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 28.571428571428573,
        "coverage": 0.875,
        "bounds": {
          "lower": 25,
          "upper": 37.5
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13.166666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 100,
        "coverage": 0.75,
        "bounds": {
          "lower": 75,
          "upper": 100
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6.5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 7.816645648064215,
        "coverage": 1,
        "bounds": {
          "lower": 7.816645648064215,
          "upper": 7.816645648064215
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.527777777777778,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 61.82285714285714,
        "coverage": 0.7,
        "bounds": {
          "lower": 43.275999999999996,
          "upper": 73.276
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 75.5,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 40,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 45,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 100,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 100,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [
      {
        "code": "activity_labor_divergence",
        "severity": 70,
        "scope": "core",
        "clarityRole": "DEFINING_EVIDENCE"
      },
      {
        "code": "activity_credit_tension",
        "severity": 55,
        "scope": "core",
        "clarityRole": "RESIDUAL_TENSION"
      }
    ],
    "leadingDirection": {
      "direction": "IMPROVING",
      "weightedScore": -0.6,
      "scoreRange": {
        "lower": -0.6,
        "upper": -0.6
      },
      "dispersion": 3,
      "votes": {
        "growth": "STRONGLY_IMPROVING",
        "labor": "NEUTRAL",
        "credit": "DETERIORATING"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 3.6261948218189066
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-08",
    "asOf": "2020-08-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 60,
    "regimeClarity": 67,
    "factors": {
      "inflation": {
        "score": 16.98095452461003,
        "coverage": 1,
        "bounds": {
          "lower": 16.98095452461003,
          "upper": 16.98095452461003
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.666666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 9.651013627870995,
        "coverage": 0.875,
        "bounds": {
          "lower": 8.44463692438712,
          "upper": 20.94463692438712
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13.25,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 46.64284984753101,
        "coverage": 0.75,
        "bounds": {
          "lower": 34.98213738564826,
          "upper": 59.98213738564826
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6.583333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 4.574350956675083,
        "coverage": 1,
        "bounds": {
          "lower": 4.574350956675083,
          "upper": 4.574350956675083
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.611111111111111,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 61.82285714285714,
        "coverage": 0.7,
        "bounds": {
          "lower": 43.275999999999996,
          "upper": 73.276
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 86.50535878430551,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 20.017862614351742,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 4.982137385648258,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 59.98213738564826,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [
      {
        "code": "activity_credit_tension",
        "severity": 55,
        "scope": "core",
        "clarityRole": "RESIDUAL_TENSION"
      }
    ],
    "leadingDirection": {
      "direction": "IMPROVING",
      "weightedScore": -1.2,
      "scoreRange": {
        "lower": -1.2,
        "upper": -1.2
      },
      "dispersion": 2,
      "votes": {
        "growth": "IMPROVING",
        "labor": "STRONGLY_IMPROVING",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 5.973915901904747
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-09",
    "asOf": "2020-09-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 60,
    "regimeClarity": 67,
    "factors": {
      "inflation": {
        "score": 17.720372411893784,
        "coverage": 1,
        "bounds": {
          "lower": 17.720372411893784,
          "upper": 17.720372411893784
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 14.285714285714286,
        "coverage": 0.875,
        "bounds": {
          "lower": 12.5,
          "upper": 25
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13.333333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 43.86666666666667,
        "coverage": 0.75,
        "bounds": {
          "lower": 32.9,
          "upper": 57.9
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6.666666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 4.345677834952278,
        "coverage": 1,
        "bounds": {
          "lower": 4.345677834952278,
          "upper": 4.345677834952278
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.694444444444445,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 61.82285714285714,
        "coverage": 0.7,
        "bounds": {
          "lower": 43.275999999999996,
          "upper": 73.276
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 87.13,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 22.1,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 2.8999999999999986,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 57.9,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [
      {
        "code": "activity_credit_tension",
        "severity": 55,
        "scope": "core",
        "clarityRole": "RESIDUAL_TENSION"
      }
    ],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 5.021010250970526
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-10",
    "asOf": "2020-10-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 60,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 16.251159226916002,
        "coverage": 1,
        "bounds": {
          "lower": 16.251159226916002,
          "upper": 16.251159226916002
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.833333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 14.857142857142858,
        "coverage": 0.875,
        "bounds": {
          "lower": 13,
          "upper": 25.5
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13.416666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 41.766666666666666,
        "coverage": 0.75,
        "bounds": {
          "lower": 31.325,
          "upper": 56.325
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6.75,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 5.520421184681119,
        "coverage": 1,
        "bounds": {
          "lower": 5.520421184681119,
          "upper": 5.520421184681119
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.777777777777778,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 53.88214285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 37.7175,
          "upper": 67.7175
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 5.601298501952787,
          "upper": 55.60129850195278
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 85.72211044941417,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 23.674999999999997,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 1.3249999999999993,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 56.325,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.050107272257160496
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-11",
    "asOf": "2020-11-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 60,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 16.586909624836682,
        "coverage": 1,
        "bounds": {
          "lower": 16.586909624836682,
          "upper": 16.586909624836682
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 6.916666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 14.857142857142858,
        "coverage": 0.875,
        "bounds": {
          "lower": 13,
          "upper": 25.5
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13.5,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 41.3,
        "coverage": 0.75,
        "bounds": {
          "lower": 30.974999999999998,
          "upper": 55.974999999999994
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6.833333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 6.259238221957519,
        "coverage": 1,
        "bounds": {
          "lower": 6.259238221957519,
          "upper": 6.259238221957519
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.853174603174603,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 53.88214285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 37.7175,
          "upper": 67.7175
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 2.8326745781561087,
          "upper": 52.83267457815611
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 86.65769762655316,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 24.025000000000006,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0.9749999999999979,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 55.974999999999994,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -2.0744484965270593
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2020-12",
    "asOf": "2020-12-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 60,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 17.491458551386987,
        "coverage": 1,
        "bounds": {
          "lower": 17.491458551386987,
          "upper": 17.491458551386987
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 14.857142857142858,
        "coverage": 0.875,
        "bounds": {
          "lower": 13,
          "upper": 25.5
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13.583333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 41.3,
        "coverage": 0.75,
        "bounds": {
          "lower": 30.974999999999998,
          "upper": 55.974999999999994
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 6.916666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 3.8513119236594004,
        "coverage": 1,
        "bounds": {
          "lower": 3.8513119236594004,
          "upper": 3.8513119236594004
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.940476190476191,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 53.88214285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 37.7175,
          "upper": 67.7175
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 1.3254874527381775,
          "upper": 51.32548745273818
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 87.10985376417854,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 24.025000000000006,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0.9749999999999979,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 55.974999999999994,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -2.0128524071991283
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-01",
    "asOf": "2021-01-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 60,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 17.288310836382998,
        "coverage": 1,
        "bounds": {
          "lower": 17.288310836382998,
          "upper": 17.288310836382998
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.083333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 0.9212521560381833,
        "coverage": 0.875,
        "bounds": {
          "lower": 0.8060956365334104,
          "upper": 13.30609563653341
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13.666666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 43.725588205962964,
        "coverage": 0.75,
        "bounds": {
          "lower": 32.79419115447222,
          "upper": 57.79419115447222
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 3.34770487862055,
        "coverage": 1,
        "bounds": {
          "lower": 3.34770487862055,
          "upper": 3.34770487862055
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.015873015873016,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 42.64428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 29.851000000000003,
          "upper": 59.851000000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 87.16174265365834,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 22.205808845527777,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 2.794191154472223,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 57.79419115447222,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "IMPROVING",
      "weightedScore": -0.6,
      "scoreRange": {
        "lower": -0.6,
        "upper": -0.6
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "IMPROVING"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.47213666122204456
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-02",
    "asOf": "2021-02-28T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 60,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 18.16816766991225,
        "coverage": 1,
        "bounds": {
          "lower": 18.16816766991225,
          "upper": 18.16816766991225
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.166666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 3.545487707731964,
        "coverage": 0.875,
        "bounds": {
          "lower": 3.1023017442654686,
          "upper": 15.602301744265468
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13.75,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 53.7483707987206,
        "coverage": 0.75,
        "bounds": {
          "lower": 40.31127809904045,
          "upper": 65.31127809904045
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7.083333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 2.9910226122374706,
        "coverage": 1,
        "bounds": {
          "lower": 2.9910226122374706,
          "upper": 2.9910226122374706
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.091269841269842,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 42.64428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 29.851000000000003,
          "upper": 59.851000000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 1.3091817983090062,
          "upper": 51.309181798309005
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 84.51386203079517,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 14.68872190095955,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 5.31127809904045,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 10.31127809904045,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 65.31127809904045,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "DETERIORATING",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.33151478780111265
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": true,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-03",
    "asOf": "2021-03-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 60,
    "regimeClarity": 78,
    "factors": {
      "inflation": {
        "score": 29.024342538192833,
        "coverage": 1,
        "bounds": {
          "lower": 29.024342538192833,
          "upper": 29.024342538192833
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 14.457327078535737,
        "coverage": 0.875,
        "bounds": {
          "lower": 12.65016119371877,
          "upper": 25.15016119371877
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13.833333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.24956482203468,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.43717361652601,
          "upper": 45.43717361652601
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7.166666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 4.25,
        "coverage": 1,
        "bounds": {
          "lower": 4.25,
          "upper": 4.25
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.182539682539682,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 42.64428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 29.851000000000003,
          "upper": 59.851000000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 88.79661216845827,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 43.58716892166682,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 9.024342538192833,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 45.97565746180717,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 3,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "STRONGLY_IMPROVING",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.7037556051744942
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-04",
    "asOf": "2021-04-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 60,
    "regimeClarity": 88,
    "factors": {
      "inflation": {
        "score": 55.10965309059038,
        "coverage": 1,
        "bounds": {
          "lower": 55.10965309059038,
          "upper": 55.10965309059038
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.333333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 25.101444544664087,
        "coverage": 0.875,
        "bounds": {
          "lower": 21.963763976581077,
          "upper": 34.46376397658108
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 13.916666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 21.653048458019374,
        "coverage": 0.75,
        "bounds": {
          "lower": 16.23978634351453,
          "upper": 41.23978634351453
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7.25,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 3.125,
        "coverage": 1,
        "bounds": {
          "lower": 3.125,
          "upper": 3.125
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.26984126984127,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.263571428571435,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.484500000000004,
          "upper": 50.48450000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 73.28773196101803,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 73.86986674707585,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 35.10965309059038,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 21.8541108859907,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.2,
      "scoreRange": {
        "lower": 0.2,
        "upper": 0.2
      },
      "dispersion": 2,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "IMPROVING"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 2.9359767211720396
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-05",
    "asOf": "2021-05-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 60,
    "regimeClarity": 94,
    "factors": {
      "inflation": {
        "score": 66.03406120696454,
        "coverage": 1,
        "bounds": {
          "lower": 66.03406120696454,
          "upper": 66.03406120696454
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.416666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 0.15486676679955355,
        "coverage": 0.875,
        "bounds": {
          "lower": 0.13550842094960935,
          "upper": 12.63550842094961
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 20.066666666666666,
        "coverage": 0.75,
        "bounds": {
          "lower": 15.049999999999999,
          "upper": 40.05
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7.333333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 1.8750000000000002,
        "coverage": 1,
        "bounds": {
          "lower": 1.8750000000000002,
          "upper": 1.8750000000000002
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.34920634920635,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.263571428571435,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.484500000000004,
          "upper": 50.48450000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 0,
          "upper": 50
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 71.96796939651773,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 85.98406120696454,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 46.03406120696454,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 8.965938793035463,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "IMPROVING",
      "weightedScore": -0.8,
      "scoreRange": {
        "lower": -0.8,
        "upper": -0.8
      },
      "dispersion": 2,
      "votes": {
        "growth": "STRONGLY_IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 4.33083977601768
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-06",
    "asOf": "2021-06-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 60,
    "regimeClarity": 95,
    "factors": {
      "inflation": {
        "score": 72.56493075826819,
        "coverage": 1,
        "bounds": {
          "lower": 72.56493075826819,
          "upper": 72.56493075826819
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 14.285714285714286,
        "coverage": 0.875,
        "bounds": {
          "lower": 12.5,
          "upper": 25
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14.083333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 20.53333333333333,
        "coverage": 0.75,
        "bounds": {
          "lower": 15.399999999999999,
          "upper": 40.4
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7.416666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 2.1250000000000004,
        "coverage": 1,
        "bounds": {
          "lower": 2.1250000000000004,
          "upper": 2.1250000000000004
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.436507936507937,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 29.263571428571435,
        "coverage": 0.7,
        "bounds": {
          "lower": 20.484500000000004,
          "upper": 50.48450000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 1.4160514615335185,
          "upper": 51.41605146153352
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 68.17271918240586,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 89.6,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 2.43506924173181,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 5.206856874979248
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-07",
    "asOf": "2021-07-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 60,
    "regimeClarity": 96,
    "factors": {
      "inflation": {
        "score": 72.49348463917237,
        "coverage": 1,
        "bounds": {
          "lower": 72.49348463917237,
          "upper": 72.49348463917237
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.583333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 18,
        "coverage": 0.875,
        "bounds": {
          "lower": 15.75,
          "upper": 28.25
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14.166666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 18.2,
        "coverage": 0.75,
        "bounds": {
          "lower": 13.649999999999999,
          "upper": 38.65
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7.5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 0,
        "coverage": 1,
        "bounds": {
          "lower": 0,
          "upper": 0
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.51984126984127,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 16.625,
        "coverage": 0.7,
        "bounds": {
          "lower": 11.6375,
          "upper": 41.6375
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 6.536169930256586,
          "upper": 56.536169930256584
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 68.86700768041382,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 91.35,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 2.5065153608276347,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.2,
      "scoreRange": {
        "lower": -0.2,
        "upper": -0.2
      },
      "dispersion": 1,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "IMPROVING"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 1.5450184305132009
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-08",
    "asOf": "2021-08-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 60,
    "regimeClarity": 93,
    "factors": {
      "inflation": {
        "score": 71.89225437599808,
        "coverage": 1,
        "bounds": {
          "lower": 71.89225437599808,
          "upper": 71.89225437599808
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.666666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 18.788154064223637,
        "coverage": 0.875,
        "bounds": {
          "lower": 16.43963480619568,
          "upper": 28.93963480619568
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14.25,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 16.8,
        "coverage": 0.75,
        "bounds": {
          "lower": 12.6,
          "upper": 37.6
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7.583333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 0,
        "coverage": 1,
        "bounds": {
          "lower": 0,
          "upper": 0
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.607142857142858,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 16.625,
        "coverage": 0.7,
        "bounds": {
          "lower": 11.6375,
          "upper": 41.6375
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 15.534256001736924,
          "upper": 65.53425600173692
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 69.20676888952269,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 84.29225437599808,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 41.89225437599808,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 3.1077456240019217,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.3620183370166012
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-09",
    "asOf": "2021-09-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 92,
    "factors": {
      "inflation": {
        "score": 72.636491403729,
        "coverage": 1,
        "bounds": {
          "lower": 72.636491403729,
          "upper": 72.636491403729
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 30.323980093234756,
        "coverage": 0.875,
        "bounds": {
          "lower": 26.53348258158041,
          "upper": 39.033482581580415
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14.333333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 14.583333333333334,
        "coverage": 0.75,
        "bounds": {
          "lower": 10.9375,
          "upper": 35.9375
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7.666666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 0.2500000000000002,
        "coverage": 1,
        "bounds": {
          "lower": 0.2500000000000002,
          "upper": 0.2500000000000002
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.69047619047619,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 16.625,
        "coverage": 0.7,
        "bounds": {
          "lower": 11.6375,
          "upper": 41.6375
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 16.116915818596304,
          "upper": 66.11691581859631
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 65.29586126550333,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 81.698991403729,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 42.636491403728996,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 8.896991177851415,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -4.485730713308932
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-10",
    "asOf": "2021-10-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 94,
    "factors": {
      "inflation": {
        "score": 78.35155229557199,
        "coverage": 1,
        "bounds": {
          "lower": 78.35155229557199,
          "upper": 78.35155229557199
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.833333333333333,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 32.40335665792906,
        "coverage": 0.875,
        "bounds": {
          "lower": 28.352937075687926,
          "upper": 40.852937075687926
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14.416666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 13.416666666666666,
        "coverage": 0.75,
        "bounds": {
          "lower": 10.0625,
          "upper": 35.0625
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7.75,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 0.5625000000000004,
        "coverage": 1,
        "bounds": {
          "lower": 0.5625000000000004,
          "upper": 0.5625000000000004
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.76984126984127,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 17.787857142857145,
        "coverage": 0.7,
        "bounds": {
          "lower": 12.451500000000001,
          "upper": 42.4515
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 14.239494810559892,
          "upper": 64.23949481055989
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 63.40462516972483,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 87.49861521988407,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 48.35155229557199,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 8.352937075687926,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -2.209851801622553
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-11",
    "asOf": "2021-11-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 94,
    "factors": {
      "inflation": {
        "score": 82.44911330588346,
        "coverage": 1,
        "bounds": {
          "lower": 82.44911330588346,
          "upper": 82.44911330588346
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 7.916666666666667,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 34.41404133974785,
        "coverage": 0.875,
        "bounds": {
          "lower": 30.11228617227937,
          "upper": 42.61228617227937
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14.5,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 11.08333333333333,
        "coverage": 0.75,
        "bounds": {
          "lower": 8.312499999999998,
          "upper": 33.3125
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7.833333333333333,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 0,
        "coverage": 1,
        "bounds": {
          "lower": 0,
          "upper": 0
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.84920634920635,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 17.787857142857145,
        "coverage": 0.7,
        "bounds": {
          "lower": 12.451500000000001,
          "upper": 42.4515
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 13.190637839314729,
          "upper": 63.19063783931473
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 63.22588553108825,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 87.38771382772063,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 10.112286172279369,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.5521566662831434
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2021-12",
    "asOf": "2021-12-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 98,
    "factors": {
      "inflation": {
        "score": 85.69244980794568,
        "coverage": 1,
        "bounds": {
          "lower": 85.69244980794568,
          "upper": 85.69244980794568
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 19.542223647920224,
        "coverage": 0.875,
        "bounds": {
          "lower": 17.099445691930196,
          "upper": 29.599445691930196
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14.583333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 9.916666666666666,
        "coverage": 0.75,
        "bounds": {
          "lower": 7.437499999999999,
          "upper": 32.4375
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 7.916666666666667,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 0.2500000000000002,
        "coverage": 1,
        "bounds": {
          "lower": 0.2500000000000002,
          "upper": 0.2500000000000002
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.936507936507937,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 17.787857142857145,
        "coverage": 0.7,
        "bounds": {
          "lower": 12.451500000000001,
          "upper": 42.4515
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 16.854794157022358,
          "upper": 66.85479415702235
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 68.69352172322792,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 95.4005543080698,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 3.8658235306505024
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-01",
    "asOf": "2022-01-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 61,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 88.96150733100207,
        "coverage": 1,
        "bounds": {
          "lower": 88.96150733100207,
          "upper": 88.96150733100207
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.083333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 48.67211825042502,
        "coverage": 0.875,
        "bounds": {
          "lower": 42.5881034691219,
          "upper": 55.0881034691219
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14.666666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 10.499999999999998,
        "coverage": 0.75,
        "bounds": {
          "lower": 7.874999999999999,
          "upper": 32.875
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 4.25,
        "coverage": 1,
        "bounds": {
          "lower": 4.25,
          "upper": 4.25
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.015873015873016,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 17.620714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 12.334499999999998,
          "upper": 42.334500000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 19.910547550919656,
          "upper": 69.91054755091966
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 58.40190861235124,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "UNKNOWN",
        "support": 74.9118965308781,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 57.5881034691219,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 7.588103469121897,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 22.588103469121897,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "DETERIORATING",
      "weightedScore": 0.8,
      "scoreRange": {
        "lower": 0.8,
        "upper": 0.8
      },
      "dispersion": 2,
      "votes": {
        "growth": "STRONGLY_DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 2.5344827398629866
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-02",
    "asOf": "2022-02-28T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 61,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 91.00074046905776,
        "coverage": 1,
        "bounds": {
          "lower": 91.00074046905776,
          "upper": 91.00074046905776
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.166666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 61.3886932836344,
        "coverage": 0.875,
        "bounds": {
          "lower": 53.715106623180105,
          "upper": 66.2151066231801
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14.75,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 9.916666666666666,
        "coverage": 0.75,
        "bounds": {
          "lower": 7.437499999999999,
          "upper": 32.4375
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8.083333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 6.1875,
        "coverage": 1,
        "bounds": {
          "lower": 6.1875,
          "upper": 6.1875
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.091269841269842,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 17.620714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 12.334499999999998,
          "upper": 42.334500000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 22.758744775860738,
          "upper": 72.75874477586073
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 54.08235735072796,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 63.784893376819895,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "UNKNOWN",
        "support": 68.7151066231801,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 18.715106623180105,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 33.715106623180105,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.9350565829224111
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-03",
    "asOf": "2022-03-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 61,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 91.48153959534352,
        "coverage": 1,
        "bounds": {
          "lower": 91.48153959534352,
          "upper": 91.48153959534352
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 66.86823090889577,
        "coverage": 0.875,
        "bounds": {
          "lower": 58.509702045283795,
          "upper": 71.0097020452838
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14.833333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 8.75,
        "coverage": 0.75,
        "bounds": {
          "lower": 6.5625,
          "upper": 31.5625
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8.166666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 4.3125,
        "coverage": 1,
        "bounds": {
          "lower": 4.3125,
          "upper": 4.3125
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.182539682539682,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 17.620714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 12.334499999999998,
          "upper": 42.334500000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 28.26777909212594,
          "upper": 78.26777909212595
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 52.42701918188648,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 58.9902979547162,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 73.5097020452838,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 23.509702045283795,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 38.509702045283795,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 96.80776163622704,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [
      {
        "code": "activity_labor_divergence",
        "severity": 70,
        "scope": "core",
        "clarityRole": "DEFINING_EVIDENCE"
      }
    ],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.698927440049391
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-04",
    "asOf": "2022-04-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 61,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 89.76696524405733,
        "coverage": 1,
        "bounds": {
          "lower": 89.76696524405733,
          "upper": 89.76696524405733
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.333333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 45.16182237319409,
        "coverage": 0.875,
        "bounds": {
          "lower": 39.51659457654483,
          "upper": 52.01659457654483
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 14.916666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 8.75,
        "coverage": 0.75,
        "bounds": {
          "lower": 6.5625,
          "upper": 31.5625
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8.25,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 11.125,
        "coverage": 1,
        "bounds": {
          "lower": 11.125,
          "upper": 11.125
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.261904761904763,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 22.341428571428573,
        "coverage": 0.7,
        "bounds": {
          "lower": 15.639,
          "upper": 45.639
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 34.96157480457615,
          "upper": 84.96157480457614
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 59.03291216938207,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "UNKNOWN",
        "support": 77.98340542345517,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 54.51659457654483,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 4.516594576544833,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 19.516594576544833,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "IMPROVING",
      "weightedScore": -0.8,
      "scoreRange": {
        "lower": -0.8,
        "upper": -0.8
      },
      "dispersion": 2,
      "votes": {
        "growth": "STRONGLY_IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.7360583661951363
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-05",
    "asOf": "2022-05-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 94,
    "factors": {
      "inflation": {
        "score": 89.21776355449552,
        "coverage": 1,
        "bounds": {
          "lower": 89.21776355449552,
          "upper": 89.21776355449552
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.416666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 35.905651651855045,
        "coverage": 0.875,
        "bounds": {
          "lower": 31.417445195373162,
          "upper": 43.91744519537316
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 8.715719436791519,
        "coverage": 0.75,
        "bounds": {
          "lower": 6.536789577593639,
          "upper": 31.536789577593638
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8.333333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 15.125,
        "coverage": 1,
        "bounds": {
          "lower": 15.125,
          "upper": 15.125
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.345238095238095,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 22.341428571428573,
        "coverage": 0.7,
        "bounds": {
          "lower": 15.639,
          "upper": 45.639
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 42.1816784286708,
          "upper": 92.1816784286708
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 62.28028504857265,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 86.08255480462684,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 11.417445195373162,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.7820832629696808
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-06",
    "asOf": "2022-06-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 89.6708892047062,
        "coverage": 1,
        "bounds": {
          "lower": 89.6708892047062,
          "upper": 89.6708892047062
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 40.79505832154465,
        "coverage": 0.875,
        "bounds": {
          "lower": 35.69567603135157,
          "upper": 48.19567603135157
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15.083333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 9.854199284043018,
        "coverage": 0.75,
        "bounds": {
          "lower": 7.390649463032263,
          "upper": 32.39064946303226
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8.416666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 20.3125,
        "coverage": 1,
        "bounds": {
          "lower": 20.3125,
          "upper": 20.3125
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.428571428571429,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 22.341428571428573,
        "coverage": 0.7,
        "bounds": {
          "lower": 15.639,
          "upper": 45.639
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 45.54880033135112,
          "upper": 95.54880033135112
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 60.31283474854969,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 81.80432396864843,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50.69567603135157,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0.6956760313515673,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 15.695676031351567,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [
      {
        "code": "inflation_pace_divergence",
        "severity": 40,
        "scope": "core",
        "clarityRole": "RESIDUAL_TENSION"
      }
    ],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.6205641007762219
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-07",
    "asOf": "2022-07-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 61,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 89.09861500671292,
        "coverage": 1,
        "bounds": {
          "lower": 89.09861500671292,
          "upper": 89.09861500671292
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.583333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 44.64140279254025,
        "coverage": 0.875,
        "bounds": {
          "lower": 39.06122744347272,
          "upper": 51.56122744347272
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15.166666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 9.707853487900032,
        "coverage": 0.75,
        "bounds": {
          "lower": 7.280890115925024,
          "upper": 32.280890115925025
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8.5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 19.8125,
        "coverage": 1,
        "bounds": {
          "lower": 19.8125,
          "upper": 19.8125
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.507936507936508,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 35.99714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 25.198,
          "upper": 55.19800000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 47.47001108172558,
          "upper": 97.47001108172557
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 56.131841987833404,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "UNKNOWN",
        "support": 78.43877255652728,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 54.06122744347272,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 4.061227443472717,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 19.061227443472717,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.2,
      "scoreRange": {
        "lower": 0.2,
        "upper": 0.2
      },
      "dispersion": 1,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "DETERIORATING"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.7491101309693544
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-08",
    "asOf": "2022-08-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 61,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 90.48809837237445,
        "coverage": 1,
        "bounds": {
          "lower": 90.48809837237445,
          "upper": 90.48809837237445
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.666666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 44.82262745304909,
        "coverage": 0.875,
        "bounds": {
          "lower": 39.21979902141795,
          "upper": 51.71979902141795
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15.25,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 9.497222997320891,
        "coverage": 0.75,
        "bounds": {
          "lower": 7.122917247990669,
          "upper": 32.12291724799067
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8.583333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 17.6875,
        "coverage": 1,
        "bounds": {
          "lower": 17.6875,
          "upper": 17.6875
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.59920634920635,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 35.99714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 25.198,
          "upper": 55.19800000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 47.21018860832403,
          "upper": 97.21018860832403
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 56.115805217035614,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "UNKNOWN",
        "support": 78.28020097858206,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 54.21979902141795,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 4.219799021417948,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 19.21979902141795,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 1.2839665993673703
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-09",
    "asOf": "2022-09-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 91.86500468850409,
        "coverage": 1,
        "bounds": {
          "lower": 91.86500468850409,
          "upper": 91.86500468850409
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 38.29467244399369,
        "coverage": 0.875,
        "bounds": {
          "lower": 33.50783838849448,
          "upper": 46.00783838849448
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15.333333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 8.500741381147984,
        "coverage": 0.75,
        "bounds": {
          "lower": 6.375556035860988,
          "upper": 31.37555603586099
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8.666666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 26.25,
        "coverage": 1,
        "bounds": {
          "lower": 26.25,
          "upper": 26.25
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.682539682539682,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 35.99714285714286,
        "coverage": 0.7,
        "bounds": {
          "lower": 25.198,
          "upper": 55.19800000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 44.83383660160644,
          "upper": 94.83383660160644
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 58.62479783384391,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 83.99216161150552,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 13.507838388494477,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.701025089602914
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-10",
    "asOf": "2022-10-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 85,
    "factors": {
      "inflation": {
        "score": 90.46944231514527,
        "coverage": 1,
        "bounds": {
          "lower": 90.46944231514527,
          "upper": 90.46944231514527
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.833333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 30.287498622284282,
        "coverage": 0.875,
        "bounds": {
          "lower": 26.501561294498746,
          "upper": 39.00156129449874
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15.416666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 11.28482657350627,
        "coverage": 0.75,
        "bounds": {
          "lower": 8.463619930129703,
          "upper": 33.4636199301297
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8.75,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 32.5,
        "coverage": 1,
        "bounds": {
          "lower": 32.5,
          "upper": 32.5
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.761904761904763,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 44.775714285714294,
        "coverage": 0.7,
        "bounds": {
          "lower": 31.343000000000004,
          "upper": 61.343
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 44.21774003002584,
          "upper": 94.21774003002584
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 58.95738950316159,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 90.99843870550126,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 6.501561294498746,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [
      {
        "code": "activity_credit_tension",
        "severity": 55,
        "scope": "core",
        "clarityRole": "RESIDUAL_TENSION"
      }
    ],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.2,
      "scoreRange": {
        "lower": -0.2,
        "upper": -0.2
      },
      "dispersion": 2,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "DETERIORATING"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.18558364068591615
    },
    "transitionRisk": {
      "level": "ELEVATED",
      "reasonCodes": [
        "rate_shock_with_deterioration"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-11",
    "asOf": "2022-11-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 84,
    "factors": {
      "inflation": {
        "score": 88.2499994047326,
        "coverage": 1,
        "bounds": {
          "lower": 88.2499994047326,
          "upper": 88.2499994047326
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 8.916666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 32.45752478239338,
        "coverage": 0.875,
        "bounds": {
          "lower": 28.400334184594207,
          "upper": 40.90033418459421
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15.5,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 14.68670961822103,
        "coverage": 0.75,
        "bounds": {
          "lower": 11.015032213665773,
          "upper": 36.015032213665776
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8.833333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 34.99978737654862,
        "coverage": 1,
        "bounds": {
          "lower": 34.99978737654862,
          "upper": 34.99978737654862
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.841269841269842,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 44.775714285714294,
        "coverage": 0.7,
        "bounds": {
          "lower": 31.343000000000004,
          "upper": 61.343
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 45.184824664081695,
          "upper": 95.1848246640817
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 57.432456662062584,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 88.98496778633422,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 8.400334184594207,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [
      {
        "code": "activity_credit_tension",
        "severity": 55,
        "scope": "core",
        "clarityRole": "RESIDUAL_TENSION"
      }
    ],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.3028413075984906
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2022-12",
    "asOf": "2022-12-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 61,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 85.47615957675595,
        "coverage": 1,
        "bounds": {
          "lower": 85.47615957675595,
          "upper": 85.47615957675595
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 45.95001586274496,
        "coverage": 0.875,
        "bounds": {
          "lower": 40.20626387990184,
          "upper": 52.70626387990184
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15.583333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 17.44530361966608,
        "coverage": 0.75,
        "bounds": {
          "lower": 13.083977714749562,
          "upper": 38.083977714749565
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 8.916666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 37.40004942487417,
        "coverage": 1,
        "bounds": {
          "lower": 37.40004942487417,
          "upper": 37.40004942487417
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.924603174603174,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 44.775714285714294,
        "coverage": 0.7,
        "bounds": {
          "lower": 31.343000000000004,
          "upper": 61.343
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 46.84648881806496,
          "upper": 96.84648881806496
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 50.8893764211773,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "UNKNOWN",
        "support": 77.29373612009816,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 55.20626387990184,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 5.20626387990184,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 20.20626387990184,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.2373269711681623
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-01",
    "asOf": "2023-01-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 61,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 84.68612288821537,
        "coverage": 1,
        "bounds": {
          "lower": 84.68612288821537,
          "upper": 84.68612288821537
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.083333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 44.50270550261525,
        "coverage": 0.875,
        "bounds": {
          "lower": 38.939867314788344,
          "upper": 51.439867314788344
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15.666666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 16.912564009999254,
        "coverage": 0.75,
        "bounds": {
          "lower": 12.68442300749944,
          "upper": 37.68442300749944
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 36.95813044391977,
        "coverage": 1,
        "bounds": {
          "lower": 36.95813044391977,
          "upper": 36.95813044391977
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.003968253968255,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 52.267142857142865,
        "coverage": 0.7,
        "bounds": {
          "lower": 36.587,
          "upper": 66.587
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 46.55648646256693,
          "upper": 96.55648646256694
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 50.16356094987494,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "UNKNOWN",
        "support": 78.56013268521166,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 53.939867314788344,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 3.9398673147883443,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 18.939867314788344,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.3543963309999514
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-02",
    "asOf": "2023-02-28T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 93,
    "factors": {
      "inflation": {
        "score": 83.2254067605021,
        "coverage": 1,
        "bounds": {
          "lower": 83.2254067605021,
          "upper": 83.2254067605021
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.166666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 36.93757133408581,
        "coverage": 0.875,
        "bounds": {
          "lower": 32.32037491732508,
          "upper": 44.82037491732508
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15.75,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 17.92348888182668,
        "coverage": 0.75,
        "bounds": {
          "lower": 13.442616661370012,
          "upper": 38.44261666137001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9.083333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 41.456474942596145,
        "coverage": 1,
        "bounds": {
          "lower": 41.456474942596145,
          "upper": 41.456474942596145
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.079365079365079,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 52.267142857142865,
        "coverage": 0.7,
        "bounds": {
          "lower": 36.587,
          "upper": 66.587
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 45.61131783315543,
          "upper": 95.61131783315543
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 50.334727563360886,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 85.17962508267492,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 12.320374917325083,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.005671922366901505
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-03",
    "asOf": "2023-03-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 96,
    "factors": {
      "inflation": {
        "score": 80.8051097714882,
        "coverage": 1,
        "bounds": {
          "lower": 80.8051097714882,
          "upper": 80.8051097714882
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 21.480468011001996,
        "coverage": 0.875,
        "bounds": {
          "lower": 18.795409509626747,
          "upper": 31.295409509626747
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15.833333333333334,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 17.143246719924463,
        "coverage": 0.75,
        "bounds": {
          "lower": 12.857435039943347,
          "upper": 37.85743503994335
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9.166666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 41.37567094683854,
        "coverage": 1,
        "bounds": {
          "lower": 41.37567094683854,
          "upper": 41.37567094683854
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.170634920634921,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 52.267142857142865,
        "coverage": 0.7,
        "bounds": {
          "lower": 36.587,
          "upper": 66.587
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 46.70427692136731,
          "upper": 96.70427692136731
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 55.960670210747026,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 92.14256496005666,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.6679539833980286
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-04",
    "asOf": "2023-04-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 96,
    "factors": {
      "inflation": {
        "score": 80.49883887545877,
        "coverage": 1,
        "bounds": {
          "lower": 80.49883887545877,
          "upper": 80.49883887545877
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.333333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 18.79806122360367,
        "coverage": 0.875,
        "bounds": {
          "lower": 16.448303570653213,
          "upper": 28.948303570653213
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 15.916666666666666,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 18.457336793889038,
        "coverage": 0.75,
        "bounds": {
          "lower": 13.843002595416777,
          "upper": 38.84300259541678
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9.25,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 39.89479072787999,
        "coverage": 1,
        "bounds": {
          "lower": 39.89479072787999,
          "upper": 39.89479072787999
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 57.003571428571426,
        "coverage": 0.7,
        "bounds": {
          "lower": 39.902499999999996,
          "upper": 69.9025
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 49.399011736941844,
          "upper": 99.39901173694184
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 56.34963242917368,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 91.15699740458322,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 50,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.44488036247161133
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-05",
    "asOf": "2023-05-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 94,
    "factors": {
      "inflation": {
        "score": 77.7901912158801,
        "coverage": 1,
        "bounds": {
          "lower": 77.7901912158801,
          "upper": 77.7901912158801
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.416666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 20.80084482577266,
        "coverage": 0.875,
        "bounds": {
          "lower": 18.20073922255108,
          "upper": 30.70073922255108
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 21.850208274107114,
        "coverage": 0.75,
        "bounds": {
          "lower": 16.387656205580335,
          "upper": 41.387656205580335
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9.333333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 45.5127436801646,
        "coverage": 1,
        "bounds": {
          "lower": 45.5127436801646,
          "upper": 45.5127436801646
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.337301587301587,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 57.003571428571426,
        "coverage": 0.7,
        "bounds": {
          "lower": 39.902499999999996,
          "upper": 69.9025
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 50,
          "upper": 100
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 52.07628560922317,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 86.40253501029977,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 47.7901912158801,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.3627647316690963
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-06",
    "asOf": "2023-06-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 69.37257761317535,
        "coverage": 1,
        "bounds": {
          "lower": 69.37257761317535,
          "upper": 69.37257761317535
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 40.2991967673837,
        "coverage": 0.875,
        "bounds": {
          "lower": 35.261797171460735,
          "upper": 47.761797171460735
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16.083333333333332,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 23.086836601376657,
        "coverage": 0.75,
        "bounds": {
          "lower": 17.31512745103249,
          "upper": 42.315127451032495
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9.416666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 52.83913413492242,
        "coverage": 1,
        "bounds": {
          "lower": 52.83913413492242,
          "upper": 52.83913413492242
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.420634920634921,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 57.003571428571426,
        "coverage": 0.7,
        "bounds": {
          "lower": 39.902499999999996,
          "upper": 69.9025
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 48.961308322021665,
          "upper": 98.96130832202167
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 44.12413702205707,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 71.61078044171461,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 39.63437478463609,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0.261797171460735,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 20.889219558285383,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.004459132164592
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 31,
      "total": 34,
      "singleAgreement": 93.75,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-07",
    "asOf": "2023-07-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 68.72863501429696,
        "coverage": 1,
        "bounds": {
          "lower": 68.72863501429696,
          "upper": 68.72863501429696
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.583333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 34.35568307330176,
        "coverage": 0.875,
        "bounds": {
          "lower": 30.061222689139043,
          "upper": 42.56122268913904
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16.166666666666668,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 22.66400828956941,
        "coverage": 0.75,
        "bounds": {
          "lower": 16.998006217177057,
          "upper": 41.99800621717706
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9.5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 59.04905021891184,
        "coverage": 1,
        "bounds": {
          "lower": 59.04905021891184,
          "upper": 59.04905021891184
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 60.6007142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 42.420500000000004,
          "upper": 72.4205
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 43.72093953645617,
          "upper": 93.72093953645617
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 42.76111644258687,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 71.73062879711989,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 38.728635014296955,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 16.332587674842088,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.756635399174622
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-08",
    "asOf": "2023-08-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 67.34209744340708,
        "coverage": 1,
        "bounds": {
          "lower": 67.34209744340708,
          "upper": 67.34209744340708
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.666666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 32.78703976123753,
        "coverage": 0.875,
        "bounds": {
          "lower": 28.688659791082838,
          "upper": 41.18865979108284
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16.25,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 24.47432708782326,
        "coverage": 0.75,
        "bounds": {
          "lower": 18.355745315867445,
          "upper": 43.355745315867445
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9.583333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 67.49998264611972,
        "coverage": 1,
        "bounds": {
          "lower": 67.49998264611972,
          "upper": 67.49998264611972
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.591269841269842,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 60.6007142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 42.420500000000004,
          "upper": 72.4205
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 38.12903268147248,
          "upper": 88.12903268147248
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 39.37062244404323,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 71.15343765232424,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 37.342097443407084,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 16.346562347675754,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -2.210318994725069
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-09",
    "asOf": "2023-09-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 61,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 66.25379726713467,
        "coverage": 1,
        "bounds": {
          "lower": 66.25379726713467,
          "upper": 66.25379726713467
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 23.93695796523081,
        "coverage": 0.875,
        "bounds": {
          "lower": 20.94483821957696,
          "upper": 33.44483821957696
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16.333333333333332,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 27.215493579464205,
        "coverage": 0.75,
        "bounds": {
          "lower": 20.411620184598153,
          "upper": 45.41162018459815
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9.666666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 70.33615264804254,
        "coverage": 1,
        "bounds": {
          "lower": 70.33615264804254,
          "upper": 70.33615264804254
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.670634920634921,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 60.6007142857143,
        "coverage": 0.7,
        "bounds": {
          "lower": 42.420500000000004,
          "upper": 72.4205
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 36.745892714850655,
          "upper": 86.74589271485065
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 40.97745369920116,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 70.84217708253652,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 36.25379726713467,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 9.691040952442286,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.2791583645341942
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-10",
    "asOf": "2023-10-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 62,
    "regimeClarity": 48,
    "factors": {
      "inflation": {
        "score": 62.04421742991592,
        "coverage": 1,
        "bounds": {
          "lower": 62.04421742991592,
          "upper": 62.04421742991592
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.833333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 26.560797347177544,
        "coverage": 0.875,
        "bounds": {
          "lower": 23.24069767878035,
          "upper": 35.74069767878035
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16.416666666666668,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 32.76290176433531,
        "coverage": 0.75,
        "bounds": {
          "lower": 24.572176323251483,
          "upper": 49.57217632325148
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9.75,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 78.13814271943266,
        "coverage": 1,
        "bounds": {
          "lower": 78.13814271943266,
          "upper": 78.13814271943266
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.753968253968255,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 56.26785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 39.3875,
          "upper": 69.3875
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 39.34413183828188,
          "upper": 89.34413183828188
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 37.92463795683812,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 62.472041106664435,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 32.04421742991592,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 16.196480248864432,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.040833538256523916
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 30,
      "total": 34,
      "singleAgreement": 93.75,
      "coherentAgreement": 0,
      "agreement": 0,
      "nativeGuardChanged": false,
      "differentResolvedRegime": true,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-11",
    "asOf": "2023-11-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "INFLATIONARY_EXPANSION",
    "dataQuality": 62,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 60.08022654206466,
        "coverage": 1,
        "bounds": {
          "lower": 60.08022654206466,
          "upper": 60.08022654206466
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 9.916666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 24.685419304689017,
        "coverage": 0.875,
        "bounds": {
          "lower": 21.59974189160289,
          "upper": 34.09974189160289
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16.5,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 33.12613060209164,
        "coverage": 0.75,
        "bounds": {
          "lower": 24.844597951568733,
          "upper": 49.84459795156873
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9.833333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 76.4727729145209,
        "coverage": 1,
        "bounds": {
          "lower": 76.4727729145209,
          "upper": 76.4727729145209
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.837301587301587,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 56.26785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 39.3875,
          "upper": 69.3875
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 38.66434942174863,
          "upper": 88.66434942174862
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 40.313974129595444,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "TRUE",
        "support": 70.23562859049593,
        "failedOrUnknownGates": []
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 40.08022654206466,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 16.51951534953823,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "named_regime_proven"
        ]
      }
    },
    "tensions": [
      {
        "code": "inflation_pace_divergence",
        "severity": 40,
        "scope": "core",
        "clarityRole": "RESIDUAL_TENSION"
      }
    ],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 1.0171999766189987
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2023-12",
    "asOf": "2023-12-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 58.62484910722287,
        "coverage": 1,
        "bounds": {
          "lower": 58.62484910722287,
          "upper": 58.62484910722287
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 28.689560373834315,
        "coverage": 0.875,
        "bounds": {
          "lower": 25.103365327105024,
          "upper": 37.603365327105024
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16.583333333333332,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 35.39444829801149,
        "coverage": 0.75,
        "bounds": {
          "lower": 26.545836223508616,
          "upper": 51.545836223508616
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 9.916666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 72.87350382302877,
        "coverage": 1,
        "bounds": {
          "lower": 72.87350382302877,
          "upper": 72.87350382302877
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.916666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 56.26785714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 39.3875,
          "upper": 69.3875
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 35.2904409462362,
          "upper": 85.2904409462362
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 40.929476536979585,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 57.079012883714256,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 28.728214434327896,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 21.478516219882152,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.16690001222159356
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-01",
    "asOf": "2024-01-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 62,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 56.929773064976466,
        "coverage": 1,
        "bounds": {
          "lower": 56.929773064976466,
          "upper": 56.929773064976466
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.083333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 41.32027740215772,
        "coverage": 0.875,
        "bounds": {
          "lower": 36.155242726888005,
          "upper": 48.655242726888005
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16.666666666666668,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 33.97662000043372,
        "coverage": 0.75,
        "bounds": {
          "lower": 25.48246500032529,
          "upper": 50.48246500032529
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 73.62904814120867,
        "coverage": 1,
        "bounds": {
          "lower": 73.62904814120867,
          "upper": 73.62904814120867
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 49.70285714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 34.792,
          "upper": 64.792
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 31.295630041149135,
          "upper": 81.29563004114914
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 38.67615280605464,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "UNKNOWN",
        "support": 57.216732480790455,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 32.027217934566465,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 1.1552427268880052,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 34.22546966191154,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.343598760383923
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-02",
    "asOf": "2024-02-29T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 62,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 56.25305992509335,
        "coverage": 1,
        "bounds": {
          "lower": 56.25305992509335,
          "upper": 56.25305992509335
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.166666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 45.48560447648028,
        "coverage": 0.875,
        "bounds": {
          "lower": 39.79990391692025,
          "upper": 52.29990391692025
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16.75,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 35.858094380519354,
        "coverage": 0.75,
        "bounds": {
          "lower": 26.893570785389517,
          "upper": 51.893570785389514
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10.083333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 75.72418045830688,
        "coverage": 1,
        "bounds": {
          "lower": 75.72418045830688,
          "upper": 75.72418045830688
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.079365079365079,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 49.70285714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 34.792,
          "upper": 64.792
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 28.307477222462005,
          "upper": 78.30747722246201
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 36.085747005914925,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "UNKNOWN",
        "support": 57.48750769393861,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 39.180982396248375,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 4.79990391692025,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 38.5468439918269,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.519053923966406
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-03",
    "asOf": "2024-03-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 62,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 57.87814165731493,
        "coverage": 1,
        "bounds": {
          "lower": 57.87814165731493,
          "upper": 57.87814165731493
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 48.309742718729645,
        "coverage": 0.875,
        "bounds": {
          "lower": 42.27102487888844,
          "upper": 54.77102487888844
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16.833333333333332,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 35.09952873396449,
        "coverage": 0.75,
        "bounds": {
          "lower": 26.324646550473368,
          "upper": 51.32464655047337
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10.166666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 75.22105488397648,
        "coverage": 1,
        "bounds": {
          "lower": 75.22105488397648,
          "upper": 75.22105488397648
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.158730158730158,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 49.70285714285715,
        "coverage": 0.7,
        "bounds": {
          "lower": 34.792,
          "upper": 64.792
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 28.42926894426978,
          "upper": 78.42926894426978
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 34.70699781265691,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "UNKNOWN",
        "support": 61.55349510684156,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 45.14916653620337,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 7.27102487888844,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 39.39288322157351,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 1.7546763538794257
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-04",
    "asOf": "2024-04-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 62,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 54.85956122894102,
        "coverage": 1,
        "bounds": {
          "lower": 54.85956122894102,
          "upper": 54.85956122894102
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.333333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 29.391928805613226,
        "coverage": 0.875,
        "bounds": {
          "lower": 25.717937704911574,
          "upper": 38.21793770491158
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 16.916666666666668,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 36.2845531325459,
        "coverage": 0.75,
        "bounds": {
          "lower": 27.21341484940943,
          "upper": 52.21341484940943
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10.25,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 80.18060172662247,
        "coverage": 1,
        "bounds": {
          "lower": 80.18060172662247,
          "upper": 80.18060172662247
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.246031746031745,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 49.28428571428571,
        "coverage": 0.7,
        "bounds": {
          "lower": 34.498999999999995,
          "upper": 64.499
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 29.415260371411453,
          "upper": 79.41526037141145
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 40.179018985430794,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "UNKNOWN",
        "support": 62.64614637953159,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 35.577498933852596,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 25.858376475970555,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.5675947673234094
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-05",
    "asOf": "2024-05-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 80,
    "factors": {
      "inflation": {
        "score": 50.93537865162257,
        "coverage": 1,
        "bounds": {
          "lower": 50.93537865162257,
          "upper": 50.93537865162257
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.416666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 18.585331506397527,
        "coverage": 0.875,
        "bounds": {
          "lower": 16.262165068097836,
          "upper": 28.762165068097836
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 37.03303593281357,
        "coverage": 0.75,
        "bounds": {
          "lower": 27.774776949610178,
          "upper": 52.77477694961018
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10.333333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 81.05386839519232,
        "coverage": 1,
        "bounds": {
          "lower": 81.05386839519232,
          "upper": 81.05386839519232
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.333333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 49.28428571428571,
        "coverage": 0.7,
        "bounds": {
          "lower": 34.498999999999995,
          "upper": 64.499
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 30.06646994306505,
          "upper": 80.06646994306504
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 45.318377364470365,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 48.16060170201239,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 20.93537865162257,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 0,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 26.839398297987607,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 55.82767640432685,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.8055804076536943
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "ROBUST",
      "same": 34,
      "total": 34,
      "singleAgreement": 100,
      "coherentAgreement": 100,
      "agreement": 100,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-06",
    "asOf": "2024-06-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 69,
    "factors": {
      "inflation": {
        "score": 48.21781132858119,
        "coverage": 1,
        "bounds": {
          "lower": 48.21781132858119,
          "upper": 48.21781132858119
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 12.03700639878332,
        "coverage": 0.875,
        "bounds": {
          "lower": 10.532380598935404,
          "upper": 23.032380598935404
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17.083333333333332,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 42.63758719278734,
        "coverage": 0.75,
        "bounds": {
          "lower": 31.97819039459051,
          "upper": 56.97819039459051
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10.416666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 79.84334415584405,
        "coverage": 1,
        "bounds": {
          "lower": 79.84334415584405,
          "upper": 79.84334415584405
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.408730158730158,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 49.28428571428571,
        "coverage": 0.7,
        "bounds": {
          "lower": 34.498999999999995,
          "upper": 64.499
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 28.622923248212302,
          "upper": 78.6229232482123
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 47.52626513941023,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 41.23962093399068,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 18.217811328581192,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 1.9781903945905093,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 33.76037906600932,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -2.47159953506021
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "MODERATELY_SENSITIVE",
      "same": 33,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 100,
      "agreement": 96.875,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-07",
    "asOf": "2024-07-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 47.61666288431533,
        "coverage": 1,
        "bounds": {
          "lower": 47.61666288431533,
          "upper": 47.61666288431533
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.583333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 20.943539429398907,
        "coverage": 0.875,
        "bounds": {
          "lower": 18.325597000724045,
          "upper": 30.825597000724045
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17.166666666666668,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 47.97118534628356,
        "coverage": 0.75,
        "bounds": {
          "lower": 35.97838900971267,
          "upper": 60.97838900971267
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10.5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 78.68360666025181,
        "coverage": 1,
        "bounds": {
          "lower": 78.68360666025181,
          "upper": 78.68360666025181
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.496031746031745,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 43.01428571428573,
        "coverage": 0.7,
        "bounds": {
          "lower": 30.110000000000007,
          "upper": 60.110000000000014
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 25.82713040973949,
          "upper": 75.82713040973948
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 46.19310972451301,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 36.63827387460266,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 18.595051894028003,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 5.9783890097126715,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 38.36172612539734,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -2.0699192577382064
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-08",
    "asOf": "2024-08-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 46.65223696201433,
        "coverage": 1,
        "bounds": {
          "lower": 46.65223696201433,
          "upper": 46.65223696201433
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.666666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 28.5397367670453,
        "coverage": 0.875,
        "bounds": {
          "lower": 24.97226967116464,
          "upper": 37.47226967116464
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17.25,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 51.572521003563644,
        "coverage": 0.75,
        "bounds": {
          "lower": 38.67939075267273,
          "upper": 63.67939075267273
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10.583333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 75.54493803379512,
        "coverage": 1,
        "bounds": {
          "lower": 75.54493803379512,
          "upper": 75.54493803379512
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.583333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 43.01428571428573,
        "coverage": 0.7,
        "bounds": {
          "lower": 30.110000000000007,
          "upper": 60.110000000000014
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 23.47912636498472,
          "upper": 73.47912636498472
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 44.775687407827604,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 32.9728462093416,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 20.33162771468706,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 8.679390752672731,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 42.0271537906584,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.7625855186803698
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-09",
    "asOf": "2024-09-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 45.90041777978469,
        "coverage": 1,
        "bounds": {
          "lower": 45.90041777978469,
          "upper": 45.90041777978469
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 37.43756672584336,
        "coverage": 0.875,
        "bounds": {
          "lower": 32.75787088511294,
          "upper": 45.25787088511294
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17.333333333333332,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 49.26165243145048,
        "coverage": 0.75,
        "bounds": {
          "lower": 36.94623932358786,
          "upper": 61.94623932358786
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10.666666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 70.39065610605319,
        "coverage": 1,
        "bounds": {
          "lower": 70.39065610605319,
          "upper": 70.39065610605319
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.662698412698413,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 43.01428571428573,
        "coverage": 0.7,
        "bounds": {
          "lower": 30.110000000000007,
          "upper": 60.110000000000014
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 22.1986797698499,
          "upper": 72.1986797698499
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 45.13444290595953,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 43.95417845619683,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 33.65828866489763,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 6.946239323587861,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 41.857453105328254,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.7041446154641529
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-10",
    "asOf": "2024-10-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 47.762409994367864,
        "coverage": 1,
        "bounds": {
          "lower": 47.762409994367864,
          "upper": 47.762409994367864
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.833333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 43.68020682160539,
        "coverage": 0.875,
        "bounds": {
          "lower": 38.220180968904714,
          "upper": 50.720180968904714
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17.416666666666668,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 48.72454465945166,
        "coverage": 0.75,
        "bounds": {
          "lower": 36.543408494588746,
          "upper": 61.543408494588746
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10.75,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 71.8783769042809,
        "coverage": 1,
        "bounds": {
          "lower": 71.8783769042809,
          "upper": 71.8783769042809
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 40.16428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 28.115000000000002,
          "upper": 58.11500000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 21.557081640099685,
          "upper": 71.55708164009968
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 41.994011614737104,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 46.21900149977912,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 39.30581848895661,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 9.76358946349346,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 45.45777097453685,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 57.900720045057085,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_DETERIORATING",
      "deltaPi": 1.4877806783078595
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-11",
    "asOf": "2024-11-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 48.2801788384776,
        "coverage": 1,
        "bounds": {
          "lower": 48.2801788384776,
          "upper": 48.2801788384776
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 10.916666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 43.31004514962756,
        "coverage": 0.875,
        "bounds": {
          "lower": 37.896289505924116,
          "upper": 50.396289505924116
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17.5,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 47.35199879231994,
        "coverage": 0.75,
        "bounds": {
          "lower": 35.513999094239956,
          "upper": 60.513999094239956
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10.833333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 72.3863436009127,
        "coverage": 1,
        "bounds": {
          "lower": 72.3863436009127,
          "upper": 72.3863436009127
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.825396825396826,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 40.16428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 28.115000000000002,
          "upper": 58.11500000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 20.544405390369832,
          "upper": 70.54440539036983
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 41.919523249663214,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 47.76617974423765,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 38.79417793271756,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 8.410288600164073,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 44.61611066744651,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 53.758569292179175,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.9943153756622691
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2024-12",
    "asOf": "2024-12-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 69,
    "factors": {
      "inflation": {
        "score": 49.079682238557346,
        "coverage": 1,
        "bounds": {
          "lower": 49.079682238557346,
          "upper": 49.079682238557346
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 35.807790062132426,
        "coverage": 0.875,
        "bounds": {
          "lower": 31.331816304365873,
          "upper": 43.83181630436587
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17.583333333333332,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 44.65472252526897,
        "coverage": 0.75,
        "bounds": {
          "lower": 33.49104189395173,
          "upper": 58.49104189395173
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 10.916666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 69.39737787296797,
        "coverage": 1,
        "bounds": {
          "lower": 69.39737787296797,
          "upper": 69.39737787296797
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.908730158730158,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 40.16428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 28.115000000000002,
          "upper": 58.11500000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 21.137994615702937,
          "upper": 71.13799461570294
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 46.246930854305475,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 45.53203011112716,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 30.354888309444767,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 3.4910418939517314,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 37.25213406580853,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50.879152636152924,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.001153600253944731
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "MODERATELY_SENSITIVE",
      "same": 33,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 100,
      "agreement": 96.875,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-01",
    "asOf": "2025-01-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 69,
    "factors": {
      "inflation": {
        "score": 48.78545291050587,
        "coverage": 1,
        "bounds": {
          "lower": 48.78545291050587,
          "upper": 48.78545291050587
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.083333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 43.919632794538394,
        "coverage": 0.875,
        "bounds": {
          "lower": 38.42967869522109,
          "upper": 50.92967869522109
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17.666666666666668,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 40.31464913138984,
        "coverage": 0.75,
        "bounds": {
          "lower": 30.23598684854238,
          "upper": 55.23598684854238
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 11,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 72.22677515037013,
        "coverage": 1,
        "bounds": {
          "lower": 72.22677515037013,
          "upper": 72.22677515037013
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.992063492063492,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 40.51071428571429,
        "coverage": 0.7,
        "bounds": {
          "lower": 28.3575,
          "upper": 58.3575
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 22.486726147595387,
          "upper": 72.48672614759539
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 43.04396843691085,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 44.01820797687146,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 25.183873520634933,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 3.665665543763474,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 44.644225784715225,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50.09454109468231,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.20260566639537236
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "MODERATELY_SENSITIVE",
      "same": 33,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 100,
      "agreement": 96.875,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-02",
    "asOf": "2025-02-28T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 69,
    "factors": {
      "inflation": {
        "score": 47.010089846625945,
        "coverage": 1,
        "bounds": {
          "lower": 47.010089846625945,
          "upper": 47.010089846625945
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.166666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 33.60559915796674,
        "coverage": 0.875,
        "bounds": {
          "lower": 29.404899263220898,
          "upper": 41.9048992632209
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17.75,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 41.742184130350275,
        "coverage": 0.75,
        "bounds": {
          "lower": 31.306638097762704,
          "upper": 56.3066380977627
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 11.083333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 70.14918873899803,
        "coverage": 1,
        "bounds": {
          "lower": 70.14918873899803,
          "upper": 70.14918873899803
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 12.067460317460318,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 40.51071428571429,
        "coverage": 0.7,
        "bounds": {
          "lower": 28.3575,
          "upper": 58.3575
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 25.997560022585237,
          "upper": 75.99756002258523
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 48.259159572570844,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 50.703451748863245,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 31.414989109846843,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 1.3066380977627041,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 37.39480941659495,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.17271648375388748
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "MODERATELY_SENSITIVE",
      "same": 33,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 100,
      "agreement": 96.875,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-03",
    "asOf": "2025-03-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 62,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 39.26138094892544,
        "coverage": 1,
        "bounds": {
          "lower": 39.26138094892544,
          "upper": 39.26138094892544
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.25,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 41.80103553810066,
        "coverage": 0.875,
        "bounds": {
          "lower": 36.57590609583808,
          "upper": 49.07590609583808
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17.833333333333332,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 44.84944686708577,
        "coverage": 0.75,
        "bounds": {
          "lower": 33.63708515031433,
          "upper": 58.63708515031433
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 11.166666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 72.2050222921584,
        "coverage": 1,
        "bounds": {
          "lower": 72.2050222921584,
          "upper": 72.2050222921584
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 12.15079365079365,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 40.51071428571429,
        "coverage": 0.7,
        "bounds": {
          "lower": 28.3575,
          "upper": 58.3575
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 26.50457402562622,
          "upper": 76.50457402562623
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 47.53806039602855,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 40.624295798611115,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 27.89846609923977,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 5.212991246152406,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 52.314525146912636,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0.4,
      "scoreRange": {
        "lower": 0.4,
        "upper": 0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.26451152547790624
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-04",
    "asOf": "2025-04-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 62,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 40.145155774120134,
        "coverage": 1,
        "bounds": {
          "lower": 40.145155774120134,
          "upper": 40.145155774120134
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.333333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 19.579915735058062,
        "coverage": 0.875,
        "bounds": {
          "lower": 17.132426268175806,
          "upper": 29.632426268175806
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 17.916666666666668,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 47.60498215245153,
        "coverage": 0.75,
        "bounds": {
          "lower": 35.703736614338645,
          "upper": 60.703736614338645
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 11.25,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 71.91951460916802,
        "coverage": 1,
        "bounds": {
          "lower": 71.91951460916802,
          "upper": 71.91951460916802
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 12.234126984126984,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 43.71428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 30.6,
          "upper": 60.60000000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 25.21438103911751,
          "upper": 75.21438103911751
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 53.723573316784005,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 33.21965296179792,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 14.627126190475213,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 5.703736614338645,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 45.55858084021851,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "IMPROVING",
      "weightedScore": -0.8,
      "scoreRange": {
        "lower": -0.8,
        "upper": -0.8
      },
      "dispersion": 2,
      "votes": {
        "growth": "STRONGLY_IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "IMPROVING",
      "deltaPi": -0.5038305211931715
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-05",
    "asOf": "2025-05-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 62,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 41.844265192210486,
        "coverage": 1,
        "bounds": {
          "lower": 41.844265192210486,
          "upper": 41.844265192210486
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.416666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 21.42793989781348,
        "coverage": 0.875,
        "bounds": {
          "lower": 18.749447410586797,
          "upper": 31.249447410586797
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 18,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 47.89773210949102,
        "coverage": 0.75,
        "bounds": {
          "lower": 35.92329908211826,
          "upper": 60.92329908211826
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 11.333333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 71.21943675146642,
        "coverage": 1,
        "bounds": {
          "lower": 71.21943675146642,
          "upper": 71.21943675146642
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 12.317460317460318,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 43.71428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 30.6,
          "upper": 60.60000000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 21.972608564073674,
          "upper": 71.97260856407368
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 52.51138033929135,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 30.920966110092223,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 12.767564274328748,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 5.9232990821182625,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 44.07903388990778,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "STRONGLY_IMPROVING",
      "deltaPi": -1.2158269915384712
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-06",
    "asOf": "2025-06-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 69,
    "factors": {
      "inflation": {
        "score": 45.20469904048143,
        "coverage": 1,
        "bounds": {
          "lower": 45.20469904048143,
          "upper": 45.20469904048143
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.5,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 21.86212630361104,
        "coverage": 0.875,
        "bounds": {
          "lower": 19.12936051565966,
          "upper": 31.62936051565966
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 18.083333333333332,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 43.170082857286985,
        "coverage": 0.75,
        "bounds": {
          "lower": 32.37756214296524,
          "upper": 57.37756214296524
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 11.416666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 70.55580249781923,
        "coverage": 1,
        "bounds": {
          "lower": 70.55580249781923,
          "upper": 70.55580249781923
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 12.396825396825397,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 43.71428571428572,
        "coverage": 0.7,
        "bounds": {
          "lower": 30.6,
          "upper": 60.60000000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 20.621389818993748,
          "upper": 70.62138981899375
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 52.07473638169623,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 41.76139052852387,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 19.138952671489108,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 2.377562142965239,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 37.17286310248381,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": -0.24305236642554462
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "MODERATELY_SENSITIVE",
      "same": 33,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 100,
      "agreement": 96.875,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-07",
    "asOf": "2025-07-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 69,
    "factors": {
      "inflation": {
        "score": 46.385300104669106,
        "coverage": 1,
        "bounds": {
          "lower": 46.385300104669106,
          "upper": 46.385300104669106
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.583333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 29.21616864069074,
        "coverage": 0.875,
        "bounds": {
          "lower": 25.564147560604397,
          "upper": 38.0641475606044
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 18.166666666666668,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 46.14002797019666,
        "coverage": 0.75,
        "bounds": {
          "lower": 34.6050209776475,
          "upper": 59.6050209776475
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 11.5,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 69.36039944006782,
        "coverage": 1,
        "bounds": {
          "lower": 69.36039944006782,
          "upper": 69.36039944006782
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 12.484126984126984,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 40.24642857142858,
        "coverage": 0.7,
        "bounds": {
          "lower": 28.172500000000003,
          "upper": 58.17250000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 20.18717114945478,
          "upper": 70.18717114945478
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 49.568234910095526,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 46.39262465368448,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 26.561793191936374,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 4.605020977647499,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 38.21972087297839,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.09988228156659895
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "MODERATELY_SENSITIVE",
      "same": 33,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 100,
      "agreement": 96.875,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-08",
    "asOf": "2025-08-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 48.00956667075339,
        "coverage": 1,
        "bounds": {
          "lower": 48.00956667075339,
          "upper": 48.00956667075339
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.666666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 21.149962327763376,
        "coverage": 0.875,
        "bounds": {
          "lower": 18.506217036792954,
          "upper": 31.006217036792954
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 18.25,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 48.546177961029734,
        "coverage": 0.75,
        "bounds": {
          "lower": 36.4096334707723,
          "upper": 61.4096334707723
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 11.583333333333334,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 67.48322471271382,
        "coverage": 1,
        "bounds": {
          "lower": 67.48322471271382,
          "upper": 67.48322471271382
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 12.567460317460318,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 40.24642857142858,
        "coverage": 0.7,
        "bounds": {
          "lower": 28.172500000000003,
          "upper": 58.17250000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 20.31149849582976,
          "upper": 70.31149849582977
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 51.97647745231752,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 46.59993319998109,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 29.419200141525685,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 6.409633470772299,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 38.40006680001891,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 55.92346663397291,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": -0.4,
      "scoreRange": {
        "lower": -0.4,
        "upper": -0.4
      },
      "dispersion": 1,
      "votes": {
        "growth": "IMPROVING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "DETERIORATING",
      "deltaPi": 0.8671407920076368
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-09",
    "asOf": "2025-09-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": "MIXED",
    "dataQuality": 62,
    "regimeClarity": 49,
    "factors": {
      "inflation": {
        "score": 47.75818394660328,
        "coverage": 1,
        "bounds": {
          "lower": 47.75818394660328,
          "upper": 47.75818394660328
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.75,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 18.678894098835826,
        "coverage": 0.875,
        "bounds": {
          "lower": 16.344032336481348,
          "upper": 28.844032336481348
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 18.333333333333332,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 51.81114785290527,
        "coverage": 0.75,
        "bounds": {
          "lower": 38.858360889678956,
          "upper": 63.858360889678956
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 11.666666666666666,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 63.0992359997408,
        "coverage": 1,
        "bounds": {
          "lower": 63.0992359997408,
          "upper": 63.0992359997408
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 12.65079365079365,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 40.24642857142858,
        "coverage": 0.7,
        "bounds": {
          "lower": 28.172500000000003,
          "upper": 58.17250000000001
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 20.901560027185493,
          "upper": 70.9015600271855
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 54.424418825331735,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 43.723638916641725,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 31.440360695999637,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 8.858360889678956,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "FALSE",
        "support": 41.100176943075674,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "MIXED": {
        "result": "TRUE",
        "support": 50,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.17909999031603396
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": {
      "classification": "FRAGILE",
      "same": 32,
      "total": 34,
      "singleAgreement": 96.875,
      "coherentAgreement": 50,
      "agreement": 50,
      "nativeGuardChanged": false,
      "differentResolvedRegime": false,
      "differentNamedRegime": false
    },
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.claims: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-10",
    "asOf": "2025-10-31T23:59:59.999Z",
    "evaluationStatus": "NOT_EVALUATED",
    "evaluationReason": "2025-10: CPI core YoY window is NOT EVALUATED; exact index endpoint(s) unavailable: 2025-10-01. inflation anchor has 50% coverage and 1/2 eligible families (cpi: A required family input is unavailable or invalid.).",
    "assessmentStatus": "INSUFFICIENT_DATA",
    "regime": null,
    "dataQuality": 57,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 21.132471673606055,
          "upper": 71.13247167360606
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 65.83333333333333,
        "releaseQuality": 0,
        "status": "WITHHELD"
      },
      "growth": {
        "score": 43.39826832751312,
        "coverage": 0.875,
        "bounds": {
          "lower": 37.973484786573984,
          "upper": 50.473484786573984
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 18.416666666666668,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 47.72454828614632,
        "coverage": 1,
        "bounds": {
          "lower": 47.72454828614632,
          "upper": 47.72454828614632
        },
        "eligibleFamilies": 3,
        "configuredFamilies": 3,
        "historyYears": 0.11538461538461539,
        "releaseQuality": 0,
        "status": "READY"
      },
      "policyRates": {
        "score": 61.50224930542079,
        "coverage": 1,
        "bounds": {
          "lower": 61.50224930542079,
          "upper": 61.50224930542079
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 12.738095238095237,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 39.142857142857146,
        "coverage": 0.7,
        "bounds": {
          "lower": 27.4,
          "upper": 57.400000000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 22.068474498360796,
          "upper": 72.0684744983608
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": [
          "snapshot_not_evaluated"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": [
          "snapshot_not_evaluated"
        ]
      },
      "STAGFLATIONARY": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": [
          "snapshot_not_evaluated"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": [
          "snapshot_not_evaluated"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": [
          "snapshot_not_evaluated"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": [
          "snapshot_not_evaluated"
        ]
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "DETERIORATING",
      "weightedScore": 0.8,
      "scoreRange": {
        "lower": 0.8,
        "upper": 0.8
      },
      "dispersion": 2,
      "votes": {
        "growth": "STRONGLY_DETERIORATING",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "NEUTRAL",
      "deltaPi": 0.26650109603258976
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "2025-10: CPI core YoY window is NOT EVALUATED; exact index endpoint(s) unavailable: 2025-10-01.",
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "inflation anchor has 50% coverage and 1/2 eligible families (cpi: A required family input is unavailable or invalid.).",
      "inflation.cpi: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-11",
    "asOf": "2025-11-30T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 42.27314138798718,
        "coverage": 1,
        "bounds": {
          "lower": 42.27314138798718,
          "upper": 42.27314138798718
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.833333333333334,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 52.719667467430405,
        "coverage": 0.875,
        "bounds": {
          "lower": 46.12970903400161,
          "upper": 58.62970903400161
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 18.5,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 51.71415093425713,
        "coverage": 0.65,
        "bounds": {
          "lower": 33.614198107267136,
          "upper": 68.61419810726713
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 0.21153846153846154,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 62.23488575599461,
        "coverage": 1,
        "bounds": {
          "lower": 62.23488575599461,
          "upper": 62.23488575599461
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 12.80952380952381,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 39.142857142857146,
        "coverage": 0.7,
        "bounds": {
          "lower": 27.4,
          "upper": 57.400000000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 23.491714457420038,
          "upper": 73.49171445742004
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 44.48984338222832,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 23.658943280720052,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 23.402850421988788,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 14.743907141268743,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 58.856567646014426,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "UNKNOWN",
      "weightedScore": null,
      "scoreRange": null,
      "dispersion": null,
      "votes": {
        "growth": "UNKNOWN",
        "labor": "UNKNOWN",
        "credit": "UNKNOWN"
      },
      "reason": "momentum_comparisons_insufficient_or_non_invariant"
    },
    "inflationDirection": {
      "direction": "UNKNOWN",
      "deltaPi": null
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.householdLabor: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  },
  {
    "period": "2025-12",
    "asOf": "2025-12-31T23:59:59.999Z",
    "evaluationStatus": "EVALUATED",
    "evaluationReason": null,
    "assessmentStatus": "PROVISIONAL",
    "regime": null,
    "dataQuality": 59,
    "regimeClarity": null,
    "factors": {
      "inflation": {
        "score": 43.67822724470126,
        "coverage": 1,
        "bounds": {
          "lower": 43.67822724470126,
          "upper": 43.67822724470126
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 11.916666666666666,
        "releaseQuality": 0,
        "status": "READY"
      },
      "growth": {
        "score": 58.93760433744958,
        "coverage": 0.875,
        "bounds": {
          "lower": 51.57040379526838,
          "upper": 64.07040379526839
        },
        "eligibleFamilies": 4,
        "configuredFamilies": 5,
        "historyYears": 18.583333333333332,
        "releaseQuality": 0,
        "status": "ADEQUATE"
      },
      "labor": {
        "score": 53.462711254420775,
        "coverage": 0.65,
        "bounds": {
          "lower": 34.75076231537351,
          "upper": 69.7507623153735
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 0.28846153846153844,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "policyRates": {
        "score": 58.287163440635084,
        "coverage": 1,
        "bounds": {
          "lower": 58.287163440635084,
          "upper": 58.287163440635084
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 2,
        "historyYears": 12.896825396825397,
        "releaseQuality": 0,
        "status": "READY"
      },
      "creditConditions": {
        "score": 39.142857142857146,
        "coverage": 0.7,
        "bounds": {
          "lower": 27.4,
          "upper": 57.400000000000006
        },
        "eligibleFamilies": 2,
        "configuredFamilies": 3,
        "historyYears": 1,
        "releaseQuality": 0,
        "status": "LIMITED"
      },
      "liquidityProxy": {
        "score": null,
        "coverage": 0.5,
        "bounds": {
          "lower": 24.550113925563714,
          "upper": 74.55011392556372
        },
        "eligibleFamilies": 1,
        "configuredFamilies": 2,
        "historyYears": 0.5,
        "releaseQuality": 0,
        "status": "WITHHELD"
      }
    },
    "ruleDiagnostics": {
      "GOLDILOCKS": {
        "result": "FALSE",
        "support": 43.24391444461242,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "INFLATIONARY_EXPANSION": {
        "result": "FALSE",
        "support": 23.927464929327755,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "STAGFLATIONARY": {
        "result": "FALSE",
        "support": 30.248631039969645,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "CONTRACTION_RECESSIONARY": {
        "result": "FALSE",
        "support": 21.32116611064189,
        "failedOrUnknownGates": [
          "mandatory_gate_false"
        ]
      },
      "DISINFLATIONARY_SLOWDOWN": {
        "result": "UNKNOWN",
        "support": 62.89217655056712,
        "failedOrUnknownGates": [
          "mandatory_gate_unknown"
        ]
      },
      "MIXED": {
        "result": "UNKNOWN",
        "support": 0,
        "failedOrUnknownGates": []
      }
    },
    "tensions": [],
    "leadingDirection": {
      "direction": "NEUTRAL",
      "weightedScore": 0,
      "scoreRange": {
        "lower": 0,
        "upper": 0
      },
      "dispersion": 0,
      "votes": {
        "growth": "NEUTRAL",
        "labor": "NEUTRAL",
        "credit": "NEUTRAL"
      },
      "reason": null
    },
    "inflationDirection": {
      "direction": "UNKNOWN",
      "deltaPi": null
    },
    "transitionRisk": {
      "level": "UNKNOWN",
      "reasonCodes": [
        "transition_comparison_unavailable"
      ]
    },
    "thresholdSensitivity": null,
    "sourceGaps": [
      "creditConditions.bankVolume: A required family input is unavailable or invalid.",
      "growth.housing: Eligible primary-slot coverage is below the 60% family floor.",
      "labor.householdLabor: A required family input is unavailable or invalid.",
      "liquidityProxy.balanceSheetProxy [federal-reserve-h41-liquidity]: A required family input is unavailable or invalid."
    ]
  }
]
```
