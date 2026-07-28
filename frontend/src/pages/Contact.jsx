import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Phone, GraduationCap, User, Github, Linkedin, MapPin, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendContact } from "@/lib/api";
import { CONTACT_INFO } from "@/lib/constants";

const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const onChange = (k, v) => setForm({ ...form, [k]: v });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill every field");
      return;
    }
    setLoading(true);
    try {
      await sendContact(form);
      toast.success("Message sent successfully");
      setForm(EMPTY);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { icon: User, label: "Student", value: CONTACT_INFO.studentName },
    { icon: GraduationCap, label: "College", value: CONTACT_INFO.college },
    { icon: Mail, label: "Email", value: CONTACT_INFO.email },
    { icon: Phone, label: "Phone", value: CONTACT_INFO.phone },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16" data-testid="contact-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="chip chip-blue mb-4">Contact</div>
        <h1 className="section-title">Let's talk about the project.</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Feedback, collaboration ideas or questions — drop a message and I'll respond within 48 hours.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8 mt-12">
        <div className="lg:col-span-7 med-card p-8">
          <h2 className="font-heading text-xl font-bold text-[#0B3B60]">Send a message</h2>
          <form onSubmit={onSubmit} className="mt-6 grid gap-5" data-testid="contact-form">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label className="field-label" htmlFor="c-name">Full name</Label>
                <Input
                  id="c-name"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="mt-2 rounded-xl h-11"
                  placeholder="Your name"
                  data-testid="contact-input-name"
                />
              </div>
              <div>
                <Label className="field-label" htmlFor="c-email">Email</Label>
                <Input
                  id="c-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="mt-2 rounded-xl h-11"
                  placeholder="you@example.com"
                  data-testid="contact-input-email"
                />
              </div>
            </div>
            <div>
              <Label className="field-label" htmlFor="c-subject">Subject</Label>
              <Input
                id="c-subject"
                value={form.subject}
                onChange={(e) => onChange("subject", e.target.value)}
                className="mt-2 rounded-xl h-11"
                placeholder="What's this about?"
                data-testid="contact-input-subject"
              />
            </div>
            <div>
              <Label className="field-label" htmlFor="c-message">Message</Label>
              <Textarea
                id="c-message"
                value={form.message}
                onChange={(e) => onChange("message", e.target.value)}
                className="mt-2 rounded-xl min-h-32"
                placeholder="Write your message…"
                data-testid="contact-input-message"
              />
            </div>
            <div>
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary rounded-full h-12 px-8"
                data-testid="contact-submit-button"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin mr-2" /> Sending…</>
                ) : (
                  <><Send size={16} className="mr-2" /> Send Message</>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-4">
          {cards.map((c) => (
            <div key={c.label} className="med-card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FB] text-[#0B3B60] flex items-center justify-center">
                <c.icon size={18} />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-slate-500">{c.label}</div>
                <div className="font-medium text-slate-800">{c.value}</div>
              </div>
            </div>
          ))}
          <div className="med-card p-5 flex gap-3">
            <a
              href={CONTACT_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-xl border border-slate-200 py-3 flex items-center justify-center gap-2 hover:bg-slate-50"
              data-testid="contact-github"
            >
              <Github size={16} /> GitHub
            </a>
            <a
              href={CONTACT_INFO.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-xl border border-slate-200 py-3 flex items-center justify-center gap-2 hover:bg-slate-50"
              data-testid="contact-linkedin"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
          </div>

          <div className="med-card p-2 overflow-hidden">
            <div className="rounded-2xl overflow-hidden">
              <iframe
                title="Campus map"
                width="100%"
                height="220"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.5%2C12.9%2C77.6%2C13.0&layer=mapnik"
                style={{ border: 0 }}
                data-testid="contact-map"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500">
              <MapPin size={14} /> Campus location placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
