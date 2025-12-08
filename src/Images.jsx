// import React, { useEffect, useRef, useState } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';

// const QrScanner = () => {
//   let medicine="";
//     const [gen,setGen]=useState();
//   const qrRef = useRef(null);

//   const scanQr=(e) => {
//     e.target.style.display="none";
//     if (!qrRef.current) return;

//     const html5QrCode = new Html5Qrcode(qrRef.current.id);

//     html5QrCode.start(
//       { facingMode: "environment" }, // Use back camera
//       {
//         fps: 10,                     // Frames per second
//         qrbox: { width: 250, height: 250 } // QR scan box size
//       },
//       (decodedText, decodedResult) => {
//         console.log("✅ QR Code detected:", decodedText);
//         medicine=decodedText
//         request();


//       },
//       (errorMessage) => {
//         // You can log errors if you want
//         console.log("QR scan error:", errorMessage);
//       }
//     ).catch((err) => {
//       console.error("Error starting QR scanner:", err);
//     });

//     // Cleanup on unmount
//     return () => {
//       html5QrCode.stop().then(() => {
//         console.log("QR Code scanning stopped.");
//       }).catch(err => {
//         console.error("Failed to stop scanning.", err);
//       });
//     };

//   }


//   let request = () => {

//     const url = import.meta.env.VITE_API_GEMINI_VIDEO;
     
//     const requestBody = {
//       contents: [
//         {
//           parts: [
//             {
//         text: `I scanned a QR code on a medicine package. The QR code text is:\n\n${medicine}\n\nPlease provide detailed information about the medicine in the following format:\n\n- ✅ Name of the medicine:\n- 💊 Uses and purpose:\n- ✏️ Dosage guidelines:\n- ⚠️ Warnings (allergies, interactions, pregnancy safety):\n- ⛔ Side effects:\n- 💠 Treats which illness:\n- 📝 Manufacturer details and expiry:\n\nIf some information is missing in the QR code text, mention \"Not available\". Format the output exactly as above using the same symbols.`

//             }
//           ]
//         }
//       ]
//     };

//     fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(requestBody)
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         if (data.candidates && data.candidates.length > 0) {
//            const generatedText=data.candidates[0].content.parts
//             .map(part => part.text)
//             .join(' ');
//             setGen(generatedText)
//           console.log('Generated text:', generatedText);
//         } else {
//           console.log('No candidates returned in the response:', data);
//         }
//       })
//       .catch(error => {
//         console.error('Error from Gemini API:', error);
//       });
//   }
//    const stylesdiv={
  
//     "display":"flex",
//     "justifyContent":"center",
//     "alignItem":"center",
//     "flexDirection":"row",

//    }
//    const button={
//     // "fontSize":"1.5rem",
//     //  "padding":".5rem",
//     //  "border":"none",
//     //   "backgroundColor":" hsl(120, 90%, 37%)",
//     //   "color":"white",
//     //   "borderRadius":"1rem",
//     //   // "marginRight":"30vw",
//     //   "marginRight": '150px' 
//     "font-size": '1.2rem',
//   'font-weight': 'bold',
//   // 'padding': '1rem 2rem',
//   'background-color': 'hsla(120, 34%, 68%, 1.00)',
//   'color':'black',
//   'border': 'none',
//   'border-radius': '8px',
//  'cursor': 'pointer',
// //  'padding':'18px 12px',
//  'width':'120px',
//  'marginTop': '25px',
//  "marginRight": '25px' ,
//   'transition': 'background-color 0.3s ease',
//    }
//   return (
//     <div style={stylesdiv}>
//       <div id="qr-reader" ref={qrRef} ></div><br/>
//       <button style={button} onClick={(e)=>scanQr(e)}>Scan</button>
//     </div>
//   );
// };

// export default QrScanner;














import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrScanner = () => {

    const [medicine, setMedicine] = useState("");   // Store scanned QR value
    const [gen, setGen] = useState("");             // Gemini result
    const qrRef = useRef(null);
    const scannerRef = useRef(null);

    // -------------------------
    // START QR SCANNER
    // -------------------------
    const scanQr = async (e) => {
        e.target.style.display = "none";

        if (!qrRef.current) return;

        const html5QrCode = new Html5Qrcode(qrRef.current.id);
        scannerRef.current = html5QrCode;

        try {
            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    console.log("QR detected:", decodedText);

                    setMedicine(decodedText);   // Save scanned value
                    html5QrCode.stop();         // Stop scanning
                    requestGemini(decodedText); // Call Gemini API
                },
                (err) => console.log("Scan error:", err)
            );
        } catch (err) {
            console.error("Failed to start QR scanner:", err);
        }
    };

    // -------------------------
    // GEMINI REQUEST
    // -------------------------
    const requestGemini = async (qrValue) => {

        const url = import.meta.env.VITE_API_GEMINI_VIDEO;

        if (!url) {
            console.error("❌ ERROR: VITE_API_GEMINI_VIDEO is missing from .env");
            return;
        }

        const prompt = `
I scanned a QR code on a medicine package. The QR code text is:

${qrValue}

Please provide detailed information about the medicine in the following format:

- ✅ Name of the medicine:
- 💊 Uses and purpose:
- ✏️ Dosage guidelines:
- ⚠️ Warnings (allergies, interactions, pregnancy safety):
- ⛔ Side effects:
- 💠 Treats which illness:
- 📝 Manufacturer details and expiry:

If some information is missing in the QR code text, mention "Not available".
Format the output exactly as above using the same symbols.
        `;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            if (data.candidates?.length > 0) {
                const generatedText = data.candidates[0].content.parts
                    .map((p) => p.text)
                    .join(" ");

                setGen(generatedText);
                console.log("Generated text:", generatedText);
            } else {
                console.log("No candidates returned:", data);
            }

        } catch (error) {
            console.error("Gemini API error:", error);
        }
    };

    // -------------------------
    // STYLES
    // -------------------------
    const wrapper = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px"
    };

    const button = {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        backgroundColor: 'hsla(120, 34%, 68%, 1.00)',
        color: 'black',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '120px',
        padding: "10px",
        marginTop: '20px',
    };

    return (
        <div style={wrapper}>
            <div id="qr-reader" ref={qrRef}></div>
{/* 
            <button style={button} onClick={scanQr}>
                Scan
            </button> */}

            {/* Show scanned QR result */}
            {medicine && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <h3>Scanned QR:</h3>
                    <p>{medicine}</p>
                </div>
            )}

            {/* Show Gemini result */}
            {gen && (
                <div
                    style={{
                        marginTop: "20px",
                        background: "#f2f2f2",
                        padding: "15px",
                        width: "90%",
                        borderRadius: "10px",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap"
                    }}
                >
                    <h3>Medicine Details:</h3>
                    <p>{gen}</p>
                </div>
            )}
        </div>
    );
};

