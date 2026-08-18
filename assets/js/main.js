(function () {
  "use strict";

  var page = document.body.dataset.page || "";
  var navItems = [
    { href: "fleet.html", label: "Fleet", page: "fleet" },
    { href: "services.html", label: "Services", page: "services" },
    { href: "about.html", label: "About", page: "about" },
    { href: "contact.html", label: "Contact", page: "contact" }
  ];
  var defaultSettings = {
    name: "ANTRAC LOGISTICS LIMITED",
    phone: "0806 666 6431",
    secondaryPhone: "0809 549 4926",
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
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      feedback.hidden = false;
      feedback.className = "form-feedback form-feedback--success";
      feedback.textContent = "Thank you. Please call or WhatsApp ANTRAC directly to confirm your enquiry.";
      form.reset();
    });
  }

  window.ANTRAC = window.ANTRAC || {};
  window.ANTRAC.formatNaira = function (amount) {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
  };

  renderHeader();
  renderFooter(defaultSettings);
  document.querySelectorAll("[data-current-year]").forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });
  initContactForm();
}());
