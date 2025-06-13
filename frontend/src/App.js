import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// ------ URL de la API ------
const API_URL = "https://rustiko.mangodigitalcr.com/api.php";

// --- Iconos ---
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
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

const ClientModal = ({ onSave, onClose, clientToEdit }) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const isEditing = !!clientToEdit;

  useEffect(() => {
    if (isEditing) {
      setNombre(clientToEdit.nombre_completo);
      setTelefono(clientToEdit.telefono);
      setDireccion(clientToEdit.direccion || "");
    }
  }, [isEditing, clientToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) {
      alert("Nombre y teléfono son obligatorios.");
      return;
    }
    const clientData = {
      ...(isEditing && { id: clientToEdit.id }),
      nombre_completo: nombre,
      telefono: telefono,
      direccion: direccion,
    };
    onSave(clientData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? "Editar Cliente" : "Agregar Nuevo Cliente"}</h2>
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

const AddTransactionModal = ({ type, clienteId, onSave, onClose }) => {
  const isVenta = type === "venta";
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const montoValue = parseFloat(monto);
    if (isNaN(montoValue) || montoValue <= 0) {
      alert("Por favor, ingresa un monto válido.");
      return;
    }
    if (isVenta && !descripcion.trim()) {
      alert("La descripción es obligatoria para las ventas.");
      return;
    }
    const transactionData = {
      cliente_id: clienteId,
      monto: montoValue,
      ...(isVenta && { descripcion: descripcion }),
    };
    onSave(type, transactionData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Registrar {isVenta ? "Venta" : "Abono"}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="number"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            step="0.01"
            required
          />
          {isVenta && (
            <input
              type="text"
              placeholder="Descripción de la Venta"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
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

const ConfirmDeleteModal = ({ onConfirm, onCancel, message }) => {
  return (
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

  const fetchVentas = useCallback(async () => {
    try {
      const url = `${API_URL}?action=ventas&cliente_id=${
        cliente.id
      }&t=${new Date().getTime()}`;
      const response = await fetch(url, { cache: "no-cache" });
      const data = await response.json();
      setVentas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching ventas:", error);
      setVentas([]);
    }
  }, [cliente.id]);

  const fetchAbonos = useCallback(async () => {
    try {
      const url = `${API_URL}?action=abonos&cliente_id=${
        cliente.id
      }&t=${new Date().getTime()}`;
      const response = await fetch(url, { cache: "no-cache" });
      const data = await response.json();
      setAbonos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching abonos:", error);
      setAbonos([]);
    }
  }, [cliente.id]);

  useEffect(() => {
    fetchVentas();
    fetchAbonos();
  }, [fetchVentas, fetchAbonos]);

  const handleSaveTransaction = async (type, data) => {
    try {
      const response = await fetch(`${API_URL}?action=${type}s`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `Error al registrar ${type}.`);
      }
      if (type === "venta") fetchVentas();
      if (type === "abono") fetchAbonos();
      setTransactionModal({ isOpen: false, type: null });
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleDeleteClick = (type, id) => {
    setConfirmModal({ isOpen: true, type: type, id: id });
  };

  const confirmDelete = async () => {
    const { type, id } = confirmModal;
    if (!type || !id) return;
    try {
      const response = await fetch(`${API_URL}?action=${type}s&id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar el registro.`);
      }
      if (type === "venta") fetchVentas();
      if (type === "abono") fetchAbonos();
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setConfirmModal({ isOpen: false, type: null, id: null });
    }
  };

  const totalVentas = ventas.reduce((sum, v) => sum + parseFloat(v.monto), 0);
  const totalAbonos = abonos.reduce((sum, a) => sum + parseFloat(a.monto), 0);
  const saldo = totalVentas - totalAbonos;
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
    }).format(amount);

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
          message="¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer."
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
                <li key={venta.id}>
                  <div className="item-info">
                    <span>{venta.descripcion}</span>
                    <small>
                      {new Date(venta.fecha).toLocaleDateString("es-CR")}
                    </small>
                  </div>
                  <div className="item-action">
                    <span className="monto-venta">
                      {formatCurrency(venta.monto)}
                    </span>
                    <button
                      onClick={() => handleDeleteClick("venta", venta.id)}
                      className="delete-item-btn"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="empty-history">No hay ventas registradas.</p>
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
                      onClick={() => handleDeleteClick("abono", abono.id)}
                      className="delete-item-btn"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="empty-history">No hay abonos registrados.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

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

function App() {
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

  const fetchClientes = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = `${API_URL}?action=clientes&t=${new Date().getTime()}`;
      const response = await fetch(url, { cache: "no-cache" });
      if (!response.ok) throw new Error("Error al cargar datos");
      const data = await response.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

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
    // Determina el método HTTP correcto a usar
    const method = isEditing ? "PUT" : "POST";

    // Ya no necesitamos enviar _method en el cuerpo de la petición
    const body = JSON.stringify(clienteData);

    try {
      const response = await fetch(`${API_URL}?action=clientes`, {
        method: method, // Usamos el método PUT o POST según corresponda
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      if (!response.ok) {
        // Intentamos leer el mensaje de error de la API
        const errorResult = await response.json();
        throw new Error(
          errorResult.message ||
            `Error al ${isEditing ? "actualizar" : "agregar"} el cliente.`
        );
      }

      fetchClientes();
      handleClientModalClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDeleteRequest = (id) => {
    setConfirmDelete({ isOpen: true, id: id });
  };

  const executeDeleteCliente = async () => {
    if (!confirmDelete.id) return;
    try {
      // CAMBIO: Usamos el método DELETE y pasamos el ID en la URL
      const response = await fetch(
        `${API_URL}?action=clientes&id=${confirmDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(
          errorResult.message || "No se pudo eliminar el cliente."
        );
      }

      fetchClientes(); // Refresca la lista de clientes
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setConfirmDelete({ isOpen: false, id: null });
    }
  };

  if (selectedCliente) {
    return (
      <div className="app-container">
        <ClienteDetail
          cliente={selectedCliente}
          onBack={() => setSelectedCliente(null)}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
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
          message="¿Estás seguro de que quieres eliminar este cliente? Todas sus ventas y abonos asociados también serán eliminados permanentemente."
        />
      )}
      <header className="app-header">
        <h1>Panel Principal</h1>
        <div className="user-info">
          <span>Hola,</span>
          <button className="logout-btn">
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
        <div className="toolbar">
          <div className="search-bar">
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar cliente por nombre o teléfono..."
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
          {isLoading && <p>Cargando clientes...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          {!isLoading && !error && (
            <div className="clientes-grid">
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <ClienteCard
                    key={cliente.id}
                    cliente={cliente}
                    onSelect={setSelectedCliente}
                    onDelete={handleDeleteRequest}
                    onEdit={handleClientModalOpen}
                  />
                ))
              ) : (
                <p>No hay clientes registrados.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
