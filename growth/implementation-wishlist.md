# Pika Launch-Support Implementation Wishlist
_Status: pending only. This document lists instrumentation/event needs implied by the approved launch branch plan and current user-facing surfaces. Nothing in this file is implemented yet._

## Purpose
Provide the product/engineering teams a precise handoff list of the analytics and event instrumentation required to measure launch performance once the frozen branch plan is activated.

## Scope Guardrails
- This is an implementation wishlist, not a launch strategy revision.
- No referral program expansion, no new growth mechanics, no speculative campaign additions.
- Events below are limited to current/approved surfaces needed to evaluate waitlist and share-loop performance.
- All items are marked pending until implemented by the owning team.

---

## Event Naming Convention
Recommended format for later implementation:
- `waitlist_*` for waitlist funnel actions
- `share_*` for share-loop and outbound sharing actions
- `launch_*` for branch-level attribution and conversion context
- `social_*` for inbound traffic from social/distribution surfaces

For each event below, implementation should capture:
- timestamp
- anonymous/session identifier
- page/surface
- branch variant (if applicable)
- campaign/source context when available
- device type
- referrer
- URL parameters / UTM context when present

---

## Pending Event Wishlist

### 1) Waitlist Page Viewed
**Status:** not implemented  
**Proposed event:** `waitlist_page_viewed`

**When to fire**
- User lands on the primary waitlist/join surface.

**Required properties**
- `surface_name`
- `entry_url`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `branch_variant`
- `is_returning_visitor`

**Why it is needed**
- Baseline denominator for page-to-submit conversion.
- Required to compare performance across launch branches and traffic sources.

---

### 2) Waitlist Form Started
**Status:** not implemented  
**Proposed event:** `waitlist_form_started`

**When to fire**
- User focuses first actionable field or otherwise begins interacting with the waitlist form.

**Required properties**
- `surface_name`
- `branch_variant`
- `field_first_touched`
- `utm_source`
- `referrer`

**Why it is needed**
- Distinguishes passive page visits from actual signup intent.
- Helps isolate copy/positioning issues vs form friction.

---

### 3) Waitlist Submission Attempted
**Status:** not implemented  
**Proposed event:** `waitlist_submission_attempted`

**When to fire**
- User presses the waitlist submit CTA.

**Required properties**
- `surface_name`
- `branch_variant`
- `cta_label`
- `form_completion_state`
- `has_referral_context`
- `utm_source`

**Why it is needed**
- Measures CTA engagement before success/failure outcomes.
- Helps diagnose client-side or server-side drop-off.

---

### 4) Waitlist Submission Succeeded
**Status:** not implemented  
**Proposed event:** `waitlist_submission_succeeded`

**When to fire**
- Waitlist signup is confirmed successfully.

**Required properties**
- `surface_name`
- `branch_variant`
- `cta_label`
- `utm_source`
- `utm_campaign`
- `referrer`
- `signup_method` (if only one method exists now, still keep property for future consistency)
- `share_prompt_shown` (boolean)

**Why it is needed**
- Primary conversion event for launch measurement.
- Needed for source, branch, and message performance reporting.

---

### 5) Waitlist Submission Failed
**Status:** not implemented  
**Proposed event:** `waitlist_submission_failed`

**When to fire**
- Waitlist submission returns an error or validation failure.

**Required properties**
- `surface_name`
- `branch_variant`
- `error_type`
- `error_code`
- `validation_stage` (`client` or `server`)
- `cta_label`

**Why it is needed**
- Identifies preventable conversion loss.
- Separates demand weakness from implementation bugs.

---

### 6) Confirmation Screen Viewed
**Status:** not implemented  
**Proposed event:** `waitlist_confirmation_viewed`

**When to fire**
- User sees the post-signup confirmation/thank-you state.

**Required properties**
- `surface_name`
- `branch_variant`
- `share_prompt_present`
- `next_step_cta_present`

**Why it is needed**
- Confirms users reached the intended post-submit state.
- Serves as entry point to measure share-loop exposure.

---

### 7) Share Prompt Viewed
**Status:** not implemented  
**Proposed event:** `share_prompt_viewed`

**When to fire**
- A post-signup or in-flow share prompt becomes visible.

**Required properties**
- `surface_name`
- `branch_variant`
- `prompt_type`
- `prompt_position`
- `share_message_variant`

**Why it is needed**
- Measures exposure to the approved share loop.
- Lets team distinguish low prompt visibility from low user willingness to share.

---

### 8) Share CTA Clicked
**Status:** not implemented  
**Proposed event:** `share_cta_clicked`

**When to fire**
- User clicks any share CTA.

**Required properties**
- `surface_name`
- `branch_variant`
- `cta_label`
- `share_channel_intent` (`copy_link`, `native_share`, specific platform if explicit)
- `share_message_variant`
- `prompt_type`

**Why it is needed**
- Primary indicator of share intent.
- Required for comparing channel preference and prompt effectiveness.

---

### 9) Native Share Opened
**Status:** not implemented  
**Proposed event:** `share_native_opened`

**When to fire**
- Native share sheet is successfully invoked.

**Required properties**
- `surface_name`
- `branch_variant`
- `share_message_variant`

**Why it is needed**
- Separates CTA clicks from successful opening of native share UX.
- Useful where browser/device support varies.

---

### 10) Link Copied
**Status:** not implemented  
**Proposed event:** `share_link_copied`

**When to fire**
- User copies the share link.

**Required properties**
- `surface_name`
- `branch_variant`
- `share_message_variant`
- `link_type`
- `prompt_type`

**Why it is needed**
- Core measurable share action when downstream send events are unavailable.
- Often the cleanest proxy for real outbound sharing.

---

### 11) Outbound Share Destination Clicked
**Status:** not implemented  
**Proposed event:** `share_destination_clicked`

**When to fire**
- User clicks a direct outbound share destination button/link, if such buttons exist on current surfaces.

**Required properties**
- `surface_name`
- `branch_variant`
- `destination`
- `share_message_variant`
- `prompt_type`

**Why it is needed**
- Supports channel-level performance analysis on explicit share buttons.
- Should only be implemented where such buttons already exist.

---

### 12) Inbound Shared Visit Landed
**Status:** not implemented  
**Proposed event:** `social_shared_visit_landed`

**When to fire**
- A visitor lands with recognizable shared-link attribution parameters or share-origin context.

**Required properties**
- `landing_surface`
- `branch_variant`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `share_token_present` (boolean)
- `shared_link_id` (if later implemented)

**Why it is needed**
- Measures whether sharing creates actual inbound traffic.
- Required to connect share behavior to acquisition outcomes.

---

### 13) Inbound Shared Visitor Converted
**Status:** not implemented  
**Proposed event:** `social_shared_visit_converted`

**When to fire**
- A visitor attributed to a shared visit completes waitlist signup.

**Required properties**
- `landing_surface`
- `conversion_surface`
- `branch_variant`
- `utm_source`
- `share_token_present`
- `shared_link_id` (if later implemented)

**Why it is needed**
- Critical to measure share-loop effectiveness.
- Allows later calculation of share-to-conversion efficiency.

---

### 14) Branch Attribution Captured
**Status:** not implemented  
**Proposed event:** `launch_branch_attribution_captured`

**When to fire**
- The experience determines which approved launch branch variant/context the visitor belongs to.

**Required properties**
- `branch_variant`
- `assignment_method`
- `surface_name`
- `utm_source`
- `referrer`

**Why it is needed**
- Ensures downstream events can be segmented accurately by branch.
- Prevents ambiguous reporting during launch execution.

---

### 15) Primary Launch CTA Clicked
**Status:** not implemented  
**Proposed event:** `launch_primary_cta_clicked`

**When to fire**
- User clicks the main CTA on launch-support surfaces that routes toward waitlist/join flow.

**Required properties**
- `surface_name`
- `branch_variant`
- `cta_label`
- `cta_destination`
- `utm_source`

**Why it is needed**
- Captures click-through from top-of-funnel launch surfaces into the waitlist funnel.
- Helps diagnose whether underperformance is due to traffic quality or weak CTA conversion.

---

## Pending Derived Metrics
Not events themselves, but reporting outputs expected once the above instrumentation exists:

- waitlist page view → form start rate
- form start → submission success rate
- page view → submission success rate
- submission failure rate by error type
- confirmation view rate after successful submit
- share prompt exposure rate
- share CTA click-through rate
- link copy / native share / destination click rate
- inbound shared visit rate
- inbound shared visit → waitlist conversion rate
- branch A vs branch B conversion comparison
- source/campaign conversion comparison

---

## Implementation Notes For Later Handoff
- Every downstream waitlist and share event should inherit the same attribution context captured on landing where possible.
- If branch assignment is decided client-side, it must be available before key funnel events fire.
- If no share token or share-link identifier exists yet, implement the event shells first with `share_token_present: false` and extend later.
- Avoid creating channel-specific events unless the UI already exposes those channels; prefer one event with a `destination` property.
- Use stable event/property names to avoid dashboard churn during launch.

---

## Explicitly Not Yet Implemented
The following are recognized needs but remain pending:
- event emission in product code
- analytics vendor wiring
- dashboard/report setup
- share-link token generation
- referral identity stitching
- experiment framework integration beyond simple branch tagging

---

## Suggested Ownership Handoff
- Product/frontend: fire client-side page, CTA, form, confirmation, and share events
- Backend/data: validate conversion success/failure capture and preserve attribution where needed
- Analytics/growth ops: map final event schema to dashboards and launch reporting
