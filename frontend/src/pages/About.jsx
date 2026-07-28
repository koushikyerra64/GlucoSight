import React from "react";
import { motion } from "framer-motion";
import { Target, TreePine, Sparkles, Layers, Cpu, Beaker } from "lucide-react";
import { IMAGES } from "@/lib/constants";

const OBJECTIVES = [
  "Build an accessible, education-focused diabetes risk screener.",
  "Train and evaluate a Random Forest classifier on the Pima Indians dataset.",
  "Communicate model performance transparently (accuracy, ROC, feature importance).",
  "Provide contextual health guidance based on the prediction outcome.",
];

const WHY_RF = [
  { title: "Ensemble robustness", desc: "Combines hundreds of trees to reduce variance and overfitting." },
  { title: "Handles non-linearity", desc: "Captures the complex interactions between glucose, BMI and age." },
  { title: "Feature importance", desc: "Reveals which clinical parameters drive predictions." },
  { title: "Works with modest data", desc: "Delivers strong baselines even on datasets under 1,000 rows." },
];

const BENEFITS = [
  "Early risk detection that scales beyond clinical bandwidth.",
  "Democratises access to preliminary screening in remote regions.",
  "Reduces long-term treatment costs via preventive intervention.",
  "Empowers patients with a data-driven view of their metabolic health.",
];

const STACK = [
  { icon: Cpu, name: "FastAPI", tag: "Python backend" },
  { icon: Beaker, name: "scikit-learn", tag: "Random Forest" },
  { icon: Layers, name: "React + Tailwind", tag: "Frontend" },
  { icon: TreePine, name: "MongoDB", tag: "Prediction store" },
  { icon: Sparkles, name: "Recharts", tag: "Visualisations" },
  { icon: Target, name: "Framer Motion", tag: "Animations" },
];

export default function About() {
  return (
    <div data-testid="about-page" className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="chip chip-blue mb-4">About the project</div>
        <h1 className="section-title max-w-3xl">
          A final-year exploration into transparent, explainable diabetes screening.
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl leading-relaxed">
          GlucoSight blends classical machine learning with a modern, clinical-grade
          UI to demonstrate how ensemble models can support early diabetes detection.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-10 mt-14">
        <div className="lg:col-span-7 med-card p-10">
          <h2 className="font-heading text-2xl font-bold text-[#0B3B60]">Project Overview</h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            The system ingests seven clinical parameters — glucose, blood pressure,
            skin thickness, insulin, BMI, diabetes pedigree function and age — and
            passes them through a Random Forest classifier trained on the Pima
            Indians dataset (Pregnancies feature excluded by design). Predictions
            are returned with a confidence score and personalised recommendations.
          </p>
          <h3 className="font-heading text-lg font-semibold mt-8 text-slate-900">Objectives</h3>
          <ul className="mt-3 space-y-2">
            {OBJECTIVES.map((o) => (
              <li key={o} className="flex gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                {o}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <img src={IMAGES.medicalLaboratory} alt="Lab" className="rounded-3xl w-full h-80 object-cover" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[
              { k: "80/20", v: "Train / Test" },
              { k: "250", v: "Trees" },
              { k: "7", v: "Features" },
              { k: "AUC", v: "0.81" },
            ].map((s) => (
              <div key={s.v} className="med-card p-4 text-center">
                <div className="font-heading text-xl font-bold text-[#0B3B60]">{s.k}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="section-title">Why Random Forest?</h2>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_RF.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="med-card p-7"
            >
              <div className="text-emerald-500 font-heading font-bold">0{i + 1}</div>
              <h3 className="font-heading font-semibold mt-3">{r.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 med-card p-10">
          <h2 className="font-heading text-2xl font-bold text-[#0B3B60]">
            Benefits of ML in Healthcare
          </h2>
          <ul className="mt-4 space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6">
          <h2 className="font-heading text-2xl font-bold text-[#0B3B60]">Technology Stack</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {STACK.map((s) => (
              <div key={s.name} className="med-card p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0B3B60] text-white flex items-center justify-center">
                  <s.icon size={18} />
                </div>
                <div>
                  <div className="font-heading font-semibold">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
