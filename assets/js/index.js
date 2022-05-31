const API = "http://localhost/backend_pqr/routes/";
const SERVER_FRONT = "http://localhost";

const isAuth = (render, validate = false) => {
  const isAuth = localStorage.token;
  if (!!isAuth === validate) {
    location.href = `${SERVER_FRONT}${render}`;
  }
};

const cerrarSesion = () => {
  localStorage.setItem("token", "");
  localStorage.setItem("id_usuario", "");
  localStorage.setItem("tipo", "");
  isAuth("/frontend_pqr/pages/login/ingresar.html");
};
