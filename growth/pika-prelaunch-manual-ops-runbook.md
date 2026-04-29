# Pika Prelaunch Manual Ops Runbook

Purpose: operate the current Pika prelaunch waitlist and referral lane manually, with no dependence on external automation tools, paid systems, or implementation-specific dashboards.

Use this runbook when:
- the launch lane is live but still manually supervised
- the team needs a repeatable daily/weekly operating rhythm
- product, design, and engineering need a shared go/no-go reference without locking into a specific stack

Operating principles:
- Keep the loop useful, not spammy
- Prioritize signal quality over raw signup volume
- Treat every exported list as sensitive user data
- Make changes in small steps so performance shifts can be attributed
- Preserve a clear manual audit trail for every operator action

---

## 1) Operating Assumptions and Roles

### Assumptions
- Pika’s prelaunch flow collects waitlist submissions and may include referral attribution or share-source attribution.
- Operators can view or export core submission records from the product or admin surface.
- Outreach, if any, is limited, intentional, and tied to launch readiness or user value.
- There is no always-on automated anomaly detection; manual review is required.
- Metrics are reviewed on a fixed cadence using exported data or product-visible counts.
- The launch goal is not maximum lead count at any cost; the goal is qualified early interest aligned with Pika’s social planning use case.

### Minimum fields to preserve in exports
Preserve these if available:
- submission timestamp
- contact identifier
- referral code or referral source
- landing page or entry path
- message or variant shown
- share action count or invitation count
- region/time zone if captured
- status notes added by operators

### Suggested manual roles
One person may cover multiple roles if needed.

| Role | Core responsibility |
| --- | --- |
| Launch operator | Executes daily checklist, exports data, updates manual logs |
| QA reviewer | Checks flow integrity, attribution sanity, and obvious breakage |
| Metrics owner | Reviews conversion, referral, and source quality trends |
| Decision owner | Approves copy/variant changes, pauses, and escalation actions |

### Decision thresholds
Use explicit thresholds before changing anything:
- Do not react to a single-hour fluctuation unless it is severe.
- Do react immediately to broken capture, broken sharing, or corrupted exports.
- Only ship one meaningful launch-lane change at a time unless a fix is urgent.

---

## 2) Daily and Weekly Manual Operations

### Daily opening checklist
Run at the start of the operating day:
1. Submit one fresh test signup through the live flow.
2. Confirm the submission appears in the visible admin/product record.
3. If referrals are active, open the share path and verify the referral token/source appears as expected.
4. Confirm the current message/variant shown to users matches the intended launch plan.
5. Review the previous day’s operator notes for unresolved anomalies.
6. Confirm any manual outreach queue is current and deduplicated.

### Daily monitoring checklist
Run once or twice per day depending on volume:
- record total new submissions since last check
- record top visible traffic/referral sources
- note referral-share activity level if visible
- scan for duplicate bursts, malformed submissions, or suspicious source spikes
- compare today’s pace to the most recent 3–7 day baseline
- capture any user replies or qualitative comments that indicate message mismatch

### Daily closing checklist
At end of day:
1. Export the current dataset or record the latest visible totals.
2. Append a dated entry to the manual ops log.
3. Note any changes made today, including copy, placement, or traffic routing.
4. Flag anything requiring next-day QA.
5. Save exports in the agreed secure team location with date in filename.

### Weekly review cadence
Once per week:
- review total signup volume
- review source mix quality, not just quantity
- review referral participation rate
- review conversion differences between active messages/variants
- review qualitative feedback themes
- decide whether to hold, iterate, or pause the current lane

### Change control rule
If a launch-lane change is made:
- log the exact date/time
- log what changed
- log why it changed
- wait long enough to observe impact before making another non-urgent change

---

## 3) Manual Export and Data Handling Procedure

### Export procedure
When exporting waitlist/referral records:
1. Export only the fields needed for launch operations.
2. Name the file with product, dataset, and date, for example: `pika-waitlist-YYYY-MM-DD`.
3. Keep the raw export unchanged.
4. If a working version is needed, create a separate clearly labeled copy.
5. Add an operator note stating when the export was pulled and by whom.

### Data hygiene rules
- Deduplicate records by the most reliable stable identifier available.
- Do not overwrite original timestamps.
- If source labels are inconsistent, normalize them in a separate analysis copy only.
- Mark suspicious or incomplete records instead of deleting them immediately.
- Keep manual annotations in a separate notes column or companion log.

### Sensitive-data handling
- Restrict access to people actively operating the launch.
- Do not paste full contact lists into chat threads or informal docs.
- Share aggregates and patterns by default; share row-level data only when necessary.
- If a file is accidentally over-shared, record the incident and rotate to a tighter access practice immediately.

