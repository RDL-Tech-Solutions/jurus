/**
 * Parser de Códigos de Barras
 * Identifica e extrai dados de diferentes tipos de códigos
 */

import { BarcodeData, BarcodeType, ParsedBarcodeData } from '../types';

export class BarcodeParser {
  /**
   * Identifica tipo de código
   */
  static identifyType(code: string): BarcodeType {
    // Boleto (linha digitável - 47 ou 48 dígitos)
    if (/^\d{47,48}$/.test(code.replace(/\s/g, ''))) {
      return 'boleto';
    }

    // PIX (começa com 00020126 ou 00020101)
    if (code.startsWith('00020126') || code.startsWith('00020101')) {
      return 'pix';
    }

    // EAN-13 (13 dígitos)
    if (/^\d{13}$/.test(code)) {
      return 'ean13';
    }

    // NFC-e (URL ou chave de 44 dígitos)
    if (code.includes('nfce') || /^\d{44}$/.test(code)) {
      return 'nfce';
    }

    // QR Code genérico
    if (code.startsWith('http') || code.length > 50) {
      return 'qrcode';
    }

    return 'unknown';
  }

  /**
   * Parse completo do código
   */
  static parse(code: string): BarcodeData {
    const type = this.identifyType(code);
    let parsed: ParsedBarcodeData = {};

    switch (type) {
      case 'boleto':
        parsed = this.parseBoleto(code);
        break;
      case 'pix':
        parsed = this.parsePix(code);
        break;
      case 'ean13':
        parsed = this.parseEAN(code);
        break;
      case 'nfce':
        parsed = this.parseNFCe(code);
        break;
      default:
        parsed = { descricao: 'Código não identificado' };
    }

    return {
      raw: code,
      type,
      parsed
    };
  }

  /**
   * Parse de boleto bancário
   */
  private static parseBoleto(code: string): ParsedBarcodeData {
    const cleanCode = code.replace(/\s/g, '');
    
    // Extrair valor (posições 37-47 em centavos)
    const valorStr = cleanCode.substring(37, 47);
    const valor = parseInt(valorStr) / 100;

    // Extrair data de vencimento (posições 33-37)
    const fatorVencimento = parseInt(cleanCode.substring(33, 37));
    const dataBase = new Date('1997-10-07');
    const vencimento = new Date(dataBase.getTime() + fatorVencimento * 24 * 60 * 60 * 1000);

    // Identificar banco (3 primeiros dígitos)
    const codigoBanco = cleanCode.substring(0, 3);
    const bancos: Record<string, string> = {
      '001': 'Banco do Brasil',
      '033': 'Santander',
      '104': 'Caixa Econômica',
      '237': 'Bradesco',
      '341': 'Itaú',
      '756': 'Sicoob'
    };

    return {
      linhaDigitavel: cleanCode,
      valor,
      vencimento: vencimento.toISOString().split('T')[0],
      banco: bancos[codigoBanco] || `Banco ${codigoBanco}`,
      descricao: `Boleto ${bancos[codigoBanco] || 'Bancário'}`,
      data: vencimento.toISOString().split('T')[0]
    };
  }

  /**
   * Parse de QR Code PIX
   */
  private static parsePix(code: string): ParsedBarcodeData {
    // PIX EMV format
    const getValue = (id: string): string => {
      const regex = new RegExp(`${id}(\\d{2})([^\\d]+)`);
      const match = code.match(regex);
      return match ? match[2] : '';
    };

    const recebedor = getValue('59'); // Nome do recebedor
    const cidade = getValue('60'); // Cidade
    const identificador = getValue('05'); // Identificador da transação
    
    // Valor (se presente)
    const valorMatch = code.match(/54(\d{2})(\d+\.?\d*)/);
    const valor = valorMatch ? parseFloat(valorMatch[2]) : undefined;

    return {
      pixRecebedor: recebedor,
      pixIdentificador: identificador,
      valor,
      descricao: `PIX para ${recebedor || 'destinatário'}`,
      data: new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Parse de código EAN-13
   */
  private static parseEAN(code: string): ParsedBarcodeData {
    // Aqui você pode integrar com API de produtos
    // Por enquanto, retorna dados básicos
    return {
      ean: code,
      nomeProduto: `Produto ${code}`,
      descricao: `Compra de produto (EAN: ${code})`,
      categoria: 'compras',
      data: new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Parse de NFC-e
   */
  private static parseNFCe(code: string): ParsedBarcodeData {
    // Se for URL, extrair chave
    let chave = code;
    if (code.includes('nfce')) {
      const match = code.match(/\d{44}/);
      chave = match ? match[0] : code;
    }

    return {
      chaveNFe: chave,
      descricao: 'Nota Fiscal Eletrônica',
      data: new Date().toISOString().split('T')[0]
    };
  }
}
