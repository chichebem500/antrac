// "use strict";

// const crypto = require("node:crypto");
// const fs = require("node:fs");
// const fsp = require("node:fs/promises");
// const http = require("node:http");
// const path = require("node:path");
// const vm = require("node:vm");

// const ROOT = __dirname;
// const STORE_DIRECTORY = path.join(ROOT, "data");
// const STORE_PATH = path.join(STORE_DIRECTORY, "admin-store.json");
// const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;
// const sessions = new Map();

// loadEnvironmentFile(path.join(ROOT, ".env.local"));
// const PORT = Number(process.env.PORT || 3000);

// function loadEnvironmentFile(filePath) {
//   if (!fs.existsSync(filePath)) return;
//   for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
//     const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
//     if (!match || process.env[match[1]]) continue;
//     const value = match[2].replace(/^(["'])(.*)\1$/, "$2");
//     process.env[match[1]] = value;
//   }
// }

// function readVehicleSeed() {
//   const source = fs.readFileSync(path.join(ROOT, "assets", "js", "fleet.js"), "utf8");
//   const sandbox = {
//     window: { ANTRAC: {} },
//     // The browser script also contains rendering code.  These no-op DOM methods
//     // let us use its vehicle data as the initial store without running a browser.
//     document: { querySelector: () => null, addEventListener: () => {}, dispatchEvent: () => {} },
//     Event: function Event() {},
//     URLSearchParams,
//     Intl,
//     Array,
//     Set,
//     Number,
//     encodeURIComponent,
//     fetch: () => Promise.resolve({ ok: false, json: async () => null }),
//   };
//   vm.runInNewContext(source, sandbox, { filename: "fleet.js" });
//   return Array.isArray(sandbox.window.ANTRAC_VEHICLES) ? sandbox.window.ANTRAC_VEHICLES : [];
// }

// function createInitialStore() {
//   return {
//     settings: {
//       name: "ANTRAC LOGISTICS LIMITED",
//       phone: "0806 666 6431",
//       secondaryPhone: "0809 549 4926",
//       email: "antraclog@gmail.com",
//       address: "Citi Car Hire, Transcorp Hilton Hotel, Aguiyi Ironsi Way, Maitama District, Abuja FCT, Nigeria",
//       heroDescription: "Premium executive car hire, buses, professional transportation, and general contracting services for every journey.",
//     },
//     vehicles: readVehicleSeed().map((vehicle) => ({ ...vehicle, active: true, updatedAt: new Date().toISOString() })),
//     orders: [],
//     enquiries: [],
//   };
// }

// async function readStore() {
//   try {
//     return JSON.parse(await fsp.readFile(STORE_PATH, "utf8"));
//   } catch (error) {
//     if (error.code !== "ENOENT") throw error;
//     const initialStore = createInitialStore();
//     await writeStore(initialStore);
//     return initialStore;
//   }
// }

// let queuedWrite = Promise.resolve();
// function writeStore(store) {
//   queuedWrite = queuedWrite.then(async () => {
//     await fsp.mkdir(STORE_DIRECTORY, { recursive: true });
//     const temporaryPath = STORE_PATH + ".tmp";
//     await fsp.writeFile(temporaryPath, JSON.stringify(store, null, 2), "utf8");
//     await fsp.rename(temporaryPath, STORE_PATH);
//   });
//   return queuedWrite;
// }

// function sendJson(response, status, payload, extraHeaders = {}) {
//   response.writeHead(status, {
//     "Content-Type": "application/json; charset=utf-8",
//     "Cache-Control": "no-store",
//     ...extraHeaders,
//   });
//   response.end(JSON.stringify(payload));
// }

// function sendText(response, status, body) {
//   response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
//   response.end(body);
// }

// function clientError(message, status = 400) {
//   const error = new Error(message);
//   error.status = status;
//   return error;
// }

