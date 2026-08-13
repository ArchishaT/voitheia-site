import { useEffect, useRef, useState } from "react";

const PILLARS = [
  {
    title: "Real impact",
    text: "We take action that reaches people directly — not performative service, but hands-on work with visible outcomes.",
    path: "M12 21s-7.5-4.6-10-9.3C.5 8 2 4 6 4c2.2 0 3.7 1.2 6 3.6C14.3 5.2 15.8 4 18 4c4 0 5.5 4 4 7.7-2.5 4.7-10 9.3-10 9.3z",
  },
  {
    title: "Leadership",
    text: "Members plan, fund, and run projects themselves — building experience that carries well beyond school.",
    path: "M13 2 3 14h8l-1 8 10-12h-8l1-8z",
  },
  {
    title: "Connection",
    text: "A network of changemakers across grades and schools, working toward the same idea of what community can be.",
    path: "M8 12.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM17 11.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM2.5 20c.6-3.6 3-5.6 5.5-5.6s4.9 2 5.5 5.6M14.5 14.8c2.1.2 4 1.9 4.5 5.2",
  },
  {
    title: "Experience",
    text: "Hands-on projects and mentoring that translate directly into a stronger, more honest resume.",
    path: "M4 19.5V5.4C4 4 5.4 3 7.2 3h9.6C18.6 3 20 4 20 5.4v13.2c0 1.3-1.4 2.4-3.2 2.4H4ZM8 8h8M8 12h8M8 16h5",
  },
];

const PROJECTS = [
  {
    year: "2020",
    tag: "Project 01 — Heritage Homes",
    title: "The beginning",
    text: "Fifteen members, no funding, just collective effort. We gathered books, stationery, toys, chocolates and sweets, then spent the day in interactive games and activities that brought real joy to the children we met.",
  },
  {
    year: "2021",
    tag: "Project 02 — Little Saint's Girls Orphanage",
    title: "Growth and impact",
    text: "This project brought volunteers closer to girls their own age. Beyond supplies, we had heartfelt conversations that gave real insight into their lives — leaving a lasting impression of empathy on every volunteer involved.",
  },
  {
    year: "2023",
    tag: "Project 03 — Bab Es Salaam Orphanage",
    title: "Building a legacy",
    text: "Our largest project yet — more volunteers across more grades, and more funding to gather toys and resources. We ran sports and games so every child had a real shot at winning something for themselves.",
  },
];

