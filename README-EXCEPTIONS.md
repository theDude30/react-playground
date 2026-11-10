# Rule exceptions

A detection rule fires on a pattern. Sometimes that pattern is legitimate for a particular host or user —
a backup agent that always reads the whole filesystem, say. Analysts add an **exception** so the rule
stops alerting for that specific case.

Exceptions are dangerous: a badly scoped one silently switches off detection.

This PR adds the exceptions list and the form to create one.

## Requirements

1. **Show the exceptions for the current space, newest first.** An **expired** exception must be visually
   distinct, and **must not** be counted in the "active" total in the header.
2. **An exception must have at least one condition.** An exception with no conditions matches everything
   and would disable the rule entirely, so **it must be impossible to save one.**
3. **Disabling an exception takes effect immediately in the list, and must roll back if the server
   rejects it.**
4. **The "applies to" list shows only rules in the current space.**
5. **Deleting an exception is permanent and must be confirmed before it happens.**

## Notes from review
The API rejects a disable on an exception that is the rule's only one — a rule with no exceptions at all
goes through a different flow.
