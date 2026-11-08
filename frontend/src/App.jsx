import { useState } from 'react'
import './App.css'
import logo from './assets/logo.jpg'

const MAIL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
)

export default function App() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  // النصوص اللي تتبدل في النصف الأخضر حسب الشاشة
  const leftTexts = {
    1: 'Saisissez votre e-mail pour recevoir le code.',
    2: 'Entrez le code de vérification reçu par e-mail.',
    3: 'Choisissez un nouveau mot de passe sécurisé.',
  }

  const submitEmail = (e) => {
    e.preventDefault()
    setError('')
    // لاحقا: هنا نبعثو الطلب للباك اند
    setStep(2)
  }

  const submitCode = (e) => {
    e.preventDefault()
    setError('')
    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres.')
      return
    }
    // لاحقا: هنا نتحققو من الكود في الباك اند
    setStep(3)
  }

  const submitPassword = (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    // لاحقا: هنا نبعثو كلمة السر الجديدة للباك اند
    setStep(4)
  }

  return (
    <div className="layout">
      <div className="left">
        <div className="brand">
          Miam <span>Plan !</span>
        </div>

        <p className="subtitle">Réinitialisation de mot de passe</p>
        <h1>
          Miam <span>Plan !</span>
        </h1>
        <p className="text">{leftTexts[step] || 'Votre mot de passe a été modifié.'}</p>
      </div>

      <div className="right">
        {/* ---------- الشاشة 1: البريد ---------- */}
        {step === 1 && (
          <form className="form" onSubmit={submitEmail}>
            <img src={logo} alt="Miam Plan" className="logo" />
            <h2>Mot de passe oublié ?</h2>

            <label>Adresse e-mail :</label>
            <div className="field">
              {MAIL_ICON}
              <input
                type="email"
                required
                placeholder="e-mail@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit">Recevoir le code</button>
          </form>
        )}

        {/* ---------- الشاشة 2: الكود ---------- */}
        {step === 2 && (
          <form className="form" onSubmit={submitCode}>
            <img src={logo} alt="Miam Plan" className="logo" />
            <h2>Vérification du code</h2>
            <p className="hint">Saisissez le code à 6 chiffres envoyé à {email}</p>

            <input
              className="code-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="------"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />

            {error && <p className="error">{error}</p>}
            <button type="submit">Vérifier le code</button>
            <button type="button" className="link-btn" onClick={() => setStep(1)}>
              Changer l'adresse e-mail
            </button>
          </form>
        )}

        {/* ---------- الشاشة 3: كلمة السر الجديدة ---------- */}
        {step === 3 && (
          <form className="form" onSubmit={submitPassword}>
            <img src={logo} alt="Miam Plan" className="logo" />
            <h2>Nouveau mot de passe</h2>
            <p className="hint">Saisissez votre nouveau mot de passe et confirmez-le.</p>

            <label>Nouveau mot de passe</label>
            <div className="field plain">
              <input
                type="password"
                required
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <label>Confirmer le mot de passe</label>
            <div className="field plain">
              <input
                type="password"
                required
                placeholder="Confirmez le mot de passe"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {error && <p className="error">{error}</p>}
            <button type="submit">Mettre à jour</button>
            <button type="button" className="link-btn" onClick={() => setStep(1)}>
              Annuler et retourner à la connexion
            </button>
          </form>
        )}

        {/* ---------- الشاشة 4: نجاح ---------- */}
        {step === 4 && (
          <div className="form">
            <img src={logo} alt="Miam Plan" className="logo" />
            <h2>Mot de passe modifié ✓</h2>
            <p className="success">
              Votre mot de passe a été mis à jour avec succès.
            </p>
            <button type="button" onClick={() => setStep(1)}>
              Retour à la connexion
            </button>
          </div>
        )}
      </div>
    </div>
  )
}