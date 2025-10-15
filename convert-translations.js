const fs = require("fs");
const path = require("path");

// Папка с файлами переводов
const dir = path.join(__dirname, "src", "assets", "localization");

// Укажи имена файлов перевода
const files = ["1.json", "2.json", "3.json"];

/**
 * Преобразует ключ в формат UPPER_SNAKE_CASE
 * - добавляет _ между словами, включая camelCase, PascalCase и пробелы
 */
function toUpperSnakeCase(key) {
  return key
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2") // camelCase → camel_Case
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2") // ABBRWord → ABBR_Word
    .replace(/[^A-Za-z0-9]+/g, "_") // пробелы и символы → _
    .replace(/_+/g, "_") // несколько _ подряд → одно
    .replace(/^_|_$/g, "") // убираем _ в начале/конце
    .toUpperCase();
}

/**
 * Рекурсивно обрабатывает объект, преобразуя все ключи
 */
function convertKeys(obj) {
  if (typeof obj !== "object" || obj === null) return obj;

  const newObj = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = toUpperSnakeCase(key);
    newObj[newKey] = convertKeys(value);
  }

  return newObj;
}

// Основная логика
files.forEach((file) => {
  const filePath = path.join(dir, file);

  // Проверяем, что файл существует
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Файл ${file} не найден, пропускаю`);
    return;
  }

  // Читаем JSON
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Преобразуем ключи
  const newData = convertKeys(data);

  // Создаём резервную копию
  const backupPath = filePath.replace(".json", "_original.json");
  fs.copyFileSync(filePath, backupPath);

  // Сохраняем изменённую версию
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf8");

  console.log(`✅ ${file} converted successfully`);
});
