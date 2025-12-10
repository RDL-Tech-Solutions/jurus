/**
 * 🗓️ UTILITÁRIO DE DATAS - CORREÇÃO DEFINITIVA DO BUG DE TIMEZONE
 * 
 * PROBLEMA RESOLVIDO:
 * - Datas salvando 1 dia antes (ex: 10/12 → 09/12)
 * - Conversão automática de timezone UTC
 * - new Date("2025-12-10") criando 2025-12-09 21:00 (UTC-3)
 * 
 * SOLUÇÃO:
 * - NUNCA usar new Date(string) com formato ISO
 * - SEMPRE separar ano, mês e dia manualmente
 * - SEMPRE usar new Date(year, monthIndex, day)
 * - Garantir que data salva = data exibida
 */

/**
 * Converte string YYYY-MM-DD para Date no timezone LOCAL
 * SEM conversão de timezone
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns Date object no timezone local
 * 
 * @example
 * parseDataLocal("2025-12-10") → Date(2025, 11, 10) // 10/12/2025 00:00:00 LOCAL
 */
export function parseDataLocal(dataString: string): Date {
    if (!dataString) {
        throw new Error('Data inválida: string vazia');
    }

    // Separar ano, mês e dia MANUALMENTE
    const partes = dataString.split('-');
    if (partes.length !== 3) {
        throw new Error(`Data inválida: formato esperado YYYY-MM-DD, recebido: ${dataString}`);
    }

    const ano = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);
    const dia = parseInt(partes[2], 10);

    // Validar valores
    if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
        throw new Error(`Data inválida: valores não numéricos em ${dataString}`);
    }

    if (mes < 1 || mes > 12) {
        throw new Error(`Mês inválido: ${mes} (deve ser 1-12)`);
    }

    if (dia < 1 || dia > 31) {
        throw new Error(`Dia inválido: ${dia} (deve ser 1-31)`);
    }

    // Criar Date no timezone LOCAL (mês é 0-indexed)
    // NUNCA usar new Date(string) - sempre usar new Date(year, month, day)
    return new Date(ano, mes - 1, dia, 0, 0, 0, 0);
}

/**
 * Converte Date para string YYYY-MM-DD no timezone LOCAL
 * SEM conversão de timezone
 * 
 * @param data - Date object
 * @returns String no formato YYYY-MM-DD
 * 
 * @example
 * dateParaString(new Date(2025, 11, 10)) → "2025-12-10"
 */
export function dateParaString(data: Date): string {
    if (!(data instanceof Date) || isNaN(data.getTime())) {
        throw new Error('Data inválida');
    }

    // Pegar valores do timezone LOCAL
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}

/**
 * Obtém data atual no formato YYYY-MM-DD (timezone LOCAL)
 * 
 * @returns String no formato YYYY-MM-DD
 * 
 * @example
 * obterDataHoje() → "2025-12-10"
 */
export function obterDataHoje(): string {
    const hoje = new Date();
    return dateParaString(hoje);
}

/**
 * Obtém data e hora atual no formato ISO (para timestamps)
 * 
 * @returns String no formato ISO
 * 
 * @example
 * obterDataHoraAtual() → "2025-12-10T14:30:00.000Z"
 */
export function obterDataHoraAtual(): string {
    return new Date().toISOString();
}

/**
 * Formata data para exibição em português (DD/MM/YYYY)
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns String no formato DD/MM/YYYY
 * 
 * @example
 * formatarData("2025-12-10") → "10/12/2025"
 */
