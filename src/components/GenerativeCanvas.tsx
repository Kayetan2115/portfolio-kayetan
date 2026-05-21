import { useEffect, useRef } from 'react';

export default function GenerativeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const particleCount = Math.min(45, Math.floor((width * height) / 25000));

    // Colors that look futuristic (deep blue, cyan, dark purple, neon violet)
    const colors = [
      'rgba(56, 189, 248, 0.25)', // Sky cyan
      'rgba(139, 92, 246, 0.25)', // Violet
      'rgba(99, 102, 241, 0.2)',  // Indigo
      'rgba(244, 63, 94, 0.15)',  // Rose
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === canvas) {
          width = canvas.width = entry.contentRect.width;
          height = canvas.height = entry.contentRect.height;
        }
      }
    });
    
    // Parent element observation
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Render connection lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Draw connections if nodes are close
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Mouse connection to particles
        if (mouse.x > -1000) {
          const mDx = p1.x - mouse.x;
          const mDy = p1.y - mouse.y;
          const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
          if (mDist < 180) {
            const alpha = (1 - mDist / 180) * 0.18;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`; // sky-400
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Sligthly attract particles to cursor
            p1.vx += (mDx / mDist) * -0.015;
            p1.vy += (mDy / mDist) * -0.015;
          }
        }

        // Draw particle
        ctx.fillStyle = p1.color;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        // Update physics
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Friction/drag to limit extreme speeds
        p1.vx *= 0.98;
        p1.vy *= 0.98;

        // Random jitter
        p1.vx += (Math.random() - 0.5) * 0.05;
        p1.vy += (Math.random() - 0.5) * 0.05;

        // Boundary checks with bounce
        if (p1.x < 0) { p1.x = 0; p1.vx *= -1; }
        if (p1.x > width) { p1.x = width; p1.vx *= -1; }
        if (p1.y < 0) { p1.y = 0; p1.vy *= -1; }
        if (p1.y > height) { p1.y = height; p1.vy *= -1; }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      id="generative-ambient-bg"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto opacity-70"
    />
  );
}
