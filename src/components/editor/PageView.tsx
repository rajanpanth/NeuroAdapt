interface PageViewProps {
  children: React.ReactNode;
  pageSize: 'a4' | 'letter';
  margins: 'normal' | 'narrow' | 'wide';
  orientation: 'portrait' | 'landscape';
  zoom: number;
}

const pageDimensions = {
  a4: { width: 794, height: 1123 }, // 210mm x 297mm at 96dpi
  letter: { width: 816, height: 1056 }, // 8.5" x 11" at 96dpi
};

const marginSizes = {
  normal: { top: 72, right: 72, bottom: 72, left: 72 }, // 1 inch
  narrow: { top: 36, right: 36, bottom: 36, left: 36 }, // 0.5 inch
  wide: { top: 72, right: 144, bottom: 72, left: 144 }, // 1" top/bottom, 1.5" left/right
};

export const PageView = ({
  children,
  pageSize,
  margins,
  orientation,
  zoom,
}: PageViewProps) => {
  const baseDimensions = pageDimensions[pageSize];
  const marginValues = marginSizes[margins];

  const width = orientation === 'portrait' ? baseDimensions.width : baseDimensions.height;
  const height = orientation === 'portrait' ? baseDimensions.height : baseDimensions.width;

  const scaledWidth = (width * zoom) / 100;
  const scaledHeight = (height * zoom) / 100;
  const scaledMargins = {
    top: (marginValues.top * zoom) / 100,
    right: (marginValues.right * zoom) / 100,
    bottom: (marginValues.bottom * zoom) / 100,
    left: (marginValues.left * zoom) / 100,
  };

  return (
    <div
      className="bg-card shadow-lg mx-auto"
      style={{
        width: scaledWidth,
        minHeight: scaledHeight,
        padding: `${scaledMargins.top}px ${scaledMargins.right}px ${scaledMargins.bottom}px ${scaledMargins.left}px`,
      }}
    >
      {children}
    </div>
  );
};

export { pageDimensions, marginSizes };
