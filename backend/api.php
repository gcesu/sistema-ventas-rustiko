<?php
// ===== Encabezados (CORS y Anti-Caché) =====
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ===== Parámetros de Conexión =====
$hostname = "mysql.mangodigitalcr.com";
$database = "rustiko";
$username = "mangodigital";
$password = "MangoDigitalCR2025";

// ===== Conexión a la Base de Datos =====
try {
    $conn = new PDO("mysql:host=$hostname;dbname=$database;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(503);
    echo json_encode(["message" => "Error de conexión a la base de datos.", "error" => $e->getMessage()]);
    exit();
}

// ===== Enrutador de Acciones =====
$action = isset($_GET['action']) ? $_GET['action'] : null;
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Esta simulación ya no es la vía principal, pero se deja por si se usa en otro lado.
if ($method === 'POST' && isset($input['_method'])) {
    $method = strtoupper($input['_method']);
}

switch ($action) {
    case 'clientes':
        if ($method === 'GET') {
            getClientes($conn);
        } elseif ($method === 'POST') {
            addCliente($conn, $input);
        } elseif ($method === 'PUT') {
            updateCliente($conn, $input);
        } elseif ($method === 'DELETE') {
            // El ID ahora viene de la URL (Query String)
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            deleteCliente($conn, $id);
        }
        break;

    case 'ventas':
        $cliente_id = isset($_GET['cliente_id']) ? $_GET['cliente_id'] : null;
        if ($method == 'GET' && $cliente_id) { getTransacciones($conn, 'ventas', $cliente_id); }
        elseif ($method == 'POST') { addVenta($conn, $input); }
        elseif ($method == 'DELETE') { $id = isset($_GET['id']) ? $_GET['id'] : null; deleteTransaccion($conn, 'ventas', $id); }
        break;

    case 'abonos':
        $cliente_id = isset($_GET['cliente_id']) ? $_GET['cliente_id'] : null;
        if ($method == 'GET' && $cliente_id) { getTransacciones($conn, 'abonos', $cliente_id); }
        elseif ($method == 'POST') { addAbono($conn, $input); }
        elseif ($method == 'DELETE') { $id = isset($_GET['id']) ? $_GET['id'] : null; deleteTransaccion($conn, 'abonos', $id); }
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Acción no válida o no encontrada."]);
        break;
}

// ===== Funciones para Clientes =====
function getClientes($db) {
    try {
        $stmt = $db->prepare("SELECT id, nombre_completo, telefono, direccion FROM clientes ORDER BY nombre_completo ASC");
        $stmt->execute();
        $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($clientes);
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error al obtener clientes: " . $e->getMessage()]);
    }
}

function addCliente($db, $data) {
    if (empty($data['nombre_completo']) || empty($data['telefono'])) {
        http_response_code(400); echo json_encode(["message" => "Nombre y teléfono son obligatorios."]); return;
    }
    try {
        $sql = "INSERT INTO clientes (nombre_completo, telefono, direccion) VALUES (:nombre, :telefono, :direccion)";
        $stmt = $db->prepare($sql);
        $stmt->execute([':nombre' => $data['nombre_completo'], ':telefono' => $data['telefono'], ':direccion' => isset($data['direccion']) ? $data['direccion'] : '']);
        http_response_code(201); echo json_encode(["message" => "Cliente creado exitosamente.", "id" => $db->lastInsertId()]);
    } catch(Exception $e) {
        http_response_code(500); echo json_encode(["message" => "Error al crear cliente: " . $e->getMessage()]);
    }
}

/**
 * --- FUNCIÓN MODIFICADA ---
 * Ahora comprueba si realmente se actualizó una fila.
 */
function updateCliente($db, $data) {
    if (empty($data) || !is_array($data)) {
        http_response_code(400);
        echo json_encode(["message" => "Datos inválidos."]);
        return;
    }
    $id = isset($data['id']) ? (int)$data['id'] : null;
    if (empty($id) || empty($data['nombre_completo']) || empty($data['telefono'])) {
        http_response_code(400);
        echo json_encode(["message" => "ID, Nombre y teléfono son obligatorios para actualizar."]);
        return;
    }
    try {
        $sql = "UPDATE clientes SET nombre_completo = :nombre, telefono = :telefono, direccion = :direccion WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':nombre' => $data['nombre_completo'],
            ':telefono' => $data['telefono'],
            ':direccion' => isset($data['direccion']) ? $data['direccion'] : ''
        ]);

        // VERIFICACIÓN: Comprobar si alguna fila fue afectada.
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Cliente actualizado exitosamente."]);
        } else {
            http_response_code(404); // 404 Not Found
            echo json_encode(["message" => "No se encontró el cliente para actualizar o los datos enviados eran idénticos."]);
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error al actualizar cliente: " . $e->getMessage()]);
    }
}

