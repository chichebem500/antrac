(function () {
  "use strict";

  var imageRoot = "assets/images/";
  var vehicles = [
    { id: "toyota-camry-2012-2015", name: "Toyota Camry (2012–2015)", category: "Executive Sedan", pricePerDay: 120000, seats: 5, doors: 4, transmission: "Automatic", fuel: "Petrol", available: true, image: "cars/toyota-camry/main.jpg.jpeg", gallery: ["cars/toyota-camry/main.jpg.jpeg", "cars/toyota-camry/toyota-camry.jpg", "cars/toyota-camry/interiorb.jpg", "cars/toyota-camry/interiora.jpg.jpg", "cars/toyota-camry/toyota-camryi.jpg", "cars/toyota-camry/toyota-camrySE.jpg"], features: ["Air conditioning", "Comfortable cabin", "Professional presentation"], description: "Toyota Camry for executive travel, airport transfers, and comfortable city journeys." },
    { id: "toyota-camry-2020", name: "Toyota Camry (2020)", category: "Executive Sedan", pricePerDay: 200000, seats: 5, doors: 4, transmission: "Automatic", fuel: "Petrol", available: true, image: "cars/toyota-camry/toyota-camry.jpg", gallery: ["cars/toyota-camry/toyota-camry.jpg", "cars/toyota-camry/main.jpg.jpeg", "cars/toyota-camry/interiorb.jpg"], features: ["Executive seating", "Air conditioning", "Airport-ready comfort"], description: "2020 Toyota Camry for polished executive movements and day-to-day transport." },
    { id: "lexus-gx-460", name: "Lexus GX 460", category: "Luxury SUV", pricePerDay: 170000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Petrol", available: true, image: "cars/lexus-rx/lexus-rx.jpeg", gallery: ["cars/lexus-rx/lexus-rx.jpeg"], features: ["Seven-seat capacity", "Luxury SUV comfort", "Climate control"], description: "Lexus GX 460 for comfortable, capable executive transportation." },
    { id: "lexus-lx-570-2020", name: "Lexus LX 570 (2020)", category: "Luxury SUV", pricePerDay: 250000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Petrol", available: true, image: "cars/bullet-proof/lexus/lexus-570.jpeg", gallery: ["cars/bullet-proof/lexus/lexus-570.jpeg", "cars/bullet-proof/lexus/lexus-570-backin.jpeg", "cars/bullet-proof/lexus/lexus-570-side.jpeg", "cars/bullet-proof/lexus/lexus-570-side2.jpeg", "cars/bullet-proof/lexus/driversit.jpeg"], features: ["Premium SUV interior", "Seven-seat capacity", "Executive comfort"], description: "2020 Lexus LX 570 for premium travel and executive movements." },
    { id: "coaster-bus-standard", name: "Coaster Bus", category: "Group Transportation", pricePerDay: 250000, seats: 22, doors: 1, transmission: "Manual", fuel: "Diesel", available: true, image: "cars/toyota-costal-bus/toyota-coaster.jpeg", gallery: ["cars/toyota-costal-bus/toyota-coaster.jpeg", "cars/toyota-costal-bus/73f92b46-b2b3-4a28-bffb-af78c9f21ed8.jpg", "cars/toyota-costal-bus/toyota-coaster-back.jpeg", "cars/toyota-costal-bus/toyota-coaster-inside.jpeg"], features: ["22-passenger capacity", "Air conditioning", "Group itinerary support"], description: "Coaster bus for corporate movements, events, and organised group travel." },
    { id: "coaster-bus-2020", name: "Coaster Bus (2020)", category: "Group Transportation", pricePerDay: 400000, seats: 22, doors: 1, transmission: "Manual", fuel: "Diesel", available: true, image: "cars/toyota-costal-bus/73f92b46-b2b3-4a28-bffb-af78c9f21ed8.jpg", gallery: ["cars/toyota-costal-bus/73f92b46-b2b3-4a28-bffb-af78c9f21ed8.jpg", "cars/toyota-costal-bus/toyota-coaster.jpeg", "cars/toyota-costal-bus/toyota-coaster-inside.jpeg"], features: ["22-passenger capacity", "Air conditioning", "Group itinerary support"], description: "2020 Coaster bus for premium group transportation and planned movements." },
    { id: "toyota-land-cruiser-2019-2020", name: "Toyota Land Cruiser (2019–2020)", category: "Luxury SUV", pricePerDay: 180000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Diesel", available: true, image: "cars/toyota-landcruiser.jpg/OIP.jpg", gallery: ["cars/toyota-landcruiser.jpg/OIP.jpg", "cars/toyota-landcruiser.jpg/OIP.webp"], features: ["Seven-seat capacity", "Four-wheel capability", "Executive road comfort"], description: "Toyota Land Cruiser for dependable executive transportation and longer journeys." },
    { id: "toyota-land-cruiser-2024-2025", name: "Toyota Land Cruiser (2024–2025)", category: "Luxury SUV", pricePerDay: 450000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Diesel", available: true, image: "cars/toyota-landcruiser.jpg/OIP.webp", gallery: ["cars/toyota-landcruiser.jpg/OIP.webp", "cars/toyota-landcruiser.jpg/OIP.jpg"], features: ["Seven-seat capacity", "Premium SUV comfort", "Executive road presence"], description: "2024–2025 Toyota Land Cruiser for high-comfort executive transport." },
    { id: "toyota-hilux-2012-2014", name: "Toyota Hilux (2012–2014)", category: "Utility", pricePerDay: 150000, seats: 5, doors: 4, transmission: "Automatic", fuel: "Diesel", available: true, image: "cars/toyota-hilux/Toyota-Hilux.jpg", gallery: ["cars/toyota-hilux/Toyota-Hilux.jpg", "cars/toyota-hilux/R.jpg"], features: ["Five-seat capacity", "Utility support", "All-road capability"], description: "Toyota Hilux for practical transport, field work, and logistics support." },
    { id: "toyota-hilux-2020", name: "Toyota Hilux (2020)", category: "Utility", pricePerDay: 220000, seats: 5, doors: 4, transmission: "Automatic", fuel: "Diesel", available: true, image: "cars/toyota-hilux/R.jpg", gallery: ["cars/toyota-hilux/R.jpg", "cars/toyota-hilux/Toyota-Hilux.jpg"], features: ["Five-seat capacity", "Modern utility comfort", "All-road capability"], description: "2020 Toyota Hilux for dependable logistics and professional support journeys." },
    { id: "toyota-prado-2020", name: "Toyota Prado (2020)", category: "Luxury SUV", pricePerDay: 150000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Diesel", available: true, image: "cars/toyota-prado/main.jpeg", gallery: ["cars/toyota-prado/main.jpeg", "cars/toyota-prado/back.jpeg", "cars/toyota-prado/inside.jpeg", "cars/toyota-prado/inside-sit.jpeg"], features: ["Seven-seat capacity", "Premium SUV comfort", "Climate control"], description: "2020 Toyota Prado for comfortable executive and family journeys." },
    { id: "toyota-prado-2025", name: "Toyota Prado (2025)", category: "Luxury SUV", pricePerDay: 400000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Diesel", available: true, image: "cars/toyota-prado/back.jpeg", gallery: ["cars/toyota-prado/back.jpeg", "cars/toyota-prado/main.jpeg", "cars/toyota-prado/inside.jpeg", "cars/toyota-prado/inside-sit.jpeg"], features: ["Seven-seat capacity", "New-generation comfort", "Executive road presence"], description: "2025 Toyota Prado for premium executive transport and extended journeys." },
    { id: "toyota-land-cruiser-bp-2020", name: "Toyota Land Cruiser BP (2020)", category: "Secure Transportation", pricePerDay: 500000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Petrol", available: true, image: "cars/bullet-proof/land-curiser/2020-bulletproof/main.jpeg", gallery: ["cars/bullet-proof/land-curiser/2020-bulletproof/main.jpeg", "cars/bullet-proof/land-curiser/2020-bulletproof/main-back.jpeg", "cars/bullet-proof/land-curiser/2020-bulletproof/back-bullet-proof.jpeg", "cars/bullet-proof/land-curiser/2020-bulletproof/back-proof.jpeg", "cars/bullet-proof/land-curiser/2020-bulletproof/inside-bullet-proof.jpeg"], features: ["Enhanced protection", "Seven-seat capacity", "Professional discretion"], description: "2020 Toyota Land Cruiser BP for specialist transportation requirements." },
    { id: "toyota-land-cruiser-bp-2025", name: "Toyota Land Cruiser BP (2025)", category: "Secure Transportation", pricePerDay: 1000000, seats: 7, doors: 5, transmission: "Automatic", fuel: "Petrol", available: true, image: "cars/bullet-proof/land-curiser/2025-bullet-proof/main.jpeg", gallery: ["cars/bullet-proof/land-curiser/2025-bullet-proof/main.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/main-back.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/back-side.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/bullet-proof-back,.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/driversit-bullet-proof.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/front-bulletproof.jpeg", "cars/bullet-proof/land-curiser/2025-bullet-proof/sit-bullet-proof.jpeg"], features: ["Enhanced protection", "Seven-seat capacity", "Professional discretion"], description: "2025 Toyota Land Cruiser BP for specialist transportation requirements." }
  ];

  function formatNaira(amount) {
    return window.ANTRAC && window.ANTRAC.formatNaira ? window.ANTRAC.formatNaira(amount) : "₦" + amount.toLocaleString("en-NG");
  }

  function vehicleCard(vehicle) {
    var specs = [vehicle.seats + " seats", vehicle.transmission, vehicle.fuel].join(" · ");
    return '<article class="vehicle-card">' +
      '<a class="vehicle-card__image" href="vehicle.html?id=' + encodeURIComponent(vehicle.id) + '" aria-label="View ' + vehicle.name + '"><img src="' + imageRoot + vehicle.image + '" alt="' + vehicle.name + '">' + (!vehicle.available ? '<span class="vehicle-card__unavailable">Unavailable</span>' : "") + "</a>" +
      '<div class="vehicle-card__body"><p class="eyebrow">' + vehicle.category + "</p><h3>" + vehicle.name + '</h3><p class="vehicle-card__details">' + specs + '</p><div class="vehicle-card__bottom"><div class="vehicle-card__price"><strong>' + formatNaira(vehicle.pricePerDay) + '</strong><span>Daily rate</span></div><div class="vehicle-card__actions"><a href="vehicle.html?id=' + encodeURIComponent(vehicle.id) + '">View details</a><a href="booking.html?vehicle=' + encodeURIComponent(vehicle.id) + '">Book now</a></div></div></div>' +
    "</article>";
  }

  function renderHomeFleet() {
    var host = document.querySelector("[data-home-fleet]");
    if (!host) return;
    var featuredIds = ["toyota-camry-2020", "toyota-land-cruiser-2024-2025", "toyota-land-cruiser-bp-2025"];
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
    render();
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
}());
