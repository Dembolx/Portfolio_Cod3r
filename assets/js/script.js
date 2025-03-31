/**
 * Główny plik JavaScript dla portfolio
 * Łączy wszystkie funkcjonalności:
 * - Firebase (opinie)
 * - EmailJS (formularz kontaktowy)
 * - Filtrowanie portfolio
 * - Responsywna nawigacja
 * - Modal z opiniami
 * - Formularze
 */

"use strict";

// ------------------------- INICJALIZACJA USŁUG ZEWNĘTRZNYCH -------------------------

// Inicjalizacja EmailJS
emailjs.init("9gxouQUbzS9PIbVfM");

// Konfiguracja Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaADfrLI-9w_GTMZtI91swAKQ9EWxhWSs",
  authDomain: "opinie-do-portfolio.firebaseapp.com",
  databaseURL:
    "https://opinie-do-portfolio-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "opinie-do-portfolio",
  storageBucket: "opinie-do-portfolio.appspot.com",
  messagingSenderId: "4918334258",
  appId: "1:4918334258:web:c2cec434f53beed5943d2b",
  measurementId: "G-F7RS35VFJN",
};

// Inicjalizacja Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ------------------------- FUNKCJE POMOCNICZE -------------------------

/**
 * Przełączanie klasy 'active' na elementach
 * @param {HTMLElement} elem - Element do przełączenia
 */
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// ------------------------- SYSTEM OPINII (FIREBASE) -------------------------

/**
 * Inicjalizacja systemu opinii
 */
function initOpinieSystem() {
  const opinieForm = document.getElementById("formularz-opinii");
  if (!opinieForm) return;

  loadOpinie();

  opinieForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const imie = this.imie.value.trim();
    const ocena = parseInt(
      document.querySelector('input[name="ocena"]:checked').value
    );
    const tresc = this.tresc.value.trim();

    if (!imie || !tresc) {
      alert("Proszę wypełnić wszystkie wymagane pola!");
      return;
    }

    const nowaOpinie = {
      imie: imie,
      ocena: ocena,
      tresc: tresc,
      data: new Date().toISOString(),
    };

    try {
      addOpinieLocally(nowaOpinie);
      this.reset();
      const opinieRef = await saveOpinie(nowaOpinie);
      console.log("Opinia zapisana z ID:", opinieRef.key);
      alert("Dziękujemy za Twoją opinię!");
    } catch (error) {
      console.error("Błąd zapisywania opinii:", error);
      alert("Wystąpił błąd podczas zapisywania opinii.");
    }
  });
}

/**
 * Dodaje opinię lokalnie do DOM
 */
function addOpinieLocally(nowaOpinie) {
  const opinieContainer = document.querySelector(".opinie-container");
  if (!opinieContainer) return;

  const brakOpinii = opinieContainer.querySelector(".brak-opinii");
  if (brakOpinii) brakOpinii.remove();

  const gwiazdki =
    "★".repeat(nowaOpinie.ocena) + "☆".repeat(5 - nowaOpinie.ocena);
  const data = new Date(nowaOpinie.data).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tempId = "temp-" + Date.now();

  const opiniaHTML = `
    <div class="opinie-item" data-id="${tempId}">
      <div class="naglowek">
        <span class="autor">${nowaOpinie.imie}</span>
        <span class="data">${data}</span>
      </div>
      <div class="ocena">${gwiazdki}</div>
      <div class="tresc">${nowaOpinie.tresc}</div>
    </div>
  `;

  opinieContainer.insertAdjacentHTML("afterbegin", opiniaHTML);
}

/**
 * Zapisuje opinię do Firebase
 */
async function saveOpinie(nowaOpinie) {
  const nowyRef = database.ref("opinie/").push();
  await nowyRef.set(nowaOpinie);
  return nowyRef;
}

/**
 * Ładuje opinie z Firebase
 */
function loadOpinie() {
  const opinieRef = database.ref("opinie/");
  const opinieContainer = document.querySelector(".opinie-container");

  if (!opinieContainer || opinieContainer.dataset.loaded === "true") return;
  opinieContainer.dataset.loaded = "true";
  opinieContainer.innerHTML = "";

  opinieRef.once("value").then((snapshot) => {
    const opinieData = snapshot.val();

    if (!opinieData || Object.keys(opinieData).length === 0) {
      opinieContainer.innerHTML =
        '<p class="brak-opinii">Brak opinii. Bądź pierwszy który doda opinię!</p>';
      return;
    }

    const opinieArray = Object.entries(opinieData)
      .map(([id, opinia]) => ({ id, ...opinia }))
      .sort((a, b) => new Date(b.data) - new Date(a.data));

    opinieArray.forEach((opinia, index) => {
      const gwiazdki = "★".repeat(opinia.ocena) + "☆".repeat(5 - opinia.ocena);
      const data = new Date(opinia.data).toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const opiniaElement = document.createElement("div");
      opiniaElement.className = "opinie-item";
      opiniaElement.style.animationDelay = `${index * 0.1}s`;
      opiniaElement.innerHTML = `
        <div class="naglowek">
          <span class="autor">${opinia.imie}</span>
          <span class="data">${data}</span>
        </div>
        <div class="ocena">${gwiazdki}</div>
        <div class="tresc">${opinia.tresc}</div>
      `;

      opinieContainer.appendChild(opiniaElement);
    });
  });
}

// ------------------------- FORMULARZ KONTAKTOWY (EMAILJS) -------------------------

/**
 * Inicjalizacja formularza kontaktowego
 */
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const submitBtn = contactForm.querySelector("[data-form-btn]");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = "<span>Wysyłanie...</span>";

    emailjs
      .sendForm("service_5a28f8g", "template_uzpl48p", contactForm)
      .then(function () {
        alert("Wiadomość wysłana pomyślnie!");
        contactForm.reset();
      })
      .catch(function (error) {
        console.error("Błąd wysyłania wiadomości:", error);
        alert(
          "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później."
        );
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<ion-icon name="paper-plane"></ion-icon><span>Wyślij wiadomość</span>';
      });
  });
}

// ------------------------- FILTROWANIE PORTFOLIO -------------------------

function initPortfolioFilters() {
  // Pobranie elementów DOM
  const filterButtons = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const projectItems = document.querySelectorAll("[data-filter-item]");
  const selectValue = document.querySelector("[data-selecct-value]"); // Poprawione data-select-value
  const filterSelect = document.querySelector("[data-select]");
  const selectList = document.querySelector(".select-list");

  // Mapa kategorii dla spójności
  const categoryMap = {
    all: "all",
    "web design": "web-design",
    "web development": "web-development",
  };

  // Funkcja filtrowania projektów
  function filterProjects(category) {
    projectItems.forEach((item) => {
      const itemCategory = item.dataset.category;

      if (category === "all" || itemCategory === category) {
        item.style.display = "block";
        setTimeout(() => {
          item.classList.add("active");
        }, 10);
      } else {
        item.style.display = "none";
        item.classList.remove("active");
      }
    });
  }

  // Funkcja aktualizacji UI
  function updateUI(activeCategory, displayText) {
    // Aktualizacja przycisków (desktop)
    filterButtons.forEach((btn) => {
      const btnCategory = categoryMap[btn.textContent.toLowerCase()];
      btn.classList.toggle("active", btnCategory === activeCategory);
    });

    // Aktualizacja selecta (mobile)
    selectValue.textContent = displayText;
  }

  // Obsługa przycisków (desktop)
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const buttonText = this.textContent.toLowerCase();
      const filterValue = categoryMap[buttonText];

      updateUI(filterValue, this.textContent);
      filterProjects(filterValue);
    });
  });

  // Obsługa selecta (mobile)
  filterSelect.addEventListener("click", function (e) {
    e.stopPropagation();
    this.classList.toggle("active");
    selectList.style.opacity = this.classList.contains("active") ? "1" : "0";
    selectList.style.visibility = this.classList.contains("active")
      ? "visible"
      : "hidden";
    selectList.style.pointerEvents = this.classList.contains("active")
      ? "all"
      : "none";
  });

  // Obsługa wyboru w select (mobile)
  selectItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.stopPropagation();

      const itemText = this.textContent.toLowerCase();
      const filterValue = categoryMap[itemText];

      // Zamknij select
      filterSelect.classList.remove("active");
      selectList.style.opacity = "0";
      selectList.style.visibility = "hidden";
      selectList.style.pointerEvents = "none";

      // Aktualizuj UI i filtruj
      updateUI(filterValue, this.textContent);
      filterProjects(filterValue);
    });
  });

  // Zamknij select po kliknięciu poza
  document.addEventListener("click", function () {
    filterSelect.classList.remove("active");
    selectList.style.opacity = "0";
    selectList.style.visibility = "hidden";
    selectList.style.pointerEvents = "none";
  });

  // Inicjalizacja z domyślnym filtrem "All"
  if (filterButtons.length > 0) {
    filterButtons[0].click();
  } else if (selectItems.length > 0) {
    selectValue.textContent = "All";
    filterProjects("all");
  }
}

// Inicjalizacja po załadowaniu DOM
document.addEventListener("DOMContentLoaded", initPortfolioFilters);
// ------------------------- MODAL Z OPINIAMI -------------------------

/**
 * Inicjalizacja modala z opiniami
 */
function initTestimonialsModal() {
  const testimonialsItem = document.querySelectorAll(
    "[data-testimonials-item]"
  );
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector(
        "[data-testimonials-title]"
      ).innerHTML;
      modalText.innerHTML = this.querySelector(
        "[data-testimonials-text]"
      ).innerHTML;
      testimonialsModalFunc();
    });
  }

  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}

// ------------------------- NAWIGACJA STRON -------------------------

/**
 * Inicjalizacja nawigacji między stronami
 */
function showSection(sectionId) {
  // Ukryj wszystkie sekcje
  document.querySelectorAll("[data-page]").forEach((section) => {
    section.style.display = "none";
    section.classList.remove("active");
  });

  // Pokaż wybraną sekcję
  const activeSection = document.getElementById(sectionId + "-section");
  if (activeSection) {
    activeSection.style.display = "block";
    activeSection.classList.add("active");

    // Jeśli to sekcja opinii, odśwież listę
    if (sectionId === "opinie") {
      loadOpinie();
    }
  }

  // Aktualizuj aktywny przycisk w navbarze
  document.querySelectorAll(".navbar-link").forEach((link) => {
    link.classList.remove("active");
  });

  const activeNavLink = document.querySelector(
    `[data-nav-link][onclick="showSection('${sectionId}')"]`
  );
  if (activeNavLink) {
    activeNavLink.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initPortfolioFilters();
});

function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const projectItems = document.querySelectorAll("[data-filter-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterSelect = document.querySelector("[data-select]");
  const selectList = document.querySelector(".select-list");

  // Mapowanie tekstu przycisków na wartości data-category
  const categoryMap = {
    all: "all",
    "web design": "web-design",
    "web development": "web-development",
  };

  // Filtrowanie projektów
  function filterProjects(category) {
    projectItems.forEach((item) => {
      if (category === "all" || item.dataset.category === category) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // Obsługa przycisków filtrowania
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Usuń aktywną klasę ze wszystkich przycisków
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Dodaj aktywną klasę do klikniętego przycisku
      this.classList.add("active");

      // Pobierz odpowiednią kategorię
      const buttonText = this.textContent.toLowerCase();
      const filterValue = categoryMap[buttonText] || "all";

      // Filtruj projekty
      filterProjects(filterValue);

      // Aktualizuj wartość selecta
      selectValue.textContent = this.textContent;
    });
  });
}

// ------------------------- SIDEBAR (MOBILE) -------------------------

/**
 * Inicjalizacja responsywnego sidebaru
 */
function initSidebar() {
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}

// ------------------------- WALIDACJA FORMULARZY -------------------------

/**
 * Inicjalizacja walidacji formularzy
 */
function initFormValidation() {
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }
}

// ------------------------- INICJALIZACJA PO ZAŁADOWANIU DOM -------------------------

document.addEventListener("DOMContentLoaded", function () {
  initSidebar();
  initContactForm();
  initOpinieSystem();
  initPortfolioFilters();
  initTestimonialsModal();
  initPageNavigation();
  initFormValidation();

  // Funkcja do przełączania sekcji
  window.showSection = function (sectionId) {
    document.querySelectorAll("[data-page]").forEach((section) => {
      section.style.display = "none";
      section.classList.remove("active");
    });

    const activeSection = document.getElementById(sectionId + "-section");
    if (activeSection) {
      activeSection.style.display = "block";
      activeSection.classList.add("active");

      if (sectionId === "opinie") {
        loadOpinie();
      }
    }

    document.querySelectorAll(".navbar-link").forEach((link) => {
      link.classList.remove("active");
    });

    const activeNavLink = document.querySelector(
      `[data-nav-link][onclick="showSection('${sectionId}')"]`
    );
    if (activeNavLink) {
      activeNavLink.classList.add("active");
    }
  };
});

// ------------------------- Obsługa animacji scrollowania -------------------------
function animateOnScroll() {
  const elements = document.querySelectorAll(".scroll-animate");
  const windowHeight = window.innerHeight;
  const triggerOffset = 100;

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;

    if (elementPosition < windowHeight - triggerOffset) {
      element.classList.add("animated");
    }
  });
}

// Inicjalizacja
window.addEventListener("scroll", animateOnScroll);
document.addEventListener("DOMContentLoaded", animateOnScroll);
