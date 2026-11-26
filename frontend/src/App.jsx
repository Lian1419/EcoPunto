import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000/api';

function App() {
  const [materiales, setMateriales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    cantidad: '',
    unidad: 'kg',
    usuario_id: 1
  });

  const cargarMateriales = async () => {
    try {
      setError('');
      const respuesta = await fetch(`${API_URL}/materiales`);

      if (!respuesta.ok) {
        throw new Error('No se pudieron consultar los materiales');
      }

      const datos = await respuesta.json();
      setMateriales(datos);
    } catch (err) {
      setError('No se pudo conectar con el servidor. Comprueba que el backend esté funcionando.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMateriales();
  }, []);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const registrarMaterial = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const respuesta = await fetch(`${API_URL}/materiales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formulario,
          cantidad: Number(formulario.cantidad),
          usuario_id: Number(formulario.usuario_id)
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo registrar el material');
      }

      setMensaje('¡Material registrado correctamente!');
      setFormulario({
        nombre: '',
        descripcion: '',
        cantidad: '',
        unidad: 'kg',
        usuario_id: 1
      });

      await cargarMateriales();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <span className="logo-icon">♻</span>
          <span>Eco<span className="logo-green">Punto</span></span>
        </div>

        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#registrar">Registrar material</a>
          <a href="#materiales">Materiales</a>
        </nav>

        <div className="user-profile">
          <span className="user-avatar">U</span>
          <span>Usuario</span>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-content">
            <span className="hero-tag">♻ UN FUTURO MÁS LIMPIO</span>
            <h1>Reciclar hoy para<br />un <span>mañana mejor.</span></h1>
            <p>
              Dale una segunda oportunidad a los materiales reciclables.
              Registra, comparte y contribuye al cuidado de nuestro planeta.
            </p>
            <a href="#registrar" className="hero-button">
              Registrar material <span>→</span>
            </a>
          </div>

          <div className="hero-illustration">
            <div className="illustration-circle">
              <span>♻</span>
            </div>
            <div className="floating-card">
              <span>🌱</span>
              <div>
                <strong>Pequeñas acciones</strong>
                <small>Grandes cambios</small>
              </div>
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span className="stat-icon">♻</span>
            <div>
              <strong>{materiales.length}</strong>
              <span>Materiales registrados</span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🌍</span>
            <div>
              <strong>EcoPunto</strong>
              <span>Una comunidad sostenible</span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🌿</span>
            <div>
              <strong>100%</strong>
              <span>Compromiso ambiental</span>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="form-section" id="registrar">
            <div className="section-heading">
              <span className="section-tag">CONTRIBUYE AL CAMBIO</span>
              <h2>Registrar material</h2>
              <p>Completa los datos del material que deseas reciclar.</p>
            </div>

            <form onSubmit={registrarMaterial}>
              <label htmlFor="nombre">Nombre del material</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej. Botellas de plástico"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
              />

              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe brevemente el material..."
                value={formulario.descripcion}
                onChange={manejarCambio}
                rows="3"
              />

              <div className="form-row">
                <div>
                  <label htmlFor="cantidad">Cantidad</label>
                  <input
                    id="cantidad"
                    name="cantidad"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Ej. 10"
                    value={formulario.cantidad}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="unidad">Unidad</label>
                  <select
                    id="unidad"
                    name="unidad"
                    value={formulario.unidad}
                    onChange={manejarCambio}
                  >
                    <option value="kg">Kilogramos</option>
                    <option value="unidades">Unidades</option>
                    <option value="litros">Litros</option>
                    <option value="bolsas">Bolsas</option>
                  </select>
                </div>
              </div>

              {mensaje && <div className="alert success">{mensaje}</div>}
              {error && <div className="alert error">{error}</div>}

              <button type="submit" className="submit-button">
                + Registrar material
              </button>
            </form>
          </div>

          <div className="materials-section" id="materiales">
            <div className="section-heading">
              <span className="section-tag">ECONOMÍA CIRCULAR</span>
              <h2>Materiales disponibles</h2>
              <p>Materiales registrados en nuestra plataforma.</p>
            </div>

            {cargando ? (
              <p className="empty-message">Cargando materiales...</p>
            ) : materiales.length === 0 ? (
              <div className="empty-state">
                <span>📦</span>
                <h3>Aún no hay materiales</h3>
                <p>Registra el primer material y comienza a reciclar.</p>
              </div>
            ) : (
              <div className="materials-list">
                {materiales.map((material) => (
                  <article className="material-card" key={material.id}>
                    <div className="material-icon">♻</div>
                    <div className="material-info">
                      <h3>{material.nombre}</h3>
                      <p>{material.descripcion || 'Sin descripción'}</p>
                      <span className="material-status">
                        {material.estado || 'disponible'}
                      </span>
                    </div>
                    <div className="material-quantity">
                      <strong>{material.cantidad}</strong>
                      <span>{material.unidad}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bottom-banner">
          <span>🌱</span>
          <div>
            <h2>El cambio comienza contigo</h2>
            <p>Cada material reciclado representa una oportunidad para cuidar nuestro planeta.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="logo">
          <span className="logo-icon">♻</span>
          <span>Eco<span className="logo-green">Punto</span></span>
        </div>
        <p>© 2026 EcoPunto - Construyendo un futuro sostenible.</p>
      </footer>
    </div>
  );
}

export default App;
