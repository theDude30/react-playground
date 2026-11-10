# Case detail

When an analyst decides an alert needs investigating, they open a **case**. The case collects comments
from everyone working on it, and it moves through a status workflow until it's closed.

This PR adds the case detail page: the case header, a status and assignee control, and the comment thread.

## Requirements

1. **Show the case with its comments, oldest first.** The comment count in the header must match what is
   actually displayed.
2. **Change status and assignee.** Both should feel immediate, **and both must roll back if the server
   rejects the change.**
3. **Comments are plain text.** A comment must **never** be able to affect the page it is rendered on.
4. **Deleting a comment is irreversible**, so it must be confirmed before it happens.
5. **Timestamps must be unambiguous to analysts in different timezones.**

## Notes from review
The API rejects a status transition from `closed` back to `open` — closed cases are reopened through a
different flow.
