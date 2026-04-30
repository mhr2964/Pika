# Pika Waitlist + Share Production Flow Spec
_Status: implementation/testing-ready growth spec aligned to the current room-to-result slice. Launch remains on hold._

## Scope
Translate the approved acquisition pack into production-shaped user flows for the currently credible path:
- landing/entry point
- waitlist submit
- confirmation state
- optional share prompt
- tracked events
- validation rules

This spec assumes the product story remains:
**Pika helps groups stop losing the plan in the chat by turning messy messages into one shareable plan everyone can check.**

---

## 1) Production-Shaped Flow

### A. Entry point
**Surface**
- Landing page or equivalent room-to-result entry surface tied to the current product slice

**Primary message**
- Stop losing the plan in the chat.

**Supporting message**
- Pika turns messy group messages into one shareable plan everyone can check.

**Primary action**
- Join the waitlist

**Flow rule**
- Only one primary conversion path on the entry surface
- No competing CTAs with equal visual weight
- If a user is already waitlist-confirmed in the current browser session, the primary CTA may route to the confirmation/share state instead of re-showing the form

**Data captured on CTA entry**
- entry surface identifier
- campaign/source params if present
- timestamp
- session identifier
- experiment variant identifier if active

---

### B. Waitlist submit surface
**Form goal**
- Convert interested visitors with minimal friction and clear expectation setting

**Recommended fields**
- Email address (required)
- Optional hidden fields for attribution and experiment context

**Do not require**
- Full name
- Phone number
- Referral code entry
- Freeform explanation
- Multi-step qualification gate

**Recommended visible copy**
- Headline: Get early access to Pika
- Support: Stop losing the plan in the chat. Join the waitlist to try a simpler way to keep everyone on the same plan.
- Submit CTA: Join the waitlist
- Expectation line: We’re opening access in stages.

**Submit outcomes**
1. **Success / new signup**
   - Create or record waitlist signup
   - Transition immediately to confirmation state
2. **Success / existing signup**
   - Do not error
   - Transition to confirmation state with returning-user copy if available
3. **Validation failure**
   - Keep user on form
   - Show inline field error
4. **System failure**
   - Keep user on form
   - Show non-technical retry message

---

### C. Confirmation state
**Goal**
- Confirm completion, reinforce product meaning, and present the optional share action

**Recommended visible copy**
- Headline: You’re on the list
- Support: Pika helps groups stop losing the plan in the chat by turning messy messages into one shareable plan everyone can check.
- Optional expectation reminder: We’re opening access in stages.
- Optional share prompt: Share Pika with the people you make plans with.
- Optional share helper: If your group chats lose the plan too, send them this.

**State rules**
- Confirmation must be reachable directly after successful submit
- Confirmation must not depend on share completion
- Confirmation should preserve attribution/referral context for downstream analytics
- Existing signup path should still show successful confirmation, not a failure state

---

### D. Optional share prompt
**Goal**
- Encourage low-pressure sharing that matches the product’s real social context

**Allowed actions**
- Copy share link
- Native share trigger if supported
- Simple “send this to your group” style action if the product already supports it

**Not allowed in this slice**
- Competitive referral leaderboard
- Reward tiers
- Spammy invite loops
- Gated access dependent on referral count

**Share object**
- A canonical landing URL
- Optional referral parameter tied to the signed-up user if referral tracking exists
- Optional prefilled share message using approved copy

**Behavior rules**
- Share remains optional
- User can dismiss or ignore with no penalty
- Confirmation success remains the primary completed state

---

## 2) Referral / Share Mechanics In Production Shape

### Recommended implementation level for current slice
**Lightweight referral attribution, not incentive mechanics**

Meaning:
- Generate or attach a stable sharer identifier after successful waitlist signup if supported by current backend
- Append that identifier to the shared landing URL as a referral parameter
- Attribute downstream visits and signups when that parameter is present
- Do not expose referral counts to users unless that surface already exists and is approved

### Referral path
1. User completes waitlist signup
2. System creates or retrieves confirmation state
3. System exposes share action
4. Shared link includes attribution parameter if available
5. Referred visitor lands on entry surface
6. Referred visitor may join waitlist through the same standard flow
7. Signup is recorded with referral attribution if valid

### Fallback if referral IDs are not implemented yet
- Ship the same flow without user-level referral attribution
- Still track share action attempts and copied-link events
- Treat this as share-intent measurement until attributed referrals are available

---

## 3) Tracked Events

## Event naming principle
Use simple, implementation-friendly names reflecting what happened, not marketing intent.

### Entry and landing events
**`waitlist_entry_viewed`**
- Fired when the landing/entry surface loads
- Properties:
  - `entry_surface`
  - `session_id`
  - `source`
  - `medium`
  - `campaign`
  - `referral_id` if present
  - `experiment_variant` if present

**`waitlist_cta_clicked`**
- Fired when the primary join CTA is clicked
- Properties:
  - `entry_surface`
  - `cta_label`
  - `session_id`
  - `referral_id` if present
  - `experiment_variant` if present

### Form events
**`waitlist_form_viewed`**
- Fired when the waitlist form is displayed
- Properties:
  - `entry_surface`
  - `session_id`
  - `referral_id` if present
  - `experiment_variant` if present

