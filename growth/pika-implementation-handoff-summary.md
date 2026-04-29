# Pika Implementation Handoff Summary

Source of truth: `workspace/growth/pika-parallel-launch-lane-spec.md`

This document is the condensed implementation contract for downstream product, engineering, and operations work. It distills the locked v1 decisions from the canonical growth spec and lists only the cross-functional dependencies and unresolved edge cases that need explicit handling.

---

## 1. Scope of This Handoff

This handoff covers v1 prelaunch growth mechanics only:

- landing page waitlist capture
- waitlist record creation/update
- confirmation state after successful join
- lightweight referral/share loop
- event instrumentation contract
- manual export / manual ops readiness

Out of scope for v1:

- live email delivery
- CRM sync
- auth/account system
- invite automation
- leaderboard or gamified rewards
- social account integrations
- contact importing
- complex experimentation platform

---

## 2. Decision-Locked v1 Assumptions

These are locked unless a later brief explicitly changes them.

### Product posture
- Growth mechanics must emerge from Pika’s collaborative planning value.
- The experience should encourage relevant sharing with real planning partners, not broad spammy distribution.
- No hard promise of faster access in exchange for referrals.
- If any “sharing helps us see group demand” framing is used, it must remain truthful and non-guaranteed.

### Experience shape
- One landing page
- One waitlist form
- One successful confirmation/share state
- One personal referral link per waitlist user
- One manual export path for operators
- No live third-party integrations required for v1

### Attribution policy
- First-touch referral attribution for signups
- One email maps to one waitlist record
- Duplicate submissions update existing records instead of creating new ones
- Self-referrals do not count
- Invalid referral codes do not block signup

---

## 3. Required v1 Waitlist Fields

## 3.1 Required input fields
These must be collected in v1:

- `email`
- `first_name`

## 3.2 Optional input fields
These should be collected if included in the form:

- `planning_use_case`
- `team_size_or_group_type`
- `heard_about_us`

## 3.3 Field handling contract

### `email`
- required
- syntactically valid
- normalized by trim + lowercase
- unique per waitlist record

### `first_name`
- required
- normalized by trim

### Optional fields
- trim values
- convert empty strings to `null`

### Duplicate submission contract
For an existing email:
- preserve original `created_at`
- update mutable non-empty profile fields
- update `last_submitted_at`
- attach a referrer only if a valid ref is present and no referrer is already stored
- do not overwrite an existing referrer in normal flow

---

## 4. Required Waitlist Record Fields

The waitlist/export-capable record must support at minimum:

- `id`
- `email`
- `first_name`
- `planning_use_case`
- `team_size_or_group_type`
- `heard_about_us`
- `status`
- `referral_code`
- `referred_by_waitlist_id`
- `referred_by_code`
- `referral_count`
- `landing_ref_code_raw`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `first_landing_at`
- `created_at`
- `updated_at`
- `last_submitted_at`

---

## 5. User State Contract

## 5.1 Waitlist statuses
The data model must allow these status values:

- `new`
- `reviewed`
- `priority`
- `invited`
- `activated`
- `archived`

## 5.2 v1 default behavior
- New successful records default to `new`.
- v1 may ship with only `new` operationally used, but the model must support the full status set.
- Manual operator updates may be done through an internal surface or directly in storage.

## 5.3 Status meaning
- `new`: joined, not yet manually triaged
- `reviewed`: reviewed by team
- `priority`: strong-fit early user
- `invited`: selected/contacted for access
- `activated`: entered product/onboarded
- `archived`: invalid, suppressed, or do-not-contact

---

## 6. Confirmation State Contract

## 6.1 Required success state
After a successful waitlist join, the user must see an explicit success state rather than remaining on the form.

The success state must include:
- clear success headline
- confirmation they joined the waitlist
- lightweight expectation-setting copy
- personal share URL or equivalent share CTA
- copyable share option

Recommended headline:
- “You’re on the list”

Recommended expectation copy:
- “We’ll reach out as we open early access.”

Recommended share framing:
- “If Pika would help the people you make plans with, send them your link.”

## 6.2 Allowed success state data
The success state may show:
- first name
- personal share URL
- suggested share message
- referral count if available

The success state must not depend on:
- live email delivery
- rank display
- guaranteed access timing
- reward claims not backed by operations

## 6.3 Error state contract
If submission fails:
- preserve entered values where possible
- show plain-language error
- allow retry
- do not show success-state referral UI

---

## 7. Referral Logic Contract

## 7.1 Referral code generation
Each waitlist user must receive a unique personal share code.

Share URL shape:
- `/?ref=<CODE>`

Absolute host may vary by environment, but the query parameter contract is locked:
- `ref`

