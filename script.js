function createPlaceholderImage(name, color = "#e3bc8e") {
  const shortName = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="88" viewBox="0 0 120 88">
      <rect width="120" height="88" rx="8" ry="8" fill="${color}" />
      <circle cx="36" cy="44" r="16" fill="#f7dfb5" />
      <circle cx="60" cy="44" r="16" fill="#f7dfb5" />
      <circle cx="84" cy="44" r="16" fill="#f7dfb5" />
      <circle cx="48" cy="30" r="3" fill="#b23a2b" />
      <circle cx="72" cy="55" r="3" fill="#b23a2b" />
      <text x="60" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#5b3327">${shortName || "PZ"}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createPizzaApiImage(name, seed = 1) {
  const tagString = `${name},pizza`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ",")
    .replace(/^,+|,+$/g, "");
  return `https://loremflickr.com/640/420/${tagString}?lock=${seed}`;
}

const baseProducts = [
  {
    id: "margherita",
    name: "Margherita",
    price: 199,
    category: "Classic",
    description: "Cheese and tomato",
    color: "#e7c297"
  },
  {
    id: "farmhouse",
    name: "Farmhouse",
    price: 259,
    category: "Veg",
    description: "Onion, capsicum, mushroom",
    color: "#e3ba89"
  },
  {
    id: "veggie-deluxe",
    name: "Veggie Deluxe",
    price: 279,
    category: "Veg",
    description: "Mixed veggies and corn",
    color: "#e5c194"
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    price: 299,
    category: "Spicy",
    description: "Paneer cubes with masala",
    color: "#dfb27f"
  },
  {
    id: "cheese-burst",
    name: "Cheese Burst",
    price: 319,
    category: "Cheese",
    description: "Loaded with extra cheese",
    color: "#e2b987"
  },
  {
    id: "pepperoni-style",
    name: "Pepperoni Style",
    price: 339,
    category: "Loaded",
    description: "Smoky topping style",
    color: "#dbab74"
  },
  {
    id: "mexican-green-wave",
    name: "Mexican Green Wave",
    price: 289,
    category: "Spicy",
    description: "Jalapeno and crunchy onions",
    color: "#e4bf91"
  },
  {
    id: "corn-cheese",
    name: "Corn & Cheese",
    price: 249,
    category: "Cheese",
    description: "Sweet corn and cheese",
    color: "#e9caa1"
  }
];

baseProducts.forEach((product, index) => {
  product.imageApi = createPizzaApiImage(product.name, index + 1);
  product.fallbackImage = createPlaceholderImage(product.name, product.color);
});

const productMap = Object.fromEntries(baseProducts.map((product) => [product.id, product]));

const storage = {
  read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  },
  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const state = {
  currentView: "home",
  selectedCategory: "All",
  searchQuery: "",
  favorites: new Set(storage.read("pizza-favorites", [])),
  cart: storage.read("pizza-cart", {}),
  customItems: storage.read("pizza-custom-items", {}),
  instructions: storage.read("pizza-instructions", ""),
  settings: storage.read("pizza-settings", {
    notifications: true,
    newsletter: false
  }),
  user: storage.read("pizza-user", {
    name: "Guest",
    signedIn: false,
    rewards: 160
  }),
  orders: storage.read("pizza-orders", [])
};

