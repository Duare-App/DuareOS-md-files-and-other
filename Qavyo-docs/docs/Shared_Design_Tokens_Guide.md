# Qavyo App-Local Design Tokens Guide

Use this guide when building or updating any Qavyo app: Inventory, Customer
Website, POS, Admin, KDS, Staff Portal, or future mobile apps.

## Current Decision

Qavyo should keep UI primitives, tokens, wrappers, and design-system CSS local
to each app.

Do not wire root-level shared UI aliases.

## Current Code Shape

- `Qavyo-Inventory` has local token/UI files:
  - `src/qavyo-tokens.css`
  - `src/qavyo-ui.css`
  - `src/components/qavyo-ui/`
- `Qavyo-Customer-Website` has local Qavyo admin UI files:
  - `src/app/qavyo-ui.css`
  - `src/components/qavyo-ui/`
- Other apps should follow their existing local component/style patterns until
  they are intentionally updated.

## Rule

When an app needs Qavyo design tokens or admin primitives, copy or implement the
needed pattern inside that app. Keep workflow-specific components inside the app
that owns the workflow.

Do not create another root-level shared UI architecture unless the owner
explicitly re-approves it.

## Token Principles

Use semantic Qavyo values instead of one-off hardcoded colours and spacing.
When adding local CSS tokens, prefer names like:

| Use | Suggested local token |
|---|---|
| Main Qavyo action | `--qv-color-primary-500` |
| Hovered main action | `--qv-color-primary-600` |
| App background | `--qv-color-surface-muted` |
| Standard border | `--qv-color-border` |
| Main text | `--qv-color-text` |
| Muted text | `--qv-color-text-muted` |
| Standard panel radius | `--qv-radius-md` |
| Standard panel shadow | `--qv-shadow-card` |
| Standard font | `--qv-font-sans` |

Example local app CSS:

```css
.panel {
  background: rgb(var(--qv-color-surface));
  border: 1px solid rgb(var(--qv-color-border));
  border-radius: var(--qv-radius-md);
  box-shadow: var(--qv-shadow-card);
  padding: var(--qv-space-5);
}

.primary-action {
  background: rgb(var(--qv-color-primary-500));
  color: white;
}

.primary-action:hover {
  background: rgb(var(--qv-color-primary-600));
}
```

## What To Keep Local

- Buttons, inputs, selects, badges, alerts, modals, and empty states.
- Feature-lock UI and entitlement labels.
- POS order-taking screens.
- KDS kitchen queue.
- Public website themes and homepage sections.
- Inventory purchase flow.
- Authentication and route logic.
- App-specific state stores.

## Rules

1. Do not copy random raw colours into a new screen.
2. Do not add root package aliases for UI or tokens.
3. Customer-facing restaurant/storefront branding can vary by tenant.
4. Qavyo-owned admin tools should stay visually consistent, even when the
   implementation is app-local.
5. If a design pattern needs to be reused, copy the pattern deliberately and
   document it in the app or `context/ui-registry.md`.

## Current Status

- Root-level shared UI is no longer the active direction.
- Inventory and Customer Website currently keep Qavyo UI/token code locally.
- The next adoption target is Qavyo Admin, but implementation should be local to
  `Qavyo-admin`, not a root package.
