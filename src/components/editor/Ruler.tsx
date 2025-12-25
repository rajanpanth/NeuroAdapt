interface RulerProps {
  type: 'horizontal' | 'vertical';
  size: number;
  zoom: number;
}

export const Ruler = ({ type, size, zoom }: RulerProps) => {
  const scaledSize = size * (zoom / 100);
  const tickInterval = 50; // pixels between major ticks
  const numTicks = Math.ceil(scaledSize / tickInterval);

  if (type === 'horizontal') {
    return (
      <div 
        className="h-5 bg-muted/50 border-b border-border flex items-end overflow-hidden"
        style={{ width: scaledSize }}
      >
        {Array.from({ length: numTicks + 1 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center"
            style={{ 
              position: 'absolute',
              left: i * tickInterval,
            }}
          >
            <span className="text-[8px] text-muted-foreground mb-0.5">
              {Math.round((i * tickInterval * 100) / zoom / 96 * 2.54 * 10) / 10}
            </span>
            <div className="w-px h-2 bg-border" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="w-5 bg-muted/50 border-r border-border flex flex-col overflow-hidden"
      style={{ height: scaledSize }}
    >
      {Array.from({ length: numTicks + 1 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center"
          style={{ 
            position: 'absolute',
            top: i * tickInterval,
          }}
        >
          <span 
            className="text-[8px] text-muted-foreground mr-0.5"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {Math.round((i * tickInterval * 100) / zoom / 96 * 2.54 * 10) / 10}
          </span>
          <div className="h-px w-2 bg-border" />
        </div>
      ))}
    </div>
  );
};
