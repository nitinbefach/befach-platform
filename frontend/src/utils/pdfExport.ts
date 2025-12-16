import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationResult, CalculationInput, formatCurrency } from './calculatorUtils';

export interface PDFExportOptions {
  includeCharts?: boolean;
  includeBreakdown?: boolean;
  includeMetadata?: boolean;
  companyName?: string;
  companyLogo?: string;
}

export function generateLandedCostPDF(
  input: CalculationInput,
  result: CalculationResult,
  options: PDFExportOptions = {}
): void {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set default options
  const {
    includeCharts = true,
    includeBreakdown = true,
    includeMetadata = true,
    companyName = 'BEFACH International',
    companyLogo = null
  } = options;

  // Colors
  const primaryColor = '#3B82F6';
  const secondaryColor = '#6B7280';
  const dangerColor = '#EF4444';
  const successColor = '#10B981';

  let yPosition = 20;

  // Header Section
  doc.setFillColor(59, 130, 246); // Blue
  doc.rect(0, 0, 210, 40, 'F');

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, 20, 20);

  // Document Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Landed Cost Calculation Report', 20, 30);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  yPosition = 50;

  // Product Information Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Product Information', 20, yPosition);
  yPosition += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  // Product details table
  const productData = [
    ['Product Name:', input.productName],
    ['HSN Code:', input.hsnCode],
    ['Quantity:', `${input.quantity} units`],
    ['Unit Price:', `${input.currency} ${input.unitPrice.toFixed(2)}`],
    ['Total FOB Value:', `${input.currency} ${input.fobValue.toFixed(2)}`],
    ['Weight:', `${input.weight} ${input.weightUnit}`]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: productData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 60 }
    },
    margin: { left: 20, right: 110 }
  });

  // Shipping Information (right side)
  const shippingY = yPosition;
  doc.setFont('helvetica', 'bold');
  doc.text('Shipping Information', 110, shippingY);

  const shippingData = [
    ['Shipping Method:', input.shippingMethod.toUpperCase()],
    ['Origin Country:', input.originCountry],
    ['Destination:', input.destinationCountry],
    ['Port of Loading:', input.portOfLoading || 'N/A'],
    ['Port of Discharge:', input.portOfDischarge || 'N/A']
  ];

  autoTable(doc, {
    startY: shippingY + 7,
    head: [],
    body: shippingData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 40 }
    },
    margin: { left: 110, right: 20 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Summary Box
  doc.setFillColor(240, 253, 244); // Light green background
  doc.rect(20, yPosition, 170, 30, 'F');
  doc.setDrawColor(16, 185, 129); // Green border
  doc.rect(20, yPosition, 170, 30, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129);
  doc.text('Total Landed Cost', 30, yPosition + 10);

  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(formatCurrency(result.totalLandedCost), 30, yPosition + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Per Unit: ${formatCurrency(result.landedCostPerUnit)}`, 110, yPosition + 15);
  doc.text(`Exchange Rate: 1 ${input.currency} = ₹${result.exchangeRate.toFixed(2)}`, 110, yPosition + 22);

  yPosition += 40;

  // Cost Breakdown Table
  if (includeBreakdown) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Cost Breakdown', 20, yPosition);
    yPosition += 7;

    const breakdownData = [
      ['FOB Value', formatCurrency(result.fobValue), `${((result.fobValue / result.totalLandedCost) * 100).toFixed(1)}%`],
      ['Freight Charges', formatCurrency(result.freight), `${result.freightPercentage.toFixed(1)}%`],
      ['Insurance', formatCurrency(result.insurance), `${result.insurancePercentage.toFixed(1)}%`],
      ['CIF Value', formatCurrency(result.cifValue), `${((result.cifValue / result.totalLandedCost) * 100).toFixed(1)}%`]
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['Component', 'Amount', '% of Total']],
      body: breakdownData,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 50, halign: 'right' },
        2: { cellWidth: 30, halign: 'center' }
      },
      margin: { left: 20, right: 20 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 5;

    // Duties and Taxes Table
    const dutiesData = [
      ['Basic Customs Duty', formatCurrency(result.basicCustomsDuty), `${((result.basicCustomsDuty / result.totalLandedCost) * 100).toFixed(1)}%`],
      ['Social Welfare Surcharge', formatCurrency(result.socialWelfareSurcharge), `${((result.socialWelfareSurcharge / result.totalLandedCost) * 100).toFixed(1)}%`],
      ['IGST', formatCurrency(result.igst), `${((result.igst / result.totalLandedCost) * 100).toFixed(1)}%`],
      ['Total Duties & Taxes', formatCurrency(result.totalDuties), `${result.dutyPercentage.toFixed(1)}%`]
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['Duties & Taxes', 'Amount', '% of Total']],
      body: dutiesData,
      theme: 'striped',
      headStyles: {
        fillColor: [239, 68, 68],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 50, halign: 'right' },
        2: { cellWidth: 30, halign: 'center' }
      },
      footStyles: {
        fontStyle: 'bold',
        fillColor: [254, 226, 226]
      },
      margin: { left: 20, right: 20 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 5;

    // Additional Charges Table
    const additionalData = [
      ['Port Charges', formatCurrency(result.portCharges)],
      ['Customs Clearance', formatCurrency(result.customsClearance)],
      ['Inland Transport', formatCurrency(result.inlandTransport)],
      ['Other Charges', formatCurrency(result.otherCharges)],
      ['Total Additional', formatCurrency(result.totalAdditionalCharges)]
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['Additional Charges', 'Amount']],
      body: additionalData,
      theme: 'striped',
      headStyles: {
        fillColor: [139, 92, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 50, halign: 'right' }
      },
      footStyles: {
        fontStyle: 'bold',
        fillColor: [233, 213, 255]
      },
      margin: { left: 20, right: 100 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Key Insights Section
  if (yPosition < 240) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Key Insights', 20, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const insights = [
      `• Duties and taxes constitute ${result.dutyPercentage.toFixed(1)}% of your total landed cost`,
      `• Freight charges add ${result.freightPercentage.toFixed(1)}% to your base FOB value`,
      `• Total cost increase from FOB to landed: ${(((result.totalLandedCost - result.fobValue) / result.fobValue) * 100).toFixed(1)}%`,
      `• Effective duty rate on CIF value: ${((result.totalDuties / result.cifValue) * 100).toFixed(1)}%`
    ];

    insights.forEach((insight, index) => {
      doc.text(insight, 20, yPosition + (index * 6));
    });

    yPosition += insights.length * 6 + 5;
  }

  // Metadata Section
  if (includeMetadata && yPosition < 260) {
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 5;

    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);

    const metadata = [
      `Calculation Date: ${new Date(result.calculatedAt).toLocaleString()}`,
      `Currency: ${result.currency} | Exchange Rate: 1 ${result.currency} = ₹${result.exchangeRate.toFixed(2)}`,
      `Product: ${input.productName} | HSN: ${input.hsnCode} | Quantity: ${input.quantity}`
    ];

    metadata.forEach((meta, index) => {
      doc.text(meta, 20, yPosition + (index * 4));
    });

    yPosition += metadata.length * 4 + 5;
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(245, 245, 245);
  doc.rect(0, pageHeight - 20, 210, 20, 'F');

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Generated by BEFACH International Cost Calculator', 105, pageHeight - 12, { align: 'center' });
  doc.text(`Page 1 of 1 | ${new Date().toLocaleDateString()}`, 105, pageHeight - 7, { align: 'center' });

  // Watermark (optional)
  doc.setFontSize(60);
  doc.setTextColor(200, 200, 200);
  doc.setFont('helvetica', 'bold');
  doc.saveGraphicsState();
  doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
  doc.text('DRAFT', 105, 150, {
    align: 'center',
    angle: 45
  });
  doc.restoreGraphicsState();

  // Generate filename
  const filename = `landed-cost-${input.productName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;

  // Save the PDF
  doc.save(filename);
}

// Export calculation history to PDF
export function generateHistoryPDF(calculations: any[]): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Header
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, 297, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Calculation History Report', 20, 18);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Prepare table data
  const tableData = calculations.map(calc => [
    new Date(calc.savedAt).toLocaleDateString(),
    calc.input.productName,
    calc.input.hsnCode,
    calc.input.originCountry,
    calc.input.quantity,
    formatCurrency(calc.fobValue),
    formatCurrency(calc.totalDuties),
    formatCurrency(calc.totalLandedCost)
  ]);

  // Create table
  autoTable(doc, {
    startY: 40,
    head: [['Date', 'Product', 'HSN', 'Origin', 'Qty', 'FOB Value', 'Duties', 'Landed Cost']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 50 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 35, halign: 'right' },
      6: { cellWidth: 35, halign: 'right' },
      7: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
    }
  });

  // Summary statistics
  const totalCalculations = calculations.length;
  const totalLandedCost = calculations.reduce((sum, calc) => sum + calc.totalLandedCost, 0);
  const avgLandedCost = totalLandedCost / totalCalculations;

  const summaryY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Summary Statistics', 20, summaryY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Calculations: ${totalCalculations}`, 20, summaryY + 7);
  doc.text(`Average Landed Cost: ${formatCurrency(avgLandedCost)}`, 20, summaryY + 13);
  doc.text(`Total Value: ${formatCurrency(totalLandedCost)}`, 20, summaryY + 19);

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 148, pageHeight - 10, { align: 'center' });

  // Save
  doc.save(`calculation-history-${Date.now()}.pdf`);
}