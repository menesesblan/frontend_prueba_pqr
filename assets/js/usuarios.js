$(function () {
  isAuth("/frontend_pqr/pages/login/ingresar.html");
});

$(document).ready(function () {
  $("#form-add-user").submit(function (event) {
    crearUsuario();
    event.preventDefault();
  });

  $("#btn_agregarP").click(function () {
    listarUsuariosGeneral();
  });
  listarUsuarios();
});

const crearUsuario = () => {
  const nombre = $("#nombre").val();
  const email = $("#email").val();
  const tipo_u = $("#tipo_u").val();
  const password = $("#password").val();

  if (nombre === "" || email === "" || tipo_u === "" || password === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor llenar los campos vacios",
    });
    $("#myModal2").modal("show");
  } else if (email.indexOf("@", 0) == -1 || email.indexOf(".", 0) == -1) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "El correo electrónico introducido no es correcto. Intentelo nuevamente",
    });
  } else {
    $.ajax({
      type: "POST",
      url: `${API}usuarios/crear.php`,
      data: { nombre, email, tipo_u, password },
      dataType: "json",
      headers: { Authorization: localStorage.token },
      error: function ({ status }) {
        if (status === 401) {
          cerrarSesion();
        } else {
          alert(status);
        }
      },
      success: function ({ items }) {
        if (items == "Email ya registrado") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email ya registrado. Intentelo nuevamente",
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Usuario guardado exitosamente",
            showConfirmButton: false,
            timer: 1500,
          });
          $("#nombre").val("");
          $("#email").val("");
          $("#tipo_u").val("");
          $("#password").val("");
          $("#myModal2").modal("hide");
        }
      },
    });
  }
};

const listarUsuarios = () => {
  $.ajax({
    type: "GET",
    url: `${API}usuarios/list.php`,
    dataType: "json",
    headers: { Authorization: localStorage.token },
    error: function ({ status }) {
      if (status === 401) {
        cerrarSesion();
      } else {
        alert(status);
      }
    },
  }).done(function ({ items }) {
    $("#tbl-usuarios").DataTable({
      data: items,
      columns: [{ data: "nombre" }, { data: "correo" }],
    });
  });
};

const listarUsuariosGeneral = () => {
  $.ajax({
    type: "GET",
    url: `${API}usuarios/listarUser.php`,
    dataType: "json",
    headers: { Authorization: localStorage.token },
    error: function ({ status }) {
      if (status === 401) {
        cerrarSesion();
      } else {
        alert(status);
      }
    },
  }).done(function (item) {
    $("#user").html("");
    item.map((i) => {
      $("#user").prepend(
        "<option value=" + i.id + ">" + i.nombre + "</option>"
      );
    });
  });
};
