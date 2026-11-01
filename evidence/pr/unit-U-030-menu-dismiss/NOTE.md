U-030 menu dismiss (BC-51). Phone width 375, light, from the MenuOpenMobile story.

- menu-375-light-before-open.png / after-open.png: the menu open, unchanged.
- menu-375-light-before-after-escape.png: Escape leaves the menu open (details.open = true).
- menu-375-light-after-after-escape.png: Escape closes it and the Menu button has focus (details.open = false, activeElement = SUMMARY, focus ring visible).
- menu-375-light-after-outside-press.png: a press on the page outside the menu closes it (details.open = false).

There is no "before" outside-press picture: the first scripted before run clicked the Menu button first, which toggled the menu closed, so it proved nothing. The outside press is also covered by the unit, component, hook, and Storybook play tests.
