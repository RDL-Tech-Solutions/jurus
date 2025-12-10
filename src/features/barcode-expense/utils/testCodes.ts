/**
 * Códigos de teste para validação do parser
 */

export const TEST_CODES = {
  // Boleto válido (exemplo fictício)
  boleto: '23793381286000001234567890123456789012345678',
  
  // PIX QR Code (exemplo fictício)
  pix: '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000',
  
  // EAN-13 (código de produto)
  ean13: '7891234567890',
  
  // NFC-e (chave de 44 dígitos)
  nfce: '35210112345678901234550010000123451234567890',
  
  // NFC-e (URL)
  nfceUrl: 'https://nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode?p=35210112345678901234550010000123451234567890'
};

/**
 * Função para testar todos os códigos
 */
export function testAllCodes() {
  const results = [];
  
  for (const [type, code] of Object.entries(TEST_CODES)) {
    results.push({
      type,
      code,
      length: code.length
    });
  }
  
  return results;
}
