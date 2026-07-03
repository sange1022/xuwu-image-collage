# Windows Image Collage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Win10 x64 offline collage editor matching the supplied template and slider references while retaining the existing watermark tool's three-column workflow.

**Architecture:** A testable .NET core library owns normalized template geometry and export rules. A WPF app owns interaction and delegates all bitmap composition to an ImageSharp renderer using the same geometry as preview/export.

**Tech Stack:** .NET 8, WPF, C#, SixLabors.ImageSharp, xUnit, Inno Setup

---

### Task 1: Core layout model

**Files:** `src/ImageCollage.Core/*.cs`, `tests/ImageCollage.Core.Tests/*.cs`

- [ ] Write tests for aspect ratios, template cell counts, gap bounds, and pixel conversion.
- [ ] Run `dotnet test` and confirm missing core types cause failure.
- [ ] Implement immutable ratio, normalized rectangle, template catalog, and layout calculator types.
- [ ] Run the core test project and confirm all tests pass.

### Task 2: Rendering pipeline

**Files:** `src/ImageCollage.App/CollageRenderer.cs`, `src/ImageCollage.App/PhotoItem.cs`

- [ ] Add tests for export sizing and unique file naming.
- [ ] Run tests and confirm the new cases fail.
- [ ] Implement image loading, thumbnail creation, center-fill composition, rounded masks, and JPG/PNG/WebP encoding.
- [ ] Run all tests and confirm they pass.

### Task 3: WPF application

**Files:** `src/ImageCollage.App/MainWindow.xaml`, `src/ImageCollage.App/MainWindow.xaml.cs`, `src/ImageCollage.App/App.xaml`

- [ ] Build the three-column shell and confirm compiler errors identify missing handlers.
- [ ] Implement import, drag/drop, list ordering, ratio/template controls, live sliders, background selection, preview refresh, settings persistence, and export/open-folder actions.
- [ ] Compile Release and resolve all warnings and errors.

### Task 4: Packaging and handoff

**Files:** `build-windows.ps1`, `installer/ImageCollage.iss`, `README.md`

- [ ] Add self-contained win-x64 publish and optional Inno Setup packaging.
- [ ] Run tests, Release build, and win-x64 publish from a clean command.
- [ ] Check the executable and publish archive exist and record SHA-256 hashes.
- [ ] Document installation, usage, supported formats, and the Windows installer command.
