// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useSearchParams } from "next/navigation";

// export default function ClientProfilePage() {
//   const { id } = useParams(); //correct
//   const searchParams = useSearchParams(); //different variable
//   const editKeyFromUrl = searchParams.get("editKey");

//   const [client, setClient] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState(null);

//   useEffect(() => {
//     let isMounted = true;

//     const loadClient = async () => {
//       if (!id) {
//         if (isMounted) setLoading(false);
//         return;
//       }

//       try {
//         let parsed = null;

//         const res = await fetch(`/api/clients/${id}`, { cache: "no-store" });
//         if (res.ok) {
//           parsed = await res.json();
//         }

//         if (!parsed) {
//           const raw = localStorage.getItem(`client_${id}`);
//           if (raw) parsed = JSON.parse(raw);
//         }

//         if (parsed) {
//           localStorage.setItem(`client_${id}`, JSON.stringify(parsed));
//         }

//         if (parsed && isMounted) {
//           setClient(parsed);
//           setFormData({
//             name: parsed.name || "",
//             company: parsed.company || "",
//             phone: parsed.phone || "",
//             email: parsed.email || "",
//             customFields: parsed.customFields || [],
//           });
//         }
//       } catch (err) {
//         console.error("Failed to load client", err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     loadClient();

//     return () => {
//       isMounted = false;
//     };
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Loading client details...
//       </div>
//     );
//   }

//   if (!client) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-600">
//         Client not found
//       </div>
//     );
//   }

//   //  Ownership check AFTER client is loaded
//   const isOwner = editKeyFromUrl && editKeyFromUrl === client.editKey;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCustomFieldChange = (index, key, value) => {
//     setFormData((prev) => {
//       const updated = [...prev.customFields];
//       updated[index] = { ...updated[index], [key]: value };
//       return { ...prev, customFields: updated };
//     });
//   };

//   const addCustomField = () => {
//     setFormData((prev) => ({
//       ...prev,
//       customFields: [...prev.customFields, { label: "", value: "" }],
//     }));
//   };

//   const removeCustomField = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       customFields: prev.customFields.filter((_, i) => i !== index),
//     }));
//   };

//   const saveChanges = async () => {
//     if (!isOwner) return;
//     if (!editKeyFromUrl) return;

//     try {
//       const res = await fetch(`/api/clients/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           editKey: editKeyFromUrl,
//           ...formData,
//         }),
//       });

//       if (!res.ok) {
//         console.error("Failed to update client", res.status);
//         return;
//       }

//       const updated = await res.json();
//       localStorage.setItem(`client_${id}`, JSON.stringify(updated));
//       setClient(updated);
//       setIsEditing(false);
//     } catch (err) {
//       console.error("Failed to update client", err);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-6 space-y-6">
//         <h1 className="text-2xl font-bold text-center text-gray-900">
//           Client Details
//         </h1>

//         {/* Fixed fields */}
//         {!isEditing && (
//           <div className="space-y-3 text-sm text-gray-600">
//             <Detail label="Name" value={client.name} />
//             <Detail label="Company" value={client.company} />
//             <Detail label="Phone" value={client.phone} />
//             <Detail label="Email" value={client.email} />
//           </div>
//         )}

//         {isOwner && isEditing && formData && (
//           <div className="space-y-4">
//             {/* Fixed fields */}
//             <input
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               placeholder="Name"
//             />

//             <input
//               name="company"
//               value={formData.company}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               placeholder="Company"
//             />

//             <input
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               placeholder="Phone"
//             />

//             <input
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               placeholder="Email"
//             />

//             {/* Custom fields editor */}
//             <div className="pt-4 border-t space-y-3">
//               <p className="text-sm font-medium text-gray-700">Custom Fields</p>

//               {formData.customFields.map((field, index) => (
//                 <div key={index} className="grid grid-cols-2 gap-2 relative">
//                   <input
//                     value={field.label}
//                     onChange={(e) =>
//                       handleCustomFieldChange(index, "label", e.target.value)
//                     }
//                     placeholder="Label"
//                     className="border p-2 rounded"
//                   />

//                   <input
//                     value={field.value}
//                     onChange={(e) =>
//                       handleCustomFieldChange(index, "value", e.target.value)
//                     }
//                     placeholder="Value"
//                     className="border p-2 rounded"
//                   />

//                   <button
//                     type="button"
//                     onClick={() => removeCustomField(index)}
//                     className="absolute -top-2 -right-2 bg-gray-200 text-gray-600 rounded-full px-2 text-xs"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={addCustomField}
//                 className="text-sm bg-gray-200 px-3 py-1 rounded"
//               >
//                 + Add Custom Field
//               </button>
//             </div>

//             {/* Save */}
//             <button
//               onClick={saveChanges}
//               className="w-full bg-green-600 text-white py-2 rounded"
//             >
//               Save Changes
//             </button>
//           </div>
//         )}

