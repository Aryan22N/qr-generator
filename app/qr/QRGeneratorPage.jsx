"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { clientSchema } from "../schemas/client.schema";
import { supabase } from "../lib/supabase";

export default function QRGeneratorPage() {
  const [clientId, setClientId] = useState(null);
  const [editKey, setEditKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    reset,
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields",
  });

  const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

  /* ===============================
     CREATE CLIENT + QR
  =============================== */
  const onGenerateQR = async (data) => {
    const id = crypto.randomUUID();
    const key = crypto.randomUUID();

    const { error } = await supabase.from("clients").insert({
      id,
      edit_key: key,
      name: data.name,
      phone: data.phone,
      email: data.email,
      company: data.company,
      custom_fields: data.customFields,
    });

    if (error) {
      console.error(error);
      alert("Failed to create client");
      return;
    }

    setClientId(id);
    setEditKey(key);
  };

  /* ===============================
     UPDATE CLIENT
  =============================== */
  const onSaveChanges = async (data) => {
    if (!clientId || !editKey) return;

    const { error } = await supabase
      .from("clients")
      .update({
        name: data.name,
        phone: data.phone,
        email: data.email,
        company: data.company,
        custom_fields: data.customFields,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId)
      .eq("edit_key", editKey);

    if (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  const clearForm = () => {
    reset({
      name: "",
      phone: "",
      email: "",
      company: "",
      customFields: [],
    });
    setClientId(null);
    setEditKey(null);
  };

  /* ===============================
     QR HELPERS
  =============================== */
  const qrValue = clientId ? `${BASE_URL}/client/${clientId}` : "";

  const editUrl =
    clientId && editKey
      ? `${BASE_URL}/client/${clientId}?editKey=${editKey}`
      : "";

  const copyQrValue = async () => {
    await navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
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

  /* ===============================
     UI
  =============================== */
  return (
    <motion.div className="max-w-4xl mx-auto p-8 space-y-10">
      <h1 className="text-3xl text-gray-600 font-bold text-center">
        Client QR Code Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FORM */}
        <div className="bg-white border rounded-xl p-6 space-y-6 shadow">
          <div className="flex justify-between">
            <h2 className="font-semibold text-gray-600 ">Client Information</h2>
            <button onClick={clearForm} className="text-sm text-red-600">
              Clear
            </button>
          </div>

          {["name", "phone", "email", "company"].map((field) => (
            <div key={field}>
              <input
                {...register(field)}
                placeholder={field}
                className="w-full border text-gray-600 rounded px-3 py-2"
              />
              {errors[field] && (
                <p className="text-xs  text-red-600">{errors[field].message}</p>
              )}
            </div>
          ))}

          {/* Custom fields */}
          <div>
            {fields.map((f, i) => (
              <div key={f.id} className="grid text-gray-600 gap-2 mb-2">
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
                  onClick={() => remove(i)}
                  className="text-xs text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ label: "", value: "" })}
              className="text-sm text-blue-600"
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

        {/* QR */}
        <div className="bg-white text-gray-600 border rounded-xl p-6 shadow flex flex-col items-center space-y-4">
          {!clientId ? (
            <p className="text-gray-500">Generate QR to preview</p>
          ) : (
            <>
              <div ref={qrRef} className="p-4 border rounded">
                <QRCode value={qrValue} size={180} />
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs break-all">{qrValue}</p>
                <button onClick={copyQrValue}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              <button
                onClick={downloadQR}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Download QR
              </button>

              <div className="text-xs bg-yellow-50 p-3 rounded">
                <p className="font-semibold">Owner Edit Link</p>
                <p className="break-all">{editUrl}</p>
              </div>

              <button
                onClick={() => router.push(editUrl)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add / Update Info
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// "use client";

// import { useEffect, useRef, useState } from "react";
// import QRCode from "react-qr-code";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { motion, AnimatePresence } from "framer-motion";

// import { clientSchema } from "../schemas/client.schema";
// import { save, load, remove } from "../lib/storage";
// import { Copy, Check } from "lucide-react";

// import { useRouter } from "next/navigation";

// export default function QRGeneratorPage() {
//   const [clientId, setClientId] = useState(null);
//   const [editKey, setEditKey] = useState(null);
//   const [baseUrl, setBaseUrl] = useState("");
//   const qrRef = useRef(null);
//   const [copied, setCopied] = useState(false);
//   const router = useRouter();

//   const {
//     register,
//     control,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(clientSchema),
//     defaultValues: {
//       name: "",
//       phone: "",
//       email: "",
//       company: "",
//       customFields: [],
//     },
//   });

//   const {
//     fields,
//     append,
//     remove: removeField,
//   } = useFieldArray({
//     control,
//     name: "customFields",
//   });

//   const formData = watch();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     if (typeof window !== "undefined") {
//       setBaseUrl(window.location.origin);
//     }
//   }, []);

//   useEffect(() => {
//     const draft = load("client_form_draft");
//     const activeId = load("active_client_id");
//     const activeEditKey = load("active_edit_key");
//     if (draft) reset(draft);
//     if (activeId) setClientId(activeId);
//     if (activeEditKey) setEditKey(activeEditKey);
//   }, [reset]);

//   useEffect(() => {
//     if (!mounted) return;
//     const t = setTimeout(() => save("client_form_draft", formData), 300);
//     return () => clearTimeout(t);
//   }, [formData, mounted]);

//   const onGenerateQR = async (data) => {
//     const id = crypto.randomUUID();
//     const newEditKey = crypto.randomUUID();

//     setClientId(id);
//     setEditKey(newEditKey);

//     save("active_client_id", id);
//     save("active_edit_key", newEditKey);

//     // ✅ IMPORTANT FIX
//     save(`client_${id}`, {
//       id,
//       editKey: newEditKey, // 🔐 store ownership key
//       ...data,
//       createdAt: new Date().toISOString(),
//     });

//     try {
//       await fetch("/api/clients", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id,
//           editKey: newEditKey,
//           ...data,
//           createdAt: new Date().toISOString(),
//         }),
//       });
//     } catch (err) {
//       console.error("Failed to create client", err);
//     }

//     remove("client_form_draft");
//   };

//   const onSaveChanges = async (data) => {
//     if (!clientId) return;
//     save(`client_${clientId}`, {
//       id: clientId,
//       ...data,
//       updatedAt: new Date().toISOString(),
//     });

//     const key = editKey || load("active_edit_key");
//     if (!key) return;

//     try {
//       await fetch(`/api/clients/${clientId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           editKey: key,
//           ...data,
//         }),
//       });
//     } catch (err) {
//       console.error("Failed to update client", err);
//     }
//   };

//   const clearForm = () => {
//     reset({ name: "", phone: "", email: "", company: "", customFields: [] });
//     setClientId(null);
//     setEditKey(null);
//     remove("client_form_draft");
//     remove("active_client_id");
//     remove("active_edit_key");
//   };

//   /*  Copy QR Value  */
//   const copyQrValue = async () => {
//     try {
//       await navigator.clipboard.writeText(qrValue);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1500);
//     } catch (err) {
//       console.error("Copy failed", err);
//     }
//   };

//   const downloadQR = () => {
//     if (!qrRef.current) return;
//     const svg = qrRef.current.querySelector("svg");
//     if (!svg) return;

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     const img = new Image();
//     const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
//       type: "image/svg+xml;charset=utf-8",
//     });

//     const url = URL.createObjectURL(blob);
//     img.onload = () => {
//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0);
//       URL.revokeObjectURL(url);
//       const a = document.createElement("a");
//       a.href = canvas.toDataURL("image/png");
//       a.download = "client-qr.png";
//       a.click();
//     };
//     img.src = url;
//   };

//   const BASE_URL =
//     baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//   const qrValue = clientId ? `${BASE_URL}/client/${clientId}` : "";
//   const activeKey = editKey || load("active_edit_key");
//   const editUrl =
//     clientId && activeKey ? `${BASE_URL}/client/${clientId}?editKey=${activeKey}` : "";

//   return (
//     <motion.div
//       className="max-w-4xl mx-auto p-8 space-y-10"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <motion.h1
//         className="text-3xl text-gray-800 font-bold text-center"
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         Client QR Code Generator
//       </motion.h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* FORM CARD */}
//         <motion.div
//           className="bg-white border rounded-xl p-6 space-y-6 shadow"
//           initial={{ opacity: 0, x: -40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.1 }}
//         >
//           <div className="flex justify-between">
//             <h2 className="font-semibold text-gray-800">Client Information</h2>
//             <button
//               onClick={clearForm}
//               className="text-sm text-gray-700 bg-gray-200 p-2 rounded hover:text-red-600"
//             >
//               Clear
//             </button>
//           </div>

//           {["name", "phone", "email", "company"].map((field) => (
//             <div key={field}>
//               <input
//                 {...register(field)}
//                 placeholder={field}
//                 className="w-full border rounded px-3 py-2 text-gray-800"
//               />
//               {errors[field] && (
//                 <motion.p
//                   className="text-xs text-red-600"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                 >
//                   {errors[field].message}
//                 </motion.p>
//               )}
//             </div>
//           ))}

//           {/* Custom Fields */}
//           <div className="space-y-2">
//             <p className="font-medium text-sm text-gray-800">Custom Fields</p>

//             <AnimatePresence>
//               {fields.map((f, i) => (
//                 <motion.div
//                   key={f.id}
//                   layout
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   className="relative grid grid-cols-1 gap-2"
//                 >
//                   <input
//                     {...register(`customFields.${i}.label`)}
//                     placeholder="Label"
//                     className="border rounded text-gray-600 px-3 py-2"
//                   />
//                   <input
//                     {...register(`customFields.${i}.value`)}
//                     placeholder="Value"
//                     className="border rounded text-gray-600 px-3 py-2"
//                   />

//                   <button
//                     type="button"
//                     onClick={() => removeField(i)}
//                     className="absolute right-0 top-[-32px] rounded-full p-0.5 bg-gray-200 text-gray-500"
//                   >
//                     ✕
//                   </button>
//                 </motion.div>
//               ))}
//             </AnimatePresence>

//             <button
//               type="button"
//               onClick={() => append({ label: "", value: "" })}
//               className="text-sm text-gray-700 bg-gray-200 p-3 rounded-2xl hover:text-black"
//             >
//               + Add Custom Field
//             </button>
//           </div>

//           {!clientId ? (
//             <button
//               onClick={handleSubmit(onGenerateQR)}
//               className="w-full bg-black text-white py-3 rounded"
//             >
//               Generate QR
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit(onSaveChanges)}
//               className="w-full bg-gray-800 text-white py-3 rounded"
//             >
//               Save Changes
//             </button>
//           )}
//         </motion.div>

//         {/* QR CARD */}
//         <motion.div
//           className="bg-white border rounded-xl p-6 shadow flex flex-col items-center space-y-4"
//           initial={{ opacity: 0, x: 40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <AnimatePresence mode="wait">
//             {!clientId ? (
//               <motion.p
//                 key="empty"
//                 className="text-gray-500"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//               >
//                 Generate QR to preview
//               </motion.p>
//             ) : (
//               <motion.div
//                 key="qr"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="flex flex-col items-center space-y-4"
//               >
//                 <div ref={qrRef} className="p-4 border rounded">
//                   <QRCode value={qrValue} size={180} />
//                 </div>

//                 {/* QR Value + Copy */}
//                 <div className="w-full bg-gray-50 border rounded-lg p-3 flex items-center justify-between gap-3">
//                   <p className="text-xs break-all text-gray-800">{qrValue}</p>

//                   <button
//                     onClick={copyQrValue}
//                     className="shrink-0 p-2 rounded-md border hover:bg-gray-100 transition"
//                     title="Copy QR ID"
//                   >
//                     {copied ? (
//                       <Check size={16} className="text-green-600" />
//                     ) : (
//                       <Copy size={16} className="text-gray-600" />
//                     )}
//                   </button>
//                 </div>

//                 <button
//                   onClick={downloadQR}
//                   className="bg-green-600 text-white px-6 py-2 rounded"
//                 >
//                   Download QR
//                 </button>

//                 <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs">
//                   <p className="font-medium text-yellow-800">
//                     Owner Edit Link (keep private)
//                   </p>
//                   <p className="break-all text-yellow-700 mt-1">{editUrl}</p>
//                 </div>

//                 <div className="bg-white border rounded-xl p-6 shadow-sm">
//                   <h1 className="text-lg font-semibold text-gray-800">
//                     Change & Update QR Info
//                   </h1>

//                   <p className="text-sm text-gray-500 mt-1">
//                     Edit the details linked to this QR code anytime.
//                   </p>

//                   <button
//                     onClick={() => editUrl && router.push(editUrl)}
//                     className="mt-5 inline-flex items-center justify-center
//     bg-blue-600 hover:bg-blue-700
//     text-white text-sm font-medium
//     px-5 py-2.5 rounded-lg
//     transition-all duration-200
//     focus:outline-none focus:ring-2 focus:ring-blue-500/40"
//                   >
//                     Add / Update Info
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }
