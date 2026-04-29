# Prelaunch Growth Execution Bundle

Verification note:
- Compiled path: `workspace/growth/prelaunch-growth-execution-bundle.md`
- Canonical mechanics source: `workspace/growth/approved-prelaunch-acquisition-mechanics-spec-v1.md`
- Component files compiled: `workspace/growth/weekly-growth-review-template.md`, `workspace/growth/top-3-experiment-one-pagers.md`, `workspace/growth/final-implementation-handoff-packet.md`
- CTA compliance: all compiled experiment one-pagers preserve locked primary CTA semantics `Join the waitlist` / `join-waitlist` and do not test changing the primary CTA itself

Mechanics for this bundle are inherited from `workspace/growth/approved-prelaunch-acquisition-mechanics-spec-v1.md`.  
Operating assumptions for rollout, KPI management, experimentation, and downstream sequencing are inherited from `workspace/growth/prelaunch-acquisition-operating-package.md`.

This bundle compiles the current execution artifacts needed for weekly operation and downstream implementation:
1. weekly growth review template
2. top 3 experiment one-pagers
3. final implementation handoff packet

---

# 1) Weekly Growth Review Template

# Weekly Growth Review Template

**Owner:** Growth  
**Canonical mechanics source:** `workspace/growth/approved-prelaunch-acquisition-mechanics-spec-v1.md`  
**Cadence:** Weekly  
**Week of:** [YYYY-MM-DD] to [YYYY-MM-DD]  
**Prepared by:** [Name]  
**Reviewed with:** [Names/teams]

## 1. Objective for This Week
- [1 sentence on the main acquisition objective]
- [1 sentence on the biggest known risk or unknown]

## 2. KPI Snapshot
| KPI | Current Week | Prior Week | Target / Threshold | Status | Notes |
|---|---:|---:|---:|---|---|
| Visit -> Signup Rate |  |  |  |  |  |
| Signup Completion Rate |  |  |  |  |  |
| Referral Share Rate |  |  |  |  |  |
| Referred Signup Conversion |  |  |  |  |  |
| Waitlist Rank Movement |  |  |  |  |  |

## 3. Funnel State Volumes
| Funnel State | Users / Sessions | WoW Change | Notes |
|---|---:|---:|---|
| `landing_view` |  |  |  |
| `cta_click` |  |  |  |
| `form_open` |  |  |  |
| `form_submit_attempt` |  |  |  |
| `validation_error` |  |  |  |
| `signup_complete` |  |  |  |
| `confirmation_view` |  |  |  |
| `referral_prompt_view` |  |  |  |

## 4. Segment Readout
### By Channel
- Best-performing channel:
- Lowest-performing channel:
- Notes:

### By Device
- Desktop:
- Mobile:
- Notes:

### Referred vs Non-Referred
- Referred visit -> signup:
- Non-referred visit -> signup:
- Notes:

### By Variant / Experiment Arm
- Variant summary:
- Notes:

## 5. Alerts and Exceptions
- [ ] Visit -> signup below warning threshold
- [ ] Signup completion below warning threshold
- [ ] Referral share rate below warning threshold
- [ ] Referred signup conversion below warning threshold
- [ ] Waitlist movement disconnected from referral credits
- [ ] Event quality / attribution issue detected
- [ ] Validation error spike
- [ ] Duplicate signup handling issue

**Details / impact:**
- 

## 6. What Changed This Week
### Product / Flow Changes
- 

### Messaging / Lifecycle Changes
- 

### Attribution / Analytics Changes
- 

### Traffic Mix Changes
- 

## 7. Experiment Readout
| Experiment | Status | Primary Metric | Result Direction | Decision | Notes |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 8. Key Learnings
1. 
2. 
3. 

## 9. Decisions for Next Week
| Decision | Owner | Due Date | Success Check |
|---|---|---|---|
|  |  |  |  |

## 10. Open Risks / Blockers
- 
- 
- 

## 11. Required Follow-Ups by Team
### Growth
- 

### Product / Design
- 

### Engineering
- 

### Analytics / Data
- 

### Lifecycle / CRM
- 

---

# 2) Top 3 Experiment One-Pagers

# Top 3 Experiment One-Pagers

**Owner:** Growth  
**Department lead(s):** planner, builder, share-loop-designer  
**Purpose:** Turn the approved prelaunch operating package into implementation-ready MVP experiments without reopening locked mechanics.

