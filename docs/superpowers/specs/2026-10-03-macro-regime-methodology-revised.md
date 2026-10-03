# Macro Regime Methodology and Data Architecture Design - Revised

**Version:** `US-MACRO-0.2-review`

**Review date:** 2026-10-03

**Scope:** methodology specification and analytical review. No application implementation is authorized by this document alone.

## 1. Executive Verdict

**APPROVE WITH MINOR CONDITIONS for staged implementation.** The revised definitions survive the bounded logical and synthetic review below. They are sufficiently concrete to implement and test. Production activation is conditional on source contracts and a complete revised-history diagnostic; neither has been presumed successful.

Retain six U.S. factors and separate Indonesia, Energy and Crypto overlays. Separate Data Quality from Regime Clarity. Economic gates determine regime identity; missing evidence creates explicit uncertainty rather than positive support. Policy compatibility is mandatory for Goldilocks.

Actual verification in this review: official-source inspections, archived-release sanity checks, 15 complete-data fixtures, score-threshold perturbations, rule permutations and an unequal-weight quality-removal calculation. A complete historical classifier, production implementation tests and predictive validation were **not** run. This distinction is material to the recommendation.

## 2. Changes From the Previous Version

| Previous choice | Replacement and reason |
| --- | --- |
| Global macro classifier | **U.S. Macro Regime**; U.S. data do not represent the world. |
| Evidence Strength | Independent Data Quality and Regime Clarity; excellent data can reveal a mixed economy. |
| Every factor required | Four mandatory anchors; supporting outages can permit a bounded/provisional description. |
| One percentile transform | Native, factor-specific economic transformations; history completeness is separate from runtime eligibility. |
| Renormalization decides gates | Fixed missing-contribution bounds decide gates; normalized estimates are display-only. |
| Policy optional for Goldilocks | Mandatory Policy level/change and native real-policy guards; substantial observed financial stress vetoes. |
| Finance prerequisites for inflationary regimes | Inflation and real activity define identity; finance modifies severity and commentary. |
| Momentum can erase high inflation | High inflation remains high while easing; acceleration can qualify above a separate level floor. |
| Overlapping Growth/Labor OR rules | Explicit activity disagreement gives MIXED; severe inflationary weakness has a contraction qualifier. |
| 75 support minimum / 10-point auction | Removed from selection; unlike regimes lack calibrated comparable support. Support remains diagnostic. |
| Mixed / Transition | **MIXED**, with independent direction and transition fields. |
| Inflation offsets weakening jobs in one average | Separate inflation-pressure and activity/credit direction channels. |
| Objectively measured net liquidity | **System Liquidity Proxy**, with exact algebra and limitations. |

This document supersedes the earlier methodology spec and the taxonomy/scoring/playbook parts of the public-daily design. Preserve the current Next.js server-side source boundary, visual identity, responsive layout, Overview / Data & Sources / Methodology navigation, and Netlify deployment target. Keep exactly: "Educational research tool, not financial advice." Do not add execution, brokerage integration, paid feeds, or a live OpenAI call.

## 3. Final U.S. Factor Architecture

| Factor ID | UI name | Role | High score means |
| --- | --- | --- | --- |
| `inflation` | Inflation | Anchor | Elevated consumer-price inflation pressure |
| `growth` | Growth | Anchor | Weak real activity |
| `labor` | Labor | Anchor | Employment/labor-market weakness |
| `policyRates` | Policy / Rates | Anchor | Restrictive real-policy/financing proxies |
| `creditConditions` | Credit / Financial Conditions | Supporting | Bank-credit supply, volume or performance strain |
| `liquidityProxy` | System Liquidity Proxy | Supporting | Contraction in configured liquidity/money proxies |

All six remain visible, including unavailable cards. No opaque aggregate macro score is calculated. Credit is primarily a bank-credit assessment, not a complete capital-market financial-conditions index. Liquidity is a heuristic. The classifier represents neither China, Europe, Japan nor the global economy.

## 4. Overlay Architecture

The U.S. evaluator receives only core factor results and defined core momentum/policy fields. It receives no overlay object. Overlays are evaluated afterward.

| Overlay | Initial calculation | Scope and isolation |
| --- | --- | --- |
| Indonesia | FX family .50: 90-day USDIDR depreciation; external-context family .50: equal broad-dollar 90-day change and Brent 30-day change | FX sensitivity proxy, not sovereign/crisis probability. ECB crosses are labeled synthetic, never JISDOR. Requires both families and >=60% weight for an aggregate. |
| Energy / Supply Shock | One price family: equal Brent 30-day and 90-day changes | Energy price pressure, not identified supply causation. Inventory data can be contextual after source review. |
| Crypto / Blockchain | One blockspace family: equal fee-rate and backlog scores | Congestion/usage, not BTC buying pressure, flows or returns. Unresolved reuse keeps it blocked. |

FX and dollar percentage-change anchors: `(-5,0),(0,25),(3,50),(6,75),(10,100)`. Oil-change anchors: `(-10,0),(0,25),(10,50),(25,75),(40,100)`. Crypto fee anchors in sat/vB: `(0,0),(1,10),(5,40),(20,75),(100,100)`; backlog in million vbytes: `(0,0),(1,25),(5,60),(20,90),(50,100)`. Interpolate as section 7 specifies. A historical comparison uses the latest eligible point on/before the target date, with at most seven calendar days of market-data alignment gap.

Overlay aggregates are descriptive, not independent confirmation votes. The two-family rule for **core factors** does not prohibit a single-family context overlay. Missing-weight bounds and overlay quality are displayed separately. Shared dollar/FX and oil exposures are disclosed.

In version 0.2, Energy has **no direct core Inflation input**: CPI/PCE already incorporate energy. Changing overlay values or health cannot alter U.S. scores, regime, Data Quality, Clarity, rule support, leading direction or transition risk. Optional Market / Risk Conditions remain context. A future direct energy input requires a methodology version and double-counting review.

## 5. Final Source Map and Observation Contract

These are source-review states, not assertions that production adapters exist. `SOURCE_CLEARED` means ordinary-data reuse/source feasibility is established. `INGESTION_CONDITIONAL` means a required parser/history/release contract remains unverified. Every enabled adapter must retain its own eligibility record.