/**
 * --- FUNCIÓN MODIFICADA ---
 * Ahora comprueba si realmente se eliminó una fila.
 */
function deleteCliente($db, $id) {
    $id = (int)$id;
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(["message" => "Se requiere el ID del cliente para eliminar."]);
        return;
    }
    try {
        $sql = "DELETE FROM clientes WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':id' => $id]);
        
        // VERIFICACIÓN: Comprobar si alguna fila fue afectada.
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Cliente eliminado exitosamente."]);
        } else {
            http_response_code(404); // 404 Not Found
            echo json_encode(["message" => "No se encontró el cliente a eliminar."]);
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error al eliminar cliente: " . $e->getMessage()]);
    }
}

// ===== Funciones para Ventas y Abonos (sin cambios) =====
function getTransacciones($db, $tabla, $cliente_id) { try { $sql = "SELECT id, monto, descripcion, fecha FROM {$tabla} WHERE cliente_id = :cliente_id ORDER BY fecha DESC"; if ($tabla === 'abonos') { $sql = "SELECT id, monto, fecha FROM {$tabla} WHERE cliente_id = :cliente_id ORDER BY fecha DESC"; } $stmt = $db->prepare($sql); $stmt->execute([':cliente_id' => $cliente_id]); $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC); echo json_encode($resultados); } catch(Exception $e) { http_response_code(500); echo json_encode(["message" => "Error al obtener de la tabla {$tabla}: " . $e->getMessage()]); } }
function addVenta($db, $data) { if (empty($data['cliente_id']) || !isset($data['monto']) || empty($data['descripcion'])) { http_response_code(400); echo json_encode(["message" => "Datos de venta incompletos."]); return; } try { $sql = "INSERT INTO ventas (cliente_id, monto, descripcion) VALUES (:cliente_id, :monto, :descripcion)"; $stmt = $db->prepare($sql); $stmt->execute([':cliente_id' => $data['cliente_id'], ':monto' => $data['monto'], ':descripcion' => $data['descripcion']]); http_response_code(201); echo json_encode(["message" => "Venta agregada."]); } catch(Exception $e) { http_response_code(500); echo json_encode(["message" => "Error al agregar venta: " . $e->getMessage()]); } }
function addAbono($db, $data) { if (empty($data['cliente_id']) || !isset($data['monto'])) { http_response_code(400); echo json_encode(["message" => "Datos de abono incompletos."]); return; } try { $sql = "INSERT INTO abonos (cliente_id, monto) VALUES (:cliente_id, :monto)"; $stmt = $db->prepare($sql); $stmt->execute([':cliente_id' => $data['cliente_id'], ':monto' => $data['monto']]); http_response_code(201); echo json_encode(["message" => "Abono agregado."]); } catch(Exception $e) { http_response_code(500); echo json_encode(["message" => "Error al agregar abono: " . $e->getMessage()]); } }
function deleteTransaccion($db, $tabla, $id) { if (empty($id)) { http_response_code(400); echo json_encode(["message" => "Se requiere ID para eliminar."]); return; } try { $sql = "DELETE FROM {$tabla} WHERE id = :id"; $stmt = $db->prepare($sql); $stmt->execute([':id' => $id]); http_response_code(200); echo json_encode(["message" => "Registro eliminado de {$tabla}."]); } catch(Exception $e) { http_response_code(500); echo json_encode(["message" => "Error al eliminar de {$tabla}: " . $e->getMessage()]); } }

$conn = null;
?>