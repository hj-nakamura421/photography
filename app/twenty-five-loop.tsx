'use client';

import { useEffect, useState } from 'react';

type LoopPhotograph = {
  id: string;
  alt: string;
  width: number;
  height: number;
};

function shuffledCycle(photographs: LoopPhotograph[]) {
  const cycle = [...photographs];
  for (let index = cycle.length - 1; index > 0; index--) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [cycle[index], cycle[swapWith]] = [cycle[swapWith], cycle[index]];
  }
  return cycle;
}

export default function TwentyFiveLoop({ photographs, sourceBase }: { photographs: LoopPhotograph[]; sourceBase: string }) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [sequence, setSequence] = useState(photographs);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setSequence(Array.from({ length: 10 }, () => shuffledCycle(photographs)).flat());
      setFrame(0);
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [photographs]);

  useEffect(() => {
    for (const photograph of photographs) {
      const image = new Image();
      image.src = `${sourceBase}/${photograph.id}.jpg`;
    }
  }, [photographs, sourceBase]);

  useEffect(() => {
    if (!playing || sequence.length < 2) return;
    const interval = window.setInterval(() => {
      setFrame(current => (current + 1) % sequence.length);
    }, 150);
    return () => window.clearInterval(interval);
  }, [playing, sequence.length]);

  const photograph = sequence[frame];
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
        <span>Loop · 10 shuffled cycles · 37.5 seconds</span>
        <button type="button" onClick={() => setPlaying(value => !value)}>{playing ? 'Pause' : 'Play'}</button>
      </figcaption>
    </figure>
  );
}
