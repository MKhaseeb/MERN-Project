import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import video from '../assets/office2.mp4';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { loadPolygonMaskPlugin } from "tsparticles-plugin-polygon-mask";
import UnemploymentChart from './UnemploymentChart';
import backgroundImage from '../assets/dw.webp'
import { Link } from "react-router-dom";


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
          end: "+=2000",
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
        // #0f1214
        particles: {
          number: { value: 200 },
          color: { value: "#ffffffff" },
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

  <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center justify-between  ">
    <div className="md:w-1/2 w-full p-4 text-center md:text-left ">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
        Find Your Dream Job Faster with AI-Powered Insights
      </h1>
      <p className="text-lg mb-8 text-gray-300">
        Job Plus connects job seekers and companies with AI-driven market analytics and smart voice agents.
      </p>
      <div className="flex gap-6 justify-center md:justify-start">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold">
          <Link to={'/alljobs'}>Get Started </Link>
        </button>
        <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-md font-semibold">
          Explore Jobs
        </button>
      </div>
    </div>
  </div>
</section>


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

<section
  id="section3"
  className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white px-6 py-16 flex flex-col justify-center items-center"
>
  <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-green-300 drop-shadow-lg">
    Unemployment in Palestine (2020–2024)
  </h1>
  <p className="text-gray-300 mb-12 max-w-2xl text-center">
    A visual summary of unemployment rate changes in Palestine over the past 5 years. Powered by AI and real data insights.
  </p>
  <UnemploymentChart />
</section>
<section
  id="section4"
  className="relative w-full min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center px-6 py-24 "
>
  {/* Background visuals */}
  <div
    className="absolute inset-0 bg-cover bg-center blur-2xl scale-125 opacity-20 z-0"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  />
<div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 via-85% to-[#0b0b0b] z-0" />


  {/* Foreground content */}
  <div className="relative z-10 max-w-7xl w-full text-center">
    <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight text-white drop-shadow-md">
      Shaping the Future of <span className="text-teal-400">Hiring</span>
    </h2>
    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
      Experience the power of real-time data, automation, and AI-driven workflows that simplify how job seekers connect with top companies.
    </p>

    {/* Feature Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
      {/* About Us */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:border-teal-400 transition-colors duration-200">
        <h3 className="text-2xl font-semibold mb-4 text-white">
          About Job Plus
        </h3>
        <p className="text-gray-300 text-base leading-relaxed">
          We are redefining hiring by embedding real-time intelligence into every step. From automated voice agents to dynamic dashboards, we make hiring human again—only smarter.
        </p>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:border-teal-400 transition-colors duration-200">
        <h3 className="text-2xl font-semibold mb-4 text-white">
          Why Choose Us
        </h3>
        <p className="text-gray-300 text-base leading-relaxed">
          Our platform goes beyond traditional job posts. It interprets market trends, detects hiring signals, and empowers both candidates and companies to act with speed through AI-curated matches and automated workflows.
        </p>
      </div>
    </div>

    {/* CTA Buttons */}
    <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-lg rounded-xl shadow-md transition duration-300">
        Get Started
      </button>
      <button className="px-8 py-4 border border-gray-400 hover:border-white text-white font-medium text-lg rounded-xl transition duration-300">
        Watch Demo
      </button>
    </div>
  </div>
</section>

<footer className="bg-gradient-to-t from-[#0b0b0b] via-[#101010] to-gray-900 text-gray-400 px-6 py-12 border-t border-gray-800">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">
    <div>
      <h4 className="text-white font-semibold mb-4">Job Plus</h4>
      <p className="text-gray-400">
        Empowering smarter hiring across Palestine and beyond. Built with AI, driven by impact.
      </p>
    </div>
    <div>
      <h4 className="text-white font-semibold mb-4">Company</h4>
      <ul className="space-y-2">
        <li><a href="#section1" className="hover:text-teal-400 transition">Home</a></li>
        <li><a href="#section2" className="hover:text-teal-400 transition">Features</a></li>
        <li><a href="#section3" className="hover:text-teal-400 transition">Analytics</a></li>
        <li><a href="#section4" className="hover:text-teal-400 transition">About</a></li>
      </ul>
    </div>
    <div>
      <h4 className="text-white font-semibold mb-4">Support</h4>
      <ul className="space-y-2">
        <li><a href="#" className="hover:text-teal-400 transition">Help Center</a></li>
        <li><a href="#" className="hover:text-teal-400 transition">Terms of Service</a></li>
        <li><a href="#" className="hover:text-teal-400 transition">Privacy Policy</a></li>
      </ul>
    </div>
    <div>
      <h4 className="text-white font-semibold mb-4">Connect</h4>
      <ul className="space-y-2">
        <li>Email: <span className="text-gray-300">support@jobplus.ai</span></li>
        <li>Location: <span className="text-gray-300">Ramallah, Palestine</span></li>
      </ul>
    </div>
  </div>
  <div className="mt-10 text-center text-xs text-gray-500">
    © {new Date().getFullYear()} Job Plus. All rights reserved.
  </div>
</footer>










    </>
  );
};

export default Homecomponent;
