import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Phone, Activity } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#0B3B60] text-slate-100" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Activity size={18} />
            </div>
            <div>
              <div className="font-heading text-lg font-bold">GlucoSight</div>
              <div className="text-[10px] uppercase tracking-widest text-emerald-300">
                Diabetes AI
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            An educational diabetes risk-screening tool powered by a Random Forest classifier
            trained on the Pima Indians dataset.
          </p>
        </div>

        <div>
          <div className="font-heading font-semibold mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/predict" className="hover:text-white">Prediction</Link></li>
            <li><Link to="/performance" className="hover:text-white">Model Performance</Link></li>
            <li><Link to="/awareness" className="hover:text-white">Awareness</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-heading font-semibold mb-4">Contact</div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2"><Mail size={14} /> {CONTACT_INFO.email}</li>
            <li className="flex items-center gap-2"><Phone size={14} /> {CONTACT_INFO.phone}</li>
            <li>{CONTACT_INFO.college}</li>
          </ul>
        </div>

        <div>
          <div className="font-heading font-semibold mb-4">Follow</div>
          <div className="flex gap-3">
            <a
              href={CONTACT_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              data-testid="footer-github"
            >
              <Github size={16} />
            </a>
            <a
              href={CONTACT_INFO.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              data-testid="footer-linkedin"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} GlucoSight - Diabetes Prediction System - Built for educational use only.
      </div>
    </footer>
  );
}
