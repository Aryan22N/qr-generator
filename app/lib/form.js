// export const validateOrderForm = ({
//   commonData,
//   selectedCustomerId,
//   productType,
//   detailsData,
// }) => {
//   const errors = {};

//   if (!selectedCustomerId) {
//     errors.customer = "Customer is required";
//   }

//   if (!commonData.quantity || commonData.quantity <= 0) {
//     errors.quantity = "Quantity must be greater than 0";
//   }

//   if (!commonData.totalAmount || commonData.totalAmount <= 0) {
//     errors.totalAmount = "Enter a valid total amount";
//   }

//   switch (productType) {
//     case "brochures":
//       if (!detailsData.finishedSize) {
//         errors.finishedSize = "Finished size is required";
//       }
//       if (!detailsData.openSize) {
//         errors.openSize = "Open size is required";
//       }
//       if (!detailsData.folding) {
//         errors.folding = "Folding option is required";
//       }
//       break;

//     case "visiting-cards":
//       if (!detailsData.paperGsm) {
//         errors.paperGsm = "Paper GSM is required";
//       }
//       break;
//   }

//   return errors;
// };
export const validateOrderForm = ({
  commonData,
  selectedCustomerId,
  productType,
  detailsData,
}) => {
  const errors = {};

  // Customer Information
  if (!selectedCustomerId) {
    errors.customer = "Customer is required";
  }

  // Basic Order Details
  if (!commonData.orderDate) {
    errors.orderDate = "Order date is required";
  }

  if (!commonData.deliveryDate) {
    errors.deliveryDate = "Delivery date is required";
  } else if (
    new Date(commonData.deliveryDate) < new Date(commonData.orderDate)
  ) {
    errors.deliveryDate = "Delivery date cannot be before order date";
  }

  if (!commonData.priority) {
    errors.priority = "Priority level is required";
  }

  if (!commonData.orderStatus) {
    errors.orderStatus = "Order status is required";
  }

  // Quantity & Pricing
  if (!commonData.quantity || commonData.quantity <= 0) {
    errors.quantity = "Quantity must be greater than 0";
  }

  if (!commonData.unitPrice || commonData.unitPrice <= 0) {
    errors.unitPrice = "Unit price must be greater than 0";
  }

  if (!commonData.totalAmount || commonData.totalAmount <= 0) {
    errors.totalAmount = "Enter a valid total amount";
  }

  // Payment Details
  if (!commonData.paymentStatus) {
    errors.paymentStatus = "Payment status is required";
  }

  if (
    commonData.paymentStatus === "partial" &&
    (!commonData.advanceAmount || commonData.advanceAmount <= 0)
  ) {
    errors.advanceAmount = "Advance amount is required for partial payment";
  }

  // Design & File Details
  if (!commonData.designStatus) {
    errors.designStatus = "Design status is required";
  }

  if (!commonData.fileStatus) {
    errors.fileStatus = "File status is required";
  }

  // Production Details
  if (!commonData.productionStage) {
    errors.productionStage = "Production stage is required";
  }

  // Product-specific validations
  switch (productType) {
    case "brochures":
      // Size & Dimensions
      if (!detailsData.finishedSize) {
        errors.finishedSize = "Finished size is required";
      }
      if (!detailsData.openSize) {
        errors.openSize = "Open size is required";
      }

      // Folding & Finishing
      if (!detailsData.folding) {
        errors.folding = "Folding option is required";
      }
      if (!detailsData.binding) {
        errors.binding = "Binding type is required";
      }

      // Paper Specifications
      if (!detailsData.paperType) {
        errors.paperType = "Paper type is required";
      }
      if (!detailsData.paperGsm) {
        errors.paperGsm = "Paper GSM is required";
      }
      if (!detailsData.coating) {
        errors.coating = "Coating type is required";
      }

      // Printing Details
      if (!detailsData.printSides) {
        errors.printSides = "Print sides selection is required";
      }
      if (!detailsData.colorMode) {
        errors.colorMode = "Color mode is required";
      }
      if (!detailsData.bleed) {
        errors.bleed = "Bleed specification is required";
      }
      break;

    case "visiting-cards":
      // Card Specifications
      if (!detailsData.cardSize) {
        errors.cardSize = "Card size is required";
      }
      if (!detailsData.corner) {
        errors.corner = "Corner type is required";
      }

      // Paper Details
      if (!detailsData.paperGsm) {
        errors.paperGsm = "Paper GSM is required";
      }
      if (!detailsData.paperType) {
        errors.paperType = "Paper type is required";
      }

      // Finishing Options
      if (!detailsData.coating) {
        errors.coating = "Coating type is required";
      }
      if (!detailsData.finishing) {
        errors.finishing = "Finishing option is required";
      }

      // Design Details
      if (!detailsData.designType) {
        errors.designType = "Design type is required";
      }
      break;

    case "flyers":
      if (!detailsData.size) {
        errors.size = "Size is required";
      }
      if (!detailsData.folding) {
        errors.folding = "Folding option is required";
      }
      if (!detailsData.perforation) {
        errors.perforation = "Perforation option is required";
      }
      break;

    case "letterheads":
      if (!detailsData.paperSize) {
        errors.paperSize = "Paper size is required";
      }
      if (!detailsData.watermark) {
        errors.watermark = "Watermark specification is required";
      }
      if (!detailsData.embossing) {
        errors.embossing = "Embossing option is required";
      }
      break;

    case "envelopes":
      if (!detailsData.envelopeSize) {
        errors.envelopeSize = "Envelope size is required";
      }
      if (!detailsData.windowType) {
        errors.windowType = "Window type is required";
      }
      if (!detailsData.flapStyle) {
        errors.flapStyle = "Flap style is required";
      }
      break;
  }

  return errors;
};

