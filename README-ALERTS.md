# Alerts Timeline

Analysts work through security alerts here. A busy customer space produces thousands of alerts a day,
and this page is the first thing an analyst opens in the morning.

This PR adds the timeline: a filter bar, a grouped list, and expandable alert rows.

## Requirements

1. **Show the alerts for the current space, newest first.** The filter bar narrows by free-text on the
   rule name and by minimum severity.
2. **Expanding an alert shows its details. More than one alert can be open at the same time** — an
   analyst compares them side by side.
3. **Group by rule name, with a count per group.** The count must reflect what the filter is currently
   showing, not the total.
4. **The page must stay usable at 5,000 alerts.** Typing in the filter must not freeze the UI.
5. **Select alerts and mark them reviewed.** The selected count must always be accurate.

## Notes from review
The API returns every alert for the space in one response. Assume that stays true for now.
