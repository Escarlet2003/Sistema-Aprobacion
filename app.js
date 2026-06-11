let currentUser = null;
let currentDocId = null;
let revisoresCount = 0;

const state = {

  usuarios: [

    {
      id: 1,
      nombre: 'Admin Sistema',
      cargo: 'Administrador',
      correo: 'admin@empresa.com',
      rol: 'admin',
      pass: 'admin123'
    },

    {
      id: 2,
      nombre: 'Santo Almonte',
      cargo: 'Jefe de TI',
      correo: 'santo@empresa.com',
      rol: 'revisor',
      pass: 'rev123'
    }

  ],

  documentos: [],

  actividad: []

};

/* ==========================
   LOGIN
========================== */

function doLogin() {

  const email =
    document.getElementById('loginEmail').value.trim();

  const pass =
    document.getElementById('loginPass').value.trim();

  const user = state.usuarios.find(
    u =>
      u.correo === email &&
      u.pass === pass
  );

  if (!user) {

    document.getElementById('loginError').style.display = 'block';

    return;
  }

  currentUser = user;

  document.getElementById('loginError').style.display = 'none';

  document.getElementById('loginPage').classList.add('hidden');

  document.getElementById('mainApp').classList.remove('hidden');

  document.getElementById('headerUserName').textContent =
    user.nombre;

  document.getElementById('headerAvatar').textContent =
    user.nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

  actualizarBadges();

  showPage('dashboard');
}

function doLogout() {

  currentUser = null;

  document.getElementById('loginPage')
    .classList.remove('hidden');

  document.getElementById('mainApp')
    .classList.add('hidden');
}

/* ==========================
   NAVEGACIÓN
========================== */

function showPage(page) {

  const pages = [
    'dashboard',
    'documentos',
    'mis-revisiones',
    'subir',
    'usuarios'
  ];

  pages.forEach(p => {

    document
      .getElementById('page-' + p)
      ?.classList.add('hidden');

    document
      .getElementById('nav-' + p)
      ?.classList.remove('active');
  });

  document
    .getElementById('page-' + page)
    ?.classList.remove('hidden');

  document
    .getElementById('nav-' + page)
    ?.classList.add('active');

  if (page === 'dashboard') {
    renderDashboard();
  }

  if (page === 'documentos') {
    renderDocTable();
  }

  if (page === 'usuarios') {
    renderUsuarios();
  }

  if (page === 'mis-revisiones') {
    renderMisRevisiones();
  }
}

/* ==========================
   DASHBOARD
========================== */

function renderDashboard() {

  const pendientes =
    state.documentos.filter(
      d => d.estado === 'Pendiente'
    ).length;

  const aprobados =
    state.documentos.filter(
      d => d.estado === 'Aprobado'
    ).length;

  document.getElementById('statsGrid').innerHTML = `

    <div class="stat-card">
      <div class="stat-label">
        Total documentos
      </div>

      <div class="stat-value">
        ${state.documentos.length}
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-label">
        Pendientes
      </div>

      <div class="stat-value">
        ${pendientes}
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-label">
        Aprobados
      </div>

      <div class="stat-value">
        ${aprobados}
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-label">
        Usuarios
      </div>

      <div class="stat-value">
        ${state.usuarios.length}
      </div>
    </div>

  `;

  renderActividad();
}

/* ==========================
   DOCUMENTOS
========================== */

function guardarDocumento() {

  const nombre =
    document.getElementById('docNombre').value.trim();

  const tipo =
    document.getElementById('docTipo').value;

  const archivo =
    document.getElementById('docArchivo')
      ?.files[0];

  if (!nombre) {

    showToast(
      'Debe indicar el nombre del documento'
    );

    return;
  }

  const documento = {

    id: Date.now(),

    nombre,

    tipo,

    archivo:
      archivo
        ? archivo.name
        : 'Sin archivo',

    estado: 'Pendiente',

    fecha: new Date().toLocaleDateString()

  };

  state.documentos.push(documento);

  registrarActividad(
    `Documento "${nombre}" registrado`
  );

  document.getElementById('docNombre').value = '';

  renderDashboard();

  renderDocTable();

  actualizarBadges();

  showToast(
    'Documento registrado correctamente'
  );
}

