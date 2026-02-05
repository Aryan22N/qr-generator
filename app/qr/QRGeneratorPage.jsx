// "use client";

// import { useEffect, useRef, useState } from "react";
// import QRCode from "react-qr-code";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { clientSchema } from "../schemas/client.schema";
// import { save, load, remove } from "../lib/storage";

// /*  Component  */
// export default function QRGeneratorPage() {
//   const [clientId, setClientId] = useState(null);
//   const qrRef = useRef(null);

//   /*  React Hook Form + Zod */
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

//   /* Load draft on mount  */
//   useEffect(() => {
//     const draft = load("client_form_draft");
//     const activeId = load("active_client_id");

//     if (draft) reset(draft);
//     if (activeId) setClientId(activeId);
//   }, [reset]);

//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!mounted) return;

//     const timer = setTimeout(() => {
//       save("client_form_draft", formData);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [formData, mounted]);

//   /*  Generate QR */
//   const onGenerateQR = (data) => {
//     const id = crypto.randomUUID();
//     setClientId(id);

//     save("active_client_id", id);
//     save(`client_${id}`, {
//       id,
//       ...data,
//       createdAt: new Date().toISOString(),
//     });

//     remove("client_form_draft");
//   };

//   /* Save changes  */
//   const onSaveChanges = (data) => {
//     if (!clientId) return;

//     save(`client_${clientId}`, {
//       id: clientId,
//       ...data,
//       updatedAt: new Date().toISOString(),
//     });
//   };

//   /* Clear form */
//   const clearForm = () => {
//     reset({
//       name: "",
//       phone: "",
//       email: "",
//       company: "",
//       customFields: [],
//     });
//     setClientId(null);
//     remove("client_form_draft");
//     remove("active_client_id");
//   };

//   /* Download QR  */
//   const downloadQR = () => {
//     if (!qrRef.current) return;
//     const svg = qrRef.current.querySelector("svg");
//     if (!svg) return;
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     const img = new Image();

//     const svgBlob = new Blob([new XMLSerializer().serializeToString(svg)], {
//       type: "image/svg+xml;charset=utf-8",
//     });

//     const url = URL.createObjectURL(svgBlob);
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

//   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//   const qrValue = clientId ? `${BASE_URL}/client/${clientId}` : "";

//   /*  UI  */
//   return (
//     <div className="max-w-4xl mx-auto p-8 space-y-10">
//       <h1 className="text-3xl text-gray-800 font-bold text-center">
//         Client QR Code Generator
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/*  Form*/}
//         <div className="bg-white border rounded-xl p-6 space-y-6 shadow">
//           <div className="flex justify-between">
//             <h2 className="font-semibold text-gray-800">Client Information</h2>
//             <button
//               onClick={clearForm}
//               className="text-sm text-gray-800 border-2-gray-700"
//             >
//               Clear
//             </button>
//           </div>

//           {["name", "phone", "email", "company"].map((field) => (
//             <div key={field}>
//               <input
//                 {...register(field)}
//                 placeholder={field}
//                 className="w-full border text-gray-800 rounded px-3 py-2"
//               />
//               {errors[field] && (
//                 <p className="text-gray-800 text-xs">{errors[field].message}</p>
//               )}
//             </div>
//           ))}

//           {/* Custom fields */}
//           <div className="space-y-2">
//             <p className="font-medium text-sm text-gray-800">Custom Fields</p>

//             {fields.map((f, i) => (
//               <div
//                 key={f.id}
//                 className="relative text-gray-800 grid grid-cols-2 gap-2"
//               >
//                 <input
//                   {...register(`customFields.${i}.label`)}
//                   placeholder="Label"
//                   className="border rounded px-3 py-2"
//                 />
//                 <input
//                   {...register(`customFields.${i}.value`)}
//                   placeholder="Value"
//                   className="border rounded px-3 py-2"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeField(i)}
//                   className="absolute right-2 top-2 text-red-500"
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}

//             <button
//               type="button"
//               onClick={() => append({ label: "", value: "" })}
//               className="text-sm text-gray-800 "
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
//         </div>

