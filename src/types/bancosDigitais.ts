// Tipos e dados para comparação de bancos digitais e modalidades

export interface BancoDigital {
    id: string;
    nome: string;
    logo: string; // emoji ou URL
    cor: string;
    taxaCDB: number; // % do CDI
    taxaPoupanca: boolean;
    taxaAdmin: number;
    liquidez: 'diaria' | 'vencimento' | 'mista';
    pros: string[];
    contras: string[];
    categorias: string[]; // Modalidades disponíveis
}

export interface ModalidadeInvestimento {
    id: string;
    nome: string;
    descricao: string;
    risco: 'baixo' | 'medio' | 'alto';
    liquidez: 'diaria' | 'mensal' | 'vencimento';
    rentabilidadeMedia: number; // % anual
    tributacao: number; // % IR
    valorMinimo: number;
    pros: string[];
    contras: string[];
}

export interface SimulacaoSalva {
    id: string;
    nome: string;
    valorInicial: number;
    aporteMensal: number;
    prazoMeses: number;
    taxaAnual: number;
    dataCriacao: string;
}

export interface ComparacaoBanco {
    banco: BancoDigital;
    rendimentoBruto: number;
    rendimentoLiquido: number;
    totalFinal: number;
}

// Bancos digitais com dados atualizados
export const BANCOS_DIGITAIS: BancoDigital[] = [
    {
        id: 'nubank',
        nome: 'Nubank',
        logo: '💜',
        cor: '#8B5CF6',
        taxaCDB: 100,
        taxaPoupanca: true,
        taxaAdmin: 0,
        liquidez: 'diaria',
        pros: [
            'Sem taxas de manutenção',
            'Cartão de crédito sem anuidade',
            'App intuitivo e moderno',
            'Atendimento 24h pelo chat',
            'Cashback em compras'
        ],
        contras: [
            'Limite inicial baixo',
            'Poucos investimentos avançados',
            'Sem agências físicas'
        ],
        categorias: ['CDB', 'Poupança', 'Fundos']
    },
    {
        id: 'inter',
        nome: 'Banco Inter',
        logo: '🧡',
        cor: '#FF6B00',
        taxaCDB: 100,
        taxaPoupanca: true,
        taxaAdmin: 0,
        liquidez: 'diaria',
        pros: [
            'Conta 100% gratuita',
            'Shopping com cashback',
            'Investimentos variados',
            'Seguros e consórcios',
            'Marketplace integrado'
        ],
        contras: [
            'App pode ser lento',
            'Atendimento demorado',
            'Interface confusa'
        ],
        categorias: ['CDB', 'Poupança', 'Fundos', 'Ações', 'Cripto']
    },
    {
        id: 'c6bank',
        nome: 'C6 Bank',
        logo: '⬛',
        cor: '#1A1A1A',
        taxaCDB: 102,
        taxaPoupanca: true,
        taxaAdmin: 0,
        liquidez: 'diaria',
        pros: [
            'CDB acima de 100% CDI',
            'Cartão com tag grátis',
            'Programa de pontos',
            'Conta global em dólar',
            'Investimentos diversificados'
        ],
        contras: [
            'Atendimento pode demorar',
            'App com bugs ocasionais',
            'Menos popular que concorrentes'
        ],
        categorias: ['CDB', 'Poupança', 'Fundos', 'Ações']
    },
    {
        id: 'picpay',
        nome: 'PicPay',
        logo: '💚',
        cor: '#21C25E',
        taxaCDB: 102,
        taxaPoupanca: false,
        taxaAdmin: 0,
        liquidez: 'diaria',
        pros: [
            'Rendimento acima do CDI',
            'Cashback em pagamentos',
            'Pagamento por QR Code',
            'Empréstimos rápidos',
            'Interface simples'
        ],
        contras: [
            'Poucos produtos de investimento',
            'Sem poupança tradicional',
            'Limitado para investidor avançado'
        ],
        categorias: ['CDB', 'Fundos']
    },
    {
        id: 'mercadopago',
        nome: 'Mercado Pago',
        logo: '💛',
        cor: '#FFE600',
        taxaCDB: 100,
        taxaPoupanca: false,
        taxaAdmin: 0,
        liquidez: 'diaria',
        pros: [
            'Integração com Mercado Livre',
            'Liquidez diária',
            'Cashback em compras',
            'Maquininhas de cartão',
            'Crédito para MEI'
        ],
        contras: [
            'Apenas CDB disponível',
            'Sem cartão de crédito tradicional',
            'Focado em vendedores'
        ],
        categorias: ['CDB']
    },
    {
        id: 'pagbank',
        nome: 'PagBank',
        logo: '💙',
        cor: '#00A4E4',
        taxaCDB: 100,
        taxaPoupanca: true,
        taxaAdmin: 0,
        liquidez: 'diaria',
        pros: [
            'Conta digital gratuita',
            'Maquininhas acessíveis',
            'Saques em lotéricas',
            'Empréstimos',
            'Pix garantido'
        ],
        contras: [
            'Interface menos moderna',
            'Menos investimentos',
            'Taxas em alguns serviços'
        ],
        categorias: ['CDB', 'Poupança']
    },
    {
        id: 'neon',
        nome: 'Neon',
        logo: '🔵',
        cor: '#00D4FF',
        taxaCDB: 100,
        taxaPoupanca: true,
        taxaAdmin: 0,
        liquidez: 'diaria',
        pros: [
            'Conta para menores de idade',
            'Cartão sem anuidade',
            'Cashback',
            'Empréstimos',
            'Programa de recompensas'
        ],
        contras: [
            'Poucos investimentos',
            'Atendimento limitado',
            'Limites baixos iniciais'
        ],
        categorias: ['CDB', 'Poupança']
    },
    {
        id: 'next',
        nome: 'Next',
        logo: '💚',
        cor: '#00FF87',
        taxaCDB: 100,
        taxaPoupanca: true,
        taxaAdmin: 0,
        liquidez: 'diaria',
        pros: [
            'Pertence ao Bradesco',
            'Acesso a caixas Bradesco',
            'Seguros',
            'Investimentos Bradesco',
            'Desconto em parceiros'
        ],
        contras: [
            'Algumas taxas maiores',
            'Interface menos intuitiva',
            'Menos inovador'
        ],
        categorias: ['CDB', 'Poupança', 'Fundos']
    }
];

