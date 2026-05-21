function showPage(page) {

  const pages = ["dashboard", "documentos", "usuarios"];

  pages.forEach(p => {

    const pageElement = document.getElementById(`page-${p}`);
    const navElement = document.getElementById(`nav-${p}`);

    if (pageElement) {
      pageElement.classList.add("hidden");
    }

    if (navElement) {
      navElement.classList.remove("active");
    }

  });

  const selectedPage = document.getElementById(`page-${page}`);
  const selectedNav = document.getElementById(`nav-${page}`);

  if (selectedPage) {
    selectedPage.classList.remove("hidden");
  }

  if (selectedNav) {
    selectedNav.classList.add("active");
  }

}

function renderDashboard() {
  const totalDocs = state.documentos.length;

  document.getElementById("statsGrid").innerHTML = `
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
      <h1>${state.documentos.filter(d => d.estado === 'Aprobado').length}</h1>
    </div>

    <div class="stat-card">
      <h3>En revisión</h3>
      <br>
      <h1>${state.documentos.filter(d => d.estado === 'En revisión').length}</h1>
    </div>
  `;
}

function renderDocumentos() {

  const tbody = document.getElementById("docsTableBody");

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

  const tbody = document.getElementById("usuariosTableBody");

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
};