# Pika v1 Fixed vs Tunable Decision Map

Source references:
- `workspace/growth/pika-parallel-launch-lane-spec.md`
- `workspace/growth/pika-implementation-handoff-summary.md`

Purpose:
This document marks which Pika prelaunch mechanics are locked for v1 implementation and which can be tuned during testing without reopening the core product/growth contract.

Legend:
- `fixed-for-v1` = must remain stable in implementation unless a later explicit brief changes it
- `tunable-in-testing` = may be adjusted during copy/design/ops testing if the underlying contract remains intact

---

## 1. Landing Structure

### One-page prelaunch experience
- **Decision:** Single landing page with embedded or scroll-linked waitlist form
- **Status:** `fixed-for-v1`
- **Rationale:** The approved v1 shape is intentionally simple and avoids multi-step acquisition complexity.

### Hero includes headline, one-sentence value proposition, supporting copy, and primary join CTA
- **Status:** `fixed-for-v1`
- **Rationale:** These are the minimum structural elements required to make the product understandable and drive waitlist intent.

### Below-the-fold product explanation section
- **Status:** `fixed-for-v1`
- **Rationale:** v1 requires a lightweight explanation of who Pika is for and why collaborative use matters.

### Exact hero wording
- **Status:** `tunable-in-testing`
- **Rationale:** Message phrasing can be refined as long as it stays anchored to collaborative planning value.

### Embedded form vs CTA-scroll-to-form pattern
- **Status:** `tunable-in-testing`
- **Rationale:** Both patterns satisfy the approved structure and can be tested for conversion without changing the flow.

### Presence of a secondary “learn more” CTA
- **Status:** `tunable-in-testing`
- **Rationale:** It is optional support for understanding, not a contract-critical mechanic.

### Social proof section
- **Status:** `tunable-in-testing`
- **Rationale:** It may be omitted initially and only added if truthful proof assets become available.

---

## 2. Fields and Input Contract

### Required fields: `email`, `first_name`
- **Status:** `fixed-for-v1`
- **Rationale:** These are the mandatory minimum inputs defined by the canonical waitlist contract.

### Optional fields: `planning_use_case`, `team_size_or_group_type`, `heard_about_us`
- **Status:** `fixed-for-v1`
- **Rationale:** These are the approved optional profile/learning fields for segmentation and should be the only optional fields assumed in v1.

### Requirement that optional fields may be blank
- **Status:** `fixed-for-v1`
- **Rationale:** v1 must keep the join flow lightweight and cannot block submission on exploratory segmentation fields.

### Input labels and helper text
- **Status:** `tunable-in-testing`
- **Rationale:** User-facing wording can be improved for clarity while preserving the same underlying fields.

### Optional field control type (dropdown vs short free text where applicable)
- **Status:** `tunable-in-testing`
- **Rationale:** UX format can change if the same data intent is preserved.

### Preset option wording for optional fields
- **Status:** `tunable-in-testing`
- **Rationale:** Option labels may evolve as long as they continue capturing the same user/context signal.

### Empty string normalization to `null`
- **Status:** `fixed-for-v1`
- **Rationale:** This is a data-handling contract needed for export cleanliness and consistent downstream analysis.

### `email` normalization to lowercase + trim
- **Status:** `fixed-for-v1`
- **Rationale:** Required to enforce one-email-per-record behavior reliably.

### `first_name` normalization by trim
- **Status:** `fixed-for-v1`
- **Rationale:** Locked data-cleaning behavior for consistency in confirmations and exports.

---

## 3. Required vs Optional Submission Rules

### Client-side validation for required fields
- **Status:** `fixed-for-v1`
- **Rationale:** v1 requires a basic functional form experience with immediate user feedback.

### Server-side validation mirroring required rules
- **Status:** `fixed-for-v1`
- **Rationale:** Validation must not rely on the client and is required for data integrity.

### Optional fields collected at launch
- **Status:** `tunable-in-testing`
- **Rationale:** Product may choose to hide one or more optional fields initially, provided omitted fields are handled consistently across UI/data assumptions.

