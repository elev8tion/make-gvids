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

## Open questions (resolve before building)
1. **Mix-and-match vs. coordinated sets?** Given the `fit{N}_` numbering, do we:
   - (a) let users freely mix any item in any slot,
   - (b) offer one-click coordinated "fits" (select `fit{N}` → fills all slots), or
   - (c) both (pick a fit, then tweak individual slots)?
2. **How is dressing performed?** This is a **virtual try-on / garment-transfer**
   task. Candidate capability: Kling **virtual-try-on**
   (`../providers/kling/source/03-image/09-virtual-try-on.md`); fal/Eachlabs also
   host try-on models. Decide provider per `../providers/README.md`.
3. **Multi-garment application order.** Most try-on models handle one garment
   category at a time → likely a **chained** apply (top → bottom → shoes → hat),
   each step feeding the next. Confirm whether the chosen model supports multiple
   garments in one pass.
4. **Slot coverage.** Try-on models are typically strongest on tops/bottoms
   (torso clothing). **Hats and shoes** may need a different model or technique —
   flag and verify the chosen provider actually supports those slots.
5. **Identity preservation.** Each try-on pass must preserve the performer's face
   and likeness from Phase 1 (no drift). Define a check.

## Acceptance criteria (draft)
- User can select 0–1 item per slot (top, bottom, shoes, hat).
- Filled slots are applied to the subject; blank slots keep the original garment.
- Output is a single styled-subject image with the performer's identity preserved.

## Downstream
The styled subject feeds the next phase (to be defined).
