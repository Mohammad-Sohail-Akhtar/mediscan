import React, { useState } from "react";
import QrScanner from "./Images.jsx"; // adjust path if needed
import "./ScannerPage.css";
import { LuUpload } from "react-icons/lu";

const ScannerPage = () => {
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_API_KEY_GEMINI;

  // convert file to base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  // handle file selection triggered by the Upload button
  const handleFileChange = async (e) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // small client-side preview
    setSelectedImagePreview(URL.createObjectURL(file));
    setLoading(true);
    setResponseText("");

    try {
      const base64Image = await toBase64(file);

      // Build request body for Gemini (Google Generative Language v1beta example)
      const body = {
        contents: [
          {
            parts: [
              {
                text: `I clicked a photo of the backside of a medicine strip. 
Please analyze this image and provide detailed information about the medicine in the following grouped format. 
Each section should be clearly separated with a heading and followed by bullet points. 
Use the name of the medicine from the image to guide your answers.

If some information is missing, provide "Not available". End each bullet point with \\n.

---

🔹 Basic Info
 ✅ Name of the medicine:
 📝 Manufacturing date:
 📝 Expiry date:
 💊 Uses and purpose:

---

🔹 Dosage Guidelines
 Recommended dosage:
 How to take it:
 Who should avoid it:

---

Do not include extra paragraphs or summaries. Only return the structured bullet format above.`
              },
              {
                inline_data: {
                  mime_type: file.type,
                  data: base64Image.split(",")[1]
                }
              }
            ]
          }
        ]
      };

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text}`);
      }

      const result = await res.json();
      if (result.candidates && result.candidates.length > 0) {
        const text = result.candidates[0].content.parts.map(p => p.text).join(" ");
        setResponseText(text);
      } else {
        setResponseText("❌ No response from Gemini.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while processing the image.");
      setResponseText("");
    } finally {
      setLoading(false);
    }
  };

  // helper to render the structured response: split by '---' as you used earlier
  const renderStructuredResponse = (raw) => {
    if (!raw) return null;
    return raw.split('---').map((section, index) => {
      const lines = section.trim().split('\n').filter(line => line.trim() !== "");
      if (lines.length === 0) return null;
      const heading = lines[0];
      const bullets = lines.slice(1);
      return (
        <div key={index} className="medicine-card">
          <h3 className="section-heading">{heading}</h3>
          <ul>
            {bullets.map((line, i) => {
              const isExpired = line.toLowerCase().includes("expired");
              return (
                <li key={i} className={isExpired ? "medicine-line expired" : "medicine-line"}>
                  {line}
                </li>
              );
            })}
          </ul>
        </div>
      );
    });
  };

  return (
    <div className="page-wrapper">
      <div className="content-card hero">
        <div className="hero-left">
          <div className="brand">
            <div className="logo">🩺</div>
            <div className="brand-text">MedCare</div>
          </div>

          <h1 className="hero-title">Simple<br/>Healthcare Assistant</h1>

          <p className="hero-desc">
            Keep track of your medicines, set reminders, and quickly see information from your medicine photos
          </p>

          <div className="hero-actions">
            <button className="btn primary">Set Reminder</button>

            {/* Hidden file input */}
            <input
              id="medicine-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <button
              className="btn outline"
              onClick={() => document.getElementById("medicine-file").click()}
            >
              Upload Medicine Photo &nbsp; <LuUpload />

            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="next-dose-card">
            <div className="next-dose-label">Next Dose</div>
            <div className="next-dose-time">Today · 8:00 PM</div>
            <div className="next-dose-med">Paracetamol 500mg</div>
            <div className="pill-icon">💊</div>
          </div>
        </div>
      </div>

      {/* Middle Row: Scanner + Preview + Info Cards */}
      <div className="content-grid">
        <div className="left-column">
          <div className="scanner-box">
            <h2>📷 Upload Medicine Image</h2>

            <div className="scanner-inner">
              {/* show preview if an image selected */}
              {selectedImagePreview ? (
                <div className="image-preview">
                  <img src={selectedImagePreview} alt="preview" />
                </div>
              ) : (
                <div className="image-placeholder">No image selected</div>
              )}

              <QrScanner />
            </div>

            {loading && <p className="loading">⏳ Analyzing image...</p>}
            {error && <p className="error">{error}</p>}
          </div>
        </div>

        <div className="right-column">
          <div className="info-card">
            <h3>Medicine Reminders</h3>
            <p>Never miss a dose — set simple time-based reminders.</p>
          </div>

          <div className="info-card">
            <h3>Photo Upload</h3>
            <p>Upload your medicine strip or box to view basic details</p>
          </div>
        </div>
      </div>

      {/* Results area below everything */}
      <div className="results-area">
        {responseText ? (
          <>
            <h2>Medicine Details</h2>
            <div className="medicine-cards-wrapper">
              {renderStructuredResponse(responseText)}
            </div>
          </>
        ) : (
          <div className="results-placeholder">
            <p>Upload a medicine photo using the "Upload Medicine Photo" button to analyze it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerPage;
