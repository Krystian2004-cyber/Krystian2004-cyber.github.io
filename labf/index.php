<?php
require_once 'autoload.php';

use App\Serializer;
use App\Encoder\CsvEncoder;
use App\Encoder\JsonEncoder;
use App\Encoder\YamlEncoder;

$serializer = new Serializer();
$serializer->addEncoder(new CsvEncoder());
$serializer->addEncoder(new JsonEncoder());
$serializer->addEncoder(new YamlEncoder());

$inputData = '';
$inputFormat = 'csv';
$outputFormat = 'json';
$outputData = '';

if (isset($_COOKIE['inputData'])) $inputData = $_COOKIE['inputData'];
if (isset($_COOKIE['inputFormat'])) $inputFormat = $_COOKIE['inputFormat'];
if (isset($_COOKIE['outputFormat'])) $outputFormat = $_COOKIE['outputFormat'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = $_POST['inputData'] ?? '';
    $inputFormat = $_POST['inputFormat'] ?? 'csv';
    $outputFormat = $_POST['outputFormat'] ?? 'json';

    setcookie('inputData', $inputData, time() + (86400 * 30), "/");
    setcookie('inputFormat', $inputFormat, time() + (86400 * 30), "/");
    setcookie('outputFormat', $outputFormat, time() + (86400 * 30), "/");

    if (!empty($inputData)) {
        try {
            $parsedArray = $serializer->deserialize($inputData, $inputFormat);
            $outputData = $serializer->serialize($parsedArray, $outputFormat);
        } catch (\Exception $e) {
            $outputData = "Błąd przetwarzania: " . $e->getMessage();
        }
    }
}

require 'templates/layout.php';