| Owner / inputs | Endpoint and identifiers | Cadence, history, release evidence and status |
| --- | --- | --- |
| BLS CPI | [API](https://api.bls.gov/publicAPI/v2/timeseries/data/), NSA headline/core `CUUR0000SA0`, `CUUR0000SA0L1E`; SA counterparts `CUSR0000SA0`, `CUSR0000SA0L1E` | Monthly; history batching/registration limits apply. Actual CPI releases provide publication dates. SOURCE_CLEARED under [BLS terms](https://www.bls.gov/developers/termsOfService.htm); SA/history contracts conditional. |
| BLS Labor | Same API; payroll `CES0000000001`, unemployment `LNS14000000` | Monthly, revised establishment/household data. Preserve Employment Situation publication separately from month. SOURCE_CLEARED; release/history alignment conditional. |
| BEA GDP | [Section 1 XLSX](https://apps.bea.gov/national/Release/XLS/Survey/Section1All_xls.xlsx), `T10101-Q` / 1.1.1; `T10106-Q` / 1.1.6 | Inspected genuine no-key workbook, quarterly history reaches 1947. API needs registration. Current workbook is revised history, not original vintages. SOURCE_CLEARED; XLSX/release ingestion conditional. |
| BEA PCE/income | [Section 2 XLSX](https://apps.bea.gov/national/Release/XLS/Survey/Section2All_xls.xlsx), `T20804-M` / 2.8.4 prices; `T20806-M` / 2.8.6 real PCE; `T20600-M` / 2.6 real disposable income | Monthly; match semantic rows uniquely. Income header inspected from 1959; verify each series start. SOURCE_CLEARED under [BEA reuse](https://www.bea.gov/help/faq/147); ingestion conditional. Do not mislabel real disposable income as income excluding transfers. |
| Board G.17 | [Official downloads](https://www.federalreserve.gov/releases/g17/download.htm), total industrial production, SA | Monthly, long history. SOURCE_CLEARED; maintained history-file/parser contract conditional. |
| Census housing | [RESCONST ZIP](https://www.census.gov/econ_getzippedfile/?programCode=RESCONST), `ASTARTS`, `APERMITS`, `TOTAL`, `US`, adjusted annual rate | Monthly; ZIP/sectioned CSV inspected; period dictionary starts 1959, individual series starts pending. [Release page](https://www.census.gov/construction/nrc/current/) provides publication metadata. SOURCE_CLEARED under [public-use/citation policy](https://www.census.gov/about/policies/citation.html); ingestion conditional. |
| Census retail, context | [MRTS ZIP](https://www.census.gov/econ_getzippedfile/?programCode=MRTS), category `44X72` | Monthly **nominal** sales, history from 1992. Advance MARTS differs from revised MRTS. No extra consumption vote. [API examples](https://api.census.gov/data/timeseries/eits/mrts/examples.html) require a key for data queries; inspected bulk ZIP is the no-key candidate. |
| DOL claims | [Official release](https://www.dol.gov/ui/data.pdf) and existing official claims-data adapter | Weekly, initial/continuing claims, revisions and seasonal basis. Current/history parser contract must be verified; publication differs from week end. |
| Board policy | [Open Market Operations](https://www.federalreserve.gov/monetarypolicy/openmarket.htm), dated target changes/archive | Irregular actions; list inspected from 2003. Announcement/effective dates differ; pre-2008 point targets differ from ranges. SOURCE_CLEARED; historical parser conditional. |
| Treasury yields | [XML documentation](https://home.treasury.gov/treasury-daily-interest-rate-xml-feed); `/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_real_yield_curve&field_tdr_date_value=YYYY`; `NEW_DATE`, `TC_10YEAR` | Business days; real-curve history from 2003; 2025 XML inspected. Retrieve all required years. `<updated>` is not original daily publication. Technical source verified; retain Treasury-specific reuse evidence before admission. Nominal yields/curve are context. |
| Board SLOOS | [Survey index](https://www.federalreserve.gov/data/sloos.htm); [C&I chart history](https://www.federalreserve.gov/data/sloos/sloos-202607-chart-data.htm), chart 1/panel 1 | Quarterly plus occasional extra surveys; domestic large/middle-market/small net tightening. Inspected history starts 1990Q2. Survey period differs from release. SOURCE_CLEARED; chart/release parser conditional. |
| Board H.8 | [Current release](https://www.federalreserve.gov/releases/h8/current/default.htm), table 2, all-bank SA loans/leases | Weekly; current tables inspected, historical bulk identifiers/payload untested. Benchmark/reclassification breaks matter. SOURCE_CLEARED; ingestion conditional. |
| Board credit performance | [Release-hosted ZIP](https://www.federalreserve.gov/releases/chargeoff/data/FRB_CHGDEL_xml.zip); all-bank SA delinquency `STFBQD%STFBAIL_XEOP_MA.Q`, net charge-offs `STFBQC%STFBAIL_MA.Q` | Quarterly. Archive verified; the exact series were parsed from the equivalent DDP bulk ZIP,166 quarters1985Q1-2026Q2. About60 days publication lag. SOURCE_CLEARED; release-hosted-series/parser integration remains conditional. Net charge-offs are annualized rates, not delinquency percentages. |
| Board H.4.1 | [Current release](https://www.federalreserve.gov/releases/h41/current/), total assets, TGA, RRP Others, reserves | Weekly. Use weekly averages consistently, not a mixture with Wednesday stocks. Current tables inspected, history payload untested. SOURCE_CLEARED; ingestion conditional. |
| Board H.6 | [Release-hosted ZIP](https://www.federalreserve.gov/releases/h6/data/FRB_h6_xml.zip), H6_data.xml, `SERIES_NAME=M2.M`, `ADJUSTED=SA`, `FREQ=129`, `UNIT_MULT=1e+09` | Monthly SA M2 in billions USD;812 observations1959M01-2026M08 inspected. Do not select discontinued weekly M2.WM. SOURCE_CLEARED; application ZIP/attribute-aware SDMX ingestion conditional. |
| ECB FX | [Data service](https://data-api.ecb.europa.eu/service/data/EXR), `D.IDR.EUR.SP00.A`, `D.USD.EUR.SP00.A` | Matched-day IDR/EUR divided by USD/EUR is synthetic USDIDR. Candidate under [reuse policy](https://www.ecb.europa.eu/stats/ecb_statistics/governance_and_quality_framework/html/usage_policy.ga.html); exact feed/history/publication parsing pending. Attribute and disclose transformation. |
| BI JISDOR | [Official page](https://www.bi.go.id/id/statistik/informasi-kurs/jisdor/Default.aspx) | Daily fixing. Endpoint/reuse unresolved: REDISTRIBUTION_BLOCKED. |
| EIA Brent | [Open data](https://www.eia.gov/opendata/), existing Brent adapter | API requires a free key; eligible bulk route can avoid it. Ordinary data reuse with attribution under [EIA policy](https://www.eia.gov/about/copyrights_reuse.php). Exact history contract pending. |
| Mempool.space | [REST docs](https://mempool.space/docs/api/rest), fee/backlog context | Endpoint-specific limits/history; reuse not confirmed: REDISTRIBUTION_BLOCKED. |

Ordinary Board data can be reused with attribution under the [Board disclaimer](https://www.federalreserve.gov/disclaimer.htm); exceptions include third-party content and insignia. This does not authorize regional-Fed/FRED material automatically. [H.4.1](https://www.federalreserve.gov/releases/h41/) and SLOOS announce DDP package-builder removal during the week of November 9, 2026, before eventual DDP retirement. Do not create a new dependency on that retiring builder.

Tested BEA CSV candidates returned HTML despite HTTP200; reject them. Verify format/schema/units/row identity, not status alone. Current dependencies do not include an XLSX or general ZIP ingestion solution; implementation must choose registered JSON or a justified parser dependency. SDMX identifiers/values are XML attributes; the existing ignoreAttributes parser option cannot be reused unchanged. H.6 XML Prepared metadata predates publication and is not a release timestamp. Derived real M2 is available only after both M2 and PCE constituents have been published for the matched month.

Every production source registry entry records owner, endpoint, access method, reuse/display eligibility and evidence URL, attribution, cadence, first valid date, history basis, release-date quality, expected release calendar, health and verification date. Public access alone does not establish redistribution rights.

Observations record value/unit/seasonal basis, observation period, actual nullable `releasedAt`, release precision, `retrievedAt`, `firstSeenAt`, version/vintage and provenance. Fetch health is distinct from observation health. Expose observation, release and refresh timestamps separately. Retrieval/first-seen never stand in for an old observation's original release. No credentials appear in public payloads.

Health states: available, stale, missing, failed, redistribution_blocked. Use official release calendars plus overdue grace: daily 3 business days, weekly 3 calendar days, monthly 7, quarterly 14. Without a calendar, conservative observation-age ceilings are 7/21/70/160 calendar days respectively; disclose metadata incompleteness. A fresh cached value can survive a failed fetch with degraded health; stale cache cannot. Fetching again does not refresh the observation's age.

## 6. Indicator Family Definitions

Core factor weights are fixed; family weights sum to 1, with no family above .50. Within-family primary-slot weights also sum to 1. At least two eligible families are required per core factor.

| Factor | Families and weights | Primary slots |
| --- | --- | --- |
| Inflation | CPI .50, PCE .50 | Each: core YoY .70, headline YoY .30; SA momentum is not an extra level vote. |
| Growth | GDP .25, production .25, consumption .25, household income .125, housing .125 | GDP, total IP, real PCE, real disposable income; housing permits .60/starts .40. |
| Labor | Payroll .40, household labor .35, claims .25 | Payroll growth; unemployment level .50/gap .50; initial-claims/employment ratio. Continuing claims are context. |
| Policy | Real-policy stance .50, real financing .50 | Target midpoint minus core PCE YoY; 10Y real par yield. Target changes, nominal yields and curve are context/momentum. |
| Credit | Standards .40, bank volume .30, credit performance .30 | Domestic C&I large/middle-market .50/small .50; loans/leases growth; delinquency .50/charge-off .50. |
| Liquidity | Balance-sheet proxy .50, real monetary stock .50 | One H.4.1 constructed measure; real M2. Reserve balances are context. |

These are measurement families, **not statistically independent samples**. GDP embeds PCE; income/PCE, CPI/PCE, and PCE-derived real rates/M2 share dependencies. Disclose them; never describe six cards as six independent confirmations.

Correlated additions are diagnostic slots with zero scoring/quality/coverage influence. They cannot expand family weight. Housing variants, industrial-production subgroups, retail consumption variants and liquidity accounting terms never become separate confirmation votes. Changing a registered primary slot requires a methodology version. Shared underlying observation identity is preserved in uncertainty calculations.

## 7. Factor-Specific Transformations

`S(x; anchors)` is linear interpolation between ordered `(native value, stress score)` pairs, clipped at endpoints. Keep internal precision and round only for display. Missing/nonfinite inputs, nonpositive required indexes, missing comparison periods, incompatible seasonal basis or unexplained definition breaks make the slot unavailable.

For monthly real activity, `m3` is the latest three-month mean; `g3=100*((m3_t/m3_t-3)^4-1)`, requiring six consecutive months. Inflation YoY is `100*(X_t/X_t-12-1)`; SA three-month annualized inflation is `100*((X_t/X_t-3)^4-1)`. A published SAAR rate is never annualized twice.

| Indicator / meaning | Transformation and adverse direction | Runtime history / reference target / caveat |
| --- | --- | --- |
| CPI/PCE inflation | YoY percent: `(0,0),(1,10),(2,25),(3,50),(4,70),(6,90),(8,100)` | 13 index months; target 120 transformed months. CPI NSA for YoY, SA for short pace. Deflation is tagged separately, not treated as proof of healthy growth. |
| Real GDP | Official SAAR growth: `(-4,100),(-2,85),(0,65),(1,50),(2,30),(3,15),(4,5),(5,0)` | Two quarters if derived; target40. Lower growth is adverse; trade/inventory/revisions can distort headline growth. |
| IP / real PCE / real disposable income | Separate families using g3 and the GDP growth anchors | Six months; target120 each. IP omits much services; PCE overlaps GDP; disposable income includes transfers and receives fiscal-composition warnings. |
| Housing permits/starts | YoY change in m3: `(-30,100),(-15,80),(-5,60),(0,45),(5,25),(15,5),(25,0)` | 15 monthly levels; target120. Rate-sensitive, noisy; SAAR units cancel in ratios. |
| Payroll | g3: `(-3,100),(-1,85),(0,65),(1,40),(2,20),(3,5),(4,0)` | Six months; target120. Revisions and population growth affect interpretation. |
| Unemployment level | Percent: `(3,0),(4,25),(5,50),(6,70),(8,90),(10,100)` | Latest month; target120. Not a natural unemployment-rate estimate. |
| Unemployment gap | Latest 3-month mean minus minimum 3-month mean in trailing12 months, pp: `(-.2,0),(0,20),(.25,45),(.5,70),(1,90),(2,100)` | 14 monthly rates; target120. Sahm-like, not the official real-time Sahm Rule. |
| Claims intensity | 4-week mean initial claims / latest eligible payroll employment *1,000: `(.8,5),(1.2,20),(1.8,45),(2.5,70),(3.5,90),(5,100)` | Four weeks plus known employment denominator; target520 weeks. Match units and release dates; administrative coverage differs. |
| Real-policy stance | `r=target midpoint-core PCE YoY`, pp: `(-2,0),(0,25),(1,50),(2,75),(3,90),(4,100)` | Current action/latest eligible core PCE; target120 monthly points. Ex-post proxy, not expected real rates or measured r-star. |
| Real financing | 20-business-observation median real 10Y yield, percent: `(-1,0),(0,25),(1,50),(2,75),(3,100)` | 20 observations; target2,520 daily points. Term premium, market liquidity and methodology matter. |
| Lending standards | Net C&I tightening percent: `(-40,0),(-20,15),(0,35),(20,60),(40,80),(60,95),(80,100)`; each slot is `.60*S(latest)+.40*S(mean latest4 surveys)` | Four surveys; target40 quarters. Diffusion of changes, not the absolute level of standards; unchanged after tightening need not mean easy. Extra surveys do not add quarterly votes. |
| Bank credit volume | Annualized change in 4-week mean loans/leases against13 weeks earlier: `(-5,90),(0,65),(4,35),(8,10),(12,0)` | 17 weeks; target520. Nominal volume reflects demand, supply, prices and drawdowns; alone does not identify a squeeze. |
| Credit performance | Delinquency percent `(1,10),(2,35),(3,60),(5,85),(8,100)`; charge-off percent `(.2,10),(.5,35),(1,60),(2,85),(4,100)` | Latest published quarter; target40. Lagging/composition/accounting caveats. |
| Balance-sheet proxy | 13-week percentage change in LP: `(-10,100),(-5,85),(-2,65),(0,45),(2,25),(5,10),(10,0)` | Same-basis now/prior13 weeks; target520. Positive denominator and consistent definitions required. |
| Real M2 | g3 of `M2/headline PCE index`: `(-10,100),(-5,85),(0,55),(3,35),(6,15),(10,0)` | Six matched months; target120. Not reserves, velocity, funding liquidity or offshore dollars. |

Reference targets measure diagnostic completeness, not universal minimum eligibility for fixed native-unit transforms. Runtime history is the minimum in the table. Below five years of transformed reference history is `history_limited` and makes a required-input assessment provisional; five-to-ten years is usable with a quality deduction. No generic percentile or arbitrary 80% history gate is imposed.

**Liquidity equation:** `LP_t = Fed assets_t - TGA_t - RRP_Others_t`, all **weekly-average USD millions** from the same H.4.1 week. RRP Others is not exact daily NY Fed ON RRP. Reserves are displayed alongside, never counted again. Subtraction describes a heuristic balance configuration, not proof that each dollar becomes investable liquidity. LP excludes currency/other liabilities, bank-credit creation, collateral, distribution, money demand, offshore dollars and transmission. Fiscal timing can dominate. Real M2 provides another measurement perspective, not independent causal proof.

Native anchors are initial economic judgments, not estimated harm probabilities. Nominal 10Y/2Y yields, curve slope and policy hiking/holding/cutting remain multi-cause context. High nominal yields or a ZIRP-biased Fed Funds percentile never mechanically become restriction.

## 8. Score Direction Conventions

Core scores: **0 low adverse pressure/resilient on this dimension; 100 high pressure/stress**. Different dimensions are not equal economic severity. Overlay congestion/price-pressure scores are descriptive and never imply favorable investing outcomes.

Level, stress-score change and native momentum are distinct. Three-month stress-score changes use `<=-20 strongly improving`, `(-20,-8] improving`, `(-8,8) neutral`, `[8,20) deteriorating`, `>=20 strongly deteriorating`. Use common registered slots/basis at both endpoints. A source disappearance is not economic momentum. Below60% common eligible weight or insufficient comparison history gives unknown, never neutral or "not deteriorating."

Monthly comparisons use exactly three observation months earlier; weekly comparisons13 weeks; quarterly comparisons one quarter. Daily financing comparisons use the eligible20-observation median ending on/before the date three calendar months earlier, with at most7 calendar days alignment gap. Target/real-policy comparisons use the effective target and latest eligible core PCE known at each comparison date, never a future action/release. Core PCE's inflation horizon is12 months. Current/revised diagnostic availability remains distinct from vintage-known values.

For score changes, bounds are `[currentLower-priorUpper,currentUpper-priorLower]`; e.g.[5,25]-[10,30] gives[-25,15], not a known improvement. Native pp gates (deltaPi,r,deltaR,deltaTarget) require usable observed constituent values at both endpoints; the0-100 score interval cannot bound them. Otherwise the native predicate is unknown. Known I>=60 can prove HOT without acceleration; I55 with unknown acceleration cannot prove either HOT or notHOT.

## 9. Coverage Rules and Missing Contributions

Usable primary slots require correct finite values/units/seasonality, runtime history, freshness and cleared reuse. A family needs >=60% of its own fixed slots plus essential inputs: core for CPI/PCE, unemployment for household Labor, every component for constructed measures. Below the family floor, none of its slots contribute eligible factor-score weight.

Factor coverage `c=sum(familyWeight*eligibleFamilySlotCoverage)`. Adequate >=80%; Limited60-79.999%; Unavailable<60%. Classifiable core factors also require two eligible families. Applying80% as another hard classifiability gate is rejected: losing a .30 Credit family should not destroy the .70 still observed.

Let `b` be eligible transformed scores times their **original** slot/family weights. Display estimate `b/c` only when classifiable; classification uses possibility bounds `[b, b+100*(1-c)]`. These are not confidence intervals. `score<=T` is true only if upper<=T, false only if lower>T, otherwise unknown; reverse for high-score predicates. Missing factors span[0,100]. Shared-input dependencies remain linked.

Example: weights .40/.30/.30, scores90/20/20 yield48. Removing90 gives a display20 at60% coverage, but bounds[12,52]. It cannot prove Inflation<=45. Unknown momentum cannot pass negative wording.

| Assessment status | Exact conditions |
| --- | --- |
| NORMAL | Four anchors classifiable, at least one supporting factor classifiable, at least five total; required factors have >=80% coverage, required slots have >=5-year reference history and release-quality r>=.8, and every required momentum/native comparison is known; the label is invariant across admissible missing completions. |
| PROVISIONAL | Four anchors classifiable, but only four total; or required inputs have Limited coverage/history/metadata; or missing completions make the decision ambiguous. Named labels are allowed only when proven invariant. Otherwise currentRegime=null with candidates/reasons. |
| INSUFFICIENT_DATA | Any anchor not classifiable or fewer than four factors classifiable. No regime/clarity; factors and Data Quality remain useful. |

Only **required** supporting inputs determine provisional status; an unused supporting outage need not invalidate an otherwise proved descriptive regime. Both supporting factors missing permits four-anchor Provisional inflation/activity descriptions, with financial themes suppressed. Goldilocks cannot prove benign financing/veto absence. This replaces the feedback's ambiguous "materially unsafe" exception with explicit gates.

Evaluate all rules true/false/unknown. A label must survive all admissible missing contributions; threshold boundaries/interiors partition the bounded domain. Missing-driven label ambiguity yields Provisional/null, **not MIXED**. A fully resolved configuration outside positive envelopes or with economic disagreement yields MIXED. Outages may withdraw assertions but cannot supply evidence of improvement. Record source-driven withdrawal as data_change, not economic regime_change. A cached previous assessment is separately dated as last known.

## 10. Data Quality Formula

Fixed core slot weights `w_j=(1/6)*familyWeight*slotWeight` sum to1. Derived slots keep their registered dependencies. Overlay and diagnostic additions have no influence. Within a version, neither the denominator nor the configured source set shrinks.

For each slot:

- e=1 only when the primary scoring slot is valid, fresh, runtime-sufficient and reuse-cleared, else0. Unusable slots never receive the .40 base contribution. Partial usable cells can contribute dataset completeness even when their family/factor floor is unmet; this does not make the factor classifiable.
- f=1 through expected publication; decline linearly to0 during overdue grace. Stale also sets e=0. Missing-calendar fallback is disclosed.
- h=`min(1, valid transformed reference observations/fixed target)`, with no later observations or invented valid cells.
- r=1 actual current-value/version timestamp; .8 actual date; .5 verified publication interval from the official calendar; .25 observation/first-seen evidence only;0 no publication evidence. Current workbook publication is not old-cell original publication.
- health=1 last fetch successful; .8 failed fetch with fresh verified cache;0 no usable observation.

`q_j = e_j*health_j*(.40+.20*f_j+.20*h_j+.20*r_j)`

`DataQuality = round(100*sum(w_j*q_j))`

For derived slots, eligibility requires every necessary constituent. Use minimum constituent freshness/release/fetch-health quality and joint valid-history count; derived release time is the latest constituent release only when all are known. Missing metadata never upgrades a derived value's quality.

Emit even with insufficient data. Source health, runtime sufficiency, history and publication quality enter; economic agreement, conflict, regime support, margin, winner and sensitivity never enter. Source reliability is enforced at admission/provenance rather than by economic agreement.

**Monotonicity proof:** deletion/staleness/failure/blocking replaces nonnegative fixed contributions with smaller values/zero. Their sum and monotone rounding cannot rise. Tests hold time/version/unaffected evidence fixed. Deletion cannot substitute an older higher-quality primary slot, delete uncertain metadata to upgrade r, shrink the history target, or remove a configured weight. A genuine newly supplied observation is a different operation.

## 11. Regime Clarity Formula

`ClarityRaw=.45*W+.35*B+.20*(100-X)`

W=selected rule's conservative diagnostic support; for MIXED W=0. B=100 times the smaller single-scenario/coherent-scenario agreement in section20. X=max currently detected **core** tension severity,0 if none; maximum avoids duplicate conflict penalties. Overlay tensions never enter.

Round/clip0-100; cap MIXED or FRAGILE at49 and MODERATELY SENSITIVE at69. Null/unresolved or Insufficient assessments have null Clarity. Provisional but proved states are not automatically low clarity: quality/status separately disclose limitations. Native-policy sensitivity that changes identity also caps at49.

Clarity is not probability, predictive accuracy or data confidence. Complete/fresh timestamped evidence with h=.55 gives Data Quality91; a robust MIXED fixture with core conflict70 gives Clarity41. Stable mixed conditions can have Low transition risk.

## 12. Current Regime Taxonomy

| API enum | UI label / meaning |
| --- | --- |
| GOLDILOCKS | Goldilocks: contained inflation, resilient activity/labor, compatible policy and observed benign financing |
| OVERHEATING_REFLATION | Overheating / Reflation: descriptive inflationary expansion; neither excess-demand causation nor every low-inflation recovery is asserted |
| STAGFLATIONARY | Stagflationary: high/rising inflation with broadly weak activity/labor |
| CONTRACTION_RECESSIONARY | Contraction / Recessionary: severe joint activity/labor weakness outside the hot-inflation state; not official recession dating |
| DISINFLATIONARY_SLOWDOWN | Disinflationary Slowdown: contained/non-accelerating inflation and observed non-severe activity weakness |
| MIXED | Mixed: economic disagreement or a configuration outside positive envelopes |

Data statuses are separate. Severe high-inflation weakness is STAGFLATIONARY with `activitySeverity=CONTRACTION_LEVEL`, not a rule-order auction. Mixed reasons include activity_labor_divergence, restrictive_expansion, inflation_intermediate, no_positive_envelope and rule_configuration_conflict.

## 13. Exact Positive Regime Gates

I/G/L/P/C/Q denote the six stress scores/bounds. deltaPi is the weighted core CPI/PCE **SA three-month annualized pace** change against three months earlier, in pp, using common fixed families. deltaP is three-month Policy stress change; r is target midpoint-core PCE YoY; deltaR and deltaTarget are three-month real-proxy/nominal-target changes. Unknown cannot satisfy a negative predicate.

HOT=`I>=60 OR(I>=50 AND deltaPi>=.30)`.
RESILIENT=`(G<=45 AND L<=50) OR(L<=45 AND G<=50)`.
ACTIVITY_DIVERGENCE=`min(G,L)<=45 AND max(G,L)>=55`.
SEVERE_WEAKNESS=`G>=65 AND L>=60`.

| Regime | All mandatory gates |
| --- | --- |
| Goldilocks | I<=45,G<=45,L<=50,P<=55; r<=1.50pp,deltaR<=.50pp,deltaTarget<.50pp,deltaP<8; C<=50 OR Q<=55; **C<65 and Q<70**; every core factor<80; deltaPi<.30pp; fewer than3 core stress momenta>=8; not ACTIVITY_DIVERGENCE. Required comparisons must be known/proved. |
| Overheating / Reflation | HOT and RESILIENT and not ACTIVITY_DIVERGENCE. No financial stress prerequisite. |
| Stagflationary | HOT and(G>=55 OR L>=55) and not ACTIVITY_DIVERGENCE. No financial stress prerequisite. Severe weakness adds the contraction-level qualifier. |
| Contraction / Recessionary | SEVERE_WEAKNESS and not HOT. No continued deterioration or stressed-finance prerequisite. |
| Disinflationary Slowdown | I<=45,deltaPi<.30,(G>=50 OR L>=55), not RESILIENT, not SEVERE_WEAKNESS, not ACTIVITY_DIVERGENCE. Momentum alone cannot overwrite a resilient observed state; policy incompatibility alone cannot establish slowdown. |
| Mixed | Resolved evidence with no positive envelope, activity divergence or conflicting proved rules. Missing-driven ambiguity is a data status. |

The r ceiling is a conservative compatibility guard, not measured neutral rates; test1.25/1.50/1.75pp. Falling nominal rates may still raise real restriction when inflation falls faster; deltaR catches this. Benign liquidity cannot hide Credit79. Missing supporting evidence cannot prove veto absence. High cooling inflation remains HOT; low-level reflation is a direction qualifier until the inflation floor is reached.

## 14. Rule Support System

Evaluate the unordered rule set: one proved invariant rule selects identity; zero with resolved evidence gives MIXED; multiple gives MIXED/configuration conflict. Remove the old75 support minimum and10-point selection margin. Otherwise optional finance can quietly become mandatory again, and incomparable rule weights arbitrate economic meaning without calibration.

Support is diagnostic: `low(x,T)=clip(60+2*(T-x),0,100)`, `high(x,T)=clip(60+2*(x-T),0,100)`. `hotSupport=max(high(I,60),min(high(I,50),clip(60+40*(deltaPi-.30),0,100)))`; unknown deltaPi omits that OR branch. `resilientSupport=max(min(low(G,45),low(L,50)),min(low(L,45),low(G,50)))`.

| Rule | Diagnostic support |
| --- | --- |
| Goldilocks | .25*low(I,45)+.20*low(G,45)+.15*low(L,50)+.25*low(P,55)+.15*max(low(C,50),low(Q,55)) |
| Overheating | .50*hotSupport+.50*resilientSupport |
| Stagflationary | .50*hotSupport+.50*max(high(G,55),high(L,55)) |
| Contraction | .50*high(G,65)+.50*high(L,60) |
| Disinflationary Slowdown | .50*low(I,45)+.50*max(high(G,50),high(L,55)) |

No support overrides mandatory gates. Ineligible rules retain uncapped diagnostic support and their failed/unknown gates; no artificial49 cap manufactures a margin. Without a meaningful eligible runner-up, ruleMargin=null. Finance/energy can modify severity/commentary, but Energy never changes core support. Sensitivity and observed tensions carry the instability/clarity information.

## 15. Leading Direction Methodology

The 0-3 month monitoring panel is labeled **observed momentum; lead timing not validated**. It never overwrites Current Regime. Use two channels so improving inflation cannot conceal weakening jobs/activity:

1. Leading Direction (activity & credit): Growth .40, Labor .40, Credit .20. Growth direction uses monthly production .35/consumption .35/income .15/housing .15; omit lagged quarterly GDP. Labor/Credit use registered stress-score changes. Map labels to-2/-1/0/+1/+2; weighted mean bands are <=-1.25 strongly improving,(-1.25,-.5] improving,(-.5,.5) neutral,[.5,1.25) deteriorating,>=1.25 strongly deteriorating.
2. Inflation Direction: deltaPi <=-1pp strongly improving,(-1,-.30] improving,(-.30,.30) neutral,[.30,1) deteriorating,>=1 strongly deteriorating.

Each factor gets one vote, not one vote per series. Two deteriorating activity/credit factors force at least deteriorating; two strongly deteriorating force strongly deteriorating. Symmetric improvement breadth applies only with no observed deteriorating vote; otherwise retain the mean and show dispersion.

Factor momentum needs>=60% common eligible weight/two families. The activity channel requires Growth and Labor directions, >=80% configured vote weight, and an invariant direction across missing votes. Unknown Credit spans[-2,+2], not zero. Otherwise direction is unknown/provisional. Display "Disinflation with weakening activity" when appropriate. This uses all four requested factors with distinct semantics; it does not claim established forecast lead or distinguish supply disinflation from demand destruction causally.

## 16. Transition Risk Methodology

Transition Risk describes instability/proximity, not a probability. Evaluate:

- Elevated: three G/L/C directions deteriorate; two strongly deteriorate; a different named regime appears in sensitivity alongside at least two deteriorating G/L/C factors; or abs(deltaR)>=1pp alongside at least one deteriorating factor.
- Moderate: two G/L/C deteriorate; any different resolved label appears in sensitivity; a core tension is new or worsens>=25 severity points; or abs(deltaR)>=.50pp or abs(deltaTarget)>=.50pp accompanies at least one deteriorating G/L/C factor.
- Low: no trigger and required comparisons are available. Stable MIXED can be Low.

Unavailable comparisons give unknown unless observed evidence proves Elevated. Static contradiction alone lowers Clarity, not automatically Transition Risk. A newly available feed is not a newly emerged tension. Without a comparable prior snapshot, new/worsening tension status is unknown. No automatic hysteresis or minimum-duration rule hides observed changes.

## 17. Conflicts / Tensions Framework

| Deterministic trigger | Severity / scope |
| --- | --- |
| One G/L<=45, other>=55 | 70 if gap>=25, else40; core, activity-divergence state |
| Weighted core YoY falls>=.30pp while deltaPi>=.30pp | 40 core; annual inflation versus short pace |
| deltaP>=8 or deltaR>=.50pp while Liquidity stress change<=-8 | 40 core; transmission tension |
| G<=45 with Credit stress change>=8 | 55 core; resilient activity/weakening credit |
| Standards>=60 and volume<=35, or reverse | 40 core; supply/volume disagreement |
| Indonesia FX proxy>=65 alongside a rate-based carry theme | 70 overlay; qualify/suppress theme only |

Each flag records evidence/dates/scope and economic versus data-availability change. Unknown inputs do not prove conflict or agreement. X in Clarity is maximum core severity; overlay tensions are excluded. Conflicts affect Clarity, commentary and conditional transition checks, **never Data Quality**.

## 18. Research Implications Guardrails

Replace Asset Playbook with Research Implications: researchThemes, counterSignals, overlayContext, uncertainties and guardrails. Themes are hypotheses/questions, not portfolio instructions.

No strong buy/sell/favor/reduce directives. Provisional/insufficient assessments suppress directional asset implications. Restrictive/worsening policy is stated beside benign activity. Every relevant counter-signal and unavailable overlay accompanies its theme. Carry commentary requires actual eligible rate data, currently unconfigured; USDIDR alone cannot imply attractive carry. If later admitted, elevated FX risk must sit beside that thesis. Congestion is not crypto buying, and rising oil is not proven supply causation. The report remains deterministic and **rules-generated**, with no calibrated-model or external OpenAI claim.

## 19. Historical Diagnostic Design and Actual Checks

The first complete run must be labeled **CURRENT / REVISED-HISTORY DIAGNOSTIC**. Latest historical values/current seasonal factors plus historical periods are not point-in-time data. Calendar alignment does not remove revision/look-ahead bias.

**TRUE POINT-IN-TIME VINTAGE VALIDATION** requires the actual value/version known at t, with version-specific releasedAt<=t, contemporaneous seasonal adjustments and announcement/effective policy dates. Missing publication/version evidence is excluded, never backdated. A current workbook release date cannot authenticate an old cell. No durable vintage store exists today.

Before public activation, run monthly snapshots2015-2025 with earlier warm-up/reference history. Inspect2017-2019 expansion,2020 shock/rebound,2021 reflation,2022 inflation/tightening,2023-2024 disinflation/soft-landing configurations and2025 mixed episodes. Retain factor contributions/bounds, gates/support, source/vintage gaps, quality/clarity, direction/risk, sensitivity, duration and flips. Separate economic changes from outages. Flag <2-month named durations, >4 named changes/year and prolonged MIXED/no-envelope periods for investigation, not automatic fitting. Show unfavorable periods too; inspect2020 base effects.

Actually inspected **archived-release sanity checks**, not historical core classifications:

| Episode / source | Release-vintage observation / design implication |
| --- | --- |
| [2019Q4 advance GDP](https://www.bea.gov/news/blog/2020-01-30/gdp-increases-fourth-quarter) | +2.1% SAAR => GDP-family28.5; insufficient alone for Growth/Goldilocks. |
| [2020Q2 third-estimate analysis](https://apps.bea.gov/scb/issues/2020/10-october/1020-gdp-economy.htm) | -31.4% => GDP-family100; transfer-supported income cannot dominate broad activity. |
| [2021Q4 advance GDP](https://www.bea.gov/sites/default/files/2022-01/gdp4q21_adv_fax.pdf), [Dec2021 CPI](https://www.bls.gov/news.release/archives/cpi_01122022.htm) | GDP+6.9%, CPI headline7.0/core5.5%; high inflation can coexist with expansion before financing restriction. |
| [June2022 CPI](https://www.bls.gov/news.release/archives/cpi_07132022.pdf) | Headline9.1%; later cooling cannot erase a still-high inflation state. |
| [2023Q4 third-estimate GDP](https://www.bea.gov/news/2024/gross-domestic-product-fourth-quarter-and-year-2023-third-estimate-gdp-industry-and) | +3.4%; strong activity need not mean compatible policy; quarterly PCE pace is not YoY. |
| [2025Q1 third-estimate GDP](https://www.bea.gov/news/2025/gross-domestic-product-1st-quarter-2025-third-estimate-gdp-industry-and-corporate-profits) | GDP-.5%, private domestic final sales+1.9%; headline trade/inventory weakness motivates multiple Growth families. |

These numbers are their inspected release vintages, not claimed latest revisions. The full duration/flip/contribution diagnostic **has not run**; history ingestion remains incomplete. These spot checks and fixtures do not substitute for it or validate forecasts.

## 20. Threshold-Sensitivity Methodology

Keep production thresholds fixed. Independently test base-5/base+5 for16 semantic score cutoffs: contained I45; hot I60; acceleration floor I50; resilient first45; resilient second50; weak55; slowdown G50; slowdown L55; Policy55; benign Credit50; benign Liquidity55; Credit veto65; Liquidity veto70; extreme80; contraction Growth65; contraction Labor60. Shared resilience/weak cutoffs also control divergence. Then shift all16 by-5 and+5. This gives34 scenarios plus baseline.

Single agreement is the matching fraction of32 one-at-a-time cases. Coherent agreement is the matching fraction of2 all-shift cases. B=100*min(the two). Unresolved outcomes count as different, never dropped.

ROBUST: all preserve baseline. MODERATELY SENSITIVE: some differ, min agreement>=.80 and no named-to-different-named switch. FRAGILE: all other cases. Stable MIXED can be robust yet unclear.

Also test real-policy ceiling1.25/1.50/1.75pp, change guards.25/.50/.75pp, inflation acceleration.20/.30/.40pp, support slope1.5/2/2.5 and removal of each family. Native-policy identity changes cap Clarity49. Removal is a data diagnostic. These checks never choose/tune production thresholds against current or desired output.

## 21. Tests / Invariants and Worksheet Results

In-memory analytical worksheet, **not production tests**:15 complete-data fixtures,34 score-threshold cases each;120 permutations per fixture with0 discrepancies/1,800 evaluations; all64 masks of six unequal nonnegative quality contributions with0 quality increases/192 directed deletion edges. Exact fixture inputs, perturbation outcomes and quality-removal weights are retained in [review evidence](2026-10-03-macro-regime-review-evidence.json); no implementation module was created.

An additional0..100 Credit-completion sweep in5-point steps preserves the inflation-before-policy-response label for all21 completions. The contained/resilient fixture instead admits both Goldilocks and Mixed as Credit varies, so loss of Credit must withdraw that label rather than imply benign finance. These sweeps are analytical examples, not full production dependency/completion tests.

| Fixture (I/G/L/P/C/Q) | Base result / sensitivity |
| --- | --- |
| 30/25/30/30/25/35 | GOLDILOCKS; ROBUST34/34 |
| 75/25/25/20/20/20, deltaPi=.8 | OVERHEATING_REFLATION before policy response; ROBUST34/34 |
| 85/25/30/30/25/25, deltaPi=-1.2 | Cooling high inflation expansion; OVERHEATING_REFLATION; ROBUST34/34 |
| 75/65/65/20/20/20 | STAGFLATIONARY with calm finance; ROBUST34/34 |
| 85/70/65/30/25/25, deltaPi=-1.2 | Cooling STAGFLATIONARY/contraction-level; ROBUST34/34 |
| 30/85/80/30/20/20 | CONTRACTION_RECESSIONARY; ROBUST34/34 |
| 30/58/52/50/45/45, deltaPi=-.5 | DISINFLATIONARY_SLOWDOWN; ROBUST34/34 |
| 75/25/70/50/40/40, deltaPi=.8 | MIXED; ROBUST34/34; quality91/clarity41 |
| 30/25/30/75/25/25, r=3 | MIXED restrictive expansion; ROBUST34/34 |
| Policy50 but r=3, otherwise contained/resilient | MIXED, no diluted-policy Goldilocks; ROBUST34/34 |
| Policy50,r=1.2,deltaR=.8 | MIXED real tightening; ROBUST34/34 |
| Credit79,Liquidity25, otherwise contained/resilient | MIXED financial veto; ROBUST34/34 |
| 45/45/50/55/50/55 | Boundary GOLDILOCKS; FRAGILE28/34, coherent agreement.50 |
| 52/25/30/20/20/20, deltaPi=.8 | OVERHEATING_REFLATION; FRAGILE32/34, coherent agreement.50 |
| 25/25/30/20/20/20, deltaPi=.8 | MIXED with reflation direction; ROBUST34/34 |

Unspecified native changes are0,r=1; metadata/runtime history valid. For the high-quality MIXED fixture, reference completeness h=.55 with f=r=health=e=1 gives quality91; conflict70 and B100 give clarity41. These are synthetic assumptions, not observations about a current economy.

Mandatory production tests:

1. Quality deletion monotonicity for every configured/derived slot, missing/stale/failed/blocked/cache states, reference deletions and rounding, with a fixed denominator.
2. Overlay-only values/health leave all core outputs identical; no energy leakage/double counting.
3. All score/native threshold perturbations reproduce diagnostics; production configuration is immutable during them.
4. All120 rule permutations preserve label/status/reasons/support, with canonical output order.
5. Correlated diagnostic clones do not add influence/coverage/quality/votes; shared dependencies remain linked.
6. High-quality contradictory evidence gives MIXED91/41; conflict edits cannot change Data Quality.
7. No Goldilocks fallback; native restriction/tightening/credit vetoes work; calm finance cannot block inflationary regimes; stable severe weakness remains contraction.
8. Each supporting outage, both outages, anchor<60%, one-family cases, exactly60/80%, [12,52] example and unknown negative predicates behave as specified. Missing-data withdrawal is distinguished from economic change.
9. Unknown/composition-changing momentum is not neutral; disinflation cannot hide weak activity.
10. Vintage/release gates exclude future versions; observation/release/retrieval remain distinct; SAAR is not double annualized.
11. Parsers reject HTML-as-CSV, ambiguous/missing rows, unit/seasonality changes, definition breaks and leaked secrets; Treasury history is not current-year-only.

Before shipping app changes, npm test, npm run lint, TypeScript checking and npm run build must pass, then the existing Netlify deployment must be checked. Application tests/build were not run for this documentation-only revision.

## 22. Source / Licensing Exclusions

ICE/BofA spreads, commercial PMI/paid feeds and unlicensed BTC/gold/stablecoin series remain excluded. Chicago Fed NFCI/CFNAI and Atlanta Fed GDPNow require their own reuse review; free viewing is insufficient and GDPNow is a nowcast, not observed GDP. BI and Mempool remain redistribution_blocked. Board/BEA/Census ordinary-data policies do not clear external/third-party/branding material. No automatic provider or semantic-series substitution to improve coverage. Missing credentials mean missing/not_configured; parse/upstream errors mean failed.

## 23. Known Limitations and Product Semantics

Initial anchors, weights,60% coverage and gates are transparent policy choices, not empirical calibration. Remaining limitations: related families, fiscal transfers, lagging credit losses, backward-looking real rates, uncertain neutral stance, proxy liquidity, base effects, taxonomic gaps and revisions. A simple disclosed model is preferable to unvalidated complexity.

Preserve the clean overview. Hero: U.S. Macro Regime, Data Quality N/100, Regime Clarity N/100, Leading Direction(activity & credit), Inflation Direction, Transition Risk, status and distinct timestamps. Details/bounds/rules/source terms belong in secondary tabs. No confidence percentages or global-economy claims.

Future API migration: schemaVersion2; methodologyVersion US-MACRO-0.2; usMacro.currentRegime, assessmentStatus, dataQuality, regimeClarity, leadingDirection, inflationDirection, transitionRisk, reasonCodes, ruleDiagnostics; factors, overlays, researchImplications and distinct timestamps. Enums are sections9/12; nullability is intentional. Remove legacy confidence/evidenceStrength/global naming/playbook commands/MIXED_TRANSITION when app implementation is authorized.

Migration targets: lib/types.ts, lib/scoring.ts, lib/playbook.ts, both API routes/reports, dashboard language, fixtures/tests and README together. These are targets, not files changed in this review. Keep source fetching, transformations, gates, quality, direction, validation and UI separate; page/API share the same server evaluation.

## 24. Red-Team Findings

| Weakness found | Disposition |
| --- | --- |
| Opposing G/L qualifies both inflationary regimes | Explicit divergence =>MIXED; severe HOT weakness gets a contraction qualifier. |
| Easing momentum erases still-high inflation | HOT level branch is independent of improvement. |
| Averaged policy hides restriction; benign liquidity hides Credit79 | Native stance/change requirements and credit/liquidity vetoes. Neutral-rate uncertainty remains disclosed/tested. |
| Adverse feed removal creates benign score | Fixed possibility bounds, unknown gates and null data-constrained outcome. |
| Four anchors both Provisional/Insufficient under vague unsafe exception | Explicit mutually exclusive status table and regime-specific proof. |
| Generic rates percentile misinterprets policy | Ex-post real-policy/real-financing transforms; nominal context only. |
| GDP/spending/accounting variants multiply apparent evidence | Fixed measurement families/slots, no statistical-independence claim or new clone weights. |
| Weak loan volume is assumed credit supply | Standards/volume/performance separated; disagreement flag. |
| Liquidity equation carries false precision | Same-basis proxy equation, distinct real-M2 family and limitations. |
| Falling inflation cancels weakening jobs | Two direction channels and activity breadth guard. No validated lead claim. |
| Contradiction lowers confidence in reliable data | Quality independent; MIXED with91 quality and41 clarity retained. |
| Hard boundaries flip / smoothing hides change | Fragility labels/caps and historical duration checks; no automatic stickiness. |
| Revised old periods mistaken for historically available values | Version-specific publication requirement; full historical/vintage work remains unverified. |
| HTML200, credential changes, retiring DDP, current-year yields | Source format/contracts and history acceptance work explicitly pending. |
| Overlay support changes regime | Core function excludes overlays; isolation covers all core outputs. |
| Carry inferred without rates | Eligible-rate prerequisite and nearby FX counter-signal. |

Two read-only reviewers independently examined methodology logic and source feasibility. Their material counterexamples informed these patches. This is a bounded logical review, not an assertion of exhaustive empirical robustness.

## 25. Remaining Unresolved Decisions

1. Choose/test BEA XLSX versus registered JSON, Census ZIP ingestion and maintained Fed history routes. Verify exact semantic rows, starts, breaks and release metadata before source enablement.
2. Retain Treasury reuse evidence and resolve optional overlay terms or leave them blocked. Overlay absence does not prevent core implementation.
3. Run the full revised-history duration/flip/contribution/sensitivity diagnostic. Material implausibility, excessive flipping or prolonged uninformative MIXED requires a versioned methodology revision before public activation, never tuning to today's answer.
4. Reproduce worksheet cases and all missing/derived-data invariants in production tests; verify deployment after implementation.

Default taxonomy/copy, transforms, weights, formulas and guards are fully specified above. Durable vintage storage/true point-in-time validation remain later features requiring a concrete storage design. Their absence permits a honestly labeled current/revised monitor, but prohibits backtest/predictive claims.

## 26. Final Recommendation

**APPROVE WITH MINOR CONDITIONS for implementation of the framework and its acceptance work.** It is not approval to publish historical-validation claims or activate unverified sources. The full empirical diagnostic/source/runtime checks remain explicit conditions; no further methodological complexity is needed merely to begin implementing them.

- [x] Positive Goldilocks includes policy compatibility and worsening-stance controls.
- [x] Overheating/Stagflation do not require finance stress; high cooling inflation is recognizable.
- [x] MIXED, direction, transition, quality and clarity are distinct.
- [x] Coverage tolerates supporting outages while withholding unprovable labels.
- [x] U.S. scope/overlay isolation, factor-specific transforms, Growth breadth and liquidity-proxy limitations are explicit.
- [x] Missing evidence cannot become positive support; Data Quality removal is monotone.
- [x] Synthetic threshold fragility was checked and is surfaced.
- [x] Revision/vintage limitations and public-source admission are explicit.
- [ ] Full revised-history duration/flip/contribution diagnostic retained and reviewed.
- [ ] Production histories/reuse/parser contracts and runtime invariant tests verified.

**No application implementation code was written.**
