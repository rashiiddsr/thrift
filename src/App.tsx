import { useMemo, useState } from 'react'
import './App.css'
import AdminApp from './admin/AdminApp'
import UserAuthPage from './user/UserAuthPage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

type AuthUser = {
  name: string
  email: string
  username: string
}

type RegisteredUser = {
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  address: string
}

const allowedEmailDomains = ['@sar.ac.id', '@usti.ac.id']

const isAllowedEmail = (email: string) =>
  allowedEmailDomains.some((domain) => email.trim().toLowerCase().endsWith(domain))

const isAdminRoute = () => window.location.pathname.startsWith('/admin')
const isUserRoute = () => window.location.pathname.startsWith('/user')

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])

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

  const handleUserLoginSuccess = (user: AuthUser) => {
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
        isAllowedEmail={isAllowedEmail}
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
            <button className="primary" type="button" onClick={() => window.location.assign('/user')}>
              Masuk
            </button>
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
                    Masuk Portal
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
