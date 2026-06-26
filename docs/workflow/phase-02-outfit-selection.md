# Phase 2 — Outfit Selection & Dressing

**Status:** 🟦 DESIGN (documented, not built)

## Goal
Let the user dress the **isolated subject** (from Phase 1) in outfit items chosen
from the asset library. The subject "wears" the selected garments. **Any slot left
blank → the subject keeps their original garment for that slot.**

## Input
- The isolated subject cutout from **Phase 1**.
- User outfit selections, by slot (each optional).

## Outfit library — `public/assets/outfits/`
146 PNGs across **4 slots**:

| Slot | Dir | Count | Naming |
|------|-----|-------|--------|
| Tops | `tops/` | 43 | `fit{N}_top.png` (+ a few named, e.g. `casual_black_tee.png`) |
| Bottoms | `bottoms/` | 42 | `fit{N}_btm.png` |
| Shoes | `shoes/` | 40 | `fit{N}_shoe.png` |
| Hats | `hats/` | 21 | `fit{N}_hat.png` |

**Note on `fit{N}_` naming:** the same `fit{N}` index appears across slots
(`fit0_top` + `fit0_btm` + `fit0_shoe` + `fit0_hat`), suggesting the assets were
authored as **coordinated outfit sets**. See open question 1.

## Behavior
- Selection is **per slot** and every slot is **optional**.
- Filled slot → apply that garment to the subject.
- Blank slot → leave the subject's existing garment untouched.
- All slots blank → subject is unchanged from Phase 1 (just passes through).

## Output
- A **styled subject**: the Phase 1 person now wearing the selected items
  (with un-selected slots kept as-is). This becomes the reference for the next phase.

## ✅ Decision — try-on engine: Kling Kolors Virtual Try-On
Dressing uses Kling **`kolors-virtual-try-on-v1-5`**
(`POST /v1/images/kolors-virtual-try-on`). Capture:
[`../providers/kling/captures/kolors-virtual-try-on.md`](../providers/kling/captures/kolors-virtual-try-on.md).
- `human_image` = the **Phase 1 isolated subject**; `cloth_image` = the garment.
- Base64 must be **RAW** (no `data:image/...;base64,` prefix); jpg/png, ≤10MB, ≥300px.
- Async: returns `task_id` → poll `GET /v1/images/kolors-virtual-try-on/{id}` →
  `task_result.images[].url` (purged after 30 days — save promptly).

### ⚠️ Slot coverage — important constraint
Kolors Try-On only supports **upper (tops), lower (bottoms), and dress**.
**Shoes and hats are NOT supported by this model.** Our library has all four slots,
so:
- **Tops + bottoms** → handled by try-on (see multi-garment below).
- **Shoes + hats** → need a **different mechanism** (open question 1 below).

### Multi-garment (top + bottom)
v1-5 supports a full outfit via **either**:
- (a) a **merged upper+lower** white-bg `cloth_image`, **or**
- (b) **chaining** two calls: subject → try-on top → result becomes `human_image` →
  try-on bottom. Our assets are separate per-slot PNGs, so **chaining is the natural
  fit** (verify it preserves quality). Only one garment per call; allowed combo is
  upper+lower only (no upper+upper, dress+X, etc.).

## Open questions (resolve before building)
1. **Shoes & hats mechanism.** Try-on can't apply them. Options: pass shoes/hats as
   **reference images into the Phase 4 compose/Phase 6 animate** step, use a separate
   model, prompt-describe them, or **drop shoes/hats from v1**. Decide.
2. **Mix-and-match vs. coordinated sets?** Given the `fit{N}_` numbering:
   (a) free mix, (b) one-click `fit{N}` set, or (c) both.
3. **Combine vs. chain for top+bottom** — merged white-bg image vs. two chained
   calls (leaning chain, per assets). Verify quality.
4. **Identity preservation.** Each try-on pass must preserve the performer's face/
   likeness from Phase 1 (no drift). Define a check.

## Acceptance criteria (draft)
- User can select 0–1 item per slot; tops/bottoms applied via Kling try-on, blank
  slots keep the original garment.
- Shoes/hats handled per the chosen mechanism (open question 1) or excluded in v1.
- Output is a single styled-subject image with the performer's identity preserved.

## Downstream
The styled subject feeds the next phase (to be defined).
