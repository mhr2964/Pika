# Final Implementation Handoff Packet

Status: downstream handoff-ready  
Mechanics source of truth: `approved-prelaunch-acquisition-mechanics-spec-v1.md`  
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