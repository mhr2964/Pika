# Pika landing-page section copy spec
_Status: implementation/testing-ready copy package for the approved landing-page route_

## Page objective
Convert qualified visitors who already coordinate social plans in chat into early-access signups by making the problem immediately recognizable and the product outcome easy to understand.

## Canonical narrative
Pika helps groups stop losing the plan in the chat by turning messy messages into one shareable plan everyone can see and react to.

## Primary conversion action
**Get early access**

## Global copy rules
Use:
- group chat
- messy group messages
- shareable plan
- everyone can see and react
- clear plan
- keep everyone on the same page
- early access
- real group plans

Do not use:
- productivity
- workflow
- team collaboration
- scheduling suite
- event platform
- calendar replacement
- AI copilot
- demo request language
- inflated traction language

---

## Section 1 — Hero

### Purpose
Create instant recognition for people who have experienced plans getting buried in group chat and give them one clear next action.

### Copy assignment
**Eyebrow**  
None

**Headline**  
Stop losing the plan in the chat.

**Subhead**  
Pika turns messy group messages into one shareable plan everyone can see and react to.

**Primary CTA**  
Get early access

**Secondary CTA**  
None

**Optional helper line under CTA**  
For dinners, trips, birthdays, meetups, and everyday group plans.

### CTA behavior
- Button scrolls to signup form if form is on-page
- If signup is modal-based, button opens signup modal
- No secondary CTA in hero
- No outbound links competing with the primary action

### Implementation note
Hero visual should show the transition from scattered chat messages to one clear shared plan. Avoid dashboard-style UI or workplace aesthetics.

---

## Section 2 — Problem

### Purpose
Name the pain clearly enough that the visitor feels understood before asking them to believe in the solution.

### Copy assignment
**Section headline**  
Group chat is where plans start — and where they get lost.

**Body copy**  
Messages pile up, the latest decision gets buried, and someone ends up repeating the plan. What should feel easy turns into confusion, missed updates, and too much organizer overhead.

**Supporting bullets**
- The latest plan is hard to find
- People ask the same questions again
- One person ends up doing the recap
- Momentum drops before the group decides

### CTA behavior
- No standalone CTA required inside this section
- If sticky CTA is used on mobile, keep label as **Get early access**

### Implementation note
Bullets are optional on smaller screens; body copy alone is sufficient if layout needs to stay compact.

---

## Section 3 — Core benefit

### Purpose
Translate the pain into one simple product outcome: a shared plan the whole group can follow.

### Copy assignment
**Section headline**  
One clear plan for the whole group.

**Body copy**  
Pika gives everyone a shared place to see what’s happening, react to the current plan, and move things forward without rereading the whole thread.

**Support line**  
Less confusion, less repetition, and a clearer next step for everyone.

### CTA behavior
**Inline CTA text link or button**  
Get early access

- Use only if the section appears below the fold and the signup form is not yet visible
- If a CTA is included here, it should route to the same signup destination as hero CTA

### Implementation note
This is the first section where the page should shift from pain to relief. Keep the tone practical, not grandiose.

---

## Section 4 — How it works

### Purpose
Explain the product in the simplest believable form, without adding claims about features that are not essential to the current flow.

### Copy assignment
**Section headline**  
How Pika works

**Intro line**  
A simpler way to move from chat chaos to a shared plan.

**Step 1 title**  
Start with the conversation

**Step 1 body**  
Your group is already talking through options in chat.

**Step 2 title**  
Turn it into a shareable plan

**Step 2 body**  
Pika makes the important details easy to see in one place.

**Step 3 title**  
Keep everyone aligned

**Step 3 body**  
Everyone can follow the same plan and react without asking for the recap again.

### CTA behavior
- No CTA between individual steps
- Optional section-end CTA button: **Get early access**
- Use section-end CTA only if the page design benefits from a repeated action after explanation

### Implementation note
Keep visuals lightweight and social. Do not show enterprise-style multi-panel layouts or feature-heavy control surfaces.

---

## Section 5 — Audience recognition

### Purpose
Help the right visitor self-identify and reinforce that Pika is for social group planning, not work use cases.

### Copy assignment
**Section headline**  
Built for the person who ends up pulling the plan together.

**Body copy**  
From birthday dinners and weekend trips to roommate coordination and casual meetups, Pika is for groups that already plan socially — and for the organizer who’s tired of repeating the plan.

**Use-case chips or bullets**
- Birthday dinners
- Weekend trips
- Roommate plans
- Casual meetups
- Group decisions that keep stalling

### CTA behavior
- No separate CTA required
- If use-case chips are clickable, they should not navigate off-page during launch phase

### Implementation note
This section should feel like audience recognition, not segmentation. Avoid creating separate paths or tabs by audience type.

---

## Section 6 — Trust / near-launch credibility

### Purpose
Add confidence without overstating traction or manufacturing social proof.

### Copy assignment
**Section headline**  
Made for real group plans.

**Body copy**  
Pika is built for the everyday plans people already try to coordinate in chat: dinners, birthdays, trips, meetups, and last-minute group decisions.

**Support line**  
Early access for socially active groups.

### CTA behavior
- Optional lightweight CTA below this section: **Get early access**
- If included, it should look identical to other primary CTAs

### Implementation note
Do not add fake numbers, fake testimonials, press logos, or “trusted by” language. This block is for grounded credibility only.

---

## Section 7 — Final CTA

### Purpose
Give convinced visitors one final, low-friction action after the full story has been told.

### Copy assignment
**Section headline**  
Bring clarity to your group plans.

**Body copy**  
Join early access for a better way to keep everyone on the same page.

**CTA**  
Get early access

**Optional helper line**  
Built for real plans with real groups.

### CTA behavior
- Routes to signup form or opens signup modal
- Must match the primary conversion destination used above the fold
- No secondary CTA next to final CTA

### Implementation note
Final CTA should feel like a natural conclusion to the story, not a hard sell.

---

## Recommended page order
1. Hero
2. Problem
3. Core benefit
4. How it works
5. Audience recognition
6. Trust / near-launch credibility
7. Final CTA

---

## Component-level CTA behavior summary
- **Primary CTA label everywhere:** Get early access
- Hero CTA: required
- Benefit CTA: optional, only if needed for below-fold conversion
- How-it-works CTA: optional, only as section-end repeat
- Trust CTA: optional, only if page spacing/design benefits
- Final CTA: required
- No competing CTAs
- No alternate verbs across sections

---

## Mobile guidance
- Keep hero headline and subhead visible without excessive wrapping
- If sticky mobile CTA is used, label remains **Get early access**
- Problem bullets may collapse into plain text
- Use-case chips may stack vertically
- Keep final CTA above footer links

---

## QA copy checklist
- Headline matches canonical route exactly
- Subhead matches canonical route exactly
- Every CTA says **Get early access**
- No workplace/productivity language appears anywhere
- No invented social proof appears anywhere
- Audience examples stay social and lightweight
- Problem/benefit flow remains: buried plan -> shareable plan -> aligned group

## Canonical page copy stack
**Hero:** Stop losing the plan in the chat.  
**Subhead:** Pika turns messy group messages into one shareable plan everyone can see and react to.  
**Problem:** Group chat is where plans start — and where they get lost.  
**Benefit:** One clear plan for the whole group.  
**How it works:** Start with the conversation -> Turn it into a shareable plan -> Keep everyone aligned.  
**Audience:** Built for the person who ends up pulling the plan together.  
**Trust:** Made for real group plans.  
**Final CTA:** Bring clarity to your group plans.

This is the implementation-ready landing-page copy package for the current Pika launch-support flow.