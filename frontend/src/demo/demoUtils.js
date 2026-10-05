import { STORAGE_KEYS, getCollection, findById } from './demoStorage';

/**
 * Format currency in Indian Rupees (₹)
 * E.g., ₹25,000 or ₹1,25,000
 */
export const formatCurrencyINR = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatNumberINR = (amount) => {
  const num = Number(amount) || 0;
  return num.toLocaleString('en-IN');
};

/**
 * Safe date comparison
 */
const isDateInRange = (dateStr, startDate, endDate) => {
  if (!dateStr) return false;
  const d = new Date(dateStr).getTime();
  if (startDate) {
    const s = new Date(startDate).getTime();
    if (d < s) return false;
  }
  if (endDate) {
    const e = new Date(endDate).getTime();
    if (d > e) return false;
  }
  return true;
};

/**
 * Calculate Financial Summary (Income, Expenses, Net Profit)
 */
export const calculateFinancialSummary = (filters = {}) => {
  const { farm_id, field_id, crop_id, livestock_id, start_date, end_date } = filters;

  const expenses = getCollection(STORAGE_KEYS.EXPENSES);
  const income = getCollection(STORAGE_KEYS.INCOME);
  const feedRecords = getCollection(STORAGE_KEYS.FEED_RECORDS);
  const medRecords = getCollection(STORAGE_KEYS.MEDICAL_RECORDS);
  const vacRecords = getCollection(STORAGE_KEYS.VACCINATION_RECORDS);
  const prodRecords = getCollection(STORAGE_KEYS.PRODUCTION_RECORDS);
  const livestock = getCollection(STORAGE_KEYS.LIVESTOCK);

  let totalExpenses = 0;
  let totalIncome = 0;

  // Filter and sum expenses
  if (!livestock_id) {
    expenses.forEach((exp) => {
      if (farm_id && exp.farm_id !== farm_id) return;
      if (field_id && exp.field_id !== field_id) return;
      if (crop_id && exp.crop_id !== crop_id) return;
      if ((start_date || end_date) && !isDateInRange(exp.expense_date, start_date, end_date)) return;
      totalExpenses += Number(exp.amount) || 0;
    });

    income.forEach((inc) => {
      if (farm_id && inc.farm_id !== farm_id) return;
      if (field_id && inc.field_id !== field_id) return;
      if (crop_id && inc.crop_id !== crop_id) return;
      if ((start_date || end_date) && !isDateInRange(inc.income_date, start_date, end_date)) return;
      totalIncome += Number(inc.amount) || 0;
    });
  }

  // Include livestock costs & production income if not restricted to crop/field
  const includeLivestock = (!field_id && !crop_id) || livestock_id;

  if (includeLivestock) {
    // Livestock purchase cost
    livestock.forEach((ls) => {
      if (livestock_id && (ls._id || ls.id) !== livestock_id) return;
      if (farm_id && ls.farm_id !== farm_id) return;
      if ((start_date || end_date) && !isDateInRange(ls.purchase_date, start_date, end_date)) return;
      totalExpenses += Number(ls.purchase_cost) || 0;
    });

    // Feed records
    feedRecords.forEach((f) => {
      if (livestock_id && f.livestock_id !== livestock_id) return;
      if (farm_id && f.farm_id !== farm_id) return;
      if ((start_date || end_date) && !isDateInRange(f.feed_date, start_date, end_date)) return;
      totalExpenses += Number(f.cost) || 0;
    });

    // Medical records
    medRecords.forEach((m) => {
      if (livestock_id && m.livestock_id !== livestock_id) return;
      if (farm_id && m.farm_id !== farm_id) return;
      if ((start_date || end_date) && !isDateInRange(m.treatment_date, start_date, end_date)) return;
      totalExpenses += Number(m.cost) || 0;
    });

    // Vaccination records
    vacRecords.forEach((v) => {
      if (livestock_id && v.livestock_id !== livestock_id) return;
      if (farm_id && v.farm_id !== farm_id) return;
      if ((start_date || end_date) && !isDateInRange(v.vaccination_date, start_date, end_date)) return;
      totalExpenses += Number(v.cost) || 0;
    });

    // Production records (Milk, Eggs, etc. -> Income)
    prodRecords.forEach((p) => {
      if (livestock_id && p.livestock_id !== livestock_id) return;
      if (farm_id && p.farm_id !== farm_id) return;
      if ((start_date || end_date) && !isDateInRange(p.production_date, start_date, end_date)) return;
      totalIncome += Number(p.income) || (Number(p.quantity) * Number(p.selling_price)) || 0;
    });
  }

  totalIncome = Math.round(totalIncome * 100) / 100;
  totalExpenses = Math.round(totalExpenses * 100) / 100;
  const netProfit = Math.round((totalIncome - totalExpenses) * 100) / 100;

  return {
    total_income: totalIncome,
    total_expenses: totalExpenses,
    net_profit: netProfit,
  };
};