// Modalidades de investimento
export const MODALIDADES_INVESTIMENTO: ModalidadeInvestimento[] = [
    {
        id: 'cdb',
        nome: 'CDB',
        descricao: 'Certificado de Depósito Bancário',
        risco: 'baixo',
        liquidez: 'diaria',
        rentabilidadeMedia: 12.75, // ~100% CDI
        tributacao: 15,
        valorMinimo: 1,
        pros: ['Garantido pelo FGC', 'Liquidez diária', 'Renda fixa'],
        contras: ['IR sobre rendimentos', 'Rentabilidade limitada']
    },
    {
        id: 'poupanca',
        nome: 'Poupança',
        descricao: 'Caderneta de Poupança',
        risco: 'baixo',
        liquidez: 'diaria',
        rentabilidadeMedia: 8.5, // ~70% CDI
        tributacao: 0,
        valorMinimo: 0,
        pros: ['Isenta de IR', 'Sem taxas', 'Super segura'],
        contras: ['Rendimento baixo', 'Aniversário mensal']
    },
    {
        id: 'lci',
        nome: 'LCI',
        descricao: 'Letra de Crédito Imobiliário',
        risco: 'baixo',
        liquidez: 'vencimento',
        rentabilidadeMedia: 11.0,
        tributacao: 0,
        valorMinimo: 1000,
        pros: ['Isenta de IR', 'Garantia FGC', 'Boa rentabilidade'],
        contras: ['Carência mínima 90 dias', 'Valor mínimo alto']
    },
    {
        id: 'lca',
        nome: 'LCA',
        descricao: 'Letra de Crédito do Agronegócio',
        risco: 'baixo',
        liquidez: 'vencimento',
        rentabilidadeMedia: 11.0,
        tributacao: 0,
        valorMinimo: 1000,
        pros: ['Isenta de IR', 'Garantia FGC', 'Apoia o agro'],
        contras: ['Carência mínima 90 dias', 'Menos disponível']
    },
    {
        id: 'tesouro-selic',
        nome: 'Tesouro Selic',
        descricao: 'Título público atrelado à Selic',
        risco: 'baixo',
        liquidez: 'diaria',
        rentabilidadeMedia: 12.25,
        tributacao: 15,
        valorMinimo: 30,
        pros: ['Mais seguro do Brasil', 'Liquidez D+1', 'Valor baixo'],
        contras: ['IR sobre rendimentos', 'Taxa B3 0,20%']
    },
    {
        id: 'fundos-di',
        nome: 'Fundos DI',
        descricao: 'Fundos de Renda Fixa DI',
        risco: 'baixo',
        liquidez: 'diaria',
        rentabilidadeMedia: 11.5,
        tributacao: 15,
        valorMinimo: 100,
        pros: ['Gestão profissional', 'Diversificação', 'Liquidez'],
        contras: ['Taxa de administração', 'Come-cotas']
    },
    {
        id: 'acoes',
        nome: 'Ações',
        descricao: 'Renda variável na Bolsa',
        risco: 'alto',
        liquidez: 'diaria',
        rentabilidadeMedia: 15.0,
        tributacao: 15,
        valorMinimo: 10,
        pros: ['Alto potencial de ganho', 'Dividendos', 'Liquidez'],
        contras: ['Risco de perda', 'Volátil', 'Exige conhecimento']
    },
    {
        id: 'fii',
        nome: 'Fundos Imobiliários',
        descricao: 'Fundos de Investimento Imobiliário',
        risco: 'medio',
        liquidez: 'diaria',
        rentabilidadeMedia: 12.0,
        tributacao: 0,
        valorMinimo: 100,
        pros: ['Dividendos isentos', 'Imóveis sem burocracia', 'Renda mensal'],
        contras: ['Variação de cotas', 'Taxas', 'Risco imobiliário']
    }
];

