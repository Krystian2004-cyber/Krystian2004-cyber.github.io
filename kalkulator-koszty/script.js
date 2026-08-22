(function () {
  "use strict";


  if (typeof window.openSettingsCookie !== 'function') {
    window.openSettingsCookie = function () {
      console.warn('[cookies] openSettingsCookie(): podłącz właściwe narzędzie do zarządzania zgodami cookie.');
    };
  }


  var PCC_PERCENT = 2;
  var VAT_PERCENT = 23;
  var FEE_ENTRY = 200;
  var FEE_NEW_KW = 100;
  var FEE_MORTGAGE = 200;

  var state = {
    price: 500000,
    pcc: true,
    entryOwnership: true,
    newKW: false,
    mortgageEntry: false,
    copies: 4,
    copyPrice: 6,
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

  // Progresywna tabela maksymalnej taksy notarialnej (netto) wg wartości
  // przedmiotu czynności — Rozporządzenie Ministra Sprawiedliwości ws.
  // maksymalnych stawek taksy notarialnej.
  function notaryFeeNet(value) {
    var v = Math.max(0, value);
    if (v <= 3000) return 100;
    if (v <= 10000) return 100 + 0.03 * (v - 3000);
    if (v <= 30000) return 310 + 0.02 * (v - 10000);
    if (v <= 60000) return 710 + 0.01 * (v - 30000);
    if (v <= 1000000) return 1010 + 0.004 * (v - 60000);
    if (v <= 2000000) return 4770 + 0.002 * (v - 1000000);
    return Math.min(6770 + 0.0025 * (v - 2000000), 10000);
  }

  function render() {
    var s = state;

    var notaryNet = notaryFeeNet(s.price);
    var notaryVat = notaryNet * (VAT_PERCENT / 100);
    var notaryGross = notaryNet + notaryVat;

    var pcc = s.pcc ? s.price * (PCC_PERCENT / 100) : 0;
    var courtEntry = s.entryOwnership ? FEE_ENTRY : 0;
    var courtNewKw = s.newKW ? FEE_NEW_KW : 0;
    var courtMortgage = s.mortgageEntry ? FEE_MORTGAGE : 0;
    var taxTotal = pcc + courtEntry + courtNewKw + courtMortgage;

    var copiesNet = Math.max(0, s.copies) * Math.max(0, s.copyPrice);
    var copiesVat = copiesNet * (VAT_PERCENT / 100);
    var copiesGross = copiesNet + copiesVat;

    var total = notaryGross + taxTotal + copiesGross;

    setToggle($('btn-pcc-yes'), s.pcc);
    setToggle($('btn-pcc-no'), !s.pcc);
    setToggle($('btn-entry-yes'), s.entryOwnership);
    setToggle($('btn-entry-no'), !s.entryOwnership);
    setToggle($('btn-newkw-yes'), s.newKW);
    setToggle($('btn-newkw-no'), !s.newKW);
    setToggle($('btn-mortgage-yes'), s.mortgageEntry);
    setToggle($('btn-mortgage-no'), !s.mortgageEntry);

    $('verdict-amount').textContent = fmt(total);

    $('notary-net-text').textContent = fmt(notaryNet);
    $('notary-vat-text').textContent = fmt(notaryVat);
    $('notary-gross-text').textContent = fmt(notaryGross);
    $('notary-gross-text-2').textContent = fmt(notaryGross);

    $('pcc-text').textContent = fmt(pcc);
    $('entry-text').textContent = fmt(courtEntry);
    $('newkw-text').textContent = fmt(courtNewKw);
    $('mortgage-text').textContent = fmt(courtMortgage);
    $('tax-total-text').textContent = fmt(taxTotal);
    $('tax-total-text-2').textContent = fmt(taxTotal);

    $('copies-count-text').textContent = String(Math.max(0, Math.round(s.copies)));
    $('copy-price-text').textContent = fmt(s.copyPrice);
    $('copies-net-text').textContent = fmt(copiesNet);
    $('copies-vat-text').textContent = fmt(copiesVat);
    $('copies-gross-text').textContent = fmt(copiesGross);
    $('copies-gross-text-2').textContent = fmt(copiesGross);

    $('contact-sent').style.display = s.sent ? 'block' : 'none';
    $('contact-form').style.display = s.sent ? 'none' : 'flex';
  }

  $('in-price').addEventListener('input', function (e) { state.price = num(sanitizeNumberInput(e.target)); render(); });
  $('in-copies').addEventListener('input', function (e) { state.copies = num(sanitizeNumberInput(e.target)); render(); });
  $('in-copy-price').addEventListener('input', function (e) { state.copyPrice = num(sanitizeNumberInput(e.target)); render(); });

  $('btn-pcc-yes').addEventListener('click', function () { state.pcc = true; render(); });
  $('btn-pcc-no').addEventListener('click', function () { state.pcc = false; render(); });
  $('btn-entry-yes').addEventListener('click', function () { state.entryOwnership = true; render(); });
  $('btn-entry-no').addEventListener('click', function () { state.entryOwnership = false; render(); });
  $('btn-newkw-yes').addEventListener('click', function () { state.newKW = true; render(); });
  $('btn-newkw-no').addEventListener('click', function () { state.newKW = false; render(); });
  $('btn-mortgage-yes').addEventListener('click', function () { state.mortgageEntry = true; render(); });
  $('btn-mortgage-no').addEventListener('click', function () { state.mortgageEntry = false; render(); });

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
