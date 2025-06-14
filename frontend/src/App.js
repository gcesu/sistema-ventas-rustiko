import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from "react";
import "./App.css";

// ------ CONTEXTO Y CONSTANTES ------
const API_URL = "https://rustiko.mangodigitalcr.com/api.php";
const AuthContext = createContext(null);
const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC" }).format(
    amount
  );

// ------ ICONOS ------
const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const UserGroupIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
const ChartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v18h18"></path>
    <path d="m18 9-5 5-4-4-3 3"></path>
  </svg>
);
const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const UserPlusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="17" y1="11" x2="23" y2="11"></line>
  </svg>
);
const PhoneIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);
const PinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const LogoutIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);
const BackIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
const PlusSquareIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);
const DollarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);
const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

// --- COMPONENTE #1: APLICACIÓN PRINCIPAL ---
function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch(`${API_URL}?action=check_session`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.isLoggedIn) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("No se pudo verificar la sesión", error);
      } finally {
        setAuthLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const authContextValue = {
    user,
    login: (userData) => setUser(userData),
    logout: async () => {
      await fetch(`${API_URL}?action=logout`, { credentials: "include" });
      setUser(null);
    },
  };

  if (authLoading) {
    return <div className="loading-screen">Cargando aplicación...</div>;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="app-container">
        {user ? <Dashboard /> : <LoginPage />}
      </div>
    </AuthContext.Provider>
  );
}