// Helper function to get initial form state
export const getInitialFormState = (productType) => {
  const commonData = {
    orderDate: new Date().toISOString().split("T")[0],
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    priority: "normal",
    orderStatus: "pending",
    quantity: "",
    unitPrice: "",
    totalAmount: "",
    discount: "",
    tax: "",
    finalAmount: "",
    paymentMethod: "cash",
    paymentStatus: "unpaid",
    advanceAmount: "",
    balanceAmount: "",
    designStatus: "pending",
    fileStatus: "pending",
    productionStage: "design",
    assignedTo: "",
    notes: "",
    packagingType: "box",
    deliveryMethod: "courier",
  };

  let detailsData = {};

  switch (productType) {
    case "brochures":
      detailsData = {
        finishedSize: "",
        openSize: "",
        folding: "",
        binding: "saddle",
        paperType: "gloss",
        paperGsm: "",
        coating: "none",
        printSides: "double",
        colorMode: "cmyk",
        bleed: "3mm",
        resolution: "300",
        laminating: "none",
        fileFormat: "pdf",
        proofRequired: false,
      };
      break;
    case "visiting-cards":
      detailsData = {
        cardSize: "standard",
        corner: "rounded",
        paperGsm: "300",
        paperType: "gloss",
        coating: "gloss",
        finishing: "none",
        designType: "provided",
        foilStamping: "none",
        embossing: "none",
      };
      break;
    case "flyers":
      detailsData = {
        size: "a4",
        folding: "none",
        perforation: "none",
        paperType: "gloss",
        paperGsm: "150",
        printSides: "single",
      };
      break;
    case "letterheads":
      detailsData = {
        paperSize: "a4",
        watermark: "none",
        embossing: "none",
        paperGsm: "100",
        paperType: "bond",
      };
      break;
    case "envelopes":
      detailsData = {
        envelopeSize: "c4",
        windowType: "none",
        flapStyle: "standard",
        paperGsm: "100",
        paperType: "bond",
      };
      break;
    default:
      detailsData = {};
  }

  return { commonData, detailsData };
};

// Options for select fields
export const FORM_OPTIONS = {
  priority: [
    { value: "low", label: "Low Priority" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent" },
  ],

  orderStatus: [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ],

  paymentMethod: [
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
    { value: "online", label: "Online" },
    { value: "bank_transfer", label: "Bank Transfer" },
  ],

  paymentStatus: [
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
    { value: "partial", label: "Partial Payment" },
  ],

  designStatus: [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "approved", label: "Approved" },
    { value: "revision", label: "Revision Needed" },
  ],

  fileStatus: [
    { value: "pending", label: "Pending" },
    { value: "received", label: "Received" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ],

  productionStage: [
    { value: "design", label: "Design" },
    { value: "proofing", label: "Proofing" },
    { value: "printing", label: "Printing" },
    { value: "finishing", label: "Finishing" },
    { value: "packaging", label: "Packaging" },
    { value: "ready", label: "Ready for Delivery" },
  ],

  paperType: [
    { value: "gloss", label: "Gloss" },
    { value: "matte", label: "Matte" },
    { value: "art", label: "Art Paper" },
    { value: "bond", label: "Bond Paper" },
    { value: "recycled", label: "Recycled" },
  ],

  coating: [
    { value: "none", label: "No Coating" },
    { value: "gloss", label: "Gloss" },
    { value: "matte", label: "Matte" },
    { value: "uv", label: "UV Spot" },
  ],

  binding: [
    { value: "saddle", label: "Saddle Stitch" },
    { value: "perfect", label: "Perfect Binding" },
    { value: "wire", label: "Wire-O" },
    { value: "spiral", label: "Spiral" },
    { value: "none", label: "No Binding" },
  ],

  printSides: [
    { value: "single", label: "Single Side" },
    { value: "double", label: "Double Side" },
  ],

  colorMode: [
    { value: "cmyk", label: "CMYK" },
    { value: "rgb", label: "RGB" },
    { value: "spot", label: "Spot Colors" },
  ],

  // Add more options as needed
};
