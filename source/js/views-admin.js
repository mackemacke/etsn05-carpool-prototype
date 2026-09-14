/* Administrator flow. The customer requires an administrator role that can,
   for example, remove registered people. */

(function () {
  var R = window.ROUTES = window.ROUTES || {};
  var O = window.SCREEN_ORDER = window.SCREEN_ORDER || [];
  function screen(s) { R[s.path] = s; if (!s.hidden) { O.push(s); } }
  var U = window.UI, D = window.DATA;

  screen({
    path: '#/admin/users', code: 'A1', group: 'Administrator', label: 'Users', actor: 'admin',
    blurb: 'The list, with role and account state.',
    reqs: ['4.6.1'],
    render: function () {
      var rows = D.users.map(function (u) {
        return '<tr>' +
          '<td class="num">' + U.esc(u.id) + '</td>' +
          '<td><a href="#/admin/user/' + U.esc(u.id) + '">' + U.esc(u.name) + '</a></td>' +
          '<td>' + U.esc(u.email) + '</td>' +
          '<td>' + U.esc(u.role) + '</td>' +
          '<td>' + U.stateChip(u.state) + '</td>' +
          '<td class="num">' + U.esc(u.joined) + '</td>' +
          '<td class="num">' + u.trips + '</td>' +
          '<td><a class="btn btn-secondary btn-sm" href="#/admin/user/' + U.esc(u.id) + '">Manage</a></td>' +
        '</tr>';
      }).join('');

      return U.page([
        U.pageHead('Users',
          'Work items #21, #38, #39 and #42 all live on this screen and the one behind it. ' +
          'Splitting them differently would mean four screens where one does the job.',
          '<a class="btn btn-primary btn-sm" href="#/admin/users/new">Add user</a>'),

        '<section class="panel stack">' +
          '<div class="panel-head">' +
            '<div class="row">' +
              '<input class="input" id="a-search" type="search" placeholder="Search name or e-mail" style="width:240px">' +
              '<select class="input" id="a-role" style="width:auto"><option>All roles</option><option>Passenger</option>' +
                '<option>Driver</option><option>Passenger + driver</option><option>Administrator</option></select>' +
              '<select class="input" id="a-state" style="width:auto"><option>All states</option>' +
                '<option>Active</option><option>Suspended</option></select>' +
            '</div>' +
            '<span class="chip">' + D.users.length + ' users</span>' +
          '</div>' +
          '<div class="table-scroll"><table class="data">' +
            '<thead><tr><th class="num">ID</th><th>Name</th><th>E-mail</th><th>Role</th>' +
            '<th>State</th><th class="num">Joined</th><th class="num">Trips</th><th></th></tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table></div>' +
        '</section>',

        '<div class="callout callout-warn">' +
          '<strong>Suspended is not in the requirements</strong>' +
          '<p>The customer asks for an administrator who can remove people. This prototype also shows a suspended ' +
          'state, because removing someone who has upcoming bookings destroys another person’s trip. ' +
          'Either suspension becomes a requirement, or removal needs a rule for what happens to their bookings.</p>' +
        '</div>',

        U.req(['4.6.1', '4.6.3'], [16, 21, 32, 42])
      ]);
    }
  });

  screen({
    path: '#/admin/users/new', code: 'A2', group: 'Administrator', label: 'Add user', actor: 'admin',
    blurb: 'Creating an account on someone’s behalf.',
    reqs: ['4.6.2', '5.1.1'],
    render: function () {
      return U.page([
        U.pageHead('Add user',
          'Work item #30. The same fields as self-registration, plus the two things only an administrator sets: ' +
          'the role and whether the account can sign in immediately.'),

        '<section class="panel stack" style="max-width:640px">' +
          '<div class="field"><label for="n-name">Full name</label>' +
            '<input class="input" id="n-name" type="text" placeholder="Jonas Wide"></div>' +
          '<div class="field"><label for="n-mail">E-mail</label>' +
            '<input class="input" id="n-mail" type="email" placeholder="jonas.wide@example.se">' +
            '<span class="hint">Must be unique. An address already in use is rejected with that reason.</span></div>' +
          '<div class="field"><label for="n-role">Role</label>' +
            '<select class="input" id="n-role"><option selected>Passenger</option><option>Driver</option>' +
              '<option>Passenger + driver</option><option>Administrator</option></select></div>' +
          '<div class="field"><label for="n-state">Initial state</label>' +
            '<select class="input" id="n-state"><option selected>Active</option>' +
              '<option>Invited — must set a password first</option></select></div>' +
          '<div class="row row-end">' +
            '<a class="btn btn-secondary" href="#/admin/users">Cancel</a>' +
            '<a class="btn btn-primary" href="#/admin/users">Create user</a>' +
          '</div>' +
        '</section>',

        '<div class="callout callout-info">' +
          '<strong>Who sets the password?</strong>' +
          '<p>If the administrator does, they know it. If the system invites the person instead, the prototype needs ' +
          'an invitation flow nobody has an issue for. The second is the safer requirement and the more work.</p>' +
        '</div>',

        U.req(['4.6.2', '5.1.1'], [30])
      ]);
    }
  });

  function userDetail(path) {
    var id = path.split('/')[3];
    var u = D.user(id) || D.users[0];

    return U.page([
      U.pageHead(u.name,
        U.esc(u.id) + ' &middot; joined <span class="num">' + U.esc(u.joined) + '</span> &middot; ' +
        '<span class="num">' + u.trips + '</span> completed trips',
        '<a class="btn btn-quiet btn-sm" href="#/admin/users">Back to users</a>'),

      '<div class="grid-2">' +
        '<section class="panel stack">' +
          '<h2>Account</h2>' +
          '<dl class="kv">' +
            '<dt>E-mail</dt><dd>' + U.esc(u.email) + '</dd>' +
            '<dt>State</dt><dd>' + U.stateChip(u.state) + '</dd>' +
            '<dt>Home</dt><dd>Lund C</dd>' +
          '</dl>' +
          '<h3>Role</h3>' +
          '<div class="choice-set">' +
            '<button type="button" class="choice" aria-pressed="' + (u.role === 'Passenger') + '">' +
              '<strong>Passenger</strong><span>Book seats only.</span></button>' +
            '<button type="button" class="choice" aria-pressed="' + (u.role === 'Driver') + '">' +
              '<strong>Driver</strong><span>Publish trips only.</span></button>' +
            '<button type="button" class="choice" aria-pressed="' + (u.role === 'Passenger + driver') + '">' +
              '<strong>Both</strong><span>Publish and book.</span></button>' +
            '<button type="button" class="choice" aria-pressed="false">' +
              '<strong>Administrator</strong><span>Manage every account.</span></button>' +
          '</div>' +
          '<div class="row row-end"><button type="button" class="btn btn-primary">Save role</button></div>' +
        '</section>' +

        '<section class="panel stack">' +
          '<h2>Activity</h2>' +
          '<ul class="itemlist">' +
            '<li><div class="item-body"><span class="item-title">2 upcoming bookings</span>' +
              '<span class="item-sub">Sat 13 Sep and Sun 14 Sep</span></div>' +
              '<a class="btn btn-secondary btn-sm" href="#/bookings">View</a></li>' +
            '<li><div class="item-body"><span class="item-title">1 published ride</span>' +
              '<span class="item-sub">Malmö C → Helsingborg, 3 passengers</span></div>' +
              '<a class="btn btn-secondary btn-sm" href="#/driver/trip/R-104">View</a></li>' +
            '<li><div class="item-body"><span class="item-title">No reports filed</span>' +
              '<span class="item-sub">Last sign-in 11 Sep 08:12</span></div></li>' +
          '</ul>' +

          '<h3 style="margin-top:4px">Remove this account</h3>' +
          '<div class="callout callout-crit">' +
            '<strong>This account has upcoming trips</strong>' +
            '<p>Removing it now cancels 2 bookings and 1 published ride, and notifies 3 other people. ' +
            'Suspending instead blocks sign-in and leaves the trips intact.</p>' +
          '</div>' +
          '<div class="row row-end">' +
            '<button type="button" class="btn btn-secondary">Suspend account</button>' +
            '<a class="btn btn-danger" href="#/admin/users">Remove permanently</a>' +
          '</div>' +
        '</section>' +
      '</div>',

      U.req(['4.6.3', '4.6.4', '4.2.6', '4.3.5'], [38, 39, 32])
    ]);
  }

  screen({
    path: '#/admin/user/U-1002', code: 'A3', group: 'Administrator', label: 'User detail', actor: 'admin',
    blurb: 'Change role, suspend, remove — with the consequences shown.',
    reqs: ['4.6.3', '4.6.4'],
    render: userDetail
  });

  D.users.forEach(function (u) {
    if (u.id === 'U-1002') { return; }
    screen({ path: '#/admin/user/' + u.id, hidden: true, actor: 'admin', render: userDetail });
  });
})();
