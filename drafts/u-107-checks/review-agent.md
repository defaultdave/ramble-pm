APPROVE

Round 2 review on 026718a: no blocking findings; mutation tests fail as they should (signed_out branch, next param, token kind and version, null userId); host guest-list behaviour unchanged; no argument can reach another guest orders. Later rounds changed shared row and view-model code and the cap ordering, covered by the delta architecture audit. Size: 1,098 insertions (about 600 tests and fixtures) ships as one PR by lead ruling (a split of the shared row extraction would cost Dave a second critical read for no safety gain).
