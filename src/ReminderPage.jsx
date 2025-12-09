import React, { useState, useEffect, useMemo } from "react";
import "./ReminderPage.css";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import logo from "./images/logo.png"

export default function ReminderPage() {
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [records, setRecords] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    name: "",
    expiry: "",
    mfg: "",
    dose: "",
    category: "",
    times: [],
    imageUrl: ""
  };
  const [form, setForm] = useState(emptyForm);

  // CATEGORY INTERVALS
  const categoryIntervals = {
    Antacids: 8,
    Antibiotics: 6,
    "Antihistamines (Allergy Medicines)": 24,
    Painkillers: 6,
    "Neuro Medicines": 12
  };

  // LOAD DATA
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
        if (userDoc.exists()) {}
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

  // TIME GENERATOR BASED ON CATEGORY
  const generateTimesForCategory = (dose, category) => {
    if (!dose || !categoryIntervals[category]) return [];
    const interval = categoryIntervals[category];

    let times = [];
    let current = 8; // starting at 8AM

    for (let i = 0; i < dose; i++) {
      let h24 = current % 24;
      const suffix = h24 >= 12 ? "PM" : "AM";
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
      times.push(`${h12}:00 ${suffix}`);
      current += interval;
    }
    return times;
  };

  const handleDoseChange = (value) => {
    const doseNum = Number(value);
    const times = generateTimesForCategory(doseNum, form.category);
    setForm({ ...form, dose: doseNum, times });
  };

  const handleCategoryChange = (value) => {
    const times = generateTimesForCategory(form.dose, value);
    setForm({ ...form, category: value, times });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // 🔥 NEXT DOSE AUTO DETECTOR
  const nextDose = useMemo(() => {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    let upcoming = [];

    records.forEach((r) => {
      r.times.forEach((t) => {
        const [time, suffix] = t.split(" ");
        let [h, m] = time.split(":");
        h = Number(h);
        m = Number(m);

        if (suffix === "PM" && h !== 12) h += 12;
        if (suffix === "AM" && h === 12) h = 0;

        const total = h * 60 + m;

        if (total >= nowMinutes) {
          upcoming.push({ name: r.name, time: t });
        }
      });
    });

    upcoming.sort((a, b) => {
      const getMin = (x) => {
        const [time, suf] = x.time.split(" ");
        let [h, m] = time.split(":");
        h = Number(h);
        m = Number(m);
        if (suf === "PM" && h !== 12) h += 12;
        if (suf === "AM" && h === 12) h = 0;
        return h * 60 + m;
      };
      return getMin(a) - getMin(b);
    });

    return upcoming.length ? upcoming : null;
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
      {/* HERO */}
      <div className="hero-card">
        <div className="hero-left">
          <div className="brand-row">
            <div className="logo" >
              <img src={logo} alt="" style={{width:'60px'}}/>
            </div>
            <div className="brand-texts">
              <div className="brand-title">Jeevan Jyoti</div>
              <div className="brand-sub">Simple Healthcare Assistant</div>
            </div>
          </div>

          <h1 className="hero-heading">Medicine Reminder</h1>
          <p className="hero-p">Keep track of your medicines and never miss a dose.</p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={handleOpenCreate}>
              + Add Reminder
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="next-dose">
            <div className="next-label">Next Dose</div>

            {nextDose ? (
              nextDose.map((d, i) => (
                <div key={i} className="next-block">
                  <div className="next-time">{d.time}</div>
                  <div className="next-med">{d.name}</div>
                </div>
              ))
            ) : (
              <div>No upcoming reminders</div>
            )}

            <div className="pill-emoji">💊</div>
          </div>
        </div>
      </div>

      {/* LIST + RIGHT INFO */}
      <div className="main-grid">
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
                      <div className="rem-name">{r.name}</div>
                      <div className="rem-sub">
                        Category: {r.category} · Dose: {r.dose}
                      </div>
                      <div className="rem-expiry">Times: {r.times.join(", ")}</div>
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

        <div className="right-col">
          <div className="info-card big">
            <h4>Medicine Reminders</h4>
            <p className="muted">Create reminders with automatic time scheduling.</p>
          </div>
          <div className="info-card">
            <h4>Notes</h4>
            <p className="muted">Times are generated based on medicine category & dose.</p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-card">

            <div className="modal-head">
              <h3>
                {mode === "create" ? "Create Reminder" : mode === "edit" ? "Edit Reminder" : "View Reminder"}
              </h3>
              <button className="close-x" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-grid">

                <label className="label">Medicine Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Medicine Name"
                  value={form.name}
                  disabled={mode === "view"}
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <label className="label">Category</label>
                <select
                  className="input"
                  value={form.category}
                  disabled={mode === "view"}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Antacids">Antacids</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Antihistamines (Allergy Medicines)">Antihistamines (Allergy Medicines)</option>
                  <option value="Painkillers">Painkillers</option>
                  <option value="Neuro Medicines">Neuro Medicines</option>
                </select>

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

                {form.times.length > 0 && (
                  <>
                    <label className="label">Scheduled Times</label>
                    <div className="times-list">
                      {form.times.map((t, i) => (
                        <div key={i} className="time-pill">{t}</div>
                      ))}
                    </div>
                  </>
                )}

                <label className="label">Upload Image</label>
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
              {mode !== "view" && (
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