const EXCOS = [
  { initials: "TB", name: "Tanisha Bajaj", role: "Co-founder" },
  { initials: "PM", name: "Priyal Murarka", role: "Co-founder" },
  { initials: "PB", name: "Prisha Bakshi", role: "Operations lead" },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ as: Tag = "div", delay = 0, className = "", children, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

function Counter({ target, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const duration = 1400;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

function MagneticButton({ href, className, children, target, rel }) {
  const ref = useRef(null);
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  }
  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
    >
      {children}
    </a>
  );
}

export default function VoitheiaSite() {
  const [scrolled, setScrolled] = useState(false);
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // custom cursor
  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    document.body.classList.add("voitheia-cursor-active");

    let mx = -100;
    let my = -100;
    let rx = mx;
    let ry = my;
    if (cursorDot.current) cursorDot.current.style.opacity = "0";
    if (cursorRing.current) cursorRing.current.style.opacity = "0";

    function onMouseMove(e) {
      mx = e.clientX;
      my = e.clientY;
      if (cursorDot.current) {
        cursorDot.current.style.transform = `translate(${mx}px, ${my}px)`;
        cursorDot.current.style.opacity = "1";
      }
      if (cursorRing.current) cursorRing.current.style.opacity = "0.6";
      const target = e.target;
      const interactive = target.closest && target.closest('a, button, [data-cursor="hover"]');
      if (cursorRing.current) {
        cursorRing.current.classList.toggle("is-hover", !!interactive);
      }
    }

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (cursorRing.current) {
        cursorRing.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMouseMove);
    const raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("voitheia-cursor-active");
    };
  }, []);

  // orb parallax
  const orb1 = useRef(null);
  const orb2 = useRef(null);
  useEffect(() => {
    function onMove(e) {
      const px = (e.clientX / window.innerWidth - 0.5) * 2;
      const py = (e.clientY / window.innerHeight - 0.5) * 2;
      if (orb1.current) orb1.current.style.transform = `translate(${px * -18}px, ${py * -14}px)`;
      if (orb2.current) orb2.current.style.transform = `translate(${px * 14}px, ${py * 12}px)`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // reset host page so the default Vite template (#root centering, dark
  // body background, max-width) doesn't cage or crop the site
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-voitheia-reset", "true");
    styleEl.textContent = `
      html, body { margin:0; padding:0; width:100%; min-height:100%; background:#FFF8F5; }
      #root { max-width:none !important; width:100%; margin:0; padding:0; text-align:left; display:block; }
      body { display:block !important; place-items:unset !important; }
      html::-webkit-scrollbar{ width:10px; height:10px; }
      html::-webkit-scrollbar-track{ background:transparent; }
      html::-webkit-scrollbar-thumb{
        background:linear-gradient(#E4A339, #FF6B6B);
        border-radius:20px; border:2px solid #FFF8F5; background-clip:padding-box;
      }
      html::-webkit-scrollbar-thumb:hover{ background:linear-gradient(#B87A1F, #E14F4F); background-clip:padding-box; }
      html{ scrollbar-width: thin; scrollbar-color: #FF6B6B transparent; }
    `;
    document.head.appendChild(styleEl);
    return () => styleEl.remove();
  }, []);

  return (
    <div className="vt-root">
      <style>{`
        .vt-root{
          width:100%;
          --ink:#1C2B22;
          --ink-soft:#4A5A4E;
          --paper:#FFF8F5;
          --paper-dim:#FBEEE8;
          --gold:#E4A339;
          --gold-deep:#B87A1F;
          --coral:#FF6B6B;
          --coral-deep:#E14F4F;
          --leaf:#3C6E52;
          --leaf-deep:#274B39;
          --line: rgba(28,43,34,0.12);
          --line-invert: rgba(255,248,245,0.16);
          --shadow: 0 20px 60px -25px rgba(28,43,34,0.35);
          --ease: cubic-bezier(.22,.61,.36,1);
          font-family:'Inter',sans-serif;
          background:var(--paper);
          color:var(--ink);
          position:relative;
          overflow-x:hidden;
        }
        .vt-root *{box-sizing:border-box;}
        .vt-root h1,.vt-root h2,.vt-root h3,.vt-root .display{
          font-family:'Fraunces',serif;
          font-weight:500;
          letter-spacing:-0.01em;
          margin:0;
          color:var(--ink);
        }
        .vt-root p{margin:0;}
        .vt-root a{color:inherit;text-decoration:none;}
        .vt-root img{max-width:100%;display:block;}
        .vt-root ::selection{background:var(--coral);color:#fff;}

        body.voitheia-cursor-active, body.voitheia-cursor-active *{cursor:none !important;}
        .vt-cursor-dot{
          position:fixed;top:0;left:0;width:8px;height:8px;border-radius:50%;
          background:var(--coral);pointer-events:none;z-index:9999;
          transform:translate(-50%,-50%);margin-left:-4px;margin-top:-4px;
          mix-blend-mode:normal;
        }
        .vt-cursor-ring{
          position:fixed;top:0;left:0;width:34px;height:34px;border-radius:50%;
          border:1.5px solid var(--coral);pointer-events:none;z-index:9998;
          margin-left:-17px;margin-top:-17px;
          transition:width .25s var(--ease), height .25s var(--ease), border-color .25s var(--ease), background .25s var(--ease), opacity .25s var(--ease);
          opacity:0.6;
        }
        .vt-cursor-ring.is-hover{
          width:56px;height:56px;margin-left:-28px;margin-top:-28px;
          background:rgba(255,107,107,0.1);opacity:1;
        }
        @media (hover:none){.vt-cursor-dot,.vt-cursor-ring{display:none;}}

        .eyebrow{display:flex;align-items:center;gap:10px;font-family:'IBM Plex Mono',monospace;font-size:12.5px;letter-spacing:0.14em;text-transform:uppercase;color:var(--leaf-deep);margin-bottom:18px;}
        .eyebrow .glow-dot{width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 35% 30%, #FFD1CE, var(--coral) 60%, var(--coral-deep));box-shadow:0 0 0 4px rgba(255,107,107,0.16);flex:none;}
        .eyebrow.on-dark{color:#E9DAB5;}

        .wrap{max-width:1180px;margin:0 auto;padding:0 32px;}
        .vt-root section{position:relative;}

        .reveal{opacity:0;filter:blur(6px);transform:translateY(30px) scale(0.985);transition:opacity .9s var(--ease), transform .9s var(--ease), filter .9s var(--ease);}
        .reveal.in{opacity:1;filter:blur(0);transform:translateY(0) scale(1);}

        header{position:fixed;top:0;left:0;right:0;z-index:100;padding:22px 0;transition:padding .35s var(--ease), background .35s var(--ease), box-shadow .35s var(--ease);}
        header.scrolled{padding:14px 0;background:rgba(255,248,245,0.82);backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%);box-shadow:0 1px 0 var(--line);}
        .nav-row{display:flex;align-items:center;justify-content:space-between;}
        .brand{display:flex;align-items:center;gap:10px;font-family:'Fraunces',serif;font-size:20px;font-weight:600;letter-spacing:0.01em;}
        .brand .mark{width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 32% 28%, #FFD1CE, var(--coral) 55%, var(--gold-deep) 100%);box-shadow:inset 0 0 0 1px rgba(28,43,34,0.08);}
        nav ul{list-style:none;display:flex;gap:36px;margin:0;padding:0;}
        nav a{font-size:14.5px;font-weight:500;color:var(--ink-soft);position:relative;padding:4px 0;}
        nav a::after{content:'';position:absolute;left:0;bottom:-2px;width:0;height:1.5px;background:var(--coral);transition:width .3s var(--ease);}
        nav a:hover{color:var(--ink);}
        nav a:hover::after{width:100%;}
        .nav-links{display:flex;align-items:center;gap:40px;}
        .btn{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-weight:600;font-size:14px;padding:12px 24px;border-radius:100px;border:1px solid var(--ink);transition:transform .3s var(--ease), box-shadow .3s var(--ease), background .3s var(--ease), color .3s var(--ease), border-color .3s var(--ease);cursor:pointer;}
        .btn-solid{background:var(--coral);color:#fff;border-color:var(--coral);}
        .btn-solid:hover{background:var(--coral-deep);border-color:var(--coral-deep);box-shadow:0 14px 28px -12px rgba(255,107,107,0.55);}
        .btn-ghost{border-color:var(--line);color:var(--ink);}
        .btn-ghost:hover{border-color:var(--ink);}
        .btn-light{border-color:var(--line-invert);color:var(--paper);}
        .btn-light:hover{background:var(--paper);color:var(--ink);}
        .menu-toggle{display:none;background:none;border:none;cursor:pointer;padding:6px;}
        .menu-toggle span{display:block;width:22px;height:1.5px;background:var(--ink);margin:5px 0;}

        .hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:160px 0 100px;position:relative;overflow:hidden;}
        .orb{position:absolute;border-radius:50%;filter:blur(2px);pointer-events:none;transition:transform .3s linear;}
        .orb-1{width:640px;height:640px;top:-220px;right:-160px;background:radial-gradient(circle at 38% 32%, rgba(255,209,206,0.95), rgba(255,107,107,0.5) 45%, rgba(255,107,107,0.0) 72%);animation:drift1 22s ease-in-out infinite;}
        .orb-2{width:360px;height:360px;bottom:-140px;left:-120px;background:radial-gradient(circle at 60% 40%, rgba(228,163,57,0.35), rgba(228,163,57,0) 70%);animation:drift2 26s ease-in-out infinite;}
        @keyframes drift1{0%,100%{margin:0;}50%{margin-top:20px;}}
        @keyframes drift2{0%,100%{margin:0;}50%{margin-left:16px;}}
        @media (prefers-reduced-motion: reduce){.orb-1,.orb-2{animation:none;}}

        .hero-inner{position:relative;z-index:2;}
        .hero-kicker{font-family:'IBM Plex Mono',monospace;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:var(--leaf-deep);margin-bottom:28px;display:flex;align-items:center;gap:10px;}
        .hero h1{font-size:clamp(48px,8vw,104px);line-height:0.98;max-width:960px;}
        .hero h1 em{font-style:italic;font-weight:400;color:var(--coral);}
        .hero-sub{max-width:480px;margin-top:32px;font-size:18px;color:var(--ink-soft);}
        .hero-actions{display:flex;align-items:center;gap:20px;margin-top:44px;flex-wrap:wrap;}
        .hero-scroll{margin-top:100px;display:flex;align-items:center;gap:14px;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-soft);}
        .hero-scroll .line{width:36px;height:1px;background:var(--ink-soft);position:relative;overflow:hidden;}
        .hero-scroll .line::after{content:'';position:absolute;left:-100%;top:0;width:100%;height:100%;background:var(--coral);animation:scrollLine 2.4s ease-in-out infinite;}
        @keyframes scrollLine{0%{left:-100%;}50%{left:0%;}100%{left:100%;}}

        .problem{padding:140px 0;}
        .problem-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
        .problem h2{font-size:clamp(32px,4vw,46px);line-height:1.08;margin-bottom:28px;}
        .problem p{color:var(--ink-soft);font-size:16.5px;margin-bottom:18px;max-width:480px;}
        .photo-block{aspect-ratio:4/5;border-radius:18px;position:relative;overflow:hidden;background:linear-gradient(155deg, #FFD1CE 0%, #FF6B6B 45%, #B23E3E 100%);box-shadow:var(--shadow);}
        .photo-block::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 22% 28%, rgba(255,255,255,0.28), transparent 40%),radial-gradient(circle at 78% 75%, rgba(28,43,34,0.28), transparent 45%);}
        .photo-tag{position:absolute;left:20px;bottom:20px;font-family:'IBM Plex Mono',monospace;font-size:11.5px;letter-spacing:0.06em;color:#FFF8F5;background:rgba(28,43,34,0.45);padding:7px 12px;border-radius:100px;backdrop-filter:blur(6px);}

        .pillars{padding:60px 0 140px;}
        .section-head{max-width:640px;margin-bottom:70px;}
        .section-head h2{font-size:clamp(32px,4vw,46px);line-height:1.06;}
        .pillar-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:20px;overflow:hidden;}
        .pillar{background:var(--paper);padding:40px 28px;transition:background .4s var(--ease), transform .4s var(--ease);}
        .pillar:hover{background:var(--paper-dim);transform:translateY(-6px);}
        .pillar-icon{width:46px;height:46px;border-radius:12px;margin-bottom:26px;display:flex;align-items:center;justify-content:center;background:var(--ink);color:var(--coral);transition:transform .4s var(--ease);}
        .pillar:hover .pillar-icon{transform:rotate(-8deg) scale(1.06);}
        .pillar-icon svg{width:22px;height:22px;}
        .pillar h3{font-size:19px;margin-bottom:12px;line-height:1.25;}
        .pillar p{font-size:14.5px;color:var(--ink-soft);line-height:1.6;}

        .work{padding:100px 0 150px;background:var(--ink);color:var(--paper);}
        .work .section-head h2{color:var(--paper);}
        .work .section-head p{color:#C9CFC5;}
        .timeline{position:relative;margin-top:80px;}
        .timeline::before{content:'';position:absolute;left:120px;top:0;bottom:0;width:1px;background:linear-gradient(to bottom, transparent, var(--line-invert) 8%, var(--line-invert) 92%, transparent);}
        @media (max-width:860px){.timeline::before{left:20px;}}
        .work-item{display:grid;grid-template-columns:120px 1fr;gap:0 56px;padding:56px 0;position:relative;}
        .work-item:not(:last-child){border-bottom:1px solid var(--line-invert);}
        .work-year{font-family:'Fraunces',serif;font-size:34px;font-weight:400;color:var(--coral);position:relative;}
        .work-year::after{content:'';position:absolute;right:-38px;top:14px;width:9px;height:9px;border-radius:50%;background:var(--coral);box-shadow:0 0 0 5px rgba(255,107,107,0.16);}
        @media (max-width:860px){.work-year::after{right:auto;left:-25px;}}
        .work-body{display:grid;grid-template-columns:1.1fr 0.9fr;gap:48px;align-items:center;}
        .work-item.even .work-body{grid-template-columns:0.9fr 1.1fr;}
        .work-item.even .work-photo{order:2;}
        .work-eyebrow{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:var(--coral);margin-bottom:14px;}
        .work-body h3{font-size:26px;color:var(--paper);margin-bottom:14px;line-height:1.2;}
        .work-body p{color:#C9CFC5;font-size:15px;line-height:1.7;}
        .work-photo{aspect-ratio:16/11;border-radius:14px;background:linear-gradient(160deg, #4A7A5C 0%, #274B39 60%, #16281E 100%);position:relative;overflow:hidden;transition:transform .5s var(--ease);}
        .work-photo:hover{transform:scale(1.02);}
        .work-photo::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 75% 20%, rgba(255,107,107,0.35), transparent 50%);}
        @media (max-width:860px){.work-item{grid-template-columns:1fr;gap:20px;padding-left:36px;}.work-body{grid-template-columns:1fr !important;}.work-item.even .work-photo{order:0;}}

        .impact{padding:150px 0;}
        .impact-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
        .stat{background:var(--paper);padding:56px 28px;text-align:left;transition:background .3s var(--ease);}
        .stat:hover{background:var(--paper-dim);}
        .stat-num{font-family:'Fraunces',serif;font-weight:400;font-size:clamp(48px,6vw,72px);line-height:1;color:var(--ink);display:flex;align-items:baseline;gap:4px;}
        .stat-num .unit{font-size:0.4em;color:var(--coral);font-family:'IBM Plex Mono',monospace;}
        .stat-label{margin-top:14px;font-size:14.5px;color:var(--ink-soft);}
        .stat-link{margin-top:20px;display:inline-flex;align-items:center;gap:6px;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--coral-deep);border-bottom:1px solid var(--coral-deep);padding-bottom:2px;}

        .excos{padding:0 0 150px;}
        .exco-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:60px;}
        .exco-card{border:1px solid var(--line);border-radius:18px;padding:32px 26px;background:var(--paper);transition:transform .4s var(--ease), box-shadow .4s var(--ease), border-color .4s var(--ease);}
        .exco-card:hover{transform:translateY(-8px);box-shadow:var(--shadow);border-color:transparent;}
        .exco-avatar{width:64px;height:64px;border-radius:50%;margin-bottom:22px;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:20px;color:var(--paper);background:linear-gradient(150deg, var(--leaf), var(--leaf-deep));}
        .exco-card:nth-child(2) .exco-avatar{background:linear-gradient(150deg, var(--gold), var(--coral));}
        .exco-card:nth-child(3) .exco-avatar{background:linear-gradient(150deg, var(--coral), var(--ink));}
        .exco-name{font-size:18px;margin-bottom:4px;}
        .exco-role{font-size:13.5px;color:var(--ink-soft);font-family:'IBM Plex Mono',monospace;letter-spacing:0.02em;}

        .transparency{padding:20px 32px 140px;}
        .transparency-inner{max-width:1180px;margin:0 auto;background:var(--leaf-deep);color:var(--paper);border-radius:28px;padding:80px 64px;display:grid;grid-template-columns:1.3fr 0.7fr;gap:60px;align-items:center;position:relative;overflow:hidden;}
        .transparency-inner::before{content:'';position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle, rgba(255,107,107,0.28), transparent 70%);top:-160px;right:-100px;}
        .transparency h2{color:var(--paper);font-size:clamp(28px,3.6vw,40px);line-height:1.15;position:relative;}
        .transparency h2 b{color:var(--coral);font-weight:500;}
        .transparency-right{position:relative;}
        .transparency p.desc{color:#D9E0D4;font-size:15px;margin-bottom:28px;max-width:340px;}

        footer{padding:90px 0 40px;}
        .footer-top{display:grid;grid-template-columns:1.4fr 0.8fr 0.8fr 1fr;gap:40px;padding-bottom:70px;border-bottom:1px solid var(--line);}
        .footer-brand .brand{margin-bottom:18px;}
        .footer-brand p{color:var(--ink-soft);font-size:14.5px;max-width:280px;line-height:1.7;}
        .footer-col h4{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:20px;}
        .footer-col ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;}
        .footer-col a{font-size:14.5px;color:var(--ink);transition:color .25s;}
        .footer-col a:hover{color:var(--coral);}
        .footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:32px;flex-wrap:wrap;gap:16px;}
        .footer-bottom p{font-size:13px;color:var(--ink-soft);font-family:'IBM Plex Mono',monospace;}

        @media (max-width:960px){
          .nav-links{display:none;}
          .menu-toggle{display:block;}
          .problem-grid{grid-template-columns:1fr;gap:48px;}
          .pillar-grid{grid-template-columns:repeat(2,1fr);}
          .impact-grid{grid-template-columns:1fr;}
          .exco-grid{grid-template-columns:1fr;}
          .transparency-inner{grid-template-columns:1fr;padding:56px 32px;}
          .footer-top{grid-template-columns:1fr 1fr;}
        }
        @media (max-width:560px){
          .wrap{padding:0 20px;}
          .pillar-grid{grid-template-columns:1fr;}
          .footer-top{grid-template-columns:1fr;}
          .transparency{padding:20px 16px 100px;}
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div ref={cursorDot} className="vt-cursor-dot" />
      <div ref={cursorRing} className="vt-cursor-ring" />

      <header className={scrolled ? "scrolled" : ""}>
        <div className="wrap nav-row">
          <a href="#top" className="brand" data-cursor="hover">
            <span className="mark" />
            Voitheia
          </a>
          <div className="nav-links">
            <nav>
              <ul>
                <li><a href="#crew" data-cursor="hover">Crew</a></li>
                <li><a href="#projects" data-cursor="hover">Projects</a></li>
                <li><a href="#accounts" data-cursor="hover">Accounts</a></li>
                <li><a href="#apply" data-cursor="hover">Apply</a></li>
              </ul>
            </nav>
            <MagneticButton href="#donate" className="btn btn-solid">Donate</MagneticButton>
          </div>
          <button className="menu-toggle" aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="orb orb-1" ref={orb1} />
        <div className="orb orb-2" ref={orb2} />
        <div className="wrap hero-inner">
          <div className="hero-kicker"><span className="glow-dot" />Student-led · Lagos, Nigeria</div>
          <h1>Where compassion<br />meets <em>action</em>.</h1>
          <p className="hero-sub">Voitheia empowers students to create real, lasting change through hands-on community service — one act of kindness, one child, one project at a time.</p>
          <div className="hero-actions">
            <MagneticButton href="#apply" className="btn btn-solid">Join the crew</MagneticButton>
            <MagneticButton href="#problem" className="btn btn-ghost">See why we exist</MagneticButton>
          </div>
          <div className="hero-scroll"><div className="line" />Scroll to explore</div>
        </div>
      </section>

      <section className="problem" id="problem">
        <div className="wrap problem-grid">
          <Reveal>
            <div className="eyebrow"><span className="glow-dot" />The challenge</div>
            <h2>Millions of children grow up without ever seeing what community looks like.</h2>
            <p>Voitheia began as an idea to let students engage directly with less fortunate children of all ages — and learn from the experience as much as they gave to it.</p>
            <p>By fostering a genuine sense of community, we're shaping a generation of young adults who lead with the instinct to help each other first.</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="photo-block"><span className="photo-tag">Photo: community visit — replace with your image</span></div>
          </Reveal>
        </div>
      </section>

      <section className="pillars">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="eyebrow"><span className="glow-dot" />What we stand for</div>
            <h2>Four things every member walks away with.</h2>
          </Reveal>
          <div className="pillar-grid">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} className="pillar">
                <div className="pillar-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d={p.path} />
                  </svg>
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="work" id="projects">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="eyebrow on-dark"><span className="glow-dot" />Our work</div>
            <h2>Three years. Three communities. One idea that kept growing.</h2>
            <p style={{ marginTop: 16, maxWidth: 520 }}>Every project below happened because a group of students decided to start small and show up anyway.</p>
          </Reveal>

          <div className="timeline">
            {PROJECTS.map((proj, i) => (
              <div className={`work-item ${i % 2 === 1 ? "even" : ""}`} key={proj.year}>
                <Reveal className="work-year">{proj.year}</Reveal>
                <Reveal delay={80} className="work-body">
                  <div>
                    <div className="work-eyebrow">{proj.tag}</div>
                    <h3>{proj.title}</h3>
                    <p>{proj.text}</p>
                  </div>
                  <div className="work-photo" />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="impact">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="eyebrow"><span className="glow-dot" />Our impact</div>
            <h2>The numbers behind the work.</h2>
          </Reveal>
        </div>
        <div className="impact-grid">
          <Reveal className="stat">
            <div className="stat-num"><Counter target={3} /></div>
            <p className="stat-label">Projects completed</p>
            <MagneticButton href="#accounts" className="stat-link">Learn more →</MagneticButton>
          </Reveal>
          <Reveal delay={80} className="stat">
            <div className="stat-num"><span className="unit">₦</span><Counter target={0} /></div>
            <p className="stat-label">Funds raised — update with current total</p>
            <MagneticButton href="#donate" className="stat-link">Contribute →</MagneticButton>
          </Reveal>
          <Reveal delay={160} className="stat">
            <div className="stat-num"><Counter target={15} suffix="" /><span className="unit">+</span></div>
            <p className="stat-label">Members and growing</p>
            <MagneticButton href="#apply" className="stat-link">Join us →</MagneticButton>
          </Reveal>
        </div>
      </section>

      <section className="excos" id="crew">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="eyebrow"><span className="glow-dot" />Meet the excos</div>
            <h2>The people steering Voitheia forward.</h2>
          </Reveal>
          <div className="exco-grid">
            {EXCOS.map((e, i) => (
              <Reveal key={e.name} delay={i * 80} className="exco-card">
                <div className="exco-avatar">{e.initials}</div>
                <div className="exco-name">{e.name}</div>
                <div className="exco-role">{e.role}</div>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: 44 }}>
            <MagneticButton href="#crew" className="btn btn-ghost">Meet our members</MagneticButton>
          </div>
        </div>
      </section>

      <section className="transparency" id="accounts">
        <Reveal className="transparency-inner">
          <h2>We believe in complete <b>transparency</b> — every donation tracked, every report public.</h2>
          <div className="transparency-right">
            <p className="desc">Regular updates keep you informed about exactly how your support turns into projects like the ones above.</p>
            <MagneticButton href="#accounts" className="btn btn-light">View the log</MagneticButton>
          </div>
        </Reveal>
      </section>

      <footer>
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#top" className="brand" data-cursor="hover"><span className="mark" />Voitheia</a>
              <p>A student-led community service organisation based in Lagos, Nigeria — where compassion meets action.</p>
            </div>
            <div className="footer-col">
              <h4>Quick links</h4>
              <ul>
                <li><a href="#crew">Crew</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#accounts">Accounts</a></li>
                <li><a href="#apply" id="apply">Apply</a></li>
                <li><a href="#donate" id="donate">Donate</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <ul>
                <li><a href="https://www.linkedin.com/company/voitheia-org/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="https://www.instagram.com/voitheia.ng" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <ul>
                <li><a href="mailto:voitheia.org@gmail.com">voitheia.org@gmail.com</a></li>
                <li><a href="tel:+2348055899033">+234 805 589 9033</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Voitheia. All rights reserved.</p>
            <p>Made with intention in Lagos</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
