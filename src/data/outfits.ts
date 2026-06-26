// AUTO-DERIVED from public/assets/outfits/<slot>/*.png (Phase 2 outfit library).
// Each item: { id (filename stem), slot, url (served path) }.
// Regenerate by re-listing the asset dirs if files are added/removed.

import type { OutfitSelection } from '../types/pipeline';

/** Logical garment slots, 1:1 with the four OutfitSelection ids. */
export type OutfitSlot = 'top' | 'bottom' | 'shoe' | 'hat';

/** A single selectable garment asset. */
export interface OutfitItem {
  /** Filename stem, e.g. `fit3_top`. Stored in OutfitSelection.<slot>Id. */
  id: string;
  slot: OutfitSlot;
  /** Public URL, e.g. `/assets/outfits/tops/fit3_top.png`. */
  url: string;
}

export const TOPS: OutfitItem[] = [
  { id: "fit0_top", slot: "top", url: "/assets/outfits/tops/fit0_top.png" },
  { id: "fit1_top", slot: "top", url: "/assets/outfits/tops/fit1_top.png" },
  { id: "fit2_top", slot: "top", url: "/assets/outfits/tops/fit2_top.png" },
  { id: "fit3_top", slot: "top", url: "/assets/outfits/tops/fit3_top.png" },
  { id: "fit4_top", slot: "top", url: "/assets/outfits/tops/fit4_top.png" },
  { id: "fit5_top", slot: "top", url: "/assets/outfits/tops/fit5_top.png" },
  { id: "fit6_top", slot: "top", url: "/assets/outfits/tops/fit6_top.png" },
  { id: "fit7_top", slot: "top", url: "/assets/outfits/tops/fit7_top.png" },
  { id: "fit8_top", slot: "top", url: "/assets/outfits/tops/fit8_top.png" },
  { id: "fit9_top", slot: "top", url: "/assets/outfits/tops/fit9_top.png" },
  { id: "fit10_top", slot: "top", url: "/assets/outfits/tops/fit10_top.png" },
  { id: "fit11_top", slot: "top", url: "/assets/outfits/tops/fit11_top.png" },
  { id: "fit12_top", slot: "top", url: "/assets/outfits/tops/fit12_top.png" },
  { id: "fit13_top", slot: "top", url: "/assets/outfits/tops/fit13_top.png" },
  { id: "fit14_top", slot: "top", url: "/assets/outfits/tops/fit14_top.png" },
  { id: "fit15_top", slot: "top", url: "/assets/outfits/tops/fit15_top.png" },
  { id: "fit16_top", slot: "top", url: "/assets/outfits/tops/fit16_top.png" },
  { id: "fit17_top", slot: "top", url: "/assets/outfits/tops/fit17_top.png" },
  { id: "fit18_top", slot: "top", url: "/assets/outfits/tops/fit18_top.png" },
  { id: "fit19_top", slot: "top", url: "/assets/outfits/tops/fit19_top.png" },
  { id: "fit20_top", slot: "top", url: "/assets/outfits/tops/fit20_top.png" },
  { id: "fit21_top", slot: "top", url: "/assets/outfits/tops/fit21_top.png" },
  { id: "fit22_top", slot: "top", url: "/assets/outfits/tops/fit22_top.png" },
  { id: "fit23_top", slot: "top", url: "/assets/outfits/tops/fit23_top.png" },
  { id: "fit24_top", slot: "top", url: "/assets/outfits/tops/fit24_top.png" },
  { id: "fit25_top", slot: "top", url: "/assets/outfits/tops/fit25_top.png" },
  { id: "fit26_top", slot: "top", url: "/assets/outfits/tops/fit26_top.png" },
  { id: "fit27_top", slot: "top", url: "/assets/outfits/tops/fit27_top.png" },
  { id: "fit28_top", slot: "top", url: "/assets/outfits/tops/fit28_top.png" },
  { id: "fit29_top", slot: "top", url: "/assets/outfits/tops/fit29_top.png" },
  { id: "fit30_top", slot: "top", url: "/assets/outfits/tops/fit30_top.png" },
  { id: "fit31_top", slot: "top", url: "/assets/outfits/tops/fit31_top.png" },
  { id: "fit32_top", slot: "top", url: "/assets/outfits/tops/fit32_top.png" },
  { id: "fit33_top", slot: "top", url: "/assets/outfits/tops/fit33_top.png" },
  { id: "fit34_top", slot: "top", url: "/assets/outfits/tops/fit34_top.png" },
  { id: "fit35_top", slot: "top", url: "/assets/outfits/tops/fit35_top.png" },
  { id: "fit36_top", slot: "top", url: "/assets/outfits/tops/fit36_top.png" },
  { id: "fit37_top", slot: "top", url: "/assets/outfits/tops/fit37_top.png" },
  { id: "fit38_top", slot: "top", url: "/assets/outfits/tops/fit38_top.png" },
  { id: "fit39_top", slot: "top", url: "/assets/outfits/tops/fit39_top.png" },
  { id: "fit40_top", slot: "top", url: "/assets/outfits/tops/fit40_top.png" },
  { id: "fit41_top", slot: "top", url: "/assets/outfits/tops/fit41_top.png" },
  { id: "casual_black_tee", slot: "top", url: "/assets/outfits/tops/casual_black_tee.png" },
];

