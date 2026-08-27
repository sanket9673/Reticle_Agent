import { responseCache } from "./cache";

export interface MetricOverview {
  activeUsers: { value: number; change: number; trend: "up" | "down" };
  bounceRate: { value: number; change: number; trend: "up" | "down" };
  conversionRate: { value: number; change: number; trend: "up" | "down" };
  sessionDuration: { value: string; change: number; trend: "up" | "down" };
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

export interface FunnelStep {
  step: string;
  count: number;
  percentage: number;
}

export interface UserEvent {
  id: string;
  time: string;
  user: string;
  action: string;
  status: "success" | "warning" | "info";
}

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getMetricOverview(forceRefresh = false): Promise<MetricOverview> {
  const cacheKey = "metric_overview";
  if (!forceRefresh) {
    const cached = responseCache.get<MetricOverview>(cacheKey);
    if (cached) return cached;
  }

  // Simulate server round-trip latency
  await mockDelay(600);

  // Generate slightly randomized values to simulate a live database
  const activeUsersVal = 12000 + Math.floor(Math.random() * 800);
  const data: MetricOverview = {
    activeUsers: { value: activeUsersVal, change: 12.4, trend: "up" },
    bounceRate: { value: 42.3, change: -2.1, trend: "down" }, // Down is good
    conversionRate: { value: 3.85, change: 0.8, trend: "up" },
    sessionDuration: { value: "4m 32s", change: 5.2, trend: "up" }
  };

  responseCache.set(cacheKey, data);
  return data;
}

export async function getTrafficSources(forceRefresh = false): Promise<TrafficSource[]> {
  const cacheKey = "traffic_sources";
  if (!forceRefresh) {
    const cached = responseCache.get<TrafficSource[]>(cacheKey);
    if (cached) return cached;
  }

  await mockDelay(500);

  const data: TrafficSource[] = [
    { source: "Direct", visitors: 4850, percentage: 38.8, color: "#b6ff9c" },
    { source: "Organic Search", visitors: 3720, percentage: 29.8, color: "#60a5fa" },
    { source: "Social Media", visitors: 2150, percentage: 17.2, color: "#a855f7" },
    { source: "Referral Sites", visitors: 1760, percentage: 14.1, color: "#f43f5e" }
  ];

  responseCache.set(cacheKey, data);
  return data;
}

export async function getConversionFunnel(forceRefresh = false): Promise<FunnelStep[]> {
  const cacheKey = "conversion_funnel";
  if (!forceRefresh) {
    const cached = responseCache.get<FunnelStep[]>(cacheKey);
    if (cached) return cached;
  }

  await mockDelay(550);

  const data: FunnelStep[] = [
    { step: "1. Landed on Site", count: 10000, percentage: 100 },
    { step: "2. Sign Up Initiated", count: 4500, percentage: 45 },
    { step: "3. Feature Explored", count: 2100, percentage: 21 },
    { step: "4. Premium Purchased", count: 385, percentage: 3.85 }
  ];

  responseCache.set(cacheKey, data);
  return data;
}

export async function getUserEvents(forceRefresh = false): Promise<UserEvent[]> {
  const cacheKey = "user_events";
  if (!forceRefresh) {
    const cached = responseCache.get<UserEvent[]>(cacheKey);
    if (cached) return cached;
  }

  await mockDelay(400);

  const data: UserEvent[] = [
    { id: "e1", time: "Just now", user: "customer_alex@gmail.com", action: "Upgraded to Enterprise Plan", status: "success" },
    { id: "e2", time: "2m ago", user: "dev_sara@yahoo.com", action: "Generated new API Access Token", status: "info" },
    { id: "e3", time: "5m ago", user: "sys_john@outlook.com", action: "Threshold warning: Spike in traffic", status: "warning" },
    { id: "e4", time: "10m ago", user: "admin_emma@gmail.com", action: "Created product funnel A/B test", status: "info" }
  ];

  responseCache.set(cacheKey, data);
  return data;
}
