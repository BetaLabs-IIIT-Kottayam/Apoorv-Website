import { jsPDF } from 'jspdf';
import { IOrder, PopulatedOrder } from '../controllers/orderController';

const generateInvoice = (order : PopulatedOrder) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add company logo/header
    doc.setFontSize(20);
    doc.text('INVOICE', pageWidth/2, 20, { align: 'center' });
    
    // Add order details
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 20, 40);
    doc.text(`Date: ${new Date(order.paidAt!).toLocaleDateString()}`, 20, 50);
    doc.text(`Secret Code: ${order.secretCode}`, 20, 60);
    
    // Add buyer details
    doc.text('Buyer Details:', 20, 80);
    doc.text(`Name: ${order.buyerDetails.firstName} ${order.buyerDetails.lastName}`, 30, 90);
    doc.text(`Email: ${order.buyerDetails.email}`, 30, 100);
    doc.text(`Phone: ${order.buyerDetails.phone}`, 30, 110);
    
    // Add items table
    let yPos = 140;
    doc.text('Items:', 20, yPos);
    yPos += 10;
    
    // Table headers
    doc.text('Item', 30, yPos);
    doc.text('Color', 100, yPos);
    doc.text('Size', 130, yPos);
    doc.text('Qty', 155, yPos);
    doc.text('Price', 175, yPos);
    doc.text('Total', 195, yPos);
    
    yPos += 10;
    // Add items
    order.items.forEach((item, index) => {
      const currentY = yPos + (index * 20);
      
      // Item name (wrap text if too long)
      const itemName = item.merchId.name;
      const wrappedName = doc.splitTextToSize(itemName, 60);
      doc.text(wrappedName, 30, currentY);
      
      // Other item details
      doc.text(item.color || '-', 100, currentY);
      doc.text(item.size || '-', 130, currentY);
      doc.text(item.quantity.toString(), 155, currentY);
      doc.text(`₹${item.price}`, 175, currentY);
      doc.text(`₹${item.price * item.quantity}`, 195, currentY);
    });
    
    // Add total amount
    yPos += (order.items.length * 20) + 20;
    doc.text(`Total Amount: ₹${order.totalAmount}`, 150, yPos);
    
    return doc;
  };

  export default generateInvoice;