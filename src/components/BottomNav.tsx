import { Calculator, TrendingUp, Settings, Wallet, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useNavbarVisibility } from '../hooks/useNavbarVisibility';

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
  { id: 'config', label: 'Ajustes', icon: Settings, path: '/configuracoes' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isVisible } = useNavbarVisibility();

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pb-safe lg:hidden shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]",
      "transition-all duration-300 ease-in-out",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
    )}>
      <div className="flex items-center justify-around h-14 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'relative flex items-center justify-center w-12 h-12 rounded-xl',
                'transition-all duration-300 ease-out active:scale-95',
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              title={item.label}
            >
              <Icon className={cn(
                "w-6 h-6 transition-all duration-300",
                isActive ? "stroke-[2.5px] scale-110" : "stroke-2"
              )} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
