/* Prototype-level screens: the index used to walk the team through the flows,
   and the full draft requirement list. */

(function () {
  var R = window.ROUTES = window.ROUTES || {};
  var O = window.SCREEN_ORDER = window.SCREEN_ORDER || [];
  function screen(s) { R[s.path] = s; O.push(s); }
  var U = window.UI;

  screen({
    path: '#/', code: '00', group: 'Prototype', label: 'Screen index', actor: null,
    render: function () {
      var groups = {};
      O.forEach(function (s) {
        if (s.group === 'Prototype') { return; }
        (groups[s.group] = groups[s.group] || []).push(s);
      });

      var sections = Object.keys(groups).map(function (g) {
        var cards = groups[g].map(function (s) {
          return '' +
            '<a class="index-card" href="' + s.path + '">' +
              '<span class="idx">' + U.esc(s.code) + '</span>' +
              '<strong>' + U.esc(s.label) + '</strong>' +
              '<span>' + U.esc(s.blurb || '') + '</span>' +
            '</a>';
        }).join('');
        return '<section class="panel-flat stack"><h2>' + U.esc(g) + '</h2>' +
               '<div class="index-grid">' + cards + '</div></section>';
      }).join('');

      return U.page([
        U.pageHead(
          'Carpooling — screen walkthrough',
          'Every screen the customer’s assignment description asks for, plus the flows Team 2 has already opened work items for. ' +
          'Nothing here talks to a backend: links navigate, forms do not submit, numbers are made up. ' +
          'Use it to settle what each screen contains before the PRD goes to Review 1.',
          '<a class="btn btn-primary" href="#/search">Start the passenger flow</a>' +
          '<a class="btn btn-secondary" href="#/requirements">Draft requirements</a>'
        ),
        '<div class="callout callout-info">' +
          '<strong>The open question this prototype takes a position on</strong>' +
          '<p>The customer asks how to decide which locations lie between which. Here every location sits on an ordered ' +
          '<em>corridor</em>, and a partial leg is any contiguous run of stops along one. That assumption drives the route ' +
          'diagram on every ride screen — if the team rejects it, the search results and the driver manifest both change shape.</p>' +
        '</div>',
        sections,
        U.req(['4.4.2'], [])
      ]);
    }
  });

  screen({
    path: '#/requirements', code: '0R', group: 'Prototype', label: 'Draft requirements', actor: null,
    blurb: 'The numbered list the screens are traced against.',
    render: function () {
      function rows(kind) {
        return window.DATA.requirements.filter(function (r) { return r.kind === kind; })
          .map(function (r) {
            var on = O.filter(function (s) { return (s.reqs || []).indexOf(r.id) > -1; });
            var links = on.map(function (s) {
              return '<a href="' + s.path + '">' + U.esc(s.code) + '</a>';
            }).join(', ') || '<span style="color:var(--ink-3)">not shown</span>';
            return '<tr><td class="num">' + U.esc(r.id) + '</td><td>' + U.esc(r.text) + '</td><td>' + links + '</td></tr>';
          }).join('');
      }

      function table(kind, caption) {
        return '<section class="panel stack">' +
          '<div class="panel-head"><h2>' + caption + '</h2></div>' +
          '<div class="table-scroll"><table class="data">' +
            '<thead><tr><th class="num">Req</th><th>Statement</th><th>Screens</th></tr></thead>' +
            '<tbody>' + rows(kind) + '</tbody>' +
          '</table></div>' +
        '</section>';
      }

      return U.page([
        U.pageHead(
          'Draft requirements',
          'Numbered the way the project guide requires: hierarchically, after the chapter the requirement sits in, ' +
          'functional separated from non-functional, and never renumbered once the PRD is in baseline. ' +
          'These are drafts written to give the prototype something to be traced against — they are not the PRD.',
          '<span class="chip chip-warn">Draft · not reviewed</span>'
        ),
        table('F', 'Functional requirements'),
        table('NF', 'Non-functional requirements'),
        '<div class="callout callout-warn">' +
          '<strong>Gaps the team still has to close</strong>' +
          '<p>Nothing here covers how a time is specified (exact departure, or a window), how the set of selectable ' +
          'locations is maintained, what a driver may see about a passenger before accepting, or what happens to a ' +
          'booking when the driver changes the route after passengers have joined. Each is a requirement the customer ' +
          'asked for a proposal on, and each is currently missing.</p>' +
        '</div>'
      ]);
    }
  });
})();
