/* Mock data for the ETSN05 Team 2 carpooling prototype.
   None of this is persisted. It exists so every screen shows a realistic
   working state instead of an empty shell. */

window.DATA = (function () {

  /* Ordered corridors. This is how the prototype answers the customer's open
     question "which locations lie between which" — a location belongs to one or
     more corridors and carries an index inside each. Whether the real system
     models it this way is exactly what the team needs to decide. */
  const corridors = {
    'coast': {
      name: 'West coast',
      stops: ['Malmö C', 'Lomma', 'Bjärred', 'Landskrona', 'Helsingborg']
    },
    'inland': {
      name: 'Inland north',
      stops: ['Malmö C', 'Lund C', 'Eslöv', 'Höör', 'Hässleholm']
    },
    'southeast': {
      name: 'South east',
      stops: ['Lund C', 'Dalby', 'Sjöbo', 'Tomelilla', 'Ystad']
    }
  };

  const rides = [
    {
      id: 'R-104',
      driver: { name: 'Erik Hovander', initials: 'EH', rating: '4.8', trips: 37 },
      car: 'Volvo V60 · RKL 284',
      corridor: 'coast',
      date: 'Sat 13 Sep',
      stops: [
        { name: 'Malmö C',     time: '07:40' },
        { name: 'Lomma',       time: '07:56' },
        { name: 'Bjärred',     time: '08:04' },
        { name: 'Landskrona',  time: '08:19' },
        { name: 'Helsingborg', time: '08:41' }
      ],
      seatsTotal: 3,
      seatsFree: 2,
      note: 'Non-smoking. Small bags only — boot has a bike rack.',
      passengers: [
        { name: 'Tove Åkesson', initials: 'TÅ', from: 'Malmö C', to: 'Landskrona', status: 'confirmed' }
      ],
      requests: [
        { id: 'B-2291', name: 'Amelia Ek',  initials: 'AE', from: 'Malmö C', to: 'Helsingborg', seats: 1, asked: '2 h ago' },
        { id: 'B-2294', name: 'Oskar Lejon', initials: 'OL', from: 'Lomma',  to: 'Landskrona',  seats: 1, asked: '40 min ago' }
      ]
    },
    {
      id: 'R-118',
      driver: { name: 'Nina Aronsson', initials: 'NA', rating: '4.9', trips: 112 },
      car: 'VW ID.4 · MHS 771',
      corridor: 'inland',
      date: 'Sat 13 Sep',
      stops: [
        { name: 'Malmö C',     time: '08:10' },
        { name: 'Lund C',      time: '08:28' },
        { name: 'Eslöv',       time: '08:47' },
        { name: 'Höör',        time: '09:02' },
        { name: 'Hässleholm',  time: '09:24' }
      ],
      seatsTotal: 4,
      seatsFree: 2,
      note: 'Charging stop in Eslöv if needed, about 10 minutes.',
      passengers: [
        { name: 'Hanna Bark',  initials: 'HB', from: 'Malmö C', to: 'Eslöv',      status: 'confirmed' },
        { name: 'Jonas Wide',  initials: 'JW', from: 'Lund C',  to: 'Hässleholm', status: 'confirmed' }
      ],
      requests: []
    },
    {
      id: 'R-122',
      driver: { name: 'Petra Lindh', initials: 'PL', rating: '4.6', trips: 8 },
      car: 'Ford Focus · CWD 019',
      corridor: 'southeast',
      date: 'Sat 13 Sep',
      stops: [
        { name: 'Lund C',    time: '16:20' },
        { name: 'Dalby',     time: '16:33' },
        { name: 'Sjöbo',     time: '16:55' },
        { name: 'Tomelilla', time: '17:14' },
        { name: 'Ystad',     time: '17:36' }
      ],
      seatsTotal: 3,
      seatsFree: 3,
      note: '',
      passengers: [],
      requests: []
    }
  ];

  const bookings = [
    {
      id: 'B-2291', rideId: 'R-104', state: 'pending',
      from: 'Malmö C', to: 'Helsingborg', date: 'Sat 13 Sep', depart: '07:40',
      driver: 'Erik Hovander', seats: 1
    },
    {
      id: 'B-2277', rideId: 'R-118', state: 'confirmed',
      from: 'Lund C', to: 'Höör', date: 'Sun 14 Sep', depart: '08:28',
      driver: 'Nina Aronsson', seats: 1
    },
    {
      id: 'B-2140', rideId: 'R-099', state: 'completed',
      from: 'Malmö C', to: 'Lund C', date: 'Fri 5 Sep', depart: '17:05',
      driver: 'Nina Aronsson', seats: 1
    },
    {
      id: 'B-2088', rideId: 'R-081', state: 'cancelled',
      from: 'Landskrona', to: 'Helsingborg', date: 'Tue 2 Sep', depart: '07:15',
      driver: 'Erik Hovander', seats: 2
    }
  ];

  const notifications = [
    { id: 'N-9', unread: true,  title: 'Erik Hovander accepted your seat request',
      body: 'Malmö C → Helsingborg, Sat 13 Sep 07:40. Pickup outside the north entrance.',
      time: '12 min ago', href: '#/ride/R-104' },
    { id: 'N-8', unread: true,  title: 'A passenger joined your trip',
      body: 'Oskar Lejon booked Lomma → Landskrona on R-104.',
      time: '40 min ago', href: '#/driver/trip/R-104' },
    { id: 'N-7', unread: true,  title: 'Departure time changed',
      body: 'R-118 now leaves Malmö C at 08:10 instead of 08:00.',
      time: '3 h ago', href: '#/ride/R-118' },
    { id: 'N-6', unread: false, title: 'Trip completed',
      body: 'Rate your ride with Nina Aronsson, Malmö C → Lund C.',
      time: 'Fri 5 Sep', href: '#/bookings' },
    { id: 'N-5', unread: false, title: 'Booking cancelled by driver',
      body: 'Landskrona → Helsingborg on Tue 2 Sep was cancelled.',
      time: 'Mon 1 Sep', href: '#/bookings' }
  ];

  const users = [
    { id: 'U-1002', name: 'Amelia Ek',     email: 'amelia.ek@example.se',     role: 'Passenger + driver', state: 'Active',    joined: '2026-08-14', trips: 19 },
    { id: 'U-1003', name: 'Erik Hovander', email: 'erik.hovander@example.se', role: 'Driver',             state: 'Active',    joined: '2026-06-02', trips: 37 },
    { id: 'U-1004', name: 'Nina Aronsson', email: 'nina.aronsson@example.se', role: 'Driver',             state: 'Active',    joined: '2025-11-27', trips: 112 },
    { id: 'U-1005', name: 'Tove Åkesson',  email: 'tove.akesson@example.se',  role: 'Passenger',          state: 'Active',    joined: '2026-09-01', trips: 3 },
    { id: 'U-1006', name: 'Oskar Lejon',   email: 'oskar.lejon@example.se',   role: 'Passenger',          state: 'Suspended', joined: '2026-07-19', trips: 6 },
    { id: 'U-1007', name: 'Petra Lindh',   email: 'petra.lindh@example.se',   role: 'Passenger + driver', state: 'Active',    joined: '2026-09-03', trips: 8 },
    { id: 'U-1008', name: 'Jonas Wide',    email: 'jonas.wide@example.se',    role: 'Passenger',          state: 'Active',    joined: '2026-05-11', trips: 24 }
  ];

  /* Draft requirement numbering follows the PRD rule from the project guide:
     requirements are numbered after the chapter they sit in and are never
     renumbered once the document is in baseline. These are DRAFT ids — the
     point of the prototype is to argue about them before Review 1. */
  const requirements = [
    { id: '4.1.1', kind: 'F',  text: 'A visitor can register an account with name, e-mail and password.' },
    { id: '4.1.2', kind: 'F',  text: 'At registration the user states whether they act as driver, passenger or both.' },
    { id: '4.1.3', kind: 'F',  text: 'A registered user can sign in and is taken to the interface for their role.' },
    { id: '4.1.4', kind: 'F',  text: 'A signed-in user can view and change their own profile and role.' },

    { id: '4.2.1', kind: 'F',  text: 'A driver can publish a ride with origin, destination, departure time and number of free seats.' },
    { id: '4.2.2', kind: 'F',  text: 'A published ride carries the ordered intermediate stops on its corridor with an estimated time per stop.' },
    { id: '4.2.3', kind: 'F',  text: 'A driver can see all pending seat requests for a ride.' },
    { id: '4.2.4', kind: 'F',  text: 'A driver can accept or decline a seat request; the passenger is notified of the outcome.' },
    { id: '4.2.5', kind: 'F',  text: 'A driver can see the confirmed passenger list for a ride in pickup order, with each passenger’s boarding and alighting stop.' },
    { id: '4.2.6', kind: 'F',  text: 'A driver can cancel a published ride; every affected passenger is notified.' },

    { id: '4.3.1', kind: 'F',  text: 'A passenger can search for rides by origin, destination, date and number of seats.' },
    { id: '4.3.2', kind: 'F',  text: 'The result list includes rides where the passenger travels only part of the driver’s route.' },
    { id: '4.3.3', kind: 'F',  text: 'A passenger can open a ride and see route, times, driver, vehicle and free seats.' },
    { id: '4.3.4', kind: 'F',  text: 'A passenger can request one or more seats on a ride for a given leg.' },
    { id: '4.3.5', kind: 'F',  text: 'A passenger can cancel a booking; the driver is notified and the seat is released.' },
    { id: '4.3.6', kind: 'F',  text: 'A passenger can see upcoming bookings and the history of past ones.' },

    { id: '4.4.1', kind: 'F',  text: 'A ride matches a search when the driver’s route contains the passenger’s origin and destination in that order.' },
    { id: '4.4.2', kind: 'F',  text: 'Locations are ordered along a named corridor, which is what makes partial-leg matching decidable.' },
    { id: '4.4.3', kind: 'F',  text: 'A seat is counted as occupied only for the stops between a passenger’s boarding and alighting stop.' },

    { id: '4.5.1', kind: 'F',  text: 'A user can see their notifications, newest first, with unread ones marked.' },
    { id: '4.5.2', kind: 'F',  text: 'Selecting a notification opens the ride, booking or trip it refers to.' },
    { id: '4.5.3', kind: 'F',  text: 'The unread notification count is visible from every screen.' },

    { id: '4.6.1', kind: 'F',  text: 'An administrator can list all registered users with role and account state.' },
    { id: '4.6.2', kind: 'F',  text: 'An administrator can create a user account.' },
    { id: '4.6.3', kind: 'F',  text: 'An administrator can remove a registered user.' },
    { id: '4.6.4', kind: 'F',  text: 'An administrator can change a user’s role.' },

    { id: '5.1.1', kind: 'NF', text: 'Invalid or malformed input is rejected with a message naming the field and the expected format; the system stays available.' },
    { id: '5.1.2', kind: 'NF', text: 'No input sequence may leave the system unresponsive or in an inconsistent state.' },
    { id: '5.2.1', kind: 'NF', text: 'Concurrent sessions are supported; a seat can be booked by at most one passenger.' },
    { id: '5.2.2', kind: 'NF', text: 'When a booking conflicts with a concurrent one, the losing user is told what changed and offered the next step.' },
    { id: '5.3.1', kind: 'NF', text: 'Every screen is usable down to 400 px width.' },
    { id: '5.3.2', kind: 'NF', text: 'All interactive elements are reachable by keyboard and carry a visible focus state.' }
  ];

  const reqIndex = {};
  requirements.forEach(function (r) { reqIndex[r.id] = r; });

  return {
    corridors: corridors,
    rides: rides,
    bookings: bookings,
    notifications: notifications,
    users: users,
    requirements: requirements,
    reqIndex: reqIndex,
    me: { name: 'Amelia Ek', initials: 'AE', email: 'amelia.ek@example.se', role: 'Passenger + driver' },
    ride: function (id) { return rides.filter(function (r) { return r.id === id; })[0]; },
    user: function (id) { return users.filter(function (u) { return u.id === id; })[0]; },
    unread: function () { return notifications.filter(function (n) { return n.unread; }).length; }
  };
})();