// Taxa CDI atual (atualizar periodicamente)
export const CDI_ANUAL = 12.75;

// Função para calcular rendimento em um banco
export function calcularRendimentoBanco(
    banco: BancoDigital,
    valorInicial: number,
    aporteMensal: number,
    prazoMeses: number
): ComparacaoBanco {
    const taxaMensal = ((banco.taxaCDB / 100) * CDI_ANUAL) / 100 / 12;

    let montante = valorInicial;
    let totalAportes = valorInicial;

    for (let i = 0; i < prazoMeses; i++) {
        montante = montante * (1 + taxaMensal) + aporteMensal;
        totalAportes += aporteMensal;
    }

    const rendimentoBruto = montante - totalAportes;
    const ir = rendimentoBruto * 0.15; // IR 15% (simplificado)
    const rendimentoLiquido = rendimentoBruto - ir;

    return {
        banco,
        rendimentoBruto,
        rendimentoLiquido,
        totalFinal: totalAportes + rendimentoLiquido
    };
}

// Função para calcular rendimento em uma modalidade
export function calcularRendimentoModalidade(
    modalidade: ModalidadeInvestimento,
    valorInicial: number,
    aporteMensal: number,
    prazoMeses: number
): { modalidade: ModalidadeInvestimento; rendimentoBruto: number; rendimentoLiquido: number; totalFinal: number } {
    const taxaMensal = modalidade.rentabilidadeMedia / 100 / 12;

    let montante = valorInicial;
    let totalAportes = valorInicial;

    for (let i = 0; i < prazoMeses; i++) {
        montante = montante * (1 + taxaMensal) + aporteMensal;
        totalAportes += aporteMensal;
    }

    const rendimentoBruto = montante - totalAportes;
    const ir = rendimentoBruto * (modalidade.tributacao / 100);
    const rendimentoLiquido = rendimentoBruto - ir;

    return {
        modalidade,
        rendimentoBruto,
        rendimentoLiquido,
        totalFinal: totalAportes + rendimentoLiquido
    };
}
