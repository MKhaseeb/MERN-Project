// Register Form inspired by Formly: elegant onboarding experience with split layout and slider transitions
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

  const formRef = useRef();
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
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full bg-white text-neutral-800 border border-neutral-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );

  const TextArea = (label, name) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full bg-white text-neutral-800 border border-neutral-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
    <section className="min-h-screen bg-white text-neutral-800 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-6xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="w-1/2 bg-indigo-900 text-white p-10 hidden md:flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6 leading-tight">Capture your user details, beautifully.</h2>
            <p className="text-sm opacity-80">Use this form to onboard candidates or companies. Multi-step, animated, and elegant—just like the rest of Job Plus.</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10">
          <div ref={containerRef} className="transition-transform duration-700 ease-in-out">
            <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <h1 className="text-2xl font-semibold text-indigo-800 text-center mb-6">
                Step {step + 1} of {steps.length} — {steps[step]}
              </h1>
              <div className="space-y-5 max-w-md mx-auto min-w-[300px]">{renderStep()}</div>
              <div className="flex justify-between items-center pt-6 max-w-md mx-auto">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={prev}
                    className="text-neutral-600 hover:text-indigo-700 font-medium"
                  >
                    Back
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterUser;
