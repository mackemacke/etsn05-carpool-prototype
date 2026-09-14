/* Shared rendering helpers. Every view builds its markup from these so the
   repeated objects — ride cards, route diagrams, requirement panels — keep the
   same edges, baselines and inner padding from screen to screen. */

window.UI = (function () {

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pageHead(title, lede, aside) {
    return '' +
      '<header class="page-head">' +
        '<div class="page-head-row">' +
          '<div class="stack-s">' +
            '<h1>' + esc(title) + '</h1>' +
            (lede ? '<p class="lede">' + lede + '</p>' : '') +
          '</div>' +
          (aside ? '<div class="row">' + aside + '</div>' : '') +
        '</div>' +
      '</header>';
  }

  /* The route corridor. `legFrom`/`legTo` highlight one passenger's segment,
     which is the whole point of the drawing: it shows at a glance that a
     passenger may ride only part of the driver's route. */
  function corridor(stops, legFrom, legTo) {
    var fromIdx = -1, toIdx = -1;
    stops.forEach(function (s, i) {
      if (s.name === legFrom) { fromIdx = i; }
      if (s.name === legTo)   { toIdx = i; }
    });

    var items = stops.map(function (s, i) {
      var cls = ['stop'];
      if (i === 0 || i === stops.length - 1) { cls.push('endpoint'); }
      if (fromIdx > -1 && i >= fromIdx && i <= toIdx) { cls.push('on-leg'); }
      if (fromIdx > -1 && i >= fromIdx && i < toIdx)  { cls.push('leg-line'); }
      return '' +
        '<li class="' + cls.join(' ') + '">' +
          '<span class="stop-time">' + esc(s.time) + '</span>' +
          '<span class="stop-dot" aria-hidden="true"></span>' +
          '<span class="stop-name">' + esc(s.name) + '</span>' +
        '</li>';
    }).join('');

    var whole = fromIdx === 0 && toIdx === stops.length - 1;
    var key = fromIdx > -1
      ? '<div class="corridor-key">' +
          '<span><i class="key-swatch leg"></i> Your leg: ' + esc(legFrom) + ' &rarr; ' + esc(legTo) + '</span>' +
          (whole ? '' : '<span><i class="key-swatch"></i> Rest of the driver&rsquo;s route</span>') +
        '</div>'
      : '';

    return '<div class="corridor-scroll"><ol class="corridor">' + items + '</ol></div>' + key;
  }

  function seatChip(free, total) {
    var cls = free === 0 ? 'chip chip-crit' : (free === 1 ? 'chip chip-warn' : 'chip chip-ok');
    return '<span class="' + cls + '">' + free + ' of ' + total + ' seats free</span>';
  }

  function stateChip(state) {
    var map = {
      pending:   ['chip chip-warn', 'Awaiting driver'],
      confirmed: ['chip chip-ok',   'Confirmed'],
      completed: ['chip',           'Completed'],
      cancelled: ['chip chip-crit', 'Cancelled'],
      Active:    ['chip chip-ok',   'Active'],
      Suspended: ['chip chip-crit', 'Suspended']
    };
    var m = map[state] || ['chip', state];
    return '<span class="' + m[0] + '">' + esc(m[1]) + '</span>';
  }

  function rideCard(ride, legFrom, legTo, href) {
    var last = ride.stops[ride.stops.length - 1];
    var partial = legFrom && (legFrom !== ride.stops[0].name || legTo !== last.name);
    return '' +
      '<article class="ride">' +
        '<div class="ride-top">' +
          '<div class="ride-who">' +
            '<span class="avatar" aria-hidden="true">' + esc(ride.driver.initials) + '</span>' +
            '<div class="stack-s">' +
              '<strong>' + esc(ride.driver.name) + '</strong>' +
              '<span class="ride-meta">' + esc(ride.car) + ' &middot; ' +
                '<span class="num">' + esc(ride.driver.rating) + '</span> &middot; ' +
                '<span class="num">' + ride.driver.trips + '</span> trips</span>' +
            '</div>' +
          '</div>' +
          '<div class="ride-when">' +
            '<div class="t">' + esc(ride.stops[0].time) + '&ndash;' + esc(last.time) + '</div>' +
            '<div class="d">' + esc(ride.date) + ' &middot; ' + esc(ride.id) + '</div>' +
          '</div>' +
        '</div>' +
        corridor(ride.stops, legFrom, legTo) +
        '<div class="ride-foot">' +
          '<div class="row">' + seatChip(ride.seatsFree, ride.seatsTotal) +
            (partial ? '<span class="chip chip-info">Covers part of your journey</span>' : '') +
          '</div>' +
          (href ? '<a class="btn btn-secondary btn-sm" href="' + href + '">View ride</a>' : '') +
        '</div>' +
      '</article>';
  }

  /* The requirements overlay. Toggled from the top bar; hidden by default so a
     walkthrough stays about the screens, and one click away when the discussion
     turns to what the PRD has to say. */
  function req(ids, workItems) {
    var rows = ids.map(function (id) {
      var r = window.DATA.reqIndex[id];
      return '<li><span class="req-id">' + esc(id) + '</span><span>' +
        (r ? esc(r.text) : 'Unknown requirement') + '</span></li>';
    }).join('');

    var wis = (workItems || []).map(function (n) {
      return '<a class="wi" href="https://coursegit.cs.lth.se/etsn05-team-2/course-project/-/work_items/' +
        n + '" target="_blank" rel="noopener">#' + n + '</a>';
    }).join('');

    return '' +
      '<section class="reqpanel" aria-label="Requirements covered by this screen">' +
        '<h3>Draft requirements on this screen</h3>' +
        '<ul>' + rows + '</ul>' +
        (wis ? '<div class="wi-list"><span class="req-id">CourseGit</span>' + wis + '</div>' : '') +
      '</section>';
  }

  function page(parts) { return '<div class="page">' + parts.join('') + '</div>'; }

  return {
    esc: esc, page: page, pageHead: pageHead, corridor: corridor,
    rideCard: rideCard, seatChip: seatChip, stateChip: stateChip, req: req
  };
})();
