import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, RotateCcw, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { predictDiabetes } from "@/lib/api";
import { IMAGES } from "@/lib/constants";

const FIELDS = [
  { name: "glucose", label: "Glucose Level", unit: "mg/dL", placeholder: "e.g. 120", hint: "Fasting: 70-99. Diabetic: ≥126" },
  { name: "bloodPressure", label: "Blood Pressure", unit: "mm Hg", placeholder: "e.g. 72", hint: "Diastolic value" },
  { name: "skinThickness", label: "Skin Thickness", unit: "mm", placeholder: "e.g. 23", hint: "Triceps skinfold" },
  { name: "insulin", label: "Insulin", unit: "µU/mL", placeholder: "e.g. 79", hint: "2-hour serum insulin" },
  { name: "bmi", label: "Body Mass Index (BMI)", unit: "kg/m²", placeholder: "e.g. 28.5", hint: "Weight / Height²" },
  { name: "diabetesPedigreeFunction", label: "Diabetes Pedigree Function", unit: "", placeholder: "e.g. 0.47", hint: "Genetic likelihood score" },
  { name: "age", label: "Age", unit: "years", placeholder: "e.g. 34", hint: "Whole number" },
];

const EMPTY = FIELDS.reduce((a, f) => ({ ...a, [f.name]: "" }), {});

export default function Predict() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onChange = (name, value) => setForm({ ...form, [name]: value });

  const validate = () => {
    for (const f of FIELDS) {
      if (form[f.name] === "" || form[f.name] === null || Number.isNaN(Number(form[f.name]))) {
        toast.error(`Please enter a valid ${f.label}`);
        return false;
      }
      if (Number(form[f.name]) < 0) {
        toast.error(`${f.label} cannot be negative`);
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setResult(null);
    try {
      const payload = FIELDS.reduce((a, f) => ({ ...a, [f.name]: Number(form[f.name]) }), {});
      payload.age = Math.round(payload.age);
      const data = await predictDiabetes(payload);
      setResult(data);
      toast.success("Prediction complete");
    } catch (err) {
      const detail = err?.response?.data?.detail || err.message || "Something went wrong";
      toast.error(typeof detail === "string" ? detail : "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setForm(EMPTY);
    setResult(null);
  };

  const isDiabetic = result?.label === 1;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16" data-testid="predict-page">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="chip chip-blue mb-4">Prediction</div>
          <h1 className="section-title">Assess your diabetes risk</h1>
          <p className="mt-3 text-slate-600 max-w-xl">
            Fill in the seven clinical parameters below. Values remain in your session unless
            a prediction is submitted.
          </p>

          <form onSubmit={onSubmit} className="mt-8 med-card p-8" data-testid="predict-form">
            <div className="grid md:grid-cols-2 gap-5">
              {FIELDS.map((f) => (
                <div key={f.name}>
                  <Label className="field-label" htmlFor={f.name}>
                    {f.label} {f.unit && <span className="text-slate-400 normal-case">({f.unit})</span>}
                  </Label>
                  <Input
                    id={f.name}
                    type="number"
                    step="any"
                    min="0"
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={(e) => onChange(f.name, e.target.value)}
                    className="mt-2 rounded-xl h-11 focus:ring-2 focus:ring-[#0B3B60]/20"
                    data-testid={`predict-input-${f.name}`}
                    required
                  />
                  <p className="mt-1 text-xs text-slate-500">{f.hint}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary rounded-full h-12 px-8 disabled:opacity-70"
                data-testid="predict-submit-button"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" /> Predicting…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" /> Predict
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={onReset}
                variant="ghost"
                className="btn-ghost rounded-full h-12 px-6"
                data-testid="predict-reset-button"
              >
                <RotateCcw size={16} className="mr-2" /> Reset
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden">
            <img src={IMAGES.glucoseMonitoring} alt="Glucose test" className="w-full h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B60]/70 to-transparent flex items-end p-6">
              <div className="text-white">
                <div className="text-xs uppercase tracking-widest opacity-80">Model</div>
                <div className="font-heading text-2xl font-bold">Random Forest • 250 trees</div>
              </div>
            </div>
          </div>

          <motion.div
            key={result ? result.id : "empty"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 med-card p-8"
            data-testid="predict-result-card"
          >
            {!result ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Activity size={22} />
                </div>
                <p className="mt-4 text-slate-500 text-sm">
                  Your prediction result will appear here.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-500">Prediction</div>
                <div
                  className={`mt-2 font-heading text-4xl font-bold ${
                    isDiabetic ? "text-rose-600" : "text-emerald-600"
                  }`}
                  data-testid="predict-result-label"
                >
                  {result.prediction}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">Confidence</div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${isDiabetic ? "bg-rose-500" : "bg-emerald-500"}`}
                        style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
                      />
                    </div>
                  </div>
                  <div
                    className="font-heading font-bold text-2xl text-[#0B3B60]"
                    data-testid="predict-result-confidence"
                  >
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-6 p-5 rounded-2xl bg-[#F0F7FB] border border-[#DDEAF3]">
                  <div className="text-xs uppercase tracking-widest text-[#0B3B60] font-semibold">
                    Recommendation
                  </div>
                  <p
                    className="mt-2 text-sm text-slate-700 leading-relaxed"
                    data-testid="predict-result-recommendation"
                  >
                    {result.recommendation}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">P(Non-Diab)</div>
                    <div className="font-heading font-bold text-slate-900 mt-1">
                      {((1 - result.probability_diabetic) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">P(Diabetic)</div>
                    <div className="font-heading font-bold text-slate-900 mt-1">
                      {(result.probability_diabetic * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[11px] text-slate-400">
                  This tool is educational and not a substitute for clinical diagnosis.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
