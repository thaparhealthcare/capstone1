import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <main className="h-screen relative bg-zinc-100 p-4 overflow-hidden">
      <Particles />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full py-8 px-12">
        <nav className="flex justify-between">
          <div className="flex gap-2 items-center text-xl font-semibold">
            <div className="size-12 rounded-full overflow-hidden">
              <img
                src="/tiet_logo.jpg"
                className="w-full h-full object-cover"
              />
            </div>
            <h1>TIET MediHub</h1>
          </div>
          <NavLink to="/auth">
            <button className="border border-black px-4 py-2 rounded-full">
              Get Started
            </button>
          </NavLink>
        </nav>

        {/* <p>
          "Your Health, Our Commitment — Providing Trusted Medical Care and
          Support to Keep the Campus Community Healthy and Thriving."
        </p> */}
      </div>
    </main>
  );
}

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3,
        color: Math.random() > 0.5 ? "#ff69b4" : "#4169e1",
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-2xl bg-gray-50"
      />
    </div>
  );
};