### Defaulting `heard_about_us` to friend when a valid ref exists
- **Status:** `tunable-in-testing`
- **Rationale:** This is a convenience behavior, not a core attribution rule.

---

## 4. User States

### Supported status set: `new`, `reviewed`, `priority`, `invited`, `activated`, `archived`
- **Status:** `fixed-for-v1`
- **Rationale:** The data model must support the full state set even if operations use only a subset initially.

### Default status after successful join = `new`
- **Status:** `fixed-for-v1`
- **Rationale:** This is the canonical initial state for all new waitlist entries.

### v1 may operationally use only `new`
- **Status:** `fixed-for-v1`
- **Rationale:** The spec explicitly allows a minimal initial rollout while preserving future-ready status support.

### Whether an internal UI exists for status updates
- **Status:** `tunable-in-testing`
- **Rationale:** A manual storage-based workflow is acceptable if a UI is not yet implemented.

### Exact operational criteria for moving users to `priority` or `invited`
- **Status:** `tunable-in-testing`
- **Rationale:** Ops can refine prioritization heuristics without changing the product data contract.

---

## 5. Confirmation States

### Explicit success state after successful submission
- **Status:** `fixed-for-v1`
- **Rationale:** Users must not be left in an ambiguous post-submit form state.

### Success state includes confirmation message + expectation-setting + share option
- **Status:** `fixed-for-v1`
- **Rationale:** These are the minimum required post-join elements in the approved flow.

### Success state may include first name, personal share URL, suggested message, referral count
- **Status:** `fixed-for-v1`
- **Rationale:** These are the approved allowed data elements for the post-join view.

### Showing referral count in the success state
- **Status:** `tunable-in-testing`
- **Rationale:** It is optional and may be included only if the implementation can support it cleanly.

### Exact success headline/body copy
- **Status:** `tunable-in-testing`
- **Rationale:** Copy can be optimized while staying truthful and aligned with the collaborative planning frame.

### Error state preserves entered values where possible and allows retry
- **Status:** `fixed-for-v1`
- **Rationale:** This is required for a usable v1 form experience.

### Error state must not show referral/share UI
- **Status:** `fixed-for-v1`
- **Rationale:** Share mechanics should only unlock after a successful join.

---

## 6. Duplicate Handling

### One email = one waitlist record
- **Status:** `fixed-for-v1`
- **Rationale:** This is a foundational identity rule for waitlist integrity and referral counting.

### Duplicate submissions update existing records instead of creating new ones
- **Status:** `fixed-for-v1`
- **Rationale:** The canonical spec explicitly locks update-over-create behavior.

### Preserve original `created_at` on duplicate resubmission
- **Status:** `fixed-for-v1`
- **Rationale:** Required for historical consistency and accurate cohort analysis.

### Update `last_submitted_at` on duplicate resubmission
- **Status:** `fixed-for-v1`
- **Rationale:** This preserves recency without fragmenting user identity.

### Update mutable fields only when new non-empty values are provided
- **Status:** `fixed-for-v1`
- **Rationale:** Prevents accidental data loss from later sparse submissions.

### Existing referrer should not be replaced during normal duplicate flow
- **Status:** `fixed-for-v1`
- **Rationale:** This preserves first-touch attribution integrity.

### Manual correction of an incorrectly assigned referrer
- **Status:** `tunable-in-testing`
- **Rationale:** Ops may need a correction path, but this is an operational exception rather than a normal-user flow rule.

---

## 7. Referral Link / Code Format

### Each joined user gets a unique referral/share code
- **Status:** `fixed-for-v1`
- **Rationale:** The post-join referral loop depends on one unique code per waitlist user.

### Query parameter name = `ref`
- **Status:** `fixed-for-v1`
- **Rationale:** The URL contract is already approved and should not drift across implementation.

### Share URL shape = `/?ref=<CODE>` on the active host
- **Status:** `fixed-for-v1`
- **Rationale:** This is the canonical referral entry pattern for v1.

### Exact code length/character scheme
- **Status:** `tunable-in-testing`
- **Rationale:** Engineering may choose the generation format as long as codes are unique and shareable.

