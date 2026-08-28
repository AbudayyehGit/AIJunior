import React from 'react';
import { SailboatLogo } from './SailboatLogo';

interface RocketLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const RocketLogo: React.FC<RocketLogoProps> = (props) => {
  return <SailboatLogo {...props} />;
};

