(function () {
  "use strict";

  var page = document.body.dataset.page || "";
  var navItems = [
    { href: "fleet.html", label: "Fleet", page: "fleet" },
    { href: "index.html", label: "Home", page: "home" },
    { href: "services.html", label: "Services", page: "services" },
    { href: "about.html", label: "About", page: "about" },
    { href: "contact.html", label: "Contact", page: "contact" }
  ];
  var defaultSettings = {
    name: "ANTRAC LOGISTICS LIMITED",
    phone: "0805 152 4246",
    secondaryPhone: "0802 323 7384",
    tertiaryPhone: "0806 666 6431",
    email: "antraclog@gmail.com",
    address: "Citi Car Hire, Transcorp Hilton Hotel, Aguiyi Ironsi Way, Maitama District, Abuja FCT, Nigeria",
    heroDescription: "Premium executive car hire, buses, professional transportation, and general contracting services for every journey."
  };

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
    });
  }

  function navLink(item) {
    var current = page === item.page ? ' aria-current="page"' : "";
    return '<a href="' + item.href + '"' + current + ">" + item.label + "</a>";
  }

  function renderHeader() {
    var host = document.querySelector("[data-site-header]");
    if (!host) return;
    var dark = host.dataset.dark === "true";
    host.innerHTML =
      '<header class="site-header' + (dark ? " site-header--dark" : "") + '">' +
        '<div class="site-header__inner">' +
          '<a class="site-logo" href="index.html" aria-label="ANTRAC home">ANTRAC</a>' +
          '<nav class="site-navigation" aria-label="Primary navigation">' + navItems.map(navLink).join("") + "</nav>" +
          '<a class="header-book" href="booking.html">Book now</a>' +
          '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-navigation" aria-label="Open navigation menu"><span></span><span></span></button>' +
        "</div>" +
        '<nav class="mobile-navigation" id="mobile-navigation" data-open="false" aria-label="Mobile navigation">' + navItems.map(navLink).join("") + '<a href="booking.html">Book now</a></nav>' +
      "</header>";

    var button = host.querySelector(".menu-toggle");
    var mobileNav = host.querySelector(".mobile-navigation");
    function closeMenu() {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation menu");
      mobileNav.dataset.open = "false";
      document.body.classList.remove("menu-open");
    }
    button.addEventListener("click", function () {
      var isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      button.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      mobileNav.dataset.open = String(!isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });
    mobileNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  function renderFooter(settings) {
    var host = document.querySelector("[data-site-footer]");
    if (!host) return;
    settings = { ...defaultSettings, ...(settings || {}) };
    var address = escapeHtml(settings.address).replace(/,\s*/g, ",<br>");
    host.innerHTML =
      '<footer class="site-footer">' +
        '<div class="site-footer__top container">' +
          '<div><a class="footer-logo" href="index.html">ANTRAC</a><p class="site-footer__intro">Executive car hire, bus services, professional transportation, logistics, and general contracting.</p></div>' +
          '<div><p class="footer-label">Contact</p><a href="tel:' + escapeHtml(settings.phone.replace(/\s/g, "")) + '">' + escapeHtml(settings.phone) + '</a><a href="tel:' + escapeHtml(settings.secondaryPhone.replace(/\s/g, "")) + '">' + escapeHtml(settings.secondaryPhone) + '</a><a href="mailto:' + escapeHtml(settings.email) + '">' + escapeHtml(settings.email) + '</a></div>' +
          '<div><p class="footer-label">Location</p><p>' + address + '</p></div>' +
        "</div>" +
        '<div class="site-footer__bottom container"><p>© ' + new Date().getFullYear() + ' ANTRAC LOGISTICS LIMITED. RC: 1630216.</p><p><a href="portfolio.html">Portfolio — Akachukwu Kingsley</a></p></div>' +
      "</footer>";
  }

  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    var feedback = form.querySelector("[data-contact-feedback]");
    var service = form.elements.service;
    var requestedService = new URLSearchParams(window.location.search).get("service");
    if (service && requestedService && Array.from(service.options).some(function (option) { return option.value === requestedService; })) {
      service.value = requestedService;
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      feedback.hidden = false;
      feedback.className = "form-feedback form-feedback--success";
      var serviceName = service && service.selectedIndex >= 0 ? service.options[service.selectedIndex].text.replace(" — enquiry only", "") : "service";
      feedback.textContent = "Thank you. Your " + serviceName + " enquiry is ready. Please call or WhatsApp ANTRAC directly to confirm the next steps.";
      form.reset();
    });
  }

  window.ANTRAC = window.ANTRAC || {};
  function initMapLoading() {
    document.querySelectorAll("[data-map-canvas]").forEach(function (canvas) {
      var frame = canvas.querySelector("[data-map-frame]");
      var loader = canvas.querySelector("[data-map-loader]");
      if (!frame) return;
      function finish() {
        canvas.dataset.loading = "false";
        canvas.classList.add("is-loaded");
        canvas.setAttribute("aria-busy", "false");
        if (loader) loader.hidden = true;
      }
      frame.addEventListener("load", finish, { once: true });
      if (frame.complete) window.setTimeout(finish, 0);
    });
  }
  window.ANTRAC.formatNaira = function (amount) {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
  };

  renderHeader();
  renderFooter(defaultSettings);
  document.querySelectorAll("[data-current-year]").forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });
  initContactForm();
  initMapLoading();
}());
  function initCookieConsent() {
    var key = "antrac-cookie-consent";
    var stored = localStorage.getItem(key);
    var frames = document.querySelectorAll("[data-map-frame][data-src]");
    function enableMaps() { frames.forEach(function (frame) { if (!frame.src) frame.src = frame.dataset.src; var canvas = frame.closest("[data-map-canvas]"); if (canvas) { canvas.dataset.loading = "false"; canvas.classList.add("is-loaded"); var loader = canvas.querySelector("[data-map-loader]"); if (loader) loader.hidden = true; } }); }
    if (stored === "accepted") { enableMaps(); return; }
    var banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie preferences");
    banner.innerHTML = '<p><strong>Your privacy matters.</strong> We use essential storage for this preference. Accepting enables Google Maps, which may set third-party cookies.</p><div><button class="button button--light" type="button" data-cookie-accept>Accept maps</button><button class="button button--outline-light" type="button" data-cookie-decline>Keep maps off</button></div>';
    document.body.appendChild(banner);
    banner.querySelector("[data-cookie-accept]").addEventListener("click", function () { localStorage.setItem(key, "accepted"); enableMaps(); banner.remove(); });
    banner.querySelector("[data-cookie-decline]").addEventListener("click", function () { localStorage.setItem(key, "declined"); banner.remove(); });
  }
  initCookieConsent();
