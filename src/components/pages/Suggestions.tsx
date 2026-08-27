import React, { useState } from 'react';
import './Suggestions.css';

function Suggestions() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'sugerencia',
    message: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('✅ Tu mensaje fue enviado correctamente. ¡Gracias por participar!');
    setFormData({ name: '', email: '', category: 'sugerencia', message: '' });
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="suggestions-container">
      <div className="suggestions-header">
        <h2>📩 Buzón de Sugerencias</h2>
        <p>Envía tus quejas, reclamos o sugerencias de forma anónima</p>
      </div>

      <form onSubmit={handleSubmit} className="suggestions-form">
        <div className="form-group">
          <label>Nombre (Opcional)</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tu nombre (puedes dejarlo vacío)"
          />
        </div>
        <div className="form-group">
          <label>Email (Opcional)</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Tu correo (puedes dejarlo vacío)"
          />
        </div>
        <div className="form-group">
          <label>Tipo de mensaje *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="sugerencia">📝 Sugerencia</option>
            <option value="queja">⚠️ Queja</option>
            <option value="reclamo">📢 Reclamo</option>
            <option value="felicitacion">🎉 Felicitación</option>
            <option value="denuncia">🔒 Denuncia</option>
          </select>
        </div>
        <div className="form-group">
          <label>Tu mensaje *</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Escribe aquí tu sugerencia, queja o reclamo..."
            rows={5}
            required
          />
        </div>
        {message && <div className="success-message">{message}</div>}
        <button type="submit" className="submit-btn">📤 Enviar Mensaje</button>
      </form>
    </div>
  );
}

export default Suggestions;