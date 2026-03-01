<?php
/**
 * Gaming Desktop – Database Configuration
 * PHP MySQL Connection File
 * 
 * This file handles the MySQL database connection
 * for the Gaming Desktop eCommerce platform.
 */

// ============================================
// Database Configuration
// ============================================
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'gaming_desktop');
define('DB_PORT', 3306);
define('DB_CHARSET', 'utf8mb4');

// ============================================
// Create Connection
// ============================================
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Set character set
    $conn->set_charset(DB_CHARSET);

    // Set timezone
    $conn->query("SET time_zone = '+00:00'");

} catch (Exception $e) {
    // Log error (do not expose details in production)
    error_log("Database Error: " . $e->getMessage());
    
    // Return generic error
    die(json_encode([
        'success' => false,
        'message' => 'Database connection error. Please try again later.'
    ]));
}

// ============================================
// Helper Functions
// ============================================

/**
 * Sanitize user input
 * @param string $data - Raw input
 * @return string - Sanitized input
 */
function sanitize($data) {
    global $conn;
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = $conn->real_escape_string($data);
    return $data;
}

/**
 * Execute prepared statement safely
 * @param string $sql - SQL query with placeholders
 * @param string $types - Parameter types (s=string, i=int, d=double)
 * @param array $params - Array of parameters
 * @return mysqli_result|bool
 */
function executeQuery($sql, $types = '', $params = []) {
    global $conn;
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        return false;
    }
    
    if (!empty($types) && !empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $result = $stmt->execute();
    
    if ($stmt->result_metadata()) {
        $result = $stmt->get_result();
    }
    
    $stmt->close();
    return $result;
}

/**
 * Save contact form message to database
 * @param string $name
 * @param string $email
 * @param string $subject
 * @param string $message
 * @return bool
 */
function saveContactMessage($name, $email, $subject, $message) {
    $sql = "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)";
    return executeQuery($sql, 'ssss', [$name, $email, $subject, $message]);
}

/**
 * Register a new user
 * @param string $name
 * @param string $email
 * @param string $password_hash
 * @return bool
 */
function registerUser($name, $email, $password_hash) {
    $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    return executeQuery($sql, 'sss', [$name, $email, $password_hash]);
}

/**
 * Get user by email
 * @param string $email
 * @return array|null
 */
function getUserByEmail($email) {
    $sql = "SELECT * FROM users WHERE email = ?";
    $result = executeQuery($sql, 's', [$email]);
    
    if ($result && $result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    
    return null;
}
?>