export const BOTTOMS: OutfitItem[] = [
  { id: "fit0_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit0_btm.png" },
  { id: "fit1_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit1_btm.png" },
  { id: "fit2_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit2_btm.png" },
  { id: "fit3_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit3_btm.png" },
  { id: "fit4_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit4_btm.png" },
  { id: "fit5_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit5_btm.png" },
  { id: "fit6_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit6_btm.png" },
  { id: "fit7_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit7_btm.png" },
  { id: "fit8_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit8_btm.png" },
  { id: "fit9_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit9_btm.png" },
  { id: "fit10_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit10_btm.png" },
  { id: "fit11_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit11_btm.png" },
  { id: "fit12_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit12_btm.png" },
  { id: "fit13_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit13_btm.png" },
  { id: "fit14_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit14_btm.png" },
  { id: "fit15_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit15_btm.png" },
  { id: "fit16_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit16_btm.png" },
  { id: "fit17_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit17_btm.png" },
  { id: "fit18_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit18_btm.png" },
  { id: "fit19_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit19_btm.png" },
  { id: "fit20_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit20_btm.png" },
  { id: "fit21_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit21_btm.png" },
  { id: "fit22_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit22_btm.png" },
  { id: "fit23_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit23_btm.png" },
  { id: "fit24_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit24_btm.png" },
  { id: "fit25_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit25_btm.png" },
  { id: "fit26_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit26_btm.png" },
  { id: "fit27_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit27_btm.png" },
  { id: "fit28_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit28_btm.png" },
  { id: "fit29_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit29_btm.png" },
  { id: "fit30_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit30_btm.png" },
  { id: "fit31_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit31_btm.png" },
  { id: "fit32_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit32_btm.png" },
  { id: "fit33_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit33_btm.png" },
  { id: "fit34_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit34_btm.png" },
  { id: "fit35_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit35_btm.png" },
  { id: "fit36_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit36_btm.png" },
  { id: "fit37_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit37_btm.png" },
  { id: "fit38_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit38_btm.png" },
  { id: "fit39_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit39_btm.png" },
  { id: "fit40_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit40_btm.png" },
  { id: "fit41_btm", slot: "bottom", url: "/assets/outfits/bottoms/fit41_btm.png" },
];

export const SHOES: OutfitItem[] = [
  { id: "fit0_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit0_shoe.png" },
  { id: "fit1_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit1_shoe.png" },
  { id: "fit2_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit2_shoe.png" },
  { id: "fit3_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit3_shoe.png" },
  { id: "fit4_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit4_shoe.png" },
  { id: "fit5_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit5_shoe.png" },
  { id: "fit6_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit6_shoe.png" },
  { id: "fit7_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit7_shoe.png" },
  { id: "fit9_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit9_shoe.png" },
  { id: "fit10_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit10_shoe.png" },
  { id: "fit11_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit11_shoe.png" },
  { id: "fit12_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit12_shoe.png" },
  { id: "fit13_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit13_shoe.png" },
  { id: "fit14_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit14_shoe.png" },
  { id: "fit15_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit15_shoe.png" },
  { id: "fit16_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit16_shoe.png" },
  { id: "fit17_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit17_shoe.png" },
  { id: "fit18_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit18_shoe.png" },
  { id: "fit19_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit19_shoe.png" },
  { id: "fit20_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit20_shoe.png" },
  { id: "fit21_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit21_shoe.png" },
  { id: "fit22_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit22_shoe.png" },
  { id: "fit23_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit23_shoe.png" },
  { id: "fit24_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit24_shoe.png" },
  { id: "fit25_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit25_shoe.png" },
  { id: "fit26_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit26_shoe.png" },
  { id: "fit27_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit27_shoe.png" },
  { id: "fit28_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit28_shoe.png" },
  { id: "fit29_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit29_shoe.png" },
  { id: "fit30_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit30_shoe.png" },
  { id: "fit31_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit31_shoe.png" },
  { id: "fit33_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit33_shoe.png" },
  { id: "fit34_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit34_shoe.png" },
  { id: "fit35_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit35_shoe.png" },
  { id: "fit36_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit36_shoe.png" },
  { id: "fit37_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit37_shoe.png" },
  { id: "fit38_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit38_shoe.png" },
  { id: "fit39_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit39_shoe.png" },
  { id: "fit40_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit40_shoe.png" },
  { id: "fit41_shoe", slot: "shoe", url: "/assets/outfits/shoes/fit41_shoe.png" },
];

