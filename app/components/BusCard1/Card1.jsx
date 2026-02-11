// "use client";

// import React, { useState, useRef } from "react";
// import { Upload, X, QrCode } from "lucide-react";

// const Card1 = ({
//   formData = {},
//   template = null,
//   customColors = {
//     brandBlue: "#4dabf5",
//     brandDark: "#1e293b",
//     accentColor: "#2c7bb6",
//   },
// }) => {
//   // Default data with fallbacks
//   const data = {
//     name: "Michal Johns",
//     title: "Solution Manager",
//     company: "Brand",
//     email: "youremail@.com",
//     phone: "0123-456-789",
//     website: "www.companyname.com",
//     address: "Street Address Here\nCity Name Here-1234",
//     slogan: "Your Slogan Here",
//     ...formData,
//   };

//   // State for QR code
//   const [qrCodeImage, setQrCodeImage] = useState(null);
//   const [showQR, setShowQR] = useState(true);
//   const fileInputRef = useRef(null);

//   // Split address into lines
//   const addressLines = data.address.split("\n");

//   // Base template colors, overridden by customColors when provided
//   const colors = {
//     brandBlue: template?.color || "#4dabf5",
//     brandDark: "#1e293b",
//     accentColor: template?.color || "#2c7bb6",
//     ...customColors,
//   };

//   // Handle QR code upload
//   const handleQrUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         // 2MB limit
//         alert("File size should be less than 2MB");
//         return;
//       }

//       if (!file.type.match("image.*")) {
//         alert("Please upload an image file");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setQrCodeImage(e.target.result);
//         setShowQR(true);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle QR code removal
//   const handleRemoveQr = () => {
//     setQrCodeImage(null);
//     setShowQR(false);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   // Handle QR code toggle
//   const handleToggleQR = () => {
//     setShowQR(!showQR);
//   };

//   return (
//     <div className="flex flex-col items-center gap-8 p-4">
//       {/* Front Side */}
//       <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
//         Front Side
//       </div>
//       <div className="relative w-[600px] h-[350px] bg-white shadow-2xl overflow-hidden">
//         {/* Background Pattern */}
//         <img
//           className="absolute top-0 left-0 w-full h-[70%] opacity-10 object-cover pointer-events-none"
//           alt="background pattern"
//           src="https://storage.googleapis.com/banani-generated-images/generated-images/f50fc565-cb55-4fc4-b8e7-d1415ec9783b.jpg"
//         />

//         {/* Logo and Company Info */}
//         <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
//           <div className="mb-8 flex flex-col items-center">
//             <div className="w-16 h-16 flex items-center justify-center mb-3">
//               <div className="text-6xl" style={{ color: colors.brandBlue }}>
//                 💎
//               </div>
//             </div>
//             <div
//               className="text-5xl font-extrabold uppercase tracking-wider leading-none mb-2"
//               style={{
//                 color: colors.accentColor,
//                 fontFamily: '"Arial Narrow", sans-serif',
//               }}
//             >
//               {data.company}
//             </div>
//             <div className="text-sm font-semibold tracking-widest uppercase text-gray-900">
//               {data.slogan}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div
//           className="absolute bottom-0 left-0 w-full h-16"
//           style={{ backgroundColor: colors.brandDark }}
//         >
//           <div className="h-full flex items-center pl-10 text-white text-base tracking-wide z-20 relative">
//             {data.website}
//           </div>
//           <div
//             className="absolute bottom-0 right-[25%] w-16 h-16 bg-white -skew-x-45 z-30"
//             style={{ borderRight: `15px solid ${colors.brandBlue}` }}
//           ></div>
//           <div
//             className="absolute bottom-0 right-[30%] w-10 h-16 -skew-x-45 z-40"
//             style={{ backgroundColor: colors.brandBlue }}
//           ></div>
//         </div>
//       </div>

//       <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
//         Back Side
//       </div>
//       {/* Back Side */}
//       <div className="relative w-[600px] h-[350px] bg-white shadow-2xl overflow-hidden">
//         {/* Top Left Header */}
//         <div
//           className="absolute top-0 left-0 w-[55%] h-24"
//           style={{
//             backgroundColor: colors.brandBlue,
//             clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
//           }}
//         >
//           <div className="p-6 pl-8">
//             <h2 className="text-white text-2xl font-extrabold uppercase leading-tight">
//               {data.name.split(" ")[0]}{" "}
//               <span className="font-normal opacity-90">
//                 {data.name.split(" ").slice(1).join(" ")}
//               </span>
//             </h2>
//             <div className="text-white text-sm opacity-90 mt-1">
//               {data.title}
//             </div>
//           </div>
//         </div>