/**
 * Calculate Dashboard KPIs
 */
export const calculateDashboardKPIs = (filters = {}) => {
  const { farm_id } = filters;
  const farms = getCollection(STORAGE_KEYS.FARMS);
  const fields = getCollection(STORAGE_KEYS.FIELDS);
  const crops = getCollection(STORAGE_KEYS.CROPS);
  const livestock = getCollection(STORAGE_KEYS.LIVESTOCK);

  const totalFarms = farm_id ? farms.filter((f) => (f._id || f.id) === farm_id).length : farms.length;
  const totalFields = fields.filter((f) => !farm_id || f.farm_id === farm_id).length;
  const activeCrops = crops.filter(
    (c) => (!farm_id || c.farm_id === farm_id) && !['harvested', 'sold', 'completed'].includes(c.status)
  ).length;
  const totalLivestock = livestock.filter(
    (l) => (!farm_id || l.farm_id === farm_id) && !['Sold', 'Deceased', 'Transferred', 'Inactive'].includes(l.status)
  ).length;

  return {
    total_farms: totalFarms,
    total_fields: totalFields,
    active_crops: activeCrops,
    total_livestock: totalLivestock,
  };
};

/**
 * Calculate Dashboard Finance Charts (Time Series & Categories)
 */
export const calculateFinanceCharts = (filters = {}) => {
  const { farm_id, start_date, end_date } = filters;
  const expenses = getCollection(STORAGE_KEYS.EXPENSES);
  const income = getCollection(STORAGE_KEYS.INCOME);
  const feedRecords = getCollection(STORAGE_KEYS.FEED_RECORDS);
  const medRecords = getCollection(STORAGE_KEYS.MEDICAL_RECORDS);
  const vacRecords = getCollection(STORAGE_KEYS.VACCINATION_RECORDS);
  const prodRecords = getCollection(STORAGE_KEYS.PRODUCTION_RECORDS);
  const livestock = getCollection(STORAGE_KEYS.LIVESTOCK);

  const timeSeriesMap = {};
  const categoryMap = {};

  const addTimeSeries = (dateStr, type, amount) => {
    if (!dateStr || !amount) return;
    if ((start_date || end_date) && !isDateInRange(dateStr, start_date, end_date)) return;
    const key = dateStr.slice(0, 7); // YYYY-MM
    if (!timeSeriesMap[key]) {
      timeSeriesMap[key] = { date: key, income: 0, expenses: 0 };
    }
    timeSeriesMap[key][type] += Number(amount);
  };

  const addCategory = (category, amount) => {
    if (!category || !amount) return;
    categoryMap[category] = (categoryMap[category] || 0) + Number(amount);
  };

  // Expenses
  expenses.forEach((e) => {
    if (farm_id && e.farm_id !== farm_id) return;
    addTimeSeries(e.expense_date, 'expenses', e.amount);
    if (!start_date && !end_date || isDateInRange(e.expense_date, start_date, end_date)) {
      addCategory(e.category || 'General', e.amount);
    }
  });

  // Livestock expenses in time series & categories
  feedRecords.forEach((f) => {
    if (farm_id && f.farm_id !== farm_id) return;
    addTimeSeries(f.feed_date, 'expenses', f.cost);
    if (!start_date && !end_date || isDateInRange(f.feed_date, start_date, end_date)) {
      addCategory('Livestock Feed', f.cost);
    }
  });

  medRecords.forEach((m) => {
    if (farm_id && m.farm_id !== farm_id) return;
    addTimeSeries(m.treatment_date, 'expenses', m.cost);
    if (!start_date && !end_date || isDateInRange(m.treatment_date, start_date, end_date)) {
      addCategory('Livestock Medical', m.cost);
    }
  });

  vacRecords.forEach((v) => {
    if (farm_id && v.farm_id !== farm_id) return;
    addTimeSeries(v.vaccination_date, 'expenses', v.cost);
    if (!start_date && !end_date || isDateInRange(v.vaccination_date, start_date, end_date)) {
      addCategory('Livestock Vaccination', v.cost);
    }
  });

  livestock.forEach((l) => {
    if (farm_id && l.farm_id !== farm_id) return;
    addTimeSeries(l.purchase_date, 'expenses', l.purchase_cost);
    if (!start_date && !end_date || isDateInRange(l.purchase_date, start_date, end_date)) {
      addCategory('Livestock Purchase', l.purchase_cost);
    }
  });

  // Income
  income.forEach((i) => {
    if (farm_id && i.farm_id !== farm_id) return;
    addTimeSeries(i.income_date, 'income', i.amount);
  });

  prodRecords.forEach((p) => {
    if (farm_id && p.farm_id !== farm_id) return;
    const inc = Number(p.income) || (Number(p.quantity) * Number(p.selling_price)) || 0;
    addTimeSeries(p.production_date, 'income', inc);
  });

  // Sort time series ascending
  const time_series = Object.values(timeSeriesMap).sort((a, b) => a.date.localeCompare(b.date));

  // Expense categories array
  const expense_categories = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);

  return {
    time_series,
    expense_categories,
  };
};

