# Pika Prelaunch Manual Ops Runbook

Purpose: run the current Pika prelaunch waitlist and referral lane manually, without relying on any specific vendor, automation suite, or analytics platform.

Use this artifact as the single source of truth for day-of-launch operations, data handling, QA checks, metrics review, and escalation.

---

## 1) Daily Pre-Launch Checklist

Complete this checklist before traffic is intentionally sent to the prelaunch funnel each day.

### Operator readiness
- Confirm the named operator-on-duty is available for the day.
- Confirm the issue owner/escalation owner is reachable.
- Confirm yesterday’s open issues have an owner and status.
- Confirm today’s intended message/variant/path is documented before any checks begin.

### Live funnel smoke test
Run one manual test through the current public flow:
1. Open the active prelaunch entry point.
2. Confirm the expected page/message/variant is shown.
3. Submit a test waitlist entry.
4. Confirm the post-submit confirmation state appears.
5. If referral/share is exposed, open the referral/share path from the confirmation state.
6. Confirm the referral/share destination resolves and is not broken.
7. If referral attribution is expected, complete one referred test entry using the generated referral path.
8. Confirm the referred entry is distinguishable from the direct test entry.

### Required visible funnel states
Before launch activity begins, confirm these states can be reached and are understandable:
- `landing_view`
- `waitlist_form_view`
- `waitlist_submit_success`
- `waitlist_submit_error` (at minimum, verify the error state exists or can be triggered safely in a controlled way)
- `referral_prompt_view` if shown after signup
- `referral_link_generated` if referral is enabled
- `referral_visit` via a referral path
- `referred_waitlist_submit_success` for a valid referred signup
- `duplicate_submission_detected` if duplicate handling is implemented
- `self_referral_rejected` if self-referral handling is implemented

### Content and routing checks
- Confirm headline/body/CTA copy matches today’s planned variant.
- Confirm any launch-date or benefit language matches current product reality.
- Confirm primary CTA routes to the intended waitlist form state.
- Confirm any share/referral prompt does not promise rewards or access rules that are not actually active.
- Confirm all visible links resolve to expected destinations.

### Data readiness checks
Confirm operators can see or manually extract these fields for new records:
- `entry_id`
- `submitted_at`
- `contact_value`
- `contact_type`
- `entry_status`
- `source_path`
- `source_medium`
- `source_campaign`
- `message_variant`
- `referral_code`
- `referrer_entry_id`
- `attributed_referral_flag`
- `duplicate_flag`
- `self_referral_flag`
- `operator_notes`

### Stop/hold conditions
Do not start or continue active traffic-driving if any of the following is true:
- A new waitlist submission cannot be confirmed.
- Referral visits occur but referred submissions cannot be attributed.
- Confirmation state is broken or misleading.
- Exportable records are missing core fields needed for manual counting.
- Duplicate or self-referral logic behaves unpredictably enough to invalidate daily metrics.

---

## 2) Manual Capture/Export Process for Waitlist Entries and Attributed Referrals

Perform this process at least once daily; twice daily if volume is high or launch changes are active.

### Canonical record types
Treat all captured rows as one of these record types:
- `direct_waitlist_entry`
- `referred_waitlist_entry`
- `duplicate_waitlist_entry`
- `self_referral_attempt`
- `test_entry`

### Required fields for each exported row
Preserve these exact fields when available:
- `entry_id` — unique row identifier
- `submitted_at` — timestamp of submission
- `contact_value` — email/phone/other collected contact
- `contact_type` — type of contact collected
- `entry_status` — `valid`, `duplicate`, `rejected`, `test`, or equivalent
- `source_path` — entry page or route
- `source_medium` — direct/share/community/etc.
- `source_campaign` — current launch label if used
- `message_variant` — active message or page variant
- `referral_code` — code/token used by the new entrant, if any
- `referrer_entry_id` — originating referrer’s entry id, if known
- `attributed_referral_flag` — `true`/`false`
- `duplicate_flag` — `true`/`false`
- `self_referral_flag` — `true`/`false`
- `operator_notes` — free-text notes column maintained manually

If a field is unavailable, leave it blank and note the missing field in the daily issue log rather than inventing a value.

### Daily capture steps
1. Pull the current set of new entries since the last successful export.
2. Save the raw extract using a date-based filename, for example: `pika-prelaunch-raw-YYYY-MM-DD-HHMM`.
3. Do not edit the raw file.
4. Create a separate working copy for classification, deduping, and metric totals.
5. Append the export time and operator name to the daily log.

### Referral attribution rules
Count an entry as an attributed referral only if all are true:
- the entry contains a non-empty `referral_code` or equivalent referral marker
- a valid `referrer_entry_id` can be associated or inferred from the referral marker
- the submitted contact does not match the referrer’s contact
- the row is not marked as duplicate/rejected/test
- the entry completed the same waitlist submission state as a normal valid signup