## 7.2 When a referral counts
A referral should count only when:
- a visitor arrives with a valid `ref`, and
- a successful waitlist signup occurs, and
- the signup is for a new or previously unattributed email record eligible for attribution

## 7.3 What does not count
Do not count as referrals:
- link clicks alone
- landing page views alone
- duplicate resubmissions by the same email
- self-referrals
- signups with invalid referral codes

## 7.4 Referral count contract
`referral_count` should represent successful attributed signups, not raw visits or clicks.

---

## 8. Attribution Rules

## 8.1 Attribution model
v1 uses first-touch attribution for referred signups.

Meaning:
- the first valid referral associated to the waitlist email wins
- normal duplicate updates should not change the attributed referrer once set

## 8.2 Valid attribution conditions
Attribute only if:
- `ref` exists
- the ref code resolves to a real eligible source user
- the source user is not the same person as the submitted email

## 8.3 Invalid ref behavior
If `ref` is malformed or not found:
- proceed with normal signup
- do not attribute referral
- preserve raw incoming ref value if supported as `landing_ref_code_raw`

## 8.4 Self-referral behavior
If submitted email belongs to the owner of the share code:
- do not attribute referral
- do not increment referral count

---

## 9. Share Hook Contract

## 9.1 Required v1 share hooks
The v1 experience must support these share surfaces:

### A. Landing page collaborative framing
- soft prompt that Pika is for plans involving other people
- no personal share tools shown pre-signup

### B. Post-join success state share module
This is the primary share surface and is required.

It must support:
- copy personal link
- copy suggested message text

Optional if cheap:
- native share sheet

### C. Return-to-success-state view
Optional but acceptable:
- a returning joined user can see their share module again
- may show referral count if available

## 9.2 Share messaging rules
- share ask appears only after successful signup
- copy should encourage sharing with relevant planning partners
- no pressure to broadcast widely
- no incentive language that over-promises access outcomes

---

## 10. Locked Event Names

The following event names are the canonical instrumentation contract for v1:

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

These names should not drift between environments or storage implementations.

---

## 11. Event Property Contract

All events should include available shared properties where relevant:

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

Additional event-specific properties may be included as defined in the canonical spec.

Important logging constraint:
- raw email should not be emitted broadly in event payloads if avoidable
- `email_domain` is acceptable for aggregate analysis on submit attempts

Operational constraint:
- event logging failure must not block successful waitlist joins

---

## 12. Manual Export Contract

v1 must support a manual export path to CSV or JSON.

Export output must include:

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

v1 does not require a full admin panel, but operations must be able to:
- inspect exported records
- identify top referrers
- identify promising segments/use cases
- manually track status where needed

---

## 13. Cross-Functional Dependencies

## 13.1 Product / Design dependencies
Need final approval on:
- landing page headline and body copy
- success-state copy
- default suggested share text
- whether optional fields are dropdowns, free text, or mixed controls
- whether referral count is shown in v1 UI

## 13.2 Engineering dependencies
Need implementation decisions on:
- where waitlist records are stored
- how referral codes are generated and guaranteed unique
- where events are logged in v1
- how manual export is triggered/generated
- whether a lightweight internal status-edit surface exists or status remains storage-only

## 13.3 Operations / Growth dependencies
Need operating agreement on:
- how often exports are reviewed
- how `priority` and `invited` are assigned manually
- whether sharing is used as a soft priority signal in practice
- what truthful language ops will use if users ask about access timing

---

## 14. Unresolved Edge Cases Only

These are the implementation edge cases that need explicit handling, but they do not reopen the core product decisions.

- What exact behavior should occur if a duplicate existing email submits with a different valid `ref` than the one previously stored? Current contract: preserve existing referrer unless manually corrected.
- Whether archived users can still function as valid referral sources is not explicitly locked; default-safe approach is to reject archived sources for attribution unless product/ops says otherwise.
- If referral visit tracking is omitted in implementation, `referral_visit_recorded` may not be available despite remaining in the canonical event list; engineering should either support it or document it as deferred.
- If there is no persistent returnable success page/session recovery, users may lose easy access to their share link after first submit; acceptable for v1 only if product signs off.
- Whether optional fields are all present at initial launch can vary, but any omitted field should also be omitted consistently from UI assumptions and event payload expectations.

---

## 15. Build-Ready Summary

To be considered compliant with this handoff, the v1 build must deliver:

- valid landing-page waitlist capture
- required field validation and normalization
- explicit post-submit success state
- unique per-user referral link generation
- first-touch referral attribution on successful signup
- copy-link and copy-message share actions
- stable canonical event names
- manual export with the required columns
- data model support for the full waitlist status set
- no misleading reward or access claims