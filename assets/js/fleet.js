(function () {
  "use strict";

  var imageRoot = "assets/images/";
  var vehicles = [
    { id: "toyota-camry", name: "Toyota Camry", category: "Executive Sedan", pricePerDay: 120000, deposit: 60000, seats: 5, doors: 4, transmission: "Automatic", fuel: "Petrol", mileage: "250 km / day", minimumAge: 25, available: true, image: "cars/toyota-camry/main.jpg.jpeg", gallery: ["cars/toyota-camry/main.jpg.jpeg", "cars/toyota-camry/toyota-camry.jpg", "cars/toyota-camry/interiorb.jpg", "cars/toyota-camry/interiora.jpg.jpg", "cars/toyota-camry/toyota-camryi.jpg", "cars/toyota-camry/toyota-camrySE.jpg"], features: ["Climate control", "Leather seating", "Bluetooth audio", "Executive rear comfort"], description: "A refined sedan for professional journeys, airport transfers, and executive travel." },
    { id: "toyota-corolla", name: "Toyota Corolla", category: "Executive Sedan", pricePerDay: 90000, deposit: 45000, seats: 5, doors: 4, transmission: "Automatic", fuel: "Petrol", mileage: "250 km / day", minimumAge: 25, available: true, image: "cars/toyota-corolla/Toyota Corolla.jpg", gallery: ["cars/toyota-corolla/Toyota Corolla.jpg", "cars/toyota-corolla/OIP.webp"], features: ["Air conditioning", "Bluetooth audio", "Comfortable cabin", "Airport-ready luggage space"], description: "A practical and comfortable sedan for reliable city and inter-city travel." },
    { id: "lexus-rx", name: "Lexus RX", category: "Luxury SUV", pricePerDay: 280000, deposit: 140000, seats: 5, doors: 5, transmission: "Automatic", fuel: "Petrol", mileage: "220 km / day", minimumAge: 28, available: true, image: "cars/lexus-rx/lexus-rx.jpeg", gallery: ["cars/lexus-rx/lexus-rx.jpeg"], features: ["Premium leather interior", "Climate control", "SUV luggage capacity", "Executive comfort"], description: "A premium SUV option with a calm, executive presence for discerning passengers." },
    { id: "mercedes-benz", name: "Mercedes-Benz", category: "Luxury SUV", pricePerDay: 350000, deposit: 175000, seats: 5, doors: 5, transmission: "Automatic", fuel: "Petrol", mileage: "220 km / day", minimumAge: 28, available: true, image: "cars/mercedes-benz/mercedes-benz.jpeg", gallery: ["cars/mercedes-benz/mercedes-benz.jpeg"], features: ["Premium cabin", "Climate control", "Executive rear comfort", "Professional chauffeur option"], description: "Executive transport that pairs premium comfort with a polished arrival." },
    { id: "coaster-bus", name: "Coaster Bus", category: "Group Transportation", pricePerDay: 500000, deposit: 250000, seats: 22, doors: 1, transmission: "Manual", fuel: "Diesel", mileage: "250 km / day", minimumAge: 30, available: true, image: "cars/toyota-costal-bus/toyota-coaster.jpeg", gallery: ["cars/toyota-costal-bus/toyota-coaster.jpeg", "cars/toyota-costal-bus/73f92b46-b2b3-4a28-bffb-af78c9f21ed8.jpg", "cars/toyota-costal-bus/toyota-coaster-back.jpeg", "cars/toyota-costal-bus/toyota-coaster-inside.jpeg"], features: ["22-passenger capacity", "Air conditioning", "Luggage storage", "Group itinerary support"], description: "A spacious group transport solution for corporate movements, events, and organised travel." },
    { id: "toyota-land-cruiser", name: "Toyota Land Cruiser", category: "Luxury SUV", pricePerDay: 450000, deposit: 225000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Diesel", mileage: "220 km / day", minimumAge: 30, available: true, image: "cars/toyota-landcruiser.jpg/OIP.jpg", gallery: ["cars/toyota-landcruiser.jpg/OIP.jpg", "cars/toyota-landcruiser.jpg/OIP.webp"], features: ["Seven-seat capacity", "Four-wheel capability", "Premium interior", "Executive road comfort"], description: "A capable SUV for comfortable executive transport and demanding journeys." },
    { id: "range-rover-vogue", name: "Range Rover Vogue", category: "Luxury SUV", pricePerDay: 500000, deposit: 250000, seats: 5, doors: 5, transmission: "Automatic", fuel: "Petrol", mileage: "200 km / day", minimumAge: 30, available: true, image: "cars/range-rover-vogue/range-rover.jpg", gallery: ["cars/range-rover-vogue/range-rover.jpg", "cars/range-rover-vogue/range-rover (2).jpg", "cars/range-rover-vogue/range-rover (3).jpg", "cars/range-rover-vogue/range-rover (4).jpg"], features: ["Luxury leather interior", "Panoramic comfort", "Climate control", "Executive arrival"], description: "A statement SUV for clients seeking luxury, comfort, and presence." },
    { id: "toyota-hilux", name: "Toyota Hilux", category: "Utility", pricePerDay: 170000, deposit: 85000, seats: 5, doors: 4, transmission: "Automatic", fuel: "Diesel", mileage: "250 km / day", minimumAge: 28, available: true, image: "cars/toyota-hilux/Toyota-Hilux.jpg", gallery: ["cars/toyota-hilux/Toyota-Hilux.jpg", "cars/toyota-hilux/R.jpg"], features: ["Durable utility capacity", "Climate control", "Five seats", "Project support ready"], description: "A flexible utility vehicle for professional support and contracting requirements." },
    { id: "toyota-prado", name: "Toyota Prado", category: "Luxury SUV", pricePerDay: 350000, deposit: 175000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Diesel", mileage: "220 km / day", minimumAge: 28, available: true, image: "cars/toyota-prado/main.jpeg", gallery: ["cars/toyota-prado/main.jpeg", "cars/toyota-prado/back.jpeg", "cars/toyota-prado/inside.jpeg", "cars/toyota-prado/inside-sit.jpeg"], features: ["Seven seats", "Premium SUV comfort", "Climate control", "All-road capability"], description: "A premium SUV for comfortable executive transport and extended journeys." },
    { id: "2020-bulletproof-toyota-land-cruiser", name: "2020 Bulletproof Toyota Land Cruiser", category: "Secure Transportation", pricePerDay: 1200000, deposit: 600000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Petrol", mileage: "By arrangement", minimumAge: 30, available: true, image: "cars/bullet-proof/land-curiser/2020-bulletproof/main.jpeg", gallery: ["cars/bullet-proof/land-curiser/2020-bulletproof/main.jpeg", "cars/bullet-proof/land-curiser/2020-bulletproof/main-back.jpeg", "cars/bullet-proof/land-curiser/2020-bulletproof/back-bullet-proof.jpeg", "cars/bullet-proof/land-curiser/2020-bulletproof/back-proof.jpeg", "cars/bullet-proof/land-curiser/2020-bulletproof/inside-bullet-proof.jpeg"], features: ["Enhanced protection", "Seven seats", "Security coordination available", "Professional discretion"], description: "A 2020 bullet-resistant Toyota Land Cruiser for journeys that require enhanced protection and professional coordination." },
    { id: "2025-bulletproof-toyota-land-cruiser", name: "2025 Bulletproof Toyota Land Cruiser", category: "Secure Transportation", pricePerDay: 1500000, deposit: 750000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Petrol", mileage: "By arrangement", minimumAge: 30, available: true, image: "cars/bullet-proof/land-curiser/2025-bullet-proof/main.jpeg", gallery: ["cars/bullet-proof/land-curiser/2025-bullet-proof/main.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/main-back.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/back-side.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/bullet-proof-back,.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/driversit-bullet-proof.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/front-bulletproof.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/sit-bullet-proof.jpeg"], features: ["Enhanced protection", "New-generation vehicle", "Seven seats", "Security coordination available"], description: "A 2025 bullet-resistant Toyota Land Cruiser for high-security transportation requirements, subject to appropriate arrangements." },
    { id: "bulletproof-lexus-lx-570", name: "Bulletproof Lexus LX 570", category: "Secure Transportation", pricePerDay: 1100000, deposit: 550000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Petrol", mileage: "By arrangement", minimumAge: 30, available: true, image: "cars/bullet-proof/lexus/lexus-570.jpeg", gallery: ["cars/bullet-proof/lexus/lexus-570.jpeg", "cars/bullet-proof/lexus/lexus-570-backin.jpeg", "cars/bullet-proof/lexus/lexus-570-side.jpeg", "cars/bullet-proof/lexus/lexus-570-side2.jpeg", "cars/bullet-proof/lexus/driversit.jpeg"], features: ["Enhanced protection", "Premium Lexus cabin", "Seven seats", "Discreet service"], description: "A bullet-resistant Lexus LX 570 that combines executive comfort with enhanced protection for specialised journeys." }
  ];

  function formatNaira(amount) {
    return window.ANTRAC && window.ANTRAC.formatNaira ? window.ANTRAC.formatNaira(amount) : "₦" + amount.toLocaleString("en-NG");
  }

  function vehicleCard(vehicle) {
    var specs = [vehicle.seats + " seats", vehicle.transmission, vehicle.fuel].join(" · ");
    return '<article class="vehicle-card">' +
      '<a class="vehicle-card__image" href="vehicle.html?id=' + encodeURIComponent(vehicle.id) + '" aria-label="View ' + vehicle.name + '"><img src="' + imageRoot + vehicle.image + '" alt="' + vehicle.name + '">' + (!vehicle.available ? '<span class="vehicle-card__unavailable">Unavailable</span>' : "") + "</a>" +
      '<div class="vehicle-card__body"><p class="eyebrow">' + vehicle.category + "</p><h3>" + vehicle.name + '</h3><p class="vehicle-card__details">' + specs + '</p><div class="vehicle-card__bottom"><div class="vehicle-card__price"><strong>' + formatNaira(vehicle.pricePerDay) + '</strong><span>Estimated / day</span></div><div class="vehicle-card__actions"><a href="vehicle.html?id=' + encodeURIComponent(vehicle.id) + '">View details</a><a href="booking.html?vehicle=' + encodeURIComponent(vehicle.id) + '">Book now</a></div></div></div>' +
    "</article>";
  }

  function renderHomeFleet() {
    var host = document.querySelector("[data-home-fleet]");
    if (!host) return;
    var featuredIds = ["mercedes-benz", "range-rover-vogue", "2025-bulletproof-toyota-land-cruiser"];
    var featured = featuredIds.map(function (id) { return vehicles.find(function (vehicle) { return vehicle.id === id; }); }).filter(Boolean);
    if (featured.length < 3) featured = featured.concat(vehicles.filter(function (vehicle) { return featured.indexOf(vehicle) < 0; }).slice(0, 3 - featured.length));
    host.innerHTML = featured.map(vehicleCard).join("");
  }

  function initFleetPage() {
    var grid = document.querySelector("[data-fleet-grid]");
    if (!grid) return;
    var search = document.getElementById("vehicle-search");
    var category = document.getElementById("category-filter");
    var price = document.getElementById("price-filter");
    var seats = document.getElementById("seats-filter");
    var transmission = document.getElementById("transmission-filter");
    var count = document.querySelector("[data-fleet-count]");
    var empty = document.querySelector("[data-fleet-empty]");
    var categories = Array.from(new Set(vehicles.map(function (vehicle) { return vehicle.category; }))).sort();
    category.insertAdjacentHTML("beforeend", categories.map(function (item) { return '<option value="' + item + '">' + item + "</option>"; }).join(""));
    function render() {
      var query = search.value.trim().toLowerCase();
      var filtered = vehicles.filter(function (vehicle) {
        return (!query || (vehicle.name + " " + vehicle.category).toLowerCase().includes(query)) &&
          (!category.value || vehicle.category === category.value) &&
          (!price.value || vehicle.pricePerDay <= Number(price.value)) &&
          (!seats.value || vehicle.seats >= Number(seats.value)) &&
          (!transmission.value || vehicle.transmission === transmission.value);
      });
      grid.innerHTML = filtered.map(vehicleCard).join("");
      count.textContent = filtered.length + " vehicle" + (filtered.length === 1 ? "" : "s") + " found";
      empty.hidden = filtered.length !== 0;
    }
    [search, category, price, seats, transmission].forEach(function (input) { input.addEventListener("input", render); input.addEventListener("change", render); });
    document.querySelector("[data-clear-filters]").addEventListener("click", function () { search.value = ""; category.value = ""; price.value = ""; seats.value = ""; transmission.value = ""; render(); });
    document.addEventListener("antrac:vehicles-updated", render);
    render();
  }

  function synchronizeVehicles(updatedVehicles) {
    if (!Array.isArray(updatedVehicles) || !updatedVehicles.length) return;
    vehicles.splice.apply(vehicles, [0, vehicles.length].concat(updatedVehicles));
    window.ANTRAC_VEHICLES = vehicles;
    renderHomeFleet();
    document.dispatchEvent(new Event("antrac:vehicles-updated"));
  }

  window.ANTRAC_VEHICLES = vehicles;
  window.ANTRAC = window.ANTRAC || {};
  window.ANTRAC.imageRoot = imageRoot;
  window.ANTRAC.findVehicle = function (id) {
    var numeric = Number(id);
    if (Number.isInteger(numeric) && numeric > 0) return vehicles[numeric - 1] || null;
    return vehicles.find(function (vehicle) { return vehicle.id === id; }) || null;
  };
  window.ANTRAC.vehicleCard = vehicleCard;

  renderHomeFleet();
  initFleetPage();
  fetch("/api/cars")
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(synchronizeVehicles)
    .catch(function () { /* Static-file fallback keeps the public fleet usable. */ });
}());
