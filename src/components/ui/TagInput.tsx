import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  tagClassName?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Add tag...', className = '', tagClassName = '' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !tags.includes(val)) {
        onChange([...tags, val]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      e.preventDefault();
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className={`flex flex-wrap gap-2 items-center bg-transparent border border-subtle rounded-lg p-2 focus-within:border-terracotta/50 focus-within:ring-1 focus-within:ring-terracotta/20 transition-all ${className}`}>
      {tags.map((tag, index) => (
        <span 
          key={index} 
          className={`flex items-center gap-1 px-2 py-1 bg-terracotta/10 text-terracotta text-xs font-bold rounded-md border border-terracotta/20 ${tagClassName}`}
        >
          {tag}
          <button 
            type="button" 
            onClick={() => removeTag(index)}
            className="hover:text-red-500 transition-colors outline-none"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          const val = inputValue.trim();
          if (val && !tags.includes(val)) {
            onChange([...tags, val]);
          }
          setInputValue('');
        }}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-sm text-primary placeholder-ghost focus:ring-0 p-0"
      />
    </div>
  );
}
