import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { Users, Activity, HeartPulse, TrendingUp, ShieldCheck, Clock } from "lucide-react";
import { getDashboardStats } from "@/lib/api";
import { toast } from "sonner";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 text-slate-500" data-testid="dashboard-loading">
        Loading dashboard…
      </div>
    );
  }

  const kpi = [
    { icon: Users, label: "Total Predictions", value: stats.totalPredictions, tone: "blue" },
    { icon: HeartPulse, label: "Diabetic Cases", value: stats.diabeticCases, tone: "rose" },
    { icon: ShieldCheck, label: "Non-Diabetic Cases", value: stats.nonDiabeticCases, tone: "emerald" },
    { icon: TrendingUp, label: "Model Accuracy", value: `${(stats.modelAccuracy * 100).toFixed(1)}%`, tone: "amber" },
  ];

  const pieData = [
    { name: "Diabetic", value: stats.diabeticCases },
    { name: "Non-Diabetic", value: stats.nonDiabeticCases },
  ];
  const PIE_COLORS = ["#EF4444", "#10B981"];

  const featureBar = stats.featureImportance.map((f) => ({
    feature: f.feature,
    importance: Number((f.importance * 100).toFixed(2)),
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16" data-testid="dashboard-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="chip mb-4"><span className="pulse-dot" /> Live</div>
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600 max-w-xl">
            Live counters of predictions handled by the model, along with class-wise distribution
            and the top clinical drivers.
          </p>
        </div>
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <Clock size={16} className="text-slate-500" />
          <div className="text-xs text-slate-500 uppercase tracking-widest">Session</div>
          <div className="font-heading font-semibold text-[#0B3B60]">
            {new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {kpi.map((k) => (
          <div key={k.label} className="med-card p-6" data-testid={`kpi-${k.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                k.tone === "blue" ? "bg-[#EFF6FB] text-[#0B3B60]"
                : k.tone === "rose" ? "bg-rose-50 text-rose-500"
                : k.tone === "emerald" ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
              }`}>
                <k.icon size={18} />
              </div>
              <Activity size={14} className="text-slate-300" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-widest text-slate-500">{k.label}</div>
            <div className="mt-1 font-heading text-3xl font-bold text-slate-900">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6 mt-8">
        <div className="lg:col-span-7 med-card p-8">
          <div className="text-xs uppercase tracking-widest text-slate-500">Explainability</div>
          <h3 className="font-heading text-xl font-bold">Feature Importance</h3>
          <div className="h-80 mt-6" data-testid="dashboard-feature-chart">
            <ResponsiveContainer>
              <BarChart data={featureBar} margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="feature" stroke="#94A3B8" fontSize={11} interval={0} angle={-20} height={70} textAnchor="end" />
                <YAxis stroke="#94A3B8" unit="%" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }} formatter={(v) => `${v}%`} />
                <Bar dataKey="importance" radius={[8, 8, 0, 0]}>
                  {featureBar.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#10B981" : "#0B3B60"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 med-card p-8" data-testid="dashboard-pie-chart">
          <div className="text-xs uppercase tracking-widest text-slate-500">Distribution</div>
          <h3 className="font-heading text-xl font-bold">Diabetic vs Non-Diabetic</h3>
          {stats.totalPredictions === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No predictions yet — run one on the Prediction page.
            </div>
          ) : (
            <div className="h-64 mt-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 med-card p-8">
        <div className="text-xs uppercase tracking-widest text-slate-500">Activity</div>
        <h3 className="font-heading text-xl font-bold">Recent Predictions</h3>
        {stats.recentPredictions.length === 0 ? (
          <div className="mt-6 text-sm text-slate-500">No predictions logged yet.</div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm" data-testid="dashboard-recent-table">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="py-3 pr-4">Timestamp</th>
                  <th className="py-3 pr-4">Prediction</th>
                  <th className="py-3 pr-4">Confidence</th>
                  <th className="py-3 pr-4">Glucose</th>
                  <th className="py-3 pr-4">BMI</th>
                  <th className="py-3 pr-4">Age</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPredictions.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50">
                    <td className="py-3 pr-4 text-slate-500">
                      {new Date(r.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.label === 1 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {r.prediction}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-medium text-slate-800">
                      {(r.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{r.inputs?.glucose}</td>
                    <td className="py-3 pr-4 text-slate-600">{r.inputs?.bmi}</td>
                    <td className="py-3 pr-4 text-slate-600">{r.inputs?.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
