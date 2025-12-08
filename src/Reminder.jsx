import React, { useState, useEffect } from "react";

const ReminderPage = () => {
  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reminders") || "[]");
    setData(stored);
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 2000);
  };

  const deleteItem = (id) => {
    const updated = data.filter((item) => item.id !== id);
    setData(updated);
    localStorage.setItem("reminders", JSON.stringify(updated));
    showNotification("Deleted Successfully!");
  };

  const startEdit = (item) => {
    setEditItem(item);
  };

  const saveEdit = () => {
    const updated = data.map((item) =>
      item.id === editItem.id ? editItem : item
    );

    setData(updated);
    localStorage.setItem("reminders", JSON.stringify(updated));
    setEditItem(null);
    showNotification("Updated Successfully!");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Medicine Reminders</h2>

      {/* Notification */}
      {notification && (
        <div
          style={{
            background: "#4caf50",
            color: "white",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "8px",
            textAlign: "center",
            transition: "0.3s",
          }}
        >
          {notification}
        </div>
      )}

      {/* LIST */}
      {data.length === 0 ? (
        <p>No reminders saved.</p>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{item.name}</h3>
            <p><strong>Dose:</strong> {item.dose}</p>
            <p><strong>Need:</strong> {item.need}</p>
            <p><strong>Mfg:</strong> {item.mfg}</p>
            <p><strong>Expiry:</strong> {item.exp}</p>

            <button
              onClick={() => startEdit(item)}
              style={{
                padding: "5px 10px",
                marginRight: "10px",
                background: "orange",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Edit
            </button>

            <button
              onClick={() => deleteItem(item.id)}
              style={{
                padding: "5px 10px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}

      {/* EDIT FORM */}
      {editItem && (
        <div
          style={{
            padding: "15px",
            border: "1px solid #007bff",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <h3>Edit Medicine</h3>

          <label>Name:</label>
          <input
            type="text"
            value={editItem.name}
            onChange={(e) =>
              setEditItem({ ...editItem, name: e.target.value })
            }
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label>Dose:</label>
          <input
            type="text"
            value={editItem.dose}
            onChange={(e) =>
              setEditItem({ ...editItem, dose: e.target.value })
            }
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label>Need:</label>
          <input
            type="text"
            value={editItem.need}
            onChange={(e) =>
              setEditItem({ ...editItem, need: e.target.value })
            }
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label>Mfg:</label>
          <input
            type="text"
            value={editItem.mfg}
            onChange={(e) =>
              setEditItem({ ...editItem, mfg: e.target.value })
            }
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label>Expiry:</label>
          <input
            type="text"
            value={editItem.exp}
            onChange={(e) =>
              setEditItem({ ...editItem, exp: e.target.value })
            }
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <button
            onClick={saveEdit}
            style={{
              padding: "10px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ReminderPage;