---

## Experiment 1 — Hero Framing Test With Locked `join-waitlist` CTA

**Status:** Ready for implementation  
**Priority:** Highest  
**Area:** Landing page  
**Constraint:** Primary CTA semantics and displayed label remain locked to `Join the waitlist` / `join-waitlist`

### Hypothesis
If we improve the hero headline/subhead framing around clearer collaborative planning, more qualified visitors will understand the value faster and click through to the email signup flow, increasing visit -> signup rate without changing the locked primary CTA semantics.

### Why this test matters
The mechanics spec locks the primary CTA to `Join the waitlist` / `join-waitlist`, so the highest-leverage landing-page test is not CTA wording change. It is surrounding framing clarity: whether the visitor immediately understands that the product helps turn rough group-planning ideas into something people can react to together.

### Test design
**Control**
- Current approved baseline hero copy
  - Headline: `Make the plan clear before the group chat gets messy.`
  - Subhead: `Turn rough ideas into a shareable plan people can react to, refine, and help move forward.`
  - Primary CTA: `Join the waitlist` / `join-waitlist`

**Variant**
- Keep primary CTA identical: `Join the waitlist` / `join-waitlist`
- Test one approved alternate framing set from swap zones or equivalent mechanics-preserving adjacent copy:
  - Headline: `From scattered ideas to a plan people can actually respond to.`
  - Subhead: `For trips, dinners, events, and other plans that start fuzzy and get better when everyone can see the same thing.`

### Primary metric
- visit -> signup rate

### Secondary metrics
- `cta_click / landing_view`
- `form_open / cta_click`
- signup completion rate
- bounce/exit proxy if available

### Guardrails
- no drop in signup completion rate caused by traffic-quality shift
- no change to CTA semantics or label
- no degradation in referred vs non-referred performance mix without explanation

### Effort
- Design/content: low
- Engineering: low
- Analytics: low

### Decision rule
- Roll out variant if it produces a meaningful lift in visit -> signup rate with stable downstream signup completion and no conversion-quality regression.
- Reject if lift is negligible or if upstream click gains are offset by lower completion quality.

---

## Experiment 2 — Referral Prompt Timing Test

**Status:** Ready for implementation  
**Priority:** High  
**Area:** Post-signup confirmation  
**Constraint:** Referral remains post-signup and collaborator-framed

### Hypothesis
If the referral prompt is visible immediately on the confirmation surface rather than requiring an extra reveal step, more confirmed users will take a share action, increasing referral share rate and referred signup volume.

### Test design
**Control**
- confirmation shown first
- referral prompt revealed after interaction with the secondary confirmation CTA

**Variant**
- confirmation shown first
- referral prompt/module visible directly on the confirmation surface without waiting for reveal interaction

### Primary metric
- referral share rate

### Secondary metrics
- `referral_prompt_view / signup_complete`
- `referral_share_action / referral_prompt_view`
- referred landing volume
- referred signup conversion

### Guardrails
- confirmation clarity must remain intact
- no decrease in user trust signals or duplicate-reload confusion
- no drop in overall signup satisfaction proxy if measured

### Effort
- Design/content: low
- Engineering: medium
- Analytics: low

### Decision rule
- Ship always-visible prompt if referral share rate improves and confirmation-state completion/trust remains stable.
- Keep reveal flow if visibility increases prompt views but not actual share actions.

---

## Experiment 3 — Milestone Messaging Framing Test

**Status:** Ready for implementation after milestone send infrastructure exists  
**Priority:** Medium  
**Area:** Lifecycle messaging  
**Constraint:** Milestone messaging remains informational and non-competitive

### Hypothesis
If milestone emails frame progress around collaborators joining and shared usefulness rather than abstract status movement alone, users will be more likely to take an additional referral/share action.

### Test design
**Control**
- progress-led milestone framing
- example: `Your waitlist status just improved`

**Variant**
- collaborator-value framing
- example: `A few people joined from your link`

Both variants:
- remain informational
- avoid leaderboard language
- include one optional share CTA

### Primary metric
- post-email referral share action rate

### Secondary metrics
- email open rate
- click-through rate
- referred landing volume after send
- unsubscribe/spam complaint rate

