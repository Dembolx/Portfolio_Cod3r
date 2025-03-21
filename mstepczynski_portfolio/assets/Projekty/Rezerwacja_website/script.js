document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const bookingForm = document.getElementById("booking-form");
  const confirmation = document.getElementById("confirmation");

  // Initialize FullCalendar
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    selectable: true,
    dateClick: function (info) {
      document.getElementById("date").value = info.dateStr;
    },
    events: [
      {
        title: "Available",
        start: "2023-10-10",
        end: "2023-10-10",
      },
      {
        title: "Booked",
        start: "2023-10-15",
        end: "2023-10-15",
        color: "red",
      },
    ],
  });

  calendar.render();

  // Handle booking form submission
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const sessionType = document.getElementById("session-type").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const notes = document.getElementById("notes").value;

    // Send email notification using SMTP.js
    Email.send({
      Host: "smtp.elasticemail.com",
      Username: "your-email@example.com",
      Password: "your-email-password",
      To: email,
      From: "your-email@example.com",
      Subject: "Training Session Confirmation",
      Body: `Hi ${name}, your ${sessionType} session on ${date} at ${time} has been booked! Notes: ${notes}`,
    }).then(() => {
      confirmation.style.display = "block";
      bookingForm.reset();
    });
  });
});
