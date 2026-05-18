import axios from "axios";
import { env } from "@/shared/config/env";

export const instance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});