### Guardrails
- unsubscribe rate must remain within normal launch-email tolerance
- no hype/competition framing introduced
- no increase in low-quality referral traffic

### Effort
- Design/content: low
- Lifecycle implementation: medium
- Analytics: medium

### Decision rule
- Prefer collaborator-value framing if it increases post-email share action rate without raising complaints or lowering message trust.
- Keep progress-led framing if collaborator framing improves opens but not referral actions.

---

# 3) Final Implementation Handoff Packet

# Final Implementation Handoff Packet

Status: downstream handoff-ready  
Mechanics source of truth: `workspace/growth/approved-prelaunch-acquisition-mechanics-spec-v1.md`  
Operating source of truth: `prelaunch-acquisition-operating-package.md`  
Constraint: preserve locked mechanics, event names, and primary CTA semantics `join-waitlist`

---

## 1) Required Screens and Modules

### Landing Surface
**Must include**
- approved or swap-zone headline
- approved or swap-zone subhead
- primary CTA with semantics and displayed label locked to `join-waitlist`
- optional secondary CTA/module for “See how it works”
- attribution capture support for UTM/referral params

**Primary downstream consumers**
- product/design
- frontend eng
- analytics

### Waitlist Form Surface
**Must include**
- required email field
- optional planning-context field (`What do you usually plan?`)
- consent/expectation copy
- submit button with semantics and displayed label locked to `join-waitlist`
- inline validation support
- duplicate-signup success handling

**Primary downstream consumers**
- product/design
- frontend eng
- backend eng
- analytics

### Confirmation Surface
**Must include**
- success confirmation headline/body
- immediate proof of successful signup
- collaborator-oriented secondary CTA
- visible handoff into referral prompt/module

**Primary downstream consumers**
- product/design
- frontend eng
- lifecycle
- analytics

### Referral Prompt Module
**Must include**
- collaborator-benefit framing
- share prompt copy
- simple MVP share action such as `Copy invite link`
- default share message
- referral attribution handoff into referred landing/signup flow

**Primary downstream consumers**
- product/design
- frontend eng
- backend eng
- analytics
- lifecycle

### Lifecycle Messaging Surfaces
**Must include**
- signup confirmation email
- referral prompt follow-up module/email if used
- milestone/unlock template skeleton
- launch conversion email skeleton

**Primary downstream consumers**
- lifecycle/CRM
- growth
- data/eng

---

## 2) Canonical Required States

Implement and instrument these exact states:

1. `landing_view`
2. `cta_click`
3. `form_open`
4. `form_submit_attempt`
5. `validation_error`
6. `signup_complete`
7. `confirmation_view`
8. `referral_prompt_view`

### State notes
- `signup_complete` must fire for successful new signups and acceptable duplicate-resolution success paths
- `confirmation_view` must answer success before asking for sharing behavior
- `referral_prompt_view` can be directly visible on confirmation or revealed immediately after confirmation interaction, but must remain post-signup

---

## 3) Required Event Contract

### Funnel events
- `landing_view`
- `cta_click`
- `form_open`
- `form_submit_attempt`
- `validation_error`
- `signup_complete`
- `confirmation_view`
- `referral_prompt_view`

### Additional operational events recommended for downstream reporting
- `referral_share_action`
- `referral_link_copied`
- `referred_landing_view`
- `referred_signup_complete`
- `milestone_message_sent`
- `launch_invite_sent`
- `launch_activation_click`

### Required event implementation rules
- preserve event names exactly for canonical funnel events
- carry source attribution through signup where available
- include referral code when present
- merge anonymous/session identity into known user identity where supported
- do not emit conflicting semantic duplicates for the same action

---

## 4) Copy Insertion Points

### Locked-mechanics insertion points
These can receive approved copy variants without changing mechanics:
- landing headline
- landing subhead
- secondary CTA/helper copy
- form header
- form subhead
- consent/expectation copy
- optional-field label/helper text
- confirmation headline
- confirmation body
- referral context line
- referral prompt line
- default share message
- lifecycle subject/body modules

### Protected insertion points
These must remain mechanically locked:
- primary CTA semantics: `join-waitlist`
- submit CTA semantics: `join-waitlist`
- event/state names
- post-signup confirmation before referral ask
- referral framing around known collaborators, not generic friends/audience growth

