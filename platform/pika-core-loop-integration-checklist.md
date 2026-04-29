# Pika core loop integration checklist

**Last audited:** Round 3 — workspace tree, backend/frontend manifests, env config, routes, storage  
**Status:** ✅ Ready for engineering relaunch — no hard blockers

---

## 1. Backend run expectations

### Express app structure
- **Location:** `workspace/backend/`
- **Entry point:** `backend/src/index.js`
- **App definition:** `backend/src/app.js`
- **Framework:** Express.js
- **TypeScript:** No (plain JavaScript)

### Expected startup