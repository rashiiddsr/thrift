import { useState, type ChangeEvent, type FormEvent, type Dispatch, type SetStateAction } from 'react'

type AuthUser = {
  name: string
  email: string
  username: string
}

type RegisteredUser = {
  fullName: string
  username: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  address: string
}

type UserAuthPageProps = {
  initialMode?: 'login' | 'register'
  registeredUsers: RegisteredUser[]
  setRegisteredUsers: Dispatch<SetStateAction<RegisteredUser[]>>
  onLoginSuccess: (user: AuthUser) => void
  isAllowedEmail: (email: string) => boolean
}

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

function UserAuthPage({
  initialMode = 'login',
  registeredUsers,
  setRegisteredUsers,
  onLoginSuccess,
  isAllowedEmail,
}: UserAuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [loginData, setLoginData] = useState(initialLogin)
  const [registerData, setRegisterData] = useState(initialRegister)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
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

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
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
          {mode === 'login' ? (
            <form className="user-auth__form" onSubmit={handleLoginSubmit}>
              <div className="user-auth__title">
                <h2>Masuk ke akunmu</h2>
                <p>Kelola pesanan dan favorit thrift kampus kamu.</p>
              </div>
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
              <button className="user-auth__switch" type="button" onClick={() => setMode('register')}>
                Belum punya akun? Daftar sekarang
              </button>
            </form>
          ) : (
            <form className="user-auth__form" onSubmit={handleRegisterSubmit}>
              <div className="user-auth__title">
                <h2>Registrasi akun baru</h2>
                <p>Isi data singkat untuk mulai belanja di ThriftKos.</p>
              </div>
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
              <button className="user-auth__switch" type="button" onClick={() => setMode('login')}>
                Sudah punya akun? Masuk di sini
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserAuthPage
