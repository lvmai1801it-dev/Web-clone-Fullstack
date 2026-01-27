<?php

declare(strict_types=1);

namespace Lib\Database;

use App\Core\Config;
use PDO;
use PDOException;
use Lib\Logger\Logger;
use Exception;

class DatabaseConnection
{
    private static ?PDO $instance = null;

    private function __construct()
    {
        // Private constructor to prevent direct instantiation
    }

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            try {
                $host = Config::get('DB_HOST', 'localhost');
                $port = Config::get('DB_PORT', '3306');
                $db = Config::get('DB_DATABASE', 'audiotruyen');
                $user = Config::get('DB_USERNAME', 'root');
                $pass = Config::get('DB_PASSWORD', 'root');

                $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";

                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_PERSISTENT => true
                ];

                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                Logger::error('Database Connection Failed', ['error' => $e->getMessage()]);
                // In production, don't show real error details
                throw new Exception('Database Connection Error');
            }
        }

        return self::$instance;
    }
}
