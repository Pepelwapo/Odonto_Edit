(function () {
  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Handle "Reservar cita" clicks from non-home pages
  function gotoContacto(e) {
    if (!document.getElementById('contacto')) {
      e.preventDefault();
      window.location.href = 'index.html#contacto';
    }
  }
  document.querySelectorAll('[data-jump-contacto], a[href="#contacto"]').forEach(function (el) {
    el.addEventListener('click', gotoContacto);
  });

  // Flash messages via localStorage
  var flash = localStorage.getItem('flashMessage');
  if (flash) {
    var ctn = document.getElementById('flash-container');
    if (ctn) {
      ctn.classList.remove('hidden');
      var box = document.createElement('div');
      box.className = 'rounded-xl border border-green-200 bg-green-50 text-green-800 px-4 py-3 text-sm mb-2';
      box.textContent = flash;
      ctn.appendChild(box);
    }
    localStorage.removeItem('flashMessage');
  }

  // Contact form fake submit (no backend on GitHub Pages)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(form);
      var payload = {};
      formData.forEach((v, k) => payload[k] = v);
      try { console.log('[CONTACTO]', payload); } catch (err) {}
      localStorage.setItem('flashMessage', '¡Gracias! Hemos recibido tu solicitud y te contactaremos pronto.');
      // Navigate to same page with #contacto to simulate Flask redirect + flash
      if (location.pathname.endsWith('index.html') || location.pathname.endsWith('/')) {
        location.hash = '#contacto';
        location.reload();
      } else {
        window.location.href = 'index.html#contacto';
      }
    });
  }
})();


  // Promos: render from CSV if present
  async function loadCSVPromos() {
    var grid = document.getElementById('promos-grid');
    if (!grid) return;
    try {
      const res = await fetch('data/promos.csv', { cache: 'no-store' });
      if (!res.ok) throw new Error('No promos.csv');
      const text = await res.text();
      const rows = text.trim().split(/\r?\n/);
      const headers = rows.shift().split(',');
      function rowObj(line) {
        const parts = line.split(',');
        const o = {}; headers.forEach((h,i)=>o[h]=parts[i]||''); return o;
      }
      const data = rows.map(rowObj);
      grid.innerHTML = '';
      data.forEach(p => {
        var card = document.createElement('div');
        card.className = 'card flex flex-col';
        card.innerHTML = `
          <div class="text-sm font-semibold text-sky-700">Paquete #${p.paquete}</div>
          <h3 class="mt-2 text-2xl font-extrabold">${p.title}</h3>
          <p class="mt-2 text-sm text-slate-600">${p.desc}</p>
          <div class="mt-4 text-3xl font-extrabold">$${p.price} <span class="text-base font-semibold text-slate-500">MXN</span></div>
          <ul class="mt-4 text-sm space-y-2">
            <li>✅ ${p.meta1}</li>
            <li>✅ ${p.meta2}</li>
            <li>✅ ${p.meta3}</li>
          </ul>
          <div class="mt-6"><a href="index.html#contacto" class="btn btn-primary w-full">Reservar</a></div>
        `;
        grid.appendChild(card);
      });
    } catch (e) {
      // Leave fallback
    }
  }
  loadCSVPromos();


// --- Mobile hamburger menu ---
(function () {
  var btn = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  function openMenu() {
    if (!menu.classList.contains('hidden')) return;
    menu.classList.remove('hidden');
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.add('menu-panel-enter');
    requestAnimationFrame(function(){
      menu.classList.add('menu-panel-enter-active');
      menu.classList.remove('menu-panel-enter');
    });
    setTimeout(function(){
      menu.classList.remove('menu-panel-enter-active');
    }, 220);
    document.addEventListener('click', onClickOutside);
  }
  function closeMenu() {
    if (menu.classList.contains('hidden')) return;
    menu.classList.add('menu-panel-exit');
    requestAnimationFrame(function(){
      menu.classList.add('menu-panel-exit-active');
      menu.classList.remove('menu-panel-exit');
    });
    setTimeout(function(){
      menu.classList.add('hidden');
      menu.classList.remove('menu-panel-exit-active');
      btn.setAttribute('aria-expanded', 'false');
    }, 160);
    document.removeEventListener('click', onClickOutside);
  }
  function onClickOutside(e) {
    if (!menu.contains(e.target) && e.target !== btn) closeMenu();
  }
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (menu.classList.contains('hidden')) openMenu(); else closeMenu();
  });

  // Close if viewport switches to desktop
  var mq = window.matchMedia('(min-width: 768px)');
  function onChangeMQ(e){ if (e.matches) closeMenu(); }
  if (mq.addEventListener) mq.addEventListener('change', onChangeMQ);
  else mq.addListener(onChangeMQ);
})();


// Attach to all data-menu-toggle buttons (multi-page safe)
(function () {
  var buttons = document.querySelectorAll('[data-menu-toggle]');
  var menu = document.getElementById('mobile-menu');
  if (!buttons.length || !menu) return;
  function openMenu() {
    if (!menu.classList.contains('hidden')) return;
    menu.classList.remove('hidden');
    buttons.forEach(b => b.setAttribute('aria-expanded','true'));
    document.addEventListener('click', onClickOutside);
  }
  function closeMenu() {
    if (menu.classList.contains('hidden')) return;
    menu.classList.add('hidden');
    buttons.forEach(b => b.setAttribute('aria-expanded','false'));
    document.removeEventListener('click', onClickOutside);
  }
  function onClickOutside(e) {
    if (!menu.contains(e.target) && !Array.from(buttons).includes(e.target)) closeMenu();
  }
  buttons.forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      if (menu.classList.contains('hidden')) openMenu(); else closeMenu();
    });
  });
  var mq = window.matchMedia('(min-width: 768px)');
  function onChangeMQ(e){ if (e.matches) closeMenu(); }
  if (mq.addEventListener) mq.addEventListener('change', onChangeMQ);
  else mq.addListener(onChangeMQ);
})();


// Close mobile menu when clicking any link inside
(function () {
  var menu = document.getElementById('mobile-menu');
  if (!menu) return;
  function closeMenu() {
    if (menu.classList.contains('hidden')) return;
    menu.classList.add('hidden');
    document.querySelectorAll('[data-menu-toggle]').forEach(b => b.setAttribute('aria-expanded','false'));
  }
  menu.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if (a) { setTimeout(closeMenu, 0); }
  });
})();