### Manual log template
Maintain a simple dated log with:
- date/time
- operator name
- exports taken
- checks performed
- changes made
- anomalies found
- follow-up owner
- status

---

## 4) QA Checks Before and During Launch

### Core functional QA
Verify manually:
- waitlist submission succeeds
- confirmation state/message appears correctly
- referral/share entry points can be reached
- referral attribution persists into resulting submissions if the lane promises this
- key links resolve to the correct destination
- no obvious copy mismatch exists between landing page, confirmation, and share prompt

### Experience QA
Check for:
- broken layouts or unreadable states on common screen sizes
- confusing or overly aggressive referral prompts
- message consistency with Pika’s actual value proposition
- any step that asks for more information than is necessary at prelaunch stage

### Data QA
Check for:
- missing timestamps
- blank contact identifiers where they should exist
- sudden loss of source attribution
- duplicate spikes from the same path in a short window
- impossible referral counts or source distributions

### Variant QA
If multiple messages or lanes are in use:
- confirm each variant is still reachable as intended
- confirm the naming convention used in exports is understandable
- confirm there is no accidental overlap that prevents interpretation
- pause variants that are not trackable enough to evaluate cleanly

### QA failure rule
Pause promotion or traffic-driving actions if:
- submissions are not being captured reliably
- attribution is broken enough to invalidate learnings
- users are landing in a visibly broken flow
- operators cannot export or verify records

---

## 5) Metrics Review and Decision Rules

### Core launch metrics
Track the smallest useful set:
- total waitlist submissions
- submission rate by day
- source mix
- referral participation rate
- referred submission share
- conversion by active message or entry path
- qualitative feedback themes

### Signal interpretation
Use these interpretations:
- Rising volume with falling referral participation may indicate weak share motivation.
- Rising referrals with weak downstream qualified interest may indicate low-quality propagation.
- Strong source concentration may indicate channel dependence risk.
- High submission volume with repeated confusion feedback may mean messaging is overselling or unclear.
- Flat volume but strong qualitative resonance may justify holding the lane while improving reach.

### Decision rules
- Hold when metrics are stable and quality remains acceptable.
- Iterate messaging when volume is acceptable but resonance or share behavior is weak.
- Iterate source/channel emphasis when one path clearly drives higher-quality signups.
- Pause and investigate when data integrity is compromised.
- Escalate when the lane appears to produce demand that product readiness cannot support.

### Minimum review note after each metrics pass
Record:
- what changed since last review
- what likely caused the change
- confidence level: low / medium / high
- action for next period: hold / iterate / pause / escalate

---

## 6) Anomaly Handling and Escalation

### Common anomaly types
- sudden drop to near-zero submissions
- sudden unexplained spike in submissions
- referral/share activity no longer matching downstream captures
- exports missing expected fields
- obvious duplicate or low-quality bursts
- user feedback indicating the promise does not match the product reality

### First-response procedure
1. Do not make multiple simultaneous fixes.
2. Confirm whether the anomaly is real by rechecking the live flow and latest records.
3. Compare against the last known healthy period.
4. Log the anomaly with timestamp, symptoms, and suspected scope.
5. If user-facing breakage is confirmed, pause traffic-driving actions first.
6. Escalate to the appropriate owner with the smallest reproducible description available.

### Severity guide
| Severity | Description | Action |
| --- | --- | --- |
| Low | noisy but non-blocking inconsistency | log, monitor next cycle |
| Medium | metrics interpretation is impaired | hold changes, investigate same day |
| High | capture, attribution, or core UX is broken | pause promotion, escalate immediately |

### Escalation packet template
When handing off an issue, include:
- when it started
- what was expected
- what happened instead
- how it was detected
- whether it affects capture, attribution, UX, or reporting
- whether traffic-driving activity has been paused
- latest export or evidence reference
- named owner for next update

### Resume rule
Resume normal launch operations only when:
- the issue has been rechecked manually
- the affected metric or flow is understandable again
- the operator log reflects what changed and why
- the decision owner agrees the lane is safe to continue

---

## Lightweight Appendices

### A. Daily ops log starter
| Date | Operator | New submissions | Top sources | Referrals active? | Issues found | Changes made | Next action |
| --- | --- | ---: | --- | --- | --- | --- | --- |

### B. Weekly review starter
| Week | Total signups | Best source | Referral participation | Main feedback theme | Decision |
| --- | ---: | --- | ---: | --- | --- |

### C. Go / no-go gate before any push
Proceed only if all are true:
- capture works
- attribution is understandable enough to learn
- message matches product reality
- export process works
- operator coverage exists for anomaly response