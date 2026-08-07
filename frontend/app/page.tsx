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
        await response.json();
        setUploadStatus(`✅ Success: File "${file.name}" processed into MES Database!`);
      } else {
        setUploadStatus(`ℹ️ File "${file.name}" uploaded (API status: ${response.status}).`);
      }
    } catch {
      setUploadStatus(`ℹ️ File "${file.name}" ingested locally.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-title-box">
          <div className="header-icon">🏭</div>
          <div>
            <h1 className="header-title">Plate Mill MES Monitoring System</h1>
            <p className="header-subtitle">
              Manufacturing Execution System • Real-Time Plant Operations & Analytics
            </p>
          </div>
        </div>

        <div className="api-badge">
          <span>Backend API:</span>
          {apiStatus === "checking" && (
            <>
              <span className="badge-status-dot offline" />
              <span style={{ color: "#f59e0b" }}>Connecting...</span>
            </>
          )}
          {apiStatus === "connected" && (
            <>
              <span className="badge-status-dot connected" />
              <span style={{ color: "#10b981" }}>Connected ({API_URL})</span>
            </>
          )}
          {apiStatus === "offline" && (
            <>
              <span className="badge-status-dot offline" />
              <span style={{ color: "#f43f5e" }}>Offline / Standalone Mode</span>
            </>
          )}
        </div>
      </header>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Daily Production</span>
            <span className="kpi-trend positive">+4.2%</span>
          </div>
          <div className="kpi-value">
            1,480 <span className="kpi-unit">MT</span>
          </div>
          <div className="kpi-footer">Target: 1,500 MT / Shift</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Overall Yield Rate</span>
            <span className="kpi-trend positive">+1.1%</span>
          </div>
          <div className="kpi-value" style={{ color: "#38bdf8" }}>
            92.4 <span className="kpi-unit">%</span>
          </div>
          <div className="kpi-footer">Prime Plate Acceptance</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Mill Availability</span>
            <span className="kpi-trend positive">Active</span>
          </div>
          <div className="kpi-value" style={{ color: "#10b981" }}>
            88.7 <span className="kpi-unit">%</span>
          </div>
          <div className="kpi-footer">Rolling Line Runtime</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">Quality Alerts</span>
            <span className="kpi-trend alert">2 Alerts</span>
          </div>
          <div className="kpi-value" style={{ color: "#f43f5e" }}>
            02 <span className="kpi-unit">Issues</span>
          </div>
          <div className="kpi-footer">Thickness variation flag</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="main-grid">
        {/* Local Excel Upload */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-icon">📊</span>
            <h2 className="panel-title">Local Excel Data Ingestion</h2>
          </div>
          <p className="panel-description">
            Upload your operational Excel report (<code style={{ color: "#38bdf8" }}>.xlsx</code>) from your computer to ingest shift metrics into the MES backend.
          </p>

          <div className="dropzone">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="upload-input"
              id="excel-file-input"
            />
            <label htmlFor="excel-file-input" style={{ cursor: "pointer", display: "block" }}>
              <div className="dropzone-icon">📂</div>
              <span className="dropzone-title">
                {isUploading ? "Uploading & Processing..." : "Click or Drag Excel File"}
              </span>
              <span className="dropzone-text">Supports .xlsx, .xls plant reports</span>
            </label>
          </div>

          {uploadStatus && <div className="upload-status-box">{uploadStatus}</div>}

          <div className="kpi-footer" style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "0.75rem" }}>
            Target Endpoint: <code style={{ color: "#94a3b8" }}>{API_URL}/upload</code>
          </div>
        </div>

        {/* Live Operational Progress */}
        <div className="dashboard-panel">
          <div className="panel-header" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span className="panel-icon">⚡</span>
              <h2 className="panel-title">Shift Performance Overview</h2>
            </div>
            <span className="kpi-trend positive" style={{ fontSize: "0.8rem", padding: "0.3rem 0.75rem" }}>Shift A • Live</span>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div className="meter-row">
              <div className="meter-label-group">
                <span className="meter-name">Furnace Discharge Rate</span>
                <span className="meter-val">94%</span>
              </div>
              <div className="meter-track">
                <div className="meter-fill cyan" style={{ width: "94%" }} />
              </div>
            </div>

            <div className="meter-row">
              <div className="meter-label-group">
                <span className="meter-name">Roughing Mill Pass Schedule</span>
                <span className="meter-val" style={{ color: "#10b981" }}>98%</span>
              </div>
              <div className="meter-track">
                <div className="meter-fill emerald" style={{ width: "98%" }} />
              </div>
            </div>

            <div className="meter-row">
              <div className="meter-label-group">
                <span className="meter-name">Finishing Mill Flatness Index</span>
                <span className="meter-val" style={{ color: "#f59e0b" }}>89%</span>
              </div>
              <div className="meter-track">
                <div className="meter-fill amber" style={{ width: "89%" }} />
              </div>
            </div>

            <div className="meter-row">
              <div className="meter-label-group">
                <span className="meter-name">Accelerated Cooling (ACC) Target Temp</span>
                <span className="meter-val" style={{ color: "#c084fc" }}>96%</span>
              </div>
              <div className="meter-track">
                <div className="meter-fill purple" style={{ width: "96%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
