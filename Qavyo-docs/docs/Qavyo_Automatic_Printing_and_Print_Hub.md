# Qavyo Automatic Printing And Print Hub

> Last updated: 2026-09-18
> Detailed implementation roadmap: `../../printer-plan.md`

## Goal

Qavyo must automatically print website and POS orders to branch printers without
making the browser POS talk directly to hardware.

Supported routing targets:

1. Grill printer.
2. Fryer printer.
3. Drinks printer.
4. Packing / expedite printer.
5. POS receipt printer per terminal.

Routing must support both models:

1. A station has its own printer.
2. Multiple stations share one printer, producing one grouped ticket with
   station sections instead of duplicate tickets.

## Architecture Decision

Printing is a backend job queue plus native print hub.

```text
POS / Customer Website
  -> Qavyo-Server creates PrintJob rows
  -> Qavyo-print-hub claims jobs
  -> native hub sends ESC/POS bytes to printers
```

The browser POS is not the printer driver because browsers cannot reliably open
raw TCP sockets, Bluetooth Classic SPP, or USB printer connections. Native code
owns printer I/O.

## Current Repositories

| Repository | Responsibility | Status |
| --- | --- | --- |
| `Qavyo-Server` | Print schema, printer setup API, print job creation, hub claim/report API | Partial in code |
| `Qavyo-print-hub` | Flutter/Dart package for polling, claiming, rendering, and sending tickets | Partial in code |
| `Qavyo-POS` | Existing browser POS that triggers orders/payments | In code; not a printer driver |
| `Qavyo-Customer-Website` | Customer order source | In code; not a printer driver |
| Future Hub App | Android wrapper around `Qavyo-print-hub` | Required |
| Future Flutter POS | Embeds `qavyo_print_hub` for offline printing later | Future |

## Server Model

Branch print data lives in the branch database:

1. `PrintAgent` - paired device acting as print hub.
2. `PrintAgentPairingCode` - short expiring code redeemed once by a hub.
3. `Printer` - network or Bluetooth thermal printer.
4. `PrintRoute` - maps station, expedite, or receipt documents to printers.
5. `PrintJob` - immutable print payload plus claim/retry/expiry status.

Important rules:

1. `NETWORK` printers may be claimed by any online branch hub.
2. `BLUETOOTH` printers must be bound to the specific hub that owns the pairing.
3. Print jobs need idempotency keys to prevent duplicate printing.
4. Claimed jobs need a lease so a crashed hub does not hold work forever.
5. Jobs need expiry so stale tickets do not print hours late.
6. Printed, failed, expired, retry, and reprint flows must remain auditable.

## API Surfaces

Authenticated branch printer administration:

```text
/api/v1/branches/:branchId/printing
```

Hub device surface:

```text
/api/v1/print-hub/:branchId
```

Hub calls use `X-Print-Agent-Token`; this is a device token, not a user session.

## Job Creation Events

Create print jobs after the order or payment commit:

1. Website/customer order accepted -> kitchen tickets.
2. POS order sent to kitchen -> kitchen tickets.
3. POS payment completed -> receipt for that terminal's receipt route.
4. Online payment completed -> branch default receipt route when enabled.
5. Order changed after kitchen print -> update ticket for changed items.
6. Order voided/cancelled after kitchen print -> void ticket to the same kitchen flow.

Order creation and payment must never fail because printing failed.

## Flutter Hub Package

`Qavyo-print-hub` should stay free of POS imports and app UI state.

Responsibilities:

1. Pair a device and store the hub token through the app wrapper.
2. Poll REST endpoints and claim jobs.
3. Render immutable payloads into ESC/POS bytes.
4. Send bytes through a selected transport.
5. Report `PRINTED` or `FAILED`.
6. Poll printer status when supported.

Current package pieces:

1. `HubApi` REST client.
2. `HubEngine` polling/claim/report loop.
3. `TicketRenderer` and ESC/POS helpers.
4. `NetworkPrinterTransport`.
5. Transport registry and wire models.

Required next pieces:

1. Android app wrapper.
2. Secure credential storage implementation.
3. Foreground service with persistent notification.
4. Bluetooth Classic SPP transport.
5. Pairing/setup UI.
6. Printer discovery/test-print UI.

## Deferred

USB printing is deferred until the native hub/app layer is ready enough to own
USB permissions and device I/O safely.
