import { useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const initialLogin = {
  email: '',
  password: '',
}

const resolveRole = (email) => {
  if (email === 'admin@sar.ac.id') return 'superadmin'
  return 'customer'
}

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginData, setLoginData] = useState(initialLogin)
  const [userRole, setUserRole] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

  const handleLoginSubmit = (event) => {
    event.preventDefault()
    const role = resolveRole(loginData.email.trim().toLowerCase())
    setUserRole(role)
    setIsAuthenticated(true)
    setIsLoginOpen(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole('')
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
            <p>Ecommerce thrift kampus</p>
          </div>
        </div>
        <nav className="navbar__links">
          <a href="#koleksi">Koleksi</a>
          <a href="#keunggulan">Keunggulan</a>
          <a href="#footer">Kontak</a>
        </nav>
        <div className="navbar__actions">
          {isAuthenticated ? (
            <button className="ghost" type="button" onClick={handleLogout}>
              Keluar
            </button>
          ) : (
            <button className="primary" type="button" onClick={() => setIsLoginOpen(true)}>
              Login
            </button>
          )}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero__content">
            <p className="hero__greeting">{greeting}, siap thrift hari ini?</p>
            <h2>Belanja hemat, gaya tetap keren.</h2>
            <p>
              ThriftKos menghubungkan mahasiswa dengan produk thrift berkualitas. Semua
              transaksi dikelola dengan role-based access untuk menjaga keamanan.
            </p>
            <div className="hero__cta">
              <button className="primary" type="button" onClick={() => setIsLoginOpen(true)}>
                Mulai Login
              </button>
              <button className="ghost" type="button">
                Lihat Koleksi
              </button>
            </div>
            <p className="hero__meta">API terhubung ke: {API_BASE_URL}</p>
          </div>
          <div className="hero__card">
            <h3>Promo Kampus</h3>
            <p>Diskon hingga 40% untuk pengguna kampus setiap akhir pekan.</p>
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
          </div>
        </section>

        <section className="section" id="koleksi">
          <h3>Koleksi Thrift Pilihan</h3>
          <div className="grid">
            {['Jaket Kampus', 'Aksesoris Vintage', 'Kaos Event', 'Sepatu Streetwear'].map(
              (item) => (
                <article key={item} className="card">
                  <div className="card__image" />
                  <h4>{item}</h4>
                  <p>Kurasi khusus untuk mahasiswa, stok terbatas.</p>
                </article>
              )
            )}
          </div>
        </section>

        <section className="section" id="keunggulan">
          <div className="feature">
            <div>
              <h3>Kenapa ThriftKos?</h3>
              <p>
                Platform aman dengan kontrol admin, pembayaran mudah, dan dukungan layanan
                kampus.
              </p>
            </div>
            <ul>
              <li>Role-based access untuk admin dan customer</li>
              <li>Transaksi transparan dan terverifikasi</li>
              <li>Support komunitas kampus</li>
            </ul>
          </div>
        </section>

        {isAuthenticated && (
          <section className="section role-card">
            <h3>Berhasil Login</h3>
            <p>
              Role kamu saat ini: <strong>{userRole}</strong>. Halaman ini hanya menampilkan
              informasi role untuk akses terbatas.
            </p>
          </section>
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
                  placeholder="nama@kampus.ac.id"
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
              <button className="primary" type="submit">
                Masuk
              </button>
              <p className="modal__hint">
                Default admin: admin@sar.ac.id / admin
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
