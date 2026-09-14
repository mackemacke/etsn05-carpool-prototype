/* Hash router + shell wiring. Small on purpose: the prototype exists to show
   screens and the paths between them, not to be an application. */

(function () {
  var ROUTES = window.ROUTES;
  var ORDER = window.SCREEN_ORDER;
  var U = window.UI;

  var main = document.getElementById('main');
  var rail = document.getElementById('railnav');

  /* ---- preferences (best effort; storage can be unavailable) ---- */

  function readPref(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function writePref(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  /* Only ever set the attribute, never clear it: when this page is embedded
     somewhere that stamps the viewer's own theme on the root element, clearing
     it would override their choice. With nothing stored we inherit
     prefers-color-scheme, which is the right default in both places. */
  var storedTheme = readPref('proto-theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', storedTheme);
  }

  if (readPref('proto-req') === '1') {
    document.body.classList.add('show-req');
    document.getElementById('req-toggle').setAttribute('aria-pressed', 'true');
  }

  /* ---- rail navigation ---- */

  function buildRail() {
    var groups = [];
    var byName = {};
    ORDER.forEach(function (s) {
      if (!byName[s.group]) { byName[s.group] = []; groups.push(s.group); }
      byName[s.group].push(s);
    });

    rail.innerHTML = groups.map(function (g) {
      var links = byName[g].map(function (s) {
        return '<a class="rail-link" href="' + s.path + '" data-path="' + s.path + '">' +
          '<span class="rail-id">' + U.esc(s.code) + '</span>' +
          '<span>' + U.esc(s.label) + '</span></a>';
      }).join('');
      return '<div class="rail-group"><span class="eyebrow">' + U.esc(g) + '</span>' + links + '</div>';
    }).join('');
  }

  /* ---- routing ---- */

  /* Navigation is driven by an internal variable, not by location.hash.
     Embedded in a sandboxed frame the hash is not always writable, and a router
     that depends on it silently stops navigating. The hash is still kept in
     sync when the host allows it, so deep links and the back button work where
     they can. */
  var path = '#/';

  function readHash() {
    try {
      var h = window.location.hash;
      return (!h || h === '#') ? null : h;
    } catch (e) { return null; }
  }

  function writeHash(next) {
    try {
      if (window.location.hash !== next) { window.location.hash = next; }
    } catch (e) { /* frame will not take it; the internal path still moved */ }
  }

  function go(next) {
    if (!next || next === path) { return; }
    path = next;
    render();
    writeHash(next);
  }

  function render() {
    var spec = ROUTES[path];

    if (!spec) {
      main.innerHTML = U.page([
        U.pageHead('Screen not drawn yet',
          'Nothing in this prototype answers to <code class="mono">' + U.esc(path) + '</code>. ' +
          'That is either a link typed by hand, or a flow the team has not designed — worth knowing which.'),
        '<div class="empty"><h2>Where to go instead</h2>' +
          '<a class="btn btn-primary" href="#/">Back to the screen index</a></div>'
      ]);
    } else {
      main.innerHTML = spec.render(path);
    }

    document.title = (spec && spec.label ? spec.label + ' — ' : '') + 'Samåk Route Prototype';

    Array.prototype.forEach.call(rail.querySelectorAll('.rail-link'), function (a) {
      if (a.getAttribute('data-path') === path) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });

    var actor = spec && spec.actor;
    ['passenger', 'driver', 'admin'].forEach(function (name) {
      document.getElementById('actor-' + name)
        .setAttribute('aria-pressed', actor === name ? 'true' : 'false');
    });

    main.focus();
    window.scrollTo(0, 0);
  }

  /* ---- toggles ---- */

  var actorHome = {
    passenger: '#/search',
    driver: '#/driver',
    admin: '#/admin/users'
  };

  Object.keys(actorHome).forEach(function (name) {
    document.getElementById('actor-' + name).addEventListener('click', function () {
      go(actorHome[name]);
    });
  });

  /* Every in-page link is handled here rather than by the browser, for the
     same reason the router does not read the hash. Registered in the capture
     phase: an embedding page may have its own click handler that treats an
     anchor as an outbound link and stops the event before it reaches us. */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var a = t && t.closest ? t.closest('a[href^="#/"]') : null;
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) { return; }
    e.preventDefault();
    e.stopPropagation();
    go(a.getAttribute('href'));
  }, true);

  document.getElementById('req-toggle').addEventListener('click', function () {
    var on = document.body.classList.toggle('show-req');
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
    writePref('proto-req', on ? '1' : '0');
  });

  document.getElementById('theme-toggle').addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.getAttribute('data-theme') === 'dark' ||
      (!root.getAttribute('data-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    var next = dark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    writePref('proto-theme', next);
  });

  /* Choice groups behave like radio buttons so a walkthrough can point at a
     selection without anything being saved. */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.choice') : null;
    if (!btn) { return; }
    var set = btn.parentNode;
    Array.prototype.forEach.call(set.querySelectorAll('.choice'), function (c) {
      c.setAttribute('aria-pressed', c === btn ? 'true' : 'false');
    });
  });

  document.getElementById('bell-count').textContent = window.DATA.unread();

  window.addEventListener('hashchange', function () {
    var h = readHash();
    if (h && h !== path) { path = h; render(); }
  });

  buildRail();
  path = readHash() || '#/';
  render();
})();
