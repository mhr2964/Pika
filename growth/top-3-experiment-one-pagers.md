# Top 3 Experiment One-Pagers

**Owner:** Growth  
**Department lead(s):** planner, builder, share-loop-designer  
**Purpose:** Turn the approved prelaunch operating package into implementation-ready experiment briefs for the top 3 backlog items.  
**Selection logic:** Prioritized to cover one landing-page CTA test, one referral prompt timing test, and one milestone messaging test in line with the approved operating package and the product’s social-planning/share-expression constraints.

---

## Experiment 1: Landing Page CTA Test
### Name
**Plan-first CTA vs Waitlist-first CTA**

### Rationale
The prelaunch page should not feel like generic startup “sign up for updates” capture. Our product is strongest when framed as a social planning tool with expressive outcomes, so the CTA should invite people into a future action they already want, not just passive list enrollment. This test checks whether a planning-oriented CTA creates stronger intent and better downstream referral behavior than a generic waitlist CTA.

### Hypothesis
If the primary CTA frames signup as the start of a social plan rather than passive early access, then more visitors will join the waitlist and a higher share of them will continue into invite/referral behavior, because the value proposition feels more concrete and socially actionable.

### Trigger Condition
Run when:
- Landing page traffic is stable enough to support an A/B split.
- Core hero copy and page structure are otherwise fixed for the test window.
- Waitlist form and referral attribution are functioning.

### Setup / Variant Definition
**Audience:** All new landing-page visitors from the same traffic mix during test period.

**Control (A): Waitlist-first CTA**
- Hero CTA: **Join the waitlist**
- Supporting subcopy emphasizes early access / being first to know.

**Variant (B): Plan-first CTA**
- Hero CTA: **Start your next plan**
- Supporting subcopy emphasizes easier social planning, friend coordination, and shareable outcomes.
- Waitlist capture still occurs after CTA click; the promise is framed around future use, not newsletter subscription.

**Implementation notes**
- Keep page layout, form length, and traffic sources constant.
- Only change CTA label and immediate supporting copy block.
- Track:
  - CTA click-through
  - Waitlist completion
  - Referral/share initiation after signup
  - Source by channel

### Primary Success Metric
**Waitlist conversion rate from unique landing-page visitor to completed signup**

### Guardrail Metric
**Post-signup referral initiation rate**  
Reason: a CTA that boosts low-intent signups but weakens downstream sharing is not a win.

### Minimum Read
Declare no directional decision until both conditions are met:
- At least **500 unique visitors per variant**
- At least **50 completed signups per variant**
- Minimum run time: **7 days** to smooth day-of-week effects

### Ship / Kill Rule
**Ship variant B** if:
- Waitlist conversion improves by **≥10% relative** over control, and
- Referral initiation rate is flat or better (no more than **5% relative decline**)

**Kill variant B** if:
- Waitlist conversion is flat within noise after minimum read, or
- It improves signup but referral initiation declines by **>5% relative**

**Follow-up if mixed result**
- If CTR rises but completed signup falls, test expectation mismatch in CTA-to-form transition.
- If signup rises but referral initiation drops, refine plan framing to better prequalify socially motivated users.

---

## Experiment 2: Referral Prompt Timing Test
### Name
**Immediate Post-Signup Ask vs Delayed Milestone-Based Invite Prompt**

### Rationale
Referral prompts work best when they ride an emotional or identity moment. Asking for invites immediately after a waitlist signup may feel bolted on and transactional. A delayed prompt tied to a meaningful progress or profile moment may feel more natural and earn better-quality shares. This experiment tests whether timing the ask to a stronger expressive moment creates more authentic referral behavior.

### Hypothesis
If the referral prompt appears after a user hits a meaningful milestone instead of immediately after signup, then referral share rate and referred-user quality will increase, because users have more context and a more credible reason to invite someone.

### Trigger Condition
Run when:
- Waitlist onboarding flow supports event-triggered messaging or in-product prompt surfaces.
- At least one milestone event is instrumented and reliable.
- Referral links and attribution are live.

### Setup / Variant Definition
**Audience:** New waitlist joiners eligible for referral prompt exposure.

**Control (A): Immediate Prompt**
- After waitlist confirmation, user sees:
  - “Invite friends to move up the list” or equivalent referral prompt
- Referral ask occurs in the same session as signup.

**Variant (B): Delayed Milestone Prompt**
- No invite ask on immediate confirmation screen.
- Referral prompt is shown only after the user reaches a milestone event, such as:
  - profile completion,
  - social-planning preference submission,
  - friend-type/taste result reveal,
  - or another expressive output defined in product flow.
- Prompt language centers on sharing the moment/result, with referral benefit secondary.

