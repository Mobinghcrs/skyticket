import React, { useState, useEffect } from 'react';
import { getReliableAirlineLogo, generateDynamicAirlineEmblem } from '../src/utils/airlineEmblems';

export interface SafeAirlineLogoProps {
  logoUrl?: string;
  airline?: string;
  size?: string;
  imgSize?: string;
  border?: boolean;
  className?: string;
}

export const SafeAirlineLogo: React.FC<SafeAirlineLogoProps> = ({
  logoUrl,
  airline = 'Airline',
  size = 'w-10 h-10',
  imgSize = 'h-full w-full',
  border = true,
  className = ''
}) => {
  const initial = getReliableAirlineLogo(airline, logoUrl);
  const [currentSrc, setCurrentSrc] = useState<string>(initial);
  const [triedProxy, setTriedProxy] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(getReliableAirlineLogo(airline, logoUrl));
    setTriedProxy(false);
  }, [airline, logoUrl]);

  const handleError = () => {
    // If direct link failed, attempt same-origin server proxy
    if (!triedProxy && currentSrc.startsWith('http')) {
      setTriedProxy(true);
      setCurrentSrc(`/api/assets/proxy?url=${encodeURIComponent(currentSrc)}`);
      return;
    }
    // Fallback to dynamic SVG
    const fallback = generateDynamicAirlineEmblem(airline);
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
  };

  return (
    <div 
      className={`${size} ${border ? 'rounded-xl bg-white border border-slate-200 shadow-2xs p-1' : ''} flex items-center justify-center overflow-hidden shrink-0 ${className}`}
    >
      <img
        src={currentSrc}
        alt={airline || 'Airline'}
        className={`${imgSize} object-contain`}
        loading="eager"
        decoding="sync"
        referrerPolicy="no-referrer"
        onError={handleError}
      />
    </div>
  );
};

export default SafeAirlineLogo;
