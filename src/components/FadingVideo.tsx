import React, { useEffect, useRef } from "react";

interface FadingVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function FadingVideo({ src, className, style }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);

  const FADE_MS = 500;

  const fadeTo = (target: number, duration: number) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const video = videoRef.current;
    if (!video) return;

    // Read current opacity or default to 0 if not set yet or invalid
    const currentStyleOpacity = video.style.opacity;
    const startOpacity = currentStyleOpacity !== "" ? parseFloat(currentStyleOpacity) : 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = startOpacity + (target - startOpacity) * progress;
      
      video.style.opacity = currentOpacity.toFixed(3);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  const handleLoadedData = () => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = "0";
    video.play().catch((err) => {
      console.warn("Video play failed or auto-play blocked by browser policy:", err);
    });
    fadeTo(1, FADE_MS);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration;
    const currentTime = video.currentTime;

    if (!duration || isNaN(duration)) return;

    const timeLeft = duration - currentTime;

    // FADE_OUT_LEAD = 0.55s
    if (!fadingOutRef.current && timeLeft <= 0.55 && timeLeft > 0) {
      fadingOutRef.current = true;
      fadeTo(0, FADE_MS);
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = "0";

    setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;

      v.currentTime = 0;
      v.play()
        .then(() => {
          fadingOutRef.current = false;
          fadeTo(1, FADE_MS);
        })
        .catch((err) => {
          console.warn("Video loop play failed:", err);
          fadingOutRef.current = false;
        });
    }, 100);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{
        opacity: 0, // Starts with opacity 0
        transition: "none", // No CSS transition transitions - programmatic crossfade
        ...style,
      }}
      muted
      playsInline
      preload="auto"
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
}
