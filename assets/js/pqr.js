$(function () {
  isAuth("/frontend_pqr/pages/login/ingresar.html");
});

$(document).ready(function () {
  $("#logout").click(function () {
    cerrarSesion();
  });
  eliminarElementos();
  $("#form-add-pqr").submit(function (event) {
    crear();
    event.preventDefault();
  });
  $("#form-edit-pqr").submit(function (event) {
    editar();
    event.preventDefault();
  });
  $("#form-delete-pqr").submit(function (event) {
    eliminar();
    event.preventDefault();
    listar();
  });
  $("#form-estado-pqr").submit(function (event) {
    cambiarEstado();
    event.preventDefault();
    listar();
  });
  listar();
});

const crear = () => {
  const tipo_pqr = $("#tipo_pqr").val();
  const asunto = $("#asunto").val();
  const nombre = $("#user").val();
  if (asunto === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor llenar los campos vacios",
    });
  } else {
    $.ajax({
      type: "POST",
      url: `${API}pqr/crear.php`,
      data: { tipo_pqr, asunto, nombre },
      dataType: "json",
      headers: { Authorization: localStorage.token },
      error: function ({ status }) {
        if (status === 401) {
          cerrarSesion();
        } else {
          alert(status);
        }
      },
      success: function () {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Guardado exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
        $("#tipo_pqr").val("");
        $("#asunto").val("");
        $("#user").val("");
        $("#myModal").modal("hide");
        listar();
      },
    });
  }
};

const listar = () => {
  $.ajax({
    type: "GET",
    url: `${API}pqr/list.php`,
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
    $("#tbl-pqr tbody").off("click", "tr .btn-editar");
    $("#tbl-pqr tbody").off("click", "tr .btn-eliminar");
    $("#tbl-pqr tbody").off("click", "tr .btn-estado");
    const table = $("#tbl-pqr").DataTable({
      data: items,
      destroy: true,
      dom: "Bfrtip",
      buttons: ["csv", "excel", "pdf"],
      columnDefs: [
        {
          target: 6,
          visible: localStorage.tipo != "administrador" ? false : true,
        },
      ],
      columns: [
        { data: "tipo_pqr" },
        { data: "asunto" },
        { data: "nombre_usuario" },
        { data: "estado" },
        { data: "fecha_creacion" },
        { data: "fecha_limite" },
        {
          render: function () {
            return `<i class="bi bi-pencil-fill btn btn-warning btn-editar"></i> <i class="bi bi-trash3-fill btn btn-danger btn-eliminar"></i> <i class=" btn btn-primary bi bi-arrow-up-circle-fill btn-estado"></i>`;
          },
        },
      ],
    });

    $("#tbl-pqr tbody").on("click", "tr .btn-editar", function () {
      let { id_pqr, asunto, tipo_pqr, estado, usuario } = table
        .row($(this).parent())
        .data();
      const sw = false;
      if (estado === "Cerrado") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se puede editar despues de cerrado",
        });
        sw = true;
      }
      if (sw === false) {
        listarUsuariosGeneralEditar(usuario);
        $("#id_pqr").val(id_pqr);
        $("#tipo_pqr_edit").val(tipo_pqr);
        $("#asunto_edit").val(asunto);
        $("#estado_edit").val(estado);

        $("#myModal3").modal();
      }
    });
    $("#tbl-pqr tbody").on("click", "tr .btn-eliminar", function () {
      let { id_pqr } = table.row($(this).parent()).data();
      $("#myModal4").modal();
      $("#id_delete").val(id_pqr);
    });
    $("#tbl-pqr tbody").on("click", "tr .btn-estado", function () {
      let { id_pqr, estado } = table.row($(this).parent()).data();
      if (estado === "Cerrado") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se puede actualizar estado despues de cerrado",
        });
      } else {
        $("#myModal5").modal();
        $("#id_estado").val(id_pqr);
        $("#estado_estado").val(estado);
      }
    });
  });
};

const editar = () => {
  const id = $("#id_pqr").val();
  const tipo = $("#tipo_pqr_edit").val();
  const asunto = $("#asunto_edit").val();
  const estado = $("#estado_edit").val();
  const usuario = $("#usuario_edit").val();

  if (
    id === 0 ||
    tipo === "" ||
    asunto === "" ||
    estado === "" ||
    usuario === ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor llenar los campos vacios",
    });
  } else {
    $.ajax({
      type: "POST",
      url: `${API}pqr/editar.php`,
      data: { id, tipo, asunto, estado, usuario },
      dataType: "json",
      headers: { Authorization: localStorage.token },
      error: function ({ status }) {
        if (status === 401) {
          cerrarSesion();
        } else {
          alert(status);
        }
      },
      success: function () {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Editado exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
        $("#id_pqr").val("");
        $("#tipo_pqr_edit").val("");
        $("#asunto_edit").val("");
        $("#usuario_edit").val("");
        $("#myModal3").modal("hide");
        listar();
      },
    });
  }
};

const eliminar = () => {
  const id = $("#id_delete").val();
  $.ajax({
    type: "POST",
    url: `${API}pqr/eliminar.php`,
    data: { id },
    dataType: "json",
    headers: { Authorization: localStorage.token },
    error: function ({ status }) {
      if (status === 401) {
        cerrarSesion();
      } else {
        alert(status);
      }
    },
    success: function () {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Eliminado exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
      $("#myModal4").modal("hide");
    },
  });
};

const listarUsuariosGeneralEditar = (usuario = "") => {
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
  }).done(async function (item) {
    $("#usuario_edit").html("");
    await item.map((i) => {
      $("#usuario_edit").prepend(
        "<option value=" + i.id + ">" + i.nombre + "</option>"
      );
    });
    $("#usuario_edit").val(usuario);
  });
};

const cambiarEstado = () => {
  const id = $("#id_estado").val();
  const estado = $("#estado_estado").val();
  $.ajax({
    type: "POST",
    url: `${API}pqr/estado.php`,
    data: { id, estado },
    dataType: "json",
    headers: { Authorization: localStorage.token },
    error: function ({ status }) {
      if (status === 401) {
        cerrarSesion();
      } else {
        alert(status);
      }
    },
    success: function () {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Estado actualizado exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
      listar();
      $("#myModal5").modal("hide");
    },
  });
};

const eliminarElementos = () => {
  if (localStorage.tipo != "administrador") $("#container_actions").html("");
  if (localStorage.tipo != "administrador") $("#TipoNavbar").html("Usuario");
};