//         {/* QR Code Section */}
//         {showQR && (
//           <div
//             className="absolute top-6 right-8 p-1 border-2 bg-white z-50 group"
//             style={{ borderColor: colors.brandBlue }}
//           >
//             <div className="w-30 h-30 flex items-center justify-center relative">
//               {qrCodeImage ? (
//                 <>
//                   <img
//                     src={qrCodeImage}
//                     alt="QR Code"
//                     className="w-full h-full object-contain"
//                   />
//                   {/* Remove button overlay */}
//                   <button
//                     onClick={handleRemoveQr}
//                     className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                     title="Remove QR Code"
//                   >
//                     <X size={12} className="text-white" />
//                   </button>
//                 </>
//               ) : (
//                 <div className="flex flex-col items-center justify-center">
//                   <QrCode size={32} className="text-gray-400" />
//                   <span className="text-[10px] text-gray-500 mt-1">
//                     QR Code
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Contact Info */}
//         <div className="absolute top-32 left-8 flex flex-col gap-4">
//           {/* Address */}
//           <div className="flex items-center gap-3">
//             <div
//               className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm"
//               style={{ backgroundColor: colors.brandBlue }}
//             >
//               📍
//             </div>
//             <div className="flex flex-col">
//               {addressLines.map((line, index) => (
//                 <span
//                   key={index}
//                   className="text-xs text-gray-700 leading-tight"
//                 >
//                   {line}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Email & Website */}
//           <div className="flex items-center gap-3">
//             <div
//               className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm"
//               style={{ backgroundColor: colors.brandBlue }}
//             >
//               ✉️
//             </div>
//             <div className="flex flex-col">
//               <span className="text-xs text-gray-700 leading-tight">
//                 {data.email}
//               </span>
//               <span className="text-xs text-gray-700 leading-tight">
//                 {data.website}
//               </span>
//             </div>
//           </div>

//           {/* Phone */}
//           <div className="flex items-center gap-3">
//             <div
//               className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm"
//               style={{ backgroundColor: colors.brandBlue }}
//             >
//               📞
//             </div>
//             <div className="flex flex-col">
//               <span className="text-xs text-gray-700 leading-tight">
//                 {data.phone}
//               </span>
//               <span className="text-xs text-gray-700 leading-tight">
//                 {data.phone}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Right Footer */}
//         <div
//           className="absolute bottom-0 right-0 w-[60%] h-28"
//           style={{
//             backgroundColor: colors.brandDark,
//             clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)",
//           }}
//         >
//           <div className="h-full flex items-center justify-end pr-10">
//             <div className="flex flex-col items-center z-50">
//               <div className="w-8 h-8 flex items-center justify-center mb-1">
//                 <div style={{ color: colors.brandBlue, fontSize: "32px" }}>
//                   💎
//                 </div>
//               </div>
//               <div
//                 className="text-2xl font-extrabold uppercase tracking-wider leading-none mb-1"
//                 style={{ color: colors.brandBlue }}
//               >
//                 {data.company}
//               </div>
//               <div className="text-white text-xs tracking-widest uppercase">
//                 {data.slogan}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Accent Shape */}
//         <div
//           className="absolute bottom-0 right-[45%] w-24 h-28 z-40"
//           style={{
//             backgroundColor: colors.brandBlue,
//             clipPath: "polygon(40% 0, 100% 0, 60% 100%, 0% 100%)",
//           }}
//         ></div>
//       </div>

//       {/* QR Code Controls */}
//       <div className="flex flex-col items-center gap-4 mt-4">
//         <div className="flex items-center gap-4">
//           {/* Upload QR Code Button */}
//           <label className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer flex items-center gap-2 transition-colors">
//             <Upload size={16} />
//             Upload QR Code
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleQrUpload}
//               className="hidden"
//             />
//           </label>

//           {/* Toggle QR Code */}
//           <button
//             onClick={handleToggleQR}
//             className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
//               showQR
//                 ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 : "bg-green-100 text-green-700 hover:bg-green-200"
//             }`}
//           >
//             <QrCode size={16} />
//             {showQR ? "Hide QR Code" : "Show QR Code"}
//           </button>

