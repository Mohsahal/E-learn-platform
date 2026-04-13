import {
  Zap,
  Building2,
  Target,
  Users,
  Linkedin,
  Github,
  Rocket,
  Globe,
  Eye,
  Lightbulb,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "@/hooks/use-gsap";
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";

const FuturisticHeroScene = lazy(() =>
  import("@/components/student-view/futuristic-hero-scene")
);

gsap.registerPlugin(ScrollTrigger);

const TEAM = [

  {
    id: "sahal",
    name: "Mohammed Sahal PK",
    role: "Software Developer",
    photo: "/images/team/sahal.jpg",
    bio: "Software Developer and Product Architect focused on engineering high-performance, scalable systems that drive business growth. This role involves transforming complex technical requirements into elegant, user-centric digital products while leveraging modern tech stacks to deliver robust solutions that meet the highest possible industry standards and performance benchmarks.",
    socials: {
      linkedin: "https://www.linkedin.com/in/mohammedsahalpk/",
      github: "https://github.com/Mohsahal",
    },
  },

];

function TeamCard({ member }) {
  const hasSocials = member.socials?.linkedin || member.socials?.github;

  return (
    <div className="group relative flex h-full">
      <div className="absolute -inset-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
      <div className="relative glass-card p-8 flex flex-col items-center text-center w-full">
        <div className="w-50 h-40 rounded-2xl overflow-hidden mb-6 border-2 border-white/10 group-hover:border-blue-500/50 transition-colors flex-shrink-0">
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <h3 className="text-xl font-black text-white mb-1">{member.name}</h3>
        <p className="text-blue-400 text-sm font-bold tracking-widest uppercase mb-4">
          {member.role}
        </p>

        {/* flex-grow ensures this area stretches to keep the card bottoms aligned */}
        <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
          {member.bio}
        </p>

        {/* This div always has a min-height of 40px, even if empty, to keep card sizes equal */}
        <div className="flex gap-4 min-h-[40px] items-center justify-center">
          {member.socials?.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:scale-110"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.socials?.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:scale-110"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {/* Spacer logic: if no socials exist, we render nothing, but the min-h-[40px] above holds the space */}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  const [visibleCount, setVisibleCount] = useState(3);
  const pageRef = usePageTransition();

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  // GSAP Entrance
  useEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload = navEntry ? navEntry.type === "reload" : performance.navigation?.type === 1;
    if (isReload) pageRef.enter("fade");

    const tl = gsap.timeline({ delay: isReload ? 0.1 : 0 });
    // Keep animations only for the grid items to reduce initial lag
    tl.fromTo(
      ".about-grid-item",
      { opacity: 0, scale: 0.9, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    return () => {
       tl.kill();
       ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [pageRef]);
  return (
    <div
      className="relative w-full text-gray-200"
      style={{ background: "var(--bg-dark)" }}
    >
      {/* Background Decor */}
      <div className="orb orb-blue absolute w-[800px] h-[800px] -top-96 -left-40 opacity-[0.05] pointer-events-none" />
      <div className="orb orb-purple absolute w-[700px] h-[700px] bottom-0 -right-20 opacity-[0.04] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* 3D Visual Atmosphere (Matching Home Page Pattern) */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[60%] flex items-center justify-center p-0 overflow-hidden pointer-events-none z-0 opacity-25">
         <Suspense fallback={null}>
            <FuturisticHeroScene />
         </Suspense>

         {/* Shadow gradient for readability */}
         <div className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
           style={{
             background: "linear-gradient(90deg, var(--bg-dark) 0%, transparent 100%)",
           }} />
      </div>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 px-6 lg:px-12 z-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl">
            <h1 className="about-title text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.02] mt-8 mb-10 tracking-tighter">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Our Journey
              </span>
              <br />
              <span className="text-white">& E-Learning </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Innovation</span>
            </h1>
            <p className="about-desc text-lg sm:text-2xl text-gray-400 max-w-2xl leading-relaxed">
              Nexora Learn is a modern E-learning platform dedicated to delivering quality tech education that bridges the gap between academic theory and practical skills.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pb-24">
        {/* Objectives Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="about-grid-item glass-card p-10 group h-full flex flex-col border-white/5 hover:border-blue-500/30">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-blue-500/10 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Building2 className="h-7 w-7 text-blue-400" />
            </div>
            <h2 className="text-2xl font-black mb-4 text-white">
              About Nexora Learn
            </h2>
            <p className="text-gray-400 leading-relaxed text-base">
              Modern E-learning platform dedicated to delivering quality online courses and accessible tech education, ensuring continuous skill development for everyone.
            </p>
          </div>
          <div className="about-grid-item glass-card p-10 group h-full flex flex-col border-white/5 hover:border-purple-500/30">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-purple-500/10 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Target className="h-7 w-7 text-purple-400" />
            </div>
            <h2 className="text-2xl font-black mb-4 text-white">
              Our Objectives
            </h2>
            <p className="text-gray-400 leading-relaxed text-base">
              To make quality tech education accessible to everyone by
              providing structured courses and hands-on practice for IT and non-IT sectors.
            </p>
          </div>
        </div>

        {/* Mentorship & Success */}
        <div className="space-y-32 mb-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <span className="text-blue-400 font-bold text-sm uppercase tracking-[0.2em] mb-4 block">
                Instruction
              </span>
              <h3 className="text-3xl font-black text-white mb-6">
                Expert-Led Learning
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Our instructors are seasoned professionals with{" "}
                <span className="text-white font-bold">
                  deep domain expertise
                </span>
                , bringing structured learning paths to help you master skills that
                are highly valued.
              </p>
            </div>
            <div className="w-full lg:w-1/3 rounded-2xl overflow-hidden border border-white/10">
              <img
                src="/images/pic4.webp"
                alt="Training"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="flex-1">
              <span className="text-purple-400 font-bold text-sm uppercase tracking-[0.2em] mb-4 block">
                Success
              </span>
              <h3 className="text-3xl font-black text-white mb-6">
                Certified Learners
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                We have{" "}
                <span className="text-white font-bold">
                  successfully certified 10,000+ students
                </span>{" "}
                who have completed our structured courses and improved their practical capabilities worldwide.
              </p>
            </div>
            <div className="w-full lg:w-1/3 rounded-2xl overflow-hidden border border-white/10">
              <img
                src="/images/pic2.webp"
                alt="Success"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Vision/Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
          <div className="glass-card p-10 border-t-2 border-blue-500/20">
            <Eye className="w-8 h-8 text-blue-400 mb-6" />
            <h2 className="text-2xl font-black text-white mb-4">Our Vision</h2>
            <p className="text-gray-400">
              Empower learners worldwide with practical skills through an innovative E-learning platform that transforms potential into excellence.
            </p>
          </div>
          <div className="glass-card p-10 border-t-2 border-purple-500/20">
            <Lightbulb className="w-8 h-8 text-purple-400 mb-6" />
            <h2 className="text-2xl font-black text-white mb-4">Our Mission</h2>
            <p className="text-gray-400">
              To make quality tech education accessible to everyone, providing hands-on practice,
              structured learning paths, and course completion certificates.
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <span className="section-badge mb-4 inline-flex items-center gap-2">
              <Users className="w-3 h-3" /> Our Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              The Minds Behind <span className="text-blue-400">Nexora Learn</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {TEAM.slice(0, visibleCount).map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
          {visibleCount < TEAM.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 
                 text-white font-bold tracking-wide hover:scale-105 
                 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
