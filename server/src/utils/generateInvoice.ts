import { jsPDF } from "jspdf";
import { PopulatedOrder } from "../controllers/orderController";

const generateInvoice = (order: PopulatedOrder) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // Colors based on traditional Japanese aesthetics
  const primaryColor: [number, number, number] = [139, 0, 0]; // Deep red (burgundy)
  const secondaryColor: [number, number, number] = [255, 255, 255]; // White
  const accentColor: [number, number, number] = [20, 61, 96]; // Dark blue
  const textDark: [number, number, number] = [0, 0, 0]; // Black for light backgrounds
  const textLight: [number, number, number] = [255, 255, 255]; // White for dark backgrounds

  // Add decorative top border
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 3, "F");
  doc.setFillColor(...secondaryColor);
  doc.rect(0, 3, pageWidth, 1, "F");

  // Add header with logo and company details
  doc.setFillColor(...primaryColor);
  doc.rect(0, 10, pageWidth, 40, "F");

  // Add decorative corners to header
  doc.setDrawColor(...secondaryColor); // White lines on red background
  doc.setLineWidth(0.5);
  // Top left
  doc.line(margin / 2, 15, margin * 1.5, 15);
  doc.line(margin / 2, 15, margin / 2, 25);
  // Top right
  doc.line(pageWidth - margin * 1.5, 15, pageWidth - margin / 2, 15);
  doc.line(pageWidth - margin / 2, 15, pageWidth - margin / 2, 25);

  // Header text (white on red)
  doc.setTextColor(...textLight);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("APOORV", margin, 35);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Samurai Merchandise", margin, 45);

  // Invoice title (black on white)
  doc.setTextColor(...textDark);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - margin, 65, { align: "right" });

  doc.setFontSize(10);
  doc.text(`#${order._id}`, pageWidth - margin, 75, { align: "right" });

  // Order details box (white text on dark blue)
  doc.setDrawColor(...primaryColor);
  doc.setFillColor(...accentColor);
  doc.roundedRect(margin, 85, pageWidth - 2 * margin, 40, 3, 3, "FD");

  doc.setTextColor(...textLight);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Order Details", margin + 10, 100);

  doc.setFont("helvetica", "normal");
  doc.text(
    `Date: ${new Date(order.paidAt!).toLocaleDateString()}`,
    margin + 10,
    110
  );

  // Secret code box (black text on light background)
  doc.setFillColor(255, 245, 230);
  doc.roundedRect(pageWidth / 2, 95, 80, 20, 2, 2, "F");
  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "bold");
  doc.text("Secret Code:", pageWidth / 2 + 5, 105);
  doc.setFont("helvetica", "normal");
  doc.text(order.secretCode, pageWidth / 2 + 5, 109);

  // Buyer details box (white text on dark blue)
  doc.setFillColor(...accentColor);
  doc.roundedRect(margin, 135, pageWidth - 2 * margin, 50, 3, 3, "FD");

  doc.setTextColor(...textLight);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", margin + 10, 150);

  doc.setFont("helvetica", "normal");
  doc.text(
    [
      `${order.buyerDetails.firstName} ${order.buyerDetails.lastName}`,
      `Email: ${order.buyerDetails.email}`,
      `Phone: ${order.buyerDetails.phone}`,
    ],
    margin + 10,
    160
  );

  // Table header (white text on red)
  const tableTop = 200;
  const tableHeaders = ["Item", "Color", "Size", "Qty", "Price", "Total"];
  const columnWidths = [75, 20, 20, 15, 20, 15];
  let currentY = tableTop;

  doc.setFillColor(...primaryColor);
  doc.rect(margin, currentY - 10, pageWidth - 2 * margin, 15, "F");

  doc.setTextColor(...textLight);
  doc.setFont("helvetica", "bold");
  let currentX = margin;
  tableHeaders.forEach((header, i) => {
    doc.text(header, currentX + 5, currentY);
    currentX += columnWidths[i];
  });

  // Table rows (alternating with proper contrast)
  currentY += 10;
  doc.setFont("helvetica", "normal");

  order.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(...accentColor);
      doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 15, "F");
      doc.setTextColor(...textLight); // White text on dark background
    } else {
      doc.setFillColor(...secondaryColor);
      doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 15, "F");
      doc.setTextColor(...textDark); // Black text on light background
    }

    currentX = margin;

    const nameLines = doc.splitTextToSize(
      item.merchId.name,
      columnWidths[0] - 5
    );
    doc.text(nameLines, currentX + 5, currentY);
    currentX += columnWidths[0];

    doc.text(item.color || "-", currentX + 5, currentY);
    currentX += columnWidths[1];

    doc.text(item.size || "-", currentX + 5, currentY);
    currentX += columnWidths[2];

    doc.text(item.quantity.toString(), currentX + 5, currentY);
    currentX += columnWidths[3];

    doc.text(`Rs.${item.price}`, currentX + 5, currentY);
    currentX += columnWidths[4];

    doc.text(`Rs.${item.price * item.quantity}`, currentX + 5, currentY);

    currentY += 15;
  });

  // Total amount box (white text on red)
  const totalBoxY = currentY + 10;
  doc.setFillColor(...primaryColor);
  doc.rect(pageWidth - margin - 80, totalBoxY, 80, 20, "F");

  doc.setTextColor(...textLight);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total: Rs.${order.totalAmount}`,
    pageWidth - margin - 75,
    totalBoxY + 13
  );

  // Footer (red text on white)
  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Thank you for your honorable purchase",
    pageWidth / 2,
    pageHeight - 30,
    { align: "center" }
  );

  // Bottom border
  doc.setFillColor(...primaryColor);
  doc.rect(0, pageHeight - 4, pageWidth, 3, "F");
  doc.setFillColor(...secondaryColor);
  doc.rect(0, pageHeight - 4, pageWidth, 1, "F");

  return doc;
};

export default generateInvoice;
