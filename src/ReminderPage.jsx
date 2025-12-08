// import React, { useState, useEffect } from "react";
// import "./ReminderPage.css";

// export default function ReminderPage() {
//   const [showForm, setShowForm] = useState(false);
//   const [mode, setMode] = useState("create"); // create | edit | view
//   const [records, setRecords] = useState([]);
//   const [currentId, setCurrentId] = useState(null);

//   const emptyForm = {
//     name: "",
//     expiry: "",
//     mfg: "",
//     dose: "",
//     times: [],
//     imageUrl: ""   // store base64 here
//   };

//   const [form, setForm] = useState(emptyForm);

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("medireminder") || "[]");
//     setRecords(saved);
//   }, []);

//   const saveToLocal = (data) => {
//     localStorage.setItem("medireminder", JSON.stringify(data));
//   };

//   const handleOpenCreate = () => {
//     setMode("create");
//     setForm(emptyForm);
//     setShowForm(true);
//   };

//   const handleSave = () => {
//     let updated;
//     if (mode === "edit") {
//       updated = records.map((r) =>
//         r.id === currentId ? { ...form, id: r.id } : r
//       );
//     } else {
//       updated = [...records, { ...form, id: Date.now() }];
//     }

//     setRecords(updated);
//     saveToLocal(updated);
//     setShowForm(false);
//   };

//   const handleEdit = (id) => {
//     const rec = records.find((r) => r.id === id);
//     setForm(rec);
//     setCurrentId(id);
//     setMode("edit");
//     setShowForm(true);
//   };

//   const handleView = (id) => {
//     const rec = records.find((r) => r.id === id);
//     setForm(rec);
//     setMode("view");
//     setShowForm(true);
//   };

//   const handleDelete = (id) => {
//     const updated = records.filter((r) => r.id !== id);
//     setRecords(updated);
//     saveToLocal(updated);
//   };

//   const handleChange = (field, value) => {
//     setForm({ ...form, [field]: value });
//   };

//   const handleDoseChange = (value) => {
//     const doseNum = Number(value);
//     const newTimes = Array(doseNum).fill("");

//     setForm({
//       ...form,
//       dose: doseNum,
//       times: newTimes,
//     });
//   };

//   const handleTimeChange = (index, value) => {
//     const updatedTimes = [...form.times];
//     updatedTimes[index] = value;
//     setForm({ ...form, times: updatedTimes });
//   };

//   // 🔥 UPDATED — Convert image to Base64 before saving
//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setForm({
//           ...form,
//           imageUrl: reader.result, // Base64 string saved here
//         });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const doseTimes = ["7:00 AM", "12:00 PM", "4:00 PM", "8:00 PM"];

//   return (
//     <div className="reminder-container">
//       <h1 className="reminder-title">Medicine Reminder</h1>

//       <button onClick={handleOpenCreate} className="btn btn-primary">
//         Create
//       </button>

//       {showForm && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h2 className="modal-title">{mode} Medicine</h2>

//             <div className="form-grid">
//               <input
//                 type="text"
//                 placeholder="Medicine Name"
//                 disabled={mode === "view"}
//                 value={form.name}
//                 onChange={(e) => handleChange("name", e.target.value)}
//                 className="input-box"
//               />

//               <label>Expiry Date</label>
//               <input
//                 type="date"
//                 disabled={mode === "view"}
//                 value={form.expiry}
//                 onChange={(e) => handleChange("expiry", e.target.value)}
//                 className="input-box"
//               />

//               <label>MFG Date</label>
//               <input
//                 type="date"
//                 disabled={mode === "view"}
//                 value={form.mfg}
//                 onChange={(e) => handleChange("mfg", e.target.value)}
//                 className="input-box"
//               />

//               <label>Dose</label>
//               <select
//                 disabled={mode === "view"}
//                 value={form.dose}
//                 onChange={(e) => handleDoseChange(e.target.value)}
//                 className="input-box"
//               >
//                 <option value="">Select Dose</option>
//                 <option value="1">One Time</option>
//                 <option value="2">Two Times</option>
//                 <option value="3">Three Times</option>
//                 <option value="4">Four Times</option>
//               </select>

//               {form.dose > 0 && (
//                 <div>
//                   <label>Select Time(s)</label>
//                   {form.times.map((value, index) => (
//                     <select
//                       key={index}
//                       disabled={mode === "view"}
//                       value={value}
//                       onChange={(e) => handleTimeChange(index, e.target.value)}
//                       className="input-box"
//                       style={{ marginTop: "8px" }}
//                     >
//                       <option value="">Select Time</option>
//                       {doseTimes.map((t) => (
//                         <option key={t} value={t}>
//                           {t}
//                         </option>
//                       ))}
//                     </select>
//                   ))}
//                 </div>
//               )}

//               <label>Upload Image</label>
//               {mode !== "view" && (
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImage}
//                   className="input-box"
//                 />
//               )}

//               {form.imageUrl && (
//                 <img
//                   src={form.imageUrl}
//                   alt="Medicine"
//                   className="preview-img"
//                 />
//               )}
//             </div>

//             <div className="modal-actions">
//               <button onClick={() => setShowForm(false)} className="btn">
//                 Close
//               </button>
//               {mode !== "view" && (
//                 <button onClick={handleSave} className="btn btn-success">
//                   Save
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="record-list">
//         {records.map((r) => (
//           <div key={r.id} className="record-card">
//             <div>
//               <p className="record-name">{r.name}</p>
//               <p className="record-sub">Dose: {r.dose} time(s)</p>
//               <p className="record-sub">Times: {r.times?.join(", ")}</p>
//             </div>

