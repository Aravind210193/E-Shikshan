import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useNavigate, Link } from "react-router-dom";
import TextType from "./TextType";
// --- CONFIGURATION ---
const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "132, 0, 255"; // Purple glow
const MOBILE_BREAKPOINT = 768;

// --- CARD DATA ---
const cardData = [
  {
    title: "Courses",
    description: "Learn AI, ML, Data Analytics & more with structured courses.",
    path: "/courses",
  },
  {
    title: "Hackathons",
    description: "Participate in coding challenges & improve your skills.",
    path: "/hackathons",
  },
  {
    title: "Job Roles",
    description: "Explore different tech roles & required skills.",
    path: "/jobrole",
  },
  {
    title: "Roadmaps",
    description: "Step-by-step guides for your tech career path.",
    path: "/roadmaps",
  },
  {
    title: "Content Library",
    description: "Access PDFs, videos, quizzes & more learning materials.",
    path: "/content",
  },
  {
    title: "Resume-Builder",
    description: "Build your resume instantly.",
    path: "/resume",
  },
];


// --- HELPER FUNCTIONS & HOOKS (Unchanged) ---

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
};


// --- CORE COMPONENTS (ParticleCard, GlobalSpotlight) ---

const ParticleCard = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
  onClick,
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => particle.parentNode?.removeChild(particle),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
        gsap.to(clone, { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: "none", repeat: -1, yoyo: true });
        gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true });
      }, index * 100);
      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      if (enableTilt) gsap.to(element, { rotateX: 5, rotateY: 5, duration: 0.3, ease: "power2.out", transformPerspective: 1000 });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      if (enableTilt) gsap.to(element, { rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
      if (enableMagnetism) gsap.to(element, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    };

    const handleMouseMove = (e) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        gsap.to(element, { rotateX, rotateY, duration: 0.1, ease: "power2.out", transformPerspective: 1000 });
      }
      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;
        magnetismAnimationRef.current = gsap.to(element, { x: magnetX, y: magnetY, duration: 0.3, ease: "power2.out" });
      }
    };

    const handleClick = (e) => {
      if (onClick) onClick(e);
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
      const ripple = document.createElement("div");
      ripple.style.cssText = `position: absolute; width: ${maxDistance * 2}px; height: ${maxDistance * 2}px; border-radius: 50%; background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%); left: ${x - maxDistance}px; top: ${y - maxDistance}px; pointer-events: none; z-index: 1000;`;
      element.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ripple.remove() });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);
    element.addEventListener("touchend", handleClick); // Add touch support

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      element.removeEventListener("touchend", handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onClick]);

  return (
    <div ref={cardRef} className={`${className} relative overflow-hidden`} style={{ ...style, position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  );
};

const GlobalSpotlight = ({ gridRef, disableAnimations = false, enabled = true, spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS, glowColor = DEFAULT_GLOW_COLOR }) => {
  const spotlightRef = useRef(null);
  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `position: fixed; width: ${spotlightRadius * 2}px; height: ${spotlightRadius * 2}px; border-radius: 50%; pointer-events: none; background: radial-gradient(circle, rgba(${glowColor}, 0.15) 0%, transparent 70%); z-index: 200; opacity: 0; transform: translate(-50%, -50%); mix-blend-mode: screen;`;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e) => {
      if (!spotlightRef.current || !gridRef.current) return;
      const cards = gridRef.current.querySelectorAll(".card");
      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        minDistance = Math.min(minDistance, distance);
        const glowIntensity = Math.max(0, 1 - (Math.max(0, distance - proximity)) / fadeDistance);
        updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: "power2.out" });
      const targetOpacity = Math.max(0, 1 - (minDistance / fadeDistance)) * 0.8;
      gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: 0.2, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll(".card").forEach((card) => card.style.setProperty("--glow-intensity", "0"));
      if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      spotlightRef.current?.remove();
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

    
// --- MAIN COMPONENT ---

const Features = ({
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations: forceDisableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = forceDisableAnimations || isMobile;
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: ${spotlightRadius}px;
            --glow-color: ${glowColor};
            --border-color: #392e4e;
            --background-dark: #060010;
          }
          
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px; /* Border thickness */
            background: radial-gradient(
              var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(var(--glow-color), calc(var(--glow-intensity) * 0.6)) 0%,
              transparent 70%
            );
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: xor;
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      {/* Main Grid Layout */}
      <div
        ref={gridRef}
        className="bento-section grid grid-cols-1 md:grid-cols-3 gap-2 px-6 max-w-4xl mx-auto"
      >
        {cardData.map((card, index) => {
          const cardClassName = `
            card p-5 rounded-[20px] border border-[3px]
            hover:shadow-xl transition-all duration-300 font-light
            cursor-pointer flex flex-col justify-between min-h-[200px] aspect-[4/3]
            touch-manipulation select-none
            ${enableBorderGlow ? "card--border-glow" : ""}
          `;

          const cardStyle = {
            backgroundColor: "var(--background-dark)",
            borderColor: "var(--border-color)",
            "--glow-x": "50%",
            "--glow-y": "50%",
            "--glow-intensity": "0",
            "--glow-radius": `${spotlightRadius}px`,
          };

          const cardContent = (
            <>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white">
                  {card.title}
                </h3>
                <TextType 
                  text={[card.description,card.description]}
                  typingSpeed={60}
                  pauseDuration={2500}
                  showCursor={true}
                  cursorCharacter="|"
                />
                {/* <p className="mt-2 text-gray-400">
                  {card.description}
                </p> */}
              </div>
              <span className="inline-block mt-4 text-yellow-400 hover:underline relative z-10">
                Explore
              </span>
            </>
          );

          if (enableStars) {
            return (
              <Link to={card.path} key={index} className="block">
                <ParticleCard
                  className={cardClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  {cardContent}
                </ParticleCard>
              </Link>
            );
          }

          // Fallback for when stars are disabled
          return (
            <Link to={card.path} key={index} className="block">
              <div
                className={`${cardClassName} relative overflow-hidden`}
                style={cardStyle}
              >
                {cardContent}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Features;
