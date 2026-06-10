# Mild BD — Color System Reference

Source: `data.jsx` (Mild_BD_V2). Last synced: 2026-06-08.

---

## Pool Summary

**114 unique cosmetic hexes** across 4 groups:

| Group | Count | Lightness range | Roles |
|---|---|---|---|
| orange | 12 | L 57–82 | eyes, cheek |
| red | 48 | L 40–87 | eyes, cheek, lips |
| pink | 32 | L 40–88 | cheek, lips |
| purple | 22 | L 44–89 | eyes |

---

## Season → Sub-season Mapping

```
spring  →  Light Spring, Warm Spring, Clear Spring
summer  →  Light Summer, Cool Summer, Soft Summer
autumn  →  Soft Autumn,  Warm Autumn,  Deep Autumn
winter  →  Clear Winter, Cool Winter, Deep Winter
```

Each hex in the pool carries a `seasons[]` list. Season filter keeps only hexes where at least one sub-season matches.

---

## Role Filters (L band)

| Role | Groups allowed | L band (normal) | L band (wide fallback) | S constraint |
|---|---|---|---|---|
| eyes | orange, red, purple | 40–70 | 35–75 | — |
| cheek | orange, red, pink | 65–85 | 60–90 | s ≥ 50 (wide: s ≥ 45) |
| lips | red, pink | 38–58 | 33–63 | — |

Wide fallback activates only when fewer than 3 candidates remain after normal filter.

---

## Mood Weights

Applied after season + role filter. Multiplies each group's probability in weighted random draw. Does **not** hard-exclude any group.

| Mood | orange | red | pink | purple |
|---|---|---|---|---|
| happy | 1.5 | 1.2 | 1.0 | 0.7 |
| calm | 1.0 | 0.8 | 1.2 | 1.0 |
| cute | 0.8 | 1.0 | 1.6 | 1.0 |
| confident | 1.0 | 1.7 | 0.9 | 0.8 |
| romantic | 0.7 | 0.9 | 1.6 | 1.2 |
| fresh | 1.5 | 1.2 | 0.9 | 0.8 |
| cool | 0.5 | 0.8 | 1.0 | 1.7 |

---

## Algorithm — getLooks(season, mood, outfit)

```
1. Build seasonPool
   Filter COSMETIC_POOL where c.seasons ∩ BASE_TO_SUBS[season] ≠ ∅

2. Role split
   eyeBand   = seasonPool | group ∈ {orange,red,purple} | L 40–70
   cheekBand = seasonPool | group ∈ {orange,red,pink}   | L 65–85 & s≥50
   lipBand   = seasonPool | group ∈ {red,pink}           | L 38–58
   (widen ±5 if any band < 3 items)

3. Weighted sample — no replacement within each role
   eyePicks   = sampleN(eyeBand,   3, MOOD_WEIGHTS[mood])
   cheekPicks = sampleN(cheekBand, 3, MOOD_WEIGHTS[mood])
   lipPicks   = sampleN(lipBand,   3, MOOD_WEIGHTS[mood])

4. Build 3 look objects
   look[i] = { eyes: eyePicks[i].hex, cheek: cheekPicks[i].hex, lips: lipPicks[i].hex }

5. Outfit → card tint overlay only (OUTFIT_TINT[outfit].card)
   Outfit does NOT affect hex selection.
```

Each call is **non-deterministic** — new random each render. No seed.

---

## Outfit Tint (card overlay only)

| Outfit | Tint overlay | Accent hex |
|---|---|---|
| white | rgba(255,255,255,0.35) | #FFFFFF |
| black | rgba(30,24,22,0.20) | #1A1714 |
| colorful | rgba(255,196,163,0.18) | #FFB7A1 |
| white-color | rgba(255,210,180,0.18) | #FFD2B4 |
| black-color | rgba(80,30,60,0.16) | #7A2848 |

---

## Look Name Generation

Name = `MOOD_ADJ[mood][random]` + `GROUP_NOUN[lipGroup][random]`

| Mood adjectives | Words |
|---|---|
| happy | Sunlit, Apricot, Daylight, Honeyed, Bright, Warm, Golden |
| calm | Misty, Quiet, Haze, Soft, Still, Dew, Linen |
| cute | Sugar, Sweet, Bubbly, Dainty, Candy, Dreamy, Fluffy |
| confident | Bold, Fired, Edge, Power, Vivid, Striking, Sharp |
| romantic | Petal, Bloom, Tender, Blushed, Velvety, Satin, Wistful |
| fresh | Citrus, Dewy, Crisp, Airy, Sparkling, Zest, Clear |
| cool | Glacier, Slate, Frost, Steel, Mist, Iced, Stone |

| Group nouns | Words |
|---|---|
| orange | Tangerine, Apricot, Honey, Amber, Glow, Ember, Spice |
| red | Ember, Cherry, Sunset, Flame, Heat, Scarlet, Blaze |
| pink | Petal, Bloom, Blush, Sugar, Rose, Coral, Candy |
| purple | Iris, Plum, Violet, Twilight, Berry, Orchid, Dusk |

Uniqueness enforced within one getLooks() call. Falls back to ordinal suffix if all adj×noun combos exhausted.

---

## Story Generator

```js
depth = l < 45 ? 'deep' : l < 55 ? 'rich' : 'soft'
tone  = s < 60 ? 'dusty' : 'true'
story = `A ${depth} ${tone} mouth`
```

Based on lip hex's L and S values only.
