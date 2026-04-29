# Pika Parallel Launch Lane Spec

## Purpose

This document is the canonical implementation-ready growth mechanics spec for Pika’s prelaunch lane. It defines a simple internal landing and waitlist capture experience, a lightweight referral loop, the share surfaces to support it, the event schema required to measure behavior, and a manual/stubbed testing plan that assumes zero live third-party integrations.

The lane is intentionally simple:
- one landing page
- one waitlist form
- one confirmation state
- one referral/share state
- one admin-readable export path
- no incentives that feel spammy
- no dependency on live email, CRM, auth, analytics, or invite tooling

The goal is to learn whether Pika’s social planning use case is resonant enough that people will:
1. understand the product quickly
2. join the waitlist
3. share it with relevant friends or collaborators
4. return via their personal share link

---

## Product Framing for This Lane

Pika should be presented as a social planning product whose value becomes clearer when used with other people. Growth mechanics should amplify that truth rather than add detached rewards.

### Message Frame
Pika helps people coordinate plans, align on options, and move from scattered messages to a shared decision.

### What the waitlist is testing
- Does the landing page make the social planning use case legible?
- Will visitors submit contact info for early access?
- Will waitlist joiners share Pika with people they actually make plans with?
- Which message angles lead to better join and share behavior?

---

## 1. Waitlist Flow Specification

## 1.1 Entry Points

Users may arrive from:
- direct link to the landing page
- a shared referral link from another waitlist joiner
- internal team posts/messages
- manually distributed test links for early audience learning

### Supported URL shapes
- `/`
- `/?ref=ABC123`
- `/?utm_source=...&utm_medium=...&utm_campaign=...`
- `/?ref=ABC123&utm_source=...`

`ref` is optional and represents the referring waitlist member’s share code.

---

## 1.2 Landing Page Requirements

The landing page should contain:

### Above the fold
- concise product headline
- one-sentence explanation of the value
- short supporting body copy focused on social planning
- primary CTA: join waitlist
- optional secondary CTA: learn more / see how it works
- social proof area may be omitted initially if no real proof exists

### Form section
The form may appear:
- embedded on the page, or
- behind a “Join waitlist” CTA that scrolls to or opens the form

### Product explanation section
A small section below the fold should explain:
- who Pika is for
- the planning problem it solves
- why it works better when shared with others

### Share-forward framing
The landing page should lightly imply collaborative value, but should not pressure users to mass-invite people before they have joined.

Example framing:
- “Best with the people you actually make plans with”
- “Join early and share with your crew if this feels useful”

---

## 1.3 Waitlist Form Fields

The form should be intentionally short.

### Required fields
- `email`
- `first_name`

### Optional fields
- `planning_use_case`
- `team_size_or_group_type`
- `heard_about_us`

### Field definitions

#### `email` (required)
- type: email
- trimmed and lowercased on save
- one email = one waitlist record
- duplicate submissions should update the existing record rather than create a new one

#### `first_name` (required)
- free text
- trimmed
- used for friendlier confirmation copy and future outreach

#### `planning_use_case` (optional)
Suggested UI:
- dropdown or short free text

Recommended preset options:
- trips with friends
- dinners / outings
- group events
- recurring plans
- work/social coordination
- other

Purpose:
- helps identify strongest use cases without requiring long-form input

#### `team_size_or_group_type` (optional)
Suggested UI:
- dropdown

Recommended options:
- just me for now
- 2–4 people
- 5–10 people
- 10+ people
- club / community / team

Purpose:
- reveals whether users think of Pika as friend-group coordination or larger group planning

#### `heard_about_us` (optional)
Suggested UI:
- dropdown with optional “other”

Recommended options:
- friend
- social post
- community
- direct link
- internal outreach
- other

If a `ref` parameter is present and valid, this field may default to `friend` while remaining editable.

---

## 1.4 Validation Rules

### Client-side validation
- email must be present and syntactically valid
- first name must be present
- optional fields may be blank

### Server-side validation
Repeat all client validations server-side.

### Normalization
- email: lowercase, trim whitespace
- first_name: trim repeated leading/trailing whitespace
- optional fields: trim values, convert empty strings to null