### Absolute domain used in shared URLs
- **Status:** `tunable-in-testing`
- **Rationale:** Environment host may vary between local, staging, and production without changing the referral contract.

---

## 8. Attribution Rules / Window

### Attribution model = first-touch
- **Status:** `fixed-for-v1`
- **Rationale:** This is the explicit approved referral attribution model.

### Attribution occurs on successful waitlist signup, not on click alone
- **Status:** `fixed-for-v1`
- **Rationale:** Only completed joins should count as referrals.

### Valid ref must resolve to a real eligible source user
- **Status:** `fixed-for-v1`
- **Rationale:** Attribution must be deterministic and tied to a real source record.

### Self-referrals do not count
- **Status:** `fixed-for-v1`
- **Rationale:** Required guardrail against artificial referral inflation.

### Invalid/malformed refs do not block signup
- **Status:** `fixed-for-v1`
- **Rationale:** Referral errors must not break core acquisition flow.

### Raw incoming invalid ref may be stored as `landing_ref_code_raw`
- **Status:** `fixed-for-v1`
- **Rationale:** Preserving raw inbound values supports debugging and analysis.

### Attribution window = effectively first valid ref carried through to signup for that email
- **Status:** `fixed-for-v1`
- **Rationale:** No time-based attribution window is defined for v1; attribution is tied to the first valid referral associated to the signup identity.

### Archived users as valid referral sources
- **Status:** `tunable-in-testing`
- **Rationale:** The canonical spec leaves this edge case open; default-safe handling can be adjusted by product/ops.

### Whether to persist referral-visit records before signup
- **Status:** `tunable-in-testing`
- **Rationale:** Useful for funnel analysis, but not required for core v1 referral attribution.

---

## 9. Share Hook Set

### Landing page collaborative framing
- **Status:** `fixed-for-v1`
- **Rationale:** Pika must be framed as useful for plans involving other people before signup.

### No personal share tools before successful signup
- **Status:** `fixed-for-v1`
- **Rationale:** Share prompts should not interrupt or precede the core join action.

### Post-join success-state share module
- **Status:** `fixed-for-v1`
- **Rationale:** This is the primary required referral surface for v1.

### Copy personal link action
- **Status:** `fixed-for-v1`
- **Rationale:** Minimum viable share mechanic.

### Copy suggested message action
- **Status:** `fixed-for-v1`
- **Rationale:** Approved part of the basic referral/share toolkit.

### Native share sheet
- **Status:** `tunable-in-testing`
- **Rationale:** Helpful if cheap to add, but explicitly optional.

### Return-view share module for already-joined users
- **Status:** `tunable-in-testing`
- **Rationale:** Useful convenience feature, but not required to make v1 functional.

### Exact share message wording
- **Status:** `tunable-in-testing`
- **Rationale:** Messaging can be optimized as long as it stays relevant, truthful, and non-spammy.

### Number of share message variants used in testing
- **Status:** `tunable-in-testing`
- **Rationale:** Ops/growth may test one or a few variants without changing the mechanic set.

---

## 10. Event Names

### Canonical event list
The following names are locked:
- `landing_page_viewed`
- `waitlist_form_started`
- `waitlist_form_submitted`
- `waitlist_join_succeeded`
- `waitlist_join_failed`
- `referral_link_copied`
- `referral_message_copied`
- `native_share_opened`
- `referral_visit_recorded`
- `referral_signup_attributed`
- `admin_export_generated`
- `waitlist_status_changed`

- **Status:** `fixed-for-v1`
- **Rationale:** Stable event names are required for consistent reporting and downstream analysis.

### Emitting `native_share_opened` only if native share exists
- **Status:** `tunable-in-testing`
- **Rationale:** Event availability depends on whether the optional feature ships.

### Emitting `referral_visit_recorded` only if visit tracking is implemented
- **Status:** `tunable-in-testing`
- **Rationale:** The event remains canonical, but the implementation may defer pre-signup visit tracking in v1.

---

## 11. Event Properties

### Shared event properties when available
- `event_name`
- `timestamp`
- `session_id`
- `anonymous_id`
- `waitlist_id`
- `referral_code`
- `incoming_ref_code`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `page_path`
- `variant_id`

