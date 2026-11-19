/**
 * Himanshu Dairy Farm - Preloaded Authentic Demo Data
 * हिमांशु डेयरी फ़ार्म के लिए प्रारंभिक डेटा
 */

const defaultDairyData = {
  settings: {
    dairyName: "हिमांशु डेयरी फ़ार्म एवं दुग्ध केंद्र",
    dairyNameEn: "Himanshu Dairy Farm & Milk Center",
    ownerName: "हिमांशु जी",
    phone: "98765-43210",
    address: "वार्ड नं. 5, किसान चौक, मुख्य मार्ग",
    regNo: "HDF/2026/089",
    buffaloFatMultiplier: 9.0, // ₹9 per fat unit
    cowFatMultiplier: 7.5,
    defaultBuffaloSellRate: 70, // ₹/L
    defaultCowSellRate: 55, // ₹/L
    currency: "₹"
  },

  // Cattle Data (भैंसें एवं अन्य पशु)
  cattle: [
    {
      id: "C-01",
      tagNo: "HDF-101",
      name: "कजरी (Kajri)",
      type: "Buffalo",
      breed: "मुर्राह (Murrah)",
      ageYears: 5,
      lactation: 3, // ब्यांत
      status: "milking", // milking, pregnant, dry, sick
      dailyYield: 17.5, // Total L/day
      morningYield: 9.5,
      eveningYield: 8.0,
      lastCalvingDate: "2026-08-15",
      aiDate: "2026-10-10",
      expectedCalvingDate: "2027-08-16",
      vaccinationStatus: "Up to date (FMD, HS Done)",
      healthNotes: "पूरी तरह स्वस्थ, उच्चतम दुग्ध उत्पादन",
      imageUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "C-02",
      tagNo: "HDF-102",
      name: "लक्ष्मी (Laxmi)",
      type: "Buffalo",
      breed: "मुर्राह (Murrah)",
      ageYears: 6,
      lactation: 4,
      status: "milking",
      dailyYield: 19.0,
      morningYield: 10.5,
      eveningYield: 8.5,
      lastCalvingDate: "2026-09-02",
      aiDate: "",
      expectedCalvingDate: "",
      vaccinationStatus: "Up to date",
      healthNotes: "फार्म की सबसे अधिक दूध देने वाली भैंस",
      imageUrl: "https://images.unsplash.com/photo-1596733430284-f7437764b14d?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "C-03",
      tagNo: "HDF-103",
      name: "काली (Kaali)",
      type: "Buffalo",
      breed: "जाफराबादी (Jafrabadi)",
      ageYears: 4,
      lactation: 2,
      status: "milking",
      dailyYield: 14.5,
      morningYield: 8.0,
      eveningYield: 6.5,
      lastCalvingDate: "2026-07-20",
      aiDate: "",
      expectedCalvingDate: "",
      vaccinationStatus: "Deworming due next week",
      healthNotes: "स्वस्थ, फैट 7.8% के आसपास रहता है",
      imageUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "C-04",
      tagNo: "HDF-104",
      name: "चमेली (Chameli)",
      type: "Buffalo",
      breed: "मुर्राह (Murrah)",
      ageYears: 7,
      lactation: 5,
      status: "pregnant", // गाभिन
      dailyYield: 0,
      morningYield: 0,
      eveningYield: 0,
      lastCalvingDate: "2025-11-10",
      aiDate: "2026-04-12",
      expectedCalvingDate: "2027-02-16",
      vaccinationStatus: "Vaccinated",
      healthNotes: "7 महीने की गाभिन है, सूखा चारा व मिनरल मिक्सचर चालू है",
      imageUrl: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "C-05",
      tagNo: "HDF-105",
      name: "सुल्ताना (Sultana)",
      type: "Buffalo",
      breed: "नीली रावी (Nili Ravi)",
      ageYears: 5,
      lactation: 2,
      status: "milking",
      dailyYield: 15.5,
      morningYield: 8.5,
      eveningYield: 7.0,
      lastCalvingDate: "2026-06-18",
      aiDate: "2026-10-25",
      expectedCalvingDate: "2027-08-31",
      vaccinationStatus: "Done",
      healthNotes: "शांत स्वभाव, समय पर चारा लेती है",
      imageUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "C-06",
      tagNo: "HDF-106",
      name: "गौरी (Gauri)",
      type: "Cow",
      breed: "साहीवाल (Sahiwal)",
      ageYears: 4,
      lactation: 2,
      status: "milking",
      dailyYield: 13.0,
      morningYield: 7.0,
      eveningYield: 6.0,
      lastCalvingDate: "2026-08-01",
      aiDate: "",
      expectedCalvingDate: "",
      vaccinationStatus: "Lumpy Skin Vaccinated",
      healthNotes: "A2 गाय का दूध, बहुत पौष्टिक",
      imageUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "C-07",
      tagNo: "HDF-107",
      name: "बसंती (Basanti)",
      type: "Buffalo",
      breed: "मुर्राह (Murrah)",
      ageYears: 6,
      lactation: 3,
      status: "sick", // बीमार
      dailyYield: 7.0,
      morningYield: 4.0,
      eveningYield: 3.0,
      lastCalvingDate: "2026-05-10",
      aiDate: "",
      expectedCalvingDate: "",
      vaccinationStatus: "Under treatment",
      healthNotes: "हल्का थनैला (Mastitis) का इलाज चल रहा है, एंटीबायोटिक दिया गया",
      imageUrl: "https://images.unsplash.com/photo-1596733430284-f7437764b14d?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "C-08",
      tagNo: "HDF-108",
      name: "गंगा (Ganga)",
      type: "Cow",
      breed: "गीर (Gir)",
      ageYears: 5,
      lactation: 3,
      status: "pregnant",
      dailyYield: 0,
      morningYield: 0,
      eveningYield: 0,
      lastCalvingDate: "2025-12-05",
      aiDate: "2026-05-20",
      expectedCalvingDate: "2027-02-24",
      vaccinationStatus: "Done",
      healthNotes: "गाभिन, सूखी अवस्था में विशेष आहार जारी",
      imageUrl: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=500&auto=format&fit=crop&q=60"
    }
  ],

  // Farmers / Milk Suppliers (दूध देने वाले किसान)
  farmers: [
    {
      id: "F-01",
      code: "K-101",
      name: "रामकिशन यादव (Ramkishan Yadav)",
      village: "रामपुरा",
      phone: "98765-11223",
      defaultType: "Buffalo",
      avgDailyQty: 22.0,
      balancePayable: 4250, // Himanshu owes him
      totalSuppliedLiters: 1350
    },
    {
      id: "F-02",
      code: "K-102",
      name: "सुरेश गुर्जर (Suresh Gurjar)",
      village: "देवली",
      phone: "98234-44556",
      defaultType: "Buffalo",
      avgDailyQty: 18.5,
      balancePayable: 3100,
      totalSuppliedLiters: 980
    },
    {
      id: "F-03",
      code: "K-103",
      name: "बलराम चौधरी (Balram Choudhary)",
      village: "खेड़ी",
      phone: "98989-77889",
      defaultType: "Cow",
      avgDailyQty: 15.0,
      balancePayable: 1850,
      totalSuppliedLiters: 720
    },
    {
      id: "F-04",
      code: "K-104",
      name: "जगदीश मीणा (Jagdish Meena)",
      village: "नयागांव",
      phone: "97850-99887",
      defaultType: "Buffalo",
      avgDailyQty: 12.0,
      balancePayable: 2600,
      totalSuppliedLiters: 640
    }
  ],

  // Customers (दूध ख़रीदने वाले ग्राहक)
  customers: [
    {
      id: "CUST-01",
      code: "G-201",
      name: "शर्मा जी मिष्ठान भंडार (Sharma Sweets)",
      type: "Commercial",
      phone: "98290-12345",
      address: "मेन मार्केट, नज़दीक बस स्टैंड",
      dailyQuota: 30.0,
      ratePerLiter: 72.0,
      balanceReceivable: 6480, // Customer owes Himanshu
      totalPurchasedLiters: 1800
    },
    {
      id: "CUST-02",
      code: "G-202",
      name: "वर्मा जी (Verma Family)",
      type: "Household",
      phone: "99280-55443",
      address: "मकान नं. 45, गांधी नगर",
      dailyQuota: 2.5,
      ratePerLiter: 70.0,
      balanceReceivable: 1200,
      totalPurchasedLiters: 145
    },
    {
      id: "CUST-03",
      code: "G-203",
      name: "होटल कृष्णा (Hotel Krishna)",
      type: "Commercial",
      phone: "98755-66778",
      address: "बाईपास चौराहा",
      dailyQuota: 15.0,
      ratePerLiter: 70.0,
      balanceReceivable: 3500,
      totalPurchasedLiters: 920
    },
    {
      id: "CUST-04",
      code: "G-204",
      name: "गुप्ता जी टी स्टॉल (Gupta Tea)",
      type: "Commercial",
      phone: "97821-33445",
      address: "स्टेशन रोड",
      dailyQuota: 10.0,
      ratePerLiter: 68.0,
      balanceReceivable: 1360,
      totalPurchasedLiters: 580
    },
    {
      id: "CUST-05",
      code: "G-205",
      name: "डॉक्टर सक्सेना (Dr. Saxena)",
      type: "Household",
      phone: "98281-99881",
      address: "सिविल लाइंस, कोठी 12",
      dailyQuota: 3.0,
      ratePerLiter: 75.0,
      balanceReceivable: 675,
      totalPurchasedLiters: 190
    }
  ],

  // Milk Entries (Recent Transactions - Collection & Sales)
  milkEntries: [
    // Today Morning Collection
    {
      id: "M-101",
      date: "2026-11-19",
      shift: "Morning",
      flow: "collection", // 'collection' (In) or 'sale' (Out)
      partyType: "farmer",
      partyId: "F-01",
      partyName: "रामकिशन यादव",
      animal: "Buffalo",
      liters: 12.5,
      fat: 7.2,
      snf: 9.1,
      rate: 64.8,
      totalAmount: 810.0,
      paymentStatus: "credit", // 'paid' or 'credit'
      slipNo: "SLIP-8901",
      timestamp: "06:30 AM"
    },
    {
      id: "M-102",
      date: "2026-11-19",
      shift: "Morning",
      flow: "collection",
      partyType: "farmer",
      partyId: "F-02",
      partyName: "सुरेश गुर्जर",
      animal: "Buffalo",
      liters: 9.8,
      fat: 6.9,
      snf: 8.8,
      rate: 62.1,
      totalAmount: 608.58,
      paymentStatus: "credit",
      slipNo: "SLIP-8902",
      timestamp: "06:45 AM"
    },
    {
      id: "M-103",
      date: "2026-11-19",
      shift: "Morning",
      flow: "collection",
      partyType: "farmer",
      partyId: "F-03",
      partyName: "बलराम चौधरी",
      animal: "Cow",
      liters: 8.0,
      fat: 4.5,
      snf: 8.5,
      rate: 33.75,
      totalAmount: 270.0,
      paymentStatus: "paid",
      slipNo: "SLIP-8903",
      timestamp: "07:05 AM"
    },
    // Own Farm Production Today Morning
    {
      id: "M-104",
      date: "2026-11-19",
      shift: "Morning",
      flow: "farm_production",
      partyType: "own_farm",
      partyId: "FARM",
      partyName: "हिमांशु डेयरी फार्म (अपना उत्पादन)",
      animal: "Buffalo & Cow",
      liters: 52.5,
      fat: 7.4,
      snf: 9.2,
      rate: 70.0,
      totalAmount: 3675.0,
      paymentStatus: "paid",
      slipNo: "FARM-01",
      timestamp: "05:45 AM"
    },
    // Today Morning Sales
    {
      id: "M-105",
      date: "2026-11-19",
      shift: "Morning",
      flow: "sale",
      partyType: "customer",
      partyId: "CUST-01",
      partyName: "शर्मा जी मिष्ठान भंडार",
      animal: "Buffalo",
      liters: 30.0,
      fat: 7.0,
      snf: 9.0,
      rate: 72.0,
      totalAmount: 2160.0,
      paymentStatus: "credit",
      slipNo: "SALE-401",
      timestamp: "07:15 AM"
    },
    {
      id: "M-106",
      date: "2026-11-19",
      shift: "Morning",
      flow: "sale",
      partyType: "customer",
      partyId: "CUST-03",
      partyName: "होटल कृष्णा",
      animal: "Buffalo",
      liters: 15.0,
      fat: 6.8,
      snf: 8.9,
      rate: 70.0,
      totalAmount: 1050.0,
      paymentStatus: "credit",
      slipNo: "SALE-402",
      timestamp: "07:30 AM"
    },
    {
      id: "M-107",
      date: "2026-11-19",
      shift: "Morning",
      flow: "sale",
      partyType: "customer",
      partyId: "CUST-04",
      partyName: "गुप्ता जी टी स्टॉल",
      animal: "Buffalo",
      liters: 10.0,
      fat: 6.5,
      snf: 8.8,
      rate: 68.0,
      totalAmount: 680.0,
      paymentStatus: "paid",
      slipNo: "SALE-403",
      timestamp: "07:45 AM"
    },
    {
      id: "M-108",
      date: "2026-11-19",
      shift: "Morning",
      flow: "sale",
      partyType: "customer",
      partyId: "CUST-02",
      partyName: "वर्मा जी (घर)",
      animal: "Buffalo",
      liters: 2.5,
      fat: 7.2,
      snf: 9.0,
      rate: 70.0,
      totalAmount: 175.0,
      paymentStatus: "credit",
      slipNo: "SALE-404",
      timestamp: "08:00 AM"
    },
    // Yesterday Evening Entries
    {
      id: "M-109",
      date: "2026-11-18",
      shift: "Evening",
      flow: "collection",
      partyType: "farmer",
      partyId: "F-01",
      partyName: "रामकिशन यादव",
      animal: "Buffalo",
      liters: 11.0,
      fat: 7.1,
      snf: 9.0,
      rate: 63.9,
      totalAmount: 702.9,
      paymentStatus: "credit",
      slipNo: "SLIP-8890",
      timestamp: "06:10 PM"
    },
    {
      id: "M-110",
      date: "2026-11-18",
      shift: "Evening",
      flow: "sale",
      partyType: "customer",
      partyId: "CUST-01",
      partyName: "शर्मा जी मिष्ठान भंडार",
      animal: "Buffalo",
      liters: 25.0,
      fat: 7.0,
      snf: 9.0,
      rate: 72.0,
      totalAmount: 1800.0,
      paymentStatus: "credit",
      slipNo: "SALE-395",
      timestamp: "06:40 PM"
    }
  ],

  // Farm Expenses (चारा, दाना, डॉक्टर, मजदूरी)
  expenses: [
    {
      id: "EXP-01",
      date: "2026-11-18",
      category: "Feed & Fodder (दाना/चारा)",
      description: "सरसों की खली - 5 बोरी (Mustard Cake)",
      amount: 8500,
      paidTo: "किसान एग्रो एजेंसी",
      paymentMode: "UPI"
    },
    {
      id: "EXP-02",
      date: "2026-11-17",
      category: "Feed & Fodder (दाना/चारा)",
      description: "गेहूं का सूखा भूसा - 1 ट्रॉली",
      amount: 14000,
      paidTo: "राजेश किसान",
      paymentMode: "Cash"
    },
    {
      id: "EXP-03",
      date: "2026-11-15",
      category: "Veterinary / Doctor (डॉक्टर/दवा)",
      description: "भैंस (बसंती) का इलाज व थनैला की दवा",
      amount: 1200,
      paidTo: "डॉ. शर्मा (पशु चिकित्सक)",
      paymentMode: "Cash"
    },
    {
      id: "EXP-04",
      date: "2026-11-10",
      category: "Labor & Staff (मजदूरी)",
      description: "गोबर सफाई व चारा डालने वाले वर्कर की पगार (अग्रिम)",
      amount: 6000,
      paidTo: "रामू ग्वाला",
      paymentMode: "Cash"
    },
    {
      id: "EXP-05",
      date: "2026-11-05",
      category: "Electricity & Utility (बिजली/पानी)",
      description: "डेयरी चिलर व पंखों का बिजली बिल",
      amount: 3850,
      paidTo: "बिजली बोर्ड",
      paymentMode: "Online"
    }
  ],

  // Khata Payment Transactions (लेन-देन भुगतान लॉग)
  khataTransactions: [
    {
      id: "TX-01",
      date: "2026-11-18",
      type: "received", // customer gave money
      partyName: "होटल कृष्णा",
      partyType: "customer",
      amount: 5000,
      mode: "UPI",
      notes: "साप्ताहिक भुगतान"
    },
    {
      id: "TX-02",
      date: "2026-11-17",
      type: "paid", // Himanshu paid farmer
      partyName: "रामकिशन यादव",
      partyType: "farmer",
      amount: 4000,
      mode: "Cash",
      notes: "दूध का पिछला भुगतान"
    },
    {
      id: "TX-03",
      date: "2026-11-16",
      type: "received",
      partyName: "शर्मा जी मिष्ठान भंडार",
      partyType: "customer",
      amount: 10000,
      mode: "Bank Transfer",
      notes: "एडवांस बिल भुगतान"
    }
  ]
};
