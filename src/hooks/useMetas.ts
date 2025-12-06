import { useState, useEffect, useCallback } from 'react';
import { MetaGasto } from '../types/fluxoCaixa';

const STORAGE_KEY = 'jurus_metas';

export function useMetas() {
    const [metas, setMetas] = useState<MetaGasto[]>([]);
    const [carregado, setCarregado] = useState(false);

    // Carregar metas do localStorage
    useEffect(() => {
        const metasSalvas = localStorage.getItem(STORAGE_KEY);
        if (metasSalvas) {
            setMetas(JSON.parse(metasSalvas));
        }
        setCarregado(true);
    }, []);

    // Salvar no localStorage sempre que mudar
    useEffect(() => {
        if (carregado) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(metas));
        }
    }, [metas, carregado]);

    const adicionarMeta = useCallback((novaMeta: Omit<MetaGasto, 'id' | 'criadoEm'>) => {
        const meta: MetaGasto = {
            ...novaMeta,
            id: `meta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            criadoEm: new Date().toISOString()
        };
        setMetas(prev => [...prev, meta]);
        return meta;
    }, []);

    const editarMeta = useCallback((id: string, dados: Partial<MetaGasto>) => {
        setMetas(prev => prev.map(meta =>
            meta.id === id ? { ...meta, ...dados } : meta
        ));
    }, []);

    const excluirMeta = useCallback((id: string) => {
        setMetas(prev => prev.filter(meta => meta.id !== id));
    }, []);

    const obterMetaAtual = useCallback((categoriaId: string) => {
        const agora = new Date();
        const mes = agora.getMonth() + 1;
        const ano = agora.getFullYear();

        return metas.find(m =>
            m.categoriaId === categoriaId &&
            m.mes === mes &&
            m.ano === ano
        );
    }, [metas]);

    const verificarMeta = useCallback((categoriaId: string, valorGasto: number) => {
        const meta = obterMetaAtual(categoriaId);
        if (!meta) return null;

        const percentual = (valorGasto / meta.limite) * 100;
        const atingiu80 = percentual >= 80 && percentual < 100;
        const ultrapassou = percentual >= 100;

        return {
            meta,
            valorGasto,
            percentual,
            atingiu80: atingiu80 && meta.alertar80,
            ultrapassou: ultrapassou && meta.alertar100,
            status: ultrapassou ? 'ultrapassado' : atingiu80 ? 'atencao' : 'ok'
        };
    }, [metas, obterMetaAtual]);

    const obterMetasDoMes = useCallback((mes?: number, ano?: number) => {
        const agora = new Date();
        const mesAlvo = mes ?? agora.getMonth() + 1;
        const anoAlvo = ano ?? agora.getFullYear();

        return metas.filter(m => m.mes === mesAlvo && m.ano === anoAlvo);
    }, [metas]);

    return {
        metas,
        carregado,
        adicionarMeta,
        editarMeta,
        excluirMeta,
        obterMetaAtual,
        verificarMeta,
        obterMetasDoMes
    };
}
