import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { WorkGrid } from "@/components/WorkGrid";
import { EditableText } from "@/components/EditableText";

export default function Home() {
  return <><Hero /><section className="manifesto"><Reveal><p className="eyebrow">( ABOUT MY PRACTICE )</p><h2><EditableText contentKey="home-about" fallback="I make visual experiences that invite a second look." /></h2></Reveal><Reveal delay={.12} className="manifesto-note"><p><EditableText contentKey="home-description" fallback="My work moves between identity, typography and image-making. I like systems with a pulse — precise enough to hold together, open enough to surprise." /></p><span>DESIGN STUDENT / SEOUL</span></Reveal></section><WorkGrid /><footer><span><EditableText contentKey="home-footer" fallback="LET'S MAKE SOMETHING WITH A LITTLE TENSION." /></span><a href="mailto:hello@example.com"><EditableText contentKey="home-email" fallback="HELLO@EXAMPLE.COM" /> ↗</a></footer></>;
}
