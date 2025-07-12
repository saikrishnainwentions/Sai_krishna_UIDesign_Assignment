// ====== Utility Functions ======
function $(sel) { return document.querySelector(sel); }
function $A(sel) { return document.querySelectorAll(sel); }
function showToast(msg, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = msg;
  $("#toast").appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
function exportTableToCSV(tableId, filename = "table.csv") {
  const rows = Array.from(document.querySelectorAll(`#${tableId} tr`));
  const csv = rows.map(row =>
    Array.from(row.children)
      .map(cell => `"${cell.innerText.replace(/"/g, '""')}"`)
      .join(",")
  ).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ====== Theme Toggle ======
function setTheme(theme) {
  if (theme === "dark") document.body.classList.add("dark");
  else document.body.classList.remove("dark");
  localStorage.setItem("theme", theme);
}
function toggleTheme() {
  setTheme(document.body.classList.contains("dark") ? "light" : "dark");
  updateThemeIcon();
}
function updateThemeIcon() {
  const icon = document.querySelector(".theme-toggle i");
  if (icon) icon.className = `fa ${document.body.classList.contains("dark") ? "fa-sun" : "fa-moon"}`;
}
if (localStorage.getItem("theme") === "dark") setTheme("dark");

// ====== Navbar Hamburger & Avatar Dropdown ======
function attachNavbarEvents() {
  const nav = $(".navbar nav");
  const hamburger = $(".hamburger");
  if (hamburger) hamburger.onclick = () => nav.classList.toggle("open");
  // Avatar dropdown
  const avatarBtn = $(".avatar-btn");
  if (avatarBtn) avatarBtn.onclick = () => {
    $(".avatar-dropdown").classList.toggle("open");
  };
  document.addEventListener("click", e => {
    if (!e.target.closest(".avatar-dropdown")) {
      const dd = $(".avatar-dropdown");
      if (dd) dd.classList.remove("open");
    }
  });
}

// ====== Sidebar Collapsible ======
function attachSidebarEvents() {
  const sidebar = $(".sidebar");
  const toggleBtn = $(".sidebar-toggle-btn");
  if (toggleBtn) toggleBtn.onclick = () => sidebar.classList.toggle("collapsed");
}

// ====== Dummy Data ======
const dummyUser = {
  name: "Alex Carter",
  email: "alex.carter@email.com",
  password: "demo123",
  img: "https://randomuser.me/api/portraits/men/32.jpg"
};
let currentUser = { ...dummyUser };
const dashboardStats = [
  { title: "Total Customers", value: 1280, icon: "fa-users", color: "#d32f2f", image: "images/pic10.png" },
  { title: "Active Sessions", value: 87, icon: "fa-chart-line", color: "#fff", image: "images/pic9.png" },
  { title: "New Signups", value: 56, icon: "fa-user-plus", color: "#b71c1c", image: "images/pic12.png" },
  { title: "Notifications", value: 12, icon: "fa-bell", color: "#181818", image: "images/pic11.png" }
];
let dynamicStats = [...dashboardStats];
const usersTableData = Array.from({ length: 48 }, (_, i) => ({
  id: 1001 + i,
  name: ["John Doe", "Jane Smith", "Sam Lee", "Sara Kim", "Mike Ross", "Linda May", "Chris Paul", "Emma Stone", "David Li", "Sophia Turner"][i % 10],
  email: `customer${i + 1}@mail.com`,
  status: ["Active", "Inactive"][i % 2],
  joined: `2025-06-${(i % 28 + 1).toString().padStart(2, "0")}`
}));
const chatHistory = [
  { from: "received", text: "Hello! How can I help you today?" },
  { from: "sent", text: "Hi! I need some details about my last purchase." },
  { from: "received", text: "Sure! Can you share your order ID?" },
  { from: "sent", text: "It's #12345." },
  { from: "received", text: "Thank you. Let me check that for you." }
];

// ====== Routing & Rendering ======
const routes = {
  login: renderLogin,
  signup: renderSignup,
  home: renderHome,
  dashboard: renderDashboard,
  profile: renderProfile,
  form: renderFormPage,
  table: renderTablePage,
  qr: renderQRPage,
  chat: renderChatPage,
  settings: renderSettings
};
function route(page) {
  window.location.hash = page;
  render();
}
function render() {
  const hash = window.location.hash.replace("#", "") || (currentUser ? "home" : "login");
  if (!currentUser && !["login", "signup"].includes(hash)) return renderLogin();
  (routes[hash] || renderHome)();
  setTimeout(() => {
    attachNavbarEvents();
    attachSidebarEvents();
    updateThemeIcon();
  }, 50);
}

// ====== Navbar ======
function renderNavbar(active) {
  return `
    <div class="navbar" role="navigation" aria-label="Main Navigation">
      <span class="logo"><img src="images/pic1.png" alt="Logo" width="28" style="vertical-align:middle;"> Customer Dashboard</span>
      <button class="hamburger" aria-label="Open menu"><i class="fa fa-bars"></i></button>
      <nav>
        <a href="#home" class="${active === "home" ? "active" : ""}">Home</a>
        <a href="#dashboard" class="${active === "dashboard" ? "active" : ""}">Dashboard</a>
        <a href="#profile" class="${active === "profile" ? "active" : ""}">Profile</a>
        <a href="#form" class="${active === "form" ? "active" : ""}">Form</a>
        <a href="#table" class="${active === "table" ? "active" : ""}">Tables</a>
        <a href="#qr" class="${active === "qr" ? "active" : ""}">QR Code</a>
        <a href="#chat" class="${active === "chat" ? "active" : ""}">Chat</a>
      </nav>
      <button class="theme-toggle" aria-label="Toggle theme" title="Toggle theme" onclick="toggleTheme()">
        <i class="fa ${document.body.classList.contains('dark') ? 'fa-sun' : 'fa-moon'}"></i>
      </button>
      <div class="avatar-dropdown">
        <button class="avatar-btn" aria-haspopup="true" aria-expanded="false">
          <img src="${currentUser.img}" class="avatar-img" alt="User Avatar">
          <span>${currentUser.name.split(' ')[0]}</span>
          <i class="fa fa-chevron-down"></i>
        </button>
        <div class="avatar-dropdown-menu" role="menu">
          <a href="#profile" role="menuitem"><i class="fa fa-user"></i> Profile</a>
          <a href="#settings" role="menuitem"><i class="fa fa-cog"></i> Settings</a>
          <button onclick="logout()" role="menuitem"><i class="fa fa-sign-out-alt"></i> Logout</button>
        </div>
      </div>
    </div>
  `;
}

// ====== Sidebar ======
function renderSidebar(active) {
  return `
    <aside class="sidebar" aria-label="Sidebar">
      <button class="sidebar-toggle-btn" aria-label="Toggle sidebar"><i class="fa fa-bars"></i></button>
      <ul>
        <li><a href="#dashboard" class="${active === "dashboard" ? "active" : ""}"><i class="fa fa-home"></i> Dashboard</a></li>
        <li><a href="#table" class="${active === "table" ? "active" : ""}"><i class="fa fa-table"></i> Tables</a></li>
        <li><a href="#form" class="${active === "form" ? "active" : ""}"><i class="fa fa-edit"></i> Forms</a></li>
        <li><a href="#qr" class="${active === "qr" ? "active" : ""}"><i class="fa fa-qrcode"></i> QR Code</a></li>
        <li><a href="#chat" class="${active === "chat" ? "active" : ""}"><i class="fa fa-comments"></i> Chat</a></li>
        <li><a href="#profile" class="${active === "profile" ? "active" : ""}"><i class="fa fa-user"></i> Profile</a></li>
      </ul>
    </aside>
  `;
}

// ====== Pages ======
        

// --- Login Page ---
function renderLogin() {
  $("#app").innerHTML = `
    <div class="auth-container fade-in" role="main">
      <div class="auth-title">Login</div>
      <form id="loginForm">
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="loginEmail" required autocomplete="username" aria-label="Email" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="loginPassword" required autocomplete="current-password" aria-label="Password"/>
        </div>
        <div class="auth-error" id="loginError"></div>
        <button type="submit" class="btn" style="width:100%;">Login</button>
        <a class="auth-link" href="#signup">Don't have an account? Sign up</a>
        <a class="auth-link" href="#" onclick="showToast('Password reset not implemented (UI only)','error')">Forgot Password?</a>
      </form>
    </div>
  `;
  $("#loginForm").onsubmit = function (e) {
    e.preventDefault();
    const email = $("#loginEmail").value.trim();
    const pass = $("#loginPassword").value;
    if (email === dummyUser.email && pass === dummyUser.password) {
      currentUser = { ...dummyUser };
      showToast("Login successful!");
      route("home");
    } else {
      $("#loginError").textContent = "Invalid email or password.";
    }
  };
}

// --- Signup Page ---
function renderSignup() {
  $("#app").innerHTML = `
    <div class="auth-container fade-in">
      <div class="auth-title">Sign Up</div>
      <form id="signupForm">
        <div class="form-group">
          <label>Name</label>
          <input type="text" id="signupName" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="signupEmail" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="signupPassword" required minlength="6"/>
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input type="password" id="signupConfirm" required />
        </div>
        <div class="auth-error" id="signupError"></div>
        <button type="submit" class="btn" style="width:100%;">Sign Up</button>
        <a class="auth-link" href="#login">Already have an account? Login</a>
      </form>
    </div>
  `;
  $("#signupForm").onsubmit = function (e) {
    e.preventDefault();
    const name = $("#signupName").value.trim();
    const email = $("#signupEmail").value.trim();
    const pass = $("#signupPassword").value;
    const confirm = $("#signupConfirm").value;
    if (pass.length < 6) {
      $("#signupError").textContent = "Password must be at least 6 characters.";
      return;
    }
    if (pass !== confirm) {
      $("#signupError").textContent = "Passwords do not match.";
      return;
    }
    currentUser = {
      name, email, password: pass,
      img: "https://randomuser.me/api/portraits/men/32.jpg"
    };
    showToast("Sign up successful!");
    route("home");
  };
}

// --- Home Page ---
function renderHome() {
  $("#app").innerHTML = `
    ${renderNavbar("home")}
    <div class="main-container fade-in">
      <div class="hero-float">
        <img src="images/pic2.jpg" alt="Teamwork" class="float-img-right vertical-spin-once" />
        <div>
          <h3>The Importance of Analysis</h3>
          <p>
        In today’s fast-paced world, analysis transforms raw data into actionable insights.
         By examining trends and patterns, teams can make informed decisions, solve complex problems, and drive meaningful growth. Effective analysis empowers organizations to anticipate challenges and seize new opportunities.
      </p>
    </div>
  </div>






      <h2>Welcome, ${currentUser.name}!</h2>
      <p>Access all dashboard features from here:</p>
      <div class="cards">
        <div class="card" tabindex="0" onclick="route('dashboard')">
          <img src="images/pic3.png" alt="Analytics" class="card-img"/>
          <div class="card-content">
            <div class="card-title">Dashboard</div>
            <div class="card-value">Stats & Charts</div>
          </div>
        </div>
        <div class="card" tabindex="0" onclick="route('table')">
          <img src="images/pic5.png" alt="Table" class="card-img"/>
          <div class="card-content">
            <div class="card-title">Tables</div>
            <div class="card-value">User Data</div>
          </div>
        </div>
        <div class="card" tabindex="0" onclick="route('form')">
          <img src="images/pic4.png" alt="Form" class="card-img"/>
          <div class="card-content">
            <div class="card-title">Forms</div>
            <div class="card-value">Sample Form</div>
          </div>
        </div>
        <div class="card" tabindex="0" onclick="route('qr')">
          <img src="images/pic6.png" alt="QR" class="card-img"/>
          <div class="card-content">
            <div class="card-title">QR Code</div>
            <div class="card-value">Scan & View</div>
          </div>
        </div>
        <div class="card" tabindex="0" onclick="route('chat')">
          <img src="images/pic8.png" alt="Chat" class="card-img"/>
          <div class="card-content">
            <div class="card-title">Chat</div>
            <div class="card-value">Messaging</div>
          </div>
        </div>
        <div class="card" tabindex="0" onclick="route('profile')">
          <img src="images/pic7.png" alt="Profile" class="card-img"/>
          <div class="card-content">
            <div class="card-title">Profile</div>
            <div class="card-value">Your Info</div>
          </div>
        </div>
      </div>
    </div>
  `;
}



// --- Dashboard Page ---
let chartInstances = {};
function renderDashboard() {
  $("#app").innerHTML = `
    ${renderNavbar("dashboard")}
    <div class="main-container dashboard-layout fade-in">
      ${renderSidebar("dashboard")}
      <div style="flex:1;">
        <div class="cards">
          ${dynamicStats.map(stat => `
            <div class="card">
              <img src="${stat.image}" alt="${stat.title}" class="card-img"/>
              <div class="card-content">
                <div class="card-icon" style="color:${stat.color};"><i class="fa ${stat.icon}"></i></div>
                <div class="card-title">${stat.title}</div>
                <div class="card-value">${stat.value}</div>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="chart-section">
          <h4 style="margin-bottom:10px;">User Trends</h4>
          <canvas id="trendChart" height="90"></canvas>
          <div style="display: flex; gap: 24px; margin-top: 30px; flex-wrap: wrap;">
            <div style="flex:1; min-width:260px;">
              <h4 style="margin-bottom:10px;">User Status</h4>
              <canvas id="pieChart" height="120"></canvas>
            </div>
            <div style="flex:1; min-width:260px;">
              <h4 style="margin-bottom:10px;">Quarterly Revenue</h4>
              <canvas id="barChart" height="120"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  setTimeout(drawDashboardCharts, 100);
}
function drawDashboardCharts() {
  for (let key in chartInstances) { chartInstances[key].destroy(); }
  // Trend Line Chart
  chartInstances.trend = new Chart($("#trendChart").getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'User Growth',
        data: [120, 135, 150, 170, 200, 240],
        borderColor: '#d32f2f',
        backgroundColor: 'rgba(211,47,47,0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
  // Pie Chart
  chartInstances.pie = new Chart($("#pieChart").getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Active', 'Inactive'],
      datasets: [{
        data: [860, 420],
        backgroundColor: ['#d32f2f', '#181818']
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
  // Bar Chart
  chartInstances.bar = new Chart($("#barChart").getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'Revenue',
        data: [12000, 15000, 17000, 14000],
        backgroundColor: '#d32f2f'
      }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

// --- Dynamic Data Simulation ---
setInterval(() => {
  dynamicStats = dashboardStats.map(stat => ({
    ...stat,
    value: stat.value + Math.floor(Math.random() * 5 - 2)
  }));
  if (window.location.hash.replace('#', '') === "dashboard") renderDashboard();
}, 5000);

// --- Profile Page ---
function renderProfile() {
  $("#app").innerHTML = `
    ${renderNavbar("profile")}
    <div class="main-container fade-in">
      <div class="profile-card">
        <img src="${currentUser.img}" class="profile-pic" id="profilePic" />
        <h3>${currentUser.name}</h3>
        <p>${currentUser.email}</p>
        <form class="profile-edit" id="profileEditForm">
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="profileName" value="${currentUser.name}" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="profileEmail" value="${currentUser.email}" required />
          </div>
          <div class="form-group">
            <label>Profile Picture</label>
            <input type="file" id="profileImg" accept="image/*" />
          </div>
          <div class="form-group">
            <label>Change Password</label>
            <input type="password" id="profilePwd" placeholder="New Password" minlength="6" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn">Update</button>
          </div>
        </form>
      </div>
    </div>
  `;
  $("#profileImg").onchange = function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        $("#profilePic").src = ev.target.result;
        currentUser.img = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  $("#profileEditForm").onsubmit = function (e) {
    e.preventDefault();
    currentUser.name = $("#profileName").value;
    currentUser.email = $("#profileEmail").value;
    let pwd = $("#profilePwd").value;
    if (pwd && pwd.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    if (pwd) currentUser.password = pwd;
    showToast("Profile updated!");
    renderProfile();
  };
}

// --- Form Page ---
function renderFormPage() {
  $("#app").innerHTML = `
    ${renderNavbar("form")}
    <div class="main-container fade-in">
      <div class="form-section">
        <h3>Sample Form</h3>
        <form id="sampleForm" novalidate>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="formName" required />
            <div class="input-error" id="formNameErr"></div>
          </div>
          <div class="form-group">
            <label>Gender</label>
            <label><input type="radio" name="gender" value="Male" required /> Male</label>
            <label><input type="radio" name="gender" value="Female" /> Female</label>
            <div class="input-error" id="formGenderErr"></div>
          </div>
          <div class="form-group">
            <label>Interests</label>
            <label><input type="checkbox" name="interest" value="Analytics" /> Analytics</label>
            <label><input type="checkbox" name="interest" value="Marketing" /> Marketing</label>
            <label><input type="checkbox" name="interest" value="Support" /> Support</label>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="text" id="formPhone" maxlength="14" class="input-mask" placeholder="(XXX) XXX-XXXX" />
            <div class="input-error" id="formPhoneErr"></div>
          </div>
          <div class="form-group">
            <label>Country</label>
            <select id="formCountry" required>
              <option value="">Select...</option>
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
              <option>Canada</option>
            </select>
            <div class="input-error" id="formCountryErr"></div>
          </div>
          <div class="form-group">
            <label>Upload File</label>
            <input type="file" id="formFile" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn">Submit</button>
            <button type="reset" class="btn secondary">Reset</button>
          </div>
        </form>
      </div>
    </div>
  `;
  // Inline validation
  $("#formName").oninput = function () {
    $("#formNameErr").textContent = this.value.trim() ? "" : "Required";
  };
  $("#formPhone").oninput = function () {
    let val = this.value.replace(/\D/g, "").slice(0, 10);
    let masked = val;
    if (val.length > 6) masked = `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`;
    else if (val.length > 3) masked = `(${val.slice(0, 3)}) ${val.slice(3)}`;
    else if (val.length > 0) masked = `(${val}`;
    this.value = masked;
    $("#formPhoneErr").textContent = val.length === 10 ? "" : "Enter 10 digits";
  };
  $("#sampleForm").onsubmit = function (e) {
    e.preventDefault();
    let valid = true;
    if (!$("#formName").value.trim()) { $("#formNameErr").textContent = "Required"; valid = false; }
    if (!document.querySelector('input[name="gender"]:checked')) { $("#formGenderErr").textContent = "Required"; valid = false; } else { $("#formGenderErr").textContent = ""; }
    if ($("#formPhone").value.replace(/\D/g, "").length !== 10) { $("#formPhoneErr").textContent = "Enter 10 digits"; valid = false; }
    if (!$("#formCountry").value) { $("#formCountryErr").textContent = "Required"; valid = false; } else { $("#formCountryErr").textContent = ""; }
    if (!valid) return;
    showToast("Form submitted successfully!");
    this.reset();
  };
}

// --- Table Page ---
let tableSort = { col: null, dir: 1 };
let tablePage = 1;
let tableSearch = "";
let tableSelected = new Set();

function renderTablePage() {
  const pageSize = 8;
  let data = usersTableData.slice();
  if (tableSearch) {
    data = data.filter(row =>
      row.name.toLowerCase().includes(tableSearch) ||
      row.email.toLowerCase().includes(tableSearch)
    );
  }
  if (tableSort.col) {
    data.sort((a, b) => {
      if (a[tableSort.col] < b[tableSort.col]) return -1 * tableSort.dir;
      if (a[tableSort.col] > b[tableSort.col]) return 1 * tableSort.dir;
      return 0;
    });
  }
  const totalPages = Math.ceil(data.length / pageSize);
  tablePage = Math.max(1, Math.min(tablePage, totalPages));
  const pageData = data.slice((tablePage - 1) * pageSize, tablePage * pageSize);

  $("#app").innerHTML = `
    ${renderNavbar("table")}
    <div class="main-container dashboard-layout fade-in">
      ${renderSidebar("table")}
      <div style="flex:1;">
        <input class="table-search" type="text" placeholder="Search users..." value="${tableSearch}" id="tableSearchInput"/>
        <div class="table-actions">
          <button onclick="exportTableToCSV('usersTable')"><i class="fa fa-download"></i> Export CSV</button>
        </div>
        <table class="responsive-table" id="usersTable">
          <thead>
            <tr>
              <th><input type="checkbox" id="selectAllTable" ${pageData.every(r => tableSelected.has(r.id)) ? "checked" : ""}></th>
              <th onclick="sortTable('id')">ID ${tableSort.col === 'id' ? (tableSort.dir === 1 ? '▲' : '▼') : ''}</th>
              <th onclick="sortTable('name')">Name ${tableSort.col === 'name' ? (tableSort.dir === 1 ? '▲' : '▼') : ''}</th>
              <th onclick="sortTable('email')">Email ${tableSort.col === 'email' ? (tableSort.dir === 1 ? '▲' : '▼') : ''}</th>
              <th onclick="sortTable('status')">Status ${tableSort.col === 'status' ? (tableSort.dir === 1 ? '▲' : '▼') : ''}</th>
              <th onclick="sortTable('joined')">Joined ${tableSort.col === 'joined' ? (tableSort.dir === 1 ? '▲' : '▼') : ''}</th>
            </tr>
          </thead>
          <tbody>
            ${pageData.map(row => `
              <tr>
                <td><input type="checkbox" class="table-checkbox" data-id="${row.id}" ${tableSelected.has(row.id) ? "checked" : ""}></td>
                <td data-label="ID">${row.id}</td>
                <td data-label="Name" class="table-tooltip" data-tooltip="${row.name.length > 8 ? row.name : ''}">${row.name.length > 8 ? row.name.slice(0, 8) + "..." : row.name}</td>
                <td data-label="Email" class="table-tooltip" data-tooltip="${row.email}">${row.email.slice(0, 14)}...</td>
                <td data-label="Status">${row.status}</td>
                <td data-label="Joined">${row.joined}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <div class="pagination">
          <button onclick="goToTablePage(${tablePage - 1})" ${tablePage === 1 ? 'disabled' : ''}>Prev</button>
          ${Array.from({ length: totalPages }, (_, i) => `
            <button onclick="goToTablePage(${i + 1})" class="${tablePage === i + 1 ? 'active' : ''}">${i + 1}</button>
          `).join("")}
          <button onclick="goToTablePage(${tablePage + 1})" ${tablePage === totalPages ? 'disabled' : ''}>Next</button>
        </div>
      </div>
    </div>
  `;
  $("#tableSearchInput").oninput = function (e) {
    tableSearch = e.target.value.toLowerCase();
    tablePage = 1;
    renderTablePage();
  };
  $A('.table-checkbox').forEach(cb => {
    cb.onchange = function () {
      const id = parseInt(this.dataset.id);
      if (this.checked) tableSelected.add(id);
      else tableSelected.delete(id);
    };
  });
  if ($("#selectAllTable")) {
    $("#selectAllTable").onchange = function () {
      pageData.forEach(r => this.checked ? tableSelected.add(r.id) : tableSelected.delete(r.id));
      renderTablePage();
    };
  }
}
function sortTable(col) {
  if (tableSort.col === col) tableSort.dir *= -1;
  else { tableSort.col = col; tableSort.dir = 1; }
  renderTablePage();
}
function goToTablePage(p) {
  tablePage = p;
  renderTablePage();
}

// --- QR Code Page ---
function renderQRPage() {
  $("#app").innerHTML = `
    ${renderNavbar("qr")}
    <div class="main-container fade-in">
      <h3>QR Code Scanner (Simulated)</h3>
      <button class="btn" onclick="openQRModal()"><i class="fa fa-qrcode"></i> Scan QR</button>
      <div id="qrModalContainer"></div>
    </div>
  `;
}
window.openQRModal = function () {
  $("#qrModalContainer").innerHTML = `
    <div class="qr-modal-bg">
      <div class="qr-modal">
        <button class="close-btn" onclick="closeQRModal()"><i class="fa fa-times"></i></button>
        <div style="font-size:2.5rem;margin-bottom:18px;"><i class="fa fa-qrcode"></i></div>
        <div>Simulating QR scan...</div>
        <button class="btn" style="margin-top:18px;" onclick="showQRResult()">Simulate Scan</button>
        <div class="qr-result" id="qrResult"></div>
      </div>
    </div>
  `;
};
window.closeQRModal = function () {
  $("#qrModalContainer").innerHTML = "";
};
window.showQRResult = function () {
  $("#qrResult").textContent = "QR Result: CustomerID#987654";
};

// --- Chat Page ---
let chatMsgs = [...chatHistory];
function renderChatPage() {
  $("#app").innerHTML = `
    ${renderNavbar("chat")}
    <div class="main-container fade-in">
      <div class="chat-container">
        <div class="chat-header">
          <span><i class="fa fa-user-circle"></i> Support Agent</span>
          <div class="chat-actions">
            <button title="Audio Call"><i class="fa fa-phone"></i></button>
            <button title="Video Call"><i class="fa fa-video"></i></button>
          </div>
        </div>
        <div class="chat-messages" id="chatMessages">
          ${chatMsgs.map(msg => `
            <div class="chat-bubble ${msg.from}">${msg.text}</div>
          `).join("")}
        </div>
        <form class="chat-input-bar" id="chatInputForm" autocomplete="off">
          <input type="text" id="chatInput" placeholder="Type a message..." required />
          <button type="button" title="Attach"><i class="fa fa-paperclip"></i></button>
          <button type="button" title="Mic" id="micBtn"><i class="fa fa-microphone"></i></button>
          <button type="submit" title="Send"><i class="fa fa-paper-plane"></i></button>
        </form>
      </div>
    </div>
  `;
  $("#chatInputForm").onsubmit = function (e) {
    e.preventDefault();
    const val = $("#chatInput").value.trim();
    if (!val) return;
    chatMsgs.push({ from: "sent", text: val });
    renderChatPage();
    setTimeout(() => {
      chatMsgs.push({ from: "received", text: "Thank you for your message. We'll get back soon!" });
      renderChatPage();
      scrollChatToBottom();
    }, 1200);
    scrollChatToBottom();
  };
  $("#micBtn").onclick = function () {
    chatMsgs.push({ from: "sent", text: "<i class='fa fa-microphone'></i> [Audio message sent]" });
    renderChatPage();
  };
  scrollChatToBottom();
}
function scrollChatToBottom() {
  setTimeout(() => {
    const el = $("#chatMessages");
    if (el) el.scrollTop = el.scrollHeight;
  }, 50);
}

// --- Settings Page (UI only) ---
function renderSettings() {
  $("#app").innerHTML = `
    ${renderNavbar("settings")}
    <div class="main-container fade-in">
      <h3>Settings (UI Only)</h3>
      <div class="form-section">
        <form>
          <div class="form-group">
            <label><input type="checkbox" checked> Email Notifications</label>
          </div>
          <div class="form-group">
            <label><input type="checkbox"> SMS Alerts</label>
          </div>
          <div class="form-group">
            <label><input type="checkbox" checked> Dark Mode</label>
          </div>
          <div class="form-actions">
            <button type="button" class="btn" onclick="showToast('Settings saved!')">Save</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// --- Logout ---
function logout() {
  currentUser = null;
  window.location.hash = "login";
  render();
}

// --- Initial Load ---
window.onhashchange = render;
render();
