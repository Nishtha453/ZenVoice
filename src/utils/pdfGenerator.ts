import { InvoiceData } from '../types/invoice';
import { formatCurrency } from './calculations';

export const generateInvoicePDF = (invoiceData: InvoiceData, template: string = 'modern'): void => {
  // Create a new window for the PDF content
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const getTemplateStyles = (template: string) => {
    const baseStyles = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #1F2937;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
        background: #ffffff;
      }
    `;

    switch (template) {
      case 'classic':
        return baseStyles + `
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 2px solid #8B5CF6;
            padding-bottom: 20px;
          }
          
          .logo-section h1 {
            font-size: 28px;
            color: #8B5CF6;
            font-weight: 600;
            font-family: serif;
          }
          
          .items-table th {
            background: #8B5CF6;
            color: white;
          }
        `;
      
      case 'minimal':
        return baseStyles + `
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 20px;
          }
          
          .logo-section h1 {
            font-size: 24px;
            color: #374151;
            font-weight: 300;
            letter-spacing: 2px;
          }
          
          .items-table th {
            background: #F9FAFB;
            color: #374151;
            border-bottom: 2px solid #E5E7EB;
          }
        `;
      
      default: // modern
        return baseStyles + `
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 20px;
          }
          
          .logo-section h1 {
            font-size: 32px;
            color: #3B82F6;
            font-weight: 700;
          }
          
          .items-table th {
            background: #3B82F6;
            color: white;
          }
        `;
    }
  };
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoiceData.invoiceNumber}</title>
      <style>
        ${getTemplateStyles(template)}
        
        .company-logo {
          max-width: 120px;
          max-height: 60px;
          margin-bottom: 12px;
        }

        .invoice-details {
          text-align: right;
        }
        
        .invoice-details h2 {
          font-size: 24px;
          color: #1F2937;
          margin-bottom: 8px;
        }
        
        .invoice-meta p {
          margin-bottom: 4px;
          font-size: 14px;
        }
        
        .addresses {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        
        .address-block {
          width: 48%;
        }
        
        .address-block h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 12px;
          padding: 8px 0;
          border-bottom: 2px solid #E5E7EB;
        }
        
        .address-content p {
          margin-bottom: 4px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .items-table th {
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          font-size: 14px;
        }
        
        .items-table td {
          padding: 16px 12px;
          border-bottom: 1px solid #E5E7EB;
          font-size: 14px;
        }
        
        .items-table tr:last-child td {
          border-bottom: none;
        }
        
        .items-table tr:nth-child(even) {
          background: #F9FAFB;
        }
        
        .text-right {
          text-align: right;
        }
        
        .totals {
          margin-left: auto;
          width: 300px;
          background: #F9FAFB;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #E5E7EB;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
        }
        
        .total-row.subtotal {
          color: #6B7280;
        }
        
        .total-row.tax {
          color: #6B7280;
        }
        
        .total-row.final {
          font-size: 18px;
          font-weight: 700;
          color: #1F2937;
          border-top: 2px solid #3B82F6;
          padding-top: 12px;
          margin-top: 16px;
          margin-bottom: 0;
        }
        
        .notes, .terms, .payment-instructions {
          margin-top: 40px;
          padding: 20px;
          background: #F9FAFB;
          border-radius: 8px;
          border-left: 4px solid #3B82F6;
        }
        
        .notes h4, .terms h4, .payment-instructions h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 8px;
        }
        
        .notes p, .terms p, .payment-instructions p {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.6;
        }
        
        .payment-section {
          margin-top: 30px;
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }
        
        .payment-button {
          display: inline-block;
          padding: 12px 24px;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 12px;
        }
        
        .footer {
          margin-top: 60px;
          text-align: center;
          font-size: 12px;
          color: #9CA3AF;
          border-top: 1px solid #E5E7EB;
          padding-top: 20px;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .header {
            break-inside: avoid;
          }
          
          .items-table {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-section">
          ${invoiceData.companyLogo ? `<img src="${invoiceData.companyLogo}" alt="Company Logo" class="company-logo" />` : ''}
          <h1>INVOICE</h1>
          <p style="color: #6B7280; font-size: 14px;">Professional Invoice</p>
        </div>
        <div class="invoice-details">
          <h2>#${invoiceData.invoiceNumber}</h2>
          <div class="invoice-meta">
            <p><strong>Date:</strong> ${new Date(invoiceData.date).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoiceData.dueDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span style="color: #059669; font-weight: 600;">${invoiceData.status.toUpperCase()}</span></p>
          </div>
        </div>
      </div>
      
      <div class="addresses">
        <div class="address-block">
          <h3>From</h3>
          <div class="address-content">
            <p><strong>${invoiceData.fromName}</strong></p>
            <p>${invoiceData.fromEmail}</p>
            <p>${invoiceData.fromPhone}</p>
            <p>${invoiceData.fromAddress}</p>
          </div>
        </div>
        
        <div class="address-block">
          <h3>Bill To</h3>
          <div class="address-content">
            <p><strong>${invoiceData.toName}</strong></p>
            <p>${invoiceData.toEmail}</p>
            <p>${invoiceData.toPhone}</p>
            <p>${invoiceData.toAddress}</p>
          </div>
        </div>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Rate</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.items.map(item => `
            <tr>
              <td>${item.description}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${formatCurrency(item.rate, invoiceData.currency)}</td>
              <td class="text-right">${formatCurrency(item.amount, invoiceData.currency)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totals">
        <div class="total-row subtotal">
          <span>Subtotal:</span>
          <span>${formatCurrency(invoiceData.subtotal, invoiceData.currency)}</span>
        </div>
        <div class="total-row tax">
          <span>Tax (${invoiceData.taxRate}%):</span>
          <span>${formatCurrency(invoiceData.taxAmount, invoiceData.currency)}</span>
        </div>
        <div class="total-row final">
          <span>Total:</span>
          <span>${formatCurrency(invoiceData.total, invoiceData.currency)}</span>
        </div>
      </div>
      
      ${invoiceData.notes ? `
        <div class="notes">
          <h4>Notes</h4>
          <p>${invoiceData.notes}</p>
        </div>
      ` : ''}
      
      ${invoiceData.terms ? `
        <div class="terms">
          <h4>Terms & Conditions</h4>
          <p>${invoiceData.terms}</p>
        </div>
      ` : ''}
      
      ${invoiceData.paymentInstructions ? `
        <div class="payment-instructions">
          <h4>Payment Instructions</h4>
          <p>${invoiceData.paymentInstructions}</p>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Generated on ${new Date().toLocaleDateString()} • Invoice Builder Pro</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};