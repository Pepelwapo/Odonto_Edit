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
