import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity, Droplet, HeartPulse, Salad, Dumbbell, ShieldCheck,
  Stethoscope, AlertTriangle, ArrowRight, Sparkles
} from "lucide-react";
import { IMAGES } from "@/lib/constants";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { once: true, margin: "-80px" },
};

const SYMPTOMS = [
  { icon: Droplet, title: "Frequent Urination", desc: "Excess glucose spills into urine, pulling extra fluids from tissues." },
  { icon: Activity, title: "Unusual Thirst", desc: "Dehydration from frequent urination triggers persistent thirst." },
  { icon: HeartPulse, title: "Extreme Fatigue", desc: "Cells starved of glucose cause chronic tiredness and low energy." },
  { icon: AlertTriangle, title: "Blurred Vision", desc: "High blood sugar pulls fluid from eye lenses, affecting focus." },
];

const CAUSES = [
  { title: "Insulin Resistance", desc: "Cells stop responding to insulin efficiently, common in Type 2." },
  { title: "Genetics", desc: "Family history significantly increases susceptibility." },
  { title: "Obesity", desc: "Excess adipose tissue disrupts glucose regulation." },
  { title: "Sedentary Lifestyle", desc: "Inactivity reduces insulin sensitivity over time." },
];

const RISK = [
  "Age above 45", "BMI ≥ 25", "Sedentary routine",
  "High blood pressure", "Family history", "Poor diet quality",
];

const PREVENTION = [
  { icon: Salad, title: "Balanced Diet", desc: "Whole grains, greens, lean protein — avoid refined sugars." },
  { icon: Dumbbell, title: "Move Daily", desc: "150 minutes of moderate exercise per week." },
  { icon: ShieldCheck, title: "Regular Screening", desc: "Annual fasting glucose + HbA1c checks after age 35." },
  { icon: Stethoscope, title: "Monitor Vitals", desc: "Track BP, weight, and glucose trends over time." },
];

