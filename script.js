/* ===================================
   FreshCart — script.js
   All interactive functionality
   =================================== */

// ========== DATA ==========
const products = [
  { id: 1, name: "Organic Broccoli", price: 3.49, originalPrice: 4.99, category: "leafy", badge: "Sale", rating: 4.8, image: "🥦" },
  { id: 2, name: "Fresh Tomatoes", price: 2.99, category: "fruits", badge: "Popular", rating: 4.9, image: "🍅" },
  { id: 3, name: "Baby Carrots", price: 1.99, category: "root", rating: 4.7, image: "🥕" },
  { id: 4, name: "Green Spinach", price: 2.49, category: "leafy", badge: "Organic", rating: 4.6, image: "🥬" },
  { id: 5, name: "Red Bell Pepper", price: 3.29, category: "fruits", rating: 4.5, image: "🫑" },
  { id: 6, name: "Sweet Potatoes", price: 2.79, originalPrice: 3.49, category: "root", badge: "Sale", rating: 4.8, image: "🍠" },
  { id: 7, name: "Fresh Basil", price: 1.49, category: "herbs", badge: "New", rating: 4.9, image: "🌿" },
  { id: 8, name: "Organic Kale", price: 3.99, category: "leafy", rating: 4.7, image: "🥗" },
];

const todayItems = [
  { emoji: "🥕", name: "Carrots", price: "$1.29/lb", trend: "down" },
  { emoji: "🍅", name: "Tomatoes", price: "$2.49/lb", trend: "up" },
  { emoji: "🥦", name: "Broccoli", price: "$2.99/head", trend: "down" },
  { emoji: "🥬", name: "Lettuce", price: "$1.79/head", trend: "stable" },
  { emoji: "🧅", name: "Onions", price: "$0.99/lb", trend: "down" },
  { emoji: "🫑", name: "Peppers", price: "$3.49/lb", trend: "up" },
  { emoji: "🥒", name: "Cucumber", price: "$1.19/ea", trend: "down" },
  { emoji: "🍠", name: "Sweet Potato", price: "$1.99/lb", trend: "stable" },
];

// ========== STATE ==========
let cartCount = 0;
let currentFilter = "all";
let currentSort = "default";
let authMode = "login"; // "login" or "signup"

// ========== DOM REFERENCES ==========
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const cartCountEl = document.getElementById("cartCount");
const productsGrid = document.getElementById("productsGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("sortSelect");
const todayScroll = document.getElementById("todayScroll");
const authModal = document.getElementById("authModal");

// ========== NAVBAR SCROLL ==========
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

// ========== MOBILE MENU ==========
hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});
// Close mobile menu on link click
mobileMenu.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

// ========== CART ==========
function addToCart() {
  cartCount++;
  cartCountEl.textContent = cartCount;
  // Quick pulse animation
  cartCountEl.style.transform = "scale(1.4)";
  setTimeout(() => (cartCountEl.style.transform = "scale(1)"), 200);
}

// ========== RENDER PRODUCTS ==========
function renderProducts() {
  let filtered = currentFilter === "all"
    ? [...products]
    : products.filter((p) => p.category === currentFilter);

  if (currentSort === "price-low") filtered.sort((a, b) => a.price - b.price);
  else if (currentSort === "price-high") filtered.sort((a, b) => b.price - a.price);
  else if (currentSort === "rating") filtered.sort((a, b) => b.rating - a.rating);

  productsGrid.innerHTML = filtered
    .map(
      (p) => `
    <div class="product-card">
      <div class="product-image">
        <span>${p.image}</span>
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ""}
      </div>
      <div class="product-info">
        <div class="product-rating">
          <span class="star">★</span> ${p.rating}
        </div>
        <div class="product-name">${p.name}</div>
        <div class="product-bottom">
          <div>
            <span class="product-price">$${p.price.toFixed(2)}</span>
            ${p.originalPrice ? `<span class="product-original">$${p.originalPrice.toFixed(2)}</span>` : ""}
          </div>
          <button class="add-to-cart-btn" onclick="addToCart()" aria-label="Add to cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          </button>
        </div>
      </div>
    </div>`
    )
    .join("");
}

// ========== FILTERS ==========
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderProducts();
  });
});

// ========== SORT ==========
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  renderProducts();
});