export function formatarData(dataString: string): string {
    const data = parseDataLocal(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Formata data curta (DD/MMM)
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns String no formato DD/MMM
 * 
 * @example
 * formatarDataCurta("2025-12-10") → "10/dez"
 */
export function formatarDataCurta(dataString: string): string {
    const data = parseDataLocal(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
    });
}

/**
 * Formata data com dia da semana
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns String com dia da semana
 * 
 * @example
 * formatarDataComDiaSemana("2025-12-10") → "Quarta-feira, 10/12/2025"
 */
export function formatarDataComDiaSemana(dataString: string): string {
    const data = parseDataLocal(dataString);
    return data.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Formata dia da semana curto
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns String com dia da semana curto
 * 
 * @example
 * formatarDiaSemana("2025-12-10") → "Qua"
 */
export function formatarDiaSemana(dataString: string): string {
    const data = parseDataLocal(dataString);
    const hoje = obterDataHoje();
    
    if (dataString === hoje) {
        return 'Hoje';
    }
    
    const ontem = dateParaString(new Date(Date.now() - 24 * 60 * 60 * 1000));
    if (dataString === ontem) {
        return 'Ontem';
    }
    
    const amanha = dateParaString(new Date(Date.now() + 24 * 60 * 60 * 1000));
    if (dataString === amanha) {
        return 'Amanhã';
    }
    
    return data.toLocaleDateString('pt-BR', { weekday: 'short' });
}

/**
 * Converte input type="date" para formato YYYY-MM-DD
 * (já vem no formato correto, mas garante consistência)
 * 
 * @param inputValue - Valor do input
 * @returns String no formato YYYY-MM-DD
 */
export function inputParaData(inputValue: string): string {
    // Input type="date" já retorna YYYY-MM-DD
    // Apenas validar e retornar
    if (!inputValue || !inputValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error(`Formato de data inválido: ${inputValue}`);
    }
    return inputValue;
}

/**
 * Converte data para formato de input type="date"
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns String no formato YYYY-MM-DD (para input)
 */
export function dataParaInput(dataString: string): string {
    // Validar formato
    parseDataLocal(dataString); // Lança erro se inválido
    return dataString;
}

/**
 * Calcula próxima data baseada em frequência
 * 
 * @param dataInicio - Data inicial no formato YYYY-MM-DD
 * @param frequencia - Tipo de recorrência
 * @param diaDoMes - Dia específico do mês (opcional)
 * @param diaDaSemana - Dia específico da semana (opcional, 0=domingo)
 * @returns String no formato YYYY-MM-DD
 */
export function calcularProximaData(
    dataInicio: string,
    frequencia: 'diaria' | 'semanal' | 'mensal' | 'anual',
    diaDoMes?: number,
    diaDaSemana?: number
): string {
    const inicio = parseDataLocal(dataInicio);
    const proxima = new Date(inicio);

    switch (frequencia) {
        case 'diaria':
            proxima.setDate(proxima.getDate() + 1);
            break;

        case 'semanal':
            proxima.setDate(proxima.getDate() + 7);
            if (diaDaSemana !== undefined) {
                const diaAtual = proxima.getDay();
                if (diaAtual !== diaDaSemana) {
                    let diasAte = (diaDaSemana - diaAtual + 7) % 7;
                    if (diasAte === 0) diasAte = 7;
                    proxima.setDate(proxima.getDate() + diasAte);
                }
            }
            break;

        case 'mensal':
            proxima.setMonth(proxima.getMonth() + 1);
            if (diaDoMes !== undefined) {
                const ultimoDiaDoMes = new Date(
                    proxima.getFullYear(),
                    proxima.getMonth() + 1,
                    0
                ).getDate();
                proxima.setDate(Math.min(diaDoMes, ultimoDiaDoMes));
            }
            break;

        case 'anual':
            proxima.setFullYear(proxima.getFullYear() + 1);
            break;
    }

    return dateParaString(proxima);
}

/**
 * Adiciona dias a uma data
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @param dias - Número de dias para adicionar (pode ser negativo)
 * @returns String no formato YYYY-MM-DD
 */
export function adicionarDias(dataString: string, dias: number): string {
    const data = parseDataLocal(dataString);
    data.setDate(data.getDate() + dias);
    return dateParaString(data);
}

/**
 * Adiciona meses a uma data
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @param meses - Número de meses para adicionar (pode ser negativo)
 * @returns String no formato YYYY-MM-DD
 */
export function adicionarMeses(dataString: string, meses: number): string {
    const data = parseDataLocal(dataString);
    data.setMonth(data.getMonth() + meses);
    return dateParaString(data);
}

/**
 * Adiciona anos a uma data
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @param anos - Número de anos para adicionar (pode ser negativo)
 * @returns String no formato YYYY-MM-DD
 */
export function adicionarAnos(dataString: string, anos: number): string {
    const data = parseDataLocal(dataString);
    data.setFullYear(data.getFullYear() + anos);
    return dateParaString(data);
}

/**
 * Verifica se uma data está no passado
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns true se a data é anterior a hoje
 */
export function estaNoPassado(dataString: string): boolean {
    const data = parseDataLocal(dataString);
    const hoje = parseDataLocal(obterDataHoje());
    return data < hoje;
}

/**
 * Verifica se uma data está no futuro
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns true se a data é posterior a hoje
 */
export function estaNoFuturo(dataString: string): boolean {
    const data = parseDataLocal(dataString);
    const hoje = parseDataLocal(obterDataHoje());
    return data > hoje;
}

/**
 * Verifica se uma data é hoje
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns true se a data é hoje
 */
export function eHoje(dataString: string): boolean {
    return dataString === obterDataHoje();
}

/**
 * Calcula diferença em dias entre duas datas
 * 
 * @param data1 - Primeira data no formato YYYY-MM-DD
 * @param data2 - Segunda data no formato YYYY-MM-DD
 * @returns Número de dias de diferença
 */
export function diferencaEmDias(data1: string, data2: string): number {
    const d1 = parseDataLocal(data1);
    const d2 = parseDataLocal(data2);
    const diff = d2.getTime() - d1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Obtém primeiro dia do mês
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns String no formato YYYY-MM-DD (primeiro dia do mês)
 */
export function primeiroDiaDoMes(dataString: string): string {
    const data = parseDataLocal(dataString);
    return dateParaString(new Date(data.getFullYear(), data.getMonth(), 1));
}

/**
 * Obtém último dia do mês
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns String no formato YYYY-MM-DD (último dia do mês)
 */
export function ultimoDiaDoMes(dataString: string): string {
    const data = parseDataLocal(dataString);
    return dateParaString(new Date(data.getFullYear(), data.getMonth() + 1, 0));
}

/**
 * Verifica se data está em um mês/ano específico
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @param mes - Mês (1-12)
 * @param ano - Ano
 * @returns true se a data está no mês/ano especificado
 */
export function estaNoMes(dataString: string, mes: number, ano: number): boolean {
    const data = parseDataLocal(dataString);
    return data.getMonth() + 1 === mes && data.getFullYear() === ano;
}

/**
 * Obtém mês e ano de uma data
 * 
 * @param dataString - Data no formato YYYY-MM-DD
 * @returns Objeto com mês e ano
 */
export function obterMesAno(dataString: string): { mes: number; ano: number } {
    const data = parseDataLocal(dataString);
    return {
        mes: data.getMonth() + 1,
        ano: data.getFullYear()
    };
}

/**
 * Formata mês/ano para exibição
 * 
 * @param mes - Mês (1-12)
 * @param ano - Ano
 * @returns String formatada (ex: "Dezembro/2025")
 */
export function formatarMesAno(mes: number, ano: number): string {
    const data = new Date(ano, mes - 1, 1);
    return data.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Formata mês/ano curto
 * 
 * @param mes - Mês (1-12)
 * @param ano - Ano
 * @returns String formatada (ex: "Dez/25")
 */
export function formatarMesAnoCurto(mes: number, ano: number): string {
    const data = new Date(ano, mes - 1, 1);
    return data.toLocaleDateString('pt-BR', {
        month: 'short',
        year: '2-digit'
    });
}
