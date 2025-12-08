// import React, { useState } from "react";
// import './App.css'
// import QrScanner from './Images.jsx'
// const  Scanner= () => {
//   const [responseText, setResponseText] = useState("");
//   const [loading, setLoading] = useState(false);

//   const apiKey = import.meta.env.VITE_API_KEY_GEMINI; // Replace with your actual API key
//   // console.log(apiKey)

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setLoading(true);
//     setResponseText("");

//     try {
//       const base64Image = await toBase64(file);

//       const body = {
//         contents: [
//           {
//             parts: [
//               {
//                 text: `I clicked a photo of the backside of a medicine strip. Please analyze this image and provide detailed information about the medicine in the following grouped format. Each section should be clearly separated with a heading and followed by bullet points. Use the name of the medicine from the image to guide your answers.

// If some information is missing, search online or provide general information. If not found, mention "Not available". End each bullet point with \n.

// ---

// 🔹 **Basic Information**
// - ✅ Name of the medicine:
// - 📝 Manufacturing date:
// - 📝 Expiry date:
// - 💊 Uses and purpose:


// 🔹 **Dosage Guidelines**
// - ✏ Recommended dosage:
// - ✏ How to take it:
// - ✏ Who should avoid it:



// Please keep the format consistent and easy to parse. Avoid long paragraphs. Use clear bullet points and section headers exactly as shown.`
//               },
//               {
//                 inline_data: {
//                   mime_type: file.type,
//                   data: base64Image.split(",")[1]
//                 }
//               }
//             ]
//           }
//         ]
//       };

//       const res = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(body)
//         }
//       );

//       const result = await res.json();

//       if (result.candidates && result.candidates.length > 0) {
//         setResponseText(result.candidates[0].content.parts[0].text);

//       } else {
//         setResponseText("❌ No response from Gemini.");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setResponseText("❌ Error occurred during processing.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//     });
//   };
// console.log(responseText)
//   return (
//     <div className="scanner-container">
//       <h2>📷 Upload Medicine Image</h2>
//       <input type="file" accept="image/*" onChange={handleFileChange} />
      
//         <QrScanner/>
//       {loading && <p className="loading">⏳ Analyzing image...</p>}
//       {responseText && (
//         <div className="response-card">
//         {responseText}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Scanner;




// src/Scanner.jsx
import React, { useState } from "react";
import './App.css';
import QrScanner from './Images.jsx';

const Scanner = () => {
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_API_KEY_GEMINI; // store your Gemini API key in .env

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setResponseText("");

    try {
      const base64Image = await toBase64(file);

      const body = {
        contents: [{
          parts: [
            {
              text: `I clicked a photo of the backside of a medicine strip. 
Please analyze this image and provide detailed information about the medicine in the following grouped format. 
Each section should be clearly separated with a heading and followed by bullet points. 
Use the name of the medicine from the image to guide your answers.

If some information is missing, search online or provide general information. 
If not found, mention "Not available". End each bullet point with \n.

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
        }]
      };

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );

      const result = await res.json();
      if (result.candidates && result.candidates.length > 0) {
        setResponseText(result.candidates[0].content.parts[0].text);
      } else {
        setResponseText("❌ No response from Gemini.");
      }
    } catch (err) {
      console.error("Error:", err);
      setResponseText("❌ Error occurred during processing.");
    } finally {
      setLoading(false);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  return (
    <div className="scanner-container">
      <h2>📷 Upload Medicine Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <QrScanner />

      {loading && <p className="loading">⏳ Analyzing image...</p>}

      {responseText && (
        <div className="medicine-card-container">
          {responseText.split('---').map((section, index) => {
            const lines = section.trim().split('\n').filter(line => line.trim() !== "");
            if (lines.length === 0) return null;

            const heading = lines[0]; // first line is section heading
            const bullets = lines.slice(1); // rest are bullet points

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
          })}
        </div>
      )}
    </div>
  );
};

export default Scanner;