import { useState } from 'react'
import './App.css'
import logo from './assets/logo.jpg'

const API = 'http://127.0.0.1:8001/api/password'

async function post(path, body) {
  const res = await fetch(`${API}/${path}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur')
  return data
}

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

  const leftTexts = {
    1: 'Saisissez votre e-mail pour recevoir le code.',
    2: 'Entrez le code de vérification reçu par e-mail.',
    3: 'Choisissez un nouveau mot de passe sécurisé.',
  }

  const submitEmail = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await post('request-code', { email })
      setStep(2)
    } catch (err) {
      setError(err.message)
    }
  }

  const submitCode = async (e) => {
    e.preventDefault()
    setError('')
    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres.')
      return
    }
    try {
      await post('verify-code', { email, code })
      setStep(3)
    } catch (err) {
      setError(err.message)
    }
  }

  const submitPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    try {
      await post('reset', { email, code, password })
      setStep(4)
    } catch (err) {
      setError(err.message)
    }
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

            {error && <p className="error">{error}</p>}
            <button type="submit">Recevoir le code</button>
          </form>
        )}

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

        {step === 4 && (
          <div className="form">
            <img src={logo} alt="Miam Plan" className="logo" />
            <h2>Mot de passe modifié ✓</h2>
            <p className="success">Votre mot de passe a été mis à jour avec succès.</p>
            <button type="button" onClick={() => setStep(1)}>
              Retour à la connexion
            </button>
          </div>
        )}
      </div>
    </div>
  )
}