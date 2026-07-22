import { RarityTierData } from '@/types';

interface RarityBadgeProps {
  rarityTier: RarityTierData | null;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'pill' | 'outline';
}

export const RarityBadge = ({ rarityTier, size = 'md', variant = 'badge' }: RarityBadgeProps) => {
  if (!rarityTier) return <span className="text-xs text-ghost italic">No Rarity</span>;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  };

  const variantClasses = {
    badge: `${rarityTier.bgColor} ${rarityTier.textColor} rounded-sm uppercase tracking-widest font-bold`,
    pill: `${rarityTier.bgColor} ${rarityTier.textColor} rounded-full font-bold`,
    outline: `border border-current ${rarityTier.textColor} bg-transparent rounded-md uppercase tracking-wider font-semibold`
  };

  // If badgeStyle is gradient, we might need a special case, but we can assume bgColor contains the full tailwind classes 
  // like 'bg-gradient-to-r from-amber-400 to-orange-500'. 
  let finalClass = `${sizeClasses[size]} ${variantClasses[variant]}`;
  
  if (rarityTier.badgeStyle === 'gradient') {
     // override badge classes slightly for gradient if needed, but if bgColor has the gradient classes it works out of the box.
     finalClass += ' shadow-sm';
  } else if (rarityTier.badgeStyle === 'outline') {
     finalClass = `${sizeClasses[size]} ${variantClasses.outline}`;
  }

  return (
    <span className={`inline-block ${finalClass}`}>
      {rarityTier.name}
    </span>
  );
};
