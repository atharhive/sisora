"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Globe2,
  Users,
  Eye,
  TrendingUp,
  Search,
  Filter,
  RotateCcw,
  Smartphone,
  Monitor,
  Tablet,
  Compass,
  Layers,
  Shield,
  ShieldAlert,
  Clock,
  Sparkles,
  ExternalLink,
  MapPin,
} from "lucide-react";
import {
  getAnalyticsData,
  AnalyticsReport,
  TimeRange,
} from "@/lib/actions/analytics-actions";
import { maskIp } from "@/lib/analytics-utils";
import { useToast } from "@/components/ui/Toast";

export default function AnalyticsAdminPage() {
  const { error: toastError } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [data, setData] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Search & Filters for visitor log
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [showFullIp, setShowFullIp] = useState(false);

  const loadReport = async (range: TimeRange) => {
    setLoading(true);
    try {
      const report = await getAnalyticsData(range);
      setData(report);
    } catch {
      toastError("Could not fetch latest analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport(timeRange);
  }, [timeRange]);

  const handleRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    startTransition(() => {
      loadReport(range);
    });
  };

  const handleRefresh = () => {
    loadReport(timeRange);
  };

  // Filter visitors log
  const filteredVisitors = (data?.recentVisitors || []).filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.ip.toLowerCase().includes(q) ||
      v.countryName.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      (v.domainName || "").toLowerCase().includes(q) ||
      v.path.toLowerCase().includes(q) ||
      v.source.toLowerCase().includes(q);

    const matchesCountry = countryFilter === "all" || v.countryCode === countryFilter;
    const matchesDevice = deviceFilter === "all" || v.device.toLowerCase() === deviceFilter.toLowerCase();

    return matchesSearch && matchesCountry && matchesDevice;
  });

  const uniqueCountriesInLog = Array.from(
    new Set((data?.recentVisitors || []).map((v) => v.countryCode))
  ).filter(Boolean);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. HEADER DECK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors mb-1 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Traffic &amp; Visitor Analytics
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Stream</span>
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal">
            Track who visited your domain marketplace, their geographic origin, referrers, and buyer asset demand.
          </p>
        </div>

        {/* Time Filter Tabs & Refresh */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="inline-flex p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 text-xs font-bold">
            {(
              [
                { id: "24h", label: "Today (24h)" },
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "all", label: "All Time" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => handleRangeChange(t.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === t.id
                    ? "bg-white text-neutral-900 shadow-2xs font-extrabold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading || isPending}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-60"
            title="Refresh analytics data"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading || isPending ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR HERO KPI METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Total Page Views */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Total Page Views
            </span>
            <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight font-sans">
              {loading ? "..." : (data?.kpis.totalViews || 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">hits</span>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">
            Traffic volume across all public pages
          </p>
        </div>

        {/* KPI 2: Unique Visitors */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Unique Visitors
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-tight font-sans">
              {loading ? "..." : (data?.kpis.uniqueVisitors || 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
              Sessions
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">
            Distinct visitor IP addresses &amp; devices
          </p>
        </div>

        {/* KPI 3: Top Viewed Domain Asset */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Top Domain In Demand
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight">
              {loading ? "..." : data?.kpis.topDomain?.name || "Portfolio"}
            </span>
            {data?.kpis.topDomain && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {data.kpis.topDomain.views} views
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">
            Most viewed .SI asset landing page
          </p>
        </div>

        {/* KPI 4: Primary Traffic Origin */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Primary Origin Country
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {data?.kpis.topCountry?.flag || "🇸🇮"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-neutral-950 tracking-tight">
                {loading ? "..." : data?.kpis.topCountry?.name || "Slovenia"}
              </span>
              {data?.kpis.topCountry && (
                <span className="text-xs font-bold text-neutral-400 font-mono">
                  {data.kpis.topCountry.percent}%
                </span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">
            Largest geographical market concentration
          </p>
        </div>
      </div>

      {/* 3. VISUAL BREAKDOWN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Geographic Breakdown (Col-Span 6) */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          {/* Countries Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-neutral-500" />
                <h3 className="text-sm font-bold text-neutral-950">
                  Visitor Origins by Country
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                {data?.countryBreakdown.length || 0} Countries
              </span>
            </div>

            <div className="space-y-3">
              {(data?.countryBreakdown || []).slice(0, 6).map((c) => (
                <div key={c.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span className="font-semibold text-neutral-900">{c.label}</span>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">
                        ({c.code})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-neutral-900">{c.count}</span>
                      <span className="text-neutral-400 text-[10px]">({c.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(c.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Cities Sub-section */}
            {data?.cityBreakdown && data.cityBreakdown.length > 0 && (
              <div className="pt-3 border-t border-neutral-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  Top Cities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.cityBreakdown.slice(0, 8).map((city) => (
                    <span
                      key={`${city.city}-${city.country}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200/80 text-[11px] font-semibold text-neutral-700"
                    >
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{city.city}</span>
                      <span className="font-mono text-[10px] text-neutral-400">({city.count})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Traffic Sources / Referrers Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-neutral-500" />
                <h3 className="text-sm font-bold text-neutral-950">
                  Traffic Sources &amp; Referrers
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                Acquisition
              </span>
            </div>

            <div className="space-y-3">
              {(data?.trafficSources || []).slice(0, 5).map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-900">{s.label}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-neutral-900">{s.count}</span>
                      <span className="text-neutral-400 text-[10px]">({s.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(s.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Asset Demand & Devices (Col-Span 6) */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          {/* Top Visited Domain Assets & Pages Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-neutral-500" />
                <h3 className="text-sm font-bold text-neutral-950">
                  Most Viewed Assets &amp; Pages
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                Demand
              </span>
            </div>

            <div className="space-y-2.5">
              {(data?.topAssets || []).slice(0, 7).map((a) => (
                <div
                  key={a.label}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/70 hover:bg-neutral-100/70 border border-neutral-200/60 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        a.label.endsWith(".si") ? "bg-emerald-500" : "bg-neutral-400"
                      }`}
                    />
                    <div className="truncate">
                      <span className="font-extrabold text-xs text-neutral-950 block truncate">
                        {a.label}
                      </span>
                      {a.sublabel && (
                        <span className="text-[10px] font-mono text-neutral-400 block truncate">
                          {a.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-xs text-neutral-900">
                      {a.count} <span className="text-[10px] text-neutral-400 font-normal">views</span>
                    </span>
                    {a.sublabel && (
                      <Link
                        href={a.sublabel}
                        target="_blank"
                        className="p-1 text-neutral-400 hover:text-black transition-colors"
                        title="View page on public site"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devices & Browsers Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-neutral-500" />
                <h3 className="text-sm font-bold text-neutral-950">
                  Devices &amp; Browsers
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                Hardware
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Device Split */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Device Class
                </span>
                <div className="space-y-1.5">
                  {(data?.deviceBreakdown || []).map((dev) => (
                    <div key={dev.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-700">
                        {dev.label.toLowerCase() === "mobile" ? (
                          <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                        ) : dev.label.toLowerCase() === "tablet" ? (
                          <Tablet className="w-3.5 h-3.5 text-neutral-400" />
                        ) : (
                          <Monitor className="w-3.5 h-3.5 text-neutral-400" />
                        )}
                        <span className="font-medium">{dev.label}</span>
                      </div>
                      <span className="font-mono font-bold text-neutral-900">{dev.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browser Split */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Top Browsers
                </span>
                <div className="space-y-1.5">
                  {(data?.browserBreakdown || []).slice(0, 4).map((b) => (
                    <div key={b.label} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-700">{b.label}</span>
                      <span className="font-mono font-bold text-neutral-900">{b.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. LIVE REAL-TIME VISITOR LOG ("WHO VISITED & FROM") */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs space-y-0">
        {/* Table Header & Controls */}
        <div className="p-5 sm:p-6 border-b border-neutral-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-neutral-950">
                Real-Time Visitor Log
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-100 text-neutral-600">
                {filteredVisitors.length} Entries
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Live audit stream of recent visitors, geographical location, target assets viewed, and referral channels.
            </p>
          </div>

          {/* Privacy Toggle: Full IP vs Masked */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFullIp(!showFullIp)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-[11px] font-bold text-neutral-700 transition-colors cursor-pointer"
              title="Toggle IP address masking"
            >
              {showFullIp ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Showing Full IP</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>IP Masked (GDPR)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3 bg-neutral-50/70 border-b border-neutral-200/70 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by IP, country, city, domain name, or route..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            {/* Country Filter */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shrink-0"
            >
              <option value="all">All Countries</option>
              {uniqueCountriesInLog.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>

            {/* Device Filter */}
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer shrink-0"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>

            {(searchQuery || countryFilter !== "all" || deviceFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCountryFilter("all");
                  setDeviceFilter("all");
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="p-16 text-center text-xs text-neutral-500 font-mono">
            Loading real-time visitor stream...
          </div>
        ) : filteredVisitors.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-500">
            No visitor records match the specified filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[800px]">
              <thead className="bg-neutral-50 border-b border-neutral-200/70 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Time</th>
                  <th className="p-4">Visitor &amp; Location</th>
                  <th className="p-4">Target Page / Asset</th>
                  <th className="p-4">Referral Channel</th>
                  <th className="p-4 pr-6 text-right">Device &amp; Browser</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {filteredVisitors.map((v, idx) => {
                  const visitDate = new Date(v.timestamp);
                  const isRecent = idx === 0;

                  return (
                    <tr
                      key={v.id}
                      className="hover:bg-neutral-50/70 transition-colors"
                    >
                      {/* Timestamp */}
                      <td className="p-4 pl-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isRecent && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          )}
                          <span className="font-mono text-neutral-900 text-xs font-bold">
                            {visitDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          {visitDate.toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </td>

                      {/* Visitor & Location */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl shrink-0">{v.flag}</span>
                          <div>
                            <div className="font-bold text-neutral-950 text-xs flex items-center gap-1.5">
                              <span>{v.countryName}</span>
                              <span className="text-[10px] font-mono text-neutral-400">
                                · {v.city}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-neutral-500 block">
                              {showFullIp ? v.ip : maskIp(v.ip)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Target Page / Asset */}
                      <td className="p-4">
                        {v.domainName ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-bold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{v.domainName}</span>
                          </div>
                        ) : (
                          <span className="font-mono text-neutral-800 text-xs font-semibold">
                            {v.path === "/" ? "Homepage (/)" : v.path}
                          </span>
                        )}
                      </td>

                      {/* Referral Channel */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            v.source === "Direct Navigation"
                              ? "bg-neutral-100 text-neutral-700"
                              : v.source.includes("X")
                              ? "bg-sky-50 text-sky-800 border border-sky-200/80"
                              : v.source.includes("LinkedIn")
                              ? "bg-blue-50 text-blue-800 border border-blue-200/80"
                              : "bg-purple-50 text-purple-800 border border-purple-200/80"
                          }`}
                        >
                          {v.source}
                        </span>
                      </td>

                      {/* Device & Browser */}
                      <td className="p-4 pr-6 text-right whitespace-nowrap">
                        <div className="font-semibold text-neutral-900 text-xs">
                          {v.browser} on {v.os}
                        </div>
                        <span className="text-[10px] text-neutral-400 capitalize font-mono">
                          {v.device}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
