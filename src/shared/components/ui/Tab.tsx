export interface TabItemDef<T extends string = string> {
  value: T;
  label: string;
}

interface TabProps<T extends string = string> {
  items: TabItemDef<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Tab<T extends string = string>({ items, value, onChange, className = '' }: TabProps<T>) {
  return (
    <div className={`flex items-center gap-7 border-b border-neutral-200 ${className}`} role="tablist">
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={`relative pb-3 text-[15px] font-medium transition-colors ${
              active ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {item.label}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-brand" />
            )}
          </button>
        );
      })}
    </div>
  );
}
