# Web Image Collage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a faithful browser version of the Windows collage editor on GitHub Pages.

**Architecture:** React owns application state and responsive controls. Pure geometry helpers calculate templates and cover crops; a single Canvas renderer is reused for preview and downloads.

**Tech Stack:** React 19, Vite, Canvas 2D, Vitest, GitHub Actions/Pages

---

### Task 1: Geometry and tests

- [ ] Add failing tests for ratio sizes, template cell counts, gap layout, and focus-aware cover crops.
- [ ] Implement pure geometry and template catalog modules.
- [ ] Run Vitest until all geometry tests pass.

### Task 2: Canvas renderer

- [ ] Implement image loading, smooth rounded clipping, center-fill crops, focus offsets, preview rendering, and Blob export.
- [ ] Ensure preview and export call the same renderer.

### Task 3: React editor

- [ ] Implement the three-column app shell, file drop/import, thumbnails, selection and ordering.
- [ ] Implement ratio/template controls, position pad, gap/radius/background, size/format, and download.
- [ ] Add desktop and mobile responsive layouts with accessible controls.

### Task 4: Verification and publishing

- [ ] Run tests and production build.
- [ ] Test import, settings, position movement, and download in the in-app browser at desktop and mobile sizes.
- [ ] Compare implementation screenshot with the accepted concept using `view_image`.
- [ ] Create a public GitHub repository, configure Pages deployment, push, and verify the public URL.
