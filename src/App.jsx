import { useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const initialRegister = {
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
}

const initialLogin = {
  email: '',
  password: '',
}

function App() {
  const [activeTab, setActiveTab] = useState('login')
  const [loginData, setLoginData] = useState(initialLogin)
  const [registerData, setRegisterData] = useState(initialRegister)

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

  const handleSubmit = (event) => {
    event.preventDefault()
    if (activeTab === 'login') {
      alert(`Login dikirim ke API: ${API_BASE_URL}`)
    } else {
      alert(`Registrasi dikirim ke API: ${API_BASE_URL}`)
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__greeting">{greeting}</p>
          <h1 className="app__title">ThriftKos</h1>
          <p className="app__subtitle">
            Platform ecommerce thrift kampus untuk belanja hemat, mudah, dan aman.
          </p>
        </div>
        <div className="app__stats">
          <div>
            <h3>120+</h3>
            <p>Produk kampus</p>
          </div>
          <div>
            <h3>3k+</h3>
            <p>Pengguna aktif</p>
          </div>
          <div>
            <h3>98%</h3>
            <p>Rating positif</p>
          </div>
        </div>
      </header>

      <main className="app__content">
        <section className="app__hero">
          <h2>Belanja thrift, dukung keberlanjutan kampus</h2>
          <p>
            ThriftKos membantu mahasiswa menemukan produk bekas berkualitas dengan harga
            terjangkau. Semua transaksi akan dikontrol oleh admin sesuai role pengguna.
          </p>
          <div className="app__highlights">
            <div>
              <h4>Terverifikasi</h4>
              <p>Login dan registrasi aman dengan akun kampus.</p>
            </div>
            <div>
              <h4>Transaksi Aman</h4>
              <p>Role admin mengontrol transaksi dan akses terbatas.</p>
            </div>
            <div>
              <h4>Terintegrasi API</h4>
              <p>Terhubung ke API di {API_BASE_URL}.</p>
            </div>
          </div>
        </section>

        <section className="app__auth">
          <div className="auth__tabs">
            <button
              className={activeTab === 'login' ? 'active' : ''}
              onClick={() => setActiveTab('login')}
              type="button"
            >
              Login
            </button>
            <button
              className={activeTab === 'register' ? 'active' : ''}
              onClick={() => setActiveTab('register')}
              type="button"
            >
              Register
            </button>
          </div>

          <form className="auth__form" onSubmit={handleSubmit}>
            {activeTab === 'login' ? (
              <>
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
                <button type="submit" className="primary">
                  Masuk
                </button>
                <p className="auth__hint">
                  Belum punya akun? klik Register untuk daftar.
                </p>
              </>
            ) : (
              <>
                <label>
                  Nama Lengkap
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    placeholder="Nama lengkap"
                    required
                  />
                </label>
                <label>
                  Email Kampus
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="nama@kampus.ac.id"
                    required
                  />
                </label>
                <label>
                  No. HP
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
                  <input
                    type="text"
                    name="address"
                    value={registerData.address}
                    onChange={handleRegisterChange}
                    placeholder="Alamat tinggal"
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
                <button type="submit" className="primary">
                  Daftar
                </button>
                <p className="auth__hint">
                  Dengan mendaftar, kamu setuju dengan aturan penggunaan ThriftKos.
                </p>
              </>
            )}
          </form>
        </section>
      </main>
    </div>
  )
}

export default App
