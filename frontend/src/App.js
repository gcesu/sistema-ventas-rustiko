import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext,
  useRef,
} from "react";
import "./App.css";

// ------ CONTEXTO Y CONSTANTES ------
const API_URL = "https://rustiko.mangodigitalcr.com/api_beta.php";
const AuthContext = createContext(null);
const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC" }).format(
    amount
  );
const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "America/Costa_Rica",
  };
  return new Intl.DateTimeFormat("es-CR", options).format(date);
};

const getTodayLocal = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ------ CUSTOM HOOK: useFormattedInput ------
const useFormattedInput = (initialRawValue = "", isCurrency = false) => {
  const [displayValue, setDisplayValue] = useState(() => {
    const numericValue = parseFloat(initialRawValue);
    if (!isNaN(numericValue) && initialRawValue !== "") {
      return isCurrency
        ? numericValue.toLocaleString("es-CR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : numericValue.toLocaleString("es-CR", { maximumFractionDigits: 2 });
    }
    return String(initialRawValue);
  });

  const cleanValueRef = useRef(initialRawValue);

  useEffect(() => {
    const numericInitialValue = parseFloat(initialRawValue);
    if (String(initialRawValue) !== String(cleanValueRef.current)) {
      if (!isNaN(numericInitialValue) && initialRawValue !== "") {
        cleanValueRef.current = numericInitialValue;
        setDisplayValue(
          isCurrency
            ? numericInitialValue.toLocaleString("es-CR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : numericInitialValue.toLocaleString("es-CR", {
                maximumFractionDigits: 2,
              })
        );
      } else {
        cleanValueRef.current = String(initialRawValue);
        setDisplayValue(String(initialRawValue));
      }
    }
  }, [initialRawValue, isCurrency]);

  const handleChange = useCallback(
    (e) => {
      const rawInput = e.target.value;
      if (rawInput === "") {
        cleanValueRef.current = "";
        setDisplayValue("");
        return;
      }
      const cleanedValueForParse = rawInput
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(/,/g, ".");
      const parsedNum = parseFloat(cleanedValueForParse);
      if (isNaN(parsedNum)) {
        cleanValueRef.current = "";
        setDisplayValue(rawInput);
        return;
      }
      cleanValueRef.current = parsedNum;
      const parts = cleanedValueForParse.split(".");
      let formattedDisplay = parsedNum.toLocaleString("es-CR", {
        maximumFractionDigits: 0,
      });
      if (parts.length > 1) {
        formattedDisplay += "," + parts[1];
      } else if (isCurrency && rawInput.endsWith(",")) {
        formattedDisplay += ",";
      }
      setDisplayValue(formattedDisplay);
    },
    [isCurrency]
  );

  return [cleanValueRef.current, displayValue, handleChange];
};

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
    {" "}
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>{" "}
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>{" "}
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
    {" "}
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>{" "}
    <circle cx="9" cy="7" r="4"></circle>{" "}
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>{" "}
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>{" "}
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
    {" "}
    <path d="M3 3v18h18"></path> <path d="m18 9-5 5-4-4-3 3"></path>{" "}
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
    {" "}
    <circle cx="11" cy="11" r="8"></circle>{" "}
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>{" "}
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
    {" "}
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>{" "}
    <circle cx="8.5" cy="7" r="4"></circle>{" "}
    <line x1="20" y1="8" x2="20" y2="14"></line>{" "}
    <line x1="17" y1="11" x2="23" y2="11"></line>{" "}
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
    {" "}
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>{" "}
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
    {" "}
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>{" "}
    <circle cx="12" cy="10" r="3"></circle>{" "}
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
    {" "}
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>{" "}
    <polyline points="16 17 21 12 16 7"></polyline>{" "}
    <line x1="21" y1="12" x2="9" y2="12"></line>{" "}
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
    {" "}
    <polyline points="15 18 9 12 15 6"></polyline>{" "}
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
    {" "}
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>{" "}
    <line x1="12" y1="8" x2="12" y2="16"></line>{" "}
    <line x1="8" y1="12" x2="16" y2="12"></line>{" "}
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
    {" "}
    <line x1="12" y1="1" x2="12" y2="23"></line>{" "}
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>{" "}
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
    {" "}
    <polyline points="3 6 5 6 21 6"></polyline>{" "}
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>{" "}
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
        if (data.isLoggedIn) setUser(data.user);
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
  if (authLoading)
    return <div className="loading-screen">Cargando aplicación...</div>;
  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="app-container">
        {user ? <Dashboard /> : <LoginPage />}
      </div>
    </AuthContext.Provider>
  );
}

