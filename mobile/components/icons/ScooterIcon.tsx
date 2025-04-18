import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ScooterIconProps {
  color?: string;
  size?: number;
}

export function ScooterIcon({ color = 'white', size = 24 }: ScooterIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      <Path
        fill={color}
        d="M212 136c-1.18 0-2.35.06-3.51.17l-32.9-98.7A8 8 0 0 0 168 32h-32a8 8 0 0 0 0 16h26.23l17.44 52.31L124.21 168H79.77a36 36 0 1 0-1.83 16H128a8 8 0 0 0 6.19-2.93l51.46-62.81l7.66 23A36 36 0 1 0 212 136M44 192a20 20 0 1 1 20-20a20 20 0 0 1-20 20m168 0a20 20 0 1 1 20-20a20 20 0 0 1-20 20"
      />
    </Svg>
  );
}
