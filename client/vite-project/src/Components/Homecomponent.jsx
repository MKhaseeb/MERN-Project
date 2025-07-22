import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import laptop from "../assets/istockphoto-1307613521-612x612.jpg";
import video from '../assets/office2.mp4';

gsap.registerPlugin(ScrollTrigger);

const Homecomponent = () => {
  const sentencesRef = useRef([]);
  const sectionRef = useRef(null);

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
          start: "top pause pause top",
          end: "+=4000", // length of scroll
          scrub: true,
          pin: true,
          anticipatePin: 1,
          markers: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert(); // cleanup
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

      <section id="section1" className="relative w-full h-screen bg-gray-800 text-white flex items-center justify-center">
        <div className="md:w-1/2 max-w-lg">
          <h1 className="text-5xl font-extrabold mb-6">
            Find Your Dream Job Faster with AI-Powered Insights
          </h1>
          <p className="text-lg mb-8 text-gray-300">
            Job Plus connects job seekers and companies with AI-driven market analytics and smart voice agents.
          </p>
          <div className="flex gap-6">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold">
              Get Started
            </button>
            <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-md font-semibold">
              Explore Jobs
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src={laptop}
            alt="AI job market illustration"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
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
          className="absolute top-0 left-0 w-full h-full object-cover z-0 absolute inset-0 bg-black opacity-50 dark:opacity-60"
        />
        <div className="relative z-10 text-white text-center space-y-12 ">
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

      <section id="section3" className="w-full h-screen bg-green-500 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Section 3</h1>
      </section>

      <section id="section4" className="w-full h-screen bg-yellow-500 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Section 4</h1>
      </section>
    </>
  );
};

export default Homecomponent;
