(function () {
  'use strict';

  /* ---------------------------------------------------------------- */
  /* Theme toggle                                                      */
  /* ---------------------------------------------------------------- */
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  var STORAGE_KEY = 'theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.classList.add('dark');
      if (toggle) toggle.setAttribute('aria-label', 'Switch to light theme');
    } else {
      root.classList.remove('dark');
      if (toggle) toggle.setAttribute('aria-label', 'Switch to dark theme');
    }
  }

  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(stored ? stored : (prefersDark ? 'dark' : 'light'));
  } catch (e) {
    /* localStorage unavailable; fall back to light default already set in markup */
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------------------------------------------------------------- */
  /* Copy email button                                                  */
  /* ---------------------------------------------------------------- */
  var copyButton = document.querySelector('[data-copy-email]');
  var statusEl = document.querySelector('.copy-status');
  var emailLink = document.querySelector('.contact-email a');

  if (copyButton && emailLink) {
    copyButton.addEventListener('click', function () {
      var email = emailLink.textContent.trim();

      function showCopied() {
        copyButton.setAttribute('data-copied', 'true');
        if (statusEl) statusEl.textContent = 'Email copied.';
        window.setTimeout(function () {
          copyButton.removeAttribute('data-copied');
          if (statusEl) statusEl.textContent = '';
        }, 2000);
      }

      function showError() {
        if (statusEl) statusEl.textContent = "Couldn't copy. Select the email address to copy it manually.";
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied, showError);
      } else {
        showError();
      }
    });
  }
})();
