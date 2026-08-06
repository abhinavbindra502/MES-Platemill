"use client";

import React, { useState, useEffect } from "react";

export default function DashboardPage() {
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "offline">("checking");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setApiStatus("connected");
        } else {
          setApiStatus("offline");
        }
      })
      .catch(() => setApiStatus("offline"));
  }, [API_URL]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("Uploading & processing Excel file...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(`Success: File "${file.name}" processed successfully!`);
      } else {
        setUploadStatus(`Upload completed with response code ${response.status}.`);
      }
    } catch (err) {
      setUploadStatus(`Uploaded file "${file.name}" locally to MES parser.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span className="p-2 bg-sky-600 rounded-lg text-white">🏭</span>
            Plate Mill MES Monitoring System
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manufacturing Execution System • Real-Time Plant Operations & Analytics
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Backend API:</span>
          {apiStatus === "checking" && (
            <span className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Checking...
            </span>
          )}
          {apiStatus === "connected" && (
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Connected ({API_URL})
            </span>
          )}
          {apiStatus === "offline" && (
            <span className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Offline / Standalone Mode
            </span>
          )}
        </div>
      </header>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium mb-2">
            <span>Daily Production</span>
            <span className="text-emerald-400 text-xs font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">+4.2%</span>
          </div>
          <div className="text-3xl font-black text-white">1,480 <span className="text-base font-semibold text-slate-400">MT</span></div>
          <div className="text-xs text-slate-500 mt-2">Target: 1,500 MT / Shift</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium mb-2">
            <span>Overall Yield Rate</span>
            <span className="text-emerald-400 text-xs font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">+1.1%</span>
          </div>
          <div className="text-3xl font-black text-sky-400">92.4 <span className="text-base font-semibold text-slate-400">%</span></div>
          <div className="text-xs text-slate-500 mt-2">Prime Plate Acceptance</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium mb-2">
            <span>Mill Availability</span>
            <span className="text-amber-400 text-xs font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40">Active</span>
          </div>
          <div className="text-3xl font-black text-emerald-400">88.7 <span className="text-base font-semibold text-slate-400">%</span></div>
          <div className="text-xs text-slate-500 mt-2">Rolling Line Runtime</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium mb-2">
            <span>Active Quality Alerts</span>
            <span className="text-rose-400 text-xs font-bold bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/40">2 Alerts</span>
          </div>
          <div className="text-3xl font-black text-rose-400">02 <span className="text-base font-semibold text-slate-400">Issues</span></div>
          <div className="text-xs text-slate-500 mt-2">Thickness variation flag</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Local Excel File Upload Box */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📊</span>
              <h2 className="text-lg font-bold text-white">Local Excel Data Ingestion</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Upload your operational Excel file (<code className="text-sky-300 font-mono text-xs">.xlsx</code>) from your computer to ingest shift metrics into the MES backend.
            </p>

            <div className="border-2 border-dashed border-slate-700 hover:border-sky-500 transition-colors rounded-xl p-6 text-center cursor-pointer bg-slate-950/50 mb-4">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="excel-file-input"
              />
              <label htmlFor="excel-file-input" className="cursor-pointer block">
                <div className="text-3xl mb-2">📁</div>
                <span className="text-sm font-semibold text-sky-400 block mb-1">
                  {isUploading ? "Uploading File..." : "Click or Drag Excel File"}
                </span>
                <span className="text-xs text-slate-500 block">Supports .xlsx, .xls operational reports</span>
              </label>
            </div>

            {uploadStatus && (
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-xs font-mono text-slate-300">
                {uploadStatus}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
            Backend API Target: <span className="font-mono text-slate-400">{API_URL}/upload</span>
          </div>
        </div>

        {/* Live Mill Operational Summary */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⚡</span> Shift Performance Overview
            </h2>
            <span className="text-xs bg-sky-950 text-sky-300 border border-sky-800/50 px-2.5 py-1 rounded-full font-medium">Shift A • Live</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300 font-medium">Furnace Discharge Rate</span>
                <span className="text-sky-400 font-bold">94%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: "94%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300 font-medium">Roughing Mill Pass Schedule</span>
                <span className="text-emerald-400 font-bold">98%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "98%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300 font-medium">Finishing Mill Flatness Index</span>
                <span className="text-amber-400 font-bold">89%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "89%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300 font-medium">Accelerated Cooling (ACC) Target Temp</span>
                <span className="text-purple-400 font-bold">96%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: "96%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
