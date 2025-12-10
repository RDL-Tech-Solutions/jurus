# Script PowerShell para Remover Hooks Antigos e Renomear V2 para V1
# Execute com: .\remover-hooks-antigos.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  REMOÇÃO DE HOOKS ANTIGOS (V1)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos na pasta correta
if (-not (Test-Path "src\hooks")) {
    Write-Host "ERRO: Pasta src\hooks não encontrada!" -ForegroundColor Red
    Write-Host "Execute este script na raiz do projeto." -ForegroundColor Red
    exit 1
}

Write-Host "1. Criando pasta de backup..." -ForegroundColor Yellow
$backupDir = "src\hooks\backup_v1_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "   ✓ Pasta criada: $backupDir" -ForegroundColor Green
Write-Host ""

# Lista de hooks para fazer backup e remover
$hooksAntigos = @(
    "useFluxoCaixa.ts",
    "useRecorrentes.ts",
    "useDividas.ts",
    "useCartaoCredito.ts"
)

Write-Host "2. Fazendo backup dos hooks antigos..." -ForegroundColor Yellow
foreach ($hook in $hooksAntigos) {
    $sourcePath = "src\hooks\$hook"
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath "$backupDir\$hook"
        Write-Host "   ✓ Backup: $hook" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ Não encontrado: $hook" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "3. Confirmação necessária!" -ForegroundColor Red
Write-Host "   Os seguintes hooks serão DELETADOS:" -ForegroundColor Yellow
foreach ($hook in $hooksAntigos) {
    Write-Host "   - $hook" -ForegroundColor White
}
Write-Host ""
$confirmacao = Read-Host "   Deseja continuar? (S/N)"

if ($confirmacao -ne "S" -and $confirmacao -ne "s") {
    Write-Host ""
    Write-Host "Operação cancelada pelo usuário." -ForegroundColor Yellow
    Write-Host "Backup mantido em: $backupDir" -ForegroundColor Cyan
    exit 0
}

Write-Host ""
Write-Host "4. Removendo hooks antigos..." -ForegroundColor Yellow
foreach ($hook in $hooksAntigos) {
    $sourcePath = "src\hooks\$hook"
    if (Test-Path $sourcePath) {
        Remove-Item $sourcePath -Force
        Write-Host "   ✓ Removido: $hook" -ForegroundColor Green
    }
}
Write-Host ""

# Lista de hooks V2 para renomear
$hooksV2 = @(
    @{Old = "useFluxoCaixaV2.ts"; New = "useFluxoCaixa.ts"},
    @{Old = "useRecorrentesV2.ts"; New = "useRecorrentes.ts"},
    @{Old = "useDividasV2.ts"; New = "useDividas.ts"},
    @{Old = "useCartaoCreditoV2.ts"; New = "useCartaoCredito.ts"}
)

Write-Host "5. Renomeando hooks V2 para V1..." -ForegroundColor Yellow
foreach ($hook in $hooksV2) {
    $oldPath = "src\hooks\$($hook.Old)"
    $newPath = "src\hooks\$($hook.New)"
    
    if (Test-Path $oldPath) {
        Rename-Item $oldPath $newPath
        Write-Host "   ✓ Renomeado: $($hook.Old) → $($hook.New)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ Não encontrado: $($hook.Old)" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "6. Atualizando imports nos componentes..." -ForegroundColor Yellow

# Lista de arquivos para atualizar imports
$arquivosParaAtualizar = @(
    "src\components\FluxoCaixa.tsx",
    "src\features\transacoes\hooks\useTransacoes.ts",
    "src\features\transacoes\components\CardPrevisaoMes.tsx",
    "src\features\transacoes\components\CardEconomiaMensal.tsx",
    "src\features\transacoes\components\CardDividasPendentes.tsx",
    "src\features\transacoes\components\CardCartoesCredito.tsx",
    "src\features\transacoes\components\CardRecorrentes.tsx",
    "src\features\transacoes\components\CardMetasMes.tsx",
    "src\features\cards\hooks\useCards.ts"
)

$substituicoes = @{
    "useFluxoCaixaV2" = "useFluxoCaixa"
    "useRecorrentesV2" = "useRecorrentes"
    "useDividasV2" = "useDividas"
    "useCartaoCreditoV2" = "useCartaoCredito"
}

$arquivosAtualizados = 0
foreach ($arquivo in $arquivosParaAtualizar) {
    if (Test-Path $arquivo) {
        $conteudo = Get-Content $arquivo -Raw
        $conteudoOriginal = $conteudo
        
        foreach ($sub in $substituicoes.GetEnumerator()) {
            $conteudo = $conteudo -replace $sub.Key, $sub.Value
        }
        
        if ($conteudo -ne $conteudoOriginal) {
            Set-Content $arquivo $conteudo -NoNewline
            $arquivosAtualizados++
            Write-Host "   ✓ Atualizado: $arquivo" -ForegroundColor Green
        }
    } else {
        Write-Host "   ⚠ Não encontrado: $arquivo" -ForegroundColor Yellow
    }
}
Write-Host "   Total de arquivos atualizados: $arquivosAtualizados" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  PROCESSO CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Resumo:" -ForegroundColor Cyan
Write-Host "  ✓ Backup criado em: $backupDir" -ForegroundColor White
Write-Host "  ✓ Hooks antigos removidos: $($hooksAntigos.Count)" -ForegroundColor White
Write-Host "  ✓ Hooks V2 renomeados: $($hooksV2.Count)" -ForegroundColor White
Write-Host "  ✓ Arquivos atualizados: $arquivosAtualizados" -ForegroundColor White
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Execute: npm run dev" -ForegroundColor White
Write-Host "  2. Teste todas as funcionalidades" -ForegroundColor White
Write-Host "  3. Verifique se não há erros" -ForegroundColor White
Write-Host "  4. Se tudo estiver OK, delete a pasta de backup" -ForegroundColor White
Write-Host ""
Write-Host "Se algo der errado:" -ForegroundColor Red
Write-Host "  - Restaure do backup: $backupDir" -ForegroundColor White
Write-Host ""
