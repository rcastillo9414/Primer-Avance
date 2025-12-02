// --- UTILIDAD: PETICIÓN A API CON TOKEN ---
async function api(path, options = {}) {
  options.headers = options.headers || {};
  options.headers['Content-Type'] = 'application/json';

  const token = localStorage.getItem('token');
  if (token) {
    options.headers['Authorization'] = 'Bearer ' + token;
  }

  const res = await fetch(path, options);

  if (res.status === 401) {
    alert('Acceso restringido. Inicie sesión nuevamente.');
    logout();
  }

  return res;
}

// --- LOGIN ---
async function handleLogin(e) {
  e.preventDefault();
  const f = e.target;

  const body = {
    email: f.email.value,
    password: f.password.value
  };

  const res = await api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body)
  });

  let json;
  try {
    json = await res.json();
  } catch {
    json = {};
  }

  if (res.ok && json.token) {
    localStorage.setItem('token', json.token);
    localStorage.setItem('user', JSON.stringify(json.user));
    window.location = "dashboard_auth.html";
  } else {
    alert(json.msg || json.error || 'Error en las credenciales');
  }
}

// --- LOGOUT ---
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location = "index.html";
}

// --- INICIALIZAR EN PÁGINAS QUE TENGAN loginForm ---
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
});