//         {/* Custom fields */}
//         {Array.isArray(client.customFields) &&
//           client.customFields.length > 0 && (
//             <div className="space-y-3 text-sm pt-4 border-t">
//               {client.customFields.map((field, index) => (
//                 <Detail key={index} label={field.label} value={field.value} />
//               ))}
//             </div>
//           )}

//         {isOwner && !isEditing && (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="w-full bg-blue-600 text-white py-2 rounded mt-4"
//           >
//             Edit QR Info
//           </button>
//         )}

//         <p className="text-xs text-gray-400 text-center pt-2 break-all">
//           Client ID: {client.id}
//         </p>
//       </div>
//     </main>
//   );
// }

// /* Reusable Detail Row */
// function Detail({ label, value }) {
//   return (
//     <div className="flex justify-between border-b pb-1 gap-4">
//       <span className="text-gray-500">{label}</span>
//       <span className="font-medium text-gray-800 text-right break-all">
//         {value || "—"}
//       </span>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function ClientProfilePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const editKeyFromUrl = searchParams.get("editKey");

  const [client, setClient] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  /* ===============================
     LOAD CLIENT FROM SUPABASE
  =============================== */
  useEffect(() => {
    if (!id) return;

    const loadClient = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Client not found", error);
        setClient(null);
      } else {
        setClient(data);
        setFormData({
          name: data.name || "",
          company: data.company || "",
          phone: data.phone || "",
          email: data.email || "",
          customFields: data.custom_fields || [],
        });
      }

      setLoading(false);
    };

    loadClient();
  }, [id]);

  /* ===============================
     PERMISSIONS
  =============================== */
  const isOwner =
    Boolean(editKeyFromUrl) && client?.edit_key === editKeyFromUrl;

  /* ===============================
     FORM HANDLERS
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleCustomFieldChange = (index, key, value) => {
    setFormData((p) => {
      const updated = [...p.customFields];
      updated[index] = { ...updated[index], [key]: value };
      return { ...p, customFields: updated };
    });
  };

  const addCustomField = () => {
    setFormData((p) => ({
      ...p,
      customFields: [...p.customFields, { label: "", value: "" }],
    }));
  };

  const removeCustomField = (index) => {
    setFormData((p) => ({
      ...p,
      customFields: p.customFields.filter((_, i) => i !== index),
    }));
  };

  /* ===============================
     SAVE CHANGES (SUPABASE)
  =============================== */
  const saveChanges = async () => {
    if (!isOwner) return;

    const { error } = await supabase
      .from("clients")
      .update({
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        custom_fields: formData.customFields,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("edit_key", editKeyFromUrl);

    if (error) {
      console.error("Update failed", error);
      return;
    }

    setClient((c) => ({
      ...c,
      ...formData,
      custom_fields: formData.customFields,
    }));

    setIsEditing(false);
  };

  /* ===============================
     UI STATES
  =============================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading client details...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Client not found
      </div>
    );
  }

  return (
    <main className="min-h-screen text-gray-600 bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl  font-bold text-center">Client Details</h1>

        {/* VIEW MODE */}
        {!isEditing && (
          <div className="space-y-3 text-sm">
            <Detail label="Name" value={client.name} />
            <Detail label="Company" value={client.company} />
            <Detail label="Phone" value={client.phone} />
            <Detail label="Email" value={client.email} />

            {Array.isArray(client.custom_fields) &&
              client.custom_fields.map((f, i) => (
                <Detail key={i} label={f.label} value={f.value} />
              ))}
          </div>
        )}

        {/* EDIT MODE */}
        {isOwner && isEditing && formData && (
          <div className="space-y-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Name"
            />

            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Company"
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Phone"
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Email"
            />

            {/* Custom Fields */}
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium">Custom Fields</p>

              {formData.customFields.map((field, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 relative">
                  <input
                    value={field.label}
                    onChange={(e) =>
                      handleCustomFieldChange(i, "label", e.target.value)
                    }
                    className="border p-2 rounded"
                    placeholder="Label"
                  />
                  <input
                    value={field.value}
                    onChange={(e) =>
                      handleCustomFieldChange(i, "value", e.target.value)
                    }
                    className="border p-2 rounded"
                    placeholder="Value"
                  />

                  <button
                    onClick={() => removeCustomField(i)}
                    className="absolute -top-2 -right-2 bg-gray-200 text-xs px-2 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={addCustomField}
                className="text-sm bg-gray-200 px-3 py-1 rounded"
              >
                + Add Custom Field
              </button>
            </div>

            <button
              onClick={saveChanges}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        )}

        {isOwner && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Edit QR Info
          </button>
        )}

        <p className="text-xs text-gray-400 text-center break-all">
          Client ID: {client.id}
        </p>
      </div>
    </main>
  );
}

/* ===============================
   REUSABLE DETAIL ROW
=============================== */
function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1 gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right break-all">{value || "—"}</span>
    </div>
  );
}
