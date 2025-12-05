"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const features = [
  {
    title: "Nearby hospitals",
    description: "Curated ER-ready facilities with live readiness badges.",
  },
  {
    title: "Verified doctors",
    description: "Profiles audited for licenses, experience, and reviews.",
  },
  {
    title: "Smart filters",
    description: "Search by specialization, fee, city, or tele-consult slots.",
  },
  {
    title: "Emergency support",
    description: "Fast-track hotline for urgent appointments and triage.",
  },
];

const steps = [
  "Search hospital by city.",
  "Search doctor by specialization.",
  "Select a time that suits you.",
  "Confirm and receive reminders.",
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [stats, setStats] = useState({
    totalCities: 0,
    totalDoctors: 0,
    averageRating: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/doctors/stats");
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12">
      {/* Hero Section */}
      <motion.section 
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row items-center gap-12 md:p-12"
      >
        {/* Decorative background blobs */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-50 blur-3xl" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-fuchsia-50 blur-3xl" 
        />
        
        <div className="relative flex-1 space-y-8 z-10">
          <motion.div variants={staggerContainer} className="space-y-4">
            <motion.span 
              variants={fadeInUp}
              className="inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-600 ring-1 ring-violet-100"
            >
              Care within reach
            </motion.span>
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl"
            >
              Find trusted care <br />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                near you.
              </span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="max-w-md text-lg text-slate-600 leading-relaxed"
            >
              MedLink connects you with top-rated doctors and hospitals. 
              Transparent reviews, verified profiles, and instant booking.
            </motion.p>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            <PrimaryButton href="/doctors" className="h-12 px-8 text-base shadow-violet-500/25">
              Find Doctors
            </PrimaryButton>
            <PrimaryButton href="/hospitals" variant="secondary" className="h-12 px-8 text-base">
              Find Hospitals
            </PrimaryButton>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center gap-6 pt-4">
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalCities}+</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cities</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalDoctors}+</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Doctors</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Rating</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative flex-1 w-full max-w-[500px] lg:max-w-none"
        >
           <div className="absolute inset-0 bg-gradient-to-tr from-violet-100/50 to-fuchsia-100/50 rounded-[2rem] transform rotate-3 scale-95" />
           <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-violet-200/50 border-4 border-white ring-1 ring-slate-100">
              <img 
                src="/hero-illustration-v2.jpg" 
                alt="Find trusted care near you - Doctor and family illustration" 
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              />
           </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="space-y-8"
      >
        <SectionHeader
          eyebrow="Why MedLink"
          title="Healthcare made simple"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                  {i === 0 ? "🏥" : i === 1 ? "👨‍⚕️" : i === 2 ? "🔍" : "🚑"}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Steps Section */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="space-y-8"
      >
        <SectionHeader eyebrow="Process" title="How it works" />
        <motion.div 
          variants={fadeInUp}
          className="relative rounded-[2.5rem] bg-slate-900 p-8 md:p-12 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
          
          <ol className="relative grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.li 
                key={step} 
                variants={fadeInUp}
                className="relative space-y-4"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-white backdrop-blur-sm ring-1 ring-white/20">
                  {index + 1}
                </span>
                <p className="text-lg font-medium text-slate-200 leading-snug">{step}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-16 right-4 h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </motion.section>
    </div>
  );
}
