"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  MessageSquare,
  Send,
  Eye,
  Plus,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { Inquiry } from "@/db/schema";

interface DashboardStats {
  totalDomains: number;
  newInquiries: number;
  sellSubmissions: number;
  totalVisitors: number;
  recentInquiries: Inquiry[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDomains: 0,
    newInquiries: 0,
    sellSubmissions: 0,
    totalVisitors: 0,
    recentInquiries: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) {
        throw new Error(`Failed to load stats (${res.status})`);
      }
      const data = await res.json();
      setStats({
        totalDomains: data.totalDomains ?? 0,
        newInquiries: data.newInquiries ?? 0,
        sellSubmissions: data.sellSubmissions ?? 0,
        totalVisitors: data.totalVisitors ?? 0,
        recentInquiries: data.recentInquiries ?? [],
      });
    } catch (err: any) {
      setError(err?.message || "Could not retrieve dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const columns: Column<Inquiry>[] = [
    {
      key: "name",
      label: "Contact",
      render: (inq) => (
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900">{inq.name}</span>
          <span className="text-xs text-neutral-500">{inq.email}</span>
        </div>
      ),
    },
    {
      key: "domainName",
      label: "Domain",
      render: (inq) => (
        <span className="font-medium text-neutral-800">
          {inq.domainName || (
            <span className="text-neutral-400 italic">General Inquiry</span>
          )}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (inq) => (
        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700">
          {inq.type}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (inq) => <StatusBadge status={inq.status} />,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (inq) => {
        const date = inq.createdAt ? new Date(inq.createdAt) : null;
        return (
          <span className="text-xs text-neutral-500 whitespace-nowrap">
            {date
              ? date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "",
      render: (inq) => (
        <div className="flex justify-end">
          <Link
            href={`/admin/inquiries?id=${inq.id}`}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="View inquiry"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Overview
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Real-time status of your .SI domain portfolio and inbound inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors shadow-xs"
            title="Refresh statistics"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-neutral-900" : ""}`}
            />
          </button>

          <Link
            href="/admin/domains/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Domain</span>
          </Link>

          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold shadow-xs transition-colors"
          >
            <span>All Inquiries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Error alert if fetch failed */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchStats}
            className="text-xs font-semibold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* 4 Stats Cards in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Domains"
          value={stats.totalDomains}
          icon={Globe}
          iconColor="text-blue-600 bg-blue-50"
          description="Registered .SI domains"
        />
        <StatsCard
          title="New Inquiries"
          value={stats.newInquiries}
          icon={MessageSquare}
          iconColor="text-emerald-600 bg-emerald-50"
          description="Awaiting response"
        />
        <StatsCard
          title="Sell Submissions"
          value={stats.sellSubmissions}
          icon={Send}
          iconColor="text-orange-600 bg-orange-50"
          description="Pending review"
        />
        <StatsCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon={Eye}
          iconColor="text-purple-600 bg-purple-50"
          description="All-time portfolio views"
        />
      </div>

      {/* Recent Inquiries Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-neutral-900">
              Recent Inquiries
            </h3>
            <p className="text-xs text-neutral-500">
              Latest inquiries submitted across your listed domains.
            </p>
          </div>

          <Link
            href="/admin/inquiries"
            className="text-xs font-semibold text-neutral-700 hover:text-black hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={stats.recentInquiries.slice(0, 10)}
          loading={loading}
          emptyTitle="No recent inquiries"
          emptyMessage="Inquiries submitted via domain landing pages will appear here."
        />
      </div>
    </div>
  );
}
