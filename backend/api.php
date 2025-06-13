<?php
// ===== Encabezados y Zona Horaria =====
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

date_default_timezone_set('America/Costa_Rica');

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

switch ($action) {
    case 'clientes':
        if ($method === 'GET') {
            $searchTerm = isset($_GET['search']) ? $_GET['search'] : null;
            getClientes($conn, $searchTerm);
        } elseif ($method === 'POST') {
            addCliente($conn, $input);
        } elseif ($method === 'PUT') {
            updateCliente($conn, $input);
        } elseif ($method === 'DELETE') {
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            deleteCliente($conn, $id);
        }
        break;

    case 'reportes':
        if ($method === 'GET') {
            $reportDate = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
            getReportePorFecha($conn, $reportDate);
        }
        break;

    case 'venta_detalle':
        if ($method === 'GET') {
            $venta_id = isset($_GET['venta_id']) ? $_GET['venta_id'] : null;
            getVentaDetalles($conn, $venta_id);
        }
        break;

    case 'ventas':
        $cliente_id = isset($_GET['cliente_id']) ? $_GET['cliente_id'] : null;
        if ($method == 'GET' && $cliente_id) { 
            getTransacciones($conn, 'ventas', $cliente_id); 
        } elseif ($method == 'POST') { 
            addVenta($conn, $input); 
        } elseif ($method == 'DELETE') { 
            $id = isset($_GET['id']) ? $_GET['id'] : null; 
            deleteTransaccion($conn, 'ventas', $id); 
        }
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

// ===== FUNCIONES DE LA API =====

function getVentaDetalles($db, $venta_id) {
    if (empty($venta_id)) {
        http_response_code(400); echo json_encode(["message" => "Se requiere el ID de la venta."]); return;
    }
    try {
        $sql = "SELECT id, producto_descripcion, precio FROM venta_detalles WHERE venta_id = :venta_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':venta_id' => $venta_id]);
        $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($detalles);
    } catch (Exception $e) {
        http_response_code(500); echo json_encode(["message" => "Error al obtener detalles de la venta: " . $e->getMessage()]);
    }
}

function addVenta($db, $data) {
    if (empty($data['cliente_id']) || empty($data['productos']) || !is_array($data['productos'])) {
        http_response_code(400); echo json_encode(["message" => "Datos de venta incompletos o en formato incorrecto."]); return;
    }
    $cliente_id = $data['cliente_id'];
    $productos = $data['productos'];
    $monto_total = 0;
    foreach ($productos as $producto) {
        if (!isset($producto['precio']) || !is_numeric($producto['precio'])) {
             http_response_code(400); echo json_encode(["message" => "Todos los productos deben tener un precio válido."]); return;
        }
        $monto_total += floatval($producto['precio']);
    }
    $descripcion_general = count($productos) > 0 ? $productos[0]['descripcion'] : 'Venta de varios productos';
    
    $db->beginTransaction();
    try {
        $sqlVenta = "INSERT INTO ventas (cliente_id, monto_total, descripcion) VALUES (:cliente_id, :monto_total, :descripcion)";
        $stmtVenta = $db->prepare($sqlVenta);
        $stmtVenta->execute([':cliente_id' => $cliente_id, ':monto_total' => $monto_total, ':descripcion' => $descripcion_general]);
        $venta_id = $db->lastInsertId();

        $sqlDetalle = "INSERT INTO venta_detalles (venta_id, producto_descripcion, precio) VALUES (:venta_id, :producto_descripcion, :precio)";
        $stmtDetalle = $db->prepare($sqlDetalle);
        foreach ($productos as $producto) {
            $stmtDetalle->execute([':venta_id' => $venta_id, ':producto_descripcion' => $producto['descripcion'], ':precio' => $producto['precio']]);
        }
        
        $db->commit();
        http_response_code(201); echo json_encode(["message" => "Venta agregada exitosamente."]);
    } catch(Exception $e) {
        $db->rollBack();
        http_response_code(500); echo json_encode(["message" => "Error al agregar la venta: " . $e->getMessage()]);
    }
}

function getReportePorFecha($db, $reportDate) {
    try {
        $sqlVentas = "SELECT v.id, v.monto_total, v.descripcion, v.fecha, c.nombre_completo 
                      FROM ventas v JOIN clientes c ON v.cliente_id = c.id WHERE DATE(v.fecha) = :report_date ORDER BY v.fecha DESC";
        $stmtVentas = $db->prepare($sqlVentas);
        $stmtVentas->execute([':report_date' => $reportDate]);
        $ventas = $stmtVentas->fetchAll(PDO::FETCH_ASSOC);

        $sqlAbonos = "SELECT a.id, a.monto, a.fecha, c.nombre_completo 
                      FROM abonos a JOIN clientes c ON a.cliente_id = c.id WHERE DATE(a.fecha) = :report_date ORDER BY a.fecha DESC";
        $stmtAbonos = $db->prepare($sqlAbonos);
        $stmtAbonos->execute([':report_date' => $reportDate]);
        $abonos = $stmtAbonos->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['ventas' => $ventas, 'abonos' => $abonos]);
    } catch(Exception $e) {
        http_response_code(500); echo json_encode(["message" => "Error al obtener el reporte: " . $e->getMessage()]);
    }
}

