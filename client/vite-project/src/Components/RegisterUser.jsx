import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const steps = ["Account", "Contact", "Professional", "Education", "Resume"];

const RegisterUser = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    phone: "", location: "", linkedin: "", website: "",
    desiredTitle: "", experience: "", skills: "", preferredType: "", expectedSalary: "",
    degree: "", field: "", university: "", graduationYear: "",
    resumeUrl: "", bio: ""
  });

  const containerRef = useRef();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const next = () => {
    if (step < steps.length - 1) {
      gsap.to(containerRef.current, {
        xPercent: -100,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => setStep((prev) => prev + 1),
      });
    }
  };

  const prev = () => {
    if (step > 0) {
      gsap.to(containerRef.current, {
        xPercent: 100,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => setStep((prev) => prev - 1),
      });
    }
  };

  useEffect(() => {
    gsap.set(containerRef.current, { xPercent: 0 });
    gsap.fromTo(
      containerRef.current,
      { xPercent: 100, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, [step]);

  const Input = (label, name, type = "text", placeholder = "") => (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full bg-white text-gray-800 border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const TextArea = (label, name) => (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full bg-white text-gray-800 border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
      />
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            {Input("First Name", "firstName", "text", "Sarah")}
            {Input("Last Name", "lastName", "text", "Smith")}
            {Input("Email", "email", "email", "sarah@example.com")}
            {Input("Password", "password", "password")}
            {Input("Confirm Password", "confirmPassword", "password")}
          </>
        );
      case 1:
        return (
          <>
            {Input("Phone", "phone", "text", "+970")}
            {Input("Location", "location", "text", "Ramallah, Palestine")}
            {Input("LinkedIn URL", "linkedin")}
              {Input("Website", "website")}
            </>
          );
        case 2:
          return (
            <>
              {Input("Desired Job Title", "desiredTitle")}
              {Input("Years of Experience", "experience")}
              {Input("Skills", "skills", "text", "JavaScript, React, AI")}
              {Input("Preferred Type", "preferredType", "text", "Remote, Full-Time")}
              {Input("Expected Salary", "expectedSalary")}
            </>
          );
        case 3:
          return (
            <>
              {Input("Degree", "degree")}
              {Input("Field", "field")}
              {Input("University", "university")}
              {Input("Graduation Year", "graduationYear")}
            </>
          );
        case 4:
          return (
            <>
              {Input("Resume URL", "resumeUrl")}
              {TextArea("Tell us about yourself", "bio")}
            </>
          );
        default:
          return null;
      }
    };

    return (
<section className="min-h-screen 	 flex items-center justify-center p-6">
  <div className="w-full max-w-md">
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <h1 className="text-center text-xl font-semibold text-gray-800">
        Step {step + 1} of {steps.length} — {steps[step]}
      </h1>

      <div ref={containerRef} className="transition-transform ease-in-out duration-700 space-y-5">
        {renderStep()}
      </div>

      <div className="flex justify-between items-center pt-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={prev}
            className="text-sm text-gray-600 hover:text-blue-600"
          >
            Back
          </button>
        ) : (
          <span />
        )}

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-sm px-6 py-2 rounded-full"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-6 py-2 rounded-full"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  </div>
</section>

  );
};

export default RegisterUser;