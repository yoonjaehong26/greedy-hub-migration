interface Props {
  count: number;
  current: number;
  onSelect: (i: number) => void;
}

export function PageDots({ count, current, onSelect }: Props) {
  if (count <= 1) return null;

  return (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`페이지 ${i + 1}`}
          className={`rounded-full transition-all duration-200 ${
            i === current
              ? 'w-4 h-2 bg-brand'
              : 'w-2 h-2 bg-slate-300 dark:bg-white/30 hover:bg-slate-400 dark:hover:bg-white/50'
          }`}
        />
      ))}
    </div>
  );
}