// --- COMPONENTE #2: PÁGINA DE INICIO DE SESIÓN ---
const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      const response = await fetch(`${API_URL}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Ocurrió un error.");
      login(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Inicio de Sesion</h2>
        <p>Por favor, inicie sesión para continuar.</p>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Nombre de Usuario"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
          />
          {error && <p className="error-message auth-error">{error}</p>}
          <button type="submit" className="btn-submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENTE #3: PANEL PRINCIPAL (DASHBOARD) ---
function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [activeTab, setActiveTab] = useState("clientes");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    id: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClientes = useCallback(async (searchQuery) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${API_URL}?action=clientes`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Error al cargar clientes"
        );
      const data = await response.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "clientes") {
      const timerId = setTimeout(() => fetchClientes(searchTerm), 300);
      return () => clearTimeout(timerId);
    }
  }, [searchTerm, activeTab, fetchClientes]);

  const handleClientModalOpen = (client = null) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };
  const handleClientModalClose = () => {
    setIsClientModalOpen(false);
    setEditingClient(null);
  };

  const handleSaveClient = async (clienteData) => {
    const isEditing = !!clienteData.id;
    const method = isEditing ? "PUT" : "POST";
    try {
      const response = await fetch(`${API_URL}?action=clientes`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteData),
        credentials: "include",
      });
      if (!response.ok) throw new Error((await response.json()).message);
      fetchClientes(searchTerm);
      handleClientModalClose();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteRequest = (id) => setConfirmDelete({ isOpen: true, id });

  const executeDeleteCliente = async () => {
    if (!confirmDelete.id) return;
    try {
      const response = await fetch(
        `${API_URL}?action=clientes&id=${confirmDelete.id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!response.ok) throw new Error((await response.json()).message);
      fetchClientes(searchTerm);
    } catch (err) {
      alert(err.message);
    } finally {
      setConfirmDelete({ isOpen: false, id: null });
    }
  };

  if (selectedCliente) {
    return (
      <ClienteDetail
        cliente={selectedCliente}
        onBack={() => setSelectedCliente(null)}
      />
    );
  }

  return (
    <>
      {isClientModalOpen && (
        <ClientModal
          onSave={handleSaveClient}
          onClose={handleClientModalClose}
          clientToEdit={editingClient}
        />
      )}
      {confirmDelete.isOpen && (
        <ConfirmDeleteModal
          onConfirm={executeDeleteCliente}
          onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
          message="¿Seguro que quieres eliminar este cliente?"
        />
      )}

      <header className="app-header">
        <h1>Rustiko</h1>
        <div className="user-info">
          <span>Hola, {user.username}</span>
          <button onClick={logout} className="logout-btn" title="Cerrar Sesión">
            <LogoutIcon />
          </button>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === "clientes" ? "active" : ""}`}
          onClick={() => setActiveTab("clientes")}
        >
          <UserGroupIcon /> Clientes
        </button>
        <button
          className={`nav-btn ${activeTab === "reportes" ? "active" : ""}`}
          onClick={() => setActiveTab("reportes")}
        >
          <ChartIcon /> Reportes
        </button>
      </nav>

      <main className="app-main">
        {activeTab === "clientes" && (
          <>
            <div className="toolbar">
              <div className="search-bar">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="add-btn"
                onClick={() => handleClientModalOpen(null)}
              >
                <UserPlusIcon /> Agregar Cliente
              </button>
            </div>
            <div className="content-area">
              {isLoading && <p>Cargando...</p>}
              {error && <p className="error-message">{error}</p>}
              {!isLoading && !error && (
                <div className="clientes-grid">
                  {clientes.length > 0 ? (
                    clientes.map((c) => (
                      <ClienteCard
                        key={c.id}
                        cliente={c}
                        onSelect={setSelectedCliente}
                        onDelete={handleDeleteRequest}
                        onEdit={handleClientModalOpen}
                      />
                    ))
                  ) : (
                    <p>
                      {searchTerm
                        ? "No se encontraron clientes."
                        : "No hay clientes registrados."}
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        {activeTab === "reportes" && <ReportesView />}
      </main>
    </>
  );
}

// --- RESTO DE COMPONENTES DE LA APLICACIÓN ---
const VentaDetailModal = ({ ventaId, onClose }) => {
  const [detalles, setDetalles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDetalles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_URL}?action=venta_detalle&venta_id=${ventaId}`,
          { credentials: "include" }
        );
        const data = await response.json();
        setDetalles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching sale details:", error);
      }
      setIsLoading(false);
    };
    fetchDetalles();
  }, [ventaId]);
  const total = detalles.reduce(
    (sum, item) => sum + parseFloat(item.precio),
    0
  );
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Detalles de la Venta</h2>
        {isLoading ? (
          <p>Cargando...</p>
        ) : (
          <ul className="venta-detail-list">
            {detalles.map((item) => (
              <li key={item.id}>
                <span>{item.producto_descripcion}</span>
                <span>{formatCurrency(item.precio)}</span>
              </li>
            ))}
            <li className="total-row">
              <strong>Total:</strong>
              <strong>{formatCurrency(total)}</strong>
            </li>
          </ul>
        )}
        <div className="modal-actions">
          <button className="btn-submit" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
const AddTransactionModal = ({ type, clienteId, onSave, onClose }) => {
  const isVenta = type === "venta";
  const [monto, setMonto] = useState("");
  const [items, setItems] = useState([{ descripcion: "", precio: "" }]);
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
  const handleAddItem = () => {
    setItems([...items, { descripcion: "", precio: "" }]);
  };
  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };
  const ventaTotal = useMemo(
    () => items.reduce((sum, item) => sum + (parseFloat(item.precio) || 0), 0),
    [items]
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isVenta) {
      const validItems = items.filter(
        (item) => item.descripcion.trim() !== "" && parseFloat(item.precio) > 0
      );
      if (validItems.length === 0) {
        alert("Agrega al menos un producto válido.");
        return;
      }
      onSave("venta", { cliente_id: clienteId, productos: validItems });
    } else {
      const montoValue = parseFloat(monto);
      if (isNaN(montoValue) || montoValue <= 0) {
        alert("Ingresa un monto válido.");
        return;
      }
      onSave("abono", { cliente_id: clienteId, monto: montoValue });
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Registrar {isVenta ? "Venta" : "Abono"}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          {isVenta ? (
            <div className="venta-items-container">
              {items.map((item, index) => (
                <div className="venta-item-row" key={index}>
                  <input
                    type="text"
                    placeholder="Descripción del Producto"
                    value={item.descripcion}
                    onChange={(e) =>
                      handleItemChange(index, "descripcion", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    step="0.01"
                    value={item.precio}
                    onChange={(e) =>
                      handleItemChange(index, "precio", e.target.value)
                    }
                    required
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => handleRemoveItem(index)}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-item-btn"
                onClick={handleAddItem}
              >
                + Agregar Producto
              </button>
              <div className="venta-total">
                <strong>Total: {formatCurrency(ventaTotal)}</strong>
              </div>
            </div>
          ) : (
            <input
              type="number"
              placeholder="Monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              step="0.01"
              required
            />
          )}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const ClientModal = ({ onSave, onClose, clientToEdit }) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  useEffect(() => {
    if (clientToEdit) {
      setNombre(clientToEdit.nombre_completo);
      setTelefono(clientToEdit.telefono);
      setDireccion(clientToEdit.direccion || "");
    } else {
      setNombre("");
      setTelefono("");
      setDireccion("");
    }
  }, [clientToEdit]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) {
      alert("Nombre y teléfono son obligatorios.");
      return;
    }
    onSave({
      ...(clientToEdit && { id: clientToEdit.id }),
      nombre_completo: nombre,
      telefono: telefono,
      direccion: direccion,
    });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{clientToEdit ? "Editar Cliente" : "Agregar Nuevo Cliente"}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Nombre Completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Dirección (Opcional)"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const ConfirmDeleteModal = ({ onConfirm, onCancel, message }) => (
  <div className="modal-overlay">
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>Confirmar Eliminación</h2>
      <p>{message}</p>
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn-delete" onClick={onConfirm}>
          Sí, Eliminar
        </button>
      </div>
    </div>
  </div>
);
const ClienteCard = ({ cliente, onSelect, onDelete, onEdit }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(cliente.id);
  };
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(cliente);
  };
  return (
    <div className="cliente-card">
      <div className="card-content" onClick={() => onSelect(cliente)}>
        <h3>{cliente.nombre_completo}</h3>
        <p>
          <PhoneIcon /> {cliente.telefono}
        </p>
        <p>
          <PinIcon /> {cliente.direccion || "No especificada"}
        </p>
      </div>
      <div className="cliente-card-actions">
        <button
          onClick={handleEdit}
          className="card-action-btn edit"
          title="Editar Cliente"
        >
          <EditIcon />
        </button>
        <button
          onClick={handleDelete}
          className="card-action-btn delete"
          title="Eliminar Cliente"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};
const ClienteDetail = ({ cliente, onBack }) => {
  const [ventas, setVentas] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    type: null,
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    id: null,
  });
  const [viewingVentaId, setViewingVentaId] = useState(null);
  const fetchTransacciones = useCallback(async () => {
    try {
      const [ventasRes, abonosRes] = await Promise.all([
        fetch(`${API_URL}?action=ventas&cliente_id=${cliente.id}`, {
          credentials: "include",
        }),
        fetch(`${API_URL}?action=abonos&cliente_id=${cliente.id}`, {
          credentials: "include",
        }),
      ]);
      const ventasData = await ventasRes.json();
      const abonosData = await abonosRes.json();
      setVentas(Array.isArray(ventasData) ? ventasData : []);
      setAbonos(Array.isArray(abonosData) ? abonosData : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [cliente.id]);
  useEffect(() => {
    fetchTransacciones();
  }, [fetchTransacciones]);
  const handleSaveTransaction = async (type, data) => {
    try {
      const response = await fetch(`${API_URL}?action=${type}s`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) throw new Error((await response.json()).message);
      fetchTransacciones();
      setTransactionModal({ isOpen: false, type: null });
    } catch (error) {
      alert(error.message);
    }
  };
  const handleDeleteClick = (type, id) =>
    setConfirmModal({ isOpen: true, type: type, id: id });
  const confirmDelete = async () => {
    const { type, id } = confirmModal;
    if (!type || !id) return;
    try {
      await fetch(`${API_URL}?action=${type}s&id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchTransacciones();
    } catch (error) {
      alert(error.message);
    } finally {
      setConfirmModal({ isOpen: false, type: null, id: null });
    }
  };
  const totalVentas = ventas.reduce(
    (sum, v) => sum + parseFloat(v.monto_total),
    0
  );
  const totalAbonos = abonos.reduce((sum, a) => sum + parseFloat(a.monto), 0);
  const saldo = totalVentas - totalAbonos;
  return (
    <div className="detail-view">
      {transactionModal.isOpen && (
        <AddTransactionModal
          type={transactionModal.type}
          clienteId={cliente.id}
          onSave={handleSaveTransaction}
          onClose={() => setTransactionModal({ isOpen: false, type: null })}
        />
      )}
      {confirmModal.isOpen && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={() =>
            setConfirmModal({ isOpen: false, type: null, id: null })
          }
          message="¿Seguro que quieres eliminar este registro?"
        />
      )}
      {viewingVentaId && (
        <VentaDetailModal
          ventaId={viewingVentaId}
          onClose={() => setViewingVentaId(null)}
        />
      )}
      <button onClick={onBack} className="back-btn">
        <BackIcon /> Volver a Clientes
      </button>
      <div className="cliente-header">
        <h2>{cliente.nombre_completo}</h2>
        <p>
          <PhoneIcon /> {cliente.telefono}
        </p>
        <p>
          <PinIcon /> {cliente.direccion || "No especificada"}
        </p>
      </div>
      <div className="summary-cards">
        <div className="summary-card ventas">
          <h4>Total Ventas</h4>
          <p>{formatCurrency(totalVentas)}</p>
        </div>
        <div className="summary-card abonos">
          <h4>Total Abonos</h4>
          <p>{formatCurrency(totalAbonos)}</p>
        </div>
        <div className="summary-card saldo">
          <h4>Saldo Pendiente</h4>
          <p>{formatCurrency(saldo)}</p>
        </div>
      </div>
      <div className="detail-actions">
        <button
          className="action-btn green"
          onClick={() => setTransactionModal({ isOpen: true, type: "abono" })}
        >
          <PlusSquareIcon /> Registrar Abono
        </button>
        <button
          className="action-btn red"
          onClick={() => setTransactionModal({ isOpen: true, type: "venta" })}
        >
          <DollarIcon /> Registrar Venta
        </button>
      </div>
      <div className="history-columns">
        <div className="history-column">
          <h3>Historial de Ventas</h3>
          <ul>
            {ventas.length > 0 ? (
              ventas.map((venta) => (
                <li
                  key={venta.id}
                  onClick={() => setViewingVentaId(venta.id)}
                  className="clickable-row"
                >
                  <div className="item-info">
                    <span>{venta.descripcion}</span>
                    <small>
                      {new Date(venta.fecha).toLocaleDateString("es-CR")}
                    </small>
                  </div>
                  <div className="item-action">
                    <span className="monto-venta">
                      {formatCurrency(venta.monto_total)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick("venta", venta.id);
                      }}
                      className="delete-item-btn"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="empty-history">No hay ventas.</p>
            )}
          </ul>
        </div>
        <div className="history-column">
          <h3>Historial de Abonos</h3>
          <ul>
            {abonos.length > 0 ? (
              abonos.map((abono) => (
                <li key={abono.id}>
                  <div className="item-info">
                    <span>Abono recibido</span>
                    <small>
                      {new Date(abono.fecha).toLocaleDateString("es-CR")}
                    </small>
                  </div>
                  <div className="item-action">
                    <span className="monto-abono">
                      {formatCurrency(abono.monto)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick("abono", abono.id);
                      }}
                      className="delete-item-btn"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="empty-history">No hay abonos.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
const ReportesView = () => {
  const getTodayLocal = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [selectedDate, setSelectedDate] = useState(getTodayLocal());
  const [reportData, setReportData] = useState({ ventas: [], abonos: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchReporte = useCallback(async (date) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?action=reportes&date=${date}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("No se pudo cargar el reporte.");
      const data = await response.json();
      setReportData({
        ventas: Array.isArray(data.ventas) ? data.ventas : [],
        abonos: Array.isArray(data.abonos) ? data.abonos : [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchReporte(selectedDate);
  }, [selectedDate, fetchReporte]);
  const totalVentas = reportData.ventas.reduce(
    (sum, v) => sum + parseFloat(v.monto_total),
    0
  );
  const totalAbonos = reportData.abonos.reduce(
    (sum, a) => sum + parseFloat(a.monto),
    0
  );
  const granTotal = totalVentas + totalAbonos;
  return (
    <div className="report-view">
      <div className="toolbar">
        <div className="report-date-picker">
          <label htmlFor="report-date">Seleccionar fecha: </label>
          <input
            type="date"
            id="report-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="summary-cards">
            <div className="summary-card ventas">
              <h4>Total Ventas</h4>
              <p>{formatCurrency(totalVentas)}</p>
            </div>
            <div className="summary-card abonos">
              <h4>Total Abonos</h4>
              <p>{formatCurrency(totalAbonos)}</p>
            </div>
            <div className="summary-card total-reporte">
              <h4>Total del Día</h4>
              <p>{formatCurrency(granTotal)}</p>
            </div>
          </div>
          <div className="history-columns">
            <div className="history-column">
              <h3>Ventas del Día</h3>
              <ul>
                {reportData.ventas.length > 0 ? (
                  reportData.ventas.map((v) => (
                    <li key={`v-${v.id}`}>
                      <div className="item-info">
                        <span>{v.descripcion}</span>
                        <small>Cliente: {v.nombre_completo}</small>
                      </div>
                      <div className="item-action">
                        <span className="monto-venta">
                          {formatCurrency(v.monto_total)}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="empty-history">No hay ventas.</p>
                )}
              </ul>
            </div>
            <div className="history-column">
              <h3>Abonos del Día</h3>
              <ul>
                {reportData.abonos.length > 0 ? (
                  reportData.abonos.map((a) => (
                    <li key={`a-${a.id}`}>
                      <div className="item-info">
                        <span>Abono Recibido</span>
                        <small>Cliente: {a.nombre_completo}</small>
                      </div>
                      <div className="item-action">
                        <span className="monto-abono">
                          {formatCurrency(a.monto)}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="empty-history">No hay abonos.</p>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
