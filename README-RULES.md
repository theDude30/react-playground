# Detection Rule Editor

Security engineers author and tune **detection rules** here. A rule describes a condition over incoming
data; when it matches, an alert is raised with the rule's severity and risk score.

This PR adds the editor: a list of rules on the left, a form on the right.

## Requirements

1. **Create and edit a rule.** Opening a rule for editing shows that rule's current values. **Switching
   to a different rule must never carry the previous rule's edits into the new form.**
2. **Validate as the engineer works.** `name` is required. `riskScore` must be between 0 and 100
   **inclusive**. **Each error appears next to the field it belongs to, as soon as the engineer leaves
   that field** — not only when they press Save.
3. **Never lose unsaved work silently.** If the form has unsaved changes, warn before it is discarded.
4. **Save exactly once.** While a save is in flight the engineer must not be able to submit again.
5. **Accessible and translated.** The page must be operable by keyboard and comprehensible to a screen
   reader, and **all user-facing text must go through the i18n helper** (`src/exercises/rule-editor/i18n.ts`).

## Notes from review
The API rejects a rule whose `query` is empty.
