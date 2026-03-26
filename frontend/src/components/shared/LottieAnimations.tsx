"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  src: string;
  className?: string;
}

export default function LottieAnimation({ src, className }: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(src)
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, [src]);

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      loop
      className={className}
    />
  );
}