const refs = {
  overlay: document.getElementById("overlay"),
  menuDrawer: document.getElementById("menuDrawer"),
  cartDrawer: document.getElementById("cartDrawer"),
  userDrawer: document.getElementById("userDrawer"),
  dialog: document.getElementById("dialog"),
  dialogTitle: document.getElementById("dialogTitle"),
  dialogMessage: document.getElementById("dialogMessage"),
  closeDialogBtn: document.getElementById("closeDialogBtn"),
  toast: document.getElementById("toast"),
  menuBtn: document.getElementById("menuBtn"),
  closeMenuBtn: document.getElementById("closeMenuBtn"),
  userBtn: document.getElementById("userBtn"),
  closeUserBtn: document.getElementById("closeUserBtn"),
  topCartBtn: document.getElementById("topCartBtn"),
  closeCartBtn: document.getElementById("closeCartBtn"),
  cartCountText: document.getElementById("cartCountText"),
  openOrdersBtn: document.getElementById("openOrdersBtn"),
  openStoreInfoBtn: document.getElementById("openStoreInfoBtn"),
  searchInput: document.getElementById("searchInput"),
  categoryRow: document.getElementById("categoryRow"),
  pizzaList: document.getElementById("pizzaList"),
  favoritesList: document.getElementById("favoritesList"),
  favoritesEmptyText: document.getElementById("favoritesEmptyText"),
  itemCountText: document.getElementById("itemCountText"),
  instructionsInput: document.getElementById("instructionsInput"),
  saveInstructionBtn: document.getElementById("saveInstructionBtn"),
  clearInstructionBtn: document.getElementById("clearInstructionBtn"),
  cartList: document.getElementById("cartList"),
  cartEmptyText: document.getElementById("cartEmptyText"),
  cartSubtotal: document.getElementById("cartSubtotal"),
  clearCartBtn: document.getElementById("clearCartBtn"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  customForm: document.getElementById("customForm"),
  pizzaBase: document.getElementById("pizzaBase"),
  pizzaSize: document.getElementById("pizzaSize"),
  pizzaCrust: document.getElementById("pizzaCrust"),
  extraCheese: document.getElementById("extraCheese"),
  resetCustomBtn: document.getElementById("resetCustomBtn"),
  notifyToggle: document.getElementById("notifyToggle"),
  newsletterToggle: document.getElementById("newsletterToggle"),
  saveSettingsBtn: document.getElementById("saveSettingsBtn"),
  resetSettingsBtn: document.getElementById("resetSettingsBtn"),
  profileName: document.getElementById("profileName"),
  accountStatus: document.getElementById("accountStatus"),
  saveProfileBtn: document.getElementById("saveProfileBtn"),
  toggleSignBtn: document.getElementById("toggleSignBtn"),
  viewRewardsBtn: document.getElementById("viewRewardsBtn"),
  drawerLinks: Array.from(document.querySelectorAll(".drawer-link[data-view-target]")),
  bottomNavButtons: Array.from(document.querySelectorAll(".bottom-nav .nav-btn"))
};

let toastTimeoutId;

function toCurrency(value) {
  return `Rs. ${value}`;
}

function getProductById(id) {
  return productMap[id] || state.customItems[id] || null;
}

function getProductImage(item) {
  return item.imageApi || item.image || createPlaceholderImage(item.name, item.color || "#e3bc8e");
}

function getFallbackImage(item) {
  return item.fallbackImage || createPlaceholderImage(item.name, item.color || "#e3bc8e");
}

function bindImageFallbacks(scopeElement) {
  scopeElement.querySelectorAll("img[data-fallback]").forEach((img) => {
    if (img.dataset.fallbackBound === "true") {
      return;
    }

    img.dataset.fallbackBound = "true";
    img.addEventListener("error", () => {
      if (img.src !== img.dataset.fallback) {
        img.src = img.dataset.fallback;
      }
    });
  });
}

function persistState() {
  storage.write("pizza-favorites", Array.from(state.favorites));
  storage.write("pizza-cart", state.cart);
  storage.write("pizza-custom-items", state.customItems);
  storage.write("pizza-instructions", state.instructions);
  storage.write("pizza-settings", state.settings);
  storage.write("pizza-user", state.user);
  storage.write("pizza-orders", state.orders);
}

function showToast(message) {
  refs.toast.textContent = message;
  refs.toast.classList.add("show-toast");
  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    refs.toast.classList.remove("show-toast");
  }, 1800);
}

