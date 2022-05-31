$(function () {
  isAuth("pages/pqr/", true);
});

$(document).ready(function () {
  $("#form-login").submit(function (event) {
    login();
    event.preventDefault();
  });
});

const login = () => {
  const email = $("#email_login").val();
  const password = $("#password_login").val();

  if (email === "" || password === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor llenar los campos vacios",
    });
  } else if (email.indexOf("@", 0) == -1 || email.indexOf(".", 0) == -1) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "El correo electrónico introducido no es correcto.",
    });
  } else {
    $.ajax({
      type: "POST",
      url: `${API}login/login.php`,
      data: { email, password },
      dataType: "json",
      error: function (error) {
        alert(error);
      },
      success: function ({ estado, token, id_usuario, tipo }) {
        if (!estado) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Correo o Contraseña incorrecta.",
          });
        } else {
          localStorage.setItem("token", token);
          localStorage.setItem("id_usuario", id_usuario);
          localStorage.setItem("tipo", tipo);
          isAuth("pages/pqr/", true);
        }
      },
    });
  }
};