// ========== RENDER TODAY'S PRICES ==========
function renderTodayPrices() {
  todayScroll.innerHTML = todayItems
    .map(
      (item) => `
    <div class="price-card">
      <span class="emoji">${item.emoji}</span>
      <h4>${item.name}</h4>
      <div class="price">${item.price}</div>
      <span class="trend trend-${item.trend}">
        ${item.trend === "down" ? "Price Down" : item.trend === "up" ? "Price Up" : "Stable"}
      </span>
    </div>`
    )
    .join("");
}

// ========== AUTH MODAL ==========
function openModal(mode) {
  authMode = mode;
  updateModalUI();
  authModal.classList.add("open");
  mobileMenu.classList.remove("open");
}

function closeModal() {
  authModal.classList.remove("open");
  clearAuthErrors();
}

function toggleAuthMode() {
  authMode = authMode === "login" ? "signup" : "login";
  updateModalUI();
  clearAuthErrors();
}

function updateModalUI() {
  document.getElementById("modalTitle").textContent =
    authMode === "login" ? "Welcome Back" : "Create Account";
  document.getElementById("nameGroup").style.display =
    authMode === "signup" ? "flex" : "none";
  document.getElementById("confirmGroup").style.display =
    authMode === "signup" ? "flex" : "none";
  document.getElementById("authSubmitBtn").textContent =
    authMode === "login" ? "Login" : "Sign Up";
  document.getElementById("googleBtnText").textContent =
    authMode === "login" ? "Login with Google" : "Sign up with Google";
  document.getElementById("toggleText").textContent =
    authMode === "login" ? "Don't have an account? " : "Already have an account? ";
  document.getElementById("toggleBtn").textContent =
    authMode === "login" ? "Sign Up" : "Login";
}

function clearAuthErrors() {
  ["authNameError", "authEmailError", "authPasswordError", "authConfirmError"].forEach(
    (id) => (document.getElementById(id).textContent = "")
  );
}

// Close modal on overlay click
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) closeModal();
});

// Auth form validation & submit
document.getElementById("authForm").addEventListener("submit", (e) => {
  e.preventDefault();
  clearAuthErrors();
  let valid = true;

  if (authMode === "signup") {
    const name = document.getElementById("authName").value.trim();
    if (!name) { document.getElementById("authNameError").textContent = "Name is required"; valid = false; }
  }

  const email = document.getElementById("authEmail").value.trim();
  if (!email) { document.getElementById("authEmailError").textContent = "Email is required"; valid = false; }
  else if (!/\S+@\S+\.\S+/.test(email)) { document.getElementById("authEmailError").textContent = "Invalid email"; valid = false; }

  const password = document.getElementById("authPassword").value;
  if (!password) { document.getElementById("authPasswordError").textContent = "Password is required"; valid = false; }
  else if (password.length < 6) { document.getElementById("authPasswordError").textContent = "Min 6 characters"; valid = false; }

  if (authMode === "signup") {
    const confirm = document.getElementById("authConfirm").value;
    if (password !== confirm) { document.getElementById("authConfirmError").textContent = "Passwords don't match"; valid = false; }
  }

  if (valid) {
    alert(`${authMode === "login" ? "Logged in" : "Signed up"} successfully! (UI Demo)`);
    closeModal();
  }
});

// ========== CONTACT FORM ==========
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById("contactName");
  const email = document.getElementById("contactEmail");
  const message = document.getElementById("contactMessage");

  document.getElementById("contactNameError").textContent = "";
  document.getElementById("contactEmailError").textContent = "";
  document.getElementById("contactMessageError").textContent = "";

  if (!name.value.trim()) { document.getElementById("contactNameError").textContent = "Name is required"; valid = false; }
  if (!email.value.trim()) { document.getElementById("contactEmailError").textContent = "Email is required"; valid = false; }
  else if (!/\S+@\S+\.\S+/.test(email.value)) { document.getElementById("contactEmailError").textContent = "Invalid email"; valid = false; }
  if (!message.value.trim()) { document.getElementById("contactMessageError").textContent = "Message is required"; valid = false; }

  if (valid) {
    const success = document.getElementById("contactSuccess");
    success.style.display = "block";
    name.value = ""; email.value = ""; message.value = "";
    setTimeout(() => (success.style.display = "none"), 3000);
  }
});

// ========== SMOOTH SCROLL for all anchor links ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ========== INIT ==========
renderProducts();
renderTodayPrices();
