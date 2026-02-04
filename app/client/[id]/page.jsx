// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function ClientProfilePage() {
//   const params = useParams();
//   const id = params?.id;
//   const [client, setClient] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Track if the component is still mounted
//     let isMounted = true;

//     async function loadClient() {
//       if (!id) {
//         if (isMounted) setLoading(false);
//         return;
//       }

//       // Make the state update asynchronous
//       await Promise.resolve();

//       // Only update state if component is still mounted
//       if (isMounted) {
//         const data = localStorage.getItem(`client_${id}`);
//         if (data) {
//           setClient(JSON.parse(data));
//         }
//         setLoading(false);
//       }
//     }

//     loadClient();

//     // Cleanup function to prevent state updates after unmount
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

//         <div className="space-y-3 text-sm">
//           <Detail label="Name" value={client.name} />
//           <Detail label="Company" value={client.company} />
//           <Detail label="Phone" value={client.phone} />
//           <Detail label="Email" value={client.email} />
//         </div>

//         <p className="text-xs text-gray-400 text-center">
//           Client ID: {client.id}
//         </p>
//       </div>
//     </main>
//   );
// }

// function Detail({ label, value }) {
//   return (
//     <div className="flex justify-between border-b pb-1">
//       <span className="text-gray-500">{label}</span>
//       <span className="font-medium text-gray-800">{value || "—"}</span>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ClientProfilePage() {
  const params = useParams();
  const id = params?.id;

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadClient() {
      if (!id) {
        if (isMounted) setLoading(false);
        return;
      }

      await Promise.resolve();

      if (isMounted) {
        try {
          const data = localStorage.getItem(`client_${id}`);
          if (data) {
            setClient(JSON.parse(data));
          }
        } catch (err) {
          console.error("Failed to load client", err);
        } finally {
          setLoading(false);
        }
      }
    }

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

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Client Details
        </h1>

        {/* Fixed fields */}
        <div className="space-y-3 text-sm">
          <Detail label="Name" value={client.name} />
          <Detail label="Company" value={client.company} />
          <Detail label="Phone" value={client.phone} />
          <Detail label="Email" value={client.email} />
        </div>

        {/* Custom fields */}
        {Array.isArray(client.customFields) &&
          client.customFields.length > 0 && (
            <div className="space-y-3 text-sm pt-4 border-t">
              {client.customFields.map((field, index) => (
                <Detail key={index} label={field.label} value={field.value} />
              ))}
            </div>
          )}

        <p className="text-xs text-gray-400 text-center pt-2">
          Client ID: {client.id}
        </p>
      </div>
    </main>
  );
}

/* Reusable Detail Row  */
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
