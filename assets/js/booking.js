(function () {
  "use strict";

  var form = document.querySelector("[data-booking-form]");
  if (!form || !window.ANTRAC_VEHICLES) return;

  var vehicles = window.ANTRAC_VEHICLES;
  var vehicleSelect = document.getElementById("booking-vehicle");
  var pickupDate = form.elements.pickupDate;
  var returnDate = form.elements.returnDate;
  var summary = document.querySelector("[data-booking-summary]");
  var feedback = form.querySelector("[data-booking-feedback]");
  var today = new Date();
  var localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  var requestedVehicle = new URLSearchParams(window.location.search).get("vehicle");

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
    });
  }

  function formatDate(value) {
    if (!value) return "Not selected";
    return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value + "T12:00:00"));
  }

  function daysBetween(start, end) {
    if (!start || !end) return 0;
    var startTime = new Date(start + "T12:00:00").getTime();
    var endTime = new Date(end + "T12:00:00").getTime();
    if (endTime < startTime) return -1;
    return Math.max(1, Math.ceil((endTime - startTime) / 86400000));
  }

  function selectedVehicle() {
    return vehicles.find(function (vehicle) { return vehicle.id === vehicleSelect.value; }) || null;
  }

  function renderSummary() {
    var vehicle = selectedVehicle();
    var rentalDays = daysBetween(pickupDate.value, returnDate.value);
    if (!vehicle) {
      summary.innerHTML = '<p class="summary-empty">Choose a vehicle and dates to see your estimated rental cost.</p>';
      return;
    }
    var amount = rentalDays > 0 ? vehicle.pricePerDay * rentalDays : null;
    var dateWarning = rentalDays === -1 ? '<p class="summary-empty">Your return date needs to be on or after the pickup date.</p>' : "";
    summary.innerHTML =
      '<div class="booking-summary__vehicle"><img src="' + window.ANTRAC.imageRoot + vehicle.image + '" alt="' + escapeHtml(vehicle.name) + '"><div><h3>' + escapeHtml(vehicle.name) + '</h3><p>' + escapeHtml(vehicle.category) + " · " + vehicle.seats + " seats</p></div></div>" +
      '<ul class="summary-list"><li><span>Pickup</span><strong>' + formatDate(pickupDate.value) + '</strong></li><li><span>Return</span><strong>' + formatDate(returnDate.value) + '</strong></li><li><span>Rental duration</span><strong>' + (rentalDays > 0 ? rentalDays + " day" + (rentalDays === 1 ? "" : "s") : "Select dates") + "</strong></li><li><span>Daily estimate</span><strong>" + window.ANTRAC.formatNaira(vehicle.pricePerDay) + "</strong></li></ul>" +
      (amount ? '<div class="summary-total"><span>Estimated rental cost</span><strong>' + window.ANTRAC.formatNaira(amount) + "</strong></div>" : "") + dateWarning;
  }

  function populateVehicleOptions(selectedId) {
    vehicleSelect.innerHTML = '<option value="">Select a vehicle</option>' + vehicles.filter(function (vehicle) { return vehicle.active !== false; }).map(function (vehicle) {
      return '<option value="' + vehicle.id + '"' + (!vehicle.available ? " disabled" : "") + ">" + vehicle.name + " — " + window.ANTRAC.formatNaira(vehicle.pricePerDay) + "/day</option>";
    }).join("");
    if (selectedId && vehicles.some(function (vehicle) { return vehicle.id === selectedId && vehicle.active !== false; })) vehicleSelect.value = selectedId;
  }

  populateVehicleOptions(requestedVehicle);
  pickupDate.min = localToday;
  returnDate.min = localToday;

  pickupDate.addEventListener("change", function () {
    returnDate.min = pickupDate.value || localToday;
    if (returnDate.value && returnDate.value < pickupDate.value) returnDate.value = pickupDate.value;
    renderSummary();
  });
  [vehicleSelect, returnDate].forEach(function (input) { input.addEventListener("change", renderSummary); });
  form.addEventListener("input", function (event) {
    if (event.target === pickupDate || event.target === returnDate) renderSummary();
  });
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (daysBetween(pickupDate.value, returnDate.value) < 1) {
      feedback.hidden = false;
      feedback.className = "form-feedback form-feedback--error";
      feedback.textContent = "Please select a return date on or after your pickup date.";
      return;
    }
    feedback.hidden = false;
    feedback.className = "form-feedback form-feedback--success";
    feedback.textContent = "Your booking details are ready. Please call or WhatsApp ANTRAC to confirm the final arrangements.";
  });
  renderSummary();
}());