// async function readJsonBody(request) {
//   const chunks = [];
//   let length = 0;
//   for await (const chunk of request) {
//     length += chunk.length;
//     if (length > 1_000_000) throw clientError("Request body is too large.", 413);
//     chunks.push(chunk);
//   }
//   if (!chunks.length) return {};
//   try {
//     return JSON.parse(Buffer.concat(chunks).toString("utf8"));
//   } catch {
//     throw clientError("Request body must be valid JSON.");
//   }
// }

// function parseCookies(request) {
//   return Object.fromEntries((request.headers.cookie || "").split(";").map((part) => {
//     const index = part.indexOf("=");
//     return index < 0 ? [part.trim(), ""] : [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
//   }).filter(([key]) => key));
// }

// function sessionFromRequest(request) {
//   const token = parseCookies(request).antrac_admin;
//   const session = token && sessions.get(token);
//   if (!session || session.expiresAt < Date.now()) {
//     if (token) sessions.delete(token);
//     return null;
//   }
//   return { token, ...session };
// }

// function requireAdmin(request, response) {
//   const session = sessionFromRequest(request);
//   if (session) return session;
//   sendJson(response, 401, { error: "Administrator sign-in is required." });
//   return null;
// }

// function createSession(response) {
//   const token = crypto.randomBytes(32).toString("base64url");
//   sessions.set(token, { expiresAt: Date.now() + SESSION_DURATION_MS });
//   const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
//   return `antrac_admin=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_MS / 1000}${secure}`;
// }

// function clearSession(response, request) {
//   const token = parseCookies(request).antrac_admin;
//   if (token) sessions.delete(token);
//   const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
//   return `antrac_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`;
// }

// function passwordMatches(password) {
//   const configuredPassword = process.env.ADMIN_PASSWORD;
//   if (!configuredPassword || !password) return false;
//   const expected = crypto.scryptSync(configuredPassword, "antrac-admin-password", 64);
//   const supplied = crypto.scryptSync(String(password), "antrac-admin-password", 64);
//   return crypto.timingSafeEqual(expected, supplied);
// }

// function cleanVehicle(input, current = {}) {
//   const integerFields = ["pricePerDay", "deposit", "seats", "doors", "minimumAge"];
//   const output = {
//     id: current.id || String(input.id || "").trim() || crypto.randomUUID(),
//     name: String(input.name || "").trim(),
//     category: String(input.category || "").trim(),
//     description: String(input.description || "").trim(),
//     image: String(input.image || "").trim(),
//     transmission: String(input.transmission || "").trim(),
//     fuel: String(input.fuel || "").trim(),
//     mileage: String(input.mileage || "").trim(),
//     gallery: Array.isArray(input.gallery) ? input.gallery.map(String).filter(Boolean) : String(input.gallery || "").split("\n").map((item) => item.trim()).filter(Boolean),
//     features: Array.isArray(input.features) ? input.features.map(String).filter(Boolean) : String(input.features || "").split("\n").map((item) => item.trim()).filter(Boolean),
//     available: input.available !== false && input.available !== "false",
//     active: input.active !== false && input.active !== "false",
//     updatedAt: new Date().toISOString(),
//   };
//   for (const field of integerFields) output[field] = Number(input[field] ?? current[field] ?? 0);
//   if (!output.name || !output.category || !output.description || !output.image || !Number.isFinite(output.pricePerDay) || output.pricePerDay < 0) {
//     throw clientError("Name, category, description, image path, and a valid daily price are required.");
//   }
//   if (!output.gallery.length) output.gallery = [output.image];
//   return output;
// }

