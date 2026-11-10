# Entity risk detail

An analyst clicks an entity and lands here: its current risk score, how that score has moved over the
last month, and the alerts contributing to it. They can also change the entity's **asset criticality**,
which re-scores it.

This PR adds the page.

## Requirements

1. **Show the current score and the last 30 days of history.** The history must **always cover the full
   30 days**, even on days with no data — a gap must read as zero, not as missing.
2. **The score refreshes automatically every 30 seconds while the page is open, and must stop when it
   isn't.**
3. **Selecting a different entity shows that entity's data — never a mix of the two.**
4. **The contributing alerts load after the score. A failure to load the alerts must not hide the score.**
5. **Changing asset criticality re-scores immediately, and the score shown must match what the server
   returns** — not a locally guessed value.

## Notes from review
The criticality endpoint is slow (~1.5s) because it triggers a real recalculation.
The alerts endpoint fails roughly one call in three. That is deliberate and it is staying that way.
