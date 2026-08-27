 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import './Admin.css';

function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 Estados para el Modal de Recuperación
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  // 🔐 LOGIN REAL CON FIREBASE
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('fusch_admin_session', 'true'); // Guardamos que es admin
      navigate('/documents');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('❌ Usuario no encontrado.');
      } else if (err.code === 'auth/wrong-password') {
        setError('❌ Contraseña incorrecta.');
      } else if (err.code === 'auth/invalid-email') {
        setError('❌ Correo electrónico inválido.');
      } else {
        setError('❌ Error al iniciar sesión. Verifica tus datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔐 RECUPERACIÓN DE CONTRASEÑA REAL CON FIREBASE
  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMessage('');
    
    if (!recoveryEmail.trim()) {
      setRecoveryMessage('❌ Por favor, ingresa tu correo electrónico.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, recoveryEmail);
      setRecoveryMessage(`✅ Se ha enviado un correo de recuperación a ${recoveryEmail}. Revisa tu bandeja de entrada.`);
      setTimeout(() => {
        setShowRecoveryModal(false);
        setRecoveryEmail('');
        setRecoveryMessage('');
      }, 3500);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setRecoveryMessage('❌ No existe una cuenta con este correo electrónico.');
      } else {
        setRecoveryMessage('❌ Error al enviar el correo. Inténtalo de nuevo más tarde.');
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-icon">🔒</div>
          <h2>Panel de Administración</h2>
          <p>Ingresa con tus credenciales</p>
        </div>

        <form className="admin-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico (Admin)</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fusch.edu.pe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <button 
              type="button" 
              className="forgot-password-link"
              onClick={() => setShowRecoveryModal(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '🔐 Cargando...' : '🔑 Iniciar Sesión'}
          </button>
        </form>
      </div>

      {/* MODAL DE RECUPERACIÓN DE CONTRASEÑA */}
      {showRecoveryModal && (
        <div className="modal-overlay" onClick={() => setShowRecoveryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowRecoveryModal(false)}>✕</button>
            
            <div className="modal-header">
              <span className="modal-icon">🔐</span>
              <h3>Recuperar Contraseña</h3>
              <p>Te enviaremos un enlace a tu correo para restablecer tu acceso.</p>
            </div>

            <form onSubmit={handleRecoverySubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="recovery-email">Correo Electrónico</label>
                <input
                  type="email"
                  id="recovery-email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              {recoveryMessage && (
                <div className={`recovery-message ${recoveryMessage.includes('✅') ? 'success' : 'error'}`}>
                  {recoveryMessage}
                </div>
              )}

              <button type="submit" className="modal-submit-btn">
                📤 Enviar enlace de recuperación
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;