/**
 * Função auxiliar para download de arquivos a partir de uma string base64.
 * @param pdfBase64 - String em base64 do arquivo a ser baixado
 * @param filename - Nome do arquivo a ser salvo (ex: "documento.pdf")
 * @param contentType - Tipo MIME do arquivo: `"application/pdf"` | `"application/zip"` | `"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"`
 * @example
 * downloadFile(base64String, "contrato.pdf", "application/pdf")
 * downloadFile(base64String, "planilha.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
 */
export function downloadFile(
  pdfBase64: string,
  filename: string,
  contentType:
    | "application/pdf"
    | "application/zip"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
) {
  const byteCharacters = atob(pdfBase64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