/**
 * Calculate Crop Analytics (Status Distribution & Profitability)
 */
export const calculateCropAnalytics = (filters = {}) => {
  const { farm_id } = filters;
  const crops = getCollection(STORAGE_KEYS.CROPS);
  const expenses = getCollection(STORAGE_KEYS.EXPENSES);
  const income = getCollection(STORAGE_KEYS.INCOME);

  const filteredCrops = crops.filter((c) => !farm_id || c.farm_id === farm_id);

  // Status distribution
  const statusMap = {};
  filteredCrops.forEach((c) => {
    const s = c.status || 'planned';
    statusMap[s] = (statusMap[s] || 0) + 1;
  });

  const status_distribution = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  // Profitability per crop
  const expMap = {};
  expenses.forEach((e) => {
    if (e.crop_id) {
      expMap[e.crop_id] = (expMap[e.crop_id] || 0) + (Number(e.amount) || 0);
    }
  });

  const incMap = {};
  income.forEach((i) => {
    if (i.crop_id) {
      incMap[i.crop_id] = (incMap[i.crop_id] || 0) + (Number(i.amount) || 0);
    }
  });

  const profitability = filteredCrops.map((c) => {
    const cid = c._id || c.id;
    const cropExp = expMap[cid] || 0;
    const cropInc = incMap[cid] || 0;
    return {
      crop_id: cid,
      name: c.name,
      variety: c.variety || '',
      status: c.status,
      area: c.area || 0,
      area_unit: c.area_unit || 'acres',
      expenses: cropExp,
      income: cropInc,
      profit: Math.round((cropInc - cropExp) * 100) / 100,
    };
  }).sort((a, b) => b.profit - a.profit);

  return {
    status_distribution,
    profitability,
  };
};

/**
 * Calculate Livestock Analytics (Types Distribution & Upcoming Vaccinations)
 */
export const calculateLivestockAnalytics = (filters = {}) => {
  const { farm_id } = filters;
  const livestock = getCollection(STORAGE_KEYS.LIVESTOCK);
  const vaccinations = getCollection(STORAGE_KEYS.VACCINATION_RECORDS);

  const activeLivestock = livestock.filter(
    (l) => (!farm_id || l.farm_id === farm_id) && !['Sold', 'Deceased', 'Transferred', 'Inactive'].includes(l.status)
  );

  const typeMap = {};
  activeLivestock.forEach((l) => {
    const t = l.animal_type || 'Other';
    typeMap[t] = (typeMap[t] || 0) + 1;
  });

  const types_distribution = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

  // Upcoming vaccinations (due today or in the future)
  const nowTime = new Date().setHours(0, 0, 0, 0);
  const animalMap = {};
  livestock.forEach((l) => {
    animalMap[l._id || l.id] = l;
  });

  const upcoming_vaccinations = vaccinations
    .filter((v) => {
      if (farm_id && v.farm_id !== farm_id) return false;
      if (!v.next_due_date) return false;
      return new Date(v.next_due_date).getTime() >= nowTime;
    })
    .sort((a, b) => new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime())
    .slice(0, 10)
    .map((v) => {
      const animal = animalMap[v.livestock_id] || {};
      return {
        _id: v._id || v.id,
        vaccine_name: v.vaccine_name,
        next_due_date: v.next_due_date,
        animal_id: animal.animal_id || 'Unknown',
        animal_type: animal.animal_type || 'Livestock',
      };
    });

  return {
    types_distribution,
    upcoming_vaccinations,
  };
};