function showDialog(title, message) {
  refs.dialogTitle.textContent = title;
  refs.dialogMessage.textContent = message;
  refs.dialog.classList.remove("hidden");
  refs.dialog.setAttribute("aria-hidden", "false");
  syncOverlay();
}

function closeDialog() {
  refs.dialog.classList.add("hidden");
  refs.dialog.setAttribute("aria-hidden", "true");
  syncOverlay();
}

function syncOverlay() {
  const hasOpenDrawer =
    refs.menuDrawer.classList.contains("open-drawer") ||
    refs.cartDrawer.classList.contains("open-drawer") ||
    refs.userDrawer.classList.contains("open-drawer");
  const dialogOpen = !refs.dialog.classList.contains("hidden");
  refs.overlay.classList.toggle("hidden", !(hasOpenDrawer || dialogOpen));
}

function closeDrawers() {
  refs.menuDrawer.classList.remove("open-drawer");
  refs.cartDrawer.classList.remove("open-drawer");
  refs.userDrawer.classList.remove("open-drawer");
  refs.menuDrawer.setAttribute("aria-hidden", "true");
  refs.cartDrawer.setAttribute("aria-hidden", "true");
  refs.userDrawer.setAttribute("aria-hidden", "true");
  syncOverlay();
}

function openDrawer(type) {
  closeDrawers();

  if (type === "menu") {
    refs.menuDrawer.classList.add("open-drawer");
    refs.menuDrawer.setAttribute("aria-hidden", "false");
  }
  if (type === "cart") {
    refs.cartDrawer.classList.add("open-drawer");
    refs.cartDrawer.setAttribute("aria-hidden", "false");
  }
  if (type === "user") {
    refs.userDrawer.classList.add("open-drawer");
    refs.userDrawer.setAttribute("aria-hidden", "false");
  }
  syncOverlay();
}

function getAllProducts() {
  return [...baseProducts, ...Object.values(state.customItems)];
}

function getFilteredProducts() {
  return getAllProducts().filter((item) => {
    const matchesCategory =
      state.selectedCategory === "All" || item.category === state.selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(state.searchQuery) ||
      item.description.toLowerCase().includes(state.searchQuery);
    return matchesCategory && matchesSearch;
  });
}

function buildPizzaCard(item) {
  const isFavorite = state.favorites.has(item.id);
  const heartSymbol = isFavorite ? "&#9829;" : "&#9825;";

  return `
    <li class="pizza-card" data-id="${item.id}">
      <button class="pizza-detail-btn" type="button" data-action="details" data-id="${item.id}">
        <img
          class="pizza-thumb"
          src="${getProductImage(item)}"
          data-fallback="${getFallbackImage(item)}"
          alt="${item.name} image"
          loading="lazy"
        />
        <span class="pizza-title">${item.name}</span>
        <p class="pizza-desc">${item.description}</p>
      </button>
      <div class="pizza-footer">
        <span class="price-text">${toCurrency(item.price)}</span>
        <div class="mini-actions">
          <button class="icon-small-btn ${isFavorite ? "active-heart" : ""}" type="button" data-action="toggle-favorite" data-id="${item.id}">
            ${heartSymbol}
          </button>
          <button class="icon-small-btn" type="button" data-action="add-cart" data-id="${item.id}">+</button>
        </div>
      </div>
    </li>
  `;
}

function renderCategories() {
  const allCategories = new Set(["All", ...getAllProducts().map((item) => item.category)]);
  refs.categoryRow.innerHTML = Array.from(allCategories)
    .map((category) => {
      const isActive = category === state.selectedCategory ? "active-category" : "";
      return `<button class="category-btn ${isActive}" type="button" data-category="${category}">${category}</button>`;
    })
    .join("");
}

function renderProducts() {
  const products = getFilteredProducts();
  refs.itemCountText.textContent = `${products.length} items`;

  if (!products.length) {
    refs.pizzaList.innerHTML = `
      <li class="pizza-card empty-card">
        <p class="muted-text">No pizzas found. Try a different search.</p>
      </li>
    `;
    return;
  }

  refs.pizzaList.innerHTML = products.map((item) => buildPizzaCard(item)).join("");
  bindImageFallbacks(refs.pizzaList);
}

