PASS

## review-agent: U-030 "one PageError for the home and experience error states, and one retry width" (head 4e13d94, round 2)

### Blocking
None.

### Non-blocking
- `src/components/PageHeading.module.css:34-42`: the new `.page > form:has(> button:only-child)` rule needs `:has()`. With no browserslist, Next 16's defaults apply (Chrome 111, Safari 16.4, Firefox 111); Firefox 111 to 120 lacks `:has()`, drops the rule, and renders the retry at label width at every viewport. Still visible and submits; only the full-width phone layout is lost there. Graceful. (PM: logged as H-103, accepted.)
- No test shows the form case in PageHeading (jsdom has no layout; the brief made it optional); PageError's DOM tests cover the markup.

### Checks run
- Other PageHeading callers: none has a lone-button form. The ops mailbox unlock form has a label, input, optional error and button, so the rule does not match; the message page, checkout demo, ErrorNotice, NotFoundNotice and RoutePlaceholder have no form.
- PageError tests still cover action and method (two hrefs), `type="submit"`, the label, order (form after the alert, not inside it), and one h1.
- Markup: `<header><h1/><Alert/><form><Button/></form></header>`; PageHeading.tsx unchanged; ErrorNotice already places error content there; the selectors reach direct children only.
- Full diff swept again: no ticket comments, no logging, no data-layer change, no new duplication.
