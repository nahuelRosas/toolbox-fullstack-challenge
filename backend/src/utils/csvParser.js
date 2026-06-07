/**
 * Parses raw CSV content and returns a structured object.
 * Discards lines with errors, missing fields, or incorrect formats.
 *
 * @param {string} csvContent - The raw CSV string.
 * @param {string} fileName - The name of the file being parsed.
 * @returns {Object|null} - Parsed object or null if no valid lines.
 */
const parseCsv = (csvContent, fileName) => {
  if (!csvContent || typeof csvContent !== 'string') return null

  const lines = csvContent.split('\n')
  if (lines.length <= 1) return null // Empty or only header

  const parsedLines = []

  // Skip header (index 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue // Skip empty lines

    const cols = line.split(',')

    // Rule: Must have exactly 4 columns
    if (cols.length !== 4) continue

    const [file, text, numberStr, hex] = cols

    // Rule: The first column must match the fileName
    if (file !== fileName) continue

    // Rule: text must not be empty
    if (!text) continue

    // Rule: number must be a valid number
    const number = Number(numberStr)
    if (isNaN(number) || numberStr === '') continue

    // Rule: hex must be 32 characters
    if (!hex || hex.length !== 32) continue

    // Rule: hex must be valid hexadecimal
    if (!/^[0-9a-fA-F]{32}$/.test(hex)) continue

    parsedLines.push({
      text,
      number,
      hex
    })
  }

  if (parsedLines.length === 0) return null

  return {
    file: fileName,
    lines: parsedLines
  }
}

module.exports = {
  parseCsv
}
