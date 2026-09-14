# Carpooling UI prototype — ETSN05 Team 2

A clickable walkthrough of the main passenger and driver flows for the carpooling
system. **Navigation and layout only.** Nothing is stored, no backend is called,
no form submits, and every name and number is invented.

It exists to settle what each screen contains before the PRD goes to Formal Review 1.

## Run it

Open `index.html` in a browser. One self-contained file — no build, no dependencies.

Hosted at <https://mackemacke.github.io/etsn05-carpool-prototype/>; every push to
`main` republishes it.

## Screens

Twelve, listed on the start page.

| Group | Screens |
|---|---|
| Passenger | Sign in, create account, find a ride, matching rides, ride detail, my bookings, notifications |
| Driver | My trips, publish a ride, booking requests, trip & passengers |

## The one position it takes

Locations sit on an ordered route, and a passenger's leg is a contiguous run of it.
That is what makes "which locations lie between which" decidable, and it is what the
route line on every ride screen draws. Reject that assumption and the search results
and the driver's pickup list both change shape.

Known hole: a trip crossing two routes — Lomma to Ystad — matches nothing. Either the
model becomes a graph, or the PRD says only single-route journeys are supported.

## About the stack

The real system uses the BASE stack — Jetty, Jersey, H2 and Bootstrap. This prototype
has its own small stylesheet so it runs from a file with no network. The layouts map
onto Bootstrap directly: `.card` to `.card`, `.two` to `.row`/`.col-md-6`, `.tag` to
`.badge rounded-pill`, `table` to `.table`, `.field`/`.input` to
`.mb-3`/`.form-label`/`.form-control`. The route line has no Bootstrap equivalent and
carries over as-is.
