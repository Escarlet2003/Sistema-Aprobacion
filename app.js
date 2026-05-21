// app.js

let currentUser = null;

/* =========================
   LOCAL STORAGE
========================= */

function saveData() {
  localStorage.setItem("gesdoc_state", JSON.stringify(state));
}

function loadData() {
  const saved = localStorage.getItem("gesdoc_state");

  if (saved) {
    const parsed = JSON.parse(saved);

    state.usuarios = parsed.usuarios || [];
    state.documentos = parsed.documentos || [];
    state.actividad = parsed.actividad || [];
  }
}

/* =========================
   STATE
========================= */

const state = {
  usuarios: [
    {
      id: 1,
      nombre: "Admin Sistema",
      cargo: "Administrador",
      correo: "admin@empresa.com",
      rol: "admin",
      pass: "admin123",
    },

    {
      id: 2,
      nombre: "Santo Almonte",
      cargo: "Gerente de Teclonogía",
      correo: "santo@empresa.com",
      rol: "revisor",
      pass: "rev123",
    },
  ],

  documentos: [],

  actividad: [],
};

/* =========================
   INIT
========================= */

loadData();

/* =========================
   LOGIN
========================= */

function doLogin() {

  const email =
    document.getElementById("loginEmail").value.trim();

  const pass =
    document.getElementById("loginPass").value.trim();

  const user = state.usuarios.find(
    u => u.correo === email && u.pass === pass
  );

  if (!user) {
    document.getElementById("loginError").style.display = "block";
    return;
  }

  currentUser = user;

  document.getElementById("loginError").style.display = "none";

  document.getElementById("loginPage")
    .classList.add("hidden");

  document.getElementById("mainApp")
    .classList.remove("hidden");

  document.getElementById("headerUserName")
    .textContent = user.nombre;

  document.getElementById("headerAvatar")
    .textContent = user.nombre
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0,2)
      .toUpperCase();

  updateBadges();

  showPage("dashboard");
}

/* =========================
   LOGOUT
========================= */

function doLogout() {

  currentUser = null;

  document.getElementById("loginPage")
    .classList.remove("hidden");

  document.getElementById("mainApp")
    .classList.add("hidden");
}

/* =========================
   BADGES
========================= */

function updateBadges() {

  document.getElementById("badge-docs")
    .textContent = state.documentos.length;

  document.getElementById("badge-rev")
    .textContent = state.documentos.filter(
      d => d.estado === "pendiente"
    ).length;
}

/* =========================
   SHOW PAGE
========================= */

function showPage(page) {

  ["dashboard","documentos"].forEach(p => {

    document.getElementById("page-" + p)
      .classList.add("hidden");

    document.getElementById("nav-" + p)
      ?.classList.remove("active");
  });

  document.getElementById("page-" + page)
    .classList.remove("hidden");

  document.getElementById("nav-" + page)
    ?.classList.add("active");

  if (page === "dashboard") {
    renderDashboard();
  }

  if (page === "documentos") {
    renderDocTable();
  }
}

/* =========================
   DASHBOARD
========================= */

function renderDashboard() {

  const stats = document.getElementById("statsGrid");

  stats.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Documentos</div>
      <div class="stat-value">
        ${state.documentos.length}
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Usuarios</div>
      <div class="stat-value">
        ${state.usuarios.length}
      </div>
    </div>
  `;

  const feed = document.getElementById("activityFeed");

  feed.innerHTML = state.actividad.map(a => `
    <div style="padding:10px 0;border-bottom:1px solid #eee;">
      <div style="font-size:13px">
        ${a.texto}
      </div>

      <div style="font-size:11px;color:#999;margin-top:4px">
        ${a.tiempo}
      </div>
    </div>
  `).join("");
}

/* =========================
   DOCUMENTOS
========================= */

function renderDocTable() {

  const tbody =
    document.getElementById("docsTableBody");

  tbody.innerHTML = state.documentos.map(doc => `

    <tr>

      <td>
        <strong>${doc.nombre}</strong>
      </td>

      <td>${doc.tipo}</td>

      <td>${doc.estado}</td>

      <td>${doc.revisores}</td>

      <td>${doc.progreso}%</td>

      <td>
        <button
          class="btn"
          onclick="deleteDocumento(${doc.id})"
        >
          Eliminar
        </button>
      </td>

    </tr>

  `).join("");
}

/* =========================
   DELETE DOCUMENT
========================= */

function deleteDocumento(id) {

  state.documentos =
    state.documentos.filter(d => d.id !== id);

  saveData();

  renderDocTable();

  updateBadges();

  showToast("Documento eliminado");
}

/* =========================
   ADD DOCUMENT
========================= */

function addDocumento() {

  const nuevo = {

    id: Date.now(),

    nombre: "Nuevo Documento",

    tipo: "Política",

    estado: "Pendiente",

    revisores: 2,

    progreso: 0,
  };

  state.documentos.push(nuevo);

  state.actividad.unshift({
    texto: `Se agregó "${nuevo.nombre}"`,
    tiempo: "Ahora",
  });

  saveData();

  renderDocTable();

  renderDashboard();

  updateBadges();

  showToast("Documento guardado correctamente");
}

/* =========================
   TOAST
========================= */

function showToast(msg) {

  const t = document.getElementById("toast");

  document.getElementById("toastMsg")
    .textContent = msg;

  t.classList.remove("hidden");

  setTimeout(() => {
    t.classList.add("hidden");
  }, 3000);
}