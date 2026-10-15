/*
 * mieducacion.es — estadísticas con Google Analytics 4 y aviso de cookies.
 *
 * Este archivo lo cargan los 4 sitios (inicio, libros, cuadernos y verbos):
 *   <script src="https://mieducacion.es/analytics.js" defer></script>
 *
 * UNICO lugar donde se configura el ID de medición: la constante GA_ID de abajo.
 * Mientras tenga el valor de ejemplo (G-XXXXXXXXXX) este archivo no hace nada:
 * ni muestra el aviso ni contacta a Google.
 *
 * Privacidad: Google Analytics NO se carga hasta que la persona pulsa "Aceptar".
 * Si rechaza (o su navegador envía la señal Global Privacy Control), no se
 * contacta a Google. Se desactivan las señales de publicidad de Google.
 */
(function () {
  "use strict";

  var GA_ID = "G-68R2XWJ36R"; // ID de medición de Google Analytics 4 (empieza con G-)

  if (GA_ID === "G-XXXXXXXXXX" || !/^G-[A-Z0-9]{6,}$/.test(GA_ID)) return;

  var KEY = "mie_cookies";
  var https = location.protocol === "https:";
  var isMie = /(^|\.)mieducacion\.es$/.test(location.hostname);
  var cookieDomain = isMie ? "; domain=.mieducacion.es" : "";

  // ----------------------------------------------------------- consentimiento
  function getChoice() {
    var m = document.cookie.match(new RegExp("(?:^|; )" + KEY + "=([^;]*)"));
    if (m) return m[1];
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    document.cookie = KEY + "=" + v + "; max-age=31536000; path=/; SameSite=Lax" + (https ? "; Secure" : "") + cookieDomain;
    try { localStorage.setItem(KEY, v); } catch (e) { /* sin almacenamiento: no pasa nada */ }
  }

  // --------------------------------------------------------- Google Analytics
  var loaded = false;
  function loadGA() {
    if (loaded) return;
    loaded = true;
    window["ga-disable-" + GA_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted",
    });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: "auto",
      cookie_flags: "SameSite=Lax" + (https ? ";Secure" : ""),
    });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }
  function stopGA() {
    window["ga-disable-" + GA_ID] = true;
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name !== "_ga" && name.indexOf("_ga_") !== 0) return;
      var past = "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie = name + past;
      document.cookie = name + past + "; domain=" + location.hostname;
      document.cookie = name + past + "; domain=.mieducacion.es";
    });
  }

  // Eventos propios (juegos, etc.): no hacen nada si no hay consentimiento.
  window.mieTrack = function (name, params) {
    if (window.gtag && getChoice() === "granted") window.gtag("event", name, params || {});
  };

  // ------------------------------------------------------------------- aviso
  function injectStyle() {
    if (document.getElementById("mie-cookie-style")) return;
    var st = document.createElement("style");
    st.id = "mie-cookie-style";
    st.textContent =
      "#mie-cookie-banner{position:fixed;left:12px;right:12px;bottom:12px;max-width:780px;margin:0 auto;z-index:99999;" +
      "background:#1e332c;color:#f4f1e6;border:1.5px solid #4a6459;border-radius:16px;padding:14px 18px;" +
      "font:14px/1.45 'Segoe UI',system-ui,sans-serif;display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center;" +
      "box-shadow:0 14px 34px -10px #000c}" +
      "#mie-cookie-banner p{margin:0;flex:1;min-width:240px}" +
      "#mie-cookie-banner .mie-btns{display:flex;gap:8px}" +
      "#mie-cookie-banner button{font:inherit;font-weight:700;cursor:pointer;border-radius:999px;padding:8px 20px;" +
      "border:1.5px solid #8fae9c;background:transparent;color:#f4f1e6}" +
      "#mie-cookie-banner button.mie-yes{background:#f0c94a;border-color:#f0c94a;color:#16241f}" +
      "#mie-cookie-pref{position:fixed;left:8px;bottom:6px;z-index:9999;font:11px 'Segoe UI',system-ui,sans-serif;" +
      "background:none;border:none;color:#a9bdb2;opacity:.6;cursor:pointer;text-decoration:underline;padding:2px 4px}" +
      "#mie-cookie-pref:hover{opacity:1}" +
      "@media print{#mie-cookie-banner,#mie-cookie-pref{display:none!important}}";
    document.head.appendChild(st);
  }
  function showBanner() {
    if (document.getElementById("mie-cookie-banner")) return;
    injectStyle();
    var d = document.createElement("div");
    d.id = "mie-cookie-banner";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-label", "Cookies de estadísticas");
    d.innerHTML =
      "<p>Usamos Google Analytics para contar cuántas personas usan estos recursos y mejorar el contenido. " +
      "No pedimos datos personales ni usamos publicidad. ¿Aceptas las cookies de estadísticas?</p>" +
      '<div class="mie-btns"><button type="button" class="mie-yes">Aceptar</button><button type="button" class="mie-no">Rechazar</button></div>';
    d.querySelector(".mie-yes").addEventListener("click", function () { setChoice("granted"); d.remove(); loadGA(); });
    d.querySelector(".mie-no").addEventListener("click", function () { setChoice("denied"); d.remove(); stopGA(); });
    document.body.appendChild(d);
  }
  function addPrefLink() {
    var copy = document.querySelector(".copyright");
    var a = document.createElement(copy ? "a" : "button");
    a.textContent = "Cookies";
    if (copy) { a.href = "#"; a.style.color = "inherit"; copy.appendChild(document.createTextNode(" · ")); copy.appendChild(a); }
    else { a.id = "mie-cookie-pref"; a.type = "button"; injectStyle(); document.body.appendChild(a); }
    a.addEventListener("click", function (e) { e.preventDefault(); showBanner(); });
  }

  function start() {
    var gpc = navigator.globalPrivacyControl === true;
    var choice = gpc ? "denied" : getChoice();
    addPrefLink();
    if (choice === "granted") loadGA();
    else if (choice !== "denied") showBanner();
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