function renderFavorites() {
  const favorites = Array.from(state.favorites)
    .map((id) => getProductById(id))
    .filter(Boolean);

  refs.favoritesEmptyText.style.display = favorites.length ? "none" : "block";
  refs.favoritesList.innerHTML = favorites.map((item) => buildPizzaCard(item)).join("");
  bindImageFallbacks(refs.favoritesList);
}

function getCartEntries() {
  return Object.entries(state.cart)
    .map(([id, qty]) => ({ item: getProductById(id), qty }))
    .filter((entry) => entry.item && entry.qty > 0);
}

function renderCart() {
  const entries = getCartEntries();
  const total = entries.reduce((sum, entry) => sum + entry.item.price * entry.qty, 0);
  const count = entries.reduce((sum, entry) => sum + entry.qty, 0);

  refs.cartEmptyText.style.display = entries.length ? "none" : "block";
  refs.cartSubtotal.textContent = toCurrency(total);
  refs.cartCountText.textContent = `${count} items`;

  refs.cartList.innerHTML = entries
    .map(
      (entry) => `
      <li data-id="${entry.item.id}">
        <div class="cart-row">
          <div class="cart-item-main">
            <img
              class="cart-thumb"
              src="${getProductImage(entry.item)}"
              data-fallback="${getFallbackImage(entry.item)}"
              alt="${entry.item.name} image"
              loading="lazy"
            />
            <div>
              <strong>${entry.item.name}</strong>
              <div class="muted-text">${toCurrency(entry.item.price)} each</div>
            </div>
          </div>
          <span>${toCurrency(entry.item.price * entry.qty)}</span>
        </div>
        <div class="qty-row">
          <button class="icon-small-btn" type="button" data-cart-action="decrease" data-id="${entry.item.id}">-</button>
          <span>${entry.qty}</span>
          <button class="icon-small-btn" type="button" data-cart-action="increase" data-id="${entry.item.id}">+</button>
          <button class="small-btn" type="button" data-cart-action="remove" data-id="${entry.item.id}">Remove</button>
        </div>
      </li>
    `
    )
    .join("");
  bindImageFallbacks(refs.cartList);
}

function setView(view) {
  const allowed = ["home", "favorites", "custom", "settings"];
  state.currentView = allowed.includes(view) ? view : "home";

  document.querySelectorAll(".view-section").forEach((section) => {
    section.classList.remove("active-view");
  });
  document.getElementById(`${state.currentView}View`).classList.add("active-view");

  refs.bottomNavButtons.forEach((button) => {
    button.classList.toggle("nav-active", button.getAttribute("data-view") === state.currentView);
  });
}

function addToCart(itemId) {
  if (!getProductById(itemId)) {
    return;
  }
  state.cart[itemId] = (state.cart[itemId] || 0) + 1;
  persistState();
  renderCart();
  showToast("Added to cart");
}

function updateCartQuantity(itemId, delta) {
  const next = (state.cart[itemId] || 0) + delta;
  if (next <= 0) {
    delete state.cart[itemId];
  } else {
    state.cart[itemId] = next;
  }
  persistState();
  renderCart();
}

function toggleFavorite(itemId) {
  if (state.favorites.has(itemId)) {
    state.favorites.delete(itemId);
    showToast("Removed from favorites");
  } else {
    state.favorites.add(itemId);
    showToast("Added to favorites");
  }
  persistState();
  renderProducts();
  renderFavorites();
}

function saveInstructions() {
  state.instructions = refs.instructionsInput.value.trim();
  persistState();
  showToast("Instructions saved");
}

function clearInstructions() {
  state.instructions = "";
  refs.instructionsInput.value = "";
  persistState();
  showToast("Instructions cleared");
}

