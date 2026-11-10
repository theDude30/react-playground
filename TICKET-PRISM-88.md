# PRISM-88 — Entity review queue

Analysts triage risky entities (users and hosts) from this page.

## Requirements

1. **List the entities in the current space, highest risk first.** The threshold control hides anything
   below it — an entity whose score is *exactly* the threshold is still shown.
2. **Acknowledge an entity.** Optimistic in the UI, and it must roll back if the server rejects it.
3. **Add a note.** Notes are **append-only.** An existing note must never be edited, truncated or lost —
   six months from now we have to be able to read the whole history of what analysts said.
4. **Bulk acknowledge.** Select several entities and acknowledge them in one action. Some entities are
   platform-protected and will fail. **The UI must show exactly which ones failed and leave the rest
   acknowledged.** Half-succeeded is a normal outcome, not an error.
5. **Search by name**, debounced so we don't hammer the API on every keystroke.

## Notes from review
Protected entities return 403 from the acknowledge endpoints.