// function cleanOrder(input, store) {
//   const required = ["vehicle", "pickupLocation", "dropoffLocation", "pickupDate", "returnDate", "pickupTime", "returnTime", "customerName", "phone", "email"];
//   for (const field of required) if (!String(input[field] || "").trim()) throw clientError(`Please provide ${field}.`);
//   const vehicle = store.vehicles.find((item) => item.id === input.vehicle && item.active && item.available);
//   if (!vehicle) throw clientError("The selected vehicle is not currently available.");
//   const pickup = new Date(`${input.pickupDate}T12:00:00`);
//   const returnDate = new Date(`${input.returnDate}T12:00:00`);
//   if (Number.isNaN(pickup.valueOf()) || Number.isNaN(returnDate.valueOf()) || returnDate < pickup) throw clientError("Please provide valid travel dates.");
//   const days = Math.max(1, Math.ceil((returnDate - pickup) / 86_400_000));
//   return {
//     id: crypto.randomUUID(),
//     createdAt: new Date().toISOString(),
//     status: "PENDING",
//     vehicleId: vehicle.id,
//     vehicleName: vehicle.name,
//     pricePerDay: vehicle.pricePerDay,
//     estimatedTotal: vehicle.pricePerDay * days,
//     rentalDays: days,
//     pickupLocation: String(input.pickupLocation).trim(),
//     dropoffLocation: String(input.dropoffLocation).trim(),
//     pickupDate: String(input.pickupDate),
//     pickupTime: String(input.pickupTime),
//     returnDate: String(input.returnDate),
//     returnTime: String(input.returnTime),
//     customerName: String(input.customerName).trim(),
//     phone: String(input.phone).trim(),
//     email: String(input.email).trim().toLowerCase(),
//     notes: String(input.notes || "").trim(),
//   };
// }

// async function handleApi(request, response, url) {
//   const pathname = url.pathname;
//   if (pathname === "/api/session" && request.method === "GET") return sendJson(response, 200, { authenticated: Boolean(sessionFromRequest(request)) });
//   if (pathname === "/api/auth/login" && request.method === "POST") {
//     const body = await readJsonBody(request);
//     if (!process.env.ADMIN_PASSWORD) return sendJson(response, 503, { error: "ADMIN_PASSWORD is not configured on the server." });
//     if (!passwordMatches(body.password)) return sendJson(response, 401, { error: "Incorrect password." });
//     return sendJson(response, 200, { ok: true }, { "Set-Cookie": createSession(response) });
//   }
//   if (pathname === "/api/auth/logout" && request.method === "POST") return sendJson(response, 200, { ok: true }, { "Set-Cookie": clearSession(response, request) });

//   if (pathname === "/api/settings" && request.method === "GET") return sendJson(response, 200, (await readStore()).settings);
//   if (pathname === "/api/cars" && request.method === "GET") return sendJson(response, 200, (await readStore()).vehicles.filter((vehicle) => vehicle.active));
//   if (pathname === "/api/orders" && request.method === "POST") {
//     const store = await readStore();
//     const order = cleanOrder(await readJsonBody(request), store);
//     store.orders.unshift(order);
//     await writeStore(store);
//     return sendJson(response, 201, { ok: true, order: { id: order.id, status: order.status } });
//   }
//   if (pathname === "/api/enquiries" && request.method === "POST") {
//     const body = await readJsonBody(request);
//     if (![body.fullName, body.phone, body.email, body.message].every((value) => String(value || "").trim())) return sendJson(response, 400, { error: "Please complete every enquiry field." });
//     const store = await readStore();
//     store.enquiries.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), name: String(body.fullName).trim(), phone: String(body.phone).trim(), email: String(body.email).trim(), message: String(body.message).trim() });
//     await writeStore(store);
//     return sendJson(response, 201, { ok: true });
//   }

