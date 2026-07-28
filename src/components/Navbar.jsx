import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/40" data-testid="site-navbar">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
          <div className="w-9 h-9 rounded-xl bg-[#0B3B60] flex items-center justify-center text-white">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-heading font-bold text-[#0F172A]">GlucoSight</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">
              Diabetes AI
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-testid={l.testid}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#0B3B60] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/predict"
          className="hidden lg:inline-flex btn-primary text-sm"
          data-testid="nav-cta-predict"
        >
          Predict Now
        </Link>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          data-testid="nav-mobile-toggle"
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white" data-testid="nav-mobile-menu">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                data-testid={`${l.testid}-mobile`}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive ? "bg-[#0B3B60] text-white" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
