(function () {
  "use strict";
  var loginSection = document.querySelector("[data-admin-login]");
  var app = document.querySelector("[data-admin-app]");
  var state = { cars: [], orders: [], settings: {}, enquiries: [] };

  function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, function (character) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]; }); }
  function formatNaira(value) { return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(Number(value || 0)); }
  function formatDate(value) { return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }
  async function request(url, options) {
    var response;
    try {
      response = await fetch(url, { headers: { "Content-Type": "application/json", ...(options && options.headers) }, ...options });
    } catch {
      throw new Error("Unable to reach the ANTRAC admin server. Confirm that you opened http://localhost:3000/admin.html.");
    }
    var body = await response.json().catch(function () { return {}; });
    if (!response.ok) {
      if (body.error) throw new Error(body.error);
      if (response.status === 404) throw new Error("The admin server was not found. Open this page through http://localhost:3000/admin.html, not a static preview.");
      throw new Error("The server returned an unexpected response. Please reload http://localhost:3000/admin.html and try again.");
    }
    return body;
  }
  function feedback(selector, message, type) { var element = document.querySelector(selector); element.hidden = false; element.className = "form-feedback form-feedback--" + type; element.textContent = message; }
  function setSignedIn(signedIn) { loginSection.hidden = signedIn; app.hidden = !signedIn; }
  function objectFromForm(form) { return Object.fromEntries(new FormData(form)); }
  function setTab(name) { document.querySelectorAll("[data-admin-panel]").forEach(function (panel) { panel.hidden = panel.dataset.adminPanel !== name; }); document.querySelectorAll("[data-admin-tab]").forEach(function (button) { button.classList.toggle("is-active", button.dataset.adminTab === name); }); document.querySelector("[data-admin-title]").textContent = ({ overview: "Overview", cars: "Fleet", orders: "Orders", enquiries: "Enquiries", settings: "Website settings" })[name]; }

  function renderStats(overview) { document.querySelector("[data-admin-stats]").innerHTML = [["Fleet vehicles", overview.vehicles], ["Available now", overview.availableVehicles], ["Booking orders", overview.orders], ["Pending orders", overview.pendingOrders], ["Enquiries", overview.enquiries]].map(function (item) { return '<article><span>' + item[0] + '</span><strong>' + item[1] + "</strong></article>"; }).join(""); }
  function renderCars() { var host = document.querySelector("[data-cars-table]"); host.innerHTML = state.cars.map(function (car) { return '<tr><td><div class="admin-car-name"><img src="' + escapeHtml(car.image) + '" alt=""><strong>' + escapeHtml(car.name) + '</strong></div></td><td>' + escapeHtml(car.category) + "</td><td>" + formatNaira(car.pricePerDay) + '</td><td><span class="admin-status admin-status--' + (car.available && car.active ? "active" : "inactive") + '">' + (car.available && car.active ? "Available" : "Hidden / unavailable") + '</span></td><td class="admin-table__actions"><button type="button" data-edit-car="' + escapeHtml(car.id) + '">Edit</button><button type="button" data-delete-car="' + escapeHtml(car.id) + '">Remove</button></td></tr>'; }).join("") || '<tr><td colspan="5" class="admin-empty">No vehicles yet. Add the first vehicle above.</td></tr>';
  }
  function renderOrders() { var host = document.querySelector("[data-orders-list]"); host.innerHTML = state.orders.map(function (order) { return '<article class="admin-order"><div><p class="eyebrow">' + escapeHtml(order.status) + ' · ' + formatDate(order.createdAt) + '</p><h3>' + escapeHtml(order.vehicleName) + " — " + escapeHtml(order.customerName) + '</h3><p>' + escapeHtml(order.pickupLocation) + " → " + escapeHtml(order.dropoffLocation) + " · " + escapeHtml(order.pickupDate) + " to " + escapeHtml(order.returnDate) + '</p><p><a href="tel:' + escapeHtml(order.phone.replace(/\s/g, "")) + '">' + escapeHtml(order.phone) + '</a> · <a href="mailto:' + escapeHtml(order.email) + '">' + escapeHtml(order.email) + '</a></p>' + (order.notes ? '<p class="admin-order__note">' + escapeHtml(order.notes) + "</p>" : "") + '</div><div class="admin-order__action"><strong>' + formatNaira(order.estimatedTotal) + '</strong><select data-order-status="' + escapeHtml(order.id) + '">' + ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(function (status) { return '<option value="' + status + '"' + (order.status === status ? " selected" : "") + ">" + status.charAt(0) + status.slice(1).toLowerCase() + "</option>"; }).join("") + "</select></div></article>"; }).join("") || '<p class="admin-empty">No booking orders have been received yet.</p>';
  }
  function renderEnquiries() { document.querySelector("[data-enquiries-list]").innerHTML = state.enquiries.map(function (item) { return '<article class="admin-order"><div><p class="eyebrow">' + formatDate(item.createdAt) + '</p><h3>' + escapeHtml(item.name) + '</h3><p><a href="tel:' + escapeHtml(item.phone.replace(/\s/g, "")) + '">' + escapeHtml(item.phone) + '</a> · <a href="mailto:' + escapeHtml(item.email) + '">' + escapeHtml(item.email) + '</a></p><p class="admin-order__note">' + escapeHtml(item.message) + '</p></div></article>'; }).join("") || '<p class="admin-empty">No contact enquiries have been received yet.</p>'; }
  function renderSettings() { var form = document.querySelector("[data-settings-form]"); Object.keys(state.settings).forEach(function (key) { if (form.elements[key]) form.elements[key].value = state.settings[key] || ""; }); }
  async function loadData() { var data = await Promise.all([request("/api/admin/overview"), request("/api/admin/cars"), request("/api/admin/orders"), request("/api/admin/enquiries"), request("/api/admin/settings")]); state.cars = data[1]; state.orders = data[2]; state.enquiries = data[3]; state.settings = data[4]; renderStats(data[0]); renderCars(); renderOrders(); renderEnquiries(); renderSettings(); }
  function openCarForm(car) { var form = document.querySelector("[data-car-form]"); form.hidden = false; form.reset(); document.querySelector("[data-car-form-title]").textContent = car ? "Edit " + car.name : "Add vehicle"; if (car) { Object.keys(car).forEach(function (key) { if (form.elements[key]) form.elements[key].value = Array.isArray(car[key]) ? car[key].join("\n") : car[key]; }); form.elements.available.checked = Boolean(car.available); form.elements.active.checked = Boolean(car.active); } else { form.elements.available.checked = true; form.elements.active.checked = true; } form.scrollIntoView({ behavior: "smooth", block: "start" }); }
  function bindEvents() {
    document.querySelectorAll("[data-password-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        var input = button.closest(".password-field").querySelector("input");
        var reveal = input.type === "password";
        input.type = reveal ? "text" : "password";
        button.setAttribute("aria-pressed", String(reveal));
        button.setAttribute("aria-label", reveal ? "Hide password" : "Show password");
        button.querySelector("[data-password-toggle-text]").textContent = reveal ? "Hide" : "Show";
        input.focus();
      });
    });
    document.querySelector("[data-login-form]").addEventListener("submit", async function (event) { event.preventDefault(); var form = event.currentTarget; if (!form.reportValidity()) return; try { await request("/api/auth/login", { method: "POST", body: JSON.stringify(objectFromForm(form)) }); await loadData(); setSignedIn(true); form.reset(); } catch (error) { setSignedIn(false); feedback("[data-login-feedback]", error.message, "error"); } });
    document.querySelectorAll("[data-admin-tab]").forEach(function (button) { button.addEventListener("click", function () { setTab(button.dataset.adminTab); }); });
    document.querySelector("[data-logout]").addEventListener("click", async function () { await request("/api/auth/logout", { method: "POST" }); setSignedIn(false); });
    document.querySelector("[data-new-car]").addEventListener("click", function () { openCarForm(null); }); document.querySelector("[data-close-car-form]").addEventListener("click", function () { document.querySelector("[data-car-form]").hidden = true; });
    document.querySelector("[data-cars-table]").addEventListener("click", function (event) { var edit = event.target.closest("[data-edit-car]"); var remove = event.target.closest("[data-delete-car]"); if (edit) openCarForm(state.cars.find(function (car) { return car.id === edit.dataset.editCar; })); if (remove) { var car = state.cars.find(function (item) { return item.id === remove.dataset.deleteCar; }); if (car && window.confirm('Remove "' + car.name + '" from the fleet? This cannot be undone.')) request("/api/admin/cars/" + encodeURIComponent(car.id), { method: "DELETE" }).then(loadData).catch(function (error) { window.alert(error.message); }); } });
    document.querySelector("[data-car-form]").addEventListener("submit", async function (event) { event.preventDefault(); var form = event.currentTarget; if (!form.reportValidity()) return; var data = objectFromForm(form); data.available = form.elements.available.checked; data.active = form.elements.active.checked; try { var method = data.id ? "PUT" : "POST"; var endpoint = data.id ? "/api/admin/cars/" + encodeURIComponent(data.id) : "/api/admin/cars"; await request(endpoint, { method: method, body: JSON.stringify(data) }); feedback("[data-car-feedback]", "Vehicle saved.", "success"); await loadData(); } catch (error) { feedback("[data-car-feedback]", error.message, "error"); } });
    document.querySelector("[data-orders-list]").addEventListener("change", function (event) { var select = event.target.closest("[data-order-status]"); if (select) request("/api/admin/orders/" + encodeURIComponent(select.dataset.orderStatus), { method: "PATCH", body: JSON.stringify({ status: select.value }) }).then(loadData).catch(function (error) { window.alert(error.message); }); });
    document.querySelector("[data-settings-form]").addEventListener("submit", async function (event) { event.preventDefault(); var form = event.currentTarget; if (!form.reportValidity()) return; try { state.settings = await request("/api/admin/settings", { method: "PUT", body: JSON.stringify(objectFromForm(form)) }); feedback("[data-settings-feedback]", "Website settings saved.", "success"); } catch (error) { feedback("[data-settings-feedback]", error.message, "error"); } });
  }
  async function init() { document.querySelector("[data-admin-date]").textContent = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long", year: "numeric" }).format(new Date()); bindEvents(); try { var session = await request("/api/session"); if (session.authenticated) { setSignedIn(true); await loadData(); } } catch { setSignedIn(false); } }
  init();
}());
