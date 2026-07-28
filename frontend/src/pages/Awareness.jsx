import React from "react";
import { motion } from "framer-motion";
import {
  Salad, Dumbbell, Stethoscope, Clock, ShieldPlus, ActivitySquare,
  Utensils, Brain, Droplets,
} from "lucide-react";
import { IMAGES } from "@/lib/constants";

const TYPES = [
  { title: "Type 1 Diabetes", desc: "Autoimmune destruction of pancreatic beta cells; requires lifelong insulin therapy.", tone: "blue" },
  { title: "Type 2 Diabetes", desc: "Insulin resistance driven by lifestyle and genetics; largely preventable and manageable.", tone: "emerald" },
  { title: "Gestational Diabetes", desc: "High blood sugar during pregnancy; often resolves post-delivery but raises future risk.", tone: "amber" },
  { title: "Pre-diabetes", desc: "Blood glucose is elevated but below the diabetic threshold — a critical warning window.", tone: "rose" },
];

const SYMPTOMS = [
  "Frequent urination", "Excessive thirst", "Extreme hunger",
  "Unexplained weight loss", "Fatigue", "Blurred vision",
  "Slow-healing wounds", "Numbness or tingling",
];

const DIET = [
  { icon: Utensils, title: "Whole grains", desc: "Oats, quinoa, brown rice — slow-releasing carbs stabilise glucose." },
  { icon: Salad, title: "Leafy greens", desc: "Spinach, kale, broccoli — low calorie, high fibre nutrient density." },
  { icon: Droplets, title: "Hydration", desc: "2-3L water/day; skip sugary drinks and packaged juices." },
];

const EXERCISE = [
  { icon: Dumbbell, title: "Strength training", desc: "2 sessions/week improves insulin sensitivity dramatically." },
  { icon: ActivitySquare, title: "Cardio", desc: "150 mins/week of brisk walking, cycling or swimming." },
  { icon: Brain, title: "Mind-body", desc: "Yoga and breathwork reduce cortisol-driven glucose spikes." },
];

const PREVENTION = [
  "Maintain BMI in the 18.5–24.9 range.",
  "Get 7–8 hours of restorative sleep nightly.",
  "Limit ultra-processed foods and refined sugars.",
  "Practice stress management (meditation, hobbies, social ties).",
  "Avoid tobacco and moderate alcohol consumption.",
  "Screen for glucose annually — earlier if family history exists.",
];

export default function Awareness() {
  return (
    <div data-testid="awareness-page" className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-7">
          <div className="chip mb-4">Diabetes Awareness</div>
          <h1 className="section-title">
            Knowledge is the first prescription.
          </h1>
          <p className="mt-4 text-slate-600 max-w-xl leading-relaxed">
            Whether you're at risk or supporting someone who is, understanding the mechanics of
            diabetes makes prevention and management dramatically more effective.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-5">
          <img src={IMAGES.diabetesAwareness} alt="Awareness ribbon" className="rounded-3xl h-72 w-full object-cover" />
        </motion.div>
      </div>

      <section className="mt-16">
        <h2 className="section-title text-3xl">Types of Diabetes</h2>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TYPES.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="med-card p-7"
            >
              <div className={`font-heading text-4xl font-bold ${
                t.tone === "blue" ? "text-[#0B3B60]"
                : t.tone === "emerald" ? "text-emerald-500"
                : t.tone === "amber" ? "text-amber-500"
                : "text-rose-500"
              }`}>0{i + 1}</div>
              <h3 className="font-heading font-semibold text-lg mt-3">{t.title}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 med-card p-10">
          <h3 className="font-heading text-2xl font-bold text-[#0B3B60]">Symptoms to watch</h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {SYMPTOMS.map((s) => (
              <div key={s} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                {s}
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-6">
          <img src={IMAGES.exerciseFitness} alt="Fitness" className="rounded-3xl h-72 w-full object-cover" />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="section-title text-3xl">Healthy Diet</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {DIET.map((d, i) => (
            <div key={d.title} className="med-card p-7">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <d.icon size={22} />
              </div>
              <h3 className="font-heading font-semibold">{d.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="section-title text-3xl">Exercise Tips</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {EXERCISE.map((d) => (
            <div key={d.title} className="med-card p-7">
              <div className="w-12 h-12 rounded-2xl bg-[#0B3B60]/8 text-[#0B3B60] flex items-center justify-center mb-4 bg-[#EFF6FB]">
                <d.icon size={22} />
              </div>
              <h3 className="font-heading font-semibold">{d.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <img src={IMAGES.healthyDiet} alt="Diet" className="rounded-3xl h-80 w-full object-cover" />
        </div>
        <div className="lg:col-span-6 med-card p-10">
          <div className="flex items-center gap-2 mb-3">
            <ShieldPlus className="text-emerald-500" size={20} />
            <div className="text-xs uppercase tracking-widest text-slate-500">Prevention</div>
          </div>
          <h3 className="font-heading text-2xl font-bold">Six pillars that keep glucose in check</h3>
          <ul className="mt-5 space-y-3">
            {PREVENTION.map((p) => (
              <li key={p} className="flex gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-[#0B3B60] text-white p-10 lg:p-16 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} />
            <div className="text-xs uppercase tracking-widest opacity-80">Early Detection</div>
          </div>
          <h3 className="font-heading text-3xl font-bold">
            Every year of early screening reduces complication risk by up to 40%.
          </h3>
          <p className="mt-4 text-slate-200 max-w-xl">
            A 10-minute annual glucose test can prevent decades of dialysis, blindness or amputation.
            Don't wait for symptoms — screen proactively.
          </p>
        </div>
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-40 h-40 rounded-full bg-white/10 flex items-center justify-center">
            <Stethoscope size={64} className="text-emerald-300" />
          </div>
        </div>
      </section>
    </div>
  );
}