### Duplicate handling
If a submission comes in for an existing email:
- preserve original `created_at`
- update mutable profile fields if new non-empty values are provided
- update `last_submitted_at`
- if a new valid `ref` is present and the record has no existing referrer, attach it
- do not reassign referrer if one is already set, unless manually corrected by admin

---

## 1.5 Waitlist User States

Each waitlist record should have a `status` field.

### Status values

#### `new`
Default after successful submission.

Definition:
- user joined the waitlist
- no manual review completed
- not yet invited

#### `reviewed`
Optional internal admin state.

Definition:
- team has looked at the record
- may be useful for segmenting promising early users

#### `priority`
Optional internal admin state.

Definition:
- strong fit for early access
- likely candidate for concierge onboarding or first invite wave

#### `invited`
Definition:
- user has been manually selected for access or contacted for onboarding

#### `activated`
Definition:
- user has actually entered product or completed first-launch onboarding
- this may remain unused until product access exists

#### `archived`
Definition:
- suppressed from active launch operations
- used for invalid, spam, or do-not-contact records

Initial implementation may support only `new` plus manual export, but the data model should allow the full set above.

---

## 1.6 Confirmation States

After successful submission, the user should not remain in an ambiguous form state.

### Success state requirements
Show:
- explicit success message
- confirmation that they are on the waitlist
- short expectation-setting copy
- personal share option
- personal referral link or share CTA
- optional note that sharing with relevant friends helps Pika learn who wants this

### Recommended success copy structure
- headline: “You’re on the list”
- body: “We’ll reach out as we open early access.”
- secondary body: “If Pika would help the people you make plans with, send them your link.”

### Confirmation page/state data shown
- first name if available
- personal share URL
- copyable share text
- basic referral count if tracked
- no waitlist rank unless the team explicitly decides to show one later

### Error state
If submission fails:
- preserve entered values where possible
- show a plain-language error
- offer retry
- do not show referral/share UI

---

## 1.7 Referral Attribution Rules

Referral attribution must be simple and deterministic.

### Mechanism
Each waitlist user gets a unique share code, e.g. `ABC123`.

Personal share URL format:
- `https://<host>/?ref=ABC123`

### Attribution rule
A new user is attributed to a referrer when:
- they land with a valid `ref` param, and
- they submit the waitlist form, and
- the submitted email does not already belong to a different existing waitlist record with another referrer

### Last-touch vs first-touch
Use first-touch referral attribution for simplicity:
- first valid referral code associated with that email wins

### Self-referrals
Disallow self-referrals:
- if submitted email matches the referrer’s email, store no referral attribution

### Invalid refs
If a `ref` code:
- does not exist
- is malformed
- belongs to an archived/deactivated source record if the team chooses to exclude those

Then:
- allow normal waitlist submission
- store the raw incoming ref code separately if useful for debugging
- do not attribute referral

---

## 1.8 Admin / Manual Export Requirements

No full admin panel is required for this phase. Manual operability is enough.

### Minimum export format
Support export to CSV or JSON containing:

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

### Manual operational needs
Team should be able to:
- inspect all waitlist entries
- filter externally after export
- sort by created date
- identify top referrers
- identify highest-fit use cases
- identify records tagged as priority or invited

### Manual status editing
If any internal admin surface exists, support simple status changes:
- new → reviewed
- reviewed → priority
- priority → invited
- any → archived

If no admin surface exists, status may be edited directly in storage by internal operators.

---

## 1.9 Suggested Data Model

## WaitlistEntry
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

## ReferralVisit (optional but recommended)
Used for measuring link visits even before form submission.

- `id`
- `referral_code`
- `resolved_waitlist_id`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `landed_at`
- `session_id` or anonymous visitor id if available

If implementation wants to stay minimal, `ReferralVisit` may be omitted and only successful attributed signups tracked.

---

## 2. Referral Loop Specification

## 2.1 Referral Loop Goal

The loop should create relevant person-to-person sharing, not leaderboard gaming.

Target behavior:
1. user joins waitlist
2. user sees personal share link
3. user sends it to friends, roommates, trip partners, clubs, or teams they actually coordinate with
4. referred visitor lands on the page and joins
5. original user feels they helped bring their real group into the product

---

## 2.2 Referral Incentive Design

No cash, coupons, or spam-style giveaway mechanics.

### Primary incentive
Collaborative utility:
- “This becomes more useful when the people you plan with are here too.”

