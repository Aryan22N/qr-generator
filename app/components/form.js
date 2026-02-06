"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  validateOrderForm,
  getInitialFormState,
  FORM_OPTIONS,
} from "../lib/form";
import {
  Calendar,
  User,
  Package,
  DollarSign,
  FileText,
  Ruler,
  Layers,
  Palette,
  Printer,
  Scissors,
  BookOpen,
  Mail,
  Tag,
  Shield,
  Truck,
  Box,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Percent,
  Users,
  Settings,
  FileType,
  Image as ImageIcon,
  Grid,
  Type,
  CornerRightDown,
  Package as PackageIcon,
  Archive,
} from "lucide-react";

/* ---------------- Local Button Component ---------------- */
const Button = ({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300 border border-slate-300",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

/* ---------------- Input Components ---------------- */
const InputField = ({
  label,
  icon: Icon,
  error,
  children,
  required = false,
}) => (
  <div>
    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1.5">
      {Icon && <Icon size={16} className="text-blue-600" />} {label}{" "}
      {required && "*"}
    </label>
    {children}
    {error && (
      <p className="text-xs font-medium text-red-600 mt-1.5 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const SelectField = ({
  value,
  onChange,
  options,
  placeholder,
  error,
  ...props
}) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full p-3 border rounded-lg bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
      error ? "border-red-500 bg-red-50" : "border-slate-300"
    }`}
    {...props}
  >
    <option value="" className="text-slate-400">
      {placeholder}
    </option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const TextInput = ({
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  ...props
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className={`w-full p-3 border rounded-lg bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 ${
      error ? "border-red-500 bg-red-50" : "border-slate-300"
    }`}
    placeholder={placeholder}
    {...props}
  />
);

const TextArea = ({
  value,
  onChange,
  placeholder,
  error,
  rows = 3,
  ...props
}) => (
  <textarea
    value={value}
    onChange={onChange}
    rows={rows}
    className={`w-full p-3 border rounded-lg bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 ${
      error ? "border-red-500 bg-red-50" : "border-slate-300"
    }`}
    placeholder={placeholder}
    {...props}
  />
);

const Checkbox = ({ checked, onChange, label, ...props }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
      {...props}
    />
    <span className="text-sm text-slate-700">{label}</span>
  </label>
);

/* ---------------- Form Section Component ---------------- */
const FormSection = ({ title, icon: Icon, children }) => (
  <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
      {Icon && <Icon size={20} className="text-blue-600" />}
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

/* ---------------- Main Form Component ---------------- */
export default function NewOrderForm({
  productType = "",
  customers = [],
  employees = [],
}) {
  const router = useRouter();

  // Initialize form state
  const initialData = getInitialFormState(productType);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [commonData, setCommonData] = useState(initialData.commonData);
  const [detailsData, setDetailsData] = useState(initialData.detailsData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate amounts when quantity or unit price changes
  useEffect(() => {
    const quantity = parseFloat(commonData.quantity) || 0;
    const unitPrice = parseFloat(commonData.unitPrice) || 0;
    const discount = parseFloat(commonData.discount) || 0;
    const tax = parseFloat(commonData.tax) || 0;

    const subtotal = quantity * unitPrice;
    const discountAmount = (subtotal * discount) / 100;
    const amountAfterDiscount = subtotal - discountAmount;
    const taxAmount = (amountAfterDiscount * tax) / 100;
    const finalAmount = amountAfterDiscount + taxAmount;

    const advanceAmount = parseFloat(commonData.advanceAmount) || 0;
    const balanceAmount = finalAmount - advanceAmount;

    setCommonData((prev) => ({
      ...prev,
      totalAmount: subtotal.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      balanceAmount: balanceAmount.toFixed(2),
    }));
  }, [
    commonData.quantity,
    commonData.unitPrice,
    commonData.discount,
    commonData.tax,
    commonData.advanceAmount,
  ]);

  /* ---------------- Handlers ---------------- */
  const handleCommonChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCommonData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDetailsData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateOrderForm({
      commonData,
      selectedCustomerId,
      productType,
      detailsData,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstError = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstError}"]`)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1500));
      console.log("Form submitted:", {
        selectedCustomerId,
        productType,
        commonData,
        detailsData,
      });

      // Success - navigate back
      router.back();
    } catch (error) {
      setErrors({ form: "Something went wrong. Please try again." });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- Render Product Specific Fields ---------------- */
  const renderProductSpecificFields = () => {
    switch (productType) {
      case "brochures":
        return (
          <FormSection title="Brochure Specifications" icon={BookOpen}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Finished Size"
                icon={Ruler}
                error={errors.finishedSize}
                required
              >
                <TextInput
                  name="finishedSize"
                  value={detailsData.finishedSize}
                  onChange={handleDetailsChange}
                  placeholder="e.g., A4 (210×297mm)"
                />
              </InputField>

              <InputField
                label="Open Size"
                icon={Grid}
                error={errors.openSize}
                required
              >
                <TextInput
                  name="openSize"
                  value={detailsData.openSize}
                  onChange={handleDetailsChange}
                  placeholder="e.g., A3 (420×297mm)"
                />
              </InputField>

              <InputField
                label="Folding Type"
                icon={CornerRightDown}
                error={errors.folding}
                required
              >
                <SelectField
                  value={detailsData.folding}
                  onChange={handleDetailsChange}
                  name="folding"
                  options={[
                    { value: "half", label: "Half Fold" },
                    { value: "tri", label: "Tri-Fold" },
                    { value: "z", label: "Z-Fold" },
                    { value: "gate", label: "Gate Fold" },
                    { value: "none", label: "No Fold" },
                  ]}
                  placeholder="Select folding type"
                />
              </InputField>

              <InputField
                label="Binding Type"
                icon={Archive}
                error={errors.binding}
                required
              >
                <SelectField
                  value={detailsData.binding}
                  onChange={handleDetailsChange}
                  name="binding"
                  options={FORM_OPTIONS.binding}
                  placeholder="Select binding type"
                />
              </InputField>
            </div>
          </FormSection>
        );

      case "visiting-cards":
        return (
          <FormSection title="Visiting Card Specifications" icon={Tag}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Card Size"
                icon={Ruler}
                error={errors.cardSize}
                required
              >
                <SelectField
                  value={detailsData.cardSize}
                  onChange={handleDetailsChange}
                  name="cardSize"
                  options={[
                    { value: "standard", label: "Standard (3.5×2 in)" },
                    { value: "square", label: "Square (2×2 in)" },
                    { value: "rounded", label: "Rounded Corners" },
                    { value: "custom", label: "Custom Size" },
                  ]}
                  placeholder="Select card size"
                />
              </InputField>

              <InputField
                label="Corner Style"
                icon={Type}
                error={errors.corner}
                required
              >
                <SelectField
                  value={detailsData.corner}
                  onChange={handleDetailsChange}
                  name="corner"
                  options={[
                    { value: "square", label: "Square Corners" },
                    { value: "rounded", label: "Rounded Corners" },
                    { value: "die-cut", label: "Die-Cut Shape" },
                  ]}
                  placeholder="Select corner style"
                />
              </InputField>

              <InputField
                label="Design Type"
                icon={ImageIcon}
                error={errors.designType}
                required
              >
                <SelectField
                  value={detailsData.designType}
                  onChange={handleDetailsChange}
                  name="designType"
                  options={[
                    { value: "provided", label: "Customer Provided" },
                    { value: "design", label: "Need Design" },
                    { value: "modify", label: "Modify Existing" },
                  ]}
                  placeholder="Select design type"
                />
              </InputField>

              <InputField
                label="Special Finishing"
                icon={Shield}
                error={errors.finishing}
              >
                <SelectField
                  value={detailsData.finishing}
                  onChange={handleDetailsChange}
                  name="finishing"
                  options={[
                    { value: "none", label: "No Special Finish" },
                    { value: "foil", label: "Foil Stamping" },
                    { value: "emboss", label: "Embossing" },
                    { value: "spot", label: "Spot UV" },
                    { value: "texture", label: "Texture Finish" },
                  ]}
                  placeholder="Select finishing"
                />
              </InputField>
            </div>
          </FormSection>
        );

      // Add more product types as needed...
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Order & Customer Information Section */}
        <FormSection title="Order & Customer Information" icon={Package}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Customer"
              icon={User}
              error={errors.customer}
              required
            >
              <SelectField
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                options={customers.map((c) => ({
                  value: c.id,
                  label: `${c.name} (${c.mobile})`,
                }))}
                placeholder="Select customer..."
              />
            </InputField>

            <InputField
              label="Priority"
              icon={Clock}
              error={errors.priority}
              required
            >
              <SelectField
                value={commonData.priority}
                onChange={handleCommonChange}
                name="priority"
                options={FORM_OPTIONS.priority}
                placeholder="Select priority"
              />
            </InputField>

            <InputField
              label="Order Date"
              icon={Calendar}
              error={errors.orderDate}
              required
            >
              <TextInput
                type="date"
                name="orderDate"
                value={commonData.orderDate}
                onChange={handleCommonChange}
              />
            </InputField>

            <InputField
              label="Delivery Date"
              icon={Truck}
              error={errors.deliveryDate}
              required
            >
              <TextInput
                type="date"
                name="deliveryDate"
                value={commonData.deliveryDate}
                onChange={handleCommonChange}
              />
            </InputField>

            <InputField
              label="Order Status"
              icon={CheckCircle}
              error={errors.orderStatus}
              required
            >
              <SelectField
                value={commonData.orderStatus}
                onChange={handleCommonChange}
                name="orderStatus"
                options={FORM_OPTIONS.orderStatus}
                placeholder="Select order status"
              />
            </InputField>

            <InputField label="Assigned To" icon={Users}>
              <SelectField
                value={commonData.assignedTo}
                onChange={handleCommonChange}
                name="assignedTo"
                options={employees.map((e) => ({ value: e.id, label: e.name }))}
                placeholder="Assign to employee"
              />
            </InputField>
          </div>
        </FormSection>

        {/* Quantity & Pricing Section */}
        <FormSection title="Quantity & Pricing" icon={DollarSign}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InputField
              label="Quantity"
              icon={Package}
              error={errors.quantity}
              required
            >
              <TextInput
                type="number"
                name="quantity"
                value={commonData.quantity}
                onChange={handleCommonChange}
                placeholder="Enter quantity"
                min="1"
              />
            </InputField>

            <InputField
              label="Unit Price (₹)"
              icon={Tag}
              error={errors.unitPrice}
              required
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold pointer-events-none">
                  ₹
                </span>
                <TextInput
                  type="number"
                  name="unitPrice"
                  value={commonData.unitPrice}
                  onChange={handleCommonChange}
                  className="pl-8 text-gray-600 w-50 h-10 border-gray-800"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </InputField>

            <InputField label="Discount (%)" icon={Percent}>
              <TextInput
                type="number"
                name="discount"
                value={commonData.discount}
                onChange={handleCommonChange}
                placeholder="0"
                max="100"
              />
            </InputField>

            <InputField label="Tax (%)" icon={Percent}>
              <TextInput
                type="number"
                name="tax"
                value={commonData.tax}
                onChange={handleCommonChange}
                placeholder="0"
                min="0"
                max="100"
              />
            </InputField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Subtotal</div>
              <div className="text-xl font-bold text-slate-900">
                ₹{commonData.totalAmount || "0.00"}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Final Amount</div>
              <div className="text-xl font-bold text-blue-700">
                ₹{commonData.finalAmount || "0.00"}
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="text-sm text-emerald-600 mb-1">Balance Due</div>
              <div className="text-xl font-bold text-emerald-700">
                ₹{commonData.balanceAmount || "0.00"}
              </div>
            </div>
          </div>
        </FormSection>

        {/* Payment Information Section */}
        <FormSection title="Payment Information" icon={CreditCard}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Payment Method"
              icon={CreditCard}
              error={errors.paymentMethod}
            >
              <SelectField
                value={commonData.paymentMethod}
                onChange={handleCommonChange}
                name="paymentMethod"
                options={FORM_OPTIONS.paymentMethod}
                placeholder="Select payment method"
              />
            </InputField>

            <InputField
              label="Payment Status"
              icon={CheckCircle}
              error={errors.paymentStatus}
              required
            >
              <SelectField
                value={commonData.paymentStatus}
                onChange={handleCommonChange}
                name="paymentStatus"
                options={FORM_OPTIONS.paymentStatus}
                placeholder="Select payment status"
              />
            </InputField>

            {commonData.paymentStatus === "partial" && (
              <>
                <InputField
                  label="Advance Amount (₹)"
                  icon={DollarSign}
                  error={errors.advanceAmount}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold pointer-events-none">
                      ₹
                    </span>
                    <TextInput
                      type="number"
                      name="advanceAmount"
                      value={commonData.advanceAmount}
                      onChange={handleCommonChange}
                      className="pl-8"
                      placeholder="Advance amount"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </InputField>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="text-sm text-amber-700 mb-1">
                    Payment Summary
                  </div>
                  <div className="text-lg font-bold text-amber-800">
                    Advance: ₹{commonData.advanceAmount || "0.00"} | Balance: ₹
                    {commonData.balanceAmount || "0.00"}
                  </div>
                </div>
              </>
            )}
          </div>
        </FormSection>

        {/* Production Details Section */}
        <FormSection title="Production Details" icon={Settings}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Design Status"
              icon={ImageIcon}
              error={errors.designStatus}
              required
            >
              <SelectField
                value={commonData.designStatus}
                onChange={handleCommonChange}
                name="designStatus"
                options={FORM_OPTIONS.designStatus}
                placeholder="Select design status"
              />
            </InputField>

            <InputField
              label="File Status"
              icon={FileType}
              error={errors.fileStatus}
              required
            >
              <SelectField
                value={commonData.fileStatus}
                onChange={handleCommonChange}
                name="fileStatus"
                options={FORM_OPTIONS.fileStatus}
                placeholder="Select file status"
              />
            </InputField>

            <InputField
              label="Production Stage"
              icon={Printer}
              error={errors.productionStage}
              required
            >
              <SelectField
                value={commonData.productionStage}
                onChange={handleCommonChange}
                name="productionStage"
                options={FORM_OPTIONS.productionStage}
                placeholder="Select production stage"
              />
            </InputField>

            <InputField label="Proof Required" icon={FileText}>
              <Checkbox
                checked={detailsData.proofRequired}
                onChange={handleDetailsChange}
                name="proofRequired"
                label="Yes, send proof before printing"
              />
            </InputField>
          </div>
        </FormSection>

        {/* Product Specific Fields */}
        {renderProductSpecificFields()}

        {/* Printing Specifications Section */}
        <FormSection title="Printing Specifications" icon={Printer}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Paper Type" icon={Layers}>
              <SelectField
                value={detailsData.paperType}
                onChange={handleDetailsChange}
                name="paperType"
                options={FORM_OPTIONS.paperType}
                placeholder="Select paper type"
              />
            </InputField>

            <InputField label="Paper GSM" icon={Layers}>
              <TextInput
                type="number"
                name="paperGsm"
                value={detailsData.paperGsm}
                onChange={handleDetailsChange}
                placeholder="e.g., 150, 200, 300"
                min="50"
              />
            </InputField>

            <InputField label="Print Sides" icon={Printer}>
              <SelectField
                value={detailsData.printSides}
                onChange={handleDetailsChange}
                name="printSides"
                options={FORM_OPTIONS.printSides}
                placeholder="Select print sides"
              />
            </InputField>

            <InputField label="Color Mode" icon={Palette}>
              <SelectField
                value={detailsData.colorMode}
                onChange={handleDetailsChange}
                name="colorMode"
                options={FORM_OPTIONS.colorMode}
                placeholder="Select color mode"
              />
            </InputField>

            <InputField label="Coating" icon={Shield}>
              <SelectField
                value={detailsData.coating}
                onChange={handleDetailsChange}
                name="coating"
                options={FORM_OPTIONS.coating}
                placeholder="Select coating type"
              />
            </InputField>

            <InputField label="Bleed" icon={Scissors}>
              <SelectField
                value={detailsData.bleed}
                onChange={handleDetailsChange}
                name="bleed"
                options={[
                  { value: "0mm", label: "No Bleed" },
                  { value: "3mm", label: "3mm Bleed" },
                  { value: "5mm", label: "5mm Bleed" },
                ]}
                placeholder="Select bleed"
              />
            </InputField>
          </div>
        </FormSection>

        {/* Delivery & Notes Section */}
        <FormSection title="Delivery & Additional Notes" icon={Truck}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Packaging Type" icon={PackageIcon}>
              <SelectField
                value={commonData.packagingType}
                onChange={handleCommonChange}
                name="packagingType"
                options={[
                  { value: "box", label: "Box" },
                  { value: "packet", label: "Packet" },
                  { value: "bundle", label: "Bundle" },
                  { value: "loose", label: "Loose Sheets" },
                ]}
                placeholder="Select packaging"
              />
            </InputField>

            <InputField label="Delivery Method" icon={Truck}>
              <SelectField
                value={commonData.deliveryMethod}
                onChange={handleCommonChange}
                name="deliveryMethod"
                options={[
                  { value: "pickup", label: "Customer Pickup" },
                  { value: "courier", label: "Courier" },
                  { value: "delivery", label: "Our Delivery" },
                ]}
                placeholder="Select delivery method"
              />
            </InputField>
          </div>

          <InputField label="Job Notes" icon={FileText}>
            <TextArea
              name="notes"
              value={commonData.notes}
              onChange={handleCommonChange}
              placeholder="Enter any special instructions, requirements, or notes..."
              rows={4}
            />
          </InputField>
        </FormSection>

        {/* Form Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 rounded-b-xl -mx-6 -mb-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600">
              {errors.form && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={16} />
                  {errors.form}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Order...
                  </span>
                ) : (
                  "Create Order"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { validateOrderForm } from "../lib/form";
// import {
//   Calendar,
//   User,
//   Package,
//   DollarSign,
//   FileText,
//   Ruler,
// } from "lucide-react";

// /* ---------------- Local Button Component ---------------- */
// const Button = ({
//   children,
//   type = "button",
//   variant = "primary",
//   disabled = false,
//   onClick,
// }) => {
//   const base =
//     "inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm";

//   const variants = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
//     secondary:
//       "bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300 border border-slate-300",
//   };

//   return (
//     <button
//       type={type}
//       disabled={disabled}
//       onClick={onClick}
//       className={`${base} ${variants[variant]}`}
//     >
//       {children}
//     </button>
//   );
// };

// /* ---------------- Form Component ---------------- */
// export default function NewOrderForm({ productType = "", customers = [] }) {
//   const router = useRouter();

//   const [selectedCustomerId, setSelectedCustomerId] = useState("");
//   const [commonData, setCommonData] = useState({
//     quantity: "",
//     totalAmount: "",
//     dueDate: "",
//     jobNotes: "",
//   });

//   const [detailsData, setDetailsData] = useState({
//     finishedSize: "",
//     openSize: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   /* ---------------- Handlers ---------------- */
//   const handleCommonChange = (e) => {
//     const { name, value } = e.target;
//     setCommonData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setDetailsData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validateOrderForm({
//       commonData,
//       selectedCustomerId,
//       productType,
//       detailsData,
//     });

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await new Promise((r) => setTimeout(r, 1200));
//       router.back();
//     } catch {
//       setErrors({ form: "Something went wrong. Please try again." });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Common Input Styling for Reusability
//   const inputClasses = (hasError) => `
//     w-full p-3 border rounded-lg bg-white text-slate-900 text-sm ring-offset-white
//     placeholder:text-slate-400
//     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
//     transition-all
//     ${hasError ? "border-red-500 bg-red-50" : "border-slate-300"}
//   `;

//   const labelClasses =
//     "text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1.5";

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm"
//       >
//         {/* Customer */}
//         <div>
//           <label className={labelClasses}>
//             <User size={16} className="text-blue-600" /> Customer *
//           </label>
//           <select
//             value={selectedCustomerId}
//             onChange={(e) => setSelectedCustomerId(e.target.value)}
//             className={inputClasses(errors.customer)}
//           >
//             <option value="" className="text-slate-400">
//               Select customer...
//             </option>
//             {customers.map((c) => (
//               <option key={c.id} value={c.id} className="text-slate-900">
//                 {c.name} ({c.mobile})
//               </option>
//             ))}
//           </select>
//           {errors.customer && (
//             <p className="text-xs font-medium text-red-600 mt-1.5">
//               {errors.customer}
//             </p>
//           )}
//         </div>

//         {/* Quantity & Amount */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className={labelClasses}>
//               <Package size={16} className="text-blue-600" /> Quantity *
//             </label>
//             <input
//               type="number"
//               name="quantity"
//               value={commonData.quantity}
//               onChange={handleCommonChange}
//               className={inputClasses(errors.quantity)}
//               placeholder="Enter quantity"
//             />
//           </div>

//           <div>
//             <label className={labelClasses}>
//               <DollarSign size={16} className="text-blue-600" /> Total Amount *
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold pointer-events-none">
//                 ₹
//               </span>
//               <input
//                 type="number"
//                 name="totalAmount"
//                 value={commonData.totalAmount}
//                 onChange={handleCommonChange}
//                 className={`${inputClasses(errors.totalAmount)} pl-8`}
//                 placeholder="0.00"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Due Date & Notes */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className={labelClasses}>
//               <Calendar size={16} className="text-blue-600" /> Due Date
//             </label>
//             <input
//               type="date"
//               name="dueDate"
//               value={commonData.dueDate}
//               onChange={handleCommonChange}
//               className={inputClasses(errors.dueDate)}
//             />
//           </div>

//           <div>
//             <label className={labelClasses}>
//               <FileText size={16} className="text-blue-600" /> Job Notes
//             </label>
//             <input
//               type="text"
//               name="jobNotes"
//               value={commonData.jobNotes}
//               onChange={handleCommonChange}
//               className={inputClasses()}
//               placeholder="Optional notes"
//             />
//           </div>
//         </div>

//         {/* Brochure Fields */}
//         {productType === "brochures" && (
//           <div className="pt-6 border-t border-slate-100">
//             <h3 className="text-slate-900 font-bold flex items-center gap-2 mb-4">
//               <Ruler size={18} className="text-blue-600" /> Brochure
//               Specifications
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <input
//                 name="finishedSize"
//                 value={detailsData.finishedSize}
//                 onChange={handleDetailsChange}
//                 placeholder="Finished Size (A4, A5)"
//                 className={inputClasses()}
//               />
//               <input
//                 name="openSize"
//                 value={detailsData.openSize}
//                 onChange={handleDetailsChange}
//                 placeholder="Open Size (420×297mm)"
//                 className={inputClasses()}
//               />
//             </div>
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
//           <Button
//             variant="secondary"
//             type="button"
//             onClick={() => router.back()}
//           >
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Creating..." : "Create Order"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
