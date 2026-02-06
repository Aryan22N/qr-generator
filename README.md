🔗 Smart Client QR Generator

A modern, dynamic QR code generator that creates editable, cloud-backed client profiles.
Each QR code links to a live URL, allowing client details to be updated without regenerating the QR.

Built using Next.js + Supabase, this project follows real-world QR architecture used in production systems.

🚀 Live Demo

👉 https://qr-generator-lime-ten.vercel.app

✨ Features

📇 Dynamic QR Codes
QR codes point to a URL, not static data.

✏️ Editable Client Profiles
Update client info anytime using a private edit link.

🔐 Secure Edit Access (No Login Required)
Editing is protected via a unique editKey.

🧩 Custom Fields Support
Add unlimited custom fields (designation, website, address, etc.).

🌍 Cross-Device Support
QR works on mobile, desktop, and any browser.

☁️ Supabase Backend
Data stored securely in PostgreSQL with Row Level Security (RLS).

🚀 Production Ready
Deployed on Vercel, scalable and real-world ready.

🔑 Security Model

UUID-based client IDs (unguessable)

Secret editKey required for updates

No authentication required

Supabase RLS enabled

App-level ownership validation

🧪 Testing Checklist

✅ Generate QR

✅ Open QR in incognito

✅ Scan QR on mobile

✅ Edit data using private link

✅ Refresh page → data persists

🎯 Use Cases

Digital visiting cards

Business contact sharing

Event profile check-ins

Freelancer portfolios

Product or service info QR