### Optional soft incentive
Earlier consideration for access:
- “Sharing helps us find groups that want to try Pika together.”

This should be phrased carefully:
- do not promise guaranteed faster access
- do not create fake ranking pressure
- do not encourage indiscriminate sharing

### Explicit non-goals
Do not implement:
- public leaderboard
- gamified point store
- fake scarcity counters
- multi-level referral schemes
- mass-contact importers
- auto-posting to social accounts

---

## 2.3 Post-Join Referral UI

On success state, show:

### Primary elements
- copyable personal link
- button to copy link
- short suggested share message
- optional native share button on supported devices

### Secondary elements
- simple referral count, e.g. “2 people joined from your link”
- reminder that this is best shared with planning partners, not a broadcast list

### Recommended share message template
“Trying Pika for planning with friends/groups. If this looks useful for our plans, join here: {{share_url}}”

Alternative:
“Pika looks useful for making plans without the usual group-chat mess. Join the early list here: {{share_url}}”

### Share destinations
Phase 1 should only support:
- copy link
- copy message
- optional native share sheet

No direct integrations are required.

---

## 2.4 Referral Loop States

### `joined_no_share`
User submitted waitlist but has not clicked/copy-triggered any share action.

### `share_intent`
User clicked copy link, copy message, or native share.

### `referred_visit`
At least one visitor landed via the user’s share code.

### `referred_signup`
At least one new waitlist entry attributed to the user.

### `multi_referred_signup`
User has referred 2+ signups.

These do not need to be persisted as a separate status field if they can be derived from events and referral counts.

---

## 2.5 Guardrails

- only count successful new waitlist submissions as referrals
- do not count duplicate resubmissions from the same email as additional referrals
- do not display inflated referral counts from simple link clicks alone
- do not imply rewards that operations cannot fulfill manually
- preserve dignity of the product by encouraging selective, relevant sharing

---

## 3. Share Hook Map

This section defines where and how share prompts should appear in the prelaunch experience.

## 3.1 Share Surface Inventory

### Surface A: Landing page soft prompt
Location:
- below hero or near form

Purpose:
- frame Pika as collaborative

Content:
- “Made for plans that involve other people.”
- no personal link shown yet

CTA:
- join waitlist

### Surface B: Success state primary share module
Location:
- directly after successful waitlist submission

Purpose:
- highest-intent moment for referral

Content:
- personal share URL
- copy CTA
- suggested text
- optional native share

Priority:
- highest

### Surface C: Return visit success page
If a user returns with a known share link or by re-opening confirmation:
- show same share module
- show updated referral count if available

### Surface D: Manual outreach copy blocks
For internal team usage:
- reusable blurb for DMs
- reusable social post text
- reusable community post text

These do not need automated delivery. They should exist as copy assets in the ops toolkit if one is later created.

---

## 3.2 Share Message Variants

Use variants for learning, but keep the product promise consistent.

### Variant 1: coordination pain relief
“Pika helps take plans out of messy group chats. Join the early list: {{share_url}}”

### Variant 2: collaborative planning
“Pika looks useful for making plans with the people you actually coordinate with. Join here: {{share_url}}”

### Variant 3: group utility
“If we’re going to use this for trips / dinners / group plans, we should probably all be on it early: {{share_url}}”

The product should not rotate variants aggressively in-user yet unless experiments are intentionally set up. It is fine to use one default and keep others for manual testing.

---

## 3.3 Share Hook Rules

- only show personal share tools after successful signup
- do not interrupt form completion with share requests
- keep the share ask to one module per page/state
- avoid modal overload
- make copy feel relevant to existing planning relationships

---

## 4. Event and Instrumentation Schema

Instrumentation should be implementation-light and storage-agnostic. Events may be written to:
- application logs
- a JSON file
- an internal table
- console in development

The schema below is canonical even if the storage implementation is stubbed.

## 4.1 Global Event Properties

All events should include where available:
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

Not every property will exist on every event. Missing values may be null.

---

## 4.2 Event List

### `landing_page_viewed`
Triggered when the landing page loads.

Properties:
- `incoming_ref_code`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `variant_id`

Purpose:
- baseline traffic count
- measure referred vs non-referred traffic

### `waitlist_form_started`
Triggered on first interaction with the form.

Properties:
- `incoming_ref_code`
- `variant_id`