function updateAccountUI() {
  const initial = (state.user.name || "G").charAt(0).toUpperCase() || "G";
  refs.userBtn.textContent = initial;
  refs.profileName.value = state.user.name;
  refs.accountStatus.textContent = `Status: ${state.user.signedIn ? "Signed In" : "Guest"}`;
  refs.toggleSignBtn.textContent = state.user.signedIn ? "Sign Out" : "Sign In";
}

function updateSettingsUI() {
  refs.notifyToggle.checked = Boolean(state.settings.notifications);
  refs.newsletterToggle.checked = Boolean(state.settings.newsletter);
}

function resetCustomForm() {
  refs.customForm.reset();
  showToast("Builder reset");
}

function handleCustomPizza(event) {
  event.preventDefault();

  const base = refs.pizzaBase.value;
  const size = refs.pizzaSize.value;
  const crust = refs.pizzaCrust.value;
  const extraCheese = refs.extraCheese.checked;

  const baseProduct = baseProducts.find((item) => item.name === base);
  const basePrice = baseProduct ? baseProduct.price : 220;
  const sizeCost = size === "Medium" ? 80 : size === "Large" ? 140 : 0;
  const crustCost = crust === "Thin Crust" ? 30 : crust === "Cheese Burst" ? 70 : 0;
  const cheeseCost = extraCheese ? 40 : 0;
  const totalPrice = basePrice + sizeCost + crustCost + cheeseCost;

  const customId = `custom-${Date.now()}`;
  const customName = `${size} ${base}`;
  state.customItems[customId] = {
    id: customId,
    name: customName,
    price: totalPrice,
    category: "Custom",
    description: `${crust}${extraCheese ? ", extra cheese" : ""}`,
    color: "#e0b683",
    imageApi: createPizzaApiImage(customName, Date.now() % 1000),
    fallbackImage: createPlaceholderImage(customName, "#e0b683")
  };

  addToCart(customId);
  persistState();
  renderCategories();
  renderProducts();
  showToast("Custom pizza added");
}

function handleCheckout() {
  const entries = getCartEntries();
  if (!entries.length) {
    showToast("Your cart is empty");
    return;
  }

  const total = entries.reduce((sum, entry) => sum + entry.item.price * entry.qty, 0);
  const summary = entries.map((entry) => `${entry.item.name} x${entry.qty}`).join(", ");
  const time = new Date().toLocaleString("en-IN");

  state.orders.push({ summary, total, time });
  state.cart = {};
  persistState();
  renderCart();
  closeDrawers();
  showDialog("Order Placed", `Your pizza order is confirmed. Total ${toCurrency(total)}. Delivery in 25 minutes.`);
}

function openOrdersDialog() {
  if (!state.orders.length) {
    showDialog("Order History", "No orders yet. Completed orders will be shown here.");
    return;
  }

  const latest = state.orders[state.orders.length - 1];
  showDialog(
    "Order History",
    `Latest order: ${latest.summary}. Time: ${latest.time}. Total: ${toCurrency(latest.total)}.`
  );
}

function openStoreInfoDialog() {
  showDialog(
    "Store Info",
    "Campus Pizza, Main Street. Open daily 11:00 AM to 11:00 PM. Pickup and delivery both available."
  );
}

