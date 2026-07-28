export const API_BASE = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api`;

export const NAV_LINKS = [
  { to: "/", label: "Home", testid: "nav-home" },
  { to: "/about", label: "About", testid: "nav-about" },
  { to: "/predict", label: "Prediction", testid: "nav-predict" },
  { to: "/performance", label: "Model", testid: "nav-performance" },
  { to: "/awareness", label: "Awareness", testid: "nav-awareness" },
  { to: "/dashboard", label: "Dashboard", testid: "nav-dashboard" },
  { to: "/contact", label: "Contact", testid: "nav-contact" },
];

export const IMAGES = {
  heroConsultation: "https://images.pexels.com/photos/7578797/pexels-photo-7578797.jpeg",
  glucoseMonitoring: "https://images.pexels.com/photos/16984203/pexels-photo-16984203.jpeg",
  healthyDiet: "https://images.pexels.com/photos/12765459/pexels-photo-12765459.jpeg",
  exerciseFitness: "https://images.pexels.com/photos/8497646/pexels-photo-8497646.jpeg",
  medicalLaboratory: "https://images.pexels.com/photos/3735705/pexels-photo-3735705.jpeg",
  healthTechnology: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
  diabetesAwareness: "https://images.pexels.com/photos/6823566/pexels-photo-6823566.jpeg",
};

export const CONTACT_INFO = {
  studentName: "Koushik Yerra",
  college: "ANU college of Engineering and Technology",
  email: "koushikyerra59@gmail.com",
  phone: "+91 6301653110",
  github: "https://github.com/koushikyerra64",
  linkedin: "https://linkedin.com/in/koushik-yerra-1760bb301",
};
