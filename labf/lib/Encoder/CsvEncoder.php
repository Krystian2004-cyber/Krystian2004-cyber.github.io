<?php
namespace App\Encoder;

class CsvEncoder implements EncoderInterface {
    
    private function getDelimiter(string $format): string {
        return match($format) {
            'csv' => ',',
            'ssv' => ';',
            'tsv' => "\t",
            default => ','
        };
    }

    public function supports(string $format): bool {
        return in_array($format, ['csv', 'ssv', 'tsv']);
    }

    public function encode(array $data, string $format): string {
        if (empty($data)) return '';
        
        $firstElement = reset($data);
        if (!is_array($firstElement)) {
            $data = [$data]; 
            $firstElement = reset($data);
        }
        
        $delimiter = $this->getDelimiter($format);
        $output = fopen('php://temp', 'r+');
        
        $headers = array_keys($firstElement);
        fputcsv($output, $headers, $delimiter, '"', "");
        
        foreach ($data as $row) {
            fputcsv($output, (array)$row, $delimiter, '"', "");
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        return $csv;
    }

    public function decode(string $data, string $format): array {
        if (empty(trim($data))) return [];
        
        $delimiter = $this->getDelimiter($format);
        $cleanData = str_replace("\r", "", trim($data));
        $lines = explode("\n", $cleanData);
        
        $headers = str_getcsv(array_shift($lines), $delimiter, '"', "");
        $headers = array_map('trim', $headers); 
        
        $result = [];
        foreach ($lines as $line) {
            if (empty(trim($line))) continue;
            
            $row = str_getcsv($line, $delimiter, '"', "");
            
            if (count($row) === 1 && empty($row[0])) continue;

            if (count($headers) === count($row)) {
                $result[] = array_combine($headers, $row);
            }
        }
        return $result;
    }
}