function renderDocTable() {

  const tbody =
    document.getElementById('docsTableBody');

  if (!tbody) return;

  tbody.innerHTML =
    state.documentos.map(doc => `

      <tr>

        <td>${doc.nombre}</td>

        <td>${doc.tipo}</td>

        <td>${doc.estado}</td>

        <td>1</td>

        <td>
          ${doc.estado === 'Aprobado'
            ? '100%'
            : '0%'}
        </td>

        <td>

          <button
            class="btn"
            onclick="openDetalle(${doc.id})"
          >
            Ver
          </button>

        </td>

      </tr>

    `).join('');
}

function openDetalle(id) {

  const doc =
    state.documentos.find(
      d => d.id === id
    );

  if (!doc) return;

  alert(

`Documento: ${doc.nombre}

Tipo: ${doc.tipo}

Estado: ${doc.estado}

Archivo: ${doc.archivo}`

  );
}

/* ==========================
   USUARIOS
========================== */

function renderUsuarios() {

  const tbody =
    document.getElementById('usuariosBody');

  if (!tbody) return;

  tbody.innerHTML =
    state.usuarios.map(user => `

      <tr>

        <td>${user.nombre}</td>

        <td>${user.cargo}</td>

        <td>${user.correo}</td>

        <td>${user.rol}</td>

      </tr>

    `).join('');
}

function agregarUsuario() {

  const nombre =
    document.getElementById('nuevoNombre')?.value;

  const cargo =
    document.getElementById('nuevoCargo')?.value;

  const correo =
    document.getElementById('nuevoCorreo')?.value;

  const rol =
    document.getElementById('nuevoRol')?.value;

  const pass =
    document.getElementById('nuevoPass')?.value;

  if (
    !nombre ||
    !cargo ||
    !correo ||
    !pass
  ) {

    showToast(
      'Complete todos los campos'
    );

    return;
  }

  state.usuarios.push({

    id: Date.now(),

    nombre,

    cargo,

    correo,

    rol,

    pass

  });

  registrarActividad(
    `Usuario ${nombre} creado`
  );

  renderUsuarios();

  renderDashboard();

  showToast(
    'Usuario agregado'
  );

  document.getElementById('nuevoNombre').value = '';
  document.getElementById('nuevoCargo').value = '';
  document.getElementById('nuevoCorreo').value = '';
  document.getElementById('nuevoPass').value = '';
}

/* ==========================
   MIS REVISIONES
========================== */

function renderMisRevisiones() {

  const contenedor =
    document.getElementById(
      'page-mis-revisiones'
    );

  if (!contenedor) return;

  const pendientes =
    state.documentos.filter(
      d => d.estado === 'Pendiente'
    );

  let html = `

    <div class="page-header">
      <div>
        <div class="page-title">
          Mis revisiones
        </div>

        <div class="page-subtitle">
          Documentos pendientes
        </div>
      </div>
    </div>

    <div class="card">
      <div style="padding:20px">
  `;

  if (pendientes.length === 0) {

    html += `
      No hay revisiones pendientes
    `;
  }
  else {

    pendientes.forEach(doc => {

      html += `
        <p>
          ${doc.nombre}
        </p>
      `;
    });
  }

  html += `
      </div>
    </div>
  `;

  contenedor.innerHTML = html;
}

/* ==========================
   ACTIVIDAD
========================== */

function registrarActividad(texto) {

  state.actividad.unshift({

    fecha:
      new Date()
      .toLocaleString(),

    texto

  });

  renderActividad();
}

function renderActividad() {

  const feed =
    document.getElementById(
      'activityFeed'
    );

  if (!feed) return;

  if (state.actividad.length === 0) {

    feed.innerHTML =
      '<p>No hay actividad reciente</p>';

    return;
  }

  feed.innerHTML =
    state.actividad.map(a => `

      <div style="
        padding:10px 0;
        border-bottom:1px solid #eee;
      ">

        <div>
          ${a.texto}
        </div>

        <small>
          ${a.fecha}
        </small>

      </div>

    `).join('');
}

/* ==========================
   BADGES
========================== */

function actualizarBadges() {

  const docs =
    document.getElementById('badge-docs');

  if (docs) {

    docs.textContent =
      state.documentos.length;
  }

  const rev =
    document.getElementById('badge-rev');

  if (rev) {

    rev.textContent =
      state.documentos.filter(
        d => d.estado === 'Pendiente'
      ).length;
  }
}

/* ==========================
   TOAST
========================== */

function showToast(msg) {

  const toast =
    document.getElementById('toast');

  document.getElementById('toastMsg')
    .textContent = msg;

  toast.classList.remove('hidden');

  setTimeout(() => {

    toast.classList.add('hidden');

  }, 3000);
}