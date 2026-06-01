"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Check if it's a touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      cursor.style.display = "none";
      follower.style.display = "none";
      return;
    }

    // Initialize positions and hardware acceleration
    gsap.set([cursor, follower], {
      xPercent: 0,
      yPercent: 0,
      force3D: true,
      opacity: 0
    });

    const xSetter = gsap.quickSetter(cursor, "x", "px");
    const ySetter = gsap.quickSetter(cursor, "y", "px");

    const xTo = gsap.quickTo(follower, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(follower, "y", {
      duration: 0.5,
      ease: "power3.out",
    });

    let isVisible = false;
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      if (!isVisible) {
        gsap.to([cursor, follower], { opacity: 1, duration: 0.3 });
        isVisible = true;
      }

      // Smoothly update positions
      xSetter(clientX);
      ySetter(clientY);
      xTo(clientX);
      yTo(clientY);

      // Optimized hover detection using event delegation logic
      const target = e.target as HTMLElement;
      const hoverTarget = target.closest(
        'a, button, input, textarea, select, [role="button"], .pointer-events-auto, .hero-socials a, .tech-icon'
      );

      if (hoverTarget && !isHovering) {
        isHovering = true;
        gsap.to(cursor, { scale: 0, duration: 0.3, ease: "power2.out" });
        gsap.to(follower, {
          scale: 1.5,
          borderColor: "rgba(139, 92, 246, 0.8)",
          backgroundColor: "rgba(139, 92, 246, 0.15)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else if (!hoverTarget && isHovering) {
        isHovering = false;
        gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(follower, {
          scale: 1,
          borderColor: "rgba(139, 92, 246, 0.4)",
          backgroundColor: "transparent",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to([cursor, follower], { opacity: 0, duration: 0.3 });
      isVisible = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-white dark:bg-primary-500 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ willChange: "transform, opacity" }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 border border-primary-500/40 rounded-full pointer-events-none z-[9998] transition-colors duration-300 hidden md:block"
        style={{ willChange: "transform, opacity" }}
      />
    </>
  );
}
