# Pika room-to-result share trigger spec
_Status: implementation/testing-ready share-loop messaging spec for the current room-to-result flow_

## Purpose
Map the approved share-loop language to the exact product moment in the current room-to-result flow where sharing is natural. This spec keeps the share behavior tied to Pika's real value: turning messy group chat planning into one shareable plan everyone can follow.

## Canonical narrative anchor
Pika helps groups stop losing the plan in the chat by turning messy messages into **one shareable plan everyone can follow**.

This means the share moment should happen **after a usable plan exists**, not before. The user should feel like they are sharing clarity with the group, not promoting a product.

---

## Trigger moment to use

### Primary trigger point
**Immediately after Pika produces the first usable room result/plan summary.**

This is the first moment where the user has received the core value:
- the messy planning input has been turned into something clearer
- there is now a single artifact worth passing back to the group
- the user has a practical reason to share

### Do not trigger before
- room creation
- room naming
- message input
- upload/import steps
- loading state before result exists
- empty or partial-result states
- waitlist capture alone

### Trigger condition
Show the share prompt only when all of the following are true:
1. A room result has been successfully generated
2. The result contains enough usable structure to function as a plan
3. The user can understand what they are sharing from the current screen
4. No blocking error or unresolved processing state is present

### Minimum “usable plan” bar
A share prompt should only appear if the result is meaningfully interpretable as a plan. Implementation can define the threshold, but the experience standard is:
- there is a visible plan output
- it contains enough detail that another person could follow it
- it is not obviously a draft fragment or broken parse

---

## User intent at this moment

### Primary user intent
**“I should send this to the group so everyone is looking at the same plan.”**

### Secondary user intents
- “This is clearer than the chat — I want everyone to use this version.”
- “I need the others to confirm or react to this.”
- “This helps us stop repeating the same planning messages.”

### Intent we are not relying on
- showing off
- farming referrals
- posting for status
- helping the company grow
- unlocking rewards
- curiosity about a gimmicky result

This is a utility-led share, not a vanity-led share.

---

## Share prompt to show

### Primary prompt headline
**Share the plan with your group**

### Supporting line
**Give everyone one place to follow.**

This wording is consistent with the locked route and fits the room-to-result moment better than generic invite language.

### CTA options
Primary:
- **Share plan**

Secondary/fallback:
- **Copy link**

If native share is unavailable, default to copy-link behavior with the same framing.

---

## Recipient invite

### Recipient promise
The recipient is being invited to:
- open the shared plan
- see the same clear version of the plan
- use one place instead of piecing details together from the chat

### Recipient-facing line
**Open the plan your group can follow in one place.**

If a shorter line is required for implementation:
**Open the shared plan.**

### What the recipient should not be led to expect
- a finished full product beyond the current slice
- collaborative editing if not present
- live syncing if not present
- guaranteed consensus
- automatic resolution of planning disagreements
- a social network or referral program

---

## Anti-overclaim constraints

### Messaging constraints
All share-surface language must:
- describe the output as a clearer plan, not a perfect plan
- imply usefulness for coordination, not magic automation
- stay anchored to the current room result
- avoid promising capabilities outside the current flow

### Forbidden claim patterns
Do not use language that implies:
- Pika “solves planning” universally
- everyone is already aligned
- all details are final or verified
- the product replaces all group discussion
- recipients can do actions that are not yet implemented

### Specific phrases to avoid
- “perfect plan”
- “final plan”
- “everyone’s aligned now”
- “instantly organized everything”
- “done planning”
- “invite friends”
- “refer your group”
- “unlock with shares”
- “compare results”
- “you need to try this”

### Safe claim pattern
Use:
- “share the plan”
- “one place to follow”
- “clearer than the chat”
- “send it to the group”
- “keep everyone on the same page” only if the current state plausibly supports that claim

---

## Surface behavior guidance

### Placement on result screen
Place the share action near the generated room result, after the plan is visible.

Preferred hierarchy:
1. Result/plan content
2. Share prompt block
3. Share action buttons

This keeps the plan itself as the hero and the share action as the natural next step.

### Prompt style
- visible
- optional
- lightweight
- no modal interruption by default

### Avoid
- forced share gate before viewing result
- celebratory referral interstitial
- persistent nag after dismissal
- copy that shifts the user from planning mode into campaign mode

---

## Trigger logic recommendation

### Show the prompt when
- first successful result render occurs for a room
- user has had enough time to recognize the output
- result is in a stable view state

### Suggested implementation behavior
- do not fire immediately during transition
- allow result to render first
- then reveal the share prompt as the next obvious action

This preserves comprehension before asking for distribution.

### Re-show behavior
If dismissed, do not aggressively re-prompt within the same result session.

Optional acceptable re-entry points:
- explicit share icon/button on the result screen
- overflow menu action
- sticky share affordance only if visually subordinate to the plan

---

## Experiment-ready variants
All variants stay within the same utility-led share route.

### Variant A: group-follow framing
Headline: **Share the plan with your group**  
Support: **Give everyone one place to follow.**

**Hypothesis:** Most literal articulation of the core value will produce the cleanest share-to-open rate.

### Variant B: chat-reduction framing
Headline: **Send the plan back to the chat**  
Support: **Replace the scroll with one clear version.**

**Hypothesis:** Explicitly naming the pain of chat mess improves share action rate.

**Constraint:** Use only if “replace the scroll” is approved or softened by brand review.

### Variant C: clarity framing
Headline: **Share one clear plan**  
Support: **Help the group see the same next steps.**

**Hypothesis:** “Clear” may feel less overclaimed than “everyone can follow” for partial-result states.

---

## QA checklist
Use this checklist before implementation is considered ready:

- Share prompt appears only after a usable result exists
- Prompt is attached to the room result screen, not a generic waitlist state
- Headline matches approved route: plan-sharing, not referral
- Supporting line does not promise missing functionality
- CTA labels are literal and action-oriented
- Recipient invite matches the actual landing/open experience
- No rewards, rank, or unlock mechanics are implied
- Dismissal does not create repeated interruption
- Partial/error states do not show the share prompt

---

## Locked recommendation
For the current room-to-result slice, the default share loop should be:

**Trigger condition:** first successful usable room result appears  
**User intent:** send the clarified plan to the group  
**Share prompt:** **Share the plan with your group**  
**Support line:** **Give everyone one place to follow.**  
**Recipient invite:** **Open the shared plan.**  
**Constraint:** never overstate the result as complete, final, or more collaborative than it is

This is the most natural share point because it rides the exact moment Pika turns chaos into something worth passing on.