// --- COMPONENTE #2: PÁGINA DE INICIO DE SESIÓN ---
const LoginPage = ({ onLogin }) => {
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

// --- COMPONENTE #3: PANEL PRINCIPAL ---
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [clientes, setClientes] = useState({ items: [], totalPages: 0 });
  const [clientesPage, setClientesPage] = useState(1);
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

  const fetchClientes = useCallback(async (page, searchQuery) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${API_URL}?action=clientes&page=${page}&limit=6`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Error al cargar clientes"
        );
      const data = await response.json();
      setClientes(data);
    } catch (err) {
      setError(err.message);
      setClientes({ items: [], totalPages: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "clientes") {
      setClientesPage(1);
    }
  }, [searchTerm, activeTab]);

  useEffect(() => {
    if (activeTab === "clientes") {
      const handler = setTimeout(() => {
        fetchClientes(clientesPage, searchTerm);
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [clientesPage, searchTerm, activeTab, fetchClientes]);

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
      fetchClientes(1, "");
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
      fetchClientes(clientesPage, searchTerm);
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
        onBack={() => {
          setSelectedCliente(null);
          fetchClientes(clientesPage, searchTerm);
        }}
      />
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
              {isLoading ? (
                <p>Cargando...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : (
                <>
                  <div className="clientes-grid">
                    {clientes.items.length > 0 ? (
                      clientes.items.map((c) => (
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
                  <PaginationControls
                    currentPage={clientesPage}
                    totalPages={clientes.totalPages}
                    onPageChange={setClientesPage}
                  />
                </>
              )}
            </div>
          </>
        )}
        {activeTab === "reportes" && <ReportesView />}
      </main>
    </div>
  );
};

// --- RESTO DE COMPONENTES DE LA APLICACIÓN ---

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }
  return (
    <div className="pagination-controls">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
};

const ItemInput = React.memo(
  ({ descripcion, cantidad, precio, index, handleItemChange }) => {
    const [cantidadValue, cantidadDisplayValue, handleCantidadChangeLocal] =
      useFormattedInput(cantidad);
    const [precioValue, precioDisplayValue, handlePrecioChangeLocal] =
      useFormattedInput(precio, true);

    useEffect(() => {
      if (String(cantidad) !== String(cantidadValue)) {
        handleItemChange(index, "cantidad", cantidadValue);
      }
    }, [cantidadValue, index, handleItemChange, cantidad]);

    useEffect(() => {
      if (String(precio) !== String(precioValue)) {
        handleItemChange(index, "precio", precioValue);
      }
    }, [precioValue, index, handleItemChange, precio]);

    return (
      <>
        <input
          type="text"
          placeholder="Descripción del Producto"
          value={descripcion}
          onChange={(e) =>
            handleItemChange(index, "descripcion", e.target.value)
          }
          required
          className="input-descripcion"
        />
        <input
          type="text"
          placeholder="Cant."
          value={cantidadDisplayValue}
          onChange={handleCantidadChangeLocal}
          required
          className="input-cantidad"
          inputMode="numeric"
        />
        <input
          type="text"
          placeholder="Precio Unitario"
          value={precioDisplayValue}
          onChange={handlePrecioChangeLocal}
          required
          className="input-precio"
          inputMode="decimal"
        />
      </>
    );
  }
);

const AddTransactionModal = ({
  type,
  clienteId,
  onSave,
  onClose,
  transactionToEdit = null,
}) => {
  const isVenta = type === "venta";
  const [fecha, setFecha] = useState(getTodayLocal());
  
  // Hook para el monto del abono (no se usa en la venta)
  const [montoValue, montoDisplayValue, handleMontoChange] = useFormattedInput(
    transactionToEdit && !isVenta ? transactionToEdit.monto : "",
    true
  );

  // Estado para los productos de la venta
  const [items, setItems] = useState([]);
  const [tipoPagoVenta, setTipoPagoVenta] = useState(
    transactionToEdit && isVenta && transactionToEdit.tipo_pago
      ? transactionToEdit.tipo_pago
      : "credito"
  );

  useEffect(() => {
    if (transactionToEdit) {
      setFecha(transactionToEdit.fecha.slice(0, 10));
    } else {
      setFecha(getTodayLocal());
    }

    if (isVenta) {
      if (transactionToEdit && transactionToEdit.detalles) {
        setItems(
          transactionToEdit.detalles.map((d) => ({
            id: d.id,
            descripcion: d.producto_descripcion,
            cantidad: parseFloat(d.cantidad) || 0,
            precio: parseFloat(d.precio_unitario) || 0,
          }))
        );
      } else {
        // Inicia con un item vacío si es una nueva venta
        setItems([
          { tempId: Date.now(), descripcion: "", cantidad: 1, precio: "" },
        ]);
      }
    }
  }, [transactionToEdit, isVenta]);

  const handleItemChange = useCallback((index, field, value) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const itemToUpdate = { ...newItems[index] };
      if (field === "cantidad" || field === "precio") {
        itemToUpdate[field] = Math.max(0, parseFloat(value) || 0);
      } else {
        itemToUpdate[field] = value;
      }
      newItems[index] = itemToUpdate;
      return newItems;
    });
  }, []);

  const handleAddItem = useCallback(() => {
    setItems((prevItems) => [
      ...prevItems,
      { tempId: Date.now(), descripcion: "", cantidad: 1, precio: "" },
    ]);
  }, []);

  const handleRemoveItem = useCallback((indexToRemove) => {
    setItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
  }, []);

  const ventaTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.cantidad) || 0) * (parseFloat(item.precio) || 0),
        0
      ),
    [items]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalTimestamp = fecha;
    if (transactionToEdit && transactionToEdit.fecha) {
        const newDatePart = fecha;
        const originalTimePart = transactionToEdit.fecha.slice(11);
        finalTimestamp = `${newDatePart} ${originalTimePart}`;
    }

    if (isVenta) {
      const validItems = items.filter(
        (item) =>
          item.descripcion.trim() !== "" &&
          parseFloat(item.cantidad) > 0 &&
          parseFloat(item.precio) >= 0
      );
      if (validItems.length === 0) {
        alert("Agrega al menos un producto con descripción, cantidad y precio válidos.");
        return;
      }
      const dataToSave = {
        cliente_id: clienteId,
        productos: validItems,
        tipo_pago: tipoPagoVenta,
        fecha: finalTimestamp,
      };
      if (transactionToEdit) {
        dataToSave.id = transactionToEdit.id;
      }
      onSave("venta", dataToSave);
    } else {
      if (isNaN(montoValue) || montoValue <= 0) {
        alert("Ingresa un monto válido.");
        return;
      }
      const dataToSave = {
        cliente_id: clienteId,
        monto: montoValue,
        fecha: finalTimestamp,
      };
      if (transactionToEdit) {
        dataToSave.id = transactionToEdit.id;
      }
      onSave("abono", dataToSave);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>
          {transactionToEdit
            ? `Editar ${isVenta ? "Venta" : "Abono"}`
            : isVenta
            ? "Registrar Venta"
            : "Registrar Abono"}
        </h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label
              htmlFor="transaction-date"
              style={{
                fontWeight: 500,
                color: "#495057",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Fecha
            </label>
            <input
              type="date"
              id="transaction-date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          {isVenta ? (
            <>
              <div className="tipo-pago-selector">
                <label>Tipo de Pago:</label>
                <div className="radio-group">
                  <input
                    type="radio"
                    id="credito"
                    name="tipo_pago"
                    value="credito"
                    checked={tipoPagoVenta === "credito"}
                    onChange={() => setTipoPagoVenta("credito")}
                  />
                  <label htmlFor="credito">Crédito</label>
                  <input
                    type="radio"
                    id="contado"
                    name="tipo_pago"
                    value="contado"
                    checked={tipoPagoVenta === "contado"}
                    onChange={() => setTipoPagoVenta("contado")}
                  />
                  <label htmlFor="contado">Contado</label>
                </div>
              </div>
              
              {/* Contenedor de productos con scroll */}
              <div className="venta-items-container">
                {items.map((item, index) => (
                  <div className="venta-item-row" key={item.id || item.tempId}>
                    <ItemInput
                      descripcion={item.descripcion}
                      cantidad={item.cantidad}
                      precio={item.precio}
                      index={index}
                      handleItemChange={handleItemChange}
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
              </div>

              {/* Botón para agregar más productos */}
              <button
                type="button"
                className="add-item-btn"
                onClick={handleAddItem}
              >
                + Agregar Producto
              </button>
            </>
          ) : (
            <input
              type="text"
              placeholder="Monto"
              value={montoDisplayValue}
              onChange={handleMontoChange}
              required
              className="input-monto"
              inputMode="decimal"
            />
          )}

          {/* SECCIÓN DE ACCIONES MODIFICADA */}
          <div className="modal-actions">
            {isVenta && (
              <div className="venta-total">
                <strong>Total: {formatCurrency(ventaTotal)}</strong>
              </div>
            )}
            <div className="modal-actions-buttons">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-submit">
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

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
    (sum, item) => sum + parseFloat(item.precio_total),
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
            <li className="venta-detail-header">
              <span>Producto</span>
              <span>Cant.</span>
              <span>P/U</span>
              <span>Total</span>
            </li>
            {detalles.map((item) => (
              <li key={item.id}>
                <span className="item-desc">{item.producto_descripcion}</span>
                <span data-label="Cant.">{item.cantidad}</span>
                <span data-label="P/U">
                  {formatCurrency(item.precio_unitario)}
                </span>
                <span data-label="Total">
                  {formatCurrency(item.precio_total)}
                </span>
              </li>
            ))}
            <li className="total-row">
              <strong>Total General:</strong>
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

const AbonoDetailModal = ({ details, onClose }) => {
  if (!details) {
    return null;
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Detalles del Abono</h2>
        <div className="abono-detail-content">
          <p className="abono-detail-date">
            <strong>Fecha:</strong> {formatDateTime(details.fecha)}
          </p>
          <ul className="abono-detail-list">
            <li>
              <span>Saldo Anterior</span>
              <span>{formatCurrency(details.saldo_anterior)}</span>
            </li>
            <li>
              <span>Monto del Abono</span>
              <span className="monto-abono">
                - {formatCurrency(details.monto_abono)}
              </span>
            </li>
            <li className="abono-total-row">
              <span>Saldo Nuevo</span>
              <span>{formatCurrency(details.saldo_nuevo)}</span>
            </li>
          </ul>
        </div>
        <div className="modal-actions">
          <button className="btn-submit" onClick={onClose}>
            Cerrar
          </button>
        </div>
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
  const [ventas, setVentas] = useState({ items: [], totalPages: 0 });
  const [abonos, setAbonos] = useState({ items: [], totalPages: 0 });
  const [ventasPage, setVentasPage] = useState(1);
  const [abonosPage, setAbonosPage] = useState(1);
  const [saldos, setSaldos] = useState({
    total_todas_ventas: 0,
    total_abonos: 0,
    saldo_pendiente: 0,
  });

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
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [abonoDetails, setAbonoDetails] = useState(null);

  const RPP = 5;

  const fetchTransacciones = useCallback(async () => {
    try {
      const [ventasRes, abonosRes] = await Promise.all([
        fetch(
          `${API_URL}?action=ventas&cliente_id=${cliente.id}&page=${ventasPage}&limit=${RPP}`,
          { credentials: "include" }
        ),
        fetch(
          `${API_URL}?action=abonos&cliente_id=${cliente.id}&page=${abonosPage}&limit=${RPP}`,
          { credentials: "include" }
        ),
      ]);
      const ventasData = await ventasRes.json();
      const abonosData = await abonosRes.json();
      setVentas(ventasData);
      setAbonos(abonosData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [cliente.id, ventasPage, abonosPage]);

  const fetchSaldos = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}?action=get_cliente_saldos&cliente_id=${cliente.id}`,
        { credentials: "include" }
      );
      const data = await response.json();
      setSaldos(data);
    } catch (error) {
      console.error("Error fetching saldos:", error);
    }
  }, [cliente.id]);

  useEffect(() => {
    fetchSaldos();
  }, [fetchSaldos]);

  useEffect(() => {
    fetchTransacciones();
  }, [fetchTransacciones]);

  const handleEditVenta = async (venta) => {
    try {
      const response = await fetch(
        `${API_URL}?action=venta_detalle&venta_id=${venta.id}`,
        { credentials: "include" }
      );
      if (!response.ok)
        throw new Error(
          "No se pudieron cargar los detalles de la venta para edición."
        );
      const detalles = await response.json();
      setEditingTransaction({ ...venta, detalles, type: "venta" });
      setTransactionModal({ isOpen: true, type: "venta" });
    } catch (error) {
      alert(error.message);
      console.error("Error al cargar detalles de venta para edición:", error);
    }
  };

  const handleEditAbono = (abono) => {
    setEditingTransaction({ ...abono, type: "abono" });
    setTransactionModal({ isOpen: true, type: "abono" });
  };

  const handleViewAbonoDetails = async (abonoId) => {
    try {
      const response = await fetch(
        `${API_URL}?action=get_abono_detalle&id=${abonoId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.message || "Error al cargar los detalles del abono."
        );
      }
      const data = await response.json();
      setAbonoDetails(data);
    } catch (error) {
      alert(error.message);
      console.error("Error fetching abono details:", error);
    }
  };

  const handleSaveTransaction = async (type, data) => {
    let method = "POST";
    let action = `${type}s`;

    if (editingTransaction) {
      method = "PUT";
      data.id = editingTransaction.id;
    }

    try {
      const response = await fetch(`${API_URL}?action=${action}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) throw new Error((await response.json()).message);

      if (type === "venta") setVentasPage(1);
      if (type === "abono") setAbonosPage(1);

      await fetchTransacciones();
      await fetchSaldos();

      setTransactionModal({ isOpen: false, type: null });
      setEditingTransaction(null);
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
      await fetchTransacciones();
      await fetchSaldos();
    } catch (error) {
      alert(error.message);
    } finally {
      setConfirmModal({ isOpen: false, type: null, id: null });
    }
  };

  return (
    <div className="detail-view">
      {transactionModal.isOpen && (
        <AddTransactionModal
          type={transactionModal.type}
          clienteId={cliente.id}
          onSave={handleSaveTransaction}
          onClose={() => {
            setTransactionModal({ isOpen: false, type: null });
            setEditingTransaction(null);
          }}
          transactionToEdit={editingTransaction}
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
      {abonoDetails && (
        <AbonoDetailModal
          details={abonoDetails}
          onClose={() => setAbonoDetails(null)}
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
          <h4>Total Ventas (Todas)</h4>
          <p>{formatCurrency(saldos.total_todas_ventas)}</p>
        </div>
        <div className="summary-card abonos">
          <h4>Total Abonos</h4>
          <p>{formatCurrency(saldos.total_abonos)}</p>
        </div>
        <div className="summary-card saldo">
          <h4>Saldo Pendiente</h4>
          <p>{formatCurrency(saldos.saldo_pendiente)}</p>
        </div>
      </div>
      <div className="detail-actions">
        <button
          className="action-btn green"
          onClick={() => {
            setEditingTransaction(null);
            setTransactionModal({ isOpen: true, type: "abono" });
          }}
        >
          <PlusSquareIcon /> Registrar Abono
        </button>
        <button
          className="action-btn red"
          onClick={() => {
            setEditingTransaction(null);
            setTransactionModal({ isOpen: true, type: "venta" });
          }}
        >
          <DollarIcon /> Registrar Venta
        </button>
      </div>

      <div className="history-columns">
        <div className="history-column">
          <h3>Historial de Ventas</h3>
          <ul>
            {ventas.items && ventas.items.length > 0 ? (
              ventas.items.map((venta) => (
                <li
                  key={venta.id}
                  className="clickable-row"
                  onClick={() => setViewingVentaId(venta.id)}
                >
                  <div className="item-info">
                    <span>
                      Venta - {formatDateTime(venta.fecha)} (
                      {venta.tipo_pago === "credito" ? "Crédito" : "Contado"})
                    </span>
                    <small></small>
                  </div>
                  {/* --- CÓDIGO RESTAURADO: Botones de acción --- */}
                  <div className="item-action">
                    <span className="monto-venta">
                      {formatCurrency(venta.monto_total)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditVenta(venta);
                      }}
                      className="edit-item-btn"
                      title="Editar Venta"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick("venta", venta.id);
                      }}
                      className="delete-item-btn"
                      title="Eliminar Venta"
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
          <PaginationControls
            currentPage={ventasPage}
            totalPages={ventas.totalPages}
            onPageChange={setVentasPage}
          />
        </div>
        <div className="history-column">
          <h3>Historial de Abonos</h3>
          <ul>
            {abonos.items && abonos.items.length > 0 ? (
              abonos.items.map((abono) => (
                <li
                  key={abono.id}
                  className="clickable-row"
                  onClick={() => handleViewAbonoDetails(abono.id)}
                >
                  <div className="item-info">
                    <span>Abono - {formatDateTime(abono.fecha)}</span>
                    <small></small>
                  </div>
                  {/* --- CÓDIGO RESTAURADO: Botones de acción --- */}
                  <div className="item-action">
                    <span className="monto-abono">
                      {formatCurrency(abono.monto)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAbono(abono);
                      }}
                      className="edit-item-btn"
                      title="Editar Abono"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick("abono", abono.id);
                      }}
                      className="delete-item-btn"
                      title="Eliminar Abono"
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
          <PaginationControls
            currentPage={abonosPage}
            totalPages={abonos.totalPages}
            onPageChange={setAbonosPage}
          />
        </div>
      </div>
    </div>
  );
};

const ReportesView = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayLocal());
  const [reportData, setReportData] = useState({ ventas: [], abonos: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingVentaId, setViewingVentaId] = useState(null);
  const [abonoDetails, setAbonoDetails] = useState(null);

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

  const handleViewAbonoDetails = async (abonoId) => {
    try {
      const response = await fetch(
        `${API_URL}?action=get_abono_detalle&id=${abonoId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.message || "Error al cargar los detalles del abono."
        );
      }
      const data = await response.json();
      setAbonoDetails(data);
    } catch (error) {
      alert(error.message);
      console.error("Error fetching abono details:", error);
    }
  };

  // --- MODIFICADO: Cálculo de totales del reporte ---
  const totalVentasCreditoReporte = reportData.ventas.reduce(
    (sum, v) =>
      v.tipo_pago === "credito" ? sum + parseFloat(v.monto_total) : sum,
    0
  );
  const totalVentasContadoReporte = reportData.ventas.reduce(
    (sum, v) =>
      v.tipo_pago === "contado" ? sum + parseFloat(v.monto_total) : sum,
    0
  );
  const totalAbonosReporte = reportData.abonos.reduce(
    (sum, a) => sum + parseFloat(a.monto),
    0
  );
  const totalIngresosDelDia = totalVentasContadoReporte + totalAbonosReporte;

  return (
    <div className="report-view">
      {viewingVentaId && (
        <VentaDetailModal
          ventaId={viewingVentaId}
          onClose={() => setViewingVentaId(null)}
        />
      )}
      {abonoDetails && (
        <AbonoDetailModal
          details={abonoDetails}
          onClose={() => setAbonoDetails(null)}
        />
      )}

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
          {/* --- MODIFICADO: Tarjetas de resumen actualizadas --- */}
          <div className="summary-cards">
            <div className="summary-card ventas">
              <h4>Ventas a Crédito</h4>
              <p>{formatCurrency(totalVentasCreditoReporte)}</p>
            </div>
            <div className="summary-card abonos">
              <h4>Ventas de Contado</h4>
              <p>{formatCurrency(totalVentasContadoReporte)}</p>
            </div>
            <div className="summary-card saldo">
              <h4>Total Abonos</h4>
              <p>{formatCurrency(totalAbonosReporte)}</p>
            </div>
            <div className="summary-card total-reporte">
              <h4>Total Ingresos del Día</h4>
              <p>{formatCurrency(totalIngresosDelDia)}</p>
            </div>
          </div>
          <div className="history-columns">
            <div className="history-column">
              <h3>Ventas del Día</h3>
              <ul>
                {reportData.ventas.length > 0 ? (
                  reportData.ventas.map((v) => (
                    <li
                      key={`v-${v.id}`}
                      onClick={() => setViewingVentaId(v.id)}
                      className="clickable-row"
                    >
                      <div className="item-info">
                        <span>
                          Venta - {formatDateTime(v.fecha)} (
                          {v.tipo_pago === "credito" ? "Crédito" : "Contado"})
                        </span>
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
                    <li
                      key={`a-${a.id}`}
                      className="clickable-row"
                      onClick={() => handleViewAbonoDetails(a.id)}
                    >
                      <div className="item-info">
                        <span>Abono - {formatDateTime(a.fecha)}</span>
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