export default QrScanner;








// import React, { useEffect, useRef, useState } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';

// const QrScanner = () => {
//   let medicine="";
//     const [gen,setGen]=useState();
//   const qrRef = useRef(null);

//   const scanQr=(e) => {
//     e.target.style.display="none";
//     if (!qrRef.current) return;

//     const html5QrCode = new Html5Qrcode(qrRef.current.id);

//     html5QrCode.start(
//       { facingMode: "environment" }, // Use back camera
//       {
//         fps: 10,                     // Frames per second
//         qrbox: { width: 250, height: 250 } // QR scan box size
//       },
//       (decodedText, decodedResult) => {
//         console.log("✅ QR Code detected:", decodedText);
//         medicine=decodedText
//         request();


//       },
//       (errorMessage) => {
//         // You can log errors if you want
//         // console.log("QR scan error:", errorMessage);
//       }
//     ).catch((err) => {
//       console.error("Error starting QR scanner:", err);
//     });

//     // Cleanup on unmount
//     return () => {
//       html5QrCode.stop().then(() => {
//         console.log("QR Code scanning stopped.");
//       }).catch(err => {
//         console.error("Failed to stop scanning.", err);
//       });
//     };

//   }


//   let request = () => {

//     const url = import.meta.env.VITE_API_GEMINI_VIDEO;

//      console.log(url)
//     const requestBody = {
//       contents: [
//         {
//           parts: [
//             {
//         text: `I scanned a QR code on a medicine package. The QR code text is:\n\n${medicine}\n\nPlease provide detailed information about the medicine in the following format:\n\n- ✅ Name of the medicine:\n- 💊 Uses and purpose:\n- ✏️ Dosage guidelines:\n- ⚠️ Warnings (allergies, interactions, pregnancy safety):\n- ⛔ Side effects:\n- 💠 Treats which illness:\n- 📝 Manufacturer details and expiry:\n\nIf some information is missing in the QR code text, mention \"Not available\". Format the output exactly as above using the same symbols.`

//             }
//           ]
//         }
//       ]
//     };

//     fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(requestBody)
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         if (data.candidates && data.candidates.length > 0) {
//            const generatedText=data.candidates[0].content.parts
//             .map(part => part.text)
//             .join(' ');
//             setGen(generatedText)
//           console.log('Generated text:', generatedText);
//         } else {
//           console.log('No candidates returned in the response:', data);
//         }
//       })
//       .catch(error => {
//         console.error('Error from Gemini API:', error);
//       });
//   }
//    const stylesdiv={
  
//     "display":"flex",
//     "justifyContent":"center",
//     "alignItem":"center",
//     "flexDirection":"row",

//    }
//    const button={
//     fontSize: '1.2rem',
//         fontWeight: 'bold',
//         backgroundColor: 'hsla(120, 34%, 68%, 1.00)',
//         color: 'black',
//         border: 'none',
//         borderRadius: '8px',
//         cursor: 'pointer',
//         width: '120px',
//         padding: "10px",
//         marginTop: '20px',
//    }
//   return (
//     <div style={stylesdiv}>
//       <div id="qr-reader" ref={qrRef} style={{ width: "300px" }}></div><br/>
//       <button style={button} onClick={(e)=>scanQr(e)}>Scan QR Code</button>
//     </div>
//   );
// };

// export default QrScanner;