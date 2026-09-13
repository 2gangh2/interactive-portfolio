"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { EditableText } from "@/components/EditableText";

export function Hero() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });
  const slowX = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const slowY = useTransform(sy, [-0.5, 0.5], [-10, 10]);
  const fastX = useTransform(sx, [-0.5, 0.5], [20, -20]);
  const fastY = useTransform(sy, [-0.5, 0.5], [14, -14]);
  return (
    <section className="hero" onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); x.set((event.clientX - rect.left) / rect.width - .5); y.set((event.clientY - rect.top) / rect.height - .5); }}>
      <div className="hero-top"><span>PORTFOLIO / 2026</span><span>SEOUL, KR</span></div>
      <motion.div className="orb orb-one" style={{ x: slowX, y: slowY }} />
      <motion.div className="orb orb-two" style={{ x: fastX, y: fastY }} />
      <motion.div className="hero-sticker" style={{ x: fastX, y: fastY }}><span>MOVE</span><span>WITH</span><span>CURSOR</span></motion.div>
      <div className="hero-copy">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2, duration: .8 }}><EditableText contentKey="home-intro" fallback="Visual designer exploring identities, image-making and playful systems." /></motion.p>
        <h1><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}><EditableText contentKey="home-name-first" fallback="GANG" /></motion.span><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: .9, delay: .08, ease: [0.16, 1, 0.3, 1] }}><EditableText contentKey="home-name-last" fallback="HUI" /></motion.span></h1>
      </div>
      <Link href="#work" className="hero-scroll">SCROLL TO EXPLORE <i>↓</i></Link>
    </section>
  );
}