### Conversion-critical copy issues only
Escalate only if any of the following are changed or removed:
- absence of clear signup success confirmation
- missing email-first framing
- referral copy shifts into spam/reward-heavy tone
- `join-waitlist` semantics changed
- validation copy becomes unclear enough to block completion

---

## 5) Dependencies by Team

### Product / Design
**Needs**
- mechanics spec
- operating package
- screen/module requirements
- swap-zone copy map

**Delivers**
- screen layouts
- state transitions
- referral prompt placement
- rank/progress UI decision for later phase if pursued

### Frontend Engineering
**Needs**
- final screen/state map
- canonical event list
- copy insertion map
- referral prompt interaction rules

**Delivers**
- landing/form/confirmation/referral surfaces
- client validation
- event emission
- share action handling

### Backend Engineering
**Needs**
- waitlist record requirements
- referral attribution logic
- duplicate-signup handling rules
- referral credit rules

**Delivers**
- signup persistence
- duplicate-resolution success path
- referral link/code generation
- referred signup crediting
- anti-abuse baseline logic

### Analytics / Data
**Needs**
- event contract
- KPI definitions
- segmentation cuts
- weekly dashboard spec

**Delivers**
- event schema validation
- dashboard/reporting
- alert thresholds
- experiment readout support

### Lifecycle / CRM
**Needs**
- trigger map from signup/referral/milestone/access states
- approved modular messaging brief
- audience flags and send conditions

**Delivers**
- confirmation email
- referral follow-up if used
- milestone/unlock sends
- launch conversion sequence

### Growth
**Needs**
- access to reporting
- copy insertion points
- experiment hooks
- rollout readiness visibility

**Delivers**
- copy QA
- KPI review cadence
- experiment prioritization
- cross-team launch signoff from growth side

---

## 6) Owner / Consumer Mapping

| Artifact / Area | Primary Owner | Core Consumers |
|---|---|---|
| Mechanics spec | Growth | Product, Eng, Analytics, Lifecycle |
| Operating package | Growth | Product, Eng, Analytics, Lifecycle, Leadership |
| Landing and form implementation | Product + Frontend Eng | Growth, Analytics |
| Signup persistence + referral logic | Backend Eng | Frontend, Analytics, Growth |
| Event schema + dashboard | Analytics | Growth, Product, Leadership |
| Lifecycle templates and sends | Lifecycle/CRM | Growth, Product |
| Weekly review process | Growth | Analytics, Product, Leadership |

---

## 7) Launch-Readiness Checklist

### Core funnel readiness
- [ ] landing surface implemented
- [ ] primary CTA semantics and label locked to `join-waitlist`
- [ ] email-first form implemented
- [ ] optional planning-context field implemented or intentionally omitted with approval
- [ ] validation copy and behavior implemented
- [ ] duplicate-signup success path implemented
- [ ] `signup_complete` leads to confirmation state
- [ ] confirmation state clearly confirms success
- [ ] referral prompt is post-signup and collaborator-framed

### Referral loop readiness
- [ ] referral link/code generation works
- [ ] share action works
- [ ] referred landings are attributable
- [ ] referred signups are measurable
- [ ] duplicate/self-referral baseline protections are in place

### Analytics readiness
- [ ] all canonical funnel events fire
- [ ] attribution properties populate where present
- [ ] referred vs non-referred segmentation works
- [ ] KPI dashboard definitions are implemented
- [ ] alert thresholds are configured or documented

### Lifecycle readiness
- [ ] signup confirmation send is configured
- [ ] referral follow-up decision is documented
- [ ] milestone/unlock template skeleton exists
- [ ] launch conversion sequence skeleton exists
- [ ] compliance/unsubscribe path is confirmed

### Operational readiness
- [ ] weekly growth review owner assigned
- [ ] experiment launch gate defined
- [ ] source-of-truth docs linked in project handoff
- [ ] no unresolved conversion-critical copy blockers remain

---

## 8) Implementation Notes

- Do not reopen mechanics during implementation unless a true blocker appears.
- Keep brand copy modular using the approved swap zones, but do not change funnel order or state logic.
- If visible progress/rank is not ready, keep movement internal and omit public status language rather than inventing unstable UI.
- Referral should remain a secondary ask after confirmation, not a gating action.
- Duplicate signup handling should preserve trust by resolving to success rather than a hard failure.