function getClientes($db, $searchTerm = null) { 
    try { 
        if ($searchTerm && trim($searchTerm) !== '') { 
            $sql = "SELECT id, nombre_completo, telefono, direccion FROM clientes WHERE nombre_completo LIKE :searchTerm OR telefono LIKE :searchTerm ORDER BY nombre_completo ASC"; 
            $stmt = $db->prepare($sql); 
            $stmt->execute([':searchTerm' => '%' . $searchTerm . '%']); 
        } else { 
            $sql = "SELECT id, nombre_completo, telefono, direccion FROM clientes ORDER BY nombre_completo ASC"; 
            $stmt = $db->prepare($sql); 
            $stmt->execute(); 
        } 
        $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        echo json_encode($clientes); 
    } catch(Exception $e) { 
        http_response_code(500); echo json_encode(["message" => "Error al obtener clientes: " . $e->getMessage()]); 
    } 
}

function addCliente($db, $data) { 
    if (empty($data['nombre_completo']) || empty($data['telefono'])) { http_response_code(400); echo json_encode(["message" => "Nombre y teléfono son obligatorios."]); return; } 
    try { 
        $sql = "INSERT INTO clientes (nombre_completo, telefono, direccion) VALUES (:nombre, :telefono, :direccion)"; 
        $stmt = $db->prepare($sql); 
        $stmt->execute([':nombre' => $data['nombre_completo'], ':telefono' => $data['telefono'], ':direccion' => isset($data['direccion']) ? $data['direccion'] : '']); 
        http_response_code(201); echo json_encode(["message" => "Cliente creado exitosamente.", "id" => $db->lastInsertId()]); 
    } catch(Exception $e) { 
        http_response_code(500); echo json_encode(["message" => "Error al crear cliente: " . $e->getMessage()]); 
    } 
}

function updateCliente($db, $data) { 
    if (empty($data) || !is_array($data)) { http_response_code(400); echo json_encode(["message" => "Datos inválidos."]); return; } 
    $id = isset($data['id']) ? (int)$data['id'] : null; 
    if (empty($id) || empty($data['nombre_completo']) || empty($data['telefono'])) { http_response_code(400); echo json_encode(["message" => "ID, Nombre y teléfono son obligatorios para actualizar."]); return; } 
    try { 
        $sql = "UPDATE clientes SET nombre_completo = :nombre, telefono = :telefono, direccion = :direccion WHERE id = :id"; 
        $stmt = $db->prepare($sql); 
        $stmt->execute([':id' => $id, ':nombre' => $data['nombre_completo'], ':telefono' => $data['telefono'], ':direccion' => isset($data['direccion']) ? $data['direccion'] : '']); 
        if ($stmt->rowCount() > 0) { http_response_code(200); echo json_encode(["message" => "Cliente actualizado exitosamente."]); } 
        else { http_response_code(404); echo json_encode(["message" => "No se encontró el cliente para actualizar o los datos enviados eran idénticos."]); } 
    } catch(Exception $e) { 
        http_response_code(500); echo json_encode(["message" => "Error al actualizar cliente: " . $e->getMessage()]); 
    } 
}

function deleteCliente($db, $id) { 
    $id = (int)$id; 
    if (empty($id)) { http_response_code(400); echo json_encode(["message" => "Se requiere el ID del cliente para eliminar."]); return; } 
    try { 
        $sql = "DELETE FROM clientes WHERE id = :id"; 
        $stmt = $db->prepare($sql); 
        $stmt->execute([':id' => $id]); 
        if ($stmt->rowCount() > 0) { http_response_code(200); echo json_encode(["message" => "Cliente eliminado exitosamente."]); } 
        else { http_response_code(404); echo json_encode(["message" => "No se encontró el cliente a eliminar."]); } 
    } catch(Exception $e) { 
        http_response_code(500); echo json_encode(["message" => "Error al eliminar cliente: " . $e->getMessage()]); 
    } 
}

function getTransacciones($db, $tabla, $cliente_id) { 
    try { 
        if ($tabla === 'ventas') {
            $sql = "SELECT id, monto_total, descripcion, fecha FROM {$tabla} WHERE cliente_id = :cliente_id ORDER BY fecha DESC";
        } else { // abonos
            $sql = "SELECT id, monto, fecha FROM {$tabla} WHERE cliente_id = :cliente_id ORDER BY fecha DESC"; 
        }
        $stmt = $db->prepare($sql); 
        $stmt->execute([':cliente_id' => $cliente_id]); 
        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        echo json_encode($resultados); 
    } catch(Exception $e) { 
        http_response_code(500); echo json_encode(["message" => "Error al obtener de la tabla {$tabla}: " . $e->getMessage()]); 
    } 
}

function addAbono($db, $data) { 
    if (empty($data['cliente_id']) || !isset($data['monto'])) { http_response_code(400); echo json_encode(["message" => "Datos de abono incompletos."]); return; } 
    try { 
        $sql = "INSERT INTO abonos (cliente_id, monto) VALUES (:cliente_id, :monto)"; 
        $stmt = $db->prepare($sql); 
        $stmt->execute([':cliente_id' => $data['cliente_id'], ':monto' => $data['monto']]); 
        http_response_code(201); echo json_encode(["message" => "Abono agregado."]); 
    } catch(Exception $e) { 
        http_response_code(500); echo json_encode(["message" => "Error al agregar abono: " . $e->getMessage()]); 
    } 
}

function deleteTransaccion($db, $tabla, $id) { 
    if (empty($id)) { http_response_code(400); echo json_encode(["message" => "Se requiere ID para eliminar."]); return; } 
    try { 
        $sql = "DELETE FROM {$tabla} WHERE id = :id"; 
        $stmt = $db->prepare($sql); 
        $stmt->execute([':id' => $id]); 
        http_response_code(200); echo json_encode(["message" => "Registro eliminado de {$tabla}."]); 
    } catch(Exception $e) { 
        http_response_code(500); echo json_encode(["message" => "Error al eliminar de {$tabla}: " . $e->getMessage()]); 
    } 
}

$conn = null;
?>