Purpose:
- distinguish page interest from form intent

### `waitlist_form_submitted`
Triggered when user attempts submit.

Properties:
- `email_domain`
- `has_first_name`
- `has_planning_use_case`
- `has_team_size_or_group_type`
- `has_heard_about_us`
- `incoming_ref_code`

Purpose:
- measure submit attempts regardless of success

Do not log full raw email in event stream if avoidable; domain is enough for aggregate analysis.

### `waitlist_join_succeeded`
Triggered on successful validated write.

Properties:
- `waitlist_id`
- `referral_code`
- `attributed_referrer_id`
- `attributed_referrer_code`
- `is_duplicate_update`
- `status`
- `planning_use_case`
- `team_size_or_group_type`
- `heard_about_us`

Purpose:
- core conversion metric

### `waitlist_join_failed`
Triggered when server rejects or storage fails.

Properties:
- `error_type`
- `validation_field` if applicable
- `incoming_ref_code`

Purpose:
- identify friction or technical errors

### `referral_link_copied`
Triggered when user copies personal share link.

Properties:
- `waitlist_id`
- `referral_code`

Purpose:
- measure share intent

### `referral_message_copied`
Triggered when user copies suggested message text.

Properties:
- `waitlist_id`
- `referral_code`
- `message_variant`

Purpose:
- understand share prompt usefulness

### `native_share_opened`
Triggered when native share is invoked.

Properties:
- `waitlist_id`
- `referral_code`
- `message_variant`

Purpose:
- measure mobile/native share usage

### `referral_visit_recorded`
Triggered when a visit arrives with a valid share code.

Properties:
- `incoming_ref_code`
- `resolved_waitlist_id`

Purpose:
- top-of-loop referral traffic

### `referral_signup_attributed`
Triggered when a new successful signup is attributed to a referrer.

Properties:
- `waitlist_id`
- `referral_code`
- `attributed_referrer_id`
- `attributed_referrer_code`

Purpose:
- definitive referral conversion

### `admin_export_generated`
Triggered whenever a manual export is produced.

Properties:
- `format`
- `row_count`
- `generated_by` if available

Purpose:
- operational traceability

### `waitlist_status_changed`
Triggered when an internal operator updates status.

Properties:
- `waitlist_id`
- `old_status`
- `new_status`
- `changed_by`

Purpose:
- auditability of manual launch operations

---

## 4.3 Core Funnel Metrics

These metrics should be derivable from the event schema.

### Acquisition funnel
- landing page views
- form starts
- form submissions
- successful joins
- join conversion rate from landing
- join conversion rate from form start

### Referral funnel
- successful joins who saw share state
- copy-link actions
- copy-message actions
- native-share opens
- referred visits
- referred signups
- share-intent-to-referred-signup conversion

### Segment cuts
Break down by:
- planning use case
- team size/group type
- heard about us
- ref vs non-ref traffic
- UTM source/medium/campaign
- message variant if used

---

## 4.4 Event Storage Guidance

For this phase, storage can be minimal.

### Acceptable options
- append-only JSON lines file
- simple database table
- server log stream with consistent event payloads
- in-memory dev logger for local testing

### Requirements
- timestamps must be recorded
- event names must be stable
- payload shape should not drift across identical events
- event emission should not block waitlist join success

If event logging fails:
- do not fail the primary user flow
- log a fallback server warning if possible

---

## 5. Manual / Stubbed Early Testing Plan

This plan is designed for zero live integrations. The team should be able to test the entire lane internally or with a small controlled audience.

## 5.1 Testing Goals

Validate:
- the landing message is understandable
- users can complete the form successfully
- referral links can be copied and reused
- attribution logic behaves as expected
- exports contain the needed operational fields
- event payloads are emitted consistently
- early audience reactions produce useful qualitative learning

---

## 5.2 Functional Test Matrix

### Scenario 1: direct visitor joins
Steps:
1. open landing page without ref param
2. submit valid required fields
3. confirm success state appears
4. copy personal share link

Expected:
- one waitlist record created
- status = `new`
- referral code generated
- no attributed referrer
- success UI visible
- join and share-intent events emitted

### Scenario 2: referred visitor joins
Steps:
1. open page with valid `?ref=CODE`
2. submit valid new email
3. inspect saved record

