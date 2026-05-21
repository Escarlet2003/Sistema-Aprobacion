let currentUser = null;

let state = {
  usuarios: [
    {
      id: 1,
      nombre: "Administrador",
      cargo: "Gerente",
      correo: "admin@empresa.com",
      password: "admin123",
      rol: "Administrador"
    },
    {
      id: 2,
      nombre: "María Pérez",
      cargo: "Analista",
      correo: "maria@empresa.com",
      password: "1234",
      rol: "Usuario"
    }
  ],

  documentos: [
    {
      id: 1,
      nombre: "Política de Seguridad",
      tipo: "PDF",
      estado: "Aprobado"
    },
    {
      id: 2,
      nombre: "Procedimiento TI",
      tipo: "Word",
      estado: "En revisión"
    }
  ]
};

function saveData() {
  localStorage.setItem("gesdoc_data", JSON.stringify(state));
}

function loadData() {

  const data = localStorage.getItem("gesdoc_data");

  if (data) {
    return JSON.parse(data);
  }

  return state;
}

function doLogin() {

  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPass").value;

  const user = state.usuarios.find(u =>
    u.correo === email &&
    u.password === pass
  );

  if (!user) {

    document.getElementById("loginError").style.display = "block";

    return;
  }

  currentUser = user;

  document.getElementById("loginError").style.display = "none";

  document.getElementById("loginPage").classList.add("hidden");

  document.getElementById("mainApp").classList.remove("hidden");

  document.getElementById("headerUserName").innerText =
    user.nombre;

  document.getElementById("headerAvatar").innerText =
    user.nombre.charAt(0).toUpperCase();

  renderDashboard();
  renderDocumentos();
  renderUsuarios();

  showPage("dashboard");
}

function doLogout() {

  currentUser = null;

  document.getElementById("mainApp").classList.add("hidden");

  document.getElementById("loginPage").classList.remove("hidden");
}

function showPage(page) {

  const pages = [
    "dashboard",
    "documentos",
    "usuarios"
  ];

  pages.forEach(p => {

    const pageElement =
      document.getElementById(`page-${p}`);

    const navElement =
      document.getElementById(`nav-${p}`);

    if (pageElement) {
      pageElement.classList.add("hidden");
    }

    if (navElement) {
      navElement.classList.remove("active");
    }

  });

  const selectedPage =
    document.getElementById(`page-${page}`);

  const selectedNav =
    document.getElementById(`nav-${page}`);

  if (selectedPage) {
    selectedPage.classList.remove("hidden");
  }

  if (selectedNav) {
    selectedNav.classList.add("active");
  }

}

function renderDashboard() {

  const statsGrid =
    document.getElementById("statsGrid");

  if (!statsGrid) return;

  const totalDocs = state.documentos.length;

  statsGrid.innerHTML = `
  
    <div class="stat-card">
      <h3>Total documentos</h3>
      <br>
      <h1>${totalDocs}</h1>
    </div>

    <div class="stat-card">
      <h3>Usuarios</h3>
      <br>
      <h1>${state.usuarios.length}</h1>
    </div>

    <div class="stat-card">
      <h3>Aprobados</h3>
      <br>
      <h1>${
        state.documentos.filter(
          d => d.estado === "Aprobado"
        ).length
      }</h1>
    </div>

    <div class="stat-card">
      <h3>En revisión</h3>
      <br>
      <h1>${
        state.documentos.filter(
          d => d.estado === "En revisión"
        ).length
      }</h1>
    </div>
  `;
}

function renderDocumentos() {

  const tbody =
    document.getElementById("docsTableBody");

  if (!tbody) return;

  tbody.innerHTML = state.documentos.map(doc => {

    return `
      <tr>
        <td>${doc.nombre}</td>
        <td>${doc.tipo}</td>
        <td>${doc.estado}</td>
      </tr>
    `;

  }).join("");
}

function renderUsuarios() {

  const tbody =
    document.getElementById("usuariosTableBody");

  if (!tbody) return;

  tbody.innerHTML = state.usuarios.map(user => {

    return `
      <tr>
        <td>${user.nombre}</td>
        <td>${user.cargo}</td>
        <td>${user.correo}</td>
        <td>${user.rol}</td>
      </tr>
    `;

  }).join("");
}

window.onload = () => {

  state = loadData();

  console.log("GesDoc cargado correctamente");
};