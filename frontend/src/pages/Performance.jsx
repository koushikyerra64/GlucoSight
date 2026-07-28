import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { getModelMetrics } from "@/lib/api";
import { toast } from "sonner";

const METRIC_CARDS = [
  { key: "accuracy", label: "Accuracy", color: "#0B3B60" },
  { key: "precision", label: "Precision", color: "#10B981" },
  { key: "recall", label: "Recall", color: "#0EA5E9" },
  { key: "f1_score", label: "F1 Score", color: "#F59E0B" },
  { key: "roc_auc", label: "ROC AUC", color: "#8B5CF6" },
];

export default function Performance() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelMetrics()
      .then(setMetrics)
      .catch(() => toast.error("Failed to load model metrics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 text-slate-500" data-testid="performance-loading">
        Loading model performance…
      </div>
    );
  }

  const cm = metrics.confusion_matrix;
  const cmCells = [
    { label: "True Negative", value: cm.true_negative, tone: "emerald" },
    { label: "False Positive", value: cm.false_positive, tone: "rose" },
    { label: "False Negative", value: cm.false_negative, tone: "rose" },
    { label: "True Positive", value: cm.true_positive, tone: "emerald" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16" data-testid="performance-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="chip chip-blue mb-4">Model Performance</div>
        <h1 className="section-title">How well does the model see?</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Metrics computed on the held-out 20% test partition
          ({metrics.testing_samples} samples out of {metrics.total_samples}).
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
        {METRIC_CARDS.map((m) => (
          <div key={m.key} className="med-card p-6" data-testid={`metric-${m.key}`}>
            <div className="text-xs uppercase tracking-widest text-slate-500">{m.label}</div>
            <div
              className="font-heading text-3xl font-bold mt-2"
              style={{ color: m.color }}
            >
              {(metrics[m.key] * 100).toFixed(1)}%
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full"
                style={{ width: `${metrics[m.key] * 100}%`, background: m.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6 mt-10">
        {/* ROC Curve */}
        <div className="lg:col-span-7 med-card p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500">Curve</div>
              <h3 className="font-heading text-xl font-bold">ROC — Receiver Operating Characteristic</h3>
            </div>
            <div className="chip">AUC {metrics.roc_auc.toFixed(3)}</div>
          </div>
          <div className="h-72" data-testid="roc-chart">
            <ResponsiveContainer>
              <LineChart data={metrics.roc_curve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="fpr"
                  type="number"
                  domain={[0, 1]}
                  tickFormatter={(v) => v.toFixed(1)}
                  label={{ value: "False Positive Rate", position: "insideBottom", offset: -5, fill: "#64748B", fontSize: 12 }}
                  stroke="#94A3B8"
                />
                <YAxis
                  type="number"
                  domain={[0, 1]}
                  tickFormatter={(v) => v.toFixed(1)}
                  label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", fill: "#64748B", fontSize: 12 }}
                  stroke="#94A3B8"
                />
                <Tooltip
                  formatter={(v) => Number(v).toFixed(3)}
                  contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                />
                <Line type="monotone" dataKey="tpr" stroke="#0B3B60" strokeWidth={2.5} dot={false} />
                <Line
                  type="monotone"
                  dataKey="fpr"
                  stroke="#CBD5E1"
                  strokeDasharray="4 4"
                  dot={false}
                  name="Random"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="lg:col-span-5 med-card p-8" data-testid="confusion-matrix">
          <div className="text-xs uppercase tracking-widest text-slate-500">Confusion Matrix</div>
          <h3 className="font-heading text-xl font-bold">Predicted vs Actual</h3>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {cmCells.map((c, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 ${
                  c.tone === "emerald"
                    ? "bg-emerald-50 border border-emerald-100"
                    : "bg-rose-50 border border-rose-100"
                }`}
              >
                <div className="text-[11px] uppercase tracking-widest text-slate-500">{c.label}</div>
                <div
                  className={`font-heading text-3xl font-bold mt-2 ${
                    c.tone === "emerald" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {c.value}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Rows = Actual class · Columns = Predicted class · Non-Diabetic (top), Diabetic (bottom).
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="mt-10 med-card p-8">
        <div className="text-xs uppercase tracking-widest text-slate-500">Explainability</div>
        <h3 className="font-heading text-xl font-bold">Feature Importance</h3>
        <div className="h-80 mt-6" data-testid="feature-importance-chart">
          <ResponsiveContainer>
            <BarChart data={metrics.feature_importance} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" stroke="#94A3B8" tickFormatter={(v) => v.toFixed(2)} />
              <YAxis type="category" dataKey="feature" stroke="#64748B" width={140} />
              <Tooltip
                formatter={(v) => Number(v).toFixed(3)}
                contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
              />
              <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
                {metrics.feature_importance.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#10B981" : "#0B3B60"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-3xl">
          Glucose consistently emerges as the strongest predictor, followed by BMI and age —
          matching well-established clinical intuition.
        </p>
      </div>
    </div>
  );
}
