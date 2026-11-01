U-030 menu dismiss (BC-51). Phone width 375, light, from the MenuOpenMobile story.

- menu-375-light-before-open.png / after-open.png: the menu open, unchanged.
- menu-375-light-before-after-escape.png: Escape leaves the menu open (details.open = true).
- menu-375-light-after-after-escape.png: Escape closes it and the Menu button has focus (details.open = false, activeElement = SUMMARY, focus ring visible).

The outside press is covered by the unit, component, and Storybook play tests. The scripted outside-press line in the "before" run is not valid evidence: the script clicked the Menu button first, which toggled the menu closed.
