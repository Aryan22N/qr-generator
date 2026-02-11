import React from "react";

const Footer = () => {
  return (
    <div>
      {" "}
      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              QR
            </div>
            <span className="text-xl font-bold text-gray-900">
              QR Generator
            </span>
          </div>
          <p className="text-gray-500 font-medium">
            © {new Date().getFullYear()} QR Generator System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