/**
 * Calculate Recent Activity Stream
 */
export const calculateRecentActivity = (filters = {}, limit = 10) => {
  const { farm_id } = filters;
  const expenses = getCollection(STORAGE_KEYS.EXPENSES);
  const income = getCollection(STORAGE_KEYS.INCOME);
  const activities = getCollection(STORAGE_KEYS.ACTIVITIES);
  const production = getCollection(STORAGE_KEYS.PRODUCTION_RECORDS);

  const timeline = [];

  expenses.forEach((e) => {
    if (farm_id && e.farm_id !== farm_id) return;
    timeline.push({
      id: e._id || e.id,
      date: e.expense_date || e.created_at,
      type: 'Expense',
      title: `Expense: ${e.category || 'General'}`,
      amount: Number(e.amount) || 0,
      is_income: false,
    });
  });

  income.forEach((i) => {
    if (farm_id && i.farm_id !== farm_id) return;
    timeline.push({
      id: i._id || i.id,
      date: i.income_date || i.created_at,
      type: 'Income',
      title: `Income: ${i.source || 'General'}`,
      amount: Number(i.amount) || 0,
      is_income: true,
    });
  });

  activities.forEach((a) => {
    if (farm_id && a.farm_id !== farm_id) return;
    timeline.push({
      id: a._id || a.id,
      date: a.activity_date || a.created_at,
      type: 'Activity',
      title: `Activity: ${a.activity_type || 'General'}`,
      amount: Number(a.total_cost) || 0,
      is_income: false,
    });
  });

  production.forEach((p) => {
    if (farm_id && p.farm_id !== farm_id) return;
    timeline.push({
      id: p._id || p.id,
      date: p.production_date || p.created_at,
      type: 'Livestock Production',
      title: `Production: ${p.production_type || 'Product'} (${p.quantity} ${p.unit || ''})`,
      amount: Number(p.income) || (Number(p.quantity) * Number(p.selling_price)) || 0,
      is_income: true,
    });
  });

  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return timeline.slice(0, limit);
};

/**
 * Generate CSV text and Blob
 */
export const generateCSVBlob = (headers, rows) => {
  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val).replace(/"/g, '""');
    return str.includes(',') || str.includes('\n') || str.includes('"') ? `"${str}"` : str;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\r\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

/**
 * Generate lightweight standard PDF Blob in browser
 */
export const generatePDFBlob = (title, summaryLines = [], detailRows = [], headers = []) => {
  // Construct standard PDF 1.4 syntax
  const escapePDFText = (text) => String(text || '').replace(/[\\()]/g, '\\$&');

  let stream = `BT\n`;
  // Document Header
  stream += `/F1 20 Tf\n50 780 Td\n(${escapePDFText(title)}) Tj\n`;
  stream += `/F2 10 Tf\n0 -20 Td\n(Generated by AgriFlow AI Demo - ${new Date().toLocaleDateString('en-IN')}) Tj\n`;

  // Summary section
  let yOffset = -35;
  stream += `/F1 13 Tf\n0 ${yOffset} Td\n(SUMMARY) Tj\n`;
  stream += `/F2 10 Tf\n`;

  summaryLines.forEach(([label, val]) => {
    stream += `0 -18 Td\n(${escapePDFText(label)}: ${escapePDFText(val)}) Tj\n`;
  });

  // Details Table
  if (detailRows.length > 0 && headers.length > 0) {
    stream += `/F1 13 Tf\n0 -35 Td\n(DETAILS) Tj\n`;
    stream += `/F1 10 Tf\n0 -20 Td\n(${escapePDFText(headers.join('   |   '))}) Tj\n`;
    stream += `/F2 9 Tf\n`;

    detailRows.slice(0, 25).forEach((row) => {
      const line = row.map((cell) => String(cell || '').slice(0, 20)).join('   |   ');
      stream += `0 -16 Td\n(${escapePDFText(line)}) Tj\n`;
    });
  }

  stream += `ET\n`;

  const streamBytes = new TextEncoder().encode(stream);
  const streamLen = streamBytes.length;

  const pdfBody = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
6 0 obj
<< /Length ${streamLen} >>
stream
${stream}endstream
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000325 00000 n 
0000000401 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
${480 + streamLen}
%%EOF`;

  return new Blob([pdfBody], { type: 'application/pdf' });
};
