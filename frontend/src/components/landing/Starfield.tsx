import React, { useEffect, useRef } from "react";

interface StarfieldProps {}

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  phase: number;
  color: string;
}

export default function Starfield({}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize stars
    const initStars = () => {
      stars = [];
      const numStars = Math.floor((width * height) / 8000);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 0.8 + 0.2,
          twinkleSpeed: 0.005 + Math.random() * 0.015,
          phase: Math.random() * Math.PI * 2,
          color:
            Math.random() > 0.95
              ? "rgba(172, 199, 255, 0.5)" // Soft Cyan / Blue accent
              : Math.random() > 0.98
              ? "rgba(255, 179, 176, 0.5)" // Rose / Red accent
              : "rgba(255, 255, 255, 0.4)", // White
        });
      }
    };

    initStars();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw deep-space background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Animate stars
      for (const star of stars) {
        star.phase += star.twinkleSpeed;
        const alpha = 0.1 + Math.abs(Math.sin(star.phase)) * 0.4;

        ctx.fillStyle = star.color.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw very faint orbital lines matching space maps
      ctx.strokeStyle = "rgba(172, 199, 255, 0.02)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