**Implementation notes**
- Incentive structure must remain identical across both groups.
- Keep prompt design similar; only timing and framing should change.
- Track first exposure timestamp and invite action timestamp separately.

### Primary Success Metric
**Referral conversion rate per exposed user**  
Defined as exposed users who send at least one referral/invite link.

### Guardrail Metric
**Waitlist activation / milestone completion rate**  
Reason: delaying the ask is only useful if enough users actually reach the milestone.

### Minimum Read
Declare no decision until both conditions are met:
- At least **300 prompt-exposed users per variant**
- At least **30 referral senders total per variant or combined directional signal after 14 days**
- Minimum run time: **10–14 days**

### Ship / Kill Rule
**Ship delayed milestone prompt** if:
- Referral conversion per exposed user improves by **≥15% relative**, and
- Milestone completion rate does not drop materially (**≤5% relative decline**), and
- Referred-user signup rate is flat or better

**Kill delayed milestone prompt** if:
- Exposure volume is too low due to weak milestone completion, or
- Referral conversion is flat/down after minimum read

**Follow-up if mixed result**
- If delayed prompt has fewer senders but better referred-user signup quality, test hybrid timing:
  - soft mention after signup,
  - full ask at milestone.
- If milestone completion is the bottleneck, move prompt to an earlier but still meaningful moment.

---

## Experiment 3: Milestone Messaging Test
### Name
**Utility Milestone Message vs Shareable Identity Milestone Message**

### Rationale
Milestone communication should do more than announce progress. It should turn progress into something users want to show someone: a reveal, a label, a social rank, or a “this is so us” planning insight. This test checks whether milestone messaging framed as identity/expression outperforms purely functional progress messaging in driving shares and return behavior.

### Hypothesis
If milestone messages package progress as a socially expressive outcome rather than a utility update, then users will be more likely to share, click back in, and bring others along, because the message gives them something to say about themselves or their group.

### Trigger Condition
Run when:
- A milestone event exists that can be messaged by email, SMS, or in-app.
- The milestone can support both a functional version and an expressive version of copy.
- Click, share, and return events are instrumented.

### Setup / Variant Definition
**Audience:** Users who reach the chosen milestone during the test window.

**Milestone candidate examples**
- “You unlocked your planning profile”
- “Your group vibe is ready”
- “You’ve reached the next waitlist tier”
- “Your result/reveal is available”

**Control (A): Utility Message**
- Functional framing
- Example: “You reached the next milestone. View your status.”
- Emphasis on access, progress, or queue movement.

**Variant (B): Shareable Identity Message**
- Expressive/social framing
- Example: “Your group planning style just dropped.”
- Or: “Your result is too accurate not to send to the group.”
- Emphasis on identity, reaction, or social relevance.
- CTA may lead to the same destination; only messaging changes.

**Implementation notes**
- Keep channel, send time, destination page, and design consistent.
- Only message framing and CTA copy should change.
- Where possible include a preview snippet or screenshot-worthy line in variant B.

### Primary Success Metric
**Share rate or invite click-through from milestone message recipients**  
Use the closest measurable action available:
1. direct share action,
2. referral/invite click,
3. copy-link action.

### Guardrail Metric
**Message-to-destination click-through rate**  
Reason: expressive copy should not sacrifice baseline clarity or confuse the user.

### Minimum Read
Declare no decision until both conditions are met:
- At least **400 delivered messages per variant**
- At least **40 downstream milestone clicks per variant** or **14 days elapsed**
- Minimum read should include at least one weekday/weekend cycle

### Ship / Kill Rule
**Ship expressive milestone messaging** if:
- Share/invite action rate improves by **≥20% relative**, and
- Destination CTR is not worse by more than **5% relative**

**Kill expressive milestone messaging** if:
- Shares do not improve after minimum read, or
- CTR declines materially due to confusion/misaligned promise

**Follow-up if mixed result**
- If expressive copy increases opens but not shares, test stronger screenshot/reveal packaging on destination page.
- If CTR drops but shares among clickers rise, simplify subject/header while preserving expressive body copy.

---

## Notes for Weekly Review
- These tests should be staggered if instrumentation bandwidth is constrained, but not framed as isolated channel optimizations; they are all checking the same principle: **does the product invite social expression naturally at the right moment?**
- Priority order for implementation:
  1. **Landing Page CTA Test**
  2. **Referral Prompt Timing Test**
  3. **Milestone Messaging Test**
- Shared reporting fields across all three:
  - audience definition
  - exposure count
  - conversion count
  - referral/share count
  - referred-user quality
  - qualitative notes on confusion, delight, and screenshot/share behavior