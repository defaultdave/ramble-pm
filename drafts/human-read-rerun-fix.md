# human-read: a failed push-time run blocks the merge after the owner approves

## What happens
`.github/workflows/human-read.yml` runs on two events, and each event's run reports its own `human-read` check:
- `pull_request_target` (on `synchronize`, so on every push). On a critical PR it fails, because no approval of the new head exists yet.
- `pull_request_review` (on `submitted`). After Dave approves the head, it passes.

The `main` ruleset requires `human-read`, so the PR stays `BLOCKED` even though the newer run passed. Seen on PR 954 at three heads (`ba1018c`, `0087643`, `2e16b6c`). Re-running the failed `pull_request_target` run (`gh run rerun 43135767336 --failed`) turned the PR `CLEAN` within a minute, which confirms the cause.

## Proposed fix (protected path, so it's Dave's change)
When the review-event run passes, have it re-run the failed push-time run for the same head. Add this to the `human-read` job in `.github/workflows/human-read.yml`:

```yaml
permissions:
  contents: read
  pull-requests: read
  actions: write          # new: lets the review run re-run the push-time run
...
      - name: Critical tier waits for the owner's approval of this head
        # (unchanged)
      - name: Re-run the push-time check now that this head is approved
        if: github.event_name == 'pull_request_review' && success()
        env:
          GH_TOKEN: ${{ github.token }}
          HEAD_SHA: ${{ github.event.pull_request.head.sha }}
        run: |
          gh run list --repo "$GITHUB_REPOSITORY" --workflow human-read.yml --commit "$HEAD_SHA" \
            --event pull_request_target --json databaseId,conclusion \
            --jq '.[] | select(.conclusion == "failure") | .databaseId' |
          while read -r id; do gh run rerun "$id" --repo "$GITHUB_REPOSITORY" --failed; done
```

The re-run checks out the base commit, as before, and reads the reviews live, so it passes only if Dave's approval of that head is still standing. No agent can pass it.

## Until it lands
When a critical PR is approved and still `BLOCKED` with only `human-read` failing, the lead re-runs the failed `pull_request_target` run. That's a check re-run, not a bypass.
