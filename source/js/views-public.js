/* Screens available before sign-in. */

(function () {
  var R = window.ROUTES = window.ROUTES || {};
  var O = window.SCREEN_ORDER = window.SCREEN_ORDER || [];
  function screen(s) { R[s.path] = s; O.push(s); }
  var U = window.UI;

  screen({
    path: '#/signup', code: 'P1', group: 'Account', label: 'Create account', actor: null,
    blurb: 'Registration, including the driver / passenger / both choice.',
    reqs: ['4.1.1', '4.1.2', '5.1.1'],
    render: function () {
      return U.page([
        U.pageHead('Create your account',
          'The customer requires that people register and state whether they intend to drive, ride along, or both. ' +
          'The role is a property of the account, not two separate accounts.'),

        '<div class="grid-2">' +
          '<section class="panel stack">' +
            '<h2>Your details</h2>' +
            '<div class="field"><label for="su-name">Full name</label>' +
              '<input class="input" id="su-name" type="text" value="Amelia Ek"></div>' +
            '<div class="field"><label for="su-mail">E-mail</label>' +
              '<input class="input" id="su-mail" type="email" value="amelia.ek@example.se"></div>' +
            '<div class="field"><label for="su-pass">Password</label>' +
              '<input class="input" id="su-pass" type="password" value="aaaaaaaaaaaa">' +
              '<span class="hint">At least 10 characters.</span></div>' +
            '<div class="field"><label for="su-home">Home location</label>' +
              '<select class="input" id="su-home">' +
                '<option>Malmö C</option><option selected>Lund C</option><option>Landskrona</option>' +
                '<option>Helsingborg</option><option>Ystad</option>' +
              '</select>' +
              '<span class="hint">Chosen from the maintained location list — free text would break matching.</span></div>' +
          '</section>' +

          '<section class="panel stack">' +
            '<h2>How will you use it?</h2>' +
            '<div class="choice-set">' +
              '<button type="button" class="choice" aria-pressed="false">' +
                '<strong>Passenger</strong><span>Search for rides and book a seat.</span></button>' +
              '<button type="button" class="choice" aria-pressed="false">' +
                '<strong>Driver</strong><span>Publish trips and take passengers along.</span></button>' +
              '<button type="button" class="choice" aria-pressed="true">' +
                '<strong>Both</strong><span>Switch between the two whenever you like.</span></button>' +
            '</div>' +
            '<div class="callout">' +
              '<strong>Open decision</strong>' +
              '<p>A driver needs vehicle details before publishing a trip. Asked here, or first time they publish? ' +
              'The prototype asks later — registration stays short.</p>' +
            '</div>' +
            '<div class="row row-end">' +
              '<a class="btn btn-quiet" href="#/login">I already have an account</a>' +
              '<a class="btn btn-primary" href="#/search">Create account</a>' +
            '</div>' +
          '</section>' +
        '</div>',

        U.req(['4.1.1', '4.1.2', '5.1.1'], [])
      ]);
    }
  });

  screen({
    path: '#/login', code: 'P2', group: 'Account', label: 'Sign in', actor: null,
    blurb: 'One sign-in for every role; landing page follows the role.',
    reqs: ['4.1.3'],
    render: function () {
      return U.page([
        U.pageHead('Sign in',
          'Work item #43 asks for a driver sign-in. The prototype takes the position that there is one sign-in for ' +
          'everybody and the role decides where you land — a person who is both would otherwise need two accounts.'),

        '<div class="grid-2">' +
          '<section class="panel stack">' +
            '<div class="field"><label for="li-mail">E-mail</label>' +
              '<input class="input" id="li-mail" type="email" value="amelia.ek@example.se"></div>' +
            '<div class="field"><label for="li-pass">Password</label>' +
              '<input class="input" id="li-pass" type="password" value="aaaaaaaaaaaa"></div>' +
            '<div class="row row-end">' +
              '<a class="btn btn-quiet" href="#/signup">Create account</a>' +
              '<a class="btn btn-primary" href="#/search">Sign in</a>' +
            '</div>' +
            '<p class="hint" style="font-size:.8rem;color:var(--ink-3)">Rejected sign-in: ' +
              '<a href="#/login-error">see the error state</a>.</p>' +
          '</section>' +

          '<section class="panel stack">' +
            '<h2>Where each role lands</h2>' +
            '<dl class="kv">' +
              '<dt>Passenger</dt><dd>Find a ride</dd>' +
              '<dt>Driver</dt><dd>Driver dashboard, today’s trips first</dd>' +
              '<dt>Both</dt><dd>Find a ride, with the driver view one click away</dd>' +
              '<dt>Administrator</dt><dd>User list</dd>' +
            '</dl>' +
            '<div class="callout callout-info">' +
              '<strong>Why it matters for the PRD</strong>' +
              '<p>If sign-in is per role, every screen needs a role check and #43 grows into four issues. ' +
              'One account with a role attribute keeps it to one.</p>' +
            '</div>' +
          '</section>' +
        '</div>',

        U.req(['4.1.3', '4.1.2'], [43, 44])
      ]);
    }
  });

  screen({
    path: '#/login-error', code: 'P3', group: 'Account', label: 'Sign in — rejected input', actor: null,
    blurb: 'What the system does with bad input, which the customer requires.',
    reqs: ['5.1.1', '5.1.2'],
    render: function () {
      return U.page([
        U.pageHead('Sign in',
          'The customer requires that no sequence of input crashes or locks the system. That is a requirement about ' +
          'what the user sees, so it needs a screen — otherwise it quietly becomes nobody’s job.'),

        '<div class="grid-2">' +
          '<section class="panel stack">' +
            '<div class="callout callout-crit">' +
              '<strong>We could not sign you in</strong>' +
              '<p>The e-mail or password did not match an account. Check both and try again.</p>' +
            '</div>' +
            '<div class="field field-error">' +
              '<label for="le-mail">E-mail</label>' +
              '<input class="input" id="le-mail" type="text" value="amelia.ek@@example" aria-invalid="true" aria-describedby="le-mail-err">' +
              '<span class="error-text" id="le-mail-err">Enter an address in the form name@example.se</span>' +
            '</div>' +
            '<div class="field field-error">' +
              '<label for="le-pass">Password</label>' +
              '<input class="input" id="le-pass" type="password" value="" aria-invalid="true" aria-describedby="le-pass-err">' +
              '<span class="error-text" id="le-pass-err">Enter your password</span>' +
            '</div>' +
            '<div class="row row-end">' +
              '<a class="btn btn-primary" href="#/search">Sign in</a>' +
            '</div>' +
          '</section>' +

          '<section class="panel stack">' +
            '<h2>The rule this screen sets</h2>' +
            '<p>An error names the field and the expected format, and never blames the user or apologises. ' +
            'The failed attempt keeps what was typed so nothing has to be re-entered.</p>' +
            '<div class="callout callout-warn">' +
              '<strong>Not decided yet</strong>' +
              '<p>How many failed attempts before the account is locked, and for how long. ' +
              'Until that is decided, #45 — &ldquo;make sure the field is appropriate to the standard&rdquo; — has no acceptance criterion to test against.</p>' +
            '</div>' +
          '</section>' +
        '</div>',

        U.req(['5.1.1', '5.1.2'], [45])
      ]);
    }
  });
})();
