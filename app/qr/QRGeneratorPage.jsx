"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "../schemas/client.schema";

/* localStorage helpers */
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const load = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const remove = (key) => localStorage.removeItem(key);

/*  Component  */
export default function QRGeneratorPage() {
  const [clientId, setClientId] = useState(null);
  const qrRef = useRef(null);

  /*  React Hook Form + Zod */
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      company: "",
      customFields: [],
    },
  });

  const {
    fields,
    append,
    remove: removeField,
  } = useFieldArray({
    control,
    name: "customFields",
  });

  const formData = watch();

  /* Load draft on mount  */
  useEffect(() => {
    const draft = load("client_form_draft");
    const activeId = load("active_client_id");

    if (draft) reset(draft);
    if (activeId) setClientId(activeId);
  }, [reset]);

  /*  Auto-save draft */
  useEffect(() => {
    const timer = setTimeout(() => {
      save("client_form_draft", formData);
    }, 300);

    return () => clearTimeout(timer);
  }, [formData]);

  /*  Generate QR */
  const onGenerateQR = (data) => {
    const id = crypto.randomUUID();
    setClientId(id);

    save("active_client_id", id);
    save(`client_${id}`, {
      id,
      ...data,
      createdAt: new Date().toISOString(),
    });

    remove("client_form_draft");
  };

  /* Save changes  */
  const onSaveChanges = (data) => {
    if (!clientId) return;

    save(`client_${clientId}`, {
      id: clientId,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  /* Clear form */
  const clearForm = () => {
    reset({
      name: "",
      phone: "",
      email: "",
      company: "",
      customFields: [],
    });
    setClientId(null);
    remove("client_form_draft");
    remove("active_client_id");
  };

  /* Download QR  */
  const downloadQR = () => {
    const svg = qrRef.current.querySelector("svg");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const svgBlob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "client-qr.png";
      a.click();
    };
    img.src = url;
  };

  const qrValue = clientId ? `${BASE_URL}/client/${clientId}` : "";

  /*  UI  */
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-10">
      <h1 className="text-3xl text-gray-800 font-bold text-center">
        Client QR Code Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/*  Form*/}
        <div className="bg-white border rounded-xl p-6 space-y-6 shadow">
          <div className="flex justify-between">
            <h2 className="font-semibol text-gray-800">Client Information</h2>
            <button
              onClick={clearForm}
              className="text-sm text-gray-800 border-2-gray-700"
            >
              Clear
            </button>
          </div>

          {["name", "phone", "email", "company"].map((field) => (
            <div key={field}>
              <input
                {...register(field)}
                placeholder={field}
                className="w-full border text-gray-800 rounded px-3 py-2"
              />
              {errors[field] && (
                <p className="text-gray-800 text-xs">{errors[field].message}</p>
              )}
            </div>
          ))}

          {/* Custom fields */}
          <div className="space-y-2">
            <p className="font-medium text-sm text-gray-800">Custom Fields</p>

            {fields.map((f, i) => (
              <div
                key={f.id}
                className="relative text-gray-800 grid grid-cols-2 gap-2"
              >
                <input
                  {...register(`customFields.${i}.label`)}
                  placeholder="Label"
                  className="border rounded px-3 py-2"
                />
                <input
                  {...register(`customFields.${i}.value`)}
                  placeholder="Value"
                  className="border rounded px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeField(i)}
                  className="absolute right-2 top-2 text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ label: "", value: "" })}
              className="text-sm text-gray-800 "
            >
              + Add Custom Field
            </button>
          </div>

          {!clientId ? (
            <button
              onClick={handleSubmit(onGenerateQR)}
              className="w-full bg-black text-white py-3 rounded"
            >
              Generate QR
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSaveChanges)}
              className="w-full bg-gray-800 text-white py-3 rounded"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* QR*/}
        <div className="bg-white border rounded-xl p-6 shadow flex flex-col items-center space-y-4">
          {!clientId ? (
            <p className="text-gray-500">Generate QR to preview</p>
          ) : (
            <>
              <div ref={qrRef} className="p-4 border rounded">
                <QRCode value={qrValue} size={180} />
              </div>

              <p className="text-xs text-gray-800 break-all">{qrValue}</p>

              <button
                onClick={downloadQR}
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                Download QR
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import QRCode from "react-qr-code";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { clientSchema } from "../schemas/client.schema";

// // Helper function to safely access localStorage
// const getLocalStorage = (key, defaultValue = null) => {
//   if (typeof window === "undefined") return defaultValue;
//   try {
//     const item = localStorage.getItem(key);
//     return item ? JSON.parse(item) : defaultValue;
//   } catch (error) {
//     console.error(`Error reading localStorage key "${key}":`, error);
//     return defaultValue;
//   }
// };

// // Helper function to safely set localStorage
// const setLocalStorage = (key, value) => {
//   if (typeof window === "undefined") return;
//   try {
//     localStorage.setItem(key, JSON.stringify(value));
//   } catch (error) {
//     console.error(`Error setting localStorage key "${key}":`, error);
//   }
// };

// // Helper function to safely remove from localStorage
// const removeLocalStorage = (key) => {
//   if (typeof window === "undefined") return;
//   try {
//     localStorage.removeItem(key);
//   } catch (error) {
//     console.error(`Error removing localStorage key "${key}":`, error);
//   }
// };

// export default function QRGeneratorPage() {
//   const [clientId, setClientId] = useState(null);
//   const [clientData, setClientData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     company: "",
//     customFields: [],
//   });
//   const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
//   const [hasDraftData, setHasDraftData] = useState(false);
//   const [isClient, setIsClient] = useState(false);

//   const qrRef = useRef(null);

//   // Set isClient to true after hydration
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   useEffect(() => {
//     reset(clientData);
//   }, [clientData, reset]);

//   // Load saved data from localStorage once on mount (client-side only)
//   useEffect(() => {
//     // Only run on client side
//     if (!isClient || hasLoadedFromStorage) return;

//     try {
//       // Load form data from localStorage
//       const savedFormData = getLocalStorage("client_form_draft");
//       if (savedFormData) {
//         setClientData(savedFormData);
//         setHasDraftData(true);
//       }

//       // Check if there's an active client ID
//       const savedClientId = getLocalStorage("active_client_id");
//       if (savedClientId) {
//         setClientId(savedClientId);

//         // Load the client data if exists
//         const savedClient = getLocalStorage(`client_${savedClientId}`);
//         if (savedClient) {
//           // Update form data with saved client data
//           setClientData((prev) => ({
//             ...prev,
//             name: savedClient.name || "",
//             phone: savedClient.phone || "",
//             email: savedClient.email || "",
//             company: savedClient.company || "",
//             customFields: savedClient.customFields || [],
//           }));
//         }
//       }
//     } catch (error) {
//       console.error("Error loading data from localStorage:", error);
//     } finally {
//       setHasLoadedFromStorage(true);
//     }
//   }, [isClient, hasLoadedFromStorage]);

//   // Auto-save form data to localStorage with debouncing
//   useEffect(() => {
//     if (!isClient || !hasLoadedFromStorage) return;

//     // Use a timeout to debounce the save operation
//     const timeoutId = setTimeout(() => {
//       try {
//         setLocalStorage("client_form_draft", clientData);
//         // Update draft data state
//         const hasData = Object.values(clientData).some((value) => {
//           if (Array.isArray(value)) return value.length > 0;
//           if (typeof value === "object")
//             return Object.values(value).some((v) => v);
//           return value && value !== "";
//         });
//         setHasDraftData(hasData);
//       } catch (error) {
//         console.error("Error saving form data:", error);
//       }
//     }, 300); // 300ms debounce

//     return () => clearTimeout(timeoutId);
//   }, [clientData, isClient, hasLoadedFromStorage]);

//   // Generate QR + store initial data
//   const handleGenerateQR = useCallback(() => {
//     // Clear the draft storage since we're creating a permanent QR
//     removeLocalStorage("client_form_draft");
//     setHasDraftData(false);

//     const id = crypto.randomUUID();
//     setClientId(id);

//     // Store the active client ID
//     setLocalStorage("active_client_id", id);

//     const payload = {
//       id,
//       ...clientData,
//       createdAt: new Date().toISOString(),
//     };

//     setLocalStorage(`client_${id}`, payload);
//   }, [clientData]);

//   // Save updated data
//   const handleSaveChanges = useCallback(() => {
//     if (!clientId) return;

//     const payload = {
//       id: clientId,
//       ...clientData,
//       updatedAt: new Date().toISOString(),
//     };

//     setLocalStorage(`client_${clientId}`, payload);
//   }, [clientId, clientData]);

//   // Add custom field
//   const addCustomField = useCallback(() => {
//     setClientData((prev) => ({
//       ...prev,
//       customFields: [...prev.customFields, { label: "", value: "" }],
//     }));
//   }, []);

//   // Update custom field
//   const updateCustomField = useCallback((index, key, value) => {
//     setClientData((prev) => {
//       const updated = [...prev.customFields];
//       updated[index] = { ...updated[index], [key]: value };

//       return {
//         ...prev,
//         customFields: updated,
//       };
//     });
//   }, []);

//   // Remove custom field
//   const removeCustomField = useCallback((index) => {
//     setClientData((prev) => ({
//       ...prev,
//       customFields: prev.customFields.filter((_, i) => i !== index),
//     }));
//   }, []);

//   // Clear form and start fresh
//   const handleClearForm = useCallback(() => {
//     setClientData({
//       name: "",
//       phone: "",
//       email: "",
//       company: "",
//       customFields: [],
//     });
//     setClientId(null);
//     setHasDraftData(false);

//     // Clear all related localStorage items
//     removeLocalStorage("client_form_draft");
//     removeLocalStorage("active_client_id");
//   }, []);

//   // Download QR
//   const handleDownloadQR = useCallback(() => {
//     if (!qrRef.current) return;

//     const svg = qrRef.current.querySelector("svg");
//     if (!svg) return;

//     const serializer = new XMLSerializer();
//     const svgStr = serializer.serializeToString(svg);

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     const img = new Image();

//     const svgBlob = new Blob([svgStr], {
//       type: "image/svg+xml;charset=utf-8",
//     });

//     const url = URL.createObjectURL(svgBlob);

//     img.onload = () => {
//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0);
//       URL.revokeObjectURL(url);

//       const pngUrl = canvas.toDataURL("image/png");
//       const a = document.createElement("a");
//       a.href = pngUrl;
//       a.download = "client-qr.png";
//       a.click();
//     };

//     img.src = url;
//   }, []);

//   const qrValue = clientId ? `https://localhost:3000/client/${clientId}` : "";

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: zodResolver(clientSchema),
//     defaultValues: clientData,
//   });

//   return (
//     <div className="space-y-10 p-8 max-w-4xl mx-auto my-8">
//       {/* Header */}
//       <div className="text-center mt-8">
//         <h1 className="text-3xl p-9 font-bold text-gray-900">
//           Client QR Code Generator
//         </h1>
//         <p className="mt-2 text-gray-600">
//           Create a permanent QR and update client details anytime
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Form */}
//         <div className="bg-white rounded-xl shadow-lg border p-6 space-y-6">
//           {/* Form header with clear button */}
//           <div className="flex justify-between items-center">
//             <h2 className="text-lg text-gray-700 font-semibold">
//               Client Information
//             </h2>
//             <button
//               onClick={handleClearForm}
//               className="text-sm text-gray-500 hover:text-red-600 px-3 py-1 border border-gray-300 rounded hover:border-red-300 transition"
//             >
//               Clear Form
//             </button>
//           </div>

//           {/* Fixed Fields */}
//           {["name", "phone", "email", "company"].map((key) => (
//             <div key={key}>
//               <label className="text-sm font-medium text-gray-700 capitalize">
//                 {key}
//               </label>
//               <input
//                 value={clientData[key]}
//                 onChange={(e) =>
//                   setClientData((prev) => ({ ...prev, [key]: e.target.value }))
//                 }
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
//                 placeholder={`Enter ${key}`}
//               />
//             </div>
//           ))}

//           {/* Custom Fields */}
//           <div className="space-y-3">
//             <h3 className="text-sm font-semibold text-gray-700">
//               Custom Fields
//             </h3>

//             {clientData.customFields.map((field, index) => (
//               <div
//                 key={index}
//                 className="grid grid-cols-[1fr_1fr] gap-2 items-center"
//               >
//                 {/* First column with label input */}
//                 <div className="relative">
//                   <button
//                     onClick={() => removeCustomField(index)}
//                     title="Remove field"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
//                   >
//                     ✕
//                   </button>
//                   <input
//                     placeholder="Label"
//                     value={field.label}
//                     onChange={(e) =>
//                     updateCustomField(index, "label", e.target.value)
//                     }
//                     className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black pr-10"
//                   />
//                 </div>

//                 {/* Second column with value input */}
//                 <div className="relative">
//                   <input
//                     placeholder="Value"
//                     value={field.value}
//                     onChange={(e) =>
//                       updateCustomField(index, "value", e.target.value)
//                     }
//                     className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
//                   />
//                 </div>
//               </div>
//             ))}

//             <button
//               onClick={addCustomField}
//               className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
//             >
//               + Add Custom Field
//             </button>
//           </div>

//           {!clientId ? (
//             <button
//               onClick={handleGenerateQR}
//               className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
//             >
//               Generate QR Code
//             </button>
//           ) : (
//             <button
//               onClick={handleSaveChanges}
//               className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition"
//             >
//               Save Changes
//             </button>
//           )}
//         </div>

//         {/* QR */}
//         <div className="bg-white rounded-xl shadow-lg border p-6 flex flex-col items-center space-y-4">
//           {!clientId ? (
//             <div className="text-center space-y-4">
//               <p className="text-gray-500">Generate QR to preview</p>
//               {/* Only show draft message on client side after hydration */}
//               {isClient && hasDraftData && (
//                 <div className="text-sm text-gray-400 border-t pt-4">
//                   <p>Your unsaved form data has been auto-saved.</p>
//                   <p>It will be cleared when you generate a QR code.</p>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <div ref={qrRef} className="p-4 bg-gray-50 border rounded">
//                 <QRCode value={qrValue} size={180} />
//               </div>

//               <p className="text-xs break-all text-gray-500">{qrValue}</p>

//               <div className="flex gap-2">
//                 <button
//                   onClick={handleDownloadQR}
//                   className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
//                 >
//                   Download QR
//                 </button>
//                 <button
//                   onClick={handleClearForm}
//                   className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
//                 >
//                   Create New
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
