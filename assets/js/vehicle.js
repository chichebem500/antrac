(function () {
  "use strict";

  var host = document.querySelector("[data-vehicle-detail]");
  if (!host) return;
  var params = new URLSearchParams(window.location.search);

  function renderVehicle() {
    if (!window.ANTRAC || !window.ANTRAC.findVehicle) return;
    var vehicle = window.ANTRAC.findVehicle(params.get("id") || "");
    var imageRoot = window.ANTRAC.imageRoot;
    var formatNaira = window.ANTRAC.formatNaira;
    if (!vehicle) {
      host.innerHTML = '<section class="not-found"><div class="container"><p class="eyebrow">Vehicle not found</p><h1>That vehicle is not in the fleet.</h1><p>Please return to the fleet to view the current ANTRAC options.</p><a class="button button--dark" href="fleet.html">View the fleet</a></div></section>';
      return;
    }
    document.title = vehicle.name + " | ANTRAC Logistics";
    var availability = vehicle.available ? "Available to request" : "Currently unavailable";
    var specs = [["Category", vehicle.category], ["Passengers", vehicle.seats + " seats"], ["Doors", vehicle.doors], ["Transmission", vehicle.transmission], ["Fuel", vehicle.fuel]];
    host.innerHTML =
      '<section class="vehicle-detail"><div class="vehicle-detail__hero">' +
        '<div class="vehicle-detail__main-image"><img src="' + imageRoot + vehicle.image + '" alt="' + vehicle.name + '"></div>' +
        '<div class="vehicle-detail__content"><p class="eyebrow">' + vehicle.category + '</p><h1>' + vehicle.name + '</h1><span class="availability' + (vehicle.available ? "" : " availability--unavailable") + '">' + availability + '</span><p class="vehicle-detail__description">' + vehicle.description + '</p><p class="vehicle-price"><strong>' + formatNaira(vehicle.pricePerDay) + '</strong><span>daily rental rate</span></p><dl class="specification-list">' + specs.map(function (item) { return "<div><dt>" + item[0] + "</dt><dd>" + item[1] + "</dd></div>"; }).join("") + '</dl><div class="button-row"><a class="button button--dark" href="booking.html?vehicle=' + encodeURIComponent(vehicle.id) + '">Book this vehicle</a><a class="button button--outline-dark" href="fleet.html">Back to fleet</a></div></div>' +
      '</div><div class="vehicle-detail__body"><div class="container two-column"><div><p class="eyebrow">Vehicle features</p><h2>Comfort and capability for your itinerary.</h2></div><div class="prose"><p>' + vehicle.description + '</p><ul class="vehicle-features">' + vehicle.features.map(function (feature) { return "<li>" + feature + "</li>"; }).join("") + '</ul><p class="vehicle-detail__terms">The daily rate is shown above. ANTRAC confirms availability and any itinerary-specific requirements before your booking is accepted.</p></div></div></div></section>' +
      '<section class="vehicle-gallery-section"><div class="container"><div class="section-heading"><p class="eyebrow">Vehicle gallery</p><h2>Explore the details.</h2></div><div class="vehicle-gallery">' + vehicle.gallery.map(function (image, index) { return '<figure><img src="' + imageRoot + image + '" alt="' + vehicle.name + ' — image ' + (index + 1) + '"></figure>'; }).join("") + '</div></div></section>';
  }

  document.addEventListener("antrac:vehicles-updated", renderVehicle);
  renderVehicle();
}());
