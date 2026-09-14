# Carpooling UI prototype — ETSN05 Team 2

A clickable walkthrough of every screen the customer's assignment description asks for, plus the
flows we have already opened work items for. **Navigation and layout only.** Nothing is stored,
no backend is called, no form submits, and every number is invented.

It exists to settle what each screen contains before the PRD goes to Formal Review 1.

## Run it

Open `samak-prototype.html` in a browser. One self-contained file — no build, no
dependencies, no network.

`source/` holds the same thing split into readable files (`index.html`, `css/app.css`,
`js/*.js`) for editing. Open `source/index.html` to run that version. Rebuild the single
file after editing, or just keep working in `source/` and share that folder instead.

To serve it on the LTH wifi instead:

```
python3 -m http.server 8000
```

## What's in it

22 screens, grouped by actor and listed on the start page:

| Group | Screens |
|---|---|
| Prototype | Screen index, draft requirements |
| Account | Create account, sign in, sign in with rejected input |
| Passenger | Find a ride, matching rides, no matches, ride detail & booking, booking conflict, my bookings, cancel a booking, notifications, profile & role |
| Driver | Dashboard, publish a ride, booking requests, trip detail & manifest, cancel a ride |
| Administrator | Users, add user, user detail |

Three controls in the top bar:

- **View as** — jump to the landing screen for passenger, driver or administrator.
- **Requirements** — overlay a panel on every screen listing the draft requirement ids it covers
  and linking the CourseGit work items it belongs to. Off by default so a walkthrough stays about
  the screens.
- **Theme** — light/dark. Both are designed; use whichever the projector handles better.

## The position it takes

The customer left several questions open and asked us to propose answers. The prototype proposes
one in particular, because everything else depends on it:

> Every location sits on an ordered **corridor**. A ride covers a contiguous run of one corridor,
> and a passenger's leg is a contiguous run of the ride. That is the whole matching rule, and it is
> what makes "which locations lie between which" decidable.

That assumption draws the route diagram on every ride screen. It also has a known hole: a journey
that crosses two corridors — Lomma to Ystad — matches nothing. Either the model becomes a graph, or
the PRD states that only single-corridor journeys are supported. **That is a team decision, not a
decision the prototype gets to make.**

Other decisions the screens deliberately expose rather than hide:

- One sign-in for everybody, role decides the landing page (work item #43 implies a driver-only sign-in).
- Seats are counted **per segment**, not per ride — two passengers on different legs do not compete
  for the same seat.
- Administrators get a *suspend* action alongside *remove*, because removing someone with upcoming
  bookings destroys another person's trip. Suspension is not in the customer's description; it is a
  proposal.
- Six notification types, six destinations, listed as a table on the notifications screen — work
  item #34 only works if that set is closed.

Each of these is marked in the interface in a callout, so nobody has to take my word for what is
decided and what is not.

## Known gaps — deliberately left open

Listed at the bottom of the draft requirements screen: how a time is specified (exact or window),
how the location list is maintained, what a driver may see about a passenger before accepting, what
happens to bookings when a driver edits a published route, whether recurring commutes are one ride
or many, and the cancellation cut-off.

## Files

```
samak-prototype.html      everything inlined; this is the file to open or share
README.md                 this file
source/index.html         shell: top bar, rail navigation, mount point
source/css/app.css        all styling; tokens first, light and dark
source/js/data.js         mock rides, bookings, users, notifications, draft requirements
source/js/components.js   shared renderers — route diagram, ride card, requirement panel
source/js/views-*.js      one file per actor group
source/js/app.js          router and top-bar wiring
```

Navigation is driven by an internal path variable rather than `location.hash`. Embedded in a
sandboxed frame the hash is not always writable, and a router that reads it stops navigating
silently. The hash is still kept in sync where the host allows it, so deep links and the back
button work where they can.

## About the stack

The real system uses the BASE stack — Jetty, Jersey, H2 and **Bootstrap**. This prototype has its
own standalone stylesheet instead, so it runs from a file with no network and no build. When the
layouts move into the real client, the mapping is direct:

| Prototype | Bootstrap 5 |
|---|---|
| `.grid-2` | `.row` + `.col-md-6` |
| `.panel` | `.card` / `.card-body` |
| `.btn-primary`, `.btn-secondary` | same names |
| `.chip` | `.badge rounded-pill` |
| `table.data` | `.table` |
| `.callout` | `.alert` |
| `.field`, `.input` | `.mb-3`, `.form-label`, `.form-control` |

The route corridor diagram has no Bootstrap equivalent and carries over as-is.

Fonts load from Google Fonts when there is a connection and fall back to system faces when there
is not — the layout does not depend on them.
