import { jsPDF } from "jspdf";
import { PopulatedOrder } from "../controllers/orderController";

const generateInvoice = (order: PopulatedOrder) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  // Add header with logo and company details
  doc.setFillColor(41, 128, 185); // Professional blue color
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("APOORV", margin, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Merchandise Store", margin, 35);
  // Add invoice title and number
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - margin, 25, { align: "right" });

  doc.setFontSize(10);
  doc.text(`#${order._id}`, pageWidth - margin, 35, { align: "right" });
  // Add order details in a box
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, 50, pageWidth - 2 * margin, 40, 3, 3, "FD");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Order Details", margin + 10, 65);

  doc.setFont("helvetica", "normal");
  doc.text(
    `Date: ${new Date(order.paidAt!).toLocaleDateString()}`,
    margin + 10,
    75
  );

  // Highlight secret code
  doc.setFillColor(255, 243, 224);
  doc.roundedRect(pageWidth / 2, 60, 80, 20, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Secret Code:", pageWidth / 2 + 5, 70);
  doc.setFont("helvetica", "normal");
  doc.text(order.secretCode, pageWidth / 2 + 5, 75);
  // Add buyer details in a box
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, 100, pageWidth - 2 * margin, 50, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", margin + 10, 115);

  doc.setFont("helvetica", "normal");
  doc.text(
    [
      `${order.buyerDetails.firstName} ${order.buyerDetails.lastName}`,
      `Email: ${order.buyerDetails.email}`,
      `Phone: ${order.buyerDetails.phone}`,
    ],
    margin + 10,
    125
  );
  // Create items table
  const tableTop = 170;
  const tableHeaders = ["Item", "Size", "Qty", "Price", "Total"];
  const columnWidths = [85, 25, 20, 25, 25];
  let currentY = tableTop;
  // Table header background
  doc.setFillColor(41, 128, 185);
  doc.rect(margin, currentY - 10, pageWidth - 2 * margin, 15, "F");
  // Table headers
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  let currentX = margin;
  tableHeaders.forEach((header, i) => {
    doc.text(header, currentX + 5, currentY);
    currentX += columnWidths[i];
  });
  // Table rows
  currentY += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  // Add alternating row backgrounds
  order.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 15, "F");
    }
    currentX = margin;

    // Item name with wrapping
    const nameLines = doc.splitTextToSize(
      item.merchId.name,
      columnWidths[0] - 5
    );
    doc.text(nameLines, currentX + 5, currentY);
    currentX += columnWidths[0];

    // Skip color column and continue with other columns
    doc.text(item.size || "-", currentX + 5, currentY);
    currentX += columnWidths[1];

    doc.text(item.quantity.toString(), currentX + 5, currentY);
    currentX += columnWidths[2];

    doc.text(`Rs.${item.price}`, currentX + 5, currentY);
    currentX += columnWidths[3];

    doc.text(`Rs.${item.price * item.quantity}`, currentX + 5, currentY);
    currentY += 15;
  });
  // Add total amount in a box
  const totalBoxY = currentY + 10;
  doc.setFillColor(41, 128, 185);
  doc.rect(pageWidth - margin - 80, totalBoxY, 80, 20, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total: Rs.${order.totalAmount}`,
    pageWidth - margin - 75,
    totalBoxY + 13
  );
  // Add footer
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Thank you for shopping with APOORV!",
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" }
  );

  return doc;
};
export default generateInvoice;