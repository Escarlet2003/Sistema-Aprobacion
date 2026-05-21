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
      .substring(0,2)
      .toUpperCase();

  showPage('dashboard');
}

function doLogout() {

  currentUser = null;

  document.getElementById('loginPage')
    .classList.remove('hidden');

  document.getElementById('mainApp')
    .classList.add('hidden');
}

function showPage(page) {

  const pages = [
    'dashboard',
    'documentos'
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
}

function renderDashboard() {

  document.getElementById('statsGrid').innerHTML = `

    <div class="stat-card">
      <div class="stat-label">
        Total documentos
      </div>

      <div class="stat-value">
        ${state.documentos.length}
      </div>
    </div>

  `;
}

function renderDocTable() {

  const tbody =
    document.getElementById('docsTableBody');

  if (!tbody) return;

  tbody.innerHTML = state.documentos.map(doc => `

    <tr>

      <td>${doc.nombre}</td>

      <td>${doc.tipo}</td>

      <td>${doc.estado}</td>

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

function showToast(msg) {

  const toast =
    document.getElementById('toast');

  document.getElementById('toastMsg').textContent = msg;

  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}