//             <div className="action-buttons">
//               <button onClick={() => handleView(r.id)} className="btn small btn-dark">
//                 View
//               </button>
//               <button onClick={() => handleEdit(r.id)} className="btn small btn-primary">
//                 Edit
//               </button>
//               <button onClick={() => handleDelete(r.id)} className="btn small btn-danger">
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect } from "react";
import "./ReminderPage.css";
import { auth, db } from "./Firebase"; // Firebase Auth + Firestore
import { doc, getDoc } from "firebase/firestore";

export default function ReminderPage() {
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit | view
  const [records, setRecords] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  // const [userName, setUserName] = useState(null); // store logged-in user's name
  const [loading, setLoading] = useState(true); // loading state

  const emptyForm = {
    name: "",
    expiry: "",
    mfg: "",
    dose: "",
    times: [],
    imageUrl: "" // store base64 here
  };

  const [form, setForm] = useState(emptyForm);

  // Load user info and reminders
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const userId = user.uid;

      // Load user's reminders from localStorage
      const saved = JSON.parse(localStorage.getItem(`medireminder_${userId}`) || "[]");
      setRecords(saved);

      // Load user's name from Firestore
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          // setUserName(userDoc.data().name || "");
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
      updated = records.map((r) =>
        r.id === currentId ? { ...form, id: r.id } : r
      );
    } else {
      updated = [...records, { ...form, id: Date.now() }];
    }

    setRecords(updated);
    saveToLocal(updated);
    setShowForm(false);
  };

  const handleEdit = (id) => {
    const rec = records.find((r) => r.id === id);
    setForm(rec);
    setCurrentId(id);
    setMode("edit");
    setShowForm(true);
  };

  const handleView = (id) => {
    const rec = records.find((r) => r.id === id);
    setForm(rec);
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

  const handleDoseChange = (value) => {
    const doseNum = Number(value);
    const newTimes = Array(doseNum).fill("");

    setForm({
      ...form,
      dose: doseNum,
      times: newTimes,
    });
  };

  const handleTimeChange = (index, value) => {
    const updatedTimes = [...form.times];
    updatedTimes[index] = value;
    setForm({ ...form, times: updatedTimes });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({
          ...form,
          imageUrl: reader.result, // Base64 string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const doseTimes = ["7:00 AM", "12:00 PM", "4:00 PM", "8:00 PM"];

  // If loading, show placeholder
  if (loading) {
    return (
      <div className="reminder-container">
        <h1 className="reminder-title">Loading...</h1>
      </div>
    );
  }

  // If user not logged in
  if (!auth.currentUser) {
    return (
      <div className="reminder-container">
        <h1 className="reminder-title">Please log in to see your reminders</h1>
      </div>
    );
  }

  return (
    <div className="reminder-container">
      {/* Title + user name */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <h1 className="reminder-title">Medicine Reminder</h1>
        <h3 style={{ margin: 0 }}>
          {/* {userName ? `Hello, ${userName}` : "Hello"} */}
        </h3>
      </div>

      <button onClick={handleOpenCreate} className="btn btn-primary">
        Create
      </button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">{mode} Medicine</h2>

            <div className="form-grid">
              <input
                type="text"
                placeholder="Medicine Name"
                disabled={mode === "view"}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="input-box"
              />

              <label>Expiry Date</label>
              <input
                type="date"
                disabled={mode === "view"}
                value={form.expiry}
                onChange={(e) => handleChange("expiry", e.target.value)}
                className="input-box"
              />

              <label>MFG Date</label>
              <input
                type="date"
                disabled={mode === "view"}
                value={form.mfg}
                onChange={(e) => handleChange("mfg", e.target.value)}
                className="input-box"
              />

              <label>Dose</label>
              <select
                disabled={mode === "view"}
                value={form.dose}
                onChange={(e) => handleDoseChange(e.target.value)}
                className="input-box"
              >
                <option value="">Select Dose</option>
                <option value="1">One Time</option>
                <option value="2">Two Times</option>
                <option value="3">Three Times</option>
                <option value="4">Four Times</option>
              </select>

              {form.dose > 0 && (
                <div>
                  <label>Select Time(s)</label>
                  {form.times.map((value, index) => (
                    <select
                      key={index}
                      disabled={mode === "view"}
                      value={value}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      className="input-box"
                      style={{ marginTop: "8px" }}
                    >
                      <option value="">Select Time</option>
                      {doseTimes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              )}

              <label>Upload Image</label>
              {mode !== "view" && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="input-box"
                />
              )}

              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Medicine"
                  className="preview-img"
                />
              )}
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowForm(false)} className="btn">
                Close
              </button>
              {mode !== "view" && (
                <button onClick={handleSave} className="btn btn-success">
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="record-list">
        {records.map((r) => (
          <div key={r.id} className="record-card">
            <div>
              <p className="record-name">{r.name}</p>
              <p className="record-sub">Dose: {r.dose} time(s)</p>
              <p className="record-sub">Times: {r.times?.join(", ")}</p>
            </div>

            <div className="action-buttons">
              <button
                onClick={() => handleView(r.id)}
                className="btn small btn-dark"
              >
                View
              </button>
              <button
                onClick={() => handleEdit(r.id)}
                className="btn small btn-primary"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="btn small btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
