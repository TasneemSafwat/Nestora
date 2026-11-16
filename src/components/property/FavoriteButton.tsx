import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { useLanguage } from '../../i18n';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

interface FavoriteButtonProps {
  propertyId: string;
  propertyName: string;
  className?: string;
  tone?: 'surface' | 'ghost';
}

/** Toggles a saved property and reports the change through a toast. */
export function FavoriteButton({ propertyId, propertyName, className, tone = 'surface' }: FavoriteButtonProps) {
  const { has, toggle } = useFavorites();
  const { t } = useLanguage();
  const toast = useToast();
  const saved = has(propertyId);

  const onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const next = toggle(propertyId);
    toast.info(next ? t('toast.favoriteAdded') : t('toast.favoriteRemoved'));
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={t(saved ? 'a11y.removeFavorite' : 'a11y.addFavorite', { name: propertyName })}
      title={t(saved ? 'a11y.removeFavorite' : 'a11y.addFavorite', { name: propertyName })}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300',
        tone === 'surface'
          ? 'border border-line bg-surface/92 text-ink backdrop-blur-sm hover:border-ink'
          : 'text-canvas hover:bg-canvas/15',
        saved && 'text-accent',
        className
      )}
    >
      <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}

export default FavoriteButton;
