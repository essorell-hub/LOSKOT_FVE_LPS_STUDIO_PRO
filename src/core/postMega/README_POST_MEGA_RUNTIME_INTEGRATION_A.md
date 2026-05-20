# POST-MEGA RUNTIME INTEGRATION A

This folder contains the first guarded runtime integration adapter.

## Purpose

- Provide a single neutral project model shape.
- Keep Classic PRO visual layout unchanged.
- Keep CAD/MAPA core untouched in this block.
- Prepare one safe data contract for UI, CAD/MAPA, FVE, LPS, documents and later SQLite.

## Files

- projectModelAdapter.mjs
- projectModelAdapter.smoke.mjs

## Current integration level

This block creates the adapter and verifies it.
The next block should import the adapter into the UI shell carefully, without redesigning the approved Classic PRO / V3 graphics.

## Safety

- No package.json change.
- No package-lock.json change.
- No commit.
- No merge.
- No push.
