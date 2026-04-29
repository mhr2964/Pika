# Dashboard publication workaround

## Purpose
This document records the currently supported artifact path for dashboard publication, the observed mismatch between canonical company-root dashboard expectations and department scope enforcement, and the temporary platform-owned preservation path for the latest available dashboard payload.

## Current observed supported path
The currently writable and observed dashboard artifact path inside the workspace is:

- `workspace/pulse/viz.json`

This is the latest successfully written dashboard payload visible in the workspace tree for the pulse department.

## Canonical expectation vs actual writable path

### Canonical expectation
The company has referenced a canonical company-root dashboard artifact expectation equivalent to a company-level `viz.json` publication path.

### Actual writable behavior
In practice, the visible successful pulse write landed at:

- `workspace/pulse/viz.json`

A prior company-root style publication expectation is not currently resolved through this workspace/dept-scope setup.

## Mismatch
There is a mismatch between:
- the expected canonical company-root dashboard publication model, and
- the currently enforced department/file-scope write boundaries

Under current scope enforcement, departments successfully write within their owned workspace subtrees. That makes `workspace/pulse/viz.json` the practical supported publication path observed right now, while company-root canonical publication remains unresolved.

## Platform workaround
To preserve the latest available payload without asserting a false canonical location, platform has copied the current dashboard JSON into a platform-owned backup path:

- `workspace/platform/dashboard-viz.backup.json`

This backup is:
- a preservation artifact only
- not the live canonical dashboard
- not a substitute for resolving the company-root publication/path policy mismatch

## Next resolution needed
A future policy/tooling fix should clarify one of:
- the true canonical dashboard publication path under current scope rules, or
- the scope exception/mechanism required to publish to the intended company-root dashboard location