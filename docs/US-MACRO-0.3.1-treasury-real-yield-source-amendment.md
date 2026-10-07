# US-MACRO-0.3.1 Treasury Real-Yield Source Amendment

Review date: 2026-10-06
Decision: Admit the official U.S. Treasury `TC_10YEAR` series for public dashboard retrieval, transformation, and display under the source-governance standard. This is a source-only amendment; it does not change US-MACRO-0.3 methodology.

## Scope

The existing `policyRates.realFinancing` slot remains the daily 10-year real Treasury constant-maturity yield in percent, using the frozen median of the latest 20 business-day observations. The history target remains 2,520 daily observations for quality scoring. This amendment changes only provider/access, native identifier mapping, parsing, provenance, and source metadata.

## Admitted Source

- Publisher/owner: U.S. Department of the Treasury.
- Dataset: Daily Treasury Par Real Yield Curve Rates.
- Native field: `TC_10YEAR` (10-year real constant-maturity yield, percent).
- Official XML endpoint: `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_real_yield_curve&field_tdr_date_value=YYYY` (replace `YYYY` with the calendar year).
- Official delivery documentation: [Treasury Daily Interest Rate XML Feed](https://home.treasury.gov/treasury-daily-interest-rate-xml-feed).
- Official data description and rate table: [Treasury Interest Rate Statistics](https://home.treasury.gov/policy-issues/financing-the-government/interest-rate-statistics?data=yield) and [Daily Treasury Rates](https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_real_yield_curve).
- Availability/history: Treasury documents daily real-yield history from 2003. The application requests each calendar year separately and retains only dated `TC_10YEAR` observations actually returned. The feed is a business-day series; weekends and holidays are not manufactured.
- Provenance: Treasury describes the published par real yield curve as based on indicative market quotations obtained by the Federal Reserve Bank of New York. The application consumes only Treasury's published interpolated `TC_10YEAR` values, not underlying dealer quotations.
- Release metadata: The feed supplies observation dates but does not establish an exact publication timestamp. The adapter therefore leaves `releasedAt` and `firstSeenAt` null and assigns release-date quality 0.

The parser fails closed on malformed XML, malformed rows, duplicate dates, out-of-range values, or a row returned under a different year request. Missing annual responses produce partial history; no rows are interpolated or backfilled. A current score is eligible only when the latest 20 valid business-day observations exist and the existing freshness checks pass. A partial long history remains partial and lowers history quality independently.

## Public Reuse and Attribution

The [Data.gov catalog record for Daily Treasury Real Yield Curve Rates](https://catalog.data.gov/dataset/daily-treasury-real-yield-curve-rates), published by Treasury's Office of Debt Management, identifies the public Treasury dataset and specifies [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) as its license. CC0 permits copying, adapting, distributing, and displaying the covered material, including commercially, without a mandatory attribution condition. Treasury's [XML feed guide](https://home.treasury.gov/treasury-daily-interest-rate-xml-feed) documents the current official delivery route. No contrary feed-specific reuse restriction or announced retirement for this Treasury route was found in the reviewed official material.

This is project source-governance clearance, not legal advice. The catalog's license metadata is old, and CC0 cannot grant rights Treasury does not control. The dataset documents a third-party quote input, but this application redistributes only Treasury's published derived yield values, not raw quotes, vendor feeds, or quote-level data. If Treasury changes the license, the Data.gov record, the rate derivation, or the third-party-data terms, public use must be re-reviewed. Continue to monitor the official XML schema and endpoint because the documentation does not provide a service-level or version-stability guarantee.

Use the following attribution in source details: “Source: U.S. Treasury, Daily Treasury Par Real Yield Curve Rates (10-year R-CMT, `TC_10YEAR`). Treasury derives this series from indicative market quotations obtained by FRBNY. Macro Regime AI Dashboard calculations; not Treasury/FRBNY affiliated or endorsed.” The Data.gov CC0 record does not make attribution legally mandatory, but attribution is retained for transparency and provenance.

## H.15 and Federal Reserve Transition

No H.15 series is admitted by this amendment. The previously reviewed H.15 DDP/BYP CSV output is a separate access path with a published BYP transition/retirement notice; this amendment does not depend on H.15, FRED, or a temporary H.15 endpoint. The Treasury XML feed remains the production route. Treasury's currently documented XML route has no retirement date in the reviewed notices, but no permanence guarantee was found.

## Frozen Methodology Confirmation

Unchanged: factor definition and weight; real-yield transform; score anchors; 2,520-observation history target; coverage rules; thresholds; regime taxonomy and gates; Data Quality; and Regime Clarity. No nominal yield or alternate inflation concept is substituted.

## Sources

- [Data.gov catalog record and CC0 metadata](https://catalog.data.gov/dataset/daily-treasury-real-yield-curve-rates)
- [Treasury XML feed documentation](https://home.treasury.gov/treasury-daily-interest-rate-xml-feed)
- [Treasury Interest Rate Statistics](https://home.treasury.gov/policy-issues/financing-the-government/interest-rate-statistics?data=yield)
- [Treasury Daily Treasury Rates](https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_real_yield_curve)
- [CC0 1.0 legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode.en)
- [17 U.S.C. section 105](https://uscode.house.gov/view.xhtml?req=%28title%3A17+section%3A105+edition%3Aprelim%29)
- [Federal Reserve H.15 transition notice](https://www.federalreserve.gov/feeds/h15.html)
