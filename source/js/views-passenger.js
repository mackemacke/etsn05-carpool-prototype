/* Passenger flow: search, results, ride detail, booking, history, notifications. */

(function () {
  var R = window.ROUTES = window.ROUTES || {};
  var O = window.SCREEN_ORDER = window.SCREEN_ORDER || [];
  function screen(s) { R[s.path] = s; if (!s.hidden) { O.push(s); } }
  var U = window.UI, D = window.DATA;

  screen({
    path: '#/search', code: 'T1', group: 'Passenger', label: 'Find a ride', actor: 'passenger',
    blurb: 'Origin, destination, date, seats — all from the location list.',
    reqs: ['4.3.1', '4.4.2'],
    render: function () {
      var corridorRows = Object.keys(D.corridors).map(function (k) {
        var c = D.corridors[k];
        return '<tr><td>' + U.esc(c.name) + '</td><td>' +
          c.stops.map(function (s, i) {
            return (i ? '<span style="color:var(--ink-3)"> &rarr; </span>' : '') + U.esc(s);
          }).join('') + '</td></tr>';
      }).join('');

      return U.page([
        U.pageHead('Find a ride',
          'Origin and destination are picked from the maintained location list, never typed freely — matching ' +
          'depends on knowing where each location sits on its corridor.'),

        '<section class="panel stack">' +
          '<div class="grid-2">' +
            '<div class="field"><label for="s-from">From</label>' +
              '<select class="input" id="s-from"><option selected>Malmö C</option><option>Lund C</option>' +
              '<option>Lomma</option><option>Landskrona</option><option>Helsingborg</option></select></div>' +
            '<div class="field"><label for="s-to">To</label>' +
              '<select class="input" id="s-to"><option>Lomma</option><option>Landskrona</option>' +
              '<option selected>Helsingborg</option><option>Hässleholm</option><option>Ystad</option></select></div>' +
            '<div class="field"><label for="s-date">Date</label>' +
              '<input class="input" id="s-date" type="date" value="2026-09-13"></div>' +
            '<div class="field"><label for="s-time">Earliest departure</label>' +
              '<input class="input" id="s-time" type="time" value="07:00">' +
              '<span class="hint">Open question: is this an exact time or the start of a window?</span></div>' +
            '<div class="field"><label for="s-seats">Seats</label>' +
              '<select class="input" id="s-seats"><option selected>1</option><option>2</option><option>3</option></select></div>' +
            '<div class="field"><label for="s-partial">Partial legs</label>' +
              '<select class="input" id="s-partial"><option selected>Include rides that cover part of my journey</option>' +
              '<option>Only rides all the way through</option></select></div>' +
          '</div>' +
          '<div class="row row-end">' +
            '<a class="btn btn-quiet" href="#/results-empty">See the no-results state</a>' +
            '<a class="btn btn-primary" href="#/results">Search</a>' +
          '</div>' +
        '</section>',

        '<section class="panel stack">' +
          '<div class="panel-head"><h2>The location list</h2>' +
            '<span class="chip">Prototype data</span></div>' +
          '<p style="color:var(--ink-2);font-size:.92rem">Each corridor is an ordered sequence. A ride covers a ' +
          'contiguous run of it, and a passenger’s leg is a contiguous run of the ride. That is the whole matching rule.</p>' +
          '<div class="table-scroll"><table class="data">' +
            '<thead><tr><th>Corridor</th><th>Stops in order</th></tr></thead>' +
            '<tbody>' + corridorRows + '</tbody></table></div>' +
          '<div class="callout callout-warn">' +
            '<strong>Where this model breaks</strong>' +
            '<p>A trip from Lomma to Ystad crosses two corridors and matches nothing. Either the model grows a ' +
            'graph, or the PRD states that only single-corridor journeys are supported. Team decision, before Review 1.</p>' +
          '</div>' +
        '</section>',

        U.req(['4.3.1', '4.4.1', '4.4.2'], [])
      ]);
    }
  });

  screen({
    path: '#/results', code: 'T2', group: 'Passenger', label: 'Matching rides', actor: 'passenger',
    blurb: 'Full-route and partial-leg matches in one list.',
    reqs: ['4.3.2', '4.4.1', '4.4.2', '4.4.3'],
    render: function () {
      var r104 = D.ride('R-104');
      var partial = {
        id: 'R-131',
        driver: { name: 'Sanna Tell', initials: 'ST', rating: '4.7', trips: 21 },
        car: 'Kia Ceed · JPT 550',
        date: 'Sat 13 Sep',
        stops: [
          { name: 'Malmö C',    time: '07:15' },
          { name: 'Lomma',      time: '07:31' },
          { name: 'Bjärred',    time: '07:39' },
          { name: 'Landskrona', time: '07:58' }
        ],
        seatsTotal: 4, seatsFree: 1
      };

      return U.page([
        U.pageHead('Malmö C → Helsingborg',
          'Sat 13 Sep, from 07:00, 1 seat. <strong>3 rides</strong> match.',
          '<a class="btn btn-secondary btn-sm" href="#/search">Change search</a>'),

        '<div class="stack">' +
          U.rideCard(r104, 'Malmö C', 'Helsingborg', '#/ride/R-104') +
          U.rideCard(partial, 'Malmö C', 'Landskrona', '#/ride/R-104') +
          U.rideCard(D.ride('R-118'), 'Malmö C', 'Lund C', '#/ride/R-118') +
        '</div>',

        '<div class="callout callout-info">' +
          '<strong>Two of these do not go where you are going</strong>' +
          '<p>The second reaches Landskrona and the third turns inland at Lund. They are shown because they cover ' +
          'part of the journey. Whether that belongs in the same list, behind a heading, or behind the filter on the ' +
          'search screen is a design decision the team has not made — and it changes what #37 has to return.</p>' +
        '</div>',

        U.req(['4.3.2', '4.4.1', '4.4.2', '4.4.3'], [37])
      ]);
    }
  });

  screen({
    path: '#/results-empty', code: 'T3', group: 'Passenger', label: 'No matching rides', actor: 'passenger',
    blurb: 'Empty state with a route out of it.',
    reqs: ['4.3.1'],
    render: function () {
      return U.page([
        U.pageHead('Lomma → Ystad',
          'Sat 13 Sep, from 07:00, 1 seat. <strong>No rides</strong> match.',
          '<a class="btn btn-secondary btn-sm" href="#/search">Change search</a>'),

        '<div class="empty">' +
          '<h2>Nothing on this route yet</h2>' +
          '<p style="color:var(--ink-2);max-width:58ch">Lomma is on the west coast corridor and Ystad is on the ' +
          'south east one. No published ride covers both.</p>' +
          '<div class="row">' +
            '<a class="btn btn-primary" href="#/search">Try another date</a>' +
            '<a class="btn btn-secondary" href="#/results">Search Lomma → Landskrona instead</a>' +
          '</div>' +
        '</div>',

        '<div class="callout">' +
          '<strong>An empty result is a product decision, not an error</strong>' +
          '<p>Offering the nearest workable search keeps the person moving. Offering nothing sends them away. ' +
          'Whatever is decided has to be a numbered requirement, or it will not survive implementation.</p>' +
        '</div>',

        U.req(['4.3.1', '4.4.2'], [])
      ]);
    }
  });

  function rideDetail(path) {
    var id = path.split('/')[2];
    var ride = D.ride(id) || D.ride('R-104');
    var last = ride.stops[ride.stops.length - 1];

    return U.page([
      U.pageHead(ride.stops[0].name + ' → ' + last.name,
        ride.date + ' &middot; departs <span class="num">' + ride.stops[0].time + '</span> &middot; ride ' + ride.id,
        '<a class="btn btn-quiet btn-sm" href="#/results">Back to results</a>'),

      '<section class="panel stack">' +
        '<div class="ride-top">' +
          '<div class="ride-who">' +
            '<span class="avatar" aria-hidden="true">' + U.esc(ride.driver.initials) + '</span>' +
            '<div class="stack-s"><strong>' + U.esc(ride.driver.name) + '</strong>' +
            '<span class="ride-meta">' + U.esc(ride.car) + ' &middot; <span class="num">' +
              U.esc(ride.driver.rating) + '</span> rating &middot; <span class="num">' +
              ride.driver.trips + '</span> completed trips</span></div>' +
          '</div>' +
          '<div class="row">' + U.seatChip(ride.seatsFree, ride.seatsTotal) + '</div>' +
        '</div>' +
        U.corridor(ride.stops, ride.stops[0].name, last.name) +
      '</section>',

      '<div class="grid-2">' +
        '<section class="panel stack">' +
          '<h2>Book a seat</h2>' +
          '<div class="field"><label for="b-from">Board at</label>' +
            '<select class="input" id="b-from">' +
              ride.stops.map(function (s, i) {
                return '<option' + (i === 0 ? ' selected' : '') + '>' + U.esc(s.name) + ' · ' + U.esc(s.time) + '</option>';
              }).join('') +
            '</select></div>' +
          '<div class="field"><label for="b-to">Get off at</label>' +
            '<select class="input" id="b-to">' +
              ride.stops.map(function (s, i) {
                return '<option' + (i === ride.stops.length - 1 ? ' selected' : '') + '>' +
                  U.esc(s.name) + ' · ' + U.esc(s.time) + '</option>';
              }).join('') +
            '</select></div>' +
          '<div class="field"><label for="b-seats">Seats</label>' +
            '<select class="input" id="b-seats"><option selected>1</option><option>2</option></select></div>' +
          '<div class="row row-end">' +
            '<a class="btn btn-quiet" href="#/ride/R-104/conflict">Simulate a booking conflict</a>' +
            '<a class="btn btn-primary" href="#/bookings">Request seat</a>' +
          '</div>' +
          '<p class="hint" style="font-size:.8rem;color:var(--ink-3)">The driver decides. You are notified either way.</p>' +
        '</section>' +

        '<section class="panel stack">' +
          '<h2>Who else is in the car</h2>' +
          (ride.passengers.length
            ? '<ul class="itemlist">' + ride.passengers.map(function (p) {
                return '<li><span class="avatar" aria-hidden="true">' + U.esc(p.initials) + '</span>' +
                  '<div class="item-body"><span class="item-title">' + U.esc(p.name) + '</span>' +
                  '<span class="item-sub">' + U.esc(p.from) + ' → ' + U.esc(p.to) + '</span></div>' +
                  U.stateChip(p.status) + '</li>';
              }).join('') + '</ul>'
            : '<p style="color:var(--ink-2)">Nobody has booked yet. You would be the first.</p>') +
          (ride.note ? '<div class="callout"><strong>From the driver</strong><p>' + U.esc(ride.note) + '</p></div>' : '') +
          '<div class="callout callout-warn">' +
            '<strong>Privacy decision the PRD has to make</strong>' +
            '<p>The customer requires that a person finds out who they are travelling with. Before booking, or only ' +
            'after the driver accepts? Full names, or first name only? This screen shows the most generous version ' +
            'so the team can argue it down.</p>' +
          '</div>' +
        '</section>' +
      '</div>',

      U.req(['4.3.3', '4.3.4', '4.2.5', '4.4.3'], [31, 35, 41])
    ]);
  }

  screen({
    path: '#/ride/R-104', code: 'T4', group: 'Passenger', label: 'Ride detail & booking', actor: 'passenger',
    blurb: 'Route, driver, fellow passengers, and the seat request.',
    reqs: ['4.3.3', '4.3.4', '4.2.5'],
    render: rideDetail
  });
  screen({ path: '#/ride/R-118', hidden: true, render: rideDetail, actor: 'passenger' });
  screen({ path: '#/ride/R-122', hidden: true, render: rideDetail, actor: 'passenger' });

  screen({
    path: '#/ride/R-104/conflict', code: 'T5', group: 'Passenger', label: 'Booking conflict', actor: 'passenger',
    blurb: 'Two sessions, one seat — the customer requires this be handled.',
    reqs: ['5.2.1', '5.2.2'],
    render: function () {
      var ride = D.ride('R-104');
      return U.page([
        U.pageHead('Malmö C → Helsingborg',
          'Sat 13 Sep &middot; departs <span class="num">07:40</span> &middot; ride R-104'),

        '<div class="callout callout-crit">' +
          '<strong>That seat went to someone else</strong>' +
          '<p>Oskar Lejon booked the last seat between Lomma and Landskrona while this page was open. ' +
          'Your request was not sent and you have not been charged.</p>' +
        '</div>',

        '<section class="panel stack">' +
          U.corridor(ride.stops, 'Lomma', 'Landskrona') +
          '<div class="row">' + U.seatChip(0, 3) +
            '<span class="chip chip-info">Seats free again from Landskrona</span></div>' +
        '</section>',

        '<div class="grid-2">' +
          '<section class="panel stack">' +
            '<h2>What you can do instead</h2>' +
            '<ul class="itemlist">' +
              '<li><div class="item-body"><span class="item-title">Board at Landskrona instead</span>' +
                '<span class="item-sub">Departs 08:19, arrives Helsingborg 08:41. One seat free.</span></div>' +
                '<a class="btn btn-secondary btn-sm" href="#/ride/R-104">Change leg</a></li>' +
              '<li><div class="item-body"><span class="item-title">Take R-131 at 07:15</span>' +
                '<span class="item-sub">Sanna Tell, Malmö C → Landskrona. One seat free.</span></div>' +
                '<a class="btn btn-secondary btn-sm" href="#/results">See ride</a></li>' +
            '</ul>' +
          '</section>' +

          '<section class="panel stack">' +
            '<h2>Why this screen exists</h2>' +
            '<p>&ldquo;Possible conflicts arising due to parallel user sessions must be managed by the system&rdquo; ' +
            'is one of the few non-functional requirements the customer wrote down explicitly. A requirement with ' +
            'no screen tends to become a backend ticket nobody can demonstrate at the final review.</p>' +
            '<div class="callout callout-info">' +
              '<strong>Acceptance criterion this suggests</strong>' +
              '<p>Two sessions requesting the last seat on the same leg: one confirmed, one told exactly which leg ' +
              'became unavailable and offered at least one alternative. Seat count never goes negative.</p>' +
            '</div>' +
          '</section>' +
        '</div>',

        U.req(['5.2.1', '5.2.2', '4.4.3'], [])
      ]);
    }
  });

  screen({
    path: '#/bookings', code: 'T6', group: 'Passenger', label: 'My bookings', actor: 'passenger',
    blurb: 'Upcoming and past, with cancellation.',
    reqs: ['4.3.5', '4.3.6'],
    render: function () {
      function row(b) {
        return '<tr>' +
          '<td class="num">' + U.esc(b.id) + '</td>' +
          '<td>' + U.esc(b.from) + ' &rarr; ' + U.esc(b.to) + '</td>' +
          '<td class="num">' + U.esc(b.date) + ' ' + U.esc(b.depart) + '</td>' +
          '<td>' + U.esc(b.driver) + '</td>' +
          '<td class="num">' + b.seats + '</td>' +
          '<td>' + U.stateChip(b.state) + '</td>' +
          '<td>' + (b.state === 'pending' || b.state === 'confirmed'
            ? '<a class="btn btn-secondary btn-sm" href="#/booking/' + b.id + '/cancel">Cancel</a>'
            : '<span style="color:var(--ink-3)">—</span>') + '</td>' +
        '</tr>';
      }

      var upcoming = D.bookings.filter(function (b) { return b.state === 'pending' || b.state === 'confirmed'; });
      var past = D.bookings.filter(function (b) { return b.state === 'completed' || b.state === 'cancelled'; });

      return U.page([
        U.pageHead('My bookings',
          'Upcoming trips and the history the customer asked to keep. History is what makes the final report’s ' +
          'usage figures possible, so it is not optional.',
          '<a class="btn btn-primary btn-sm" href="#/search">Find a ride</a>'),

        '<section class="panel stack">' +
          '<div class="panel-head"><h2>Upcoming</h2><span class="chip">' + upcoming.length + '</span></div>' +
          '<div class="table-scroll"><table class="data">' +
            '<thead><tr><th class="num">Booking</th><th>Journey</th><th class="num">Departs</th>' +
            '<th>Driver</th><th class="num">Seats</th><th>State</th><th></th></tr></thead>' +
            '<tbody>' + upcoming.map(row).join('') + '</tbody>' +
          '</table></div>' +
        '</section>',

        '<section class="panel stack">' +
          '<div class="panel-head"><h2>History</h2><span class="chip">' + past.length + '</span></div>' +
          '<div class="table-scroll"><table class="data">' +
            '<thead><tr><th class="num">Booking</th><th>Journey</th><th class="num">Departed</th>' +
            '<th>Driver</th><th class="num">Seats</th><th>State</th><th></th></tr></thead>' +
            '<tbody>' + past.map(row).join('') + '</tbody>' +
          '</table></div>' +
          '<p class="hint" style="font-size:.82rem;color:var(--ink-3)">Undecided: how long history is kept, and whether ' +
          'a cancelled booking stays visible to the driver.</p>' +
        '</section>',

        U.req(['4.3.6', '4.3.5'], [18, 27, 29, 20])
      ]);
    }
  });

  screen({
    path: '#/booking/B-2291/cancel', code: 'T7', group: 'Passenger', label: 'Cancel a booking', actor: 'passenger',
    blurb: 'Confirmation step, with the consequence stated.',
    reqs: ['4.3.5'],
    render: function () {
      return U.page([
        U.pageHead('Cancel booking B-2291',
          'An irreversible action gets a confirmation that says what will happen, not just &ldquo;are you sure&rdquo;.'),

        '<section class="panel stack" style="max-width:620px">' +
          '<dl class="kv">' +
            '<dt>Journey</dt><dd>Malmö C &rarr; Helsingborg</dd>' +
            '<dt>Departs</dt><dd class="num">Sat 13 Sep 07:40</dd>' +
            '<dt>Driver</dt><dd>Erik Hovander</dd>' +
            '<dt>Seats</dt><dd class="num">1</dd>' +
            '<dt>State</dt><dd>' + U.stateChip('pending') + '</dd>' +
          '</dl>' +
          '<div class="callout callout-warn">' +
            '<strong>What happens when you cancel</strong>' +
            '<p>The seat is released between Malmö C and Helsingborg and offered to other passengers. ' +
            'Erik is notified. The booking stays in your history as cancelled.</p>' +
          '</div>' +
          '<div class="row row-end">' +
            '<a class="btn btn-secondary" href="#/bookings">Keep the booking</a>' +
            '<a class="btn btn-danger" href="#/bookings">Cancel booking</a>' +
          '</div>' +
        '</section>',

        '<div class="callout">' +
          '<strong>Missing requirement</strong>' +
          '<p>Nothing states whether a passenger may cancel five minutes before departure, or whether late ' +
          'cancellation is recorded against the account. Work item #20 cannot be closed until that is written down.</p>' +
        '</div>',

        U.req(['4.3.5'], [20, 26])
      ]);
    }
  });

  screen({
    path: '#/notifications', code: 'T8', group: 'Passenger', label: 'Notifications', actor: 'passenger',
    blurb: 'One list for both roles; every entry navigates somewhere.',
    reqs: ['4.5.1', '4.5.2', '4.5.3'],
    render: function () {
      var items = D.notifications.map(function (n) {
        return '<li><a class="notif" href="' + n.href + '" style="display:flex;gap:12px;flex:1">' +
          '<span class="notif-dot' + (n.unread ? '' : ' read') + '" aria-hidden="true"></span>' +
          '<span class="item-body">' +
            '<span class="item-title">' + U.esc(n.title) + '</span>' +
            '<span class="item-sub">' + U.esc(n.body) + '</span>' +
          '</span>' +
          '<span class="ride-meta" style="white-space:nowrap">' + U.esc(n.time) + '</span>' +
        '</a></li>';
      }).join('');

      return U.page([
        U.pageHead('Notifications',
          'Work item #34 asks that a notification navigates to the relevant page. That only works if every ' +
          'notification type has a destination — so the type list and the route list have to be written together.',
          '<button type="button" class="btn btn-secondary btn-sm">Mark all as read</button>'),

        '<section class="panel"><ul class="itemlist">' + items + '</ul></section>',

        '<section class="panel stack">' +
          '<h2>Notification types and where each one goes</h2>' +
          '<div class="table-scroll"><table class="data">' +
            '<thead><tr><th>Event</th><th>Who is told</th><th>Opens</th></tr></thead><tbody>' +
              '<tr><td>Seat request received</td><td>Driver</td><td>Booking requests</td></tr>' +
              '<tr><td>Request accepted or declined</td><td>Passenger</td><td>Ride detail</td></tr>' +
              '<tr><td>Passenger cancelled</td><td>Driver</td><td>Trip detail</td></tr>' +
              '<tr><td>Driver cancelled the ride</td><td>All passengers</td><td>My bookings</td></tr>' +
              '<tr><td>Departure time changed</td><td>All passengers</td><td>Ride detail</td></tr>' +
              '<tr><td>Trip completed</td><td>Both</td><td>My bookings</td></tr>' +
            '</tbody></table></div>' +
          '<p class="hint" style="font-size:.82rem;color:var(--ink-3)">Six types, six destinations. ' +
          'Work item #28 calls for status flags — this table is the set they have to cover.</p>' +
        '</section>',

        U.req(['4.5.1', '4.5.2', '4.5.3'], [17, 19, 28, 33, 34, 36])
      ]);
    }
  });

  screen({
    path: '#/profile', code: 'T9', group: 'Passenger', label: 'Profile & role', actor: 'passenger',
    blurb: 'Where a passenger becomes a driver.',
    reqs: ['4.1.4', '4.1.2'],
    render: function () {
      return U.page([
        U.pageHead('Profile',
          'Changing your own role happens here. An administrator changing someone else’s role is a different ' +
          'screen with a different requirement — keeping them apart keeps the permission rules honest.'),

        '<div class="grid-2">' +
          '<section class="panel stack">' +
            '<h2>Account</h2>' +
            '<div class="field"><label for="p-name">Full name</label>' +
              '<input class="input" id="p-name" type="text" value="Amelia Ek"></div>' +
            '<div class="field"><label for="p-mail">E-mail</label>' +
              '<input class="input" id="p-mail" type="email" value="amelia.ek@example.se"></div>' +
            '<div class="field"><label for="p-home">Home location</label>' +
              '<select class="input" id="p-home"><option selected>Lund C</option><option>Malmö C</option></select></div>' +
            '<div class="row row-end"><button type="button" class="btn btn-primary">Save changes</button></div>' +
          '</section>' +

          '<section class="panel stack">' +
            '<h2>Role</h2>' +
            '<div class="choice-set">' +
              '<button type="button" class="choice" aria-pressed="false"><strong>Passenger</strong>' +
                '<span>Book seats only.</span></button>' +
              '<button type="button" class="choice" aria-pressed="false"><strong>Driver</strong>' +
                '<span>Publish trips only.</span></button>' +
              '<button type="button" class="choice" aria-pressed="true"><strong>Both</strong>' +
                '<span>Currently active.</span></button>' +
            '</div>' +
            '<h3 style="margin-top:4px">Vehicle</h3>' +
            '<dl class="kv">' +
              '<dt>Car</dt><dd>Skoda Fabia</dd>' +
              '<dt>Registration</dt><dd class="num">XLN 442</dd>' +
              '<dt>Seats offered</dt><dd class="num">3</dd>' +
            '</dl>' +
            '<div class="callout callout-warn">' +
              '<strong>Blocked decision</strong>' +
              '<p>What happens to published trips if a driver switches to passenger-only? Cancel them, or refuse ' +
              'the change while trips are open? Nothing in the backlog covers it.</p>' +
            '</div>' +
          '</section>' +
        '</div>',

        U.req(['4.1.4', '4.1.2'], [])
      ]);
    }
  });
})();
