<?php
namespace App\Encoder;

class YamlEncoder implements EncoderInterface {
    public function supports(string $format): bool {
        return in_array($format, ['yaml', 'yml']);
    }

    public function encode(array $data, string $format): string {
        return yaml_emit($data);
    }

    public function decode(string $data, string $format): array {
        $decoded = yaml_parse($data);
        return is_array($decoded) ? $decoded : [];
    }
}