export default function Home() {
  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F0F7FB] to-[#E8F5EE]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#0B3B60]/10 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-24 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div {...fadeUp} className="lg:col-span-7">
            <div className="chip mb-5" data-testid="hero-chip">
              <span className="pulse-dot" /> Random Forest • 76% Accuracy • 220+ Trees
            </div>
            <h1 className="section-title text-[#0F172A] text-4xl sm:text-5xl lg:text-6xl leading-[1.02]">
              Early diabetes signals,<br />
              <span className="text-[#0B3B60]">read like a specialist</span>
              <span className="text-emerald-500">.</span>
            </h1>
            <p className="mt-6 text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              GlucoSight analyses seven clinical parameters through a Random Forest
              classifier trained on the Pima Indians dataset — helping learners and
              patients understand personal diabetes risk in seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/predict" className="btn-primary inline-flex items-center gap-2" data-testid="hero-cta-predict">
                Predict Now <ArrowRight size={16} />
              </Link>
              <Link to="/awareness" className="btn-ghost inline-flex items-center gap-2" data-testid="hero-cta-learn">
                Learn about Diabetes
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { k: "7", v: "Clinical inputs" },
                { k: "250", v: "Decision trees" },
                { k: "80/20", v: "Train / Test split" },
              ].map((s) => (
                <div key={s.v} className="med-card p-4">
                  <div className="font-heading text-2xl font-bold text-[#0B3B60]">{s.k}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.15 }} className="lg:col-span-5">
            <div className="relative">
              <div className="rounded-[32px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(11,59,96,0.35)]">
                <img
                  src={IMAGES.heroConsultation}
                  alt="Doctor consultation"
                  className="w-full h-[520px] object-cover"
                />
              </div>
              <div className="absolute -left-6 bottom-10 glass rounded-2xl p-4 w-56">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-emerald-500" />
                  <div className="text-xs font-semibold text-slate-600">Live prediction</div>
                </div>
                <div className="font-heading text-lg font-bold text-emerald-600">Non-Diabetic</div>
                <div className="text-xs text-slate-500">Confidence 96.4%</div>
              </div>
              <div className="absolute -right-4 top-8 glass rounded-2xl p-4 w-52">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Model</div>
                <div className="font-heading font-bold text-[#0B3B60]">Random Forest</div>
                <div className="text-xs text-slate-500 mt-1">Auto-tuned depth: 10</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT IS DIABETES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <motion.div {...fadeUp} className="lg:col-span-5">
            <div className="chip chip-blue mb-4">01 — Understanding</div>
            <h2 className="section-title">What is Diabetes?</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Diabetes is a chronic metabolic disorder where blood glucose stays
              higher than normal, either because the pancreas produces too little
              insulin (Type 1) or because the body's cells resist its action
              (Type 2). Uncontrolled diabetes damages nerves, kidneys, eyes, and
              blood vessels — making early screening critical.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {["Type 1", "Type 2", "Gestational", "Pre-diabetes"].map((t) => (
                <div key={t} className="med-card px-5 py-3 text-sm font-medium text-slate-700">{t}</div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="lg:col-span-7 grid grid-cols-2 gap-4">
            <img src={IMAGES.glucoseMonitoring} alt="Glucose monitoring" className="rounded-3xl h-64 w-full object-cover" />
            <img src={IMAGES.medicalLaboratory} alt="Medical laboratory" className="rounded-3xl h-64 w-full object-cover" />
            <img src={IMAGES.healthyDiet} alt="Healthy diet" className="rounded-3xl h-56 w-full object-cover col-span-2" />
          </motion.div>
        </div>
      </section>

      {/* SYMPTOMS */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-12">
            <div className="chip chip-blue mb-3">02 — Symptoms</div>
            <h2 className="section-title">Signals your body sends</h2>
            <p className="mt-3 text-slate-600">
              Early symptoms are often subtle. Recognising them prompts timely testing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SYMPTOMS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="med-card p-7"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <s.icon size={22} />
                </div>
                <h3 className="font-heading font-semibold text-lg text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CAUSES + RISK */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-10">
        <motion.div {...fadeUp} className="lg:col-span-7">
          <div className="chip chip-blue mb-3">03 — Causes</div>
          <h2 className="section-title">Why diabetes develops</h2>
          <div className="mt-8 space-y-4">
            {CAUSES.map((c, i) => (
              <div key={c.title} className="med-card p-6 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0B3B60] text-white flex items-center justify-center font-heading font-bold text-sm shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="font-heading font-semibold text-slate-900">{c.title}</div>
                  <div className="text-sm text-slate-600 mt-1">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div {...fadeUp} className="lg:col-span-5">
          <div className="chip chip-blue mb-3">04 — Risk Factors</div>
          <h2 className="section-title text-3xl">Are you at risk?</h2>
          <div className="mt-6 med-card p-8">
            <ul className="space-y-3">
              {RISK.map((r) => (
                <li key={r} className="flex items-center gap-3 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {r}
                </li>
              ))}
            </ul>
            <Link to="/predict" className="btn-secondary inline-flex items-center gap-2 mt-6" data-testid="risk-cta-predict">
              Check your risk <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* PREVENTION */}
      <section className="bg-gradient-to-b from-[#F0F7FB] to-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-12">
            <div className="chip mb-3">05 — Prevention</div>
            <h2 className="section-title">Everyday habits that protect you</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PREVENTION.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="med-card p-7"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0B3B60] text-white flex items-center justify-center mb-4">
                  <p.icon size={22} />
                </div>
                <h3 className="font-heading font-semibold text-lg">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="relative overflow-hidden rounded-[32px] bg-[#0B3B60] text-white p-10 lg:p-16">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">
                Two minutes. Seven inputs. One informed decision.
              </h2>
              <p className="mt-4 text-slate-200 max-w-lg">
                Run your first prediction and see how machine learning surfaces patterns
                clinicians look for.
              </p>
              <Link to="/predict" className="mt-6 inline-flex btn-secondary items-center gap-2" data-testid="bottom-cta-predict">
                Try the prediction tool <ArrowRight size={16} />
              </Link>
            </div>
            <img src={IMAGES.healthTechnology} alt="Dashboard" className="rounded-2xl h-64 w-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
