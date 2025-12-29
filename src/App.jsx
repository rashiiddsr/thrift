import { useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const initialLogin = {
  email: '',
  password: '',
}

const initialRegister = {
  fullName: '',
  username: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  address: '',
}

const defaultAdmin = {
  name: 'Admin SAR',
  username: 'admin',
  email: 'admin@sar.ac.id',
  password: 'admin',
  role: 'superadmin',
}

const allowedEmailDomains = ['@sar.ac.id', '@usti.ac.id']

const isAllowedEmail = (email) =>
  allowedEmailDomains.some((domain) => email.trim().toLowerCase().endsWith(domain))

const isAdminCredential = (identifier, password) => {
  const normalized = identifier.trim().toLowerCase()
  if (!normalized || !password) return false
  return (
    (normalized === defaultAdmin.email || normalized === defaultAdmin.username) &&
    password === defaultAdmin.password
  )
}

const isAdminRoute = () => window.location.pathname.startsWith('/admin')
const isUserRoute = () => window.location.pathname.startsWith('/user')

function AdminApp() {
  const [adminIdentifier, setAdminIdentifier] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)

  const handleAdminSubmit = (event) => {
    event.preventDefault()

    if (!isAdminCredential(adminIdentifier, adminPassword)) {
      setAdminError('Username/email atau password admin tidak sesuai.')
      return
    }

    setAdminAuthenticated(true)
    setAdminError('')
  }

  if (!adminAuthenticated) {
    return (
      <div className="admin-login admin-login--light">
        <div className="admin-login__background admin-login__background--light" />
        <div className="admin-login__card admin-login__card--light">
          <div className="admin-login__brand">
            <div className="admin-login__logo admin-login__logo--light">TK</div>
            <div>
              <h1>ThriftKos Admin</h1>
              <p>Panel pengelolaan internal</p>
            </div>
          </div>
          <div className="admin-login__header">
            <h2>Sign In</h2>
            <p>Masuk menggunakan akun admin</p>
          </div>
          <form className="admin-login__form" onSubmit={handleAdminSubmit}>
            <label>
              Email atau Username
              <input
                type="text"
                value={adminIdentifier}
                onChange={(event) => setAdminIdentifier(event.target.value)}
                placeholder="admin@sar.ac.id atau username"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                placeholder="Masukkan password"
                required
              />
            </label>
            {adminError && <p className="form-error">{adminError}</p>}
            <button className="admin-login__button admin-login__button--light" type="submit">
              Sign In
            </button>
          </form>
          <p className="admin-login__hint">
            Default admin: {defaultAdmin.username} / {defaultAdmin.password}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="adminlte adminlte--light">
      <aside className="adminlte__sidebar adminlte__sidebar--light">
        <div className="adminlte__brand">
          <div className="adminlte__logo adminlte__logo--light">TK</div>
          <div>
            <h2>ThriftKos</h2>
            <span>AdminLTE</span>
          </div>
        </div>
        <nav className="adminlte__nav">
          <button type="button" className="adminlte__nav-item adminlte__nav-item--active">
            Dashboard
          </button>
          <button type="button" className="adminlte__nav-item">
            Data Admin
          </button>
          <button type="button" className="adminlte__nav-item">
            Master User
          </button>
          <button type="button" className="adminlte__nav-item">
            Pengaturan
          </button>
        </nav>
      </aside>
      <div className="adminlte__content">
        <header className="adminlte__topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Selamat datang, {defaultAdmin.name}</p>
          </div>
          <div className="adminlte__profile">
            <span>{defaultAdmin.role}</span>
            <div className="adminlte__avatar adminlte__avatar--light">A</div>
          </div>
        </header>
        <section className="adminlte__empty">
          <h3>Konten dashboard akan segera tersedia.</h3>
          <p>Gunakan area ini untuk ringkasan admin dan modul master data.</p>
        </section>
      </div>
    </div>
  )
}

function UserAuthPage({
  initialMode = 'login',
  registeredUsers,
  setRegisteredUsers,
  onLoginSuccess,
}) {
  const [mode, setMode] = useState(initialMode)
  const [loginData, setLoginData] = useState(initialLogin)
  const [registerData, setRegisterData] = useState(initialRegister)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (event) => {
    const { name, value } = event.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    const identifier = loginData.email.trim().toLowerCase()
    const password = loginData.password
    const registeredUser = registeredUsers.find(
      (user) => user.email === identifier || user.username === identifier
    )

    if (!registeredUser) {
      setLoginError('Akun belum terdaftar. Silakan registrasi terlebih dahulu.')
      return
    }

    if (password !== registeredUser.password) {
      setLoginError('Password tidak sesuai dengan akun terdaftar.')
      return
    }

    setLoginError('')
    onLoginSuccess({
      name: registeredUser.fullName,
      email: registeredUser.email,
      username: registeredUser.username,
    })
  }

  const handleRegisterSubmit = (event) => {
    event.preventDefault()
    const email = registerData.email.trim().toLowerCase()

    if (!isAllowedEmail(email)) {
      setRegisterError('Email hanya boleh menggunakan domain @sar.ac.id atau @usti.ac.id.')
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Password dan ulang password tidak sama.')
      return
    }

    if (registeredUsers.some((user) => user.email === email)) {
      setRegisterError('Email sudah terdaftar. Silakan login.')
      return
    }

    if (registeredUsers.some((user) => user.username === registerData.username.trim())) {
      setRegisterError('Username sudah digunakan. Silakan pilih username lain.')
      return
    }

    setRegisteredUsers((prev) => [
      ...prev,
      {
        ...registerData,
        email,
        username: registerData.username.trim().toLowerCase(),
      },
    ])
    setRegisterData(initialRegister)
    setRegisterError('')
    setMode('login')
  }

  return (
    <div className="user-auth">
      <div className="user-auth__container">
        <div className="user-auth__header">
          <div>
            <h1>ThriftKos</h1>
            <p>Portal pengguna</p>
          </div>
          <a className="user-auth__back" href="/">
            Kembali ke beranda
          </a>
        </div>

        <div className="user-auth__card">
          <div className="user-auth__tabs">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'active' : ''}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <form className="user-auth__form" onSubmit={handleLoginSubmit}>
              <label>
                Username atau Email
                <input
                  type="text"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="username atau email"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Masukkan password"
                  required
                />
              </label>
              {loginError && <p className="form-error">{loginError}</p>}
              <button className="primary" type="submit">
                Masuk
              </button>
            </form>
          ) : (
            <form className="user-auth__form" onSubmit={handleRegisterSubmit}>
              <label>
                Nama Lengkap
                <input
                  type="text"
                  name="fullName"
                  value={registerData.fullName}
                  onChange={handleRegisterChange}
                  placeholder="Nama lengkap"
                  required
                />
              </label>
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  placeholder="username"
                  required
                />
              </label>
              <label>
                No HP
                <input
                  type="tel"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="nama@sar.ac.id"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Buat password"
                  required
                />
              </label>
              <label>
                Ulang Password
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Ulang password"
                  required
                />
              </label>
              <label>
                Alamat
                <textarea
                  name="address"
                  value={registerData.address}
                  onChange={handleRegisterChange}
                  placeholder="Alamat lengkap"
                  rows="3"
                  required
                />
              </label>
              {registerError && <p className="form-error">{registerError}</p>}
              <button className="primary" type="submit">
                Daftar Akun
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authUser, setAuthUser] = useState(null)
  const [registeredUsers, setRegisteredUsers] = useState([])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat pagi'
    if (hour < 18) return 'Selamat siang'
    return 'Selamat malam'
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAuthUser(null)
  }

  const handleUserLoginSuccess = (user) => {
    setAuthUser(user)
    setIsAuthenticated(true)
    window.location.href = '/'
  }

  if (isAdminRoute()) {
    return <AdminApp />
  }

  if (isUserRoute()) {
    return (
      <UserAuthPage
        registeredUsers={registeredUsers}
        setRegisteredUsers={setRegisteredUsers}
        onLoginSuccess={handleUserLoginSuccess}
      />
    )
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar__brand">
          <div className="logo">
            <span>TK</span>
          </div>
          <div>
            <h1>ThriftKos</h1>
            <p>Marketplace thrift kampus resmi</p>
          </div>
        </div>
        {!isAuthenticated && (
          <nav className="navbar__links">
            <a href="#koleksi">Koleksi</a>
            <a href="#keunggulan">Keunggulan</a>
            <a href="#layanan">Layanan</a>
            <a href="#footer">Kontak</a>
          </nav>
        )}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <button className="ghost" type="button" onClick={handleLogout}>
              Keluar
            </button>
          ) : (
            <>
              <button className="ghost" type="button" onClick={() => window.location.assign('/user')}>
                Daftar
              </button>
              <button className="primary" type="button" onClick={() => window.location.assign('/user')}>
                Login
              </button>
            </>
          )}
        </div>
      </header>

      <main>
        {isAuthenticated ? (
          <section className="dashboard">
            <div className="customer-dashboard">
              <div className="customer-card">
                <h2>Hello, {authUser?.name}</h2>
                <p>
                  Dashboard pelanggan siap digunakan. Nikmati pengalaman belanja terbaik bersama
                  ThriftKos!
                </p>
                <div className="customer-meta">
                  <span>Email: {authUser?.email}</span>
                  <span>Username: {authUser?.username}</span>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="hero">
              <div className="hero__content">
                <p className="hero__greeting">{greeting}, siap upgrade gaya hari ini?</p>
                <h2>Belanja thrift kampus dengan standar ecommerce modern.</h2>
                <p>
                  ThriftKos menghubungkan mahasiswa dan komunitas thrift dalam ekosistem yang
                  aman, transparan, dan mudah dikelola.
                </p>
                <div className="hero__cta">
                  <button className="primary" type="button" onClick={() => window.location.assign('/user')}>
                    Daftar Sekarang
                  </button>
                  <button className="ghost" type="button">
                    Jelajahi Koleksi
                  </button>
                </div>
                <div className="hero__meta">
                  <span>API terhubung: {API_BASE_URL}</span>
                  <span>Portal admin tersedia di /admin</span>
                </div>
              </div>
              <div className="hero__card">
                <h3>Promo Kampus Eksklusif</h3>
                <p>Diskon hingga 40% khusus pengguna kampus setiap akhir pekan.</p>
                <div className="hero__stats">
                  <div>
                    <h4>120+</h4>
                    <span>Produk baru</span>
                  </div>
                  <div>
                    <h4>3.2k</h4>
                    <span>Mahasiswa aktif</span>
                  </div>
                </div>
                <div className="hero__badge">
                  <span>Trusted Campus Commerce</span>
                </div>
              </div>
            </section>

            <section className="section metrics" id="layanan">
              <div>
                <h3>Semua kebutuhan thrift dalam satu platform</h3>
                <p>
                  Rangkaian fitur lengkap untuk belanja, pengelolaan toko, hingga monitoring
                  transaksi.
                </p>
              </div>
              <div className="metrics__grid">
                <div>
                  <h4>48 Jam</h4>
                  <span>Pengiriman rata-rata kampus</span>
                </div>
                <div>
                  <h4>98%</h4>
                  <span>Kepuasan pelanggan</span>
                </div>
                <div>
                  <h4>24/7</h4>
                  <span>Dukungan tim ThriftKos</span>
                </div>
              </div>
            </section>

            <section className="section" id="koleksi">
              <div className="section__header">
                <div>
                  <h3>Koleksi Pilihan</h3>
                  <p>Kurasi resmi dari komunitas thrift kampus.</p>
                </div>
                <button className="ghost" type="button">
                  Lihat Semua
                </button>
              </div>
              <div className="grid">
                {['Jaket Kampus', 'Aksesoris Vintage', 'Kaos Event', 'Sepatu Streetwear'].map(
                  (item) => (
                    <article key={item} className="card">
                      <div className="card__image" />
                      <h4>{item}</h4>
                      <p>Kurasi khusus untuk mahasiswa, stok terbatas.</p>
                      <div className="card__meta">
                        <span>Mulai Rp 85.000</span>
                        <button className="text-button" type="button">
                          Detail
                        </button>
                      </div>
                    </article>
                  )
                )}
              </div>
            </section>

            <section className="section highlight" id="keunggulan">
              <div>
                <h3>Kenapa ThriftKos?</h3>
                <p>
                  Platform aman dengan pengalaman belanja cepat, pembayaran mudah, dan dukungan
                  layanan kampus.
                </p>
              </div>
              <ul>
                <li>Kurasi produk terpercaya untuk mahasiswa</li>
                <li>Transaksi transparan dan terverifikasi</li>
                <li>Support komunitas kampus & marketplace resmi</li>
                <li>Insight belanja real-time untuk pelanggan</li>
              </ul>
            </section>

            <section className="section newsletter">
              <div>
                <h3>Gabung komunitas ThriftKos</h3>
                <p>Dapatkan update promo dan koleksi terbaru setiap minggu.</p>
              </div>
              <div className="newsletter__form">
                <input type="email" placeholder="email@kampus.ac.id" />
                <button className="primary" type="button">
                  Langganan
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer" id="footer">
        <p>© 2024 ThriftKos. Dibangun untuk komunitas kampus.</p>
      </footer>
    </div>
  )
}

export default App
