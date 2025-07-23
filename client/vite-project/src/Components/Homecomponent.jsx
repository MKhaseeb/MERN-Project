import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import video from '../assets/office2.mp4';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { loadPolygonMaskPlugin } from "tsparticles-plugin-polygon-mask";

const particlesInit = async (engine) => {
  await loadFull(engine);
  await loadPolygonMaskPlugin(engine);
};

gsap.registerPlugin(ScrollTrigger);

const Homecomponent = () => {
  const sentencesRef = useRef([]);
  const sectionRef = useRef(null);

  const [particleConfig, setParticleConfig] = useState({
    position: { x: 50, y: 25 },
    scale: 0.8,
  });

  useEffect(() => {
    const updateResponsiveParticles = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setParticleConfig({ position: { x: 50, y: 30 }, scale: 0.4 });
      } else if (width < 1024) {
        setParticleConfig({ position: { x: 50, y: 28 }, scale: 0.6 });
      } else {
        setParticleConfig({ position: { x: 50, y: 25 }, scale: 0.8 });
      }
    };

    updateResponsiveParticles();
    window.addEventListener('resize', updateResponsiveParticles);
    return () => window.removeEventListener('resize', updateResponsiveParticles);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(sentencesRef.current, { opacity: 0, y: 50 });

      gsap.to(sentencesRef.current, {
        opacity: 1,
        y: 0,
        stagger: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=4000",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          markers: false,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <nav className="sticky top-0 bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md z-50">
        <div className="text-xl font-bold">Job Plus</div>
        <ul className="flex space-x-6">
          <li><a href="#section1" className="hover:text-indigo-400">Home</a></li>
          <li><a href="#section2" className="hover:text-indigo-400">Features</a></li>
          <li><a href="#section3" className="hover:text-indigo-400">Analytics</a></li>
          <li><a href="#section4" className="hover:text-indigo-400">Contact</a></li>
        </ul>
      </nav>


<section
  id="section1"
  className="relative w-full h-screen bg-gray-800 text-white flex items-center justify-center px-4 overflow-hidden "
>

  <div className="absolute inset-0 w-full h-full z-0">
    <Particles
      init={particlesInit}
      className="w-full h-full"
      options={{
        fullScreen: false,
        background: { color: "#1f2937" },
        particles: {
          number: { value: 200 },
          color: { value: "#ffffff" },
          size: { value: 2 },
          move: { enable: true, speed: 0.8 },
        },
        polygon: {
          enable: true,
          type: "inside",
          url: "/Palestine.svg",
          position: particleConfig.position,
          scale: particleConfig.scale,
          move: {
            radius: 10,
          },
          draw: {
            enable: true,
            stroke: { color: "#ffffff", width: 1.2 },
          },
          inline: {
            arrangement: "equidistant",
          },
        },
      }}
    />
  </div>

  {/* Content Overlay */}
  <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center justify-between  ">
    {/* Left: Text Content */}
    <div className="md:w-1/2 w-full p-4 text-center md:text-left ">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
        Find Your Dream Job Faster with AI-Powered Insights
      </h1>
      <p className="text-lg mb-8 text-gray-300">
        Job Plus connects job seekers and companies with AI-driven market analytics and smart voice agents.
      </p>
      <div className="flex gap-6 justify-center md:justify-start">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold">
          Get Started
        </button>
        <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-md font-semibold">
          Explore Jobs
        </button>
      </div>
    </div>
  </div>
</section>


      {/* Section 2 - Video with Scroll Animation */}
      <section
        ref={sectionRef}
        id="section2"
        className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        <video
          src={video}
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50 dark:opacity-60"
        />
        <div className="relative z-10 text-white text-center space-y-12">
          {[
            "Welcome to the future of job hunting.",
            "Our AI listens, learns, and guides you.",
            "Companies update us in real time.",
            "Explore. Apply. Succeed — Job Plus.",
          ].map((text, index) => (
            <h1
              key={index}
              ref={(el) => (sentencesRef.current[index] = el)}
              className="text-4xl font-bold opacity-0 translate-y-10"
            >
              {text}
            </h1>
          ))}
        </div>
      </section>

      {/* Section 3 - Map Header */}
      <section
        id="section3"
        className="relative w-full h-screen bg-green-500 flex items-center justify-center overflow-hidden"
      >
        <h1 className="text-white text-4xl font-bold z-10">Palestine Map Visualization</h1>
      </section>

      {/* Section 4 - Contact */}
      <section
        id="section4"
        className="w-full h-screen bg-yellow-500 flex items-center justify-center"
      >
        <h1 className="text-white text-4xl font-bold">Section 4</h1>
      </section>
    </>
  );
};

export default Homecomponent;
