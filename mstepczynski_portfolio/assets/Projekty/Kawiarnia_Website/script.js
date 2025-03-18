// Dane menu
const menuData = [
  {
    category: "coffee",
    items: [
      {
        name: "Artisan Cappuccino",
        description:
          "Double shot of espresso with perfectly steamed milk and signature latte art",
        price: 4.5,
        image: "assets/coffee/Artisan_Cappuccino.jpg",
      },
      {
        name: "Espresso",
        description: "A strong shot of espresso for a quick caffeine boost",
        price: 3.0,
        image: "assets/coffee/Espresso.jpg",
      },
      {
        name: "Latte",
        description:
          "Smooth espresso with steamed milk and a light layer of foam",
        price: 4.0,
        image: "assets/coffee/Latte.jpg",
      },
      {
        name: "Mocha",
        description:
          "Espresso with chocolate syrup, steamed milk, and whipped cream",
        price: 4.75,
        image: "assets/coffee/Mocha.jpg",
      },
      {
        name: "Americano",
        description: "Espresso diluted with hot water for a milder flavor",
        price: 3.5,
        image: "assets/coffee/Americano.jpg",
      },
    ],
  },
  {
    category: "food",
    items: [
      {
        name: "Avocado Toast",
        description:
          "Smashed avocado on sourdough bread with a sprinkle of chili flakes",
        price: 8.5,
        image: "assets/Food/Avocado_Toast.jpg",
      },
      {
        name: "Eggs Benedict",
        description: "Poached eggs on English muffins with hollandaise sauce",
        price: 10.0,
        image: "assets/Food/Eggs_Benedict.jpg",
      },
      {
        name: "Grilled Cheese Sandwich",
        description: "Melted cheddar and mozzarella on toasted bread",
        price: 7.5,
        image: "assets/Food/Grilled_Cheese_Sandwich.jpg",
      },
      {
        name: "Caesar Salad",
        description: "Romaine lettuce, croutons, parmesan, and Caesar dressing",
        price: 9.0,
        image: "assets/Food/Caesar_Salad.jpg",
      },
    ],
  },
  {
    category: "desserts",
    items: [
      {
        name: "Chocolate Cake",
        description: "Rich and moist chocolate cake with a creamy frosting",
        price: 6.0,
        image: "assets/Desserts/Chocolate_Cake.jpg",
      },
      {
        name: "Cheesecake",
        description: "Creamy cheesecake with a graham cracker crust",
        price: 6.5,
        image: "assets/Desserts/Cheesecake.jpg",
      },
      {
        name: "Tiramisu",
        description:
          "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
        price: 7.0,
        image: "assets/Desserts/Tiramisu.jpg",
      },
      {
        name: "Apple Pie",
        description:
          "Warm apple pie with a flaky crust and a scoop of vanilla ice cream",
        price: 6.0,
        image: "assets/Desserts/Apple_Pie.jpg",
      },
    ],
  },
];

tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#B8860B",
        secondary: "#D2B48C",
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

// Funkcja do renderowania menu
function renderMenu(category) {
  const menuContainer = document.getElementById("menu-items");
  menuContainer.innerHTML = ""; // Wyczyść obecne elementy

  const selectedCategory = menuData.find((item) => item.category === category);
  if (!selectedCategory) return;

  selectedCategory.items.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.classList.add(
      "menu-card",
      "bg-white",
      "p-6",
      "rounded-lg",
      "shadow-md"
    );

    menuItem.innerHTML = `
            <img src="${item.image}" alt="${
      item.name
    }" class="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 class="font-['Playfair_Display'] text-xl text-gray-900 mb-2">${
              item.name
            }</h3>
            <p class="text-gray-600 mb-4">${item.description}</p>
            <p class="text-primary font-semibold">$${item.price.toFixed(2)}</p>
        `;

    menuContainer.appendChild(menuItem);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Obsługa menu
  const coffeeBtn = document.getElementById("coffee-btn");
  const foodBtn = document.getElementById("food-btn");
  const dessertsBtn = document.getElementById("desserts-btn");

  const buttons = [coffeeBtn, foodBtn, dessertsBtn];

  // Funkcja do renderowania menu
  function renderMenu(category) {
    const menuContainer = document.getElementById("menu-items");
    menuContainer.innerHTML = ""; // Wyczyść obecne elementy

    const selectedCategory = menuData.find(
      (item) => item.category === category
    );
    if (!selectedCategory) return;

    selectedCategory.items.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.classList.add(
        "menu-card",
        "bg-white",
        "p-6",
        "rounded-lg",
        "shadow-md"
      );

      menuItem.innerHTML = `
                <img src="${item.image}" alt="${
        item.name
      }" class="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 class="font-['Playfair_Display'] text-xl text-gray-900 mb-2">${
                  item.name
                }</h3>
                <p class="text-gray-600 mb-4">${item.description}</p>
                <p class="text-primary font-semibold">$${item.price.toFixed(
                  2
                )}</p>
            `;

      menuContainer.appendChild(menuItem);
    });
  }

  // Funkcja do zmiany koloru tła przycisków
  function handleButtonClick(button) {
    // Resetuj kolory wszystkich przycisków
    buttons.forEach((btn) => {
      btn.classList.remove("bg-primary/80", "bg-secondary/80");
      btn.classList.add("bg-primary", "bg-secondary");
    });

    // Jeśli kliknięty przycisk to nie "Coffee", zmień jego kolor tła
    if (button.id !== "coffee-btn") {
      button.classList.remove("bg-secondary");
      button.classList.add("bg-secondary/80");
    }
  }

  // Dodaj nasłuchiwanie na przyciskach menu
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = button.id.replace("-btn", ""); // Pobierz kategorię z ID przycisku
      renderMenu(category); // Renderuj menu dla wybranej kategorii
      handleButtonClick(button); // Zmień kolor tła przycisku
    });
  });

  // Domyślnie pokaż kawę
  renderMenu("coffee");
  coffeeBtn.classList.remove("bg-primary"); // Ustaw wyrazisty kolor tła dla przycisku "Coffee"
  coffeeBtn.classList.add("bg-primary/90"); // Ustaw ciemniejszy kolor tła dla przycisku "Coffee"

  // Obsługa formularza rezerwacji
  const reservationForm = document.getElementById("reservation-form");
  const successModal = document.getElementById("success-modal");
  const closeModalBtn = document.getElementById("close-modal");

  // Obsługa wysłania formularza
  reservationForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Zapobiegaj domyślnej akcji formularza

    // Pokaż modal
    successModal.classList.remove("hidden");
    successModal.classList.add("flex");
  });

  // Obsługa zamknięcia modala
  closeModalBtn.addEventListener("click", function () {
    successModal.classList.add("hidden");
    successModal.classList.remove("flex");
  });

  // Zamknij modal po kliknięciu poza nim
  successModal.addEventListener("click", function (e) {
    if (e.target === successModal) {
      successModal.classList.add("hidden");
      successModal.classList.remove("flex");
    }
  });
});
