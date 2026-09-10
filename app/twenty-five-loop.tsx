'use client';

import { useEffect, useState } from 'react';

type LoopPhotograph = {
  id: string;
  alt: string;
  width: number;
  height: number;
};

export default function TwentyFiveLoop({ photographs, sourceBase }: { photographs: LoopPhotograph[]; sourceBase: string }) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    for (const photograph of photographs) {
      const image = new Image();
      image.src = `${sourceBase}/${photograph.id}.jpg`;
    }
  }, [photographs, sourceBase]);

  useEffect(() => {
    if (!playing || photographs.length < 2) return;
    const interval = window.setInterval(() => {
      setFrame(current => (current + 1) % photographs.length);
    }, 100);
    return () => window.clearInterval(interval);
  }, [photographs.length, playing]);

  const photograph = photographs[frame];
  if (!photograph) return null;

  return (
    <figure className="twenty-five-loop">
      <div className="twenty-five-loop-frame">
        <img
          src={`${sourceBase}/${photograph.id}.jpg`}
          alt={photograph.alt}
          width={photograph.width}
          height={photograph.height}
        />
      </div>
      <figcaption>
        <span>Loop · 25 frames · 2.5 seconds</span>
        <button type="button" onClick={() => setPlaying(value => !value)}>{playing ? 'Pause' : 'Play'}</button>
      </figcaption>
    </figure>
  );
}
