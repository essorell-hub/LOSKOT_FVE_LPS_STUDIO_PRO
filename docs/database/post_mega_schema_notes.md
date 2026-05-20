# Post-Mega Database Schema Draft

This document describes the first safe SQLite planning layer.

The schema is not a destructive migration. It is a registry and draft used for later database integration.

## Core areas

- projects
- buildings
- roof_planes
- fve_panels
- fve_strings
- inverters
- optimizers
- LPS objects
- SPD devices
- documents
- datasheets
- QA findings
- exports

## Safety

No runtime database write is introduced by this block.