//   if (!pathname.startsWith("/api/admin/")) return false;
//   if (!requireAdmin(request, response)) return true;
//   const store = await readStore();
//   if (pathname === "/api/admin/overview" && request.method === "GET") {
//     return sendJson(response, 200, { vehicles: store.vehicles.length, availableVehicles: store.vehicles.filter((vehicle) => vehicle.active && vehicle.available).length, orders: store.orders.length, pendingOrders: store.orders.filter((order) => order.status === "PENDING").length, enquiries: store.enquiries.length });
//   }
//   if (pathname === "/api/admin/cars" && request.method === "GET") return sendJson(response, 200, store.vehicles);
//   if (pathname === "/api/admin/cars" && request.method === "POST") {
//     const vehicle = cleanVehicle(await readJsonBody(request));
//     if (store.vehicles.some((item) => item.id === vehicle.id)) return sendJson(response, 409, { error: "A vehicle with this ID already exists." });
//     store.vehicles.push(vehicle); await writeStore(store); return sendJson(response, 201, vehicle);
//   }
//   if (pathname.startsWith("/api/admin/cars/")) {
//     const id = decodeURIComponent(pathname.slice("/api/admin/cars/".length));
//     const index = store.vehicles.findIndex((vehicle) => vehicle.id === id);
//     if (index < 0) return sendJson(response, 404, { error: "Vehicle not found." });
//     if (request.method === "PUT") { const vehicle = cleanVehicle(await readJsonBody(request), store.vehicles[index]); store.vehicles[index] = vehicle; await writeStore(store); return sendJson(response, 200, vehicle); }
//     if (request.method === "DELETE") { store.vehicles.splice(index, 1); await writeStore(store); return sendJson(response, 200, { ok: true }); }
//   }
//   if (pathname === "/api/admin/orders" && request.method === "GET") return sendJson(response, 200, store.orders);
//   if (pathname.startsWith("/api/admin/orders/") && request.method === "PATCH") {
//     const id = decodeURIComponent(pathname.slice("/api/admin/orders/".length)); const order = store.orders.find((item) => item.id === id); const body = await readJsonBody(request);
//     if (!order) return sendJson(response, 404, { error: "Order not found." });
//     if (!["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(body.status)) return sendJson(response, 400, { error: "Invalid order status." });
//     order.status = body.status; order.updatedAt = new Date().toISOString(); await writeStore(store); return sendJson(response, 200, order);
//   }
//   if (pathname === "/api/admin/enquiries" && request.method === "GET") return sendJson(response, 200, store.enquiries);
//   if (pathname === "/api/admin/settings" && request.method === "GET") return sendJson(response, 200, store.settings);
//   if (pathname === "/api/admin/settings" && request.method === "PUT") {
//     const body = await readJsonBody(request); const fields = ["name", "phone", "secondaryPhone", "email", "address", "heroDescription"];
//     for (const field of fields) store.settings[field] = String(body[field] || "").trim();
//     await writeStore(store); return sendJson(response, 200, store.settings);
//   }
//   return sendJson(response, 404, { error: "Administrator endpoint not found." });
// }

// const mimeTypes = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".ico": "image/x-icon", ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".js": "text/javascript; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
// async function serveStatic(response, pathname) {
//   const decoded = decodeURIComponent(pathname === "/" ? "/index.html" : pathname);
//   const resolved = path.resolve(ROOT, "." + decoded);
//   if (!resolved.startsWith(ROOT + path.sep) || resolved.startsWith(STORE_DIRECTORY + path.sep)) return sendText(response, 403, "Forbidden");
//   try {
//     const stats = await fsp.stat(resolved);
//     if (!stats.isFile()) return sendText(response, 404, "Not found");
//     response.writeHead(200, { "Content-Type": mimeTypes[path.extname(resolved).toLowerCase()] || "application/octet-stream", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-cache" });
//     fs.createReadStream(resolved).pipe(response);
//   } catch { sendText(response, 404, "Not found"); }
// }

// const server = http.createServer(async (request, response) => {
//   try {
//     const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
//     if (url.pathname.startsWith("/api/")) {
//       const handled = await handleApi(request, response, url);
//       if (handled === false) sendJson(response, 404, { error: "API endpoint not found." });
//       return;
//     }
//     if (request.method !== "GET" && request.method !== "HEAD") return sendText(response, 405, "Method not allowed");
//     await serveStatic(response, url.pathname);
//   } catch (error) {
//     console.error(error);
//     if (!response.headersSent) sendJson(response, Number.isInteger(error.status) ? error.status : 500, { error: Number.isInteger(error.status) ? error.message : "The server could not complete that request." });
//     else response.end();
//   }
// });

// server.listen(PORT, "0.0.0.0", () => console.log(`ANTRAC is running at http://localhost:${PORT}`));
