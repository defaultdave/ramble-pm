APPROVE

Earlier review (ebefc1d) approved; the final code batches were covered by settling delta audits. Delta review of the last two test-only commits (matrix test fix after the first CI db run): no blocking findings. The exact-list assertion is intact (no category exemption), readAccountBookings is admitted by name and proven own-bookings-only for a host_staff persona by a db test, holdsRole is a pure predicate with three call sites, none a guard. Size: 2,183 insertions ships as one PR under the owner standing rule (either half alone would ship code with no caller), confirmed by the lead.
