interface WaveDividerProps {
  fromColor: string;
  toColor: string;
  variant?: 'gentle' | 'flow' | 'swell';
  accent?: boolean;
}

const WAVE_PATHS = {
  gentle:
    'M0,128L60,138.7C120,149,240,171,360,165.3C480,160,600,128,720,122.7C840,117,960,139,1080,154.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z',
  flow:
    'M0,96L48,117.3C96,139,192,181,288,186.7C384,192,480,160,576,138.7C672,117,768,107,864,122.7C960,139,1056,181,1152,176C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
  swell:
    'M0,160L60,144C120,128,240,96,360,106.7C480,117,600,171,720,181.3C840,192,960,160,1080,133.3C1200,107,1320,85,1380,74.7L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z',
};

export function WaveDivider({
  fromColor,
  toColor,
  variant = 'gentle',
  accent = true,
}: WaveDividerProps) {
  const path = WAVE_PATHS[variant];
  return (
    <div
      className="pointer-events-none relative -mt-px w-full overflow-hidden leading-none"
      style={{ backgroundColor: fromColor }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="block h-12 w-full sm:h-16 md:h-20"
      >
        {accent && (
          <path
            fill="#455CE9"
            fillOpacity="0.18"
            transform="translate(0, -10)"
            d={path}
          />
        )}
        <path fill={toColor} fillOpacity="1" d={path} />
      </svg>
    </div>
  );
}
