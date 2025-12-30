import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

const defaultAdmin = {
  name: 'Admin',
  username: 'admin',
  email: 'admin@sar.ac.id',
  password: 'admin',
  role: 'superadmin',
}

const isAdminCredential = (identifier: string, password: string) => {
  const normalized = identifier.trim().toLowerCase()
  if (!normalized || !password) return false
  return (
    (normalized === defaultAdmin.email || normalized === defaultAdmin.username) &&
    password === defaultAdmin.password
  )
}

function AdminApp() {
  const [adminIdentifier, setAdminIdentifier] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)
  const [activeMenu, setActiveMenu] = useState<'beranda' | 'profil'>('beranda')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl)
      }
    }
  }, [avatarUrl])

  const handleAdminSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isAdminCredential(adminIdentifier, adminPassword)) {
      setAdminError('Username/email atau password admin tidak sesuai.')
      return
    }

    setAdminAuthenticated(true)
    setAdminError('')
  }

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setAvatarUrl(previewUrl)
  }

  const renderContent = () => {
    if (activeMenu === 'profil') {
      return (
        <section className="adminlte__profile-page">
          <div className="adminlte__profile-card">
            <div className="adminlte__profile-photo">
              <div className="adminlte__avatar adminlte__avatar--large adminlte__avatar--light">
                {avatarUrl ? (
                  <img className="adminlte__avatar-image" src={avatarUrl} alt="Foto profil admin" />
                ) : (
                  <span>{defaultAdmin.name.charAt(0)}</span>
                )}
              </div>
              <label className="adminlte__avatar-action">
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
                Ubah Foto
              </label>
            </div>
            <div className="adminlte__profile-info">
              <span className="adminlte__profile-role">{defaultAdmin.role}</span>
              <h2>{defaultAdmin.name}</h2>
              <p className="adminlte__profile-username">@{defaultAdmin.username}</p>
            </div>
          </div>
          <form
            className="adminlte__profile-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
          >
            <div className="adminlte__form-row">
              <label>
                Nama Lengkap
                <input type="text" defaultValue={defaultAdmin.name} />
              </label>
              <label>
                Email
                <input type="email" defaultValue={defaultAdmin.email} />
              </label>
            </div>
            <div className="adminlte__form-row">
              <label>
                Username
                <input type="text" defaultValue={`@${defaultAdmin.username}`} />
              </label>
              <label>
                Password Baru
                <input type="password" placeholder="Kosongkan bila tidak berubah" />
              </label>
            </div>
            <button className="primary adminlte__save" type="submit">
              Simpan Perubahan
            </button>
          </form>
        </section>
      )
    }

    return (
      <>
        <section className="adminlte__overview">
          <div className="adminlte__stat">
            <span>Menu aktif</span>
            <h3>Beranda</h3>
            <p>Ringkasan aktivitas admin hari ini.</p>
          </div>
          <div className="adminlte__stat">
            <span>Pengajuan baru</span>
            <h3>24</h3>
            <p>+12% dari minggu lalu</p>
          </div>
          <div className="adminlte__stat">
            <span>Notifikasi penting</span>
            <h3>5</h3>
            <p>Periksa pembaruan terbaru.</p>
          </div>
        </section>
        <section className="adminlte__empty">
          <h3>Konten beranda akan segera tersedia.</h3>
          <p>Gunakan area ini untuk ringkasan admin, laporan, dan modul master data.</p>
        </section>
      </>
    )
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
                placeholder="username atau email admin"
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
          <p className="admin-login__hint">Gunakan kredensial resmi dari tim IT ThriftKos.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`adminlte adminlte--light ${isSidebarOpen ? '' : 'adminlte--collapsed'}`}>
      <aside className="adminlte__sidebar adminlte__sidebar--light">
        <div className="adminlte__brand">
          <div className="adminlte__logo adminlte__logo--light">TK</div>
          <div>
            <h2>ThriftKos</h2>
            <span>Admin Panel</span>
          </div>
        </div>
        <nav className="adminlte__nav">
          <button
            type="button"
            className={`adminlte__nav-item ${
              activeMenu === 'beranda' ? 'adminlte__nav-item--active' : ''
            }`}
            onClick={() => setActiveMenu('beranda')}
          >
            Beranda
          </button>
          <button
            type="button"
            className={`adminlte__nav-item ${
              activeMenu === 'profil' ? 'adminlte__nav-item--active' : ''
            }`}
            onClick={() => setActiveMenu('profil')}
          >
            Profil
          </button>
        </nav>
      </aside>
      <div className="adminlte__content">
        <header className="adminlte__topbar">
          <div className="adminlte__topbar-left">
            <button
              className="adminlte__hamburger"
              type="button"
              aria-label="Buka/tutup menu"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
            <div>
              <h1>{activeMenu === 'profil' ? 'Profil Admin' : 'Beranda Admin'}</h1>
              <p>Selamat datang, {defaultAdmin.name}</p>
            </div>
          </div>
          <div className="adminlte__profile">
            <div>
              <strong>{defaultAdmin.name}</strong>
              <span>@{defaultAdmin.username}</span>
            </div>
            <div className="adminlte__avatar adminlte__avatar--light">
              {avatarUrl ? (
                <img className="adminlte__avatar-image" src={avatarUrl} alt="Foto profil admin" />
              ) : (
                <span>A</span>
              )}
            </div>
          </div>
        </header>
        {renderContent()}
      </div>
    </div>
  )
}

export default AdminApp