//         {/* QR*/}
//         <div className="bg-white border rounded-xl p-6 shadow flex flex-col items-center space-y-4">
//           {!clientId ? (
//             <p className="text-gray-500">Generate QR to preview</p>
//           ) : (
//             <>
//               <div ref={qrRef} className="p-4 border rounded">
//                 <QRCode value={qrValue} size={180} />
//               </div>

//               <p className="text-xs text-gray-800 break-all">{qrValue}</p>

//               <button
//                 onClick={downloadQR}
//                 className="bg-green-600 text-white px-6 py-2 rounded"
//               >
//                 Download QR
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { clientSchema } from "../schemas/client.schema";
import { save, load, remove } from "../lib/storage";

export default function QRGeneratorPage() {
  const [clientId, setClientId] = useState(null);
  const qrRef = useRef(null);

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const draft = load("client_form_draft");
    const activeId = load("active_client_id");
    if (draft) reset(draft);
    if (activeId) setClientId(activeId);
  }, [reset]);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => save("client_form_draft", formData), 300);
    return () => clearTimeout(t);
  }, [formData, mounted]);

  const onGenerateQR = (data) => {
    const id = crypto.randomUUID();
    setClientId(id);
    save("active_client_id", id);
    save(`client_${id}`, { id, ...data, createdAt: new Date().toISOString() });
    remove("client_form_draft");
  };

  const onSaveChanges = (data) => {
    if (!clientId) return;
    save(`client_${clientId}`, {
      id: clientId,
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  const clearForm = () => {
    reset({ name: "", phone: "", email: "", company: "", customFields: [] });
    setClientId(null);
    remove("client_form_draft");
    remove("active_client_id");
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
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

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const qrValue = clientId ? `${BASE_URL}/client/${clientId}` : "";

  return (
    <motion.div
      className="max-w-4xl mx-auto p-8 space-y-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl text-gray-800 font-bold text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Client QR Code Generator
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FORM CARD */}
        <motion.div
          className="bg-white border rounded-xl p-6 space-y-6 shadow"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between">
            <h2 className="font-semibold text-gray-800">Client Information</h2>
            <button
              onClick={clearForm}
              className="text-sm text-gray-700 bg-gray-200 p-2 rounded hover:text-red-600"
            >
              Clear
            </button>
          </div>

          {["name", "phone", "email", "company"].map((field) => (
            <div key={field}>
              <input
                {...register(field)}
                placeholder={field}
                className="w-full border rounded px-3 py-2 text-gray-800"
              />
              {errors[field] && (
                <motion.p
                  className="text-xs text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors[field].message}
                </motion.p>
              )}
            </div>
          ))}

          {/* Custom Fields */}
          <div className="space-y-2">
            <p className="font-medium text-sm text-gray-800">Custom Fields</p>

            <AnimatePresence>
              {fields.map((f, i) => (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative grid grid-cols-1 gap-2"
                >
                  <input
                    {...register(`customFields.${i}.label`)}
                    placeholder="Label"
                    className="border rounded text-gray-600 px-3 py-2"
                  />
                  <input
                    {...register(`customFields.${i}.value`)}
                    placeholder="Value"
                    className="border rounded text-gray-600 px-3 py-2"
                  />

                  <button
                    type="button"
                    onClick={() => removeField(i)}
                    className="absolute right-0 top-[-32px] rounded-full p-0.5 bg-gray-200 text-gray-500"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => append({ label: "", value: "" })}
              className="text-sm text-gray-700 bg-gray-200 p-3 rounded-2xl hover:text-black"
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
        </motion.div>

        {/* QR CARD */}
        <motion.div
          className="bg-white border rounded-xl p-6 shadow flex flex-col items-center space-y-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {!clientId ? (
              <motion.p
                key="empty"
                className="text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Generate QR to preview
              </motion.p>
            ) : (
              <motion.div
                key="qr"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-4"
              >
                <div ref={qrRef} className="p-4 border rounded">
                  <QRCode value={qrValue} size={180} />
                </div>

                <p className="text-xs break-all text-gray-800">{qrValue}</p>

                <button
                  onClick={downloadQR}
                  className="bg-green-600 text-white px-6 py-2 rounded"
                >
                  Download QR
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
