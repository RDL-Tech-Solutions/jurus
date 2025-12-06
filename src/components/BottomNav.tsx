import { Calculator, Target, TrendingUp, Settings, Wallet, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

// Labels simples e claros para usuários leigos
const navItems: NavItem[] = [
  { id: 'home', label: 'Calcular', icon: Calculator, path: '/' },
  { id: 'comparacao', label: 'Comparar', icon: TrendingUp, path: '/comparacao' },
  { id: 'planejamento', label: 'Planejar', icon: Wallet, path: '/planejamento' },
  { id: 'fluxo', label: 'Fluxo', icon: BarChart3, path: '/fluxo' },
  { id: 'metas', label: 'Metas', icon: Target, path: '/metas' },
  { id: 'config', label: 'Ajustes', icon: Settings, path: '/configuracoes' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pb-safe lg:hidden shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around h-16 px-1 max-[360px]:px-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'relative flex flex-col items-center justify-center w-full h-full',
                'transition-all duration-300 ease-out active:scale-95',
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Indicador de Ativo (Glow Superior) */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-b-full shadow-[0_2px_8px_rgba(37,99,235,0.4)] animate-in fade-in zoom-in duration-300" />
              )}

              <div className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "-translate-y-0.5" : ""
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive ? "stroke-[2.5px] drop-shadow-sm" : "stroke-2"
                )} />
                <span className={cn(
                  "text-[10px] max-[360px]:text-[9px] font-medium leading-none transition-all duration-300",
                  isActive ? "font-bold" : "font-medium"
                )}>
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