Expected:
- referred-by fields populated
- referral count for source user increments
- attribution event emitted
- success state shows new user’s own referral link, not the parent’s link

### Scenario 3: invalid referral code
Steps:
1. open page with invalid `?ref=BADCODE`
2. submit valid form

Expected:
- join still succeeds
- no attributed referrer
- raw incoming ref stored if supported
- invalid ref does not break UX

### Scenario 4: duplicate email resubmission
Steps:
1. submit with email A
2. submit again with email A and changed optional fields

Expected:
- no second unique user created
- original created_at preserved
- mutable fields updated when non-empty
- duplicate update noted in join success payload if tracked

### Scenario 5: self-referral attempt
Steps:
1. create user A
2. revisit using user A’s own share code
3. submit again with same email

Expected:
- no self-referral credited
- no duplicate referral count increase

### Scenario 6: export
Steps:
1. create several records with mixed referral states
2. generate export

Expected:
- all required columns present
- row count accurate
- referral and UTM data included
- export event emitted

---

## 5.3 Manual Qualitative Testing Plan

Run small-scale tests with 10–25 people across likely use contexts.

### Target participant buckets
- friend-group planners
- trip organizers
- social event organizers
- club/community leads
- people who often coordinate through group chat

### What to ask after they see the landing page
- What do you think Pika helps with?
- Who would you use this with?
- What made you join or not join?
- Would you send this to anyone right now? Why or why not?
- What wording felt most believable?

### What to observe
- whether they grasp collaborative value without explanation
- where they hesitate in the form
- whether they naturally think of specific people to share with
- whether any copy sounds generic or over-marketed

### Success indicators
- users can explain the product in their own words
- users identify concrete collaborative use cases
- users share with real planning partners without being pushed
- optional fields reveal a clear strongest use case cluster

---

## 5.4 Stubbed Internal Launch Procedure

### Phase A: internal dry run
Use only team members and close collaborators.

Checklist:
- submit at least 10 entries
- test with and without ref params
- verify duplicate handling
- verify export structure
- verify event payloads
- verify copy/paste share flow on desktop and mobile

### Phase B: controlled external test
Share manually with a small set of target users.

Checklist:
- use 2–3 message variants manually
- track joins by UTM or manual source tagging
- note qualitative reactions in a simple spreadsheet or doc
- identify whether specific use cases outperform others

### Phase C: pre-public readiness check
Before any wider push, confirm:
- no broken referral links
- export is readable by ops
- team knows how to identify top referrers
- copy reflects actual user understanding from prior tests
- no fake promises about access timing or rewards

---

## 5.5 Recommended Manual Reporting Cadence

Review metrics and notes at least twice weekly during prelaunch testing.

### Weekly review questions
- Which acquisition source produced the best join rate?
- Which planning use case appears most often among signups?
- What percentage of new joiners used a share action?
- How many referred signups occurred?
- Are users sharing because they see collaborative value, or because copy feels pushy?
- Which participants seem strongest for early-access outreach?

---

## 6. Implementation Decisions Summary

### Must-have for phase 1
- landing page with concise product framing
- waitlist form with required and optional fields
- successful submission confirmation state
- per-user referral code and share URL
- copy link / copy message share actions
- first-touch referral attribution on signup
- manual export path
- stable event schema, even if stored in a stubbed way

### Nice-to-have if cheap
- native share
- referral visit tracking table
- simple internal status editing UI
- returnable confirmation page with updated referral count

### Explicitly out of scope
- live email automation
- CRM sync
- auth/account system
- leaderboards
- rewards marketplace
- contact importers
- direct social posting integrations
- complex experimentation platform

---

## 7. Handoff Notes for Product / Engineering

### Recommended implementation order
1. waitlist data model
2. landing page + form
3. submission success state
4. referral code generation + attribution
5. copy/share module
6. event logging
7. export capability
8. optional admin status editing

### Edge cases to handle carefully
- duplicate emails
- malformed ref params
- self-referrals
- updates to optional profile data
- export consistency after status changes

### Operational truthfulness
All user-facing copy must remain honest:
- joining the waitlist means interest is recorded
- sharing may help signal group demand
- sharing does not guarantee priority unless operations truly use it that way

This lane should feel like a clean collaborative prelaunch, not a gimmicky growth system.