function bindEvents() {
  refs.menuBtn.addEventListener("click", () => openDrawer("menu"));
  refs.topCartBtn.addEventListener("click", () => openDrawer("cart"));
  refs.userBtn.addEventListener("click", () => openDrawer("user"));
  refs.closeMenuBtn.addEventListener("click", closeDrawers);
  refs.closeCartBtn.addEventListener("click", closeDrawers);
  refs.closeUserBtn.addEventListener("click", closeDrawers);
  refs.overlay.addEventListener("click", () => {
    closeDrawers();
    closeDialog();
  });
  refs.closeDialogBtn.addEventListener("click", closeDialog);

  refs.openOrdersBtn.addEventListener("click", () => {
    closeDrawers();
    openOrdersDialog();
  });
  refs.openStoreInfoBtn.addEventListener("click", () => {
    closeDrawers();
    openStoreInfoDialog();
  });

  refs.drawerLinks.forEach((button) => {
    button.addEventListener("click", () => {
      setView(button.getAttribute("data-view-target"));
      closeDrawers();
    });
  });

  refs.bottomNavButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action");
      const view = button.getAttribute("data-view");

      if (action === "open-cart") {
        openDrawer("cart");
        return;
      }

      if (view) {
        setView(view);
        closeDrawers();
      }
    });
  });

  refs.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  refs.categoryRow.addEventListener("click", (event) => {
    const target = event.target.closest("[data-category]");
    if (!target) {
      return;
    }
    state.selectedCategory = target.getAttribute("data-category");
    renderCategories();
    renderProducts();
  });

  const handlePizzaActions = (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    const action = target.getAttribute("data-action");
    const itemId = target.getAttribute("data-id");
    const item = getProductById(itemId);

    if (!item) {
      return;
    }

    if (action === "details") {
      showDialog(item.name, `${item.description}. Price ${toCurrency(item.price)}.`);
    }
    if (action === "toggle-favorite") {
      toggleFavorite(itemId);
    }
    if (action === "add-cart") {
      addToCart(itemId);
    }
  };

  refs.pizzaList.addEventListener("click", handlePizzaActions);
  refs.favoritesList.addEventListener("click", handlePizzaActions);

  refs.saveInstructionBtn.addEventListener("click", saveInstructions);
  refs.clearInstructionBtn.addEventListener("click", clearInstructions);

  refs.cartList.addEventListener("click", (event) => {
    const target = event.target.closest("[data-cart-action]");
    if (!target) {
      return;
    }

    const action = target.getAttribute("data-cart-action");
    const itemId = target.getAttribute("data-id");

    if (action === "increase") {
      updateCartQuantity(itemId, 1);
    }
    if (action === "decrease") {
      updateCartQuantity(itemId, -1);
    }
    if (action === "remove") {
      delete state.cart[itemId];
      persistState();
      renderCart();
      showToast("Item removed");
    }
  });

  refs.clearCartBtn.addEventListener("click", () => {
    state.cart = {};
    persistState();
    renderCart();
    showToast("Cart cleared");
  });

  refs.checkoutBtn.addEventListener("click", handleCheckout);

  refs.customForm.addEventListener("submit", handleCustomPizza);
  refs.resetCustomBtn.addEventListener("click", resetCustomForm);

  refs.saveSettingsBtn.addEventListener("click", () => {
    state.settings.notifications = refs.notifyToggle.checked;
    state.settings.newsletter = refs.newsletterToggle.checked;
    persistState();
    showToast("Settings saved");
  });

  refs.resetSettingsBtn.addEventListener("click", () => {
    state.settings = { notifications: true, newsletter: false };
    updateSettingsUI();
    persistState();
    showToast("Settings reset");
  });

  refs.saveProfileBtn.addEventListener("click", () => {
    state.user.name = refs.profileName.value.trim() || "Guest";
    updateAccountUI();
    persistState();
    showToast("Profile updated");
  });

  refs.toggleSignBtn.addEventListener("click", () => {
    state.user.signedIn = !state.user.signedIn;
    updateAccountUI();
    persistState();
    showToast(state.user.signedIn ? "Signed in" : "Signed out");
  });

  refs.viewRewardsBtn.addEventListener("click", () => {
    closeDrawers();
    showDialog("Rewards", `You have ${state.user.rewards} points. Redeem at checkout.`);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawers();
      closeDialog();
    }
  });
}

function init() {
  refs.instructionsInput.value = state.instructions;
  renderCategories();
  renderProducts();
  renderFavorites();
  renderCart();
  updateAccountUI();
  updateSettingsUI();
  setView(state.currentView);
  bindEvents();
}

init();