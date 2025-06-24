<?php
// Muestra errores solo para depuración. En producción, esto debería estar en 0.
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Inicia la sesión de forma segura
session_start([
    'cookie_lifetime' => 86400, // 24 horas
    'cookie_secure' => true,    // Solo enviar cookie por HTTPS
    'cookie_httponly' => true,  // No accesible por JavaScript
    'cookie_samesite' => 'None' // Necesario para CORS
]);

// --- SECCIÓN DE ENCABEZADOS ---
$allowed_origins = [
    "http://localhost:3000",
    "https://rustiko.mangodigitalcr.com"
];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
date_default_timezone_set('America/Costa_Rica');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

// --- Conexión a la Base de Datos ---
$hostname = "mysql.mangodigitalcr.com";
$database = "rustiko";
$username_db = "mangodigital";
$password_db = "MangoDigitalCR2025";
try {
    $conn = new PDO("mysql:host=$hostname;dbname=$database;charset=utf8", $username_db, $password_db);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) { http_response_code(503); echo json_encode(["message" => "Error de conexión."]); exit(); }


// --- DECLARACIÓN DE TODAS LAS FUNCIONES DE LA API ---

function login($db, $data) {
    if (empty($data['username']) || empty($data['password'])) { http_response_code(400); echo json_encode(['message' => 'Usuario y contraseña son requeridos.']); return; }
    $stmt = $db->prepare("SELECT id, username, password_hash FROM usuarios WHERE username = :username");
    $stmt->execute([':username' => $data['username']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user && password_verify($data['password'], $user['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_username'] = $user['username'];
        http_response_code(200);
        echo json_encode(['username' => $user['username']]);
    } else {
        http_response_code(401); echo json_encode(['message' => 'Usuario o contraseña incorrectos.']);
    }
}
function logout() { session_unset(); session_destroy(); http_response_code(200); echo json_encode(['message' => 'Sesión cerrada.']); }
function check_session() {
    if (isset($_SESSION['user_id']) && isset($_SESSION['user_username'])) {
        http_response_code(200); echo json_encode(['isLoggedIn' => true, 'user' => ['username' => $_SESSION['user_username']]]);
    } else {
        http_response_code(200); echo json_encode(['isLoggedIn' => false]);
    }
}
function getClientes($db, $searchTerm = null) {
    if ($searchTerm && trim($searchTerm) !== '') {
        $stmt = $db->prepare("SELECT id, nombre_completo, telefono, direccion FROM clientes WHERE nombre_completo LIKE :searchTerm OR telefono LIKE :searchTerm ORDER BY nombre_completo ASC");
        $stmt->execute([':searchTerm' => '%' . $searchTerm . '%']);
    } else {
        $stmt = $db->prepare("SELECT id, nombre_completo, telefono, direccion FROM clientes ORDER BY nombre_completo ASC");
        $stmt->execute();
    }
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
function addCliente($db, $data) {
    if (empty($data['nombre_completo'])||empty($data['telefono'])) { http_response_code(400); echo json_encode(["message" => "Nombre y teléfono requeridos."]); return; }
    $stmt = $db->prepare("INSERT INTO clientes (nombre_completo, telefono, direccion) VALUES (:n, :t, :d)");
    $stmt->execute([':n' => $data['nombre_completo'], ':t' => $data['telefono'], ':d' => $data['direccion'] ?? '']);
    http_response_code(201); echo json_encode(["message" => "Cliente creado.", "id" => $db->lastInsertId()]);
}
function updateCliente($db, $data) {
    if (empty($data['id'])||empty($data['nombre_completo'])||empty($data['telefono'])) { http_response_code(400); echo json_encode(["message" => "ID, Nombre y teléfono requeridos."]); return; }
    $stmt = $db->prepare("UPDATE clientes SET nombre_completo = :n, telefono = :t, direccion = :d WHERE id = :id");
    $stmt->execute([':id' => $data['id'], ':n' => $data['nombre_completo'], ':t' => $data['telefono'], ':d' => $data['direccion'] ?? '']);
    if ($stmt->rowCount()>0) { http_response_code(200); echo json_encode(["message" => "Cliente actualizado."]); }
    else { http_response_code(404); echo json_encode(["message" => "Cliente no encontrado o datos idénticos."]); }
}
function deleteCliente($db, $id) {
    if (empty($id)) { http_response_code(400); echo json_encode(["message" => "ID de cliente requerido."]); return; }
    $stmt = $db->prepare("DELETE FROM clientes WHERE id = :id");
    $stmt->execute([':id' => $id]);
    if ($stmt->rowCount()>0) { http_response_code(200); echo json_encode(["message" => "Cliente eliminado."]); }
    else { http_response_code(404); echo json_encode(["message" => "Cliente no encontrado."]); }
}
function getTransacciones($db, $tabla, $cid) {
    if(!$cid){ http_response_code(400); echo json_encode([]); return; }
    $sql = ($tabla==='ventas') ? "SELECT id, monto_total, descripcion, fecha, tipo_pago FROM ventas WHERE cliente_id = :cid ORDER BY fecha DESC" : "SELECT id, monto, fecha FROM abonos WHERE cliente_id = :cid ORDER BY fecha DESC";
    $stmt = $db->prepare($sql); $stmt->execute([':cid' => $cid]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function addVenta($db, $data) {
    if (empty($data['cliente_id']) || empty($data['productos']) || !is_array($data['productos']) || empty($data['fecha'])) { http_response_code(400); echo json_encode(["message" => "Datos de venta incompletos (requiere cliente, productos y fecha)."]); return; }
    $monto_total_general = 0;
    foreach ($data['productos'] as $producto) {
        if (!isset($producto['precio']) || !is_numeric($producto['precio']) || !isset($producto['cantidad']) || !is_numeric($producto['cantidad'])) {
             http_response_code(400); echo json_encode(["message" => "Cada producto debe tener cantidad y precio válidos."]); return;
        }
        $monto_total_general += (floatval($producto['cantidad']) * floatval($producto['precio']));
    }
    $descripcion_general = count($data['productos']) > 0 ? $data['productos'][0]['descripcion'] : 'Venta de varios productos';
    $tipo_pago = isset($data['tipo_pago']) && in_array($data['tipo_pago'], ['credito', 'contado']) ? $data['tipo_pago'] : 'credito';
    $fecha = $data['fecha'] . ' ' . date('H:i:s');

    $db->beginTransaction();
    try {
        $stmtVenta = $db->prepare("INSERT INTO ventas (cliente_id, monto_total, descripcion, tipo_pago, fecha) VALUES (:cid, :mt, :d, :tp, :f)");
        $stmtVenta->execute([':cid' => $data['cliente_id'], ':mt' => $monto_total_general, ':d' => $descripcion_general, ':tp' => $tipo_pago, ':f' => $fecha]);
        $venta_id = $db->lastInsertId();
        $stmtDetalle = $db->prepare("INSERT INTO venta_detalles (venta_id, producto_descripcion, cantidad, precio_unitario, precio_total) VALUES (:vid, :pd, :cant, :pu, :pt)");
        foreach ($data['productos'] as $producto) {
            $precio_unitario = floatval($producto['precio']);
            $cantidad = intval($producto['cantidad']);
            $precio_total_linea = $cantidad * $precio_unitario;
            $stmtDetalle->execute([':vid' => $venta_id, ':pd' => $producto['descripcion'], ':cant' => $cantidad, ':pu' => $precio_unitario, ':pt' => $precio_total_linea]);
        }
        $db->commit();
        http_response_code(201); echo json_encode(["message" => "Venta agregada exitosamente."]);
    } catch(Exception $e) { $db->rollBack(); http_response_code(500); echo json_encode(["message" => "Error al agregar la venta: " . $e->getMessage()]); }
}

function updateVenta($db, $data) {
    if (empty($data['id']) || empty($data['cliente_id']) || empty($data['productos']) || !is_array($data['productos']) || empty($data['fecha'])) {
        http_response_code(400);
        echo json_encode(["message" => "Datos de venta incompletos para actualizar (requiere id, cliente, productos y fecha)."]);
        return;
    }
    $venta_id = $data['id'];
    $cliente_id = $data['cliente_id'];
    $fecha = $data['fecha'];
    $monto_total_general = 0;
    foreach ($data['productos'] as $producto) {
        if (!isset($producto['precio']) || !is_numeric($producto['precio']) || !isset($producto['cantidad']) || !is_numeric($producto['cantidad'])) {
            http_response_code(400);
            echo json_encode(["message" => "Cada producto debe tener cantidad y precio válidos para la actualización."]);
            return;
        }
        $monto_total_general += (floatval($producto['cantidad']) * floatval($producto['precio']));
    }
    $descripcion_general = count($data['productos']) > 0 ? $data['productos'][0]['descripcion'] : 'Venta actualizada';
    $tipo_pago = isset($data['tipo_pago']) && in_array($data['tipo_pago'], ['credito', 'contado']) ? $data['tipo_pago'] : 'credito';
    $db->beginTransaction();
    try {
        $stmtCheck = $db->prepare("SELECT id FROM ventas WHERE id = :id AND cliente_id = :cliente_id");
        $stmtCheck->execute([':id' => $venta_id, ':cliente_id' => $cliente_id]);
        if (!$stmtCheck->fetch()) {
            $db->rollBack();
            http_response_code(404);
            echo json_encode(["message" => "Venta no encontrada o no pertenece a este cliente."]);
            return;
        }
        $stmtDeleteDetails = $db->prepare("DELETE FROM venta_detalles WHERE venta_id = :venta_id");
        $stmtDeleteDetails->execute([':venta_id' => $venta_id]);
        $stmtInsertDetail = $db->prepare("INSERT INTO venta_detalles (venta_id, producto_descripcion, cantidad, precio_unitario, precio_total) VALUES (:vid, :pd, :cant, :pu, :pt)");
        foreach ($data['productos'] as $producto) {
            $precio_unitario = floatval($producto['precio']);
            $cantidad = intval($producto['cantidad']);
            $precio_total_linea = $cantidad * $precio_unitario;
            $stmtInsertDetail->execute([':vid' => $venta_id, ':pd' => $producto['descripcion'], ':cant' => $cantidad, ':pu' => $precio_unitario, ':pt' => $precio_total_linea]);
        }
        $stmtUpdateVenta = $db->prepare("UPDATE ventas SET monto_total = :mt, descripcion = :d, tipo_pago = :tp, fecha = :f WHERE id = :id");
        $stmtUpdateVenta->execute([':mt' => $monto_total_general, ':d' => $descripcion_general, ':tp' => $tipo_pago, ':f' => $fecha, ':id' => $venta_id]);
        $db->commit();
        http_response_code(200);
        echo json_encode(["message" => "Venta actualizada exitosamente."]);
    } catch(Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(["message" => "Error al actualizar la venta: " . $e->getMessage()]);
    }
}

function getVentaDetalles($db, $venta_id) {
    if (empty($venta_id)) { http_response_code(400); echo json_encode(["message" => "ID de venta requerido."]); return; }
    $stmt = $db->prepare("SELECT id, producto_descripcion, cantidad, precio_unitario, precio_total FROM venta_detalles WHERE venta_id = :venta_id");
    $stmt->execute([':venta_id' => $venta_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function addAbono($db, $data) {
    if (empty($data['cliente_id']) || !isset($data['monto']) || empty($data['fecha'])) { http_response_code(400); echo json_encode(["message" => "Datos de abono incompletos (requiere cliente, monto y fecha)."]); return; }
    $fecha = $data['fecha'] . ' ' . date('H:i:s');
    $stmt = $db->prepare("INSERT INTO abonos (cliente_id, monto, fecha) VALUES (:cid, :m, :f)");
    $stmt->execute([':cid' => $data['cliente_id'], ':m' => $data['monto'], ':f' => $fecha]);
    http_response_code(201); echo json_encode(["message" => "Abono agregado."]);
}

function updateAbono($db, $data) {
    if (empty($data['id']) || empty($data['cliente_id']) || !isset($data['monto']) || !is_numeric($data['monto']) || empty($data['fecha'])) {
        http_response_code(400);
        echo json_encode(["message" => "Datos de abono incompletos o inválidos para actualizar."]);
        return;
    }
    $abono_id = $data['id'];
    $cliente_id = $data['cliente_id'];
    $monto = floatval($data['monto']);
    $fecha = $data['fecha'];
    try {
        $stmtCheck = $db->prepare("SELECT id FROM abonos WHERE id = :id AND cliente_id = :cliente_id");
        $stmtCheck->execute([':id' => $abono_id, ':cliente_id' => $cliente_id]);
        if (!$stmtCheck->fetch()) {
            http_response_code(404);
            echo json_encode(["message" => "Abono no encontrado o no pertenece a este cliente."]);
            return;
        }
        $stmtUpdate = $db->prepare("UPDATE abonos SET monto = :monto, fecha = :fecha WHERE id = :id");
        $stmtUpdate->execute([':monto' => $monto, ':fecha' => $fecha, ':id' => $abono_id]);
        if ($stmtUpdate->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Abono actualizado exitosamente."]);
        } else {
            http_response_code(200); echo json_encode(["message" => "Abono no encontrado o datos idénticos."]);
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error al actualizar el abono: " . $e->getMessage()]);
    }
}

// --- NUEVA FUNCIÓN: getAbonoDetalle ---
function getAbonoDetalle($db, $abono_id) {
    if (empty($abono_id)) {
        http_response_code(400);
        echo json_encode(["message" => "ID de abono requerido."]);
        return;
    }

    try {
        // 1. Obtener la información del abono principal
        $stmtAbono = $db->prepare("SELECT cliente_id, monto, fecha FROM abonos WHERE id = :id");
        $stmtAbono->execute([':id' => $abono_id]);
        $abono = $stmtAbono->fetch(PDO::FETCH_ASSOC);

        if (!$abono) {
            http_response_code(404);
            echo json_encode(["message" => "Abono no encontrado."]);
            return;
        }

        $cliente_id = $abono['cliente_id'];
        $fecha_abono = $abono['fecha'];
        $monto_abono = $abono['monto'];

        // 2. Calcular el total de ventas a crédito ANTES de este abono
        $stmtVentas = $db->prepare(
            "SELECT IFNULL(SUM(monto_total), 0) as total_ventas 
             FROM ventas 
             WHERE cliente_id = :cid AND tipo_pago = 'credito' AND fecha < :fecha"
        );
        $stmtVentas->execute([':cid' => $cliente_id, ':fecha' => $fecha_abono]);
        $total_ventas_anteriores = $stmtVentas->fetchColumn();

        // 3. Calcular el total de otros abonos ANTES de este abono
        $stmtOtrosAbonos = $db->prepare(
            "SELECT IFNULL(SUM(monto), 0) as total_abonos 
             FROM abonos 
             WHERE cliente_id = :cid AND id != :aid AND fecha < :fecha"
        );
        $stmtOtrosAbonos->execute([':cid' => $cliente_id, ':aid' => $abono_id, ':fecha' => $fecha_abono]);
        $total_abonos_anteriores = $stmtOtrosAbonos->fetchColumn();

        // 4. Calcular saldos
        $saldo_anterior = floatval($total_ventas_anteriores) - floatval($total_abonos_anteriores);
        $saldo_nuevo = $saldo_anterior - floatval($monto_abono);

        // 5. Devolver el resultado
        $response = [
            'fecha' => $fecha_abono,
            'monto_abono' => floatval($monto_abono),
            'saldo_anterior' => $saldo_anterior,
            'saldo_nuevo' => $saldo_nuevo
        ];

        http_response_code(200);
        echo json_encode($response);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error al obtener detalles del abono: " . $e->getMessage()]);
    }
}


function deleteTransaccion($db, $tabla, $id) {
    if (empty($id)) { http_response_code(400); echo json_encode(["message" => "ID requerido."]); return; }
    $stmt = $db->prepare("DELETE FROM {$tabla} WHERE id = :id"); $stmt->execute([':id' => $id]);
    if ($stmt->rowCount() > 0) {
        http_response_code(200); echo json_encode(["message" => "Registro eliminado."]);
    } else {
        http_response_code(404); echo json_encode(["message" => "Registro no encontrado."]);
    }
}

function getReportePorFecha($db, $date) {
    $stmtVentas = $db->prepare("SELECT v.id, v.monto_total, v.descripcion, v.fecha, v.tipo_pago, c.nombre_completo FROM ventas v JOIN clientes c ON v.cliente_id = c.id WHERE DATE(v.fecha) = :date ORDER BY v.fecha DESC");
    $stmtVentas->execute([':date' => $date]);
    $stmtAbonos = $db->prepare("SELECT a.id, a.monto, a.fecha, c.nombre_completo FROM abonos a JOIN clientes c ON a.cliente_id = c.id WHERE DATE(a.fecha) = :date ORDER BY a.fecha DESC");
    $stmtAbonos->execute([':date' => $date]);
    echo json_encode(['ventas' => $stmtVentas->fetchAll(PDO::FETCH_ASSOC), 'abonos' => $stmtAbonos->fetchAll(PDO::FETCH_ASSOC)]);
}

// --- PUNTO DE ENTRADA Y ENRUTADOR PRINCIPAL ---
$action = isset($_GET['action']) ? $_GET['action'] : null;
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($action === 'login') { login($conn, $input); exit(); }
if ($action === 'logout') { logout(); exit(); }
if ($action === 'check_session') { check_session(); exit(); }

if (!isset($_SESSION['user_id'])) {
    http_response_code(401); echo json_encode(["message" => "Acceso no autorizado."]); exit();
}

switch ($action) {
    case 'clientes':
        if ($method === 'GET') { getClientes($conn, isset($_GET['search']) ? $_GET['search'] : null); }
        elseif ($method === 'POST') { addCliente($conn, $input); }
        elseif ($method === 'PUT') { updateCliente($conn, $input); }
        elseif ($method === 'DELETE') { deleteCliente($conn, isset($_GET['id']) ? $_GET['id'] : null); }
        break;
    case 'reportes':
        if ($method === 'GET') { getReportePorFecha($conn, isset($_GET['date']) ? $_GET['date'] : date('Y-m-d')); }
        break;
    case 'venta_detalle':
        if ($method === 'GET') { getVentaDetalles($conn, isset($_GET['venta_id']) ? $_GET['venta_id'] : null); }
        break;
    // --- NUEVO: Case para el detalle del abono ---
    case 'get_abono_detalle':
        if ($method === 'GET') { getAbonoDetalle($conn, isset($_GET['id']) ? $_GET['id'] : null); }
        break;
    case 'ventas':
        if ($method == 'GET') { getTransacciones($conn, 'ventas', isset($_GET['cliente_id']) ? $_GET['cliente_id'] : null); }
        elseif ($method == 'POST') { addVenta($conn, $input); }
        elseif ($method == 'PUT') { updateVenta($conn, $input); }
        elseif ($method == 'DELETE') { deleteTransaccion($conn, 'ventas', isset($_GET['id']) ? $_GET['id'] : null); }
        break;
    case 'abonos':
        if ($method == 'GET') { getTransacciones($conn, 'abonos', isset($_GET['cliente_id']) ? $_GET['cliente_id'] : null); }
        elseif ($method == 'POST') { addAbono($conn, $input); }
        elseif ($method == 'PUT') { updateAbono($conn, $input); }
        elseif ($method == 'DELETE') { deleteTransaccion($conn, 'abonos', isset($_GET['id']) ? $_GET['id'] : null); }
        break;
    default:
        http_response_code(404); echo json_encode(["message" => "Acción no válida."]); break;
}

$conn = null;
?>