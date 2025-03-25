<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $to = "michal.stepczynski2006@email.com";
  $subject = "Nowa wiadomość od " . $_POST["fullname"];
  $message = "Email: " . $_POST["email"] . "\n\n" . $_POST["message"];
  $headers = "From: " . $_POST["email"];

  if (mail($to, $subject, $message, $headers)) {
    echo "<script>alert('Wysłano!'); window.location.href='/';</script>";
  } else {
    echo "<script>alert('Błąd wysyłania!');</script>";
  }
}
?>