export const HATS: OutfitItem[] = [
  { id: "fit0_hat", slot: "hat", url: "/assets/outfits/hats/fit0_hat.png" },
  { id: "fit1_hat", slot: "hat", url: "/assets/outfits/hats/fit1_hat.png" },
  { id: "fit4_hat", slot: "hat", url: "/assets/outfits/hats/fit4_hat.png" },
  { id: "fit5_hat", slot: "hat", url: "/assets/outfits/hats/fit5_hat.png" },
  { id: "fit7_hat", slot: "hat", url: "/assets/outfits/hats/fit7_hat.png" },
  { id: "fit8_hat", slot: "hat", url: "/assets/outfits/hats/fit8_hat.png" },
  { id: "fit11_hat", slot: "hat", url: "/assets/outfits/hats/fit11_hat.png" },
  { id: "fit15_hat", slot: "hat", url: "/assets/outfits/hats/fit15_hat.png" },
  { id: "fit16_hat", slot: "hat", url: "/assets/outfits/hats/fit16_hat.png" },
  { id: "fit20_hat", slot: "hat", url: "/assets/outfits/hats/fit20_hat.png" },
  { id: "fit24_hat", slot: "hat", url: "/assets/outfits/hats/fit24_hat.png" },
  { id: "fit27_hat", slot: "hat", url: "/assets/outfits/hats/fit27_hat.png" },
  { id: "fit29_hat", slot: "hat", url: "/assets/outfits/hats/fit29_hat.png" },
  { id: "fit30_hat", slot: "hat", url: "/assets/outfits/hats/fit30_hat.png" },
  { id: "fit31_hat", slot: "hat", url: "/assets/outfits/hats/fit31_hat.png" },
  { id: "fit33_hat", slot: "hat", url: "/assets/outfits/hats/fit33_hat.png" },
  { id: "fit34_hat", slot: "hat", url: "/assets/outfits/hats/fit34_hat.png" },
  { id: "fit38_hat", slot: "hat", url: "/assets/outfits/hats/fit38_hat.png" },
  { id: "fit39_hat", slot: "hat", url: "/assets/outfits/hats/fit39_hat.png" },
  { id: "fit40_hat", slot: "hat", url: "/assets/outfits/hats/fit40_hat.png" },
  { id: "fit41_hat", slot: "hat", url: "/assets/outfits/hats/fit41_hat.png" },
];

/** Slot metadata for rendering the four pickers in order. */
export interface SlotMeta {
  slot: OutfitSlot;
  /** Plural display label. */
  label: string;
  /** The matching OutfitSelection key. */
  field: keyof OutfitSelection;
  items: OutfitItem[];
  /** Try-on support is experimental for this slot (shoes/hats). */
  experimental: boolean;
}

export const SLOTS: SlotMeta[] = [
  { slot: 'top',    label: 'Tops',    field: 'topId',    items: TOPS,    experimental: false },
  { slot: 'bottom', label: 'Bottoms', field: 'bottomId', items: BOTTOMS, experimental: false },
  { slot: 'shoe',   label: 'Shoes',   field: 'shoeId',   items: SHOES,   experimental: true  },
  { slot: 'hat',    label: 'Hats',    field: 'hatId',    items: HATS,    experimental: true  },
];

/** Look up an item by id within a slot (for thumbnails / summaries). */
export function findItem(slot: OutfitSlot, id: string | undefined): OutfitItem | undefined {
  if (!id) return undefined;
  const list = slot === 'top' ? TOPS : slot === 'bottom' ? BOTTOMS : slot === 'shoe' ? SHOES : HATS;
  return list.find((i) => i.id === id);
}

/**
 * A coordinated `fit{N}` set — the same numbered look across every slot it
 * exists in. Powers the one-click "Coordinated fits" row.
 */
export interface CoordinatedFit {
  /** The numeric index, e.g. 3 for `fit3_*`. */
  n: number;
  topId?: string;
  bottomId?: string;
  shoeId?: string;
  hatId?: string;
  /** First available thumbnail url (top preferred) for the set tile. */
  preview: string;
  /** How many of the four slots this set covers. */
  count: number;
}

const FIT_RE = /^fit(\d+)_/;

/** Group all `fit{N}` assets across slots into coordinated outfit sets. */
export function buildCoordinatedFits(): CoordinatedFit[] {
  const byN = new Map<number, CoordinatedFit>();
  const add = (items: OutfitItem[], key: 'topId' | 'bottomId' | 'shoeId' | 'hatId') => {
    for (const item of items) {
      const m = item.id.match(FIT_RE);
      if (!m) continue;
      const n = parseInt(m[1], 10);
      let fit = byN.get(n);
      if (!fit) {
        fit = { n, preview: item.url, count: 0 };
        byN.set(n, fit);
      }
      fit[key] = item.id;
      fit.count += 1;
    }
  };
  add(TOPS, 'topId');
  add(BOTTOMS, 'bottomId');
  add(SHOES, 'shoeId');
  add(HATS, 'hatId');
  // Prefer the top thumbnail as the set preview when present.
  for (const fit of byN.values()) {
    const top = fit.topId && findItem('top', fit.topId);
    if (top) fit.preview = top.url;
  }
  return Array.from(byN.values()).sort((a, b) => a.n - b.n);
}

/** Pre-computed coordinated sets (sorted by index). */
export const COORDINATED_FITS: CoordinatedFit[] = buildCoordinatedFits();
