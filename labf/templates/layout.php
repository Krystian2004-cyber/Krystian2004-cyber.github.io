<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Data Converter</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { display: flex; gap: 20px; }
        .column { flex: 1; display: flex; flex-direction: column; gap: 10px; }
        textarea, pre { width: 100%; height: 400px; box-sizing: border-box; font-family: monospace; }
        pre { background: #f9f9f9; border: 1px solid #ccc; padding: 10px; overflow: auto; margin: 0; }
        button { padding: 10px; font-size: 16px; margin-top: 15px; width: 100%; cursor: pointer; }
        select { padding: 5px; }
    </style>
</head>
<body>
    <form method="POST" action=""> <div class="container">
            <div class="column">
                <select name="inputFormat"> <?php foreach (['csv', 'ssv', 'tsv', 'json', 'yaml'] as $fmt): ?>
                        <option value="<?= $fmt ?>" <?= $inputFormat === $fmt ? 'selected' : '' ?>><?= strtoupper($fmt) ?></option>
                    <?php endforeach; ?>
                </select>
                <textarea name="inputData"><?= htmlspecialchars($inputData) ?></textarea> </div>
            
            <div class="column">
                <select name="outputFormat"> <?php foreach (['csv', 'ssv', 'tsv', 'json', 'yaml'] as $fmt): ?>
                        <option value="<?= $fmt ?>" <?= $outputFormat === $fmt ? 'selected' : '' ?>><?= strtoupper($fmt) ?></option>
                    <?php endforeach; ?>
                </select>
                <pre><?= htmlspecialchars($outputData) ?></pre> </div>
        </div>
        <button type="submit">Convert</button> </form>
</body>
</html>