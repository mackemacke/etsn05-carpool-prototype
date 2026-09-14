/* Driver flow: dashboard, publishing a ride, handling requests, the manifest. */

(function () {
  var R = window.ROUTES = window.ROUTES || {};
  var O = window.SCREEN_ORDER = window.SCREEN_ORDER || [];
  function screen(s) { R[s.path] = s; if (!s.hidden) { O.push(s); } }
  var U = window.UI, D = window.DATA;

  screen({
    path: '#/driver', code: 'D1', group: 'Driver', label: 'Driver dashboard', actor: 'driver',
    blurb: 'Where a driver lands: today first, requests waiting.',
    reqs: ['4.1.3', '4.2.3'],
    render: function () {
      var r104 = D.ride('R-104');
      return U.page([
        U.pageHead('Your trips',
          'Signed in as <strong>Amelia Ek</strong>, driving today. Two seat requests are waiting for an answer.',
          '<a class="btn btn-primary btn-sm" href="#/driver/offer">Publish a ride</a>'),

        '<section class="panel stack">' +
          '<div class="panel-head"><h2>Saturday 13 September</h2>' +
            '<span class="chip chip-warn">2 requests waiting</span></div>' +
          U.corridor(r104.stops, null, null) +
          '<div class="ride-foot">' +
            '<div class="row">' + U.seatChip(r104.seatsFree, r104.seatsTotal) +
              '<span class="chip">' + r104.passengers.length + ' confirmed</span></div>' +
            '<div class="row">' +
              '<a class="btn btn-secondary btn-sm" href="#/driver/trip/R-104">Trip detail</a>' +
              '<a class="btn btn-primary btn-sm" href="#/driver/requests">Answer requests</a>' +
            '</div>' +
          '</div>' +
        '</section>',

        '<div class="grid-2">' +
          '<section class="panel stack">' +
            '<h2>Later this week</h2>' +
            '<ul class="itemlist">' +
              '<li><div class="item-body"><span class="item-title">Lund C &rarr; Ystad</span>' +
                '<span class="item-sub">Sun 14 Sep 16:20 &middot; 3 seats free &middot; no requests</span></div>' +
                '<a class="btn btn-secondary btn-sm" href="#/driver/trip/R-104">Open</a></li>' +
              '<li><div class="item-body"><span class="item-title">Malmö C &rarr; Lund C</span>' +
                '<span class="item-sub">Mon 15 Sep 07:50 &middot; 2 seats free &middot; 1 confirmed</span></div>' +
                '<a class="btn btn-secondary btn-sm" href="#/driver/trip/R-104">Open</a></li>' +
            '</ul>' +
          '</section>' +

          '<section class="panel stack">' +
            '<h2>Open question for the dashboard</h2>' +
            '<p>Nothing in the backlog says how far ahead a driver may publish, or whether a recurring commute is ' +
            'one ride repeated or many separate rides. The second answer fills this list with near-duplicates ' +
            'within a week.</p>' +
            '<div class="callout callout-info">' +
              '<strong>Worth raising at the expert meeting</strong>' +
              '<p>Recurrence is the single change most likely to reshape the data model after the PRD is baselined, ' +
              'which makes it expensive later. Decide it now, even if the answer is &ldquo;not supported&rdquo;.</p>' +
            '</div>' +
          '</section>' +
        '</div>',

        U.req(['4.1.3', '4.2.3', '4.2.5'], [43])
      ]);
    }
  });

  screen({
    path: '#/driver/offer', code: 'D2', group: 'Driver', label: 'Publish a ride', actor: 'driver',
    blurb: 'Route with intermediate stops, time, seats.',
    reqs: ['4.2.1', '4.2.2'],
    render: function () {
      return U.page([
        U.pageHead('Publish a ride',
          'The stops between origin and destination are what make partial-leg booking possible. If the driver is ' +
          'not asked for them, no passenger can ever join halfway.'),

        '<div class="grid-2">' +
          '<section class="panel stack">' +
            '<h2>Route</h2>' +
            '<div class="field"><label for="o-from">From</label>' +
              '<select class="input" id="o-from"><option selected>Malmö C</option><option>Lund C</option></select></div>' +
            '<div class="field"><label for="o-to">To</label>' +
              '<select class="input" id="o-to"><option selected>Helsingborg</option><option>Landskrona</option></select></div>' +
            '<div class="field"><label for="o-stops">Stops along the way</label>' +
              '<div class="choice-set">' +
                '<button type="button" class="choice" aria-pressed="true"><strong>Lomma</strong><span>+16 min</span></button>' +
                '<button type="button" class="choice" aria-pressed="true"><strong>Bjärred</strong><span>+8 min</span></button>' +
                '<button type="button" class="choice" aria-pressed="true"><strong>Landskrona</strong><span>+15 min</span></button>' +
              '</div>' +
              '<span class="hint">Offered from the west coast corridor, because origin and destination both sit on it.</span>' +
            '</div>' +
            '<div class="row">' +
              '<div class="field" style="flex:1"><label for="o-date">Date</label>' +
                '<input class="input" id="o-date" type="date" value="2026-09-13"></div>' +
              '<div class="field" style="flex:1"><label for="o-time">Departure</label>' +
                '<input class="input" id="o-time" type="time" value="07:40"></div>' +
              '<div class="field" style="flex:1"><label for="o-seats">Free seats</label>' +
                '<select class="input" id="o-seats"><option>1</option><option>2</option>' +
                '<option selected>3</option><option>4</option></select></div>' +
            '</div>' +
            '<div class="field"><label for="o-note">Note for passengers</label>' +
              '<textarea class="input" id="o-note" rows="2">Non-smoking. Small bags only — boot has a bike rack.</textarea></div>' +
            '<div class="row row-end">' +
              '<a class="btn btn-secondary" href="#/driver">Save as draft</a>' +
              '<a class="btn btn-primary" href="#/driver/trip/R-104">Publish ride</a>' +
            '</div>' +
          '</section>' +

          '<section class="panel stack">' +
            '<h2>Preview</h2>' +
            U.corridor([
              { name: 'Malmö C',     time: '07:40' },
              { name: 'Lomma',       time: '07:56' },
              { name: 'Bjärred',     time: '08:04' },
              { name: 'Landskrona',  time: '08:19' },
              { name: 'Helsingborg', time: '08:41' }
            ], null, null) +
            '<p style="color:var(--ink-2);font-size:.92rem">Stop times are estimated from the corridor, not from a ' +
            'map service. The customer explicitly does not require a map.</p>' +
            '<div class="callout callout-warn">' +
              '<strong>Two unresolved requirements</strong>' +
              '<p>Can a driver override an estimated stop time by hand? And may the route be edited after ' +
              'passengers have booked a leg that the edit removes? Neither has an issue in CourseGit.</p>' +
            '</div>' +
          '</section>' +
        '</div>',

        U.req(['4.2.1', '4.2.2', '4.4.2'], [])
      ]);
    }
  });

  screen({
    path: '#/driver/requests', code: 'D3', group: 'Driver', label: 'Booking requests', actor: 'driver',
    blurb: 'Accept or decline, with the seat effect shown.',
    reqs: ['4.2.3', '4.2.4', '4.4.3'],
    render: function () {
      var ride = D.ride('R-104');
      var cards = ride.requests.map(function (q) {
        return '<article class="ride">' +
          '<div class="ride-top">' +
            '<div class="ride-who">' +
              '<span class="avatar" aria-hidden="true">' + U.esc(q.initials) + '</span>' +
              '<div class="stack-s"><strong>' + U.esc(q.name) + '</strong>' +
              '<span class="ride-meta">Requested ' + U.esc(q.asked) + ' &middot; ' + U.esc(q.id) + '</span></div>' +
            '</div>' +
            '<span class="chip chip-seat">' + q.seats + ' seat</span>' +
          '</div>' +
          U.corridor(ride.stops, q.from, q.to) +
          '<div class="ride-foot">' +
            '<span class="ride-meta">Occupies a seat only between ' + U.esc(q.from) + ' and ' + U.esc(q.to) + '.</span>' +
            '<div class="row">' +
              '<a class="btn btn-secondary btn-sm" href="#/driver/requests">Decline</a>' +
              '<a class="btn btn-primary btn-sm" href="#/driver/trip/R-104">Accept</a>' +
            '</div>' +
          '</div>' +
        '</article>';
      }).join('');

      return U.page([
        U.pageHead('Requests for R-104',
          'Malmö C &rarr; Helsingborg, Sat 13 Sep 07:40. Two people want a seat, on different parts of the route.',
          '<a class="btn btn-quiet btn-sm" href="#/driver">Back to trips</a>'),

        '<div class="stack">' + cards + '</div>',

        '<div class="callout callout-info">' +
          '<strong>These two requests do not compete</strong>' +
          '<p>Amelia rides the whole way, Oskar only Lomma&ndash;Landskrona. With three seats both fit. With one seat ' +
          'they conflict on the middle section only. The seat count has to be evaluated per segment, which is the ' +
          'hardest thing on this screen and the reason 4.4.3 exists.</p>' +
        '</div>',

        U.req(['4.2.3', '4.2.4', '4.4.3', '4.5.2'], [31, 37, 41, 35])
      ]);
    }
  });

  function tripDetail() {
    var ride = D.ride('R-104');
    var manifest = [
      { stop: 'Malmö C',     time: '07:40', on: ['Amelia Ek'], off: [] },
      { stop: 'Lomma',       time: '07:56', on: ['Oskar Lejon'], off: [] },
      { stop: 'Bjärred',     time: '08:04', on: [], off: [] },
      { stop: 'Landskrona',  time: '08:19', on: [], off: ['Tove Åkesson', 'Oskar Lejon'] },
      { stop: 'Helsingborg', time: '08:41', on: [], off: ['Amelia Ek'] }
    ];

    var rows = manifest.map(function (m) {
      function names(list, kind) {
        if (!list.length) { return '<span style="color:var(--ink-3)">—</span>'; }
        return list.map(function (n) {
          return '<span class="chip ' + (kind === 'on' ? 'chip-ok' : '') + '">' + U.esc(n) + '</span>';
        }).join(' ');
      }
      return '<tr><td class="num">' + U.esc(m.time) + '</td><td>' + U.esc(m.stop) + '</td>' +
        '<td>' + names(m.on, 'on') + '</td><td>' + names(m.off, 'off') + '</td></tr>';
    }).join('');

    return U.page([
      U.pageHead('Trip R-104',
        'Malmö C &rarr; Helsingborg, Sat 13 Sep. Three passengers, none of them travelling the same leg.',
        '<a class="btn btn-secondary btn-sm" href="#/driver/trip/R-104/cancel">Cancel ride</a>'),

      '<section class="panel stack">' +
        U.corridor(ride.stops, null, null) +
        '<div class="row">' + U.seatChip(1, 3) +
          '<span class="chip chip-info">Full between Lomma and Landskrona</span></div>' +
      '</section>',

      '<section class="panel stack">' +
        '<div class="panel-head"><h2>Pickup order</h2>' +
          '<span class="chip">What the driver actually needs while driving</span></div>' +
        '<div class="table-scroll"><table class="data">' +
          '<thead><tr><th class="num">Time</th><th>Stop</th><th>Picks up</th><th>Drops off</th></tr></thead>' +
          '<tbody>' + rows + '</tbody></table></div>' +
        '<p class="hint" style="font-size:.82rem;color:var(--ink-3)">The customer requires that a person finds out who ' +
        'they are travelling with. For the driver that means this list, in stop order — not an alphabetical list of names.</p>' +
      '</section>',

      '<div class="grid-2">' +
        '<section class="panel stack">' +
          '<h2>Passengers</h2>' +
          '<ul class="itemlist">' +
            '<li><span class="avatar" aria-hidden="true">AE</span><div class="item-body">' +
              '<span class="item-title">Amelia Ek</span><span class="item-sub">Malmö C &rarr; Helsingborg &middot; 1 seat</span>' +
              '</div>' + U.stateChip('confirmed') + '</li>' +
            '<li><span class="avatar" aria-hidden="true">TÅ</span><div class="item-body">' +
              '<span class="item-title">Tove Åkesson</span><span class="item-sub">Malmö C &rarr; Landskrona &middot; 1 seat</span>' +
              '</div>' + U.stateChip('confirmed') + '</li>' +
            '<li><span class="avatar" aria-hidden="true">OL</span><div class="item-body">' +
              '<span class="item-title">Oskar Lejon</span><span class="item-sub">Lomma &rarr; Landskrona &middot; 1 seat</span>' +
              '</div>' + U.stateChip('pending') + '</li>' +
          '</ul>' +
        '</section>' +

        '<section class="panel stack">' +
          '<h2>What the driver can change</h2>' +
          '<ul class="itemlist">' +
            '<li><div class="item-body"><span class="item-title">Departure time</span>' +
              '<span class="item-sub">All passengers are notified.</span></div>' +
              '<button type="button" class="btn btn-secondary btn-sm">Edit</button></li>' +
            '<li><div class="item-body"><span class="item-title">Free seats</span>' +
              '<span class="item-sub">Cannot go below what is already booked on any segment.</span></div>' +
              '<button type="button" class="btn btn-secondary btn-sm">Edit</button></li>' +
            '<li><div class="item-body"><span class="item-title">Note to passengers</span>' +
              '<span class="item-sub">No notification sent.</span></div>' +
              '<button type="button" class="btn btn-secondary btn-sm">Edit</button></li>' +
          '</ul>' +
          '<div class="callout"><strong>Rule worth numbering</strong>' +
            '<p>&ldquo;Seats cannot be reduced below the booked count on any segment&rdquo; is testable and cheap to ' +
            'state now. Discovered during integration it is a redesign.</p></div>' +
        '</section>' +
      '</div>',

      U.req(['4.2.5', '4.2.4', '4.4.3'], [31, 41])
    ]);
  }

  screen({
    path: '#/driver/trip/R-104', code: 'D4', group: 'Driver', label: 'Trip detail & manifest', actor: 'driver',
    blurb: 'Who boards where — the driver-side answer to "who am I travelling with".',
    reqs: ['4.2.5', '4.4.3'],
    render: tripDetail
  });

  screen({
    path: '#/driver/trip/R-104/cancel', code: 'D5', group: 'Driver', label: 'Cancel a ride', actor: 'driver',
    blurb: 'The destructive action, with everyone it affects named.',
    reqs: ['4.2.6', '4.5.2'],
    render: function () {
      return U.page([
        U.pageHead('Cancel trip R-104',
          'Cancelling a published ride strands people who have planned around it, so the screen names them.'),

        '<section class="panel stack" style="max-width:640px">' +
          '<dl class="kv">' +
            '<dt>Journey</dt><dd>Malmö C &rarr; Helsingborg</dd>' +
            '<dt>Departs</dt><dd class="num">Sat 13 Sep 07:40</dd>' +
            '<dt>Affected</dt><dd>3 passengers</dd>' +
          '</dl>' +
          '<div class="callout callout-crit">' +
            '<strong>These three people will be notified</strong>' +
            '<p>Amelia Ek (Malmö C &rarr; Helsingborg), Tove Åkesson (Malmö C &rarr; Landskrona) and Oskar Lejon ' +
            '(Lomma &rarr; Landskrona, request still pending). Their bookings move to cancelled and the seats disappear.</p>' +
          '</div>' +
          '<div class="field"><label for="c-reason">Reason (sent to passengers)</label>' +
            '<select class="input" id="c-reason">' +
              '<option selected>Car unavailable</option><option>Plans changed</option>' +
              '<option>Illness</option><option>Other</option></select></div>' +
          '<div class="row row-end">' +
            '<a class="btn btn-secondary" href="#/driver/trip/R-104">Keep the ride</a>' +
            '<a class="btn btn-danger" href="#/driver">Cancel ride and notify</a>' +
          '</div>' +
        '</section>',

        U.req(['4.2.6', '4.5.1', '4.5.2'], [17, 19, 28])
      ]);
    }
  });
})();
