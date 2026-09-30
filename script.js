/* ===================================================================
     1. util        — helper kecil
     2. intro       — layar START
     3. nav         — smooth scroll, menu mobile, active state
     4. typewriter  — teks hero diketik letter by letter
     5. reveal      — animasi masuk viewport + isi progress bar
     6. modal       — buka/tutup <dialog> + lightbox foto
     7. sound       — efek suara 8-bit (Web Audio, tanpa file audio)
     8. keys        — pintasan keyboard
     9. fx          — burst pixel ringan
   ------------------------------------------------------------------- */
(function () {
  'use strict';

  /* ===============================================================
     1. UTIL
     =============================================================== */

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  function isTyping(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  function isSmallScreen() {
    return window.matchMedia('(max-width: 720px)').matches;
  }

  var supportsDialog = typeof HTMLDialogElement !== 'undefined' &&
                        typeof HTMLDialogElement.prototype.showModal === 'function';


  /* ===============================================================
     2. MODUL INTRO
     Layar START. Muncul sekali per sesi browser.
     Kalau user sudah pernah klik START di sesi ini, langsung skip.
     =============================================================== */
  (function intro() {
    var el     = $('#intro');
    var btn    = $('[data-intro-start]');
    var replay = $$('[data-intro-replay]');
    if (!el) return;

    var status = $('#introStatus');
    var timers = [];

    /* Bersihkan timer dari pemutaran sebelumnya supaya tidak menumpuk. */
    function clearTimers() {
      timers.forEach(window.clearTimeout);
      timers = [];
    }

    /* Sequence "loading" intro.
       Dipanggil sekali saat halaman dibuka DAN setiap kali REPLAY ditekan,
       sehingga replay selalu mulai dari nol lalu berhenti di tombol START.
       Steps: LOADING -> appear -> LOADING PLAYER DATA -> READY + START aktif. */
    function run() {
      clearTimers();

      if (status) {
        status.innerHTML = '<span class="intro__caret">&gt;</span> LOADING' +
                           '<span class="intro__dots"></span>';
        status.classList.add('is-out');
      }
      if (btn) {
        btn.disabled = true;
        btn.classList.remove('is-ready');
      }

      // Reduced motion: tanpa jeda, langsung siap.
      var wait = reduceMotion.matches ? 0 : 420;
      var hold = reduceMotion.matches ? 0 : 520;

      timers.push(window.setTimeout(function () {
        if (status) {
          status.classList.remove('is-out');
          status.innerHTML = '<span class="intro__caret">&gt;</span> LOADING PLAYER DATA' +
                             '<span class="intro__dots"></span>';
        }
      }, wait));

      timers.push(window.setTimeout(function () {
        if (status) {
          status.innerHTML = '<span class="intro__caret" style="color:var(--green)">*</span> ' +
                             'PLAYER DATA LOADED';
        }
      }, wait + hold));

      // Tombol START baru aktif setelah data selesai dimuat.
      timers.push(window.setTimeout(function () {
        if (btn) {
          btn.disabled = false;
          btn.classList.add('is-ready');
          btn.focus();
        }
      }, wait + hold + 260));
    }

    function close() {
      clearTimers();
      el.classList.add('is-out');
      document.body.style.overflow = '';
      // Hapus dari DOM setelah transisi supaya tidak menghalangi scroll.
      window.setTimeout(function () {
        el.style.display = 'none';
      }, 400);

      // Efek suara hanya setelah user menekan tombol (tanpa autoplay).
      if (window.JibalFX) window.JibalFX.burst();
    }

    function open() {
      el.style.display = '';
      el.classList.remove('is-out');
      document.body.style.overflow = 'hidden';
      run();   // selalu ulangi sequence dari awal
    }

    /* Intro SELALU tampil tiap kali halaman dimuat, termasuk setelah refresh.
       Tidak ada penanda di sessionStorage/localStorage, jadi reload = main lagi. */
    document.body.style.overflow = 'hidden';
    run();

    if (btn) btn.addEventListener('click', close);

    // Tombol REPLAY INTRO (navbar + footer).
    replay.forEach(function (el) {
      el.addEventListener('click', function () {
        open();
        if (window.JibalSfx) window.JibalSfx.play('confirm');
      });
    });
  })();


  /* Jarak aman dari navbar (px), dipakai saat scroll ke section.
     Ubah nilai ini kalau tinggi navbar di style.css berubah. */
  var NAV_OFFSET = 90;


  /* ===============================================================
     3. MODUL NAV
     Smooth scroll + menu mobile + highlight section aktif.
     =============================================================== */
  (function nav() {
    var navToggle = $('#navToggle');
    var nav       = $('#nav');
    var links     = $$('.nav__link');
    var sections  = ['home', 'about', 'skills', 'projects', 'quest', 'log', 'contact']
                      .map(function (id) { return document.getElementById(id); })
                      .filter(Boolean);

    /* --- Menu mobile --- */
    function closeMenu() {
      if (!nav || !navToggle) return;
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }

    if (navToggle && nav) {
      navToggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      // Tutup menu setelah link diklik.
      links.forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });

      // Tutup juga saat klik di luar menu.
      document.addEventListener('click', function (e) {
        if (nav.classList.contains('is-open') &&
            !nav.contains(e.target) &&
            !navToggle.contains(e.target)) {
          closeMenu();
        }
      });
    }

    /* --- Highlight link aktif saat scroll (IntersectionObserver) --- */
    if ('IntersectionObserver' in window && sections.length) {
      var visible = {};

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting;
        });

        // Pilih section paling atas yang sedang terlihat.
        var current = null;
        for (var i = 0; i < sections.length; i++) {
          if (visible[sections[i].id]) { current = sections[i].id; break; }
        }
        if (!current) return;

        links.forEach(function (a) {
          var match = a.getAttribute('href') === '#' + current;
          a.classList.toggle('is-active', match);
          if (match) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

      sections.forEach(function (s) { io.observe(s); });
    }

    /* --- Scroll halus + pindahkan fokus ke section tujuan --- */
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id.charAt(0) !== '#') return;
        var target = document.getElementById(id.slice(1));
        if (!target) return;

        // Tanganilah klik dengan modifier secara normal
        // (klik kanan/new tab tetap jalan).
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;

        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
        window.scrollTo({ top: top, behavior: reduceMotion.matches ? 'auto' : 'smooth' });

        // Pindahkan fokus agar user keyboard tidak kehilangan posisi.
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  })();


  /* ===============================================================
     4. MODUL TYPEWRITER
     Mengetik teks "PPLG Student | Backend Developer | ..." di hero.
     Ringan: satu setTimeout per karakter, dan langsung berhenti kalau
     user memilih "kurangi animasi". Teks aslinya ada di HTML, jadi
     kalau JS mati, kalimatnya tetap tampil utuh.
     =============================================================== */
  (function typewriter() {
    var el = $('#typeRole');
    if (!el) return;

    var text = el.getAttribute('data-type') || el.textContent.trim();
    if (!text) return;

    // Hormati preferensi pengguna: tampil langsung, tanpa animasi.
    if (reduceMotion.matches) return;

    var i = 0;
    var timer = null;

    function tick() {
      i++;
      el.textContent = text.slice(0, i);
      if (i < text.length) timer = window.setTimeout(tick, 42 + Math.random() * 38);
    }

    // Beri jeda 500ms supaya animasiTyped baru mulai setelah halaman load.
    el.textContent = '';
    timer = window.setTimeout(tick, 500);

    // Hentikan kalau tab tidak aktif (hemat resource).
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        window.clearTimeout(timer);
      } else if (i < text.length) {
        window.clearTimeout(timer);
        timer = window.setTimeout(tick, 220);
      }
    });
  })();


  /* ===============================================================
     5. MODUL REVEAL + PROGRESS BAR
     Elemen .reveal muncul halus, dan .bar__fill terisi dari 0 ke --v
     saat masuk viewport. Semua jalan sekali saja.
     =============================================================== */
  (function reveal() {
    var root = document.documentElement;

    /* 1) Tandai elemen yang akan muncul halus.
          Hero sengaja TIDAK diberi .reveal supaya tidak berkedip saat load.
          Tambah elemen lain di daftar ini kalau mau ikut animasi. */
    $$('.section, .item, .quest, .panel, .shot, .about__stats, .terminal')
      .forEach(function (el) { el.classList.add('reveal'); });

    var targets = $$('.reveal');
    var bars    = $$('.bar__fill');

    /* Ambil nilai --v dari atribut style="--v:82%" di HTML. */
    function barValue(bar) {
      var m = (bar.getAttribute('style') || '').match(/--v:\s*([\d.]+)\s*%/);
      return m ? m[1] : '0';
    }

    /* 2) Tanpa IntersectionObserver: tampilkan semua langsung,
          supaya konten tetap terbaca di browser lama. */
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      bars.forEach(function (bar) { bar.style.width = barValue(bar) + '%'; });
      return;
    }

    /* Class ini memberi tahu CSS bahwa animasi aman dimulai.
       Kalau script ini gagal jalan, class tidak pernah ditulis,
       jadi konten tetap terlihat (tidak terkunci di opacity 0). */
    root.classList.add('reveal-ready');

    /* 3) Elemen muncul halus.
          threshold 0 + rootMargin negatif = aktif begitu elemen menyentuh
          layar, bukan menunggu sebagian besar elemen terlihat.
          Penting untuk section yang lebih tinggi dari layar. */
    var ioReveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        ioReveal.unobserve(entry.target);   // jalan sekali saja
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });

    targets.forEach(function (el) { ioReveal.observe(el); });

    /* 4) Isi progress bar dari 0 ke nilai --v saat bar terlihat.
          Pakai SATU observer untuk semua bar (lebih ringan
          daripada membuat observer baru untuk tiap bar). */
    var instant = reduceMotion.matches;

    bars.forEach(function (bar) {
      bar.style.width = instant ? barValue(bar) + '%' : '0%';
    });

    if (!instant) {
      var ioBar = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var bar = entry.target;
          window.setTimeout(function () {
            bar.style.width = barValue(bar) + '%';
          }, 120);
          ioBar.unobserve(bar);
        });
      }, { threshold: 0.4 });

      bars.forEach(function (bar) { ioBar.observe(bar); });
    }
  })();


  /* ===============================================================
     6. MODUL MODAL
     Buka <dialog> untuk detail project dan lightbox foto.
     Browser sudah menangani focus trap + tombol Esc untuk <dialog>.
     Fallback: kalau <dialog> tidak didukung, buka/hidden manual.
     =============================================================== */
  (function modal() {
    var openers = $$('[data-modal-open]');
    var closers = $$('[data-modal-close]');
    var shotDlg = $('#dlg-shot');
    var shotImg = $('#shotFull');
    var lastFocus = null;

    function openDialog(dlg) {
      if (!dlg) return;
      lastFocus = document.activeElement;
      if (supportsDialog) {
        dlg.showModal();
      } else {
        dlg.setAttribute('open', '');
        dlg.style.position = 'fixed';
        dlg.style.inset = '0';
        dlg.style.margin = 'auto';
        dlg.style.zIndex = '150';
      }
    }

    function closeDialog(dlg) {
      if (!dlg) return;
      if (supportsDialog) dlg.close();
      else dlg.removeAttribute('open');
    }

    /* Kembalikan fokus ke elemen pemicu.
       Dipakai lewat event 'close' milik <dialog>, bukan langsung di
       closeDialog(), supaya fokus juga kembali saat modal ditutup
       dengan tombol Esc atau dari luar (browser yang menutupnya). */
    function restoreFocus() {
      var el = lastFocus;
      lastFocus = null;
      if (el && el.focus && document.contains(el)) {
        window.setTimeout(function () { el.focus(); }, 0);
      }
    }

    // Tombol VIEW pada kartu project.
    openers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openDialog(document.getElementById(btn.getAttribute('data-modal-open')));
      });
    });

    // Tombol close (×) di setiap modal.
    closers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeDialog(btn.closest('dialog'));
      });
    });

    // Klik area gelap di luar modal untuk menutup.
    $$('dialog').forEach(function (dlg) {
      dlg.addEventListener('click', function (e) {
        if (e.target === dlg) closeDialog(dlg);
      });

      // Semua jalur penutupan (×, Esc, backdrop) melewati event ini.
      dlg.addEventListener('close', restoreFocus);
    });

    // Fallback untuk browser tanpa <dialog>: tutup dengan Esc.
    if (!supportsDialog) {
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var open = $('dialog[open]');
        if (open) { closeDialog(open); restoreFocus(); }
      });
    }

    // --- Lightbox foto (section Memory Log) ---
    $$('[data-shot]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!shotImg || !shotDlg) return;
        shotImg.src = btn.getAttribute('data-shot');
        shotImg.alt = btn.getAttribute('data-shot-alt') || '';
        openDialog(shotDlg);
      });
    });
  })();


  /* ===============================================================
     7. MODUL SOUND
     Efek suara 8-bit dibuat langsung dengan Web Audio API.
     Tidak ada file .mp3, tidak ada autoplay.

     Suara SELALU aktif. AudioContext baru dibuat saat user pertama kali
     berinteraksi (klik START intro, klik tombol, dll), jadi tetap
     memenuhi aturan autoplay browser.
     =============================================================== */
  (function sound() {
    var ctx = null;
    var unlocked = false;

    /* Satu nada pendek ala game 8-bit. */
    function play(kind) {
      // AudioContext hanya dibuat setelah ada interaksi user.
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
      }
      if (ctx.state === 'suspended') ctx.resume();

      // Konfigurasi nada per jenis suara.
      var notes = {
        confirm: { freq: 660, to: 990, dur: 0.07, type: 'square' },
        blip:    { freq: 440, to: 440, dur: 0.04, type: 'square' },
        open:    { freq: 520, to: 780, dur: 0.09, type: 'square' },
        back:    { freq: 520, to: 300, dur: 0.07, type: 'square' }
      };
      var n = notes[kind] || notes.blip;

      var osc  = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = n.type;
      osc.frequency.setValueAtTime(n.freq, ctx.currentTime);
      if (n.to !== n.freq) {
        osc.frequency.linearRampToValueAtTime(n.to, ctx.currentTime + n.dur);
      }

      // Volume kecil supaya tidak mengejutkan.
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + n.dur + 0.02);
    }

    /* Hangatkan AudioContext pada interaksi user pertama (bebas autoplay).
       Ini membuat suara berikutnya langsung berbunyi tanpa jeda. */
    function unlockAudio() {
      if (unlocked) return;
      unlocked = true;
      play('confirm');
    }

    // Interaksi user menandai AudioContext boleh dibangun.
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (type) {
      document.addEventListener(type, unlockAudio, { once: false, passive: true });
    });

    /* Efek suara untuk elemen ber-atribut data-sfx.
       Nama nada yang dipakai di HTML:
         data-sfx="confirm"  -> tombol biasa (VIEW, tombol contact, dll)
         data-sfx="back"     -> tombol tutup modal
       Daftar nada ada di variabel `notes` di atas. */
    $$('[data-sfx]').forEach(function (el) {
      el.addEventListener('click', function () {
        play(el.getAttribute('data-sfx'));
      });
    });

    // Expose agar modul intro & keyboard bisa memanggil suara.
    window.JibalSfx = { play: play };
  })();


  /* ===============================================================
     8. MODUL KEYBOARD
     - Enter / Space pada intro: mulai
     - Esc: tutup modal (dikerjakan <dialog> otomatis)
     - ArrowUp / ArrowDown / PageUp / PageDown: pindah section
     =============================================================== */
  (function keys() {
    var ORDER = ['home', 'about', 'skills', 'projects', 'quest', 'log', 'contact'];
    var intro = $('#intro');

    document.addEventListener('keydown', function (e) {
      // Jangan ganggu saat user mengetik atau ada modal terbuka.
      if (isTyping(document.activeElement)) return;
      if (document.querySelector('dialog[open]')) return;

      // Enter / Space untuk tombol START (jika fokus ada di situ).
      if (intro && !intro.classList.contains('is-out') &&
          (e.key === 'Enter' || e.key === ' ')) {
        if (document.activeElement === document.body) {
          e.preventDefault();
          var btn = $('[data-intro-start]');
          if (btn) btn.click();
        }
        return;
      }

      // Panah atas/bawah untuk pindah antar section.
      var isPrev = e.key === 'ArrowUp'   || e.key === 'PageUp';
      var isNext = e.key === 'ArrowDown' || e.key === 'PageDown';
      if (!isPrev && !isNext) return;

      e.preventDefault();

      // Cari section yang sedang paling dekat dengan tengah layar.
      var mid = window.innerHeight / 2;
      var currentIndex = 0;
      ORDER.forEach(function (id, i) {
        var el = document.getElementById(id);
        if (!el) return;
        var r = el.getBoundingClientRect();
        if (r.top <= mid) currentIndex = i;
      });

      var nextIndex = isNext
        ? Math.min(currentIndex + 1, ORDER.length - 1)
        : Math.max(currentIndex - 1, 0);

      var target = document.getElementById(ORDER[nextIndex]);
      if (!target) return;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET,
        behavior: reduceMotion.matches ? 'auto' : 'smooth'
      });
      if (window.JibalSfx) window.JibalSfx.play('blip');
    });
  })();


  /* ===============================================================
     9. MODUL FX
     Burst pixel ringan: beberapa kotak kecil melesat lalu hilang.
     Sekali jalan, tidak loop. Mati di HP dan mode reduced-motion.
     =============================================================== */
  (function fx() {
    var layer = $('#fxLayer');
    if (!layer) return;

    function burst() {
      // Jangan jalankan di HP atau kalau user minta kurangi animasi.
      if (reduceMotion.matches || isSmallScreen()) return;

      var count = 14;
      var colors = ['', 'fx--blue', 'fx--white', 'fx--purple'];

      for (var i = 0; i < count; i++) {
        (function (i) {
          var p = document.createElement('span');
          p.className = 'fx ' + colors[i % colors.length];

          // Titik awal di tengah layar.
          p.style.left = (window.innerWidth / 2) + 'px';
          p.style.top  = (window.innerHeight / 2) + 'px';

          // Arah acak, jarak 60-180px.
          var angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
          var dist  = 60 + Math.random() * 120;
          p.style.setProperty('--x', Math.cos(angle) * dist + 'px');
          p.style.setProperty('--y', Math.sin(angle) * dist + 'px');
          p.style.setProperty('--d', (Math.random() * 0.08) + 's');

          layer.appendChild(p);

          // Hapus setelah animasi selesai supaya DOM tetap ringan.
          window.setTimeout(function () { p.remove(); }, 1100);
        })(i);
      }
    }

    window.JibalFX = { burst: burst };
  })();

})();