If any of the above fails, do not count it as an attributed referral.

### Duplicate handling rules
Mark `duplicate_flag = true` when any of the following is true:
- the same `contact_value` appears more than once
- the same person clearly re-submitted through multiple paths
- a retry created multiple rows for one person without distinct new intent

Handling:
- Keep the earliest valid submission as the canonical row.
- Mark later rows as duplicates in the working copy.
- Exclude duplicate rows from net waitlist totals.
- Do not count duplicates as successful referrals.

### Self-referral handling rules
Mark `self_referral_flag = true` when:
- the referred `contact_value` matches the referrer’s `contact_value`, or
- operator review makes it clear the same person used their own referral path to create the credited entry

Handling:
- Retain the row for audit purposes.
- Do not count self-referrals as attributed referrals.
- Do not award referral credit in the working counts.
- Log repeated self-referral attempts if they appear systematic.

### Test entry handling
- Clearly mark all operator-created or QA-created rows as `test_entry` where possible.
- Exclude test entries from reporting totals.
- If test rows cannot be flagged in-product, annotate them immediately in `operator_notes`.

### End-of-day output
At the end of each operating day, produce:
- raw export file
- cleaned working copy
- daily totals summary
- issue log update
- note of any field gaps or attribution ambiguity

---

## 3) QA Checklist for Funnel States and Stubbed Referral/Share Paths

Run this once before launch traffic and again after any meaningful change.

### Funnel state QA
Confirm each of the following states is reachable and understandable:

| State | What to verify |
| --- | --- |
| `landing_view` | page loads, primary message is legible, CTA is present |
| `waitlist_form_view` | form fields appear, submission affordance works |
| `waitlist_submit_success` | success state confirms signup clearly |
| `waitlist_submit_error` | failed submission shows a visible error state |
| `referral_prompt_view` | referral/share prompt appears only where intended |
| `referral_link_generated` | generated link/code is present and usable |
| `referral_visit` | referral link resolves to the intended landing/form path |
| `referred_waitlist_submit_success` | referred signup can complete end to end |
| `duplicate_submission_detected` | duplicate path is handled clearly if supported |
| `self_referral_rejected` | self-referral is blocked or flagged if supported |

### Stubbed referral/share path QA
If any share/referral paths are partially stubbed, manually verify:
- the share/referral CTA does not dead-end
- the path resolves to a stable destination
- the destination still contains enough context to preserve intent
- any generated referral token/code remains attached through the landing path
- the flow does not imply incentives, rewards, or mechanics that are not actually active

If a stub exists but attribution cannot survive the path, mark referral as non-operational and do not use referral metrics for decision-making that day.

### Manual QA scenarios
Run these scenarios:
1. Direct signup from the default path
2. Referred signup from a valid referral path
3. Duplicate signup using the same contact twice
4. Self-referral attempt using the original signup’s own referral path
5. Broken/invalid referral path if safely testable
6. Mobile-sized viewport pass for readability and CTA visibility
7. Desktop-sized viewport pass for layout sanity

### QA pass/fail rule
Pass only if:
- direct signup works
- success state is clear
- referral path, if exposed, resolves and can be manually checked
- attributed referrals can be identified or referral is explicitly treated as inactive
- duplicate/self-referral handling is understandable enough for manual counting

Fail if any core state is broken or ambiguous enough that operators cannot classify rows reliably.

---

## 4) Daily Metrics Review Template Using Canonical Event Names/Mechanics

Use these canonical event names for manual counting and notes, even if the underlying product implementation uses different labels.

### Canonical event names
- `landing_view`
- `waitlist_form_view`
- `waitlist_submit_attempt`
- `waitlist_submit_success`
- `waitlist_submit_error`
- `referral_prompt_view`
- `referral_link_generated`
- `referral_visit`
- `referred_waitlist_submit_success`
- `duplicate_submission_detected`
- `self_referral_rejected`

### Counting mechanics
For the daily metrics pass, calculate:
- `unique_landing_views` — manual visible count if available; otherwise mark unavailable
- `waitlist_submit_attempts` — number of observed/recorded attempts if available
- `net_waitlist_submits` — valid waitlist rows excluding `duplicate_waitlist_entry`, `self_referral_attempt`, and `test_entry`
- `direct_waitlist_entries` — valid rows with `attributed_referral_flag = false`
- `attributed_referral_entries` — valid rows with `attributed_referral_flag = true`
- `duplicate_entries` — rows with `duplicate_flag = true`
- `self_referral_attempts` — rows with `self_referral_flag = true`
- `referral_visits` — count only if visible and manually supportable; otherwise mark unavailable

