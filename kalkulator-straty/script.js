(function () {
  "use strict";

  
  if (typeof window.openSettingsCookie !== 'function') {
    window.openSettingsCookie = function () {
      console.warn('[cookies] openSettingsCookie(): podłącz właściwe narzędzie do zarządzania zgodami cookie.');
    };
  }

  
  var PRE_AUCTION_PERCENT = 87; 
  var BAILIFF_FEE_PERCENT = 10; 
  var EVICTION_COST = 12000;    

  var state = {
    market: 600000,
    debt: 430000,
    rate: 9.25,
    months: 6,
    appraised: true,
    empty: true,
    rent: 1200,
    sent: false
  };

  function fmt(n) {
    return new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, n)) + ' zł';
  }
  function num(v) {
    var n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }

  // Nie pozwala na zbędne zera wiodące (np. "0600000" -> "600000"), ale nie
  // rusza zapisu dziesiętnego typu "0,25" / "0.25".
  function stripLeadingZero(raw) {
    if (!raw) return raw;
    var cleaned = raw.replace(/^0+(?=[0-9])/, '');
    if (/^0{2,}$/.test(cleaned)) cleaned = '0';
    return cleaned;
  }
  function sanitizeNumberInput(el) {
    var cleaned = stripLeadingZero(el.value);
    if (cleaned !== el.value) el.value = cleaned;
    return cleaned;
  }

  function $(id) { return document.getElementById(id); }

  function setToggle(btn, active) {
    btn.classList.toggle('active', active);
  }

  function resultText(v) {
    return v < 0 ? 'Pozostanie dług ' + fmt(-v) : 'Pozostaje ' + fmt(v);
  }
  function resultColor(v) {
    return v < 0 ? '#c0392f' : '#0f6b4d';
  }

  function render() {
    var s = state;

    var preSale = s.market * PRE_AUCTION_PERCENT / 100;
    var first = s.market * 0.75;
    var second = s.market * (2 / 3);
    var interest = s.debt * (s.rate / 100) * (s.months / 12);
    var fee = s.debt * BAILIFF_FEE_PERCENT / 100;
    var extra = (s.appraised ? 0 : 2000) + s.rent * s.months + (s.empty ? 0 : EVICTION_COST);

    var preRemains = preSale - s.debt;
    var resFirst = first - s.debt - interest - fee - extra;
    var resSecond = second - s.debt - interest - fee - extra;
    var loss = Math.max(0, preRemains - resSecond);
    var reduction = s.debt * 0.4;

    var worst = resSecond;
    var negative = worst < 0;

    setToggle($('btn-appraised-yes'), s.appraised);
    setToggle($('btn-appraised-no'), !s.appraised);
    setToggle($('btn-empty-yes'), s.empty);
    setToggle($('btn-empty-no'), !s.empty);

    var verdictBox = $('verdict-box');
    verdictBox.style.borderColor = negative ? '#e0473f' : '#22b573';
    verdictBox.style.background = negative ? '#fdf3f2' : '#f2fbf6';
    $('verdict-icon').style.background = negative ? '#e0473f' : '#22b573';
    $('verdict-title').textContent = negative ? 'Możesz pozostać z długiem' : 'Po licytacji zostanie nadwyżka';
    var verdictAmount = $('verdict-amount');
    verdictAmount.textContent = fmt(Math.abs(worst));
    verdictAmount.style.color = negative ? '#c0392f' : '#0f6b4d';
    $('verdict-note').textContent = negative ? 'Mimo utraty nieruchomości.' : 'Sprzedaż przed licytacją daje jednak więcej.';

    $('loss-text').textContent = fmt(loss);
    $('seg-1').classList.toggle('active', loss < 20000);
    $('seg-2').classList.toggle('active', loss >= 20000 && loss < 50000);
    $('seg-3').classList.toggle('active', loss >= 50000 && loss < 100000);
    $('seg-4').classList.toggle('active', loss >= 100000);

    $('pre-text').textContent = fmt(preSale);
    $('pre-pct-text').textContent = PRE_AUCTION_PERCENT + '%';
    $('pre-remains-text').textContent = fmt(preRemains);
    $('debt-text-1').textContent = fmt(s.debt);
    $('reduction-text').textContent = fmt(reduction);

    $('first-text').textContent = fmt(first);
    $('debt-text-2').textContent = fmt(s.debt);
    $('interest-text-1').textContent = fmt(interest);
    $('fee-text-1').textContent = fmt(fee);
    $('extra-text-1').textContent = fmt(extra);
    var firstResult = $('first-result-text');
    firstResult.textContent = resultText(resFirst);
    firstResult.style.color = resultColor(resFirst);

    $('second-text').textContent = fmt(second);
    $('debt-text-3').textContent = fmt(s.debt);
    $('interest-text-2').textContent = fmt(interest);
    $('fee-text-2').textContent = fmt(fee);
    $('extra-text-2').textContent = fmt(extra);
    var secondResult = $('second-result-text');
    secondResult.textContent = resultText(resSecond);
    secondResult.style.color = resultColor(resSecond);

    $('contact-sent').style.display = s.sent ? 'block' : 'none';
    $('contact-form').style.display = s.sent ? 'none' : 'flex';
  }

  $('in-market').addEventListener('input', function (e) { state.market = num(sanitizeNumberInput(e.target)); render(); });
  $('in-debt').addEventListener('input', function (e) { state.debt = num(sanitizeNumberInput(e.target)); render(); });
  $('in-rate').addEventListener('input', function (e) { state.rate = num(sanitizeNumberInput(e.target)); render(); });
  $('in-months').addEventListener('input', function (e) { state.months = num(sanitizeNumberInput(e.target)); render(); });
  $('in-rent').addEventListener('input', function (e) { state.rent = num(sanitizeNumberInput(e.target)); render(); });

  $('btn-appraised-yes').addEventListener('click', function () { state.appraised = true; render(); });
  $('btn-appraised-no').addEventListener('click', function () { state.appraised = false; render(); });
  $('btn-empty-yes').addEventListener('click', function () { state.empty = true; render(); });
  $('btn-empty-no').addEventListener('click', function () { state.empty = false; render(); });

  $('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    // TODO: podłączyć wysyłkę formularza do właściwego backendu / CRM.
    state.sent = true;
    render();
  });

 
  var navToggle = $('nav-toggle');
  var siteNav = $('site-nav');
  function setNavOpen(open) {
    siteNav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  }
  navToggle.addEventListener('click', function () {
    setNavOpen(!siteNav.classList.contains('open'));
  });
  siteNav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setNavOpen(false);
  });
  document.addEventListener('click', function (e) {
    if (!siteNav.classList.contains('open')) return;
    if (siteNav.contains(e.target) || navToggle.contains(e.target)) return;
    setNavOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNavOpen(false);
  });

  render();
})();
