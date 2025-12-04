// script.js

// initial
document.addEventListener("DOMContentLoaded", () => {
  // set year in footer
  const y = new Date().getFullYear();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = y;

  // default show home
  showSection("home");

  // update user badge
  updateUserBadge();
});

// Show only target section & update nav active
function showSection(id, btnElement) {
  const sections = document.querySelectorAll(".page-section");
  sections.forEach((s) => s.classList.remove("active"));

  const el = document.getElementById(id);
  if (el) el.classList.add("active");

  // nav active state
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  if (btnElement) {
    btnElement.classList.add("active");
  } else {
    // find nav button by data-target
    const btn = document.querySelector(`.nav-btn[data-target="${id}"]`);
    if (btn) btn.classList.add("active");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// --------------------
// Simple auth (localStorage)
// --------------------
function updateUserBadge() {
  const s = JSON.parse(localStorage.getItem("gt_session") || "null");
  const badge = document.getElementById("userBadge");
  const logoutBtn = document.getElementById("logoutBtn");

  if (s && s.username) {
    badge.textContent = `${s.username} — ${s.company || "ลูกค้า"}`;
    logoutBtn.classList.remove("hidden");
  } else {
    badge.textContent = "ยังไม่ได้ล็อกอิน";
    logoutBtn.classList.add("hidden");
  }
}

function registerUser() {
  const u = document.getElementById("regUsername").value.trim();
  const p = document.getElementById("regPassword").value;
  const p2 = document.getElementById("regPassword2").value;
  const company = document.getElementById("regCompany").value.trim();

  if (!u || !p || !p2 || !company) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }
  if (p !== p2) {
    alert("รหัสผ่านไม่ตรงกัน");
    return;
  }

  const users = JSON.parse(localStorage.getItem("gt_users") || "{}");

  // default admin
  if (!users["Admin"])
    users["Admin"] = { password: "1234", company: "GoldTiger Co.,Ltd" };

  if (users[u]) {
    alert("มีผู้ใช้ชื่อนี้แล้ว");
    return;
  }

  users[u] = { password: p, company };
  localStorage.setItem("gt_users", JSON.stringify(users));

  alert("สมัครสมาชิกเรียบร้อย สามารถล็อกอินได้ทันที");
  // auto-fill login
  document.getElementById("loginUsername").value = u;
  showSection("signin");
}

function loginUser() {
  const u = document.getElementById("loginUsername").value.trim();
  const p = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("gt_users") || "{}");
  if (!users["Admin"])
    users["Admin"] = { password: "1234", company: "GoldTiger Co.,Ltd" };

  if (!users[u] || users[u].password !== p) {
    alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    return;
  }

  localStorage.setItem(
    "gt_session",
    JSON.stringify({ username: u, company: users[u].company })
  );
  updateUserBadge();
  alert("ล็อกอินสำเร็จ");
  showSection("home");
}

function logout() {
  localStorage.removeItem("gt_session");
  updateUserBadge();
  alert("คุณได้ทำการออกจากระบบแล้ว");
  showSection("signin");
}

// --------------------
// Order handling (example)
// --------------------
function quickOrder(productName) {
  // prefill order and show order section
  document.getElementById("orderProduct").value = productName;
  showSection("order");
}

function submitOrder() {
  const product = document.getElementById("orderProduct").value;
  const name = document.getElementById("orderName").value.trim();
  const company = document.getElementById("orderCompany").value.trim();
  const phone = document.getElementById("orderPhone").value.trim();
  const qty = parseInt(document.getElementById("orderQty").value || "0");
  const note = document.getElementById("orderNote").value.trim();

  if (!name || !phone || !qty || qty <= 0) {
    alert("กรุณากรอกชื่อ, เบอร์ และจำนวนให้ถูกต้อง");
    return;
  }

  // example: сохраняем order в localStorage как demo
  const orders = JSON.parse(localStorage.getItem("gt_orders") || "[]");
  orders.push({
    product,
    name,
    company,
    phone,
    qty,
    note,
    created: new Date().toISOString(),
  });
  localStorage.setItem("gt_orders", JSON.stringify(orders));

  alert(
    "ส่งคำสั่งซื้อเรียบร้อย (ตัวอย่าง) — ข้อมูลถูกบันทึกในเบราว์เซอร์ของคุณ"
  );
  resetOrder();
  showSection("home");
}

function resetOrder() {
  document.getElementById("orderQty").value = "";
  document.getElementById("orderNote").value = "";
}

// utility
function clearRegisterForm() {
  [
    "regUsername",
    "regPassword",
    "regPassword2",
    "regCompany",
    "regAddress",
    "regTax",
    "regPhone",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
