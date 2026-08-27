import React, { useEffect, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { responseCache, CacheLog } from "./cache";
import {
  getMetricOverview,
  getTrafficSources,
  getConversionFunnel,
  getUserEvents,
  MetricOverview,
  TrafficSource,
  FunnelStep,
  UserEvent,
} from "./api";

const Dashboard: React.FC = () => {
  const { navigateTo } = useNavigation();

  // API Data State
  const [metrics, setMetrics] = useState<MetricOverview | null>(null);
  const [sources, setSources] = useState<TrafficSource[]>([]);
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [events, setEvents] = useState<UserEvent[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<"overview" | "conversion" | "traffic">("overview");
  const [loading, setLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<string>("");

  // Cache stats state
  const [cacheStats, setCacheStats] = useState({
    totalRequests: 0,
    cacheHits: 0,
    reductionRate: 0,
    latencySavedMs: 0,
  });
  const [cacheLogs, setCacheLogs] = useState<CacheLog[]>([]);

  // Subscribe to cache updates
  useEffect(() => {
    const handleCacheUpdate = () => {
      setCacheStats(responseCache.getStats());
      setCacheLogs(responseCache.getLogs());
    };
    
    // Initial fetch
    fetchAllData(false);
    
    // Subscribe
    const unsubscribe = responseCache.subscribe(handleCacheUpdate);
    handleCacheUpdate();

    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch all 4 endpoints
  const fetchAllData = async (forceRefresh = false) => {
    setLoading(true);
    setCurrentAction(forceRefresh ? "Fetching new data (Bypassing cache)..." : "Checking cache and loading views...");
    try {
      // Parallel execution of the 4 mock REST endpoints
      const [metricsData, sourcesData, funnelData, eventsData] = await Promise.all([
        getMetricOverview(forceRefresh),
        getTrafficSources(forceRefresh),
        getConversionFunnel(forceRefresh),
        getUserEvents(forceRefresh),
      ]);

      setMetrics(metricsData);
      setSources(sourcesData);
      setFunnel(funnelData);
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading dashboard data", error);
    } finally {
      setLoading(false);
      setCurrentAction("");
    }
  };

  const handleSimulateNavigation = () => {
    // User navigates tabs or views, pulling data. Since cache is active, it hits existing items.
    fetchAllData(false);
  };

  const handleForceRefresh = () => {
    // User requests direct reload, forcing API requests (bypass cache)
    fetchAllData(true);
  };

  const handleClearCache = () => {
    responseCache.clear();
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col font-sans">
      {/* Dashboard Top Navigation */}
      <nav className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="https://assets.website-files.com/62bea764d94f5f7e03ba6535/62beab439c2088751652cfba_Sitemark-Color.svg"
            alt="Sitemark Logo"
            className="w-24 h-auto object-contain cursor-pointer"
            onClick={() => navigateTo("landing")}
          />
          <span className="text-zinc-600">|</span>
          <span className="text-[#b6ff9c] font-bold text-sm tracking-wider uppercase">Console Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo("landing")}
            className="border border-[#b6ff9c] text-[#b6ff9c] hover:bg-[#b6ff9c] hover:text-black transition-all font-semibold rounded-full px-5 py-2 text-xs"
          >
            ← Back to Landing Page
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols wide on large screens): Main Dashboard Grid */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Dashboard Tab Filters */}
          <div className="flex justify-between items-center bg-[#181818] p-1.5 rounded-xl border border-zinc-800">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "overview" ? "bg-[#b6ff9c] text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                Overview KPIs
              </button>
              <button
                onClick={() => setActiveTab("traffic")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "traffic" ? "bg-[#b6ff9c] text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                Traffic Channels
              </button>
              <button
                onClick={() => setActiveTab("conversion")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "conversion" ? "bg-[#b6ff9c] text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                Conversion Funnel
              </button>
            </div>
            
            {loading && (
              <div className="flex items-center gap-2 pr-2">
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-[#b6ff9c]"></span>
                <span className="text-[10px] text-zinc-400">{currentAction}</span>
              </div>
            )}
          </div>

          {/* Render Tab Contents */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* CARD 1: Active Users */}
                <div className="bg-[#151515] p-5 rounded-2xl border border-zinc-800 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-zinc-400 font-medium">Monthly Active Users</span>
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-semibold">+12.4%</span>
                  </div>
                  <div className="mt-4">
                    {loading && !metrics ? (
                      <div className="h-9 w-24 bg-zinc-800 animate-pulse rounded"></div>
                    ) : (
                      <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        {metrics?.activeUsers.value.toLocaleString() ?? "12,480"}
                      </h2>
                    )}
                    <span className="text-[10px] text-zinc-500 mt-1 block">Real-time unique visitors</span>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-10">
                    <svg className="w-24 h-24 text-[#b6ff9c]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a7 7 0 00-7 7v1h12v-1a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>

                {/* CARD 2: Bounce Rate */}
                <div className="bg-[#151515] p-5 rounded-2xl border border-zinc-800 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-zinc-400 font-medium">Bounce Rate</span>
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-semibold">-2.1%</span>
                  </div>
                  <div className="mt-4">
                    {loading && !metrics ? (
                      <div className="h-9 w-24 bg-zinc-800 animate-pulse rounded"></div>
                    ) : (
                      <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        {metrics?.bounceRate.value ?? "42.3"}%
                      </h2>
                    )}
                    <span className="text-[10px] text-zinc-500 mt-1 block">Low-bounce target reached</span>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-10">
                    <svg className="w-24 h-24 text-[#b6ff9c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L10 10.586 13.586 7H12z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>

                {/* CARD 3: Conversion Rate */}
                <div className="bg-[#151515] p-5 rounded-2xl border border-zinc-800 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-zinc-400 font-medium">Goal Conversion Rate</span>
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-semibold">+0.8%</span>
                  </div>
                  <div className="mt-4">
                    {loading && !metrics ? (
                      <div className="h-9 w-24 bg-zinc-800 animate-pulse rounded"></div>
                    ) : (
                      <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        {metrics?.conversionRate.value ?? "3.85"}%
                      </h2>
                    )}
                    <span className="text-[10px] text-zinc-500 mt-1 block">Target: 3.50% conversion</span>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-10">
                    <svg className="w-24 h-24 text-[#b6ff9c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>

                {/* CARD 4: Avg Session Duration */}
                <div className="bg-[#151515] p-5 rounded-2xl border border-zinc-800 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-zinc-400 font-medium">Avg. Session Duration</span>
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-semibold">+5.2%</span>
                  </div>
                  <div className="mt-4">
                    {loading && !metrics ? (
                      <div className="h-9 w-24 bg-zinc-800 animate-pulse rounded"></div>
                    ) : (
                      <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        {metrics?.sessionDuration.value ?? "4m 32s"}
                      </h2>
                    )}
                    <span className="text-[10px] text-zinc-500 mt-1 block">Active engagement metric</span>
                  </div>
                  <div className="absolute right-0 bottom-0 opacity-10">
                    <svg className="w-24 h-24 text-[#b6ff9c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>

              </div>

              {/* Graphic Chart representation of metrics over time */}
              <div className="bg-[#151515] p-6 rounded-2xl border border-zinc-800 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-zinc-300">Live Traffic Volume Trend</h3>
                  <span className="text-[10px] bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-zinc-400">Interval: 1 hour</span>
                </div>
                <div className="h-32 flex items-end justify-between gap-2.5 pt-4">
                  {[35, 45, 60, 48, 70, 85, 62, 55, 90, 110, 95, 120].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                      <div className="w-full bg-[#1e1e1e] group-hover:bg-[#252525] rounded-t-sm h-full flex items-end">
                        <div
                          className="w-full bg-[#b6ff9c] hover:opacity-85 rounded-t-sm transition-all duration-700 ease-out"
                          style={{ height: `${(height / 120) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] text-zinc-600 font-semibold">{9 + i}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "traffic" && (
            <div className="bg-[#151515] p-6 rounded-2xl border border-zinc-800">
              <h3 className="font-bold text-lg mb-6">Traffic Channel Breakdown</h3>
              <div className="space-y-5">
                {sources.map((src, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-zinc-300">{src.source}</span>
                      <span className="text-zinc-400 font-semibold">{src.visitors.toLocaleString()} visitors ({src.percentage}%)</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-850 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${src.percentage}%`, backgroundColor: src.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "conversion" && (
            <div className="bg-[#151515] p-6 rounded-2xl border border-zinc-800">
              <h3 className="font-bold text-lg mb-6">Purchase Conversion Funnel</h3>
              <div className="space-y-4">
                {funnel.map((item, index) => (
                  <div key={index} className="relative flex items-center justify-between bg-black/30 p-4 border border-zinc-900 rounded-xl overflow-hidden">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#b6ff9c]/5 border-r border-[#b6ff9c]/10"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                    <div className="flex items-center gap-3 z-10">
                      <span className="bg-[#1e1e1e] border border-zinc-800 h-7 w-7 rounded-full flex items-center justify-center text-xs text-[#b6ff9c] font-bold">
                        {index + 1}
                      </span>
                      <span className="font-bold text-xs md:text-sm text-zinc-300">{item.step}</span>
                    </div>
                    <div className="text-right z-10">
                      <span className="font-extrabold text-sm md:text-base text-white block">{item.count.toLocaleString()}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">Conversion: {item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Row: Event logs stream */}
          <div className="bg-[#151515] p-6 rounded-2xl border border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-zinc-300">Live User Activity Feed</h3>
              <span className="text-[10px] text-[#b6ff9c] animate-pulse flex items-center gap-1 font-semibold">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#b6ff9c]"></span> Live Stream
              </span>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {events.map((evt) => (
                <div key={evt.id} className="flex justify-between items-center text-xs p-2.5 bg-black/20 border border-zinc-900 rounded-xl">
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-300">{evt.user}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">{evt.action}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-zinc-500 font-bold">{evt.time}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        evt.status === "success"
                          ? "bg-green-500"
                          : evt.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Performance Monitor & Caching Diagnostics Panel */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-[#181818] rounded-2xl border border-zinc-800 p-6 flex flex-col relative overflow-hidden">
            
            {/* Visual Header */}
            <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-4">
              <div className="p-2 bg-[#b6ff9c]/10 border border-[#b6ff9c]/30 rounded-xl text-[#b6ff9c]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Cache Performance Monitor</h3>
                <p className="text-[10px] text-zinc-500">Live API Efficiency Statistics</p>
              </div>
            </div>

            {/* Performance Circular Gauge */}
            <div className="flex flex-col items-center justify-center py-6 border-b border-zinc-800/50">
              <div className="relative flex items-center justify-center">
                
                {/* SVG Circular Dial */}
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#222"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#b6ff9c"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * cacheStats.reductionRate) / 100}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{cacheStats.reductionRate}%</span>
                  <span className="text-[9px] text-zinc-500 block uppercase tracking-wider mt-0.5">Trips Saved</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mt-4 text-center">
                Targets resume bullet metric: <strong className="text-[#b6ff9c]">40% Caching Efficiency</strong>
              </p>
            </div>

            {/* Caching Statistics Grid */}
            <div className="grid grid-cols-2 gap-3 py-4 border-b border-zinc-800/50">
              <div className="bg-black/30 p-3 border border-zinc-900 rounded-xl">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">API Calls Made</span>
                <span className="text-lg font-extrabold text-white">{cacheStats.totalRequests}</span>
              </div>
              <div className="bg-black/30 p-3 border border-zinc-900 rounded-xl">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">Cache Hits</span>
                <span className="text-lg font-extrabold text-white">{cacheStats.cacheHits}</span>
              </div>
            </div>

            {/* Saved Latency Metric */}
            <div className="bg-green-950/20 border border-green-500/20 p-3 rounded-xl flex items-center justify-between text-xs mt-4">
              <span className="text-zinc-300">Total Latency Saved:</span>
              <strong className="text-[#b6ff9c] font-bold">{cacheStats.latencySavedMs} ms</strong>
            </div>

            {/* Controls Panel */}
            <div className="flex flex-col gap-2.5 mt-6">
              <button
                onClick={handleSimulateNavigation}
                disabled={loading}
                className="w-full bg-[#b6ff9c] text-black hover:opacity-90 active:scale-[0.99] font-bold text-xs py-3 px-4 rounded-xl transition-all"
              >
                🔄 Simulate Tab Navigation (Default Caching)
              </button>

              <button
                onClick={handleForceRefresh}
                disabled={loading}
                className="w-full border border-zinc-850 hover:bg-zinc-900 active:scale-[0.99] font-bold text-xs py-3 px-4 rounded-xl transition-all"
              >
                ⚡ Force Reload (Bypass Cache)
              </button>

              <button
                onClick={handleClearCache}
                className="w-full border border-red-500/25 hover:bg-red-500/5 text-red-400 active:scale-[0.99] font-bold text-[10px] py-2 px-4 rounded-xl transition-all"
              >
                Wipe Local Cache Storage
              </button>
            </div>

          </div>

          {/* Console Output Card */}
          <div className="bg-[#121212] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col flex-1 min-h-64">
            <div className="bg-black px-4 py-2.5 border-b border-zinc-800 flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Live Cache Console Logs</span>
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            
            <div className="p-4 font-mono text-[9px] overflow-y-auto flex-1 flex flex-col-reverse gap-2 text-zinc-400 bg-black/60">
              {cacheLogs.length === 0 ? (
                <div className="text-zinc-600 italic">No cache logs yet. Press button above to run queries...</div>
              ) : (
                cacheLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed border-b border-zinc-900 pb-1 flex flex-col">
                    <div className="flex justify-between text-zinc-600 text-[8px] font-semibold mb-0.5">
                      <span>{log.timestamp}</span>
                      <span className={`uppercase font-bold ${
                        log.type === "hit" ? "text-green-400" :
                        log.type === "miss" ? "text-yellow-400" :
                        log.type === "expire" ? "text-red-400" : "text-blue-400"
                      }`}>{log.type}</span>
                    </div>
                    <span className={
                      log.type === "hit" ? "text-green-300" :
                      log.type === "miss" ? "text-yellow-200" :
                      log.type === "expire" ? "text-red-300" : "text-zinc-300"
                    }>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
