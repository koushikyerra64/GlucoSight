import axios from "axios";
import { API_BASE } from "@/lib/constants";

const client = axios.create({ baseURL: API_BASE, timeout: 30000 });

export const predictDiabetes = (payload) => client.post("/predict", payload).then((r) => r.data);
export const getModelMetrics = () => client.get("/model/metrics").then((r) => r.data);
export const getDashboardStats = () => client.get("/dashboard/stats").then((r) => r.data);
export const sendContact = (payload) => client.post("/contact", payload).then((r) => r.data);
