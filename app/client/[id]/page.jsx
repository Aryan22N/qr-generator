"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function ClientProfilePage() {
  const { id } = useParams(); //correct
  const searchParams = useSearchParams(); //different variable
  const editKeyFromUrl = searchParams.get("editKey");

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadClient = () => {
      if (!id) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const raw = localStorage.getItem(`client_${id}`);
        if (raw && isMounted) {
          const parsed = JSON.parse(raw);

          setClient(parsed);

          //  THIS IS THE MISSING PART
          setFormData({
            name: parsed.name || "",
            company: parsed.company || "",
            phone: parsed.phone || "",
            email: parsed.email || "",
            customFields: parsed.customFields || [],
          });
        }
      } catch (err) {
        console.error("Failed to load client", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadClient();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
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

  //  Ownership check AFTER client is loaded
  const isOwner = editKeyFromUrl && editKeyFromUrl === client.editKey;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomFieldChange = (index, key, value) => {
    setFormData((prev) => {
      const updated = [...prev.customFields];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, customFields: updated };
    });
  };

  const addCustomField = () => {
    setFormData((prev) => ({
      ...prev,
      customFields: [...prev.customFields, { label: "", value: "" }],
    }));
  };

  const removeCustomField = (index) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  const saveChanges = () => {
    if (!isOwner) return;

    const updated = {
      ...client,
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(`client_${id}`, JSON.stringify(updated));
    setClient(updated);
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Client Details
        </h1>

        {/* Fixed fields */}
        {!isEditing && (
          <div className="space-y-3 text-sm text-gray-600">
            <Detail label="Name" value={client.name} />
            <Detail label="Company" value={client.company} />
            <Detail label="Phone" value={client.phone} />
            <Detail label="Email" value={client.email} />
          </div>
        )}

        {isOwner && isEditing && formData && (
          <div className="space-y-4">
            {/* Fixed fields */}
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

            {/* Custom fields editor */}
            <div className="pt-4 border-t space-y-3">
              <p className="text-sm font-medium text-gray-700">Custom Fields</p>

              {formData.customFields.map((field, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 relative">
                  <input
                    value={field.label}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "label", e.target.value)
                    }
                    placeholder="Label"
                    className="border p-2 rounded"
                  />

                  <input
                    value={field.value}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="border p-2 rounded"
                  />

                  <button
                    type="button"
                    onClick={() => removeCustomField(index)}
                    className="absolute -top-2 -right-2 bg-gray-200 text-gray-600 rounded-full px-2 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addCustomField}
                className="text-sm bg-gray-200 px-3 py-1 rounded"
              >
                + Add Custom Field
              </button>
            </div>

            {/* Save */}
            <button
              onClick={saveChanges}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Custom fields */}
        {Array.isArray(client.customFields) &&
          client.customFields.length > 0 && (
            <div className="space-y-3 text-sm pt-4 border-t">
              {client.customFields.map((field, index) => (
                <Detail key={index} label={field.label} value={field.value} />
              ))}
            </div>
          )}

        {isOwner && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 text-white py-2 rounded mt-4"
          >
            Edit QR Info
          </button>
        )}

        <p className="text-xs text-gray-400 text-center pt-2 break-all">
          Client ID: {client.id}
        </p>
      </div>
    </main>
  );
}

/* Reusable Detail Row */
function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1 gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right break-all">
        {value || "—"}
      </span>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function ClientProfilePage() {
//   const params = useParams();
//   const id = params?.id;

//   const [client, setClient] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     async function loadClient() {
//       if (!id) {
//         if (isMounted) setLoading(false);
//         return;
//       }

//       await Promise.resolve();

//       if (isMounted) {
//         try {
//           const data = localStorage.getItem(`client_${id}`);
//           if (data) {
//             setClient(JSON.parse(data));
//           }
//         } catch (err) {
//           console.error("Failed to load client", err);
//         } finally {
//           setLoading(false);
//         }
//       }
//     }

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

//   return (
//     <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-6 space-y-6">
//         <h1 className="text-2xl font-bold text-center text-gray-900">
//           Client Details
//         </h1>

//         {/* Fixed fields */}
//         <div className="space-y-3 text-sm">
//           <Detail label="Name" value={client.name} />
//           <Detail label="Company" value={client.company} />
//           <Detail label="Phone" value={client.phone} />
//           <Detail label="Email" value={client.email} />
//         </div>

//         {/* Custom fields */}
//         {Array.isArray(client.customFields) &&
//           client.customFields.length > 0 && (
//             <div className="space-y-3 text-sm pt-4 border-t">
//               {client.customFields.map((field, index) => (
//                 <Detail key={index} label={field.label} value={field.value} />
//               ))}
//             </div>
//           )}

//         <p className="text-xs text-gray-400 text-center pt-2">
//           Client ID: {client.id}
//         </p>
//       </div>
//     </main>
//   );
// }

// /* Reusable Detail Row  */
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
