import React, { useState, useEffect, useMemo } from "react";
import "./ReminderPage.css";
import { auth, db } from "./Firebase"; // keep your existing firebase exports
import { doc, getDoc } from "firebase/firestore";

export default function ReminderPage() {
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit | view
  const [records, setRecords] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    name: "",
    expiry: "",
    mfg: "",
    dose: "",
    times: [],
    imageUrl: ""
  };
  const [form, setForm] = useState(emptyForm);

  // Load user reminders + optional username
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      const userId = user.uid;
      const saved = JSON.parse(localStorage.getItem(`medireminder_${userId}`) || "[]");
      setRecords(saved);

      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          // optional: use userDoc.data().name
        }
      } catch (err) {
        console.error("Failed to fetch user name:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveToLocal = (data) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    localStorage.setItem(`medireminder_${userId}`, JSON.stringify(data));
  };

  const handleOpenCreate = () => {
    setMode("create");
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSave = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    let updated;
    if (mode === "edit") {
      updated = records.map((r) => (r.id === currentId ? { ...form, id: r.id } : r));
    } else {
      updated = [...records, { ...form, id: Date.now() }];
    }

    setRecords(updated);
    saveToLocal(updated);
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const rec = records.find((r) => r.id === id);
    setForm(rec || emptyForm);
    setCurrentId(id);
    setMode("edit");
    setShowForm(true);
  };

  const handleView = (id) => {
    const rec = records.find((r) => r.id === id);
    setForm(rec || emptyForm);
    setMode("view");
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    saveToLocal(updated);
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // Auto-generate times based on dose count
  const generateTimes = (doseNum) => {
    const n = Number(doseNum) || 0;
    if (n <= 0) return [];

    // We distribute times between startHour (7:00) and endHour (22:00) inclusive.
    const startHour = 7; // 7 AM
    const endHour = 22; // 10 PM

    if (n === 1) {
      return ["8:00 AM"];
    }

    const times = [];
    const interval = (endHour - startHour) / (n - 1);

    for (let i = 0; i < n; i++) {
      const hourFloat = startHour + interval * i;
      const hourRounded = Math.round(hourFloat); // round to nearest hour
      const h24 = ((hourRounded % 24) + 24) % 24;
      const suffix = h24 >= 12 ? "PM" : "AM";
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
      const formatted = `${h12}:00 ${suffix}`;
      times.push(formatted);
    }
    return times;
  };

  // When dose changes in modal, auto-set times
  const handleDoseChange = (value) => {
    const doseNum = Number(value);
    const times = generateTimes(doseNum);
    setForm({ ...form, dose: doseNum, times });
  };

  // allow image in modal (kept as before)
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // computed nextDose
  const nextDose = useMemo(() => {
    if (!records.length) return null;
    for (const r of records) {
      if (r.times && r.times.length > 0 && r.times.some(t => t)) {
        const t = r.times.find(t => t) || r.times[0];
        return { name: r.name, time: t };
      }
    }
    const first = records[0];
    return { name: first.name, time: (first.times && first.times[0]) || "—" };
  }, [records]);

  if (loading) {
    return (
      <div className="reminder-wrap">
        <div className="center-loader">Loading reminders…</div>
      </div>
    );
  }

  if (!auth.currentUser) {
    return (
      <div className="reminder-wrap">
        <div className="auth-please">
          <h2>Please log in to see your medicine reminders</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="reminder-wrap">
      {/* HERO TOP */}
      <div className="hero-card">
        <div className="hero-left">
          <div className="brand-row">
            <div className="logo">🩺</div>
            <div className="brand-texts">
              <div className="brand-title">MedCare</div>
              <div className="brand-sub">Simple Healthcare Assistant</div>
            </div>
          </div>

          <h1 className="hero-heading">Medicine Reminder</h1>
          <p className="hero-p">
            Keep track of your medicines and never miss a dose.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={handleOpenCreate}>
              + Add Reminder
            </button>
            {/* Upload removed as requested */}
          </div>
        </div>

        <div className="hero-right">
          <div className="next-dose">
            <div className="next-label">Next Dose</div>
            <div className="next-time">{nextDose ? nextDose.time : "No reminders"}</div>
            <div className="next-med">{nextDose ? nextDose.name : "No medicine scheduled"}</div>
            <div className="pill-emoji">💊</div>
            <button
              className="btn remind-btn"
              onClick={() => alert("Reminder snoozed — integrate with Notification API if needed")}
            >
              Remind Me
            </button>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="main-grid">
        {/* Left column: list */}
        <div className="left-col">
          <div className="card-list">
            <div className="list-header">
              <h3>Your Reminders</h3>
              <p className="muted">Manage medicine times, expiry and details</p>
            </div>

            {records.length === 0 ? (
              <div className="empty-state">
                <p>No reminders yet</p>
                <button className="btn btn-ghost" onClick={handleOpenCreate}>
                  Create first reminder
                </button>
              </div>
            ) : (
              records.map((r) => (
                <div key={r.id} className="reminder-card">
                  <div className="reminder-left">
                    <div className="pill-icon">💊</div>
                    <div className="reminder-meta">
                      <div className="rem-name">{r.name || "Unnamed"}</div>
                      <div className="rem-sub">
                        Dose: {r.dose || 0} · {r.times?.filter(Boolean)?.join(", ") || "Times not set"}
                      </div>
                      <div className="rem-expiry">Expiry: {r.expiry || "—"}</div>
                    </div>
                  </div>

                  <div className="reminder-actions">
                    <button className="small-btn" onClick={() => handleView(r.id)}>View</button>
                    <button className="small-btn primary" onClick={() => handleEdit(r.id)}>Edit</button>
                    <button className="small-btn danger" onClick={() => handleDelete(r.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column: info cards */}
        <div className="right-col">
          <div className="info-card big">
            <h4>Medicine Reminders</h4>
            <p className="muted">Create reminders with automatic evenly spread times.</p>
            <div className="info-cta">
              <button className="btn small">Manage Reminders</button>
            </div>
          </div>

          <div className="info-card">
            <h4>Notes</h4>
            <p className="muted">Times are auto-generated based on dose count (1–4). You can edit dose to change times.</p>
          </div>
        </div>
      </div>

      {/* Modal: create/edit/view */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-head">
              <h3>{mode === "create" ? "Create Reminder" : mode === "edit" ? "Edit Reminder" : "View Reminder"}</h3>
              <button className="close-x" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <input
                  type="text"
                  className="input"
                  placeholder="Medicine Name"
                  value={form.name}
                  disabled={mode === "view"}
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <label className="label">Expiry Date</label>
                <input
                  type="date"
                  className="input"
                  value={form.expiry}
                  disabled={mode === "view"}
                  onChange={(e) => handleChange("expiry", e.target.value)}
                />

                <label className="label">MFG Date</label>
                <input
                  type="date"
                  className="input"
                  value={form.mfg}
                  disabled={mode === "view"}
                  onChange={(e) => handleChange("mfg", e.target.value)}
                />

                <label className="label">Dose</label>
                <select
                  className="input"
                  value={form.dose}
                  disabled={mode === "view"}
                  onChange={(e) => handleDoseChange(e.target.value)}
                >
                  <option value="">Select Dose</option>
                  <option value="1">One Time</option>
                  <option value="2">Two Times</option>
                  <option value="3">Three Times</option>
                  <option value="4">Four Times</option>
                </select>

                {/* Show auto-generated times (read-only). No time-selects now */}
                {form.dose > 0 && (
                  <div className="times-readonly">
                    <label className="label">Scheduled Times</label>
                    <div className="times-list">
                      {form.times.map((t, i) => (
                        <div key={i} className="time-pill">{t}</div>
                      ))}
                    </div>
                  </div>
                )}

                <label className="label">Upload Image (optional)</label>
                {mode !== "view" && (
                  <input type="file" accept="image/*" onChange={handleImage} className="input" />
                )}

                {form.imageUrl && (
                  <div className="img-preview-small">
                    <img src={form.imageUrl} alt="medicine" />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Close</button>
              {mode !== "view" && <button className="btn btn-primary" onClick={handleSave}>Save</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
