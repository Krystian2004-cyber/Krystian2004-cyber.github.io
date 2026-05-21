<?php
namespace App;

use App\Encoder\EncoderInterface;

class Serializer {
    /** @var EncoderInterface[] */
    private array $encoders = [];

    public function addEncoder(EncoderInterface $encoder): void {
        $this->encoders[] = $encoder;
    }

    private function getEncoder(string $format): ?EncoderInterface {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder;
            }
        }
        return null;
    }

    public function serialize(array $data, string $format): string {
        $encoder = $this->getEncoder($format);
        if (!$encoder) throw new \Exception("Unsupported format: $format");
        return $encoder->encode($data, $format);
    }

    public function deserialize(string $data, string $format): array {
        $encoder = $this->getEncoder($format);
        if (!$encoder) throw new \Exception("Unsupported format: $format");
        return $encoder->decode($data, $format);
    }
}