type Formatter = (row: Record<string, unknown>) => unknown;

export function formatRows(
  rows: Record<string, unknown>[],
  formatMap: Record<string, Formatter>
): Record<string, unknown>[] {
  return rows.map((row) => {
    const formattedRow: Record<string, unknown> = { ...row };

    Object.entries(formatMap).forEach(([key, formatter]) => {
      formattedRow[key] = formatter(row);
    });

    return formattedRow;
  });
}
