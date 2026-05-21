// --- 1. Estado Global ---
let currentUser = null;
const state = {
    usuarios: [
        { id: 1, nombre: 'Admin Sistema', cargo: 'Administrador', correo: 'admin@empresa.com', rol: 'admin', pass: 'admin123' },
        { id: 2, nombre: 'Santo Almonte', cargo: 'Jefe de TI', correo: 'santo@empresa.com', rol: 'revisor', pass: 'rev123' }
    ],
    documentos: [], // Asegúrate de tener tus datos aquí
    actividad: []
};

// --- 2. Login ---
function doLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const user = state.usuarios.find(u => u.correo === email && u.pass === pass);
    
    if (!user) {
        document.getElementById('loginError').style.display = 'block';
        return;
    }
    
    currentUser = user;
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('headerUserName').textContent = currentUser.nombre;
    document.getElementById('headerAvatar').textContent = currentUser.nombre.split(' ').map(n=>n[0]).join('');
    
    if(currentUser.rol !== 'admin') {
        document.getElementById('adminNavSection').classList.add('hidden');
    }
    
    actualizarBadges();
    showPage('dashboard');
}

function doLogout() { location.reload(); }

// --- 3. Navegación ---
function showPage(pageId) {
    document.querySelectorAll('.main > div').forEach(div => div.classList.add('hidden'));
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.remove('hidden');
    
    const nav = document.getElementById(`nav-${pageId}`);
    if (nav) nav.classList.add('active');
    
    // Router simple
    if(pageId === 'dashboard') renderDashboard();
    if(pageId === 'documentos') renderDocTable();
    if(pageId === 'mis-revisiones') console.log("Pendiente: renderMisRevisiones");
    if(pageId === 'usuarios') console.log("Pendiente: renderUsuarios");
}

// --- 4. Renderizadores ---
function renderDashboard() {
    const grid = document.getElementById('statsGrid');
    if(!grid) return;
    grid.innerHTML = `
        <div class="stat-card"><div class="stat-label">Total</div><div class="stat-value">${state.documentos.length}</div></div>
        <div class="stat-card"><div class="stat-label">En Revisión</div><div class="stat-value">${state.documentos.filter(d=>d.estado==='en_revision').length}</div></div>
    `;
}

function renderDocTable() {
    const body = document.getElementById('docsTableBody');
    if(!body) return;
    body.innerHTML = state.documentos.map(d => `
        <tr>
            <td>${d.nombre}</td>
            <td>${d.tipo}</td>
            <td>${d.estado}</td>
            <td><button class="btn btn-sm" onclick="verDetalle(${d.id})">Detalle</button></td>
        </tr>
    `).join('');
}

// --- 5. Funciones auxiliares para evitar errores ---
function actualizarBadges() {
    const badgeDocs = document.getElementById('badge-docs');
    const badgeRev = document.getElementById('badge-rev');
    if(badgeDocs) badgeDocs.textContent = state.documentos.length;
    if(badgeRev) badgeRev.textContent = "0";
}

function verDetalle(id) { alert("Detalle del doc: " + id); }
function renderMisRevisiones() {}
function renderUsuarios() {}

console.log("Sistema GesDoc: Listo.");