//           {/* Remove QR Code */}
//           {qrCodeImage && (
//             <button
//               onClick={handleRemoveQr}
//               className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 flex items-center gap-2 transition-colors"
//             >
//               <X size={16} />
//               Remove QR
//             </button>
//           )}
//         </div>

//         <p className="text-sm text-gray-500 text-center max-w-md">
//           Upload a QR code image (PNG, JPG, SVG up to 2MB). The QR code will
//           appear in the top-right corner of the back side.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Card1;

"use client";

import React, { useState, useRef } from "react";
import { Upload, X, QrCode, Image as ImageIcon } from "lucide-react";

const Card1 = ({
  formData = {},
  template = null,
  customColors = {
    brandBlue: "#4dabf5",
    brandDark: "#1e293b",
    accentColor: "#2c7bb6",
  },
}) => {
  // Default data with fallbacks
  const data = {
    name: "Aryan Nandanwar",
    title: "Full Stack Developer",
    company: "ArN Studio",
    email: "aryanemail@.com",
    phone1: "8780XXXXXX",
    phone2: "975633XXXX",
    website: "www.aryanstudio.com",
    address: "Street Address Here\nCity Name Here-1234",
    slogan: "Your Slogan Here",
    ...formData,
  };

  // State for QR code
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [showQR, setShowQR] = useState(true);
  const qrFileInputRef = useRef(null);

  // State for logo
  const [companyLogo, setCompanyLogo] = useState(null);
  const logoFileInputRef = useRef(null);

  // Split address into lines
  const addressLines = data.address.split("\n");

  // Base template colors, overridden by customColors when provided
  const colors = {
    brandBlue: template?.color || "#4dabf5",
    brandDark: "#1e293b",
    accentColor: template?.color || "#2c7bb6",
    ...customColors,
  };

  // Handle QR code upload
  const handleQrUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        alert("File size should be less than 2MB");
        return;
      }

      if (!file.type.match("image.*")) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setQrCodeImage(e.target.result);
        setShowQR(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle QR code removal
  const handleRemoveQr = () => {
    setQrCodeImage(null);
    setShowQR(false);
    if (qrFileInputRef.current) {
      qrFileInputRef.current.value = "";
    }
  };

  // Handle QR code toggle
  const handleToggleQR = () => {
    setShowQR(!showQR);
  };

  // Handle logo upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Logo size should be less than 5MB");
        return;
      }

      if (!file.type.match("image.*")) {
        alert("Please upload an image file (PNG, JPG, SVG)");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo removal
  const handleRemoveLogo = () => {
    setCompanyLogo(null);
    if (logoFileInputRef.current) {
      logoFileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      {/* Front Side */}
      <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
        Front Side
      </div>
      <div className="relative w-[600px] h-[350px] bg-white shadow-2xl overflow-hidden">
        {/* Background Pattern */}
        <img
          className="absolute top-0 left-0 w-full h-[70%] opacity-10 object-cover pointer-events-none"
          alt="background pattern"
          src="https://storage.googleapis.com/banani-generated-images/generated-images/f50fc565-cb55-4fc4-b8e7-d1415ec9783b.jpg"
        />

        {/* Logo and Company Info - Now with uploadable logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="mb-8 flex flex-col items-center">
            {/* Logo Container - Uploadable */}
            <div className="w-20 h-20 flex items-center justify-center mb-4 relative">
              {companyLogo ? (
                <div className="relative group">
                  <img
                    src={companyLogo}
                    alt="Company Logo"
                    className="w-20 h-20 object-contain"
                  />
                  {/* Remove button overlay */}
                  <button
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Remove Logo"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ) : (
                <div
                  className="w-20 h-20 rounded-lg flex flex-col items-center justify-center border-2 border-dashed cursor-pointer hover:bg-blue-50 transition-colors"
                  style={{ borderColor: colors.brandBlue }}
                  onClick={() => logoFileInputRef.current?.click()}
                  title="Click to upload logo"
                >
                  <ImageIcon size={32} style={{ color: colors.brandBlue }} />
                  <span className="text-xs mt-1 text-slate-500">Add Logo</span>
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Company Name and Slogan */}
            <div
              className="text-5xl font-extrabold uppercase tracking-wider leading-none mb-2"
              style={{
                color: colors.accentColor,
                fontFamily: '"Arial Narrow", sans-serif',
              }}
            >
              {data.company}
            </div>
            <div className="text-sm font-semibold tracking-widest uppercase text-gray-900">
              {data.slogan}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="absolute bottom-0 left-0 w-full h-16"
          style={{ backgroundColor: colors.brandDark }}
        >
          <div className="h-full flex items-center pl-10 text-white text-base tracking-wide z-20 relative">
            {data.website}
          </div>
          <div
            className="absolute bottom-0 right-[25%] w-16 h-16 bg-white -skew-x-45 z-30"
            style={{ borderRight: `15px solid ${colors.brandBlue}` }}
          ></div>
          <div
            className="absolute bottom-0 right-[30%] w-10 h-16 -skew-x-45 z-40"
            style={{ backgroundColor: colors.brandBlue }}
          ></div>
        </div>
      </div>

      <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
        Back Side
      </div>
      {/* Back Side */}
      <div className="relative w-[600px] h-[350px] bg-white shadow-2xl overflow-hidden">
        {/* Top Left Header */}
        <div
          className="absolute top-0 left-0 w-[55%] h-24"
          style={{
            backgroundColor: colors.brandBlue,
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
          }}
        >
          <div className="p-6 pl-8">
            <h2 className="text-white text-2xl font-extrabold uppercase leading-tight">
              {data.name.split(" ")[0]}{" "}
              <span className="font-normal opacity-90">
                {data.name.split(" ").slice(1).join(" ")}
              </span>
            </h2>
            <div className="text-white text-sm opacity-90 mt-1">
              {data.title}
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        {showQR && (
          <div
            className="absolute top-6 right-8 p-1 border-2 bg-white z-50 group"
            style={{ borderColor: colors.brandBlue }}
          >
            <div className="w-30 h-30 flex items-center justify-center relative">
              {qrCodeImage ? (
                <div className="relative group">
                  <img
                    src={qrCodeImage}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                  {/* Remove button overlay */}
                  <button
                    onClick={handleRemoveQr}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Remove QR Code"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ) : (
                <div
                  className="w-30 h-30 rounded-lg flex flex-col items-center justify-center border-2 border-dashed cursor-pointer hover:bg-blue-50 transition-colors"
                  style={{ borderColor: colors.brandBlue }}
                  onClick={() => qrFileInputRef.current?.click()}
                  title="Click to upload QR code"
                >
                  <QrCode size={32} style={{ color: colors.brandBlue }} />
                  <span className="text-xs mt-1 text-slate-500">
                    Add QR Code
                  </span>
                  <input
                    ref={qrFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleQrUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="absolute top-32 left-8 flex flex-col gap-4">
          {/* Address */}
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: colors.brandBlue }}
            >
              📍
            </div>
            <div className="flex flex-col">
              {addressLines.map((line, index) => (
                <span
                  key={index}
                  className="text-xs text-gray-700 leading-tight"
                >
                  {line}
                </span>
              ))}
            </div>
          </div>

          {/* Email & Website */}
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: colors.brandBlue }}
            >
              ✉️
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-700 leading-tight">
                {data.email}
              </span>
              <span className="text-xs text-gray-700 leading-tight">
                {data.website}
              </span>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: colors.brandBlue }}
            >
              📞
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-700 leading-tight">
                {data.phone1}
              </span>
              <span className="text-xs text-gray-700 leading-tight">
                {data.phone2}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Right Footer - Also shows logo if uploaded */}
        <div
          className="absolute bottom-0 right-0 w-[60%] h-28"
          style={{
            backgroundColor: colors.brandDark,
            clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        >
          <div className="h-full flex items-center justify-end pr-10">
            <div className="flex flex-col items-center z-50">
              {/* Small logo in footer - Shows uploaded logo or diamond */}
              <div className="w-8 h-8 flex items-center justify-center mb-1">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt="Company Logo"
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <div style={{ color: colors.brandBlue, fontSize: "24px" }}>
                    💎
                  </div>
                )}
              </div>
              <div
                className="text-2xl font-extrabold uppercase tracking-wider leading-none mb-1"
                style={{ color: colors.brandBlue }}
              >
                {data.company}
              </div>
              <div className="text-white text-xs tracking-widest uppercase">
                {data.slogan}
              </div>
            </div>
          </div>
        </div>

        {/* Accent Shape */}
        <div
          className="absolute bottom-0 right-[45%] w-24 h-28 z-40"
          style={{
            backgroundColor: colors.brandBlue,
            clipPath: "polygon(40% 0, 100% 0, 60% 100%, 0% 100%)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Card1;
