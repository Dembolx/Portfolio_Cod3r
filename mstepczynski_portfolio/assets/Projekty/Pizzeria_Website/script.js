tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#B91C1C",
        secondary: "#FEF3C7",
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        full: "9999px",
        button: "8px",
      },
    },
  },
};

document.addEventListener("DOMContentLoaded", function () {
  const menuContainer = document.getElementById("menu-items");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const cartBtn = document.getElementById("cartBtn");
  const cartPanel = document.getElementById("cartPanel");
  const closeCart = document.getElementById("closeCart");
  const cartItems = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotal");
  const cartCountEl = document.getElementById("cartCount");
  const contactForm = document.getElementById("contactForm");

  let cart = [];

  // Funkcja do renderowania menu
  function renderMenu(category = "All") {
    menuContainer.innerHTML = ""; // Wyczyść menu

    const selectedCategory = menuData.find(
      (section) => section.category === category
    );
    if (!selectedCategory) return;

    selectedCategory.items.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.classList.add(
        "bg-white",
        "rounded-lg",
        "shadow-sm",
        "overflow-hidden"
      );

      menuItem.innerHTML = `
        <div class="h-48 relative">
          <img src="${item.image}" alt="${
        item.name
      }" class="w-full h-full object-cover" />
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">${item.name}</h3>
          <p class="text-gray-600 mb-4">${item.description}</p>
          <div class="flex items-center justify-between">
            <span class="text-xl font-bold">$${item.price.toFixed(2)}</span>
            <button
              class="add-to-cart bg-primary text-white px-4 py-2 !rounded-button hover:bg-opacity-90"
              data-name="${item.name}"
              data-price="${item.price}"
            >
              Add to Cart
            </button>
          </div>
        </div>
      `;

      menuContainer.appendChild(menuItem);
    });

    // Dodaj event listener do przycisków "Add to Cart"
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", addToCart);
    });
  }

  // Funkcja do dodawania produktu do koszyka
  function addToCart(e) {
    const card = e.target.closest(".bg-white");
    const name = card.querySelector("h3").textContent;
    const price = parseFloat(
      card.querySelector(".text-xl.font-bold").textContent.replace("$", "")
    );
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name,
        price,
        quantity: 1,
      });
    }

    updateCart();
    cartPanel.classList.add("active");
  }

  // Funkcja do aktualizacji koszyka
  function updateCart() {
    if (cart.length === 0) {
      cartItems.innerHTML =
        '<div class="text-center text-gray-500 mt-8">Your cart is empty</div>';
      cartCountEl.textContent = "0";
      subtotalEl.textContent = "$0.00";
      return;
    }

    cartItems.innerHTML = cart
      .map(
        (item) => `
          <div class="flex justify-between items-center mb-4 pb-4 border-b">
            <div>
              <h4 class="font-semibold">${item.name}</h4>
              <p class="text-gray-600">$${item.price.toFixed(2)} × ${
          item.quantity
        }</p>
            </div>
            <div class="flex items-center gap-2">
              <button class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full" onclick="updateQuantity('${
                item.name
              }', ${item.quantity - 1})">
                <i class="ri-subtract-line"></i>
              </button>
              <span>${item.quantity}</span>
              <button class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full" onclick="updateQuantity('${
                item.name
              }', ${item.quantity + 1})">
                <i class="ri-add-line"></i>
              </button>
            </div>
          </div>
        `
      )
      .join("");

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
  }

  // Funkcja do aktualizacji ilości produktu w koszyku
  function updateQuantity(name, newQuantity) {
    if (newQuantity <= 0) {
      cart = cart.filter((item) => item.name !== name);
    } else {
      const item = cart.find((item) => item.name === name);
      if (item) {
        item.quantity = newQuantity;
      }
    }
    updateCart();
  }

  // Obsługa przycisków kategorii
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      categoryButtons.forEach((btn) => {
        btn.classList.remove("bg-primary", "text-white");
        btn.classList.add("bg-white", "text-gray-700");
      });
      this.classList.remove("bg-white", "text-gray-700");
      this.classList.add("bg-primary", "text-white");

      const category = this.getAttribute("data-category");
      renderMenu(category);
    });
  });

  // Obsługa koszyka
  cartBtn.addEventListener("click", () => {
    cartPanel.classList.add("active");
  });

  closeCart.addEventListener("click", () => {
    cartPanel.classList.remove("active");
  });

  // Obsługa formularza kontaktowego
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (name && email && message) {
      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50";
      successMessage.textContent =
        "Thank you for your message! We will get back to you soon.";
      document.body.appendChild(successMessage);
      contactForm.reset();

      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    }
  });

  // Domyślnie renderuj menu "All"
  renderMenu();
});