**`waitlist_submit_attempted`**
- Fired on submit attempt before network completion
- Properties:
  - `session_id`
  - `entry_surface`
  - `referral_id` if present
  - `experiment_variant` if present

**`waitlist_submit_succeeded`**
- Fired after successful waitlist creation or successful recognition of an existing signup
- Properties:
  - `session_id`
  - `signup_status` (`new` or `existing`)
  - `entry_surface`
  - `referral_id` if present
  - `experiment_variant` if present

**`waitlist_submit_failed`**
- Fired when submit fails
- Properties:
  - `session_id`
  - `failure_type` (`validation` or `system`)
  - `field_name` if validation-related
  - `entry_surface`
  - `experiment_variant` if present

### Confirmation and share events
**`waitlist_confirmation_viewed`**
- Fired when confirmation state is shown
- Properties:
  - `session_id`
  - `signup_status`
  - `entry_surface`
  - `referral_id` if present
  - `experiment_variant` if present

**`waitlist_share_prompt_viewed`**
- Fired when the share module is visible
- Properties:
  - `session_id`
  - `signup_status`
  - `share_available` (`true` / `false`)
  - `entry_surface`

**`waitlist_share_clicked`**
- Fired when user triggers copy/native share/send action
- Properties:
  - `session_id`
  - `share_method` (`copy_link`, `native_share`, `send`)
  - `entry_surface`
  - `referral_id_generated` (`true` / `false`)

**`waitlist_referral_landed`**
- Fired when a visitor lands with a valid referral parameter
- Properties:
  - `session_id`
  - `referral_id`
  - `entry_surface`

**`waitlist_referred_signup_succeeded`**
- Fired when a signup is completed and attributed to a referral
- Properties:
  - `session_id`
  - `referral_id`
  - `signup_status`
  - `entry_surface`

---

## 4) Validation Rules

### Email validation
- Required field
- Trim leading/trailing whitespace before validation
- Must match standard product email validation rule
- Reject clearly malformed email input
- Preserve entered value on validation failure

### Duplicate/existing signup handling
- Duplicate email should not produce a hard failure state
- If email already exists on waitlist, treat as successful recognized signup
- Route user to confirmation state
- Mark analytics `signup_status = existing`

### Referral parameter validation
- Accept referral parameter only if it matches the expected identifier format
- Ignore invalid or malformed referral values without blocking the user
- Never expose raw validation details in UI
- Invalid referral params should not prevent waitlist signup

### Event validation rules
- Fire success event only once per successful submit result
- Do not fire share success events on prompt impression alone
- Preserve experiment/referral properties across the flow when present
- Avoid duplicate confirmation events on immediate rerenders if implementation can guard against it

### Error-state rules
- Validation errors should be inline and field-specific where possible
- System errors should be generic, human-readable, and retryable
- Do not show technical backend error strings to users

---

## 5) Implementation Notes For Current Room-to-Result Slice

### Entry-point alignment
If the current product slice begins from a room/result context rather than a standalone marketing page:
- Keep the same join hierarchy
- Treat the room/result screen as `entry_surface`
- Preserve message consistency with the launch-support narrative
- Route all acquisition measurement through the same waitlist + confirmation events

### Confirmation-state alignment
If a room/result surface already exists after an action:
- The waitlist confirmation can be embedded or overlaid rather than requiring a separate page
- The same share prompt rules still apply
- Confirmation should remain clearly distinct from the product result itself

### Referral-attribution alignment
If backend support is partial:
- Store referral context client-side until submit
- Pass referral context with signup request if available
- Degrade gracefully to unattributed signup when validation fails or support is absent

---

## 6) Testing / Validation Checklist

### Happy path
- User arrives on entry surface
- Clicks join CTA
- Sees waitlist form
- Submits valid email
- Reaches confirmation state
- Can ignore or use share prompt
- Correct success events are fired

### Existing-user path
- User submits already-registered email
- Sees successful confirmation state
- No duplicate-error dead end
- Existing-status analytics are recorded

### Invalid-input path
- User submits malformed email
- Inline validation appears
- No success transition occurs
- Validation failure event is recorded

### System-error path
- Submit request fails
- User remains on form
- Retryable generic error appears
- System failure event is recorded

### Referral path
- User lands with valid referral parameter
- Referral landing event is recorded
- User signs up successfully
- Referred signup is attributed if backend support exists

### Share path
- Confirmation shows optional share prompt
- Share interaction fires only on explicit user action
- Dismiss/ignore path does not block completed confirmation

---

## Board-Ready Summary
**Entry point:** single primary join path from landing or current room-to-result entry surface  
**Waitlist submit:** minimal email-first form with duplicate-safe success handling  
**Confirmation state:** successful completion plus expectation-setting and optional share  
**Share/referral:** lightweight attribution-enabled sharing, no incentives or gated mechanics  
**Tracked events:** entry, CTA, form, submit attempt/result, confirmation, share, referral landing, referred signup  
**Validation rules:** email required, duplicates treated as success, invalid referrals ignored safely, errors are non-technical and retryable
