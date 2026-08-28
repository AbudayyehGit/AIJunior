import React from 'react';
import { RocketLogo } from './RocketLogo';

interface SailboatLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'tekhelet';
}

export const SailboatLogo: React.FC<SailboatLogoProps> = (props) => {
  return <RocketLogo {...props} />;
};

