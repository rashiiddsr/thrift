import { useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const initialLogin = {
  email: '',
  password: '',
}

const initialRegister = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  address: '',
}

const adminAccounts = {
  'superadmin@sar.ac.id': {
    name: 'Super Admin',
    password: 'superadmin',
    role: 'superadmin',
  },
  'admin@sar.ac.id': {
    name: 'Admin',
    password: 'admin',
    role: 'admin',
  },
}

const resolveRole = (email) => {
  const normalized = email.trim().toLowerCase()
  if (normalized === 'superadmin@sar.ac.id') return 'superadmin'
  if (normalized === 'admin@sar.ac.id') return 'admin'
  return 'customer'
}

const isSarEmail = (email) => email.trim().toLowerCase().endsWith('@sar.ac.id')

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [loginData, setLoginData] = useState(initialLogin)
  const [registerData, setRegisterData] = useState(initialRegister)
  const [userRole, setUserRole] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authUser, setAuthUser] = useState(null)
  const [registeredUsers, setRegisteredUsers] = useState([])
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat pagi'
    if (hour < 18) return 'Selamat siang'
    return 'Selamat malam'
  }, [])

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
    const email = loginData.email.trim().toLowerCase()
    const password = loginData.password
    const registeredUser = registeredUsers.find((user) => user.email === email)
    const adminAccount = adminAccounts[email]

    if (adminAccount) {
      if (password !== adminAccount.password) {
        setLoginError('Password admin tidak sesuai.')
        return
      }
      setAuthUser({
        name: adminAccount.name,
        email,
        role: adminAccount.role,
      })
      setUserRole(adminAccount.role)
    } else if (registeredUser) {
      if (password !== registeredUser.password) {
        setLoginError('Password tidak sesuai dengan akun terdaftar.')
        return
      }
      const role = resolveRole(email)
      setAuthUser({
        name: registeredUser.fullName,
        email,
        role,
      })
      setUserRole(role)
    } else {
      setLoginError('Email belum terdaftar. Silakan daftar terlebih dahulu.')
      return
    }

    setIsAuthenticated(true)
    setIsLoginOpen(false)
    setLoginData(initialLogin)
    setLoginError('')
  }

  const handleRegisterSubmit = (event) => {
    event.preventDefault()
    const email = registerData.email.trim().toLowerCase()

    if (!isSarEmail(email)) {
      setRegisterError('Email harus menggunakan domain @sar.ac.id.')
      return
    }

    if (registeredUsers.some((user) => user.email === email)) {
      setRegisterError('Email sudah terdaftar. Silakan login.')
      return
    }

    setRegisteredUsers((prev) => [
      ...prev,
      {
        ...registerData,
        email,
      },
    ])
    setRegisterData(initialRegister)
    setRegisterError('')
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole('')
    setAuthUser(null)
    setLoginData(initialLogin)
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
              <button className="ghost" type="button" onClick={() => setIsRegisterOpen(true)}>
                Daftar
              </button>
              <button className="primary" type="button" onClick={() => setIsLoginOpen(true)}>
                Login
              </button>
            </>
          )}
        </div>
      </header>

      <main>
        {isAuthenticated ? (
          <section className="dashboard">
            {(userRole === 'admin' || userRole === 'superadmin') && (
              <div className="admin-dashboard">
                <aside className="admin-sidebar">
                  <div>
                    <h3>{userRole === 'superadmin' ? 'Superadmin Panel' : 'Admin Panel'}</h3>
                    <p>Dashboard internal ThriftKos</p>
                  </div>
                  <nav>
                    <a href="#overview">Overview</a>
                    <a href="#orders">Order Masuk</a>
                    <a href="#inventory">Inventori</a>
                    <a href="#finance">Keuangan</a>
                  </nav>
                </aside>
                <div className="admin-content">
                  <div className="admin-topbar">
                    <div>
                      <h2>Halo, {authUser?.name}</h2>
                      <p>Selamat bekerja! Semua ringkasan operasional hari ini ada di sini.</p>
                    </div>
                    <div className="admin-actions">
                      <button className="ghost" type="button">
                        Generate Laporan
                      </button>
                      <button className="primary" type="button">
                        Tambah Produk
                      </button>
                    </div>
                  </div>
                  <div className="admin-grid">
                    <article className="admin-card">
                      <h4>Total Penjualan</h4>
                      <p className="admin-value">Rp 18.420.000</p>
                      <span>+12% dari minggu lalu</span>
                    </article>
                    <article className="admin-card">
                      <h4>Order Baru</h4>
                      <p className="admin-value">128</p>
                      <span>24 menunggu verifikasi</span>
                    </article>
                    <article className="admin-card">
                      <h4>Produk Siap Live</h4>
                      <p className="admin-value">56</p>
                      <span>Stok aman & terkurasi</span>
                    </article>
                  </div>
                  <div className="admin-table">
                    <div>
                      <h3>Aktivitas Terbaru</h3>
                      <p>Monitoring aktivitas dan approval instan.</p>
                    </div>
                    <ul>
                      <li>
                        <span>09:10</span>
                        <div>
                          <strong>Verifikasi toko baru</strong>
                          <p>Toko "Vintage Lab" menunggu persetujuan.</p>
                        </div>
                        <button className="ghost" type="button">
                          Review
                        </button>
                      </li>
                      <li>
                        <span>10:45</span>
                        <div>
                          <strong>Rekap transaksi</strong>
                          <p>15 transaksi berhasil disinkronkan ke sistem.</p>
                        </div>
                        <button className="ghost" type="button">
                          Lihat
                        </button>
                      </li>
                      <li>
                        <span>13:20</span>
                        <div>
                          <strong>Stok kritis</strong>
                          <p>Jaket kampus tinggal 4 item.</p>
                        </div>
                        <button className="ghost" type="button">
                          Restock
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {userRole === 'customer' && (
              <div className="customer-dashboard">
                <div className="customer-card">
                  <h2>Hello, {authUser?.name}</h2>
                  <p>Dashboard pelanggan siap digunakan. Nikmati pengalaman belanja terbaik!</p>
                </div>
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="hero">
              <div className="hero__content">
                <p className="hero__greeting">{greeting}, siap upgrade gaya hari ini?</p>
                <h2>Belanja thrift kampus dengan standar ecommerce modern.</h2>
                <p>
                  ThriftKos menghubungkan mahasiswa, admin, dan superadmin dalam ekosistem
                  thrift yang aman, transparan, dan mudah dikelola.
                </p>
                <div className="hero__cta">
                  <button className="primary" type="button" onClick={() => setIsRegisterOpen(true)}>
                    Daftar Sekarang
                  </button>
                  <button className="ghost" type="button">
                    Jelajahi Koleksi
                  </button>
                </div>
                <div className="hero__meta">
                  <span>API terhubung: {API_BASE_URL}</span>
                  <span>Terintegrasi dengan dashboard role-based</span>
                </div>
              </div>
              <div className="hero__card">
                <h3>Promo Kampus Eksklusif</h3>
                <p>Diskon hingga 40% khusus pengguna sar.ac.id setiap akhir pekan.</p>
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
                  transaksi admin.
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
                  Platform aman dengan kontrol admin, pembayaran mudah, dan dukungan layanan
                  kampus.
                </p>
              </div>
              <ul>
                <li>Role-based access untuk admin, superadmin, dan customer</li>
                <li>Transaksi transparan dan terverifikasi</li>
                <li>Support komunitas kampus & marketplace resmi</li>
                <li>Insight penjualan real-time untuk tim admin</li>
              </ul>
            </section>

            <section className="section newsletter">
              <div>
                <h3>Gabung komunitas ThriftKos</h3>
                <p>Dapatkan update promo dan koleksi terbaru setiap minggu.</p>
              </div>
              <div className="newsletter__form">
                <input type="email" placeholder="email@sar.ac.id" />
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

      {isLoginOpen && (
        <div className="modal">
          <div className="modal__overlay" onClick={() => setIsLoginOpen(false)} />
          <div className="modal__content">
            <div className="modal__header">
              <h3>Login ThriftKos</h3>
              <button type="button" onClick={() => setIsLoginOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleLoginSubmit} className="modal__form">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="nama@sar.ac.id"
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
              <p className="modal__hint">
                Superadmin: superadmin@sar.ac.id / superadmin · Admin: admin@sar.ac.id / admin
              </p>
            </form>
          </div>
        </div>
      )}

      {isRegisterOpen && (
        <div className="modal">
          <div className="modal__overlay" onClick={() => setIsRegisterOpen(false)} />
          <div className="modal__content">
            <div className="modal__header">
              <h3>Registrasi ThriftKos</h3>
              <button type="button" onClick={() => setIsRegisterOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="modal__form">
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
              <p className="modal__hint">
                Gunakan email kampus @sar.ac.id untuk mendaftar.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
