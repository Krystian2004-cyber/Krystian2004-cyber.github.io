<?php
namespace App\Encoder;

class JsonEncoder implements EncoderInterface {
    public function supports(string $format): bool {
        return $format === 'json';
    }

    public function encode(array $data, string $format): string {
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public function decode(string $data, string $format): array {
        $decoded = json_decode($data, true);
        return is_array($decoded) ? $decoded : [];
    }
}