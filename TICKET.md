# ALERT-214 — Alert Rules page

Operators need a page to see the alert rules in their space and manage them.

## Requirements

1. **List the alert rules for the current space.** A rule belonging to another space
   must never appear in the list, under any circumstances.
2. **Mute / unmute a rule.** The toggle must feel instant, so update the UI
   optimistically — but **if the server rejects the change, the UI must roll back
   to the real state.** An operator who thinks a rule is muted when it is not will
   miss a page.
3. **Delete a rule.** Deletion is a **soft delete**: the rule stays in the database
   and remains auditable. We have to be able to answer "who turned this alarm off,
   and when" six months later.
4. Show a count of how many rules in the current space are muted.

## Notes from review
Some rules are locked by the platform team and cannot be muted by operators.
The API returns 409 for those.
