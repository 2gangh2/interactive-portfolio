"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (cursor.current) cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div className="cursor" ref={cursor}><span /></div>;
}