### Daily review template
Fill this once per day.

| Field | Value |
| --- | --- |
| Date |  |
| Operator |  |
| Active `message_variant` |  |
| Active `source_campaign` |  |
| `unique_landing_views` |  |
| `waitlist_submit_attempts` |  |
| `net_waitlist_submits` |  |
| `direct_waitlist_entries` |  |
| `attributed_referral_entries` |  |
| `duplicate_entries` |  |
| `self_referral_attempts` |  |
| `referral_visits` |  |
| Top `source_path` values |  |
| Top `source_medium` values |  |
| Notes on qualitative feedback |  |
| Decision for next day: `hold` / `iterate` / `pause` / `escalate` |  |

### Derived checks
Compute these if the inputs exist:
- waitlist conversion rate = `net_waitlist_submits / unique_landing_views`
- referral share of net signups = `attributed_referral_entries / net_waitlist_submits`
- duplicate rate = `duplicate_entries / waitlist_submit_attempts`
- self-referral rate = `self_referral_attempts / referral_visits` or note unavailable

### Decision rules
- `hold` when counts are stable and classification confidence is high
- `iterate` when conversion or referral behavior is weak but data quality is intact
- `pause` when funnel states or attribution break
- `escalate` when quality issues, unexpected spikes, or unclear mechanics make the numbers unreliable

Always include a confidence note: `high`, `medium`, or `low`.

---

## 5) Issue Logging/Escalation Template

Create one issue entry for every operational problem, metric anomaly, or data ambiguity that could affect launch decisions.

### Log immediately when
- a core funnel state fails
- referral attribution becomes unclear
- duplicate handling breaks
- self-referral handling appears absent or inconsistent
- a required field disappears from exports
- a sudden spike/drop cannot be explained by a known planned change
- visible copy/flow promises something the product cannot support

### Issue log template
| Field | Required content |
| --- | --- |
| `issue_id` | unique manual ID |
| `reported_at` | timestamp |
| `reported_by` | operator name |
| `severity` | `low` / `medium` / `high` |
| `issue_type` | `funnel`, `referral`, `data`, `duplicate`, `self_referral`, `content`, `metrics`, or `other` |
| `summary` | one-sentence description |
| `expected_behavior` | what should have happened |
| `observed_behavior` | what actually happened |
| `affected_state_or_event` | canonical state/event name |
| `first_seen_at` | earliest known time |
| `sample_entry_id` | one affected row if available |
| `temporary_mitigation` | what was done immediately |
| `owner` | who must follow up |
| `status` | `open` / `monitoring` / `resolved` |
| `next_update_due` | next check time |

### Severity rules
- `low`: cosmetic or minor issue; counting still reliable
- `medium`: classification or attribution is impaired; proceed cautiously
- `high`: launch decisions or capture integrity are compromised; pause active traffic-driving and escalate immediately

### Escalation steps
1. Log the issue using the template above.
2. Attach or reference one reproducible example.
3. State whether traffic-driving has been paused.
4. State whether metrics for the day are still decision-usable.
5. Route to the named owner.
6. Add a next update time.
7. Do not close the issue until the flow is rechecked manually.

### Resolution note template
When resolved, append:
- `resolved_at`
- `resolved_by`
- root cause summary
- what changed
- whether backfilled recounting is needed
- whether the next day’s metrics should be considered comparable or not

---

## 6) Assumptions/Dependencies

### Assumptions
- The prelaunch lane collects at least one contact method and stores one row per submission attempt or valid entry.
- Operators can manually inspect or export records at least daily.
- A referral path exists or is being publicly shown only if it can be checked manually.
- Message variants and source labels are stable enough to be recorded in a daily log.
- The team prefers conservative counting over inflated counts.

### Dependencies
This runbook depends on the following being available:
- a visible live prelaunch funnel
- a way to identify new waitlist records
- a way to see or preserve the required exported fields
- a documented operator/owner for launch-day decisions
- a secure shared location for raw exports, working copies, and issue logs

### Non-dependencies
This runbook does not require:
- any specific analytics vendor
- any specific CRM or email platform
- automated attribution modeling
- automated dedupe tooling
- reward fulfillment or incentive systems

### Manual classification dependency
If a field is absent, operators must be able to infer classification conservatively from the remaining record context. If they cannot, those rows must be marked ambiguous and excluded from attributed referral totals.

### Referral-operational dependency
Referral should be treated as operational only when all are true:
- referral path is publicly reachable
- referral token/code survives the path
- referred submissions can be distinguished from direct submissions
- duplicate and self-referral handling are understandable enough for manual review

If any of the above is false, keep the waitlist live if appropriate but treat referral metrics as non-decisionable until fixed.