document.addEventListener("DOMContentLoaded", function () {
  // Initialize all charts
  initRevenueTrendsChart();
  initRevenueSourcesChart();
  initMonthlyPerformanceChart();
  initHeatmapChart();

  // Set up event listeners
  setupFilterListeners();

  function initRevenueTrendsChart() {
    const ctx = document.createElement("canvas");
    ctx.height = 300;
    const container = document.querySelector(".chart-area");
    container.innerHTML = "";
    container.appendChild(ctx);

    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Revenue",
            data: [
              40000, 30000, 60000, 48000, 52000, 75000, 68000, 90000, 85000,
              92000, 110000, 215000,
            ],
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "#fff",
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "#fff",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return "$" + context.parsed.y.toLocaleString();
              },
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
        },
      },
    });
  }

  function initRevenueSourcesChart() {
    const ctx = document.createElement("canvas");
    const container = document.querySelector(".chart-pie");
    container.innerHTML = "";
    container.appendChild(ctx);

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Product A", "Product B", "Product C", "Product D", "Other"],
        datasets: [
          {
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              "#4e73df",
              "#1cc88a",
              "#36b9cc",
              "#f6c23e",
              "#e74a3b",
            ],
            hoverBackgroundColor: [
              "#2e59d9",
              "#17a673",
              "#2c9faf",
              "#dda20a",
              "#be2617",
            ],
            hoverBorderColor: "rgba(234, 236, 244, 1)",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                const total = context.dataset.data.reduce(
                  (acc, data) => acc + data,
                  0
                );
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${percentage}% ($${Math.round(
                  (215000 * value) / 100
                ).toLocaleString()})`;
              },
            },
          },
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
        },
        cutout: "70%",
      },
    });
  }

  function initMonthlyPerformanceChart() {
    const ctx = document.createElement("canvas");
    const container = document.querySelectorAll(".card-body")[3];
    container.innerHTML = "";
    container.appendChild(ctx);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            label: "Sales",
            backgroundColor: "#4e73df",
            hoverBackgroundColor: "#2e59d9",
            borderColor: "#4e73df",
            data: [130000, 165000, 195000, 305000],
          },
          {
            label: "Profit",
            backgroundColor: "#1cc88a",
            hoverBackgroundColor: "#17a673",
            borderColor: "#1cc88a",
            data: [39000, 49500, 58500, 91500],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return (
                  context.dataset.label +
                  ": $" +
                  context.parsed.y.toLocaleString()
                );
              },
            },
          },
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
        },
      },
    });
  }

  function initHeatmapChart() {
    const ctx = document.createElement("canvas");
    const container = document.querySelectorAll(".card-body")[4];
    container.innerHTML = "";
    container.appendChild(ctx);

    // Heatmap data preparation
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const hours = [
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
    ];

    const data = {
      labels: hours,
      datasets: days.map((day) => ({
        label: day,
        data: hours.map((hour) => {
          // Generate random data for demo
          const base = hour >= 10 && hour <= 15 ? 70 : 30;
          return Math.floor(base + Math.random() * 30);
        }),
      })),
    };

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: hours,
        datasets: days.map((day, i) => ({
          label: day,
          data: data.datasets[i].data,
          backgroundColor: data.datasets[i].data.map((value) => {
            const opacity = value / 100;
            return `rgba(78, 115, 223, ${opacity})`;
          }),
          borderColor: "rgba(78, 115, 223, 0.1)",
          borderWidth: 1,
        })),
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label} at ${context.label}:00 - ${context.raw} users`;
              },
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function (value) {
                return value + " users";
              },
            },
          },
        },
      },
    });
  }

  function setupFilterListeners() {
    // Date range filter
    document
      .querySelector("#sidebar .form-select")
      .addEventListener("change", function () {
        updateChartsBasedOnFilters();
      });

    // Category checkboxes
    document
      .querySelectorAll("#sidebar .form-check-input")
      .forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          updateChartsBasedOnFilters();
        });
      });

    // Region filter
    document
      .querySelector("#sidebar .form-select:last-of-type")
      .addEventListener("change", function () {
        updateChartsBasedOnFilters();
      });

    // Apply filters button
    document
      .querySelector("#sidebar .btn-primary")
      .addEventListener("click", function () {
        updateChartsBasedOnFilters();
      });

    // Refresh button
    document
      .querySelector(".btn-outline-secondary:last-of-type")
      .addEventListener("click", function () {
        initRevenueTrendsChart();
        initRevenueSourcesChart();
        initMonthlyPerformanceChart();
        initHeatmapChart();
        showToast("Data refreshed successfully");
      });
  }

  function updateChartsBasedOnFilters() {
    const dateRange = document.querySelector("#sidebar .form-select").value;
    const categories = Array.from(
      document.querySelectorAll("#sidebar .form-check-input:checked")
    ).map((cb) => cb.nextElementSibling.textContent);
    const region = document.querySelector(
      "#sidebar .form-select:last-of-type"
    ).value;

    showToast(
      `Filters applied: ${dateRange}, Categories: ${categories.join(
        ", "
      )}, Region: ${region}`
    );
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className =
      "toast align-items-center text-white bg-primary border-0 position-fixed bottom-0 end-0 m-3";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    toast.style.zIndex = "9999";

    toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

    document.body.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    setTimeout(() => bsToast.hide(), 3000);
  }
});