- **Status:** `fixed-for-v1`
- **Rationale:** This is the canonical shared property contract across the event system.

### Event-specific properties from the canonical spec
- **Status:** `fixed-for-v1`
- **Rationale:** Event payloads should remain consistent with the approved schema per event type.

### Logging `email_domain` instead of raw email on submit attempts
- **Status:** `fixed-for-v1`
- **Rationale:** Preserves useful analysis while reducing unnecessary exposure of raw personal data in event streams.

### Event logging failures must not block primary join flow
- **Status:** `fixed-for-v1`
- **Rationale:** Instrumentation is secondary to the core waitlist conversion path.

### Which storage backend receives events
- **Status:** `tunable-in-testing`
- **Rationale:** Logs, JSON, table, or another simple sink are all acceptable if schema stability is preserved.

---

## 12. Admin / Manual Export Assumptions

### v1 must support manual export to CSV or JSON
- **Status:** `fixed-for-v1`
- **Rationale:** Manual operability is part of the approved launch lane and replaces the need for a full admin suite.

### Export includes required waitlist fields
At minimum:
- `id`
- `email`
- `first_name`
- `planning_use_case`
- `team_size_or_group_type`
- `heard_about_us`
- `status`
- `referral_code`
- `referred_by_code`
- `referred_by_waitlist_id`
- `referral_count`
- `landing_ref_code_raw`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `first_landing_at`
- `created_at`
- `last_submitted_at`

- **Status:** `fixed-for-v1`
- **Rationale:** These columns are required for operations, segmentation, and referral analysis.

### Full admin panel not required
- **Status:** `fixed-for-v1`
- **Rationale:** The approved v1 plan explicitly allows a manual-ops-first implementation.

### Export trigger mechanism
- **Status:** `tunable-in-testing`
- **Rationale:** Engineering can choose the simplest implementation path as long as operators can retrieve the data.

### Status editing via internal UI vs direct storage update
- **Status:** `tunable-in-testing`
- **Rationale:** Either path satisfies v1 as long as manual status management is possible.

---

## 13. Testing Thresholds

### Internal dry run before broader usage
- **Status:** `fixed-for-v1`
- **Rationale:** The approved testing plan requires an internal validation pass before wider distribution.

### Minimum internal sample for dry run: at least 10 entries
- **Status:** `fixed-for-v1`
- **Rationale:** This is the explicit baseline threshold in the canonical testing plan.

### Controlled qualitative test range: 10–25 people
- **Status:** `fixed-for-v1`
- **Rationale:** This is the approved early audience learning range for manual testing.

### Required functional scenarios to verify
- direct visitor joins
- referred visitor joins
- invalid referral code
- duplicate email resubmission
- self-referral attempt
- export generation

- **Status:** `fixed-for-v1`
- **Rationale:** These scenarios cover the core mechanics and edge cases explicitly called for in the testing plan.

### Exact split across participant segments
- **Status:** `tunable-in-testing`
- **Rationale:** Growth can adjust audience composition as long as likely social planning users are represented.

### Message variants used during manual testing
- **Status:** `tunable-in-testing`
- **Rationale:** Copy experimentation is allowed within the locked product/growth framing.

### Review cadence for metrics/qualitative notes at least twice weekly during prelaunch testing
- **Status:** `fixed-for-v1`
- **Rationale:** This is the approved operating cadence for early learning loops.

---

## 14. Summary of What Must Not Drift in v1

The following are non-negotiable for implementation consistency:
- one-page prelaunch waitlist flow
- required fields = `email` and `first_name`
- one-email-per-record identity rule
- explicit post-submit success state
- unique per-user referral code
- `ref` query parameter contract
- first-touch attribution
- self-referrals blocked
- invalid refs do not block signup
- post-join share tools include copy link + copy message
- canonical event names remain stable
- manual export exists and includes required columns
- manual testing covers the required referral/duplicate/export edge cases

Anything else in this document marked `tunable-in-testing` may be adjusted as long as these locked mechanics remain intact.