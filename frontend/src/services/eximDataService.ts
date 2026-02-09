import {
  ShipmentRecord,
  TraderSummary,
  TraderDetail,
  EximSearchParams,
  EximSidebarFilters,
  EximStats,
  CountryBreakdown,
  HSCodeBreakdown,
  EximSortField,
  SortDirection,
  SearchSuggestion,
} from '@/types/exim';
import { RESULTS_PER_PAGE } from '@/lib/eximConstants';

// ─── Mock Data ────────────────────────────────────────────

const generateDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const mockShipments: ShipmentRecord[] = [
  // Headphones & Audio
  { id: 'SHP001', date: generateDate(5), dataType: 'import', hsnCode: '85183011', productDescription: '509171 IE 100 PRO WIRELESS BLACK IN-EAR HEADPHONE AND BT MODULE MODEL:SEBT1 ETA: ETA-SD-20201108351509171 IE 100 PRO WIRELESS BLACK IN-EAR HEADPHONE AND BT MOD', consigneeName: 'Sennheiser Electronics India Pvt Ltd', consigneeId: '16678231', consigneeCity: 'Gurgaon', shipperName: 'Sennheiser Electronic SE Co KG', shipperId: 'SHP-DE-4421', notifyPartyName: 'RG Shipping Pvt Ltd', countryOfOrigin: 'Germany', portOfDestination: 'INNSA', portOfOrigin: 'DEHAM', quantity: 2500, quantityUnit: 'PCS', valueUSD: 187500, weightKg: 425, billOfLadingNo: 'BOE-2026-IN-00142', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP002', date: generateDate(12), dataType: 'import', hsnCode: '85183011', productDescription: 'BT HEADPHONE P9 BIS REG NO R-41195383 NOT OF REPUTED BRAND BT HEADPHONE P9 BIS REG NO R-41195383 NOT OF REPUTED BRA', consigneeName: 'Neelkant Crockery Emporium', consigneeId: '16657478', consigneeCity: 'New Delhi', shipperName: 'Direction Technology HK Co Ltd', shipperId: 'SHP-HK-7722', notifyPartyName: 'AP Shipping Lines', countryOfOrigin: 'China', portOfDestination: 'INDEL', portOfOrigin: 'CNSZX', quantity: 10000, quantityUnit: 'PCS', valueUSD: 35000, weightKg: 850, billOfLadingNo: 'BOE-2026-IN-00198', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP003', date: generateDate(12), dataType: 'import', hsnCode: '85183090', productDescription: 'BT HEADPHONE BIS NO. R-41303526 MODEL NO-TN33 BT HEADPHONE', consigneeName: 'Mahavideh Enterprises', consigneeId: '16677192', consigneeCity: 'Mumbai', shipperName: 'Neway Trading Development Ltd', shipperId: 'SHP-CN-8891', notifyPartyName: 'Rapid Cargo Services', countryOfOrigin: 'China', portOfDestination: 'INNSA', portOfOrigin: 'CNSHA', quantity: 5000, quantityUnit: 'PCS', valueUSD: 22500, weightKg: 425, billOfLadingNo: 'BOE-2026-IN-00205', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP004', date: generateDate(18), dataType: 'import', hsnCode: '85183011', productDescription: 'WIRELESS BLUETOOTH HEADPHONE MODEL WH-1000XM5 NOISE CANCELLING PREMIUM AUDIO DEVICE', consigneeName: 'Reliance Digital', consigneeId: '16690112', consigneeCity: 'Mumbai', shipperName: 'Sony Corporation', shipperId: 'SHP-JP-1123', notifyPartyName: 'DHL Express India', countryOfOrigin: 'Japan', portOfDestination: 'INNSA', portOfOrigin: 'JPYOK', quantity: 8000, quantityUnit: 'PCS', valueUSD: 640000, weightKg: 1200, billOfLadingNo: 'BOE-2026-IN-00241', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // Electronics & Components
  { id: 'SHP005', date: generateDate(22), dataType: 'import', hsnCode: '85177090', productDescription: 'MOBILE PHONE ACCESSORIES CHARGER CABLE TYPE-C USB DATA CABLE AND POWER ADAPTER 65W GAN CHARGER', consigneeName: 'Samsung India Electronics Pvt Ltd', consigneeId: '16701345', consigneeCity: 'Noida', shipperName: 'Samsung Electronics Co Ltd', shipperId: 'SHP-KR-2201', notifyPartyName: 'Kuehne Nagel India', countryOfOrigin: 'South Korea', portOfDestination: 'INDEL', portOfOrigin: 'KRPUS', quantity: 50000, quantityUnit: 'PCS', valueUSD: 175000, weightKg: 3500, billOfLadingNo: 'BOE-2026-IN-00289', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP006', date: generateDate(28), dataType: 'import', hsnCode: '85414011', productDescription: 'SOLAR CELLS MONOCRYSTALLINE SILICON PHOTOVOLTAIC CELLS 182MM HALF-CUT PERC TECHNOLOGY', consigneeName: 'Tata Power Solar Systems', consigneeId: '16655890', consigneeCity: 'Bangalore', shipperName: 'Longi Green Energy Technology', shipperId: 'SHP-CN-3301', notifyPartyName: 'Maersk Line India', countryOfOrigin: 'China', portOfDestination: 'INMAA', portOfOrigin: 'CNSHA', quantity: 20000, quantityUnit: 'PCS', valueUSD: 420000, weightKg: 8500, billOfLadingNo: 'BOE-2026-IN-00312', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP007', date: generateDate(32), dataType: 'import', hsnCode: '85177090', productDescription: 'ELECTRONIC COMPONENTS PCB ASSEMBLY INTEGRATED CIRCUIT BOARD FOR LED DISPLAY MODULE', consigneeName: 'Bosch Ltd', consigneeId: '16688901', consigneeCity: 'Bangalore', shipperName: 'Foxconn Technology Group', shipperId: 'SHP-TW-5501', notifyPartyName: 'DB Schenker India', countryOfOrigin: 'Taiwan', portOfDestination: 'INMAA', portOfOrigin: 'TWISL', quantity: 15000, quantityUnit: 'PCS', valueUSD: 285000, weightKg: 2100, billOfLadingNo: 'BOE-2026-IN-00348', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP008', date: generateDate(38), dataType: 'import', hsnCode: '85414011', productDescription: 'SOLAR PANEL MODULE 550W BIFACIAL MONO PERC HALF CUT CELLS PV MODULE', consigneeName: 'Adani Solar Energy', consigneeId: '16699234', consigneeCity: 'Ahmedabad', shipperName: 'JA Solar Holdings', shipperId: 'SHP-CN-4412', notifyPartyName: 'Hapag Lloyd India', countryOfOrigin: 'China', portOfDestination: 'INBOM', portOfOrigin: 'CNNBO', quantity: 5000, quantityUnit: 'PCS', valueUSD: 375000, weightKg: 15000, billOfLadingNo: 'BOE-2026-IN-00391', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // LED & Display
  { id: 'SHP009', date: generateDate(45), dataType: 'import', hsnCode: '85395000', productDescription: 'LED BULB 9W E27 BASE WARM WHITE 3000K ENERGY SAVING LAMP PACK OF 100', consigneeName: 'Reliance Digital', consigneeId: '16690112', consigneeCity: 'Mumbai', shipperName: 'Haier Smart Home Co Ltd', shipperId: 'SHP-CN-6601', notifyPartyName: 'CMA CGM India', countryOfOrigin: 'China', portOfDestination: 'INNSA', portOfOrigin: 'CNSHA', quantity: 100000, quantityUnit: 'PCS', valueUSD: 95000, weightKg: 6200, billOfLadingNo: 'BOE-2026-IN-00428', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP010', date: generateDate(48), dataType: 'import', hsnCode: '85285900', productDescription: 'LED DISPLAY PANEL P2.5 INDOOR FULL COLOR SMD LED MODULE SCREEN 320X160MM', consigneeName: 'Tata Communications Ltd', consigneeId: '16712001', consigneeCity: 'Mumbai', shipperName: 'Shenzhen Absen Optoelectronic', shipperId: 'SHP-CN-7789', notifyPartyName: 'Evergreen Shipping', countryOfOrigin: 'China', portOfDestination: 'INNSA', portOfOrigin: 'CNSZX', quantity: 2000, quantityUnit: 'PCS', valueUSD: 156000, weightKg: 4800, billOfLadingNo: 'BOE-2026-IN-00456', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // Textiles
  { id: 'SHP011', date: generateDate(55), dataType: 'import', hsnCode: '62052000', productDescription: 'COTTON FABRIC 100% COTTON WOVEN PLAIN DYED SHIRTING MATERIAL WIDTH 58 INCHES', consigneeName: 'Raymond Ltd', consigneeId: '16645321', consigneeCity: 'Mumbai', shipperName: 'Nisha Fabrics Ltd', shipperId: 'SHP-BD-1102', notifyPartyName: 'OOCL India', countryOfOrigin: 'Bangladesh', portOfDestination: 'INNSA', portOfOrigin: 'BDDAC', quantity: 25000, quantityUnit: 'MTR', valueUSD: 62500, weightKg: 3750, billOfLadingNo: 'BOE-2026-IN-00489', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP012', date: generateDate(60), dataType: 'import', hsnCode: '62052000', productDescription: 'COTTON FABRIC ORGANIC CERTIFIED TWILL WEAVE TROUSER FABRIC 60 INCH WIDTH', consigneeName: 'Arvind Ltd', consigneeId: '16656789', consigneeCity: 'Ahmedabad', shipperName: 'Viyellatex Group', shipperId: 'SHP-BD-2203', notifyPartyName: 'MSC India', countryOfOrigin: 'Bangladesh', portOfDestination: 'INBOM', portOfOrigin: 'BDDAC', quantity: 40000, quantityUnit: 'MTR', valueUSD: 88000, weightKg: 5200, billOfLadingNo: 'BOE-2026-IN-00512', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // Agricultural
  { id: 'SHP013', date: generateDate(65), dataType: 'export', hsnCode: '09103010', productDescription: 'TURMERIC POWDER GROUND TURMERIC CURCUMA LONGA HIGH CURCUMIN CONTENT 5% MINIMUM', consigneeName: 'Al Futtaim Trading LLC', consigneeId: '16720045', consigneeCity: 'Dubai', shipperName: 'Synthite Industries Ltd', shipperId: 'SHP-IN-9901', notifyPartyName: 'Al Futtaim Logistics', countryOfOrigin: 'India', portOfDestination: 'AEJEA', portOfOrigin: 'INMAA', quantity: 50000, quantityUnit: 'KGS', valueUSD: 125000, weightKg: 50000, billOfLadingNo: 'BOE-2026-EX-00098', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP014', date: generateDate(70), dataType: 'export', hsnCode: '10063020', productDescription: 'BASMATI RICE 1121 SELLA GOLDEN SORTEX CLEANED LENGTH 8.30MM PURITY 95%', consigneeName: 'Lulu Hypermarket Group', consigneeId: '16730089', consigneeCity: 'Abu Dhabi', shipperName: 'KRBL Ltd', shipperId: 'SHP-IN-8812', notifyPartyName: 'Lulu Shipping Services', countryOfOrigin: 'India', portOfDestination: 'AEJEA', portOfOrigin: 'INNSA', quantity: 200000, quantityUnit: 'KGS', valueUSD: 280000, weightKg: 200000, billOfLadingNo: 'BOE-2026-EX-00112', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP015', date: generateDate(75), dataType: 'export', hsnCode: '10063020', productDescription: 'BASMATI RICE PREMIUM QUALITY LONG GRAIN PUSA 1509 STEAM SELLA RICE', consigneeName: 'Tesco Stores Ltd', consigneeId: '16741122', consigneeCity: 'London', shipperName: 'LT Foods Ltd', shipperId: 'SHP-IN-8823', notifyPartyName: 'Tesco Distribution', countryOfOrigin: 'India', portOfDestination: 'GBLON', portOfOrigin: 'INNSA', quantity: 150000, quantityUnit: 'KGS', valueUSD: 225000, weightKg: 150000, billOfLadingNo: 'BOE-2026-EX-00145', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // More electronics
  { id: 'SHP016', date: generateDate(80), dataType: 'import', hsnCode: '85177090', productDescription: 'LAPTOP BAG POLYESTER 15.6 INCH WATERPROOF WITH USB CHARGING PORT BUSINESS BACKPACK', consigneeName: 'Amazon Seller Services', consigneeId: '16751001', consigneeCity: 'Bangalore', shipperName: 'Neway Trading Development Ltd', shipperId: 'SHP-CN-8891', notifyPartyName: 'FedEx Express India', countryOfOrigin: 'China', portOfDestination: 'INMAA', portOfOrigin: 'CNSHA', quantity: 20000, quantityUnit: 'PCS', valueUSD: 48000, weightKg: 7000, billOfLadingNo: 'BOE-2026-IN-00567', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP017', date: generateDate(85), dataType: 'import', hsnCode: '85183011', productDescription: 'TWS WIRELESS EARBUDS BLUETOOTH 5.3 ANC ACTIVE NOISE CANCELLATION IN-EAR EARPHONE', consigneeName: 'Flipkart Internet Pvt Ltd', consigneeId: '16761234', consigneeCity: 'Bangalore', shipperName: 'Direction Technology HK Co Ltd', shipperId: 'SHP-HK-7722', notifyPartyName: 'UPS Supply Chain', countryOfOrigin: 'China', portOfDestination: 'INMAA', portOfOrigin: 'CNSZX', quantity: 30000, quantityUnit: 'PCS', valueUSD: 120000, weightKg: 900, billOfLadingNo: 'BOE-2026-IN-00598', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP018', date: generateDate(90), dataType: 'import', hsnCode: '85285900', productDescription: 'LED TV 55 INCH 4K ULTRA HD SMART ANDROID TV DOLBY VISION ATMOS HDR10+', consigneeName: 'Samsung India Electronics Pvt Ltd', consigneeId: '16701345', consigneeCity: 'Noida', shipperName: 'Samsung Electronics Co Ltd', shipperId: 'SHP-KR-2201', notifyPartyName: 'Samsung Logistics', countryOfOrigin: 'South Korea', portOfDestination: 'INDEL', portOfOrigin: 'KRPUS', quantity: 3000, quantityUnit: 'PCS', valueUSD: 450000, weightKg: 18000, billOfLadingNo: 'BOE-2026-IN-00621', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // Duplicate example
  { id: 'SHP019', date: generateDate(90), dataType: 'import', hsnCode: '85285900', productDescription: 'LED TV 55 INCH 4K ULTRA HD SMART ANDROID TV DOLBY VISION ATMOS HDR10+', consigneeName: 'Samsung India Electronics Pvt Ltd', consigneeId: '16701345', consigneeCity: 'Noida', shipperName: 'Samsung Electronics Co Ltd', shipperId: 'SHP-KR-2201', notifyPartyName: 'Samsung Logistics', countryOfOrigin: 'South Korea', portOfDestination: 'INDEL', portOfOrigin: 'KRPUS', quantity: 3000, quantityUnit: 'PCS', valueUSD: 450000, weightKg: 18000, billOfLadingNo: 'BOE-2026-IN-00621-DUP', isDuplicate: true, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // Banking entity example
  { id: 'SHP020', date: generateDate(95), dataType: 'import', hsnCode: '85183090', productDescription: 'WIRELESS SPEAKER PORTABLE BLUETOOTH JBL CHARGE 5 WATERPROOF', consigneeName: 'HDFC Bank Ltd', consigneeId: '16770001', consigneeCity: 'Mumbai', shipperName: 'Harman International', shipperId: 'SHP-US-3301', notifyPartyName: 'HDFC Bank Trade Finance', countryOfOrigin: 'United States', portOfDestination: 'INNSA', portOfOrigin: 'USNYC', quantity: 5000, quantityUnit: 'PCS', valueUSD: 325000, weightKg: 4500, billOfLadingNo: 'BOE-2026-IN-00655', isDuplicate: false, isBankingEntity: true, isShippingEntity: false, isToOrder: false },
  // To Order example
  { id: 'SHP021', date: generateDate(100), dataType: 'import', hsnCode: '85414011', productDescription: 'SOLAR CELLS POLYCRYSTALLINE 166MM SIZE PHOTOVOLTAIC CELL', consigneeName: 'TO ORDER', consigneeId: 'N/A', consigneeCity: 'N/A', shipperName: 'Trina Solar Co Ltd', shipperId: 'SHP-CN-5567', notifyPartyName: 'N/A', countryOfOrigin: 'China', portOfDestination: 'INNSA', portOfOrigin: 'CNSHA', quantity: 30000, quantityUnit: 'PCS', valueUSD: 510000, weightKg: 12000, billOfLadingNo: 'BOE-2026-IN-00678', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: true },
  // Shipping entity example
  { id: 'SHP022', date: generateDate(105), dataType: 'import', hsnCode: '85177090', productDescription: 'MOBILE PHONE TEMPERED GLASS SCREEN PROTECTOR 9H HARDNESS MIXED MODELS', consigneeName: 'DHL Supply Chain India', consigneeId: '16780045', consigneeCity: 'Mumbai', shipperName: 'Shenzhen Moko Technology', shipperId: 'SHP-CN-9934', notifyPartyName: 'DHL Global Forwarding', countryOfOrigin: 'China', portOfDestination: 'INNSA', portOfOrigin: 'CNSZX', quantity: 100000, quantityUnit: 'PCS', valueUSD: 25000, weightKg: 1500, billOfLadingNo: 'BOE-2026-IN-00701', isDuplicate: false, isBankingEntity: false, isShippingEntity: true, isToOrder: false },
  // More agricultural exports
  { id: 'SHP023', date: generateDate(110), dataType: 'export', hsnCode: '09103010', productDescription: 'TURMERIC WHOLE DRIED FINGER SALEM VARIETY CURCUMIN 3% MIN MOISTURE 10% MAX', consigneeName: 'McCormick & Company Inc', consigneeId: '16790122', consigneeCity: 'Baltimore', shipperName: 'Everest Spices Pvt Ltd', shipperId: 'SHP-IN-7745', notifyPartyName: 'McCormick Logistics', countryOfOrigin: 'India', portOfDestination: 'USNYC', portOfOrigin: 'INMAA', quantity: 80000, quantityUnit: 'KGS', valueUSD: 176000, weightKg: 80000, billOfLadingNo: 'BOE-2026-EX-00178', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP024', date: generateDate(115), dataType: 'export', hsnCode: '10063020', productDescription: 'BASMATI RICE TRADITIONAL AGED 2 YEARS EXTRA LONG GRAIN PURITY 98%', consigneeName: 'Carrefour SA', consigneeId: '16800234', consigneeCity: 'Paris', shipperName: 'India Gate Foods', shipperId: 'SHP-IN-8834', notifyPartyName: 'Carrefour Supply Chain', countryOfOrigin: 'India', portOfDestination: 'DEHAM', portOfOrigin: 'INNSA', quantity: 100000, quantityUnit: 'KGS', valueUSD: 190000, weightKg: 100000, billOfLadingNo: 'BOE-2026-EX-00192', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // More imports - varied
  { id: 'SHP025', date: generateDate(120), dataType: 'import', hsnCode: '85395000', productDescription: 'LED TUBE LIGHT T8 20W 4FT COOL WHITE 6500K RETROFIT COMPATIBLE COMMERCIAL GRADE', consigneeName: 'Wipro Lighting', consigneeId: '16810567', consigneeCity: 'Bangalore', shipperName: 'Haier Smart Home Co Ltd', shipperId: 'SHP-CN-6601', notifyPartyName: 'Wipro Consumer Care', countryOfOrigin: 'China', portOfDestination: 'INMAA', portOfOrigin: 'CNNBO', quantity: 50000, quantityUnit: 'PCS', valueUSD: 67500, weightKg: 8500, billOfLadingNo: 'BOE-2026-IN-00734', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP026', date: generateDate(125), dataType: 'import', hsnCode: '62052000', productDescription: 'COTTON KNITTED FABRIC JERSEY 180GSM SOLID DYED T-SHIRT MATERIAL', consigneeName: 'Page Industries Ltd', consigneeId: '16820890', consigneeCity: 'Bangalore', shipperName: 'Viyellatex Group', shipperId: 'SHP-BD-2203', notifyPartyName: 'Page Industries Logistics', countryOfOrigin: 'Bangladesh', portOfDestination: 'INMAA', portOfOrigin: 'BDDAC', quantity: 60000, quantityUnit: 'MTR', valueUSD: 108000, weightKg: 7800, billOfLadingNo: 'BOE-2026-IN-00762', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP027', date: generateDate(130), dataType: 'import', hsnCode: '85177090', productDescription: 'ELECTRONIC COMPONENTS SEMICONDUCTOR CHIPS IC INTEGRATED CIRCUITS MIXED LOT', consigneeName: 'Bosch Ltd', consigneeId: '16688901', consigneeCity: 'Bangalore', shipperName: 'Foxconn Technology Group', shipperId: 'SHP-TW-5501', notifyPartyName: 'DB Schenker India', countryOfOrigin: 'Taiwan', portOfDestination: 'INMAA', portOfOrigin: 'TWISL', quantity: 500000, quantityUnit: 'PCS', valueUSD: 980000, weightKg: 1200, billOfLadingNo: 'BOE-2026-IN-00789', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP028', date: generateDate(135), dataType: 'import', hsnCode: '85183011', productDescription: 'BLUETOOTH HEADSET NECKBAND STYLE WIRELESS EARPHONE WITH MIC SPORT MODEL', consigneeName: 'Flipkart Internet Pvt Ltd', consigneeId: '16761234', consigneeCity: 'Bangalore', shipperName: 'Neway Trading Development Ltd', shipperId: 'SHP-CN-8891', notifyPartyName: 'Flipkart Logistics', countryOfOrigin: 'China', portOfDestination: 'INMAA', portOfOrigin: 'CNSHA', quantity: 25000, quantityUnit: 'PCS', valueUSD: 37500, weightKg: 625, billOfLadingNo: 'BOE-2026-IN-00812', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // Turkish imports
  { id: 'SHP029', date: generateDate(140), dataType: 'import', hsnCode: '85285900', productDescription: 'LED TV 43 INCH FULL HD SMART TV ANDROID 11 BUILT-IN WIFI HDMI USB', consigneeName: 'Amazon Seller Services', consigneeId: '16751001', consigneeCity: 'Bangalore', shipperName: 'Vestel Elektronik AS', shipperId: 'SHP-TR-1105', notifyPartyName: 'Amazon Transportation', countryOfOrigin: 'Turkey', portOfDestination: 'INMAA', portOfOrigin: 'TRIST', quantity: 2000, quantityUnit: 'PCS', valueUSD: 180000, weightKg: 10000, billOfLadingNo: 'BOE-2026-IN-00845', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // Vietnam imports
  { id: 'SHP030', date: generateDate(145), dataType: 'import', hsnCode: '62052000', productDescription: 'COTTON SHIRT MEN FORMAL FULL SLEEVE REGULAR FIT ASSORTED DESIGNS', consigneeName: 'Raymond Ltd', consigneeId: '16645321', consigneeCity: 'Mumbai', shipperName: 'Viet Tien Garment JSC', shipperId: 'SHP-VN-3345', notifyPartyName: 'Raymond Trading', countryOfOrigin: 'Vietnam', portOfDestination: 'INNSA', portOfOrigin: 'VNSGN', quantity: 15000, quantityUnit: 'PCS', valueUSD: 82500, weightKg: 3000, billOfLadingNo: 'BOE-2026-IN-00878', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // More exports
  { id: 'SHP031', date: generateDate(150), dataType: 'export', hsnCode: '09103010', productDescription: 'TURMERIC POWDER ORGANIC CERTIFIED USDA NOP CURCUMIN 5% BULK PACKING 25KG BAGS', consigneeName: 'Walmart Inc', consigneeId: '16850567', consigneeCity: 'Bentonville', shipperName: 'Synthite Industries Ltd', shipperId: 'SHP-IN-9901', notifyPartyName: 'Walmart Global Sourcing', countryOfOrigin: 'India', portOfDestination: 'USLAX', portOfOrigin: 'INMAA', quantity: 40000, quantityUnit: 'KGS', valueUSD: 112000, weightKg: 40000, billOfLadingNo: 'BOE-2026-EX-00221', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP032', date: generateDate(155), dataType: 'export', hsnCode: '85177090', productDescription: 'ELECTRONIC PCB ASSEMBLED CIRCUIT BOARD COMMUNICATION MODULE 4G LTE', consigneeName: 'Ericsson AB', consigneeId: '16860234', consigneeCity: 'Stockholm', shipperName: 'Tata Communications Ltd', shipperId: 'SHP-IN-6678', notifyPartyName: 'Ericsson Supply Chain', countryOfOrigin: 'India', portOfDestination: 'DEHAM', portOfOrigin: 'INMAA', quantity: 10000, quantityUnit: 'PCS', valueUSD: 340000, weightKg: 800, billOfLadingNo: 'BOE-2026-EX-00245', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  // More variety
  { id: 'SHP033', date: generateDate(160), dataType: 'import', hsnCode: '85183090', productDescription: 'GAMING HEADSET WITH RGB LIGHT 7.1 SURROUND SOUND USB WIRED PC HEADPHONE', consigneeName: 'Neelkant Crockery Emporium', consigneeId: '16657478', consigneeCity: 'New Delhi', shipperName: 'Direction Technology HK Co Ltd', shipperId: 'SHP-HK-7722', notifyPartyName: 'AP Shipping Lines', countryOfOrigin: 'China', portOfDestination: 'INDEL', portOfOrigin: 'CNSZX', quantity: 8000, quantityUnit: 'PCS', valueUSD: 32000, weightKg: 960, billOfLadingNo: 'BOE-2026-IN-00912', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP034', date: generateDate(170), dataType: 'import', hsnCode: '85414011', productDescription: 'SOLAR MODULE 440W MONO PERC TIER-1 BRAND WITH 25 YEAR WARRANTY CERTIFIED', consigneeName: 'Tata Power Solar Systems', consigneeId: '16655890', consigneeCity: 'Bangalore', shipperName: 'Longi Green Energy Technology', shipperId: 'SHP-CN-3301', notifyPartyName: 'Maersk Line India', countryOfOrigin: 'China', portOfDestination: 'INMAA', portOfOrigin: 'CNSHA', quantity: 8000, quantityUnit: 'PCS', valueUSD: 528000, weightKg: 20000, billOfLadingNo: 'BOE-2026-IN-00948', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP035', date: generateDate(180), dataType: 'import', hsnCode: '85183011', productDescription: 'HD CLARITY PURE SOUND HEADPHONE OVER EAR WIRELESS BT 5.0 FOLDABLE', consigneeName: 'Mahavideh Enterprises', consigneeId: '16677192', consigneeCity: 'Mumbai', shipperName: 'Shenzhen Moko Technology', shipperId: 'SHP-CN-9934', notifyPartyName: 'Rapid Cargo Services', countryOfOrigin: 'China', portOfDestination: 'INNSA', portOfOrigin: 'CNSZX', quantity: 12000, quantityUnit: 'PCS', valueUSD: 36000, weightKg: 1440, billOfLadingNo: 'BOE-2026-IN-00978', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP036', date: generateDate(190), dataType: 'export', hsnCode: '62052000', productDescription: 'COTTON GARMENTS READY MADE MENS CASUAL SHIRTS PREMIUM QUALITY EXPORT GRADE', consigneeName: 'H&M Hennes & Mauritz AB', consigneeId: '16870345', consigneeCity: 'Stockholm', shipperName: 'Arvind Ltd', shipperId: 'SHP-IN-5534', notifyPartyName: 'H&M Supply Chain', countryOfOrigin: 'India', portOfDestination: 'DEHAM', portOfOrigin: 'INNSA', quantity: 30000, quantityUnit: 'PCS', valueUSD: 195000, weightKg: 4500, billOfLadingNo: 'BOE-2026-EX-00278', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP037', date: generateDate(200), dataType: 'import', hsnCode: '85177090', productDescription: 'MOBILE PHONE BACK COVER CASE TPU SILICONE MIXED MODELS IPHONE SAMSUNG', consigneeName: 'Amazon Seller Services', consigneeId: '16751001', consigneeCity: 'Bangalore', shipperName: 'Neway Trading Development Ltd', shipperId: 'SHP-CN-8891', notifyPartyName: 'Amazon Transportation', countryOfOrigin: 'China', portOfDestination: 'INMAA', portOfOrigin: 'CNSHA', quantity: 200000, quantityUnit: 'PCS', valueUSD: 40000, weightKg: 3000, billOfLadingNo: 'BOE-2026-IN-01012', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP038', date: generateDate(210), dataType: 'import', hsnCode: '85395000', productDescription: 'LED PANEL LIGHT 40W 600X600MM SURFACE MOUNT OFFICE CEILING LIGHT 6000K', consigneeName: 'Wipro Lighting', consigneeId: '16810567', consigneeCity: 'Bangalore', shipperName: 'Haier Smart Home Co Ltd', shipperId: 'SHP-CN-6601', notifyPartyName: 'Wipro Consumer Care', countryOfOrigin: 'China', portOfDestination: 'INMAA', portOfOrigin: 'CNNBO', quantity: 10000, quantityUnit: 'PCS', valueUSD: 45000, weightKg: 4000, billOfLadingNo: 'BOE-2026-IN-01045', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP039', date: generateDate(220), dataType: 'export', hsnCode: '10063020', productDescription: 'BASMATI RICE 1121 RAW WHITE SELLA GRAIN LENGTH 8.4MM EXPORT QUALITY', consigneeName: 'Metro AG', consigneeId: '16880456', consigneeCity: 'Dusseldorf', shipperName: 'KRBL Ltd', shipperId: 'SHP-IN-8812', notifyPartyName: 'Metro Cash & Carry', countryOfOrigin: 'India', portOfDestination: 'DEHAM', portOfOrigin: 'INNSA', quantity: 300000, quantityUnit: 'KGS', valueUSD: 420000, weightKg: 300000, billOfLadingNo: 'BOE-2026-EX-00312', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP040', date: generateDate(230), dataType: 'import', hsnCode: '85285900', productDescription: 'SMART TV 32 INCH HD READY LED TV ANDROID 9 WITH GOOGLE ASSISTANT', consigneeName: 'Reliance Digital', consigneeId: '16690112', consigneeCity: 'Mumbai', shipperName: 'Vestel Elektronik AS', shipperId: 'SHP-TR-1105', notifyPartyName: 'Reliance Jio Logistics', countryOfOrigin: 'Turkey', portOfDestination: 'INNSA', portOfOrigin: 'TRIST', quantity: 5000, quantityUnit: 'PCS', valueUSD: 275000, weightKg: 15000, billOfLadingNo: 'BOE-2026-IN-01078', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP041', date: generateDate(240), dataType: 'import', hsnCode: '85183011', productDescription: 'WIRED EARPHONE WITH MIC 3.5MM JACK STEREO IN-EAR HEADPHONE BULK PACK', consigneeName: 'Flipkart Internet Pvt Ltd', consigneeId: '16761234', consigneeCity: 'Bangalore', shipperName: 'Shenzhen Moko Technology', shipperId: 'SHP-CN-9934', notifyPartyName: 'Flipkart Logistics', countryOfOrigin: 'China', portOfDestination: 'INMAA', portOfOrigin: 'CNSZX', quantity: 50000, quantityUnit: 'PCS', valueUSD: 25000, weightKg: 1250, billOfLadingNo: 'BOE-2026-IN-01112', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP042', date: generateDate(250), dataType: 'export', hsnCode: '09103010', productDescription: 'TURMERIC FINGERS WHOLE DRIED ERODE VARIETY HIGH QUALITY EXPORT STANDARD', consigneeName: 'Rewe Group', consigneeId: '16890567', consigneeCity: 'Cologne', shipperName: 'Everest Spices Pvt Ltd', shipperId: 'SHP-IN-7745', notifyPartyName: 'Rewe Distribution', countryOfOrigin: 'India', portOfDestination: 'DEHAM', portOfOrigin: 'INMAA', quantity: 60000, quantityUnit: 'KGS', valueUSD: 138000, weightKg: 60000, billOfLadingNo: 'BOE-2026-EX-00345', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP043', date: generateDate(260), dataType: 'import', hsnCode: '85414011', productDescription: 'SOLAR INVERTER 5KW HYBRID ON-GRID OFF-GRID MPPT CHARGE CONTROLLER BUILT-IN', consigneeName: 'Adani Solar Energy', consigneeId: '16699234', consigneeCity: 'Ahmedabad', shipperName: 'Sungrow Power Supply', shipperId: 'SHP-CN-4456', notifyPartyName: 'Adani Logistics', countryOfOrigin: 'China', portOfDestination: 'INBOM', portOfOrigin: 'CNSHA', quantity: 3000, quantityUnit: 'PCS', valueUSD: 255000, weightKg: 9000, billOfLadingNo: 'BOE-2026-IN-01145', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP044', date: generateDate(270), dataType: 'import', hsnCode: '62052000', productDescription: 'DENIM FABRIC 100% COTTON INDIGO DYED 12OZ WEIGHT SELVEDGE QUALITY', consigneeName: 'Arvind Ltd', consigneeId: '16656789', consigneeCity: 'Ahmedabad', shipperName: 'Nisha Fabrics Ltd', shipperId: 'SHP-BD-1102', notifyPartyName: 'Arvind Supply Chain', countryOfOrigin: 'Bangladesh', portOfDestination: 'INBOM', portOfOrigin: 'BDDAC', quantity: 30000, quantityUnit: 'MTR', valueUSD: 75000, weightKg: 5400, billOfLadingNo: 'BOE-2026-IN-01178', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP045', date: generateDate(280), dataType: 'export', hsnCode: '85177090', productDescription: 'TELECOM EQUIPMENT 5G BASE STATION ANTENNA UNIT MASSIVE MIMO 64T64R', consigneeName: 'Vodafone Group Plc', consigneeId: '16900678', consigneeCity: 'London', shipperName: 'Tata Communications Ltd', shipperId: 'SHP-IN-6678', notifyPartyName: 'Vodafone Procurement', countryOfOrigin: 'India', portOfDestination: 'GBLON', portOfOrigin: 'INMAA', quantity: 500, quantityUnit: 'PCS', valueUSD: 750000, weightKg: 5000, billOfLadingNo: 'BOE-2026-EX-00378', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP046', date: generateDate(290), dataType: 'import', hsnCode: '85183090', productDescription: 'SOUNDBAR 2.1 CHANNEL WITH SUBWOOFER BLUETOOTH HDMI ARC DOLBY AUDIO', consigneeName: 'Reliance Digital', consigneeId: '16690112', consigneeCity: 'Mumbai', shipperName: 'LG Electronics Inc', shipperId: 'SHP-KR-2245', notifyPartyName: 'LG India Logistics', countryOfOrigin: 'South Korea', portOfDestination: 'INNSA', portOfOrigin: 'KRPUS', quantity: 4000, quantityUnit: 'PCS', valueUSD: 200000, weightKg: 6000, billOfLadingNo: 'BOE-2026-IN-01212', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP047', date: generateDate(300), dataType: 'import', hsnCode: '85395000', productDescription: 'LED STRIP LIGHT 5M ROLL RGB COLOR CHANGING SMART WIFI CONTROL WATERPROOF IP65', consigneeName: 'Amazon Seller Services', consigneeId: '16751001', consigneeCity: 'Bangalore', shipperName: 'Haier Smart Home Co Ltd', shipperId: 'SHP-CN-6601', notifyPartyName: 'Amazon Transportation', countryOfOrigin: 'China', portOfDestination: 'INMAA', portOfOrigin: 'CNNBO', quantity: 30000, quantityUnit: 'PCS', valueUSD: 39000, weightKg: 2100, billOfLadingNo: 'BOE-2026-IN-01245', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP048', date: generateDate(310), dataType: 'export', hsnCode: '10063020', productDescription: 'BASMATI RICE PREMIUM AGED 1121 GOLDEN SELLA EXTRA LONG GRAIN EXPORT GRADE', consigneeName: 'Costco Wholesale Corp', consigneeId: '16910789', consigneeCity: 'Seattle', shipperName: 'LT Foods Ltd', shipperId: 'SHP-IN-8823', notifyPartyName: 'Costco Logistics', countryOfOrigin: 'India', portOfDestination: 'USLAX', portOfOrigin: 'INNSA', quantity: 250000, quantityUnit: 'KGS', valueUSD: 375000, weightKg: 250000, billOfLadingNo: 'BOE-2026-EX-00412', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP049', date: generateDate(340), dataType: 'import', hsnCode: '85177090', productDescription: 'SMART WATCH FITNESS TRACKER HEART RATE MONITOR BLOOD OXYGEN SPO2 GPS', consigneeName: 'Samsung India Electronics Pvt Ltd', consigneeId: '16701345', consigneeCity: 'Noida', shipperName: 'Samsung Electronics Co Ltd', shipperId: 'SHP-KR-2201', notifyPartyName: 'Samsung Logistics', countryOfOrigin: 'South Korea', portOfDestination: 'INDEL', portOfOrigin: 'KRPUS', quantity: 20000, quantityUnit: 'PCS', valueUSD: 400000, weightKg: 600, billOfLadingNo: 'BOE-2026-IN-01278', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
  { id: 'SHP050', date: generateDate(360), dataType: 'export', hsnCode: '62052000', productDescription: 'COTTON BEDSHEET SET KING SIZE 400TC PREMIUM SATIN FINISH EXPORT QUALITY PACK OF 4', consigneeName: 'IKEA Supply AG', consigneeId: '16920890', consigneeCity: 'Zurich', shipperName: 'Welspun India Ltd', shipperId: 'SHP-IN-5578', notifyPartyName: 'IKEA Trading', countryOfOrigin: 'India', portOfDestination: 'DEHAM', portOfOrigin: 'INNSA', quantity: 20000, quantityUnit: 'PCS', valueUSD: 160000, weightKg: 6000, billOfLadingNo: 'BOE-2026-EX-00445', isDuplicate: false, isBankingEntity: false, isShippingEntity: false, isToOrder: false },
];

// ─── Helper: simulate async delay ─────────────────────────

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Helper: match search terms ───────────────────────────

function matchesSearch(value: string, terms: string[], operator: string): boolean {
  const lower = value.toLowerCase();
  return terms.some(term => {
    const t = term.toLowerCase();
    switch (operator) {
      case 'exact': return lower === t;
      case 'startsWith': return lower.startsWith(t);
      case 'contains':
      default: return lower.includes(t);
    }
  });
}

// ─── Service Class ────────────────────────────────────────

class EximDataService {

  async searchShipments(
    params: EximSearchParams,
    filters: EximSidebarFilters,
    page: number = 1,
    sortField: string = 'date',
    sortDir: string = 'desc'
  ): Promise<{ shipments: ShipmentRecord[]; totalCount: number; page: number; pageSize: number }> {
    await delay();

    let results = [...mockShipments];

    // Filter by data type
    if (params.dataType) {
      results = results.filter(s => s.dataType === params.dataType);
    }

    // Filter by search terms
    if (params.searchTerms.length > 0 && params.searchTerms[0] !== '') {
      results = results.filter(s => {
        switch (params.searchField) {
          case 'product': return matchesSearch(s.productDescription, params.searchTerms, params.operator);
          case 'hsnCode': return matchesSearch(s.hsnCode, params.searchTerms, params.operator);
          case 'consignee': return matchesSearch(s.consigneeName, params.searchTerms, params.operator);
          case 'shipper': return matchesSearch(s.shipperName, params.searchTerms, params.operator);
          default: return true;
        }
      });
    }

    // Date range filter
    if (params.dateFrom) {
      results = results.filter(s => s.date >= params.dateFrom);
    }
    if (params.dateTo) {
      results = results.filter(s => s.date <= params.dateTo);
    }

    // Sidebar filter toggles
    if (filters.removeDuplicates) {
      results = results.filter(s => !s.isDuplicate);
    }
    if (filters.removeToOrder) {
      results = results.filter(s => !s.isToOrder);
    }
    if (filters.removeBankingEntity) {
      results = results.filter(s => !s.isBankingEntity);
    }
    if (filters.removeShippingEntity) {
      results = results.filter(s => !s.isShippingEntity);
    }

    // Consignee/shipper name filters
    if (filters.consigneeFilter.length > 0) {
      results = results.filter(s => filters.consigneeFilter.includes(s.consigneeName));
    }
    if (filters.shipperFilter.length > 0) {
      results = results.filter(s => filters.shipperFilter.includes(s.shipperName));
    }

    // Sort
    results.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'date': cmp = a.date.localeCompare(b.date); break;
        case 'valueUSD': cmp = a.valueUSD - b.valueUSD; break;
        case 'quantity': cmp = a.quantity - b.quantity; break;
        case 'consigneeName': cmp = a.consigneeName.localeCompare(b.consigneeName); break;
        case 'shipperName': cmp = a.shipperName.localeCompare(b.shipperName); break;
        case 'hsnCode': cmp = a.hsnCode.localeCompare(b.hsnCode); break;
        default: cmp = a.date.localeCompare(b.date);
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    const totalCount = results.length;
    const start = (page - 1) * RESULTS_PER_PAGE;
    const paged = results.slice(start, start + RESULTS_PER_PAGE);

    return { shipments: paged, totalCount, page, pageSize: RESULTS_PER_PAGE };
  }

  async getStats(params: EximSearchParams): Promise<EximStats> {
    await delay(150);

    let results = [...mockShipments];
    if (params.dataType) results = results.filter(s => s.dataType === params.dataType);
    if (params.searchTerms.length > 0 && params.searchTerms[0] !== '') {
      results = results.filter(s => {
        switch (params.searchField) {
          case 'product': return matchesSearch(s.productDescription, params.searchTerms, params.operator);
          case 'hsnCode': return matchesSearch(s.hsnCode, params.searchTerms, params.operator);
          case 'consignee': return matchesSearch(s.consigneeName, params.searchTerms, params.operator);
          case 'shipper': return matchesSearch(s.shipperName, params.searchTerms, params.operator);
          default: return true;
        }
      });
    }

    return {
      shipments: results.length,
      consignees: new Set(results.map(s => s.consigneeId)).size,
      shippers: new Set(results.map(s => s.shipperId)).size,
      countriesOfOrigin: new Set(results.map(s => s.countryOfOrigin)).size,
      portsOfDestination: new Set(results.map(s => s.portOfDestination)).size,
      hsCodes: new Set(results.map(s => s.hsnCode)).size,
      notifyParties: new Set(results.map(s => s.notifyPartyName)).size,
    };
  }

  async getConsignees(params: EximSearchParams): Promise<TraderSummary[]> {
    await delay();

    let results = [...mockShipments];
    if (params.dataType) results = results.filter(s => s.dataType === params.dataType);
    if (params.searchTerms.length > 0 && params.searchTerms[0] !== '') {
      results = results.filter(s => {
        switch (params.searchField) {
          case 'product': return matchesSearch(s.productDescription, params.searchTerms, params.operator);
          case 'hsnCode': return matchesSearch(s.hsnCode, params.searchTerms, params.operator);
          case 'consignee': return matchesSearch(s.consigneeName, params.searchTerms, params.operator);
          case 'shipper': return matchesSearch(s.shipperName, params.searchTerms, params.operator);
          default: return true;
        }
      });
    }

    const grouped = new Map<string, ShipmentRecord[]>();
    results.forEach(s => {
      if (!grouped.has(s.consigneeId)) grouped.set(s.consigneeId, []);
      grouped.get(s.consigneeId)!.push(s);
    });

    const traders: TraderSummary[] = [];
    grouped.forEach((shipments, id) => {
      const first = shipments[0];
      const sorted = [...shipments].sort((a, b) => a.date.localeCompare(b.date));
      const productCounts = new Map<string, number>();
      const hsCounts = new Map<string, number>();
      const countryCounts = new Map<string, number>();
      shipments.forEach(s => {
        const prod = s.productDescription.substring(0, 40);
        productCounts.set(prod, (productCounts.get(prod) || 0) + 1);
        hsCounts.set(s.hsnCode, (hsCounts.get(s.hsnCode) || 0) + 1);
        countryCounts.set(s.countryOfOrigin, (countryCounts.get(s.countryOfOrigin) || 0) + 1);
      });

      traders.push({
        id,
        name: first.consigneeName,
        country: 'India',
        city: first.consigneeCity,
        totalShipments: shipments.length,
        totalValueUSD: shipments.reduce((sum, s) => sum + s.valueUSD, 0),
        topProducts: Array.from(productCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
        topHSCodes: Array.from(hsCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
        topPartnerCountries: Array.from(countryCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
        firstShipmentDate: sorted[0].date,
        lastShipmentDate: sorted[sorted.length - 1].date,
      });
    });

    return traders.sort((a, b) => b.totalShipments - a.totalShipments);
  }

  async getShippers(params: EximSearchParams): Promise<TraderSummary[]> {
    await delay();

    let results = [...mockShipments];
    if (params.dataType) results = results.filter(s => s.dataType === params.dataType);
    if (params.searchTerms.length > 0 && params.searchTerms[0] !== '') {
      results = results.filter(s => {
        switch (params.searchField) {
          case 'product': return matchesSearch(s.productDescription, params.searchTerms, params.operator);
          case 'hsnCode': return matchesSearch(s.hsnCode, params.searchTerms, params.operator);
          case 'consignee': return matchesSearch(s.consigneeName, params.searchTerms, params.operator);
          case 'shipper': return matchesSearch(s.shipperName, params.searchTerms, params.operator);
          default: return true;
        }
      });
    }

    const grouped = new Map<string, ShipmentRecord[]>();
    results.forEach(s => {
      if (!grouped.has(s.shipperId)) grouped.set(s.shipperId, []);
      grouped.get(s.shipperId)!.push(s);
    });

    const traders: TraderSummary[] = [];
    grouped.forEach((shipments, id) => {
      const first = shipments[0];
      const sorted = [...shipments].sort((a, b) => a.date.localeCompare(b.date));
      const productCounts = new Map<string, number>();
      const hsCounts = new Map<string, number>();
      const countryCounts = new Map<string, number>();
      shipments.forEach(s => {
        const prod = s.productDescription.substring(0, 40);
        productCounts.set(prod, (productCounts.get(prod) || 0) + 1);
        hsCounts.set(s.hsnCode, (hsCounts.get(s.hsnCode) || 0) + 1);
        countryCounts.set(s.portOfDestination, (countryCounts.get(s.portOfDestination) || 0) + 1);
      });

      traders.push({
        id,
        name: first.shipperName,
        country: first.countryOfOrigin,
        city: '',
        totalShipments: shipments.length,
        totalValueUSD: shipments.reduce((sum, s) => sum + s.valueUSD, 0),
        topProducts: Array.from(productCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
        topHSCodes: Array.from(hsCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
        topPartnerCountries: Array.from(countryCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
        firstShipmentDate: sorted[0].date,
        lastShipmentDate: sorted[sorted.length - 1].date,
      });
    });

    return traders.sort((a, b) => b.totalShipments - a.totalShipments);
  }

  async getCountryBreakdown(params: EximSearchParams): Promise<CountryBreakdown[]> {
    await delay(200);

    let results = [...mockShipments];
    if (params.dataType) results = results.filter(s => s.dataType === params.dataType);
    if (params.searchTerms.length > 0 && params.searchTerms[0] !== '') {
      results = results.filter(s => matchesSearch(s.productDescription, params.searchTerms, params.operator));
    }

    const grouped = new Map<string, { shipments: number; value: number }>();
    results.forEach(s => {
      const country = s.countryOfOrigin;
      const existing = grouped.get(country) || { shipments: 0, value: 0 };
      grouped.set(country, { shipments: existing.shipments + 1, value: existing.value + s.valueUSD });
    });

    const totalValue = results.reduce((sum, s) => sum + s.valueUSD, 0);
    const breakdown: CountryBreakdown[] = [];
    grouped.forEach((data, country) => {
      breakdown.push({
        country,
        shipments: data.shipments,
        valueUSD: data.value,
        percentage: totalValue > 0 ? Math.round((data.value / totalValue) * 1000) / 10 : 0,
      });
    });

    return breakdown.sort((a, b) => b.valueUSD - a.valueUSD);
  }

  async getHSCodeBreakdown(params: EximSearchParams): Promise<HSCodeBreakdown[]> {
    await delay(200);

    let results = [...mockShipments];
    if (params.dataType) results = results.filter(s => s.dataType === params.dataType);
    if (params.searchTerms.length > 0 && params.searchTerms[0] !== '') {
      results = results.filter(s => matchesSearch(s.productDescription, params.searchTerms, params.operator));
    }

    const grouped = new Map<string, { shipments: ShipmentRecord[] }>();
    results.forEach(s => {
      if (!grouped.has(s.hsnCode)) grouped.set(s.hsnCode, { shipments: [] });
      grouped.get(s.hsnCode)!.shipments.push(s);
    });

    const breakdown: HSCodeBreakdown[] = [];
    grouped.forEach((data, code) => {
      const consigneeCounts = new Map<string, number>();
      data.shipments.forEach(s => {
        consigneeCounts.set(s.consigneeName, (consigneeCounts.get(s.consigneeName) || 0) + 1);
      });

      breakdown.push({
        hsnCode: code,
        description: data.shipments[0].productDescription.substring(0, 60),
        shipments: data.shipments.length,
        valueUSD: data.shipments.reduce((sum, s) => sum + s.valueUSD, 0),
        topConsignees: Array.from(consigneeCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
      });
    });

    return breakdown.sort((a, b) => b.valueUSD - a.valueUSD);
  }

  async getTraderDetail(id: string, role: 'consignee' | 'shipper'): Promise<TraderDetail | null> {
    await delay();

    const shipments = mockShipments.filter(s =>
      role === 'consignee' ? s.consigneeId === id : s.shipperId === id
    );

    if (shipments.length === 0) return null;

    const first = shipments[0];
    const sorted = [...shipments].sort((a, b) => a.date.localeCompare(b.date));

    // Monthly volume
    const monthlyMap = new Map<string, { value: number; shipments: number }>();
    shipments.forEach(s => {
      const month = s.date.substring(0, 7);
      const existing = monthlyMap.get(month) || { value: 0, shipments: 0 };
      monthlyMap.set(month, { value: existing.value + s.valueUSD, shipments: existing.shipments + 1 });
    });
    const monthlyVolume = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Product breakdown
    const productMap = new Map<string, { hsnCode: string; value: number }>();
    shipments.forEach(s => {
      const prod = s.productDescription.substring(0, 50);
      const existing = productMap.get(prod) || { hsnCode: s.hsnCode, value: 0 };
      productMap.set(prod, { hsnCode: existing.hsnCode, value: existing.value + s.valueUSD });
    });
    const totalValue = shipments.reduce((sum, s) => sum + s.valueUSD, 0);
    const productBreakdown = Array.from(productMap.entries())
      .map(([product, data]) => ({
        product,
        hsnCode: data.hsnCode,
        value: data.value,
        percentage: Math.round((data.value / totalValue) * 1000) / 10,
      }))
      .sort((a, b) => b.value - a.value);

    // Country breakdown
    const countryMap = new Map<string, number>();
    shipments.forEach(s => {
      const country = role === 'consignee' ? s.countryOfOrigin : s.portOfDestination;
      countryMap.set(country, (countryMap.get(country) || 0) + s.valueUSD);
    });
    const countryBreakdown = Array.from(countryMap.entries())
      .map(([country, value]) => ({
        country,
        value,
        percentage: Math.round((value / totalValue) * 1000) / 10,
      }))
      .sort((a, b) => b.value - a.value);

    // Aggregated info
    const productCounts = new Map<string, number>();
    const hsCounts = new Map<string, number>();
    const partnerCounts = new Map<string, number>();
    shipments.forEach(s => {
      const prod = s.productDescription.substring(0, 40);
      productCounts.set(prod, (productCounts.get(prod) || 0) + 1);
      hsCounts.set(s.hsnCode, (hsCounts.get(s.hsnCode) || 0) + 1);
      const partner = role === 'consignee' ? s.countryOfOrigin : s.portOfDestination;
      partnerCounts.set(partner, (partnerCounts.get(partner) || 0) + 1);
    });

    return {
      id,
      name: role === 'consignee' ? first.consigneeName : first.shipperName,
      country: role === 'consignee' ? 'India' : first.countryOfOrigin,
      city: role === 'consignee' ? first.consigneeCity : '',
      totalShipments: shipments.length,
      totalValueUSD: totalValue,
      topProducts: Array.from(productCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
      topHSCodes: Array.from(hsCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
      topPartnerCountries: Array.from(partnerCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
      firstShipmentDate: sorted[0].date,
      lastShipmentDate: sorted[sorted.length - 1].date,
      recentShipments: sorted.slice(-5).reverse(),
      monthlyVolume,
      productBreakdown,
      countryBreakdown,
    };
  }

  async getSuggestions(field: string, query: string): Promise<SearchSuggestion[]> {
    await delay(150);

    if (!query || query.length < 2) return [];

    const q = query.toLowerCase();
    const suggestions = new Map<string, number>();

    mockShipments.forEach(s => {
      let value = '';
      switch (field) {
        case 'product': value = s.productDescription; break;
        case 'hsnCode': value = s.hsnCode; break;
        case 'consignee': value = s.consigneeName; break;
        case 'shipper': value = s.shipperName; break;
      }
      if (value.toLowerCase().includes(q)) {
        const key = field === 'product' ? value.substring(0, 50) : value;
        suggestions.set(key, (suggestions.get(key) || 0) + 1);
      }
    });

    return Array.from(suggestions.entries())
      .map(([text, matchCount]) => ({ text, type: field as any, matchCount }))
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 8);
  }

  async getUniqueConsignees(): Promise<string[]> {
    return Array.from(new Set(mockShipments.map(s => s.consigneeName))).sort();
  }

  async getUniqueShippers(): Promise<string[]> {
    return Array.from(new Set(mockShipments.map(s => s.shipperName))).sort();
  }

  exportCSV(shipments: ShipmentRecord[]): void {
    const headers = ['Date', 'HS Code', 'Product', 'Consignee', 'Consignee City', 'Shipper', 'Country of Origin', 'Port of Destination', 'Quantity', 'Unit', 'Value (USD)', 'Weight (KG)', 'Bill of Lading'];
    const rows = shipments.map(s => [
      s.date, s.hsnCode, `"${s.productDescription}"`, `"${s.consigneeName}"`, s.consigneeCity,
      `"${s.shipperName}"`, s.countryOfOrigin, s.portOfDestination,
      s.quantity, s.quantityUnit, s.valueUSD, s.weightKg, s.billOfLadingNo,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exim-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const eximDataService = new EximDataService();
