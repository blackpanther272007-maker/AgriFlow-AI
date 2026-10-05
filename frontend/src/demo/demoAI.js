import { STORAGE_KEYS, getCollection } from './demoStorage';
import { calculateFinancialSummary, formatCurrencyINR, formatNumberINR } from './demoUtils';

/**
 * Deterministic AgriFlow AI Assistant
 * Analyzes live localStorage data to answer farm questions accurately.
 */
export const answerAssistantQuery = async (message) => {
  const query = (message || '').trim().toLowerCase();
  const farms = getCollection(STORAGE_KEYS.FARMS);
  const fields = getCollection(STORAGE_KEYS.FIELDS);
  const crops = getCollection(STORAGE_KEYS.CROPS);
  const livestock = getCollection(STORAGE_KEYS.LIVESTOCK);
  const vaccinations = getCollection(STORAGE_KEYS.VACCINATION_RECORDS);
  const fin = calculateFinancialSummary();

  let answer = "";
  let intent = "general";
  let sources = [];

  // Weather query
  if (query.includes('weather') || query.includes('rain') || query.includes('temperature') || query.includes('climate') || query.includes('வானிலை')) {
    intent = "weather";
    const primaryFarm = farms[0] || { name: "Green Valley Farm", location: "Coimbatore, Tamil Nadu" };
    const loc = primaryFarm.location || "Coimbatore, Tamil Nadu";
    const weatherData = {
      location: loc,
      current: {
        temperature_2m: 29.5,
        relative_humidity_2m: 68,
        precipitation: 0.0,
        condition: "Partly Cloudy"
      }
    };
    sources.push({ type: 'weather', data: weatherData });
    answer = `**Current Weather Forecast for ${loc}:**\n` +
      `- **Temperature:** 29.5°C\n` +
      `- **Condition:** Partly Cloudy\n` +
      `- **Humidity:** 68%\n` +
      `- **Precipitation:** 0.0 mm (Low rain probability today)\n\n` +
      `*Field advisory:* Ideal conditions for open field operations, irrigation scheduling, and harvesting activities today.`;
    return { answer, intent, sources };
  }

  // Harvest / "ready for harvest"
  if (query.includes('ready for harvest') || query.includes('harvest soon') || query.includes('should i harvest') || query.includes('what to harvest')) {
    intent = "crops_harvest";
    const readyCrops = crops.filter(c => c.status === 'ready_for_harvest');
    if (readyCrops.length === 0) {
      answer = `You currently have **0 crops marked as ready for harvest** in your fields.\n\n` +
        `Your active growing crops include: ${crops.map(c => c.name).join(', ')}.`;
    } else {
      const list = readyCrops.map(c => {
        const farm = farms.find(f => (f._id || f.id) === c.farm_id);
        return `- **${c.name} (${c.variety || 'Standard'})**: ${c.area} ${c.area_unit || 'acres'} on *${farm ? farm.name : 'Farm'}* (Est. yield: ${formatNumberINR(c.expected_yield)} ${c.yield_unit || 'kg'})`;
      }).join('\n');
      answer = `You have **${readyCrops.length} crop(s) ready for harvest right now**:\n\n${list}\n\n` +
        `*Advisory:* Ensure market mandi arrangements and harvesting labour or machinery are coordinated promptly to preserve crop quality.`;
    }
    return { answer, intent, sources };
  }

  // Best performing crop / crop profitability
  if (query.includes('performing best') || query.includes('profitable') || query.includes('profit per crop') || query.includes('best crop')) {
    intent = "crop_profitability";
    const expenses = getCollection(STORAGE_KEYS.EXPENSES);
    const income = getCollection(STORAGE_KEYS.INCOME);

    const expMap = {};
    expenses.forEach(e => { if (e.crop_id) expMap[e.crop_id] = (expMap[e.crop_id] || 0) + (Number(e.amount) || 0); });
    const incMap = {};
    income.forEach(i => { if (i.crop_id) incMap[i.crop_id] = (incMap[i.crop_id] || 0) + (Number(i.amount) || 0); });

    const cropStats = crops.map(c => {
      const cid = c._id || c.id;
      const profit = (incMap[cid] || 0) - (expMap[cid] || 0);
      return { ...c, profit, income: incMap[cid] || 0, expenses: expMap[cid] || 0 };
    }).sort((a, b) => b.profit - a.profit);

    if (cropStats.length > 0 && cropStats[0].profit > 0) {
      const top = cropStats[0];
      answer = `Your best performing crop right now is **${top.name} (${top.variety || 'Commercial'})**!\n\n` +
        `- **Net Profit Generated:** ${formatCurrencyINR(top.profit)}\n` +
        `- **Total Sales Income:** ${formatCurrencyINR(top.income)}\n` +
        `- **Direct Expenses Incurred:** ${formatCurrencyINR(top.expenses)}\n` +
        `- **Status:** ${top.status}\n\n` +
        `*Runners-up:*\n` +
        cropStats.slice(1, 3).map(c => `- **${c.name}**: Profit of ${formatCurrencyINR(c.profit)}`).join('\n');
    } else {
      answer = `Based on current financial records, crop sales are being logged. Top recorded crop by revenue is **${cropStats[0]?.name || 'Sweet Corn'}**.`;
    }
    return { answer, intent, sources };
  }

  // Income / Revenue
  if (query.includes('total income') || query.includes('how much income') || query.includes('revenue') || query.includes('earnings')) {
    intent = "finance_income";
    answer = `Your **total recorded income** across all farms and livestock operations is **${formatCurrencyINR(fin.total_income)}**.\n\n` +
      `This includes crop harvest sales, bulk milk distribution settlements, and secondary farm produce.`;
    return { answer, intent, sources };
  }

  // Expenses / Costs
  if (query.includes('total expense') || query.includes('how much expense') || query.includes('my expenses') || query.includes('spending') || query.includes('total cost')) {
    intent = "finance_expenses";
    answer = `Your **total farm expenses** to date amount to **${formatCurrencyINR(fin.total_expenses)}**.\n\n` +
      `Key cost drivers include seed procurement, fertilizer/nutrients, field labour wages, and livestock feed concentrate.`;
    return { answer, intent, sources };
  }

  // Profit / Net Margin
  if (query.includes('profit') || query.includes('net profit') || query.includes('margin') || query.includes('net gain')) {
    intent = "finance_profit";
    const status = fin.net_profit >= 0 ? "profitable" : "in a deficit";
    answer = `Your **net profit** is currently **${formatCurrencyINR(fin.net_profit)}** (${status}).\n\n` +
      `- **Total Income:** ${formatCurrencyINR(fin.total_income)}\n` +
      `- **Total Expenses:** ${formatCurrencyINR(fin.total_expenses)}\n` +
      `- **Net Profit Margin:** ${fin.total_income > 0 ? ((fin.net_profit / fin.total_income) * 100).toFixed(1) + '%' : '0%'}`;
    return { answer, intent, sources };
  }

  // Farms inquiry
  if (query.includes('farms') || query.includes('what farm') || query.includes('how many farm') || query.includes('list farm')) {
    intent = "farms_list";
    const farmList = farms.map((f, i) => {
      const fFields = fields.filter(fd => fd.farm_id === (f._id || f.id));
      const fCrops = crops.filter(c => c.farm_id === (f._id || f.id));
      return `**${i + 1}. ${f.name}**\n` +
        `- **Location:** ${f.location}\n` +
        `- **Total Area:** ${f.total_area} ${f.area_unit || 'acres'}\n` +
        `- **Soil Type:** ${f.soil_type || 'Loamy'}\n` +
        `- **Fields:** ${fFields.length} plots | **Crops Cultivated:** ${fCrops.length} active`;
    }).join('\n\n');

    const totalAcres = farms.reduce((sum, f) => sum + (Number(f.total_area) || 0), 0);
    answer = `You currently manage **${farms.length} farms** covering a total of **${totalAcres} acres**:\n\n${farmList}`;
    return { answer, intent, sources };
  }

  // Crops general inquiry
  if (query.includes('crops') || query.includes('what crop') || query.includes('how many crop') || query.includes('list crop')) {
    intent = "crops_list";
    const cropList = crops.map(c => `- **${c.name} (${c.variety || ''})**: ${c.area} acres — *${c.status.replace(/_/g, ' ')}*`).join('\n');
    answer = `Here is your crop inventory across all fields (${crops.length} total entries):\n\n${cropList}`;
    return { answer, intent, sources };
  }

  // Livestock / Cows / Goats / Chickens
  if (query.includes('livestock') || query.includes('animal') || query.includes('cow') || query.includes('goat') || query.includes('chicken') || query.includes('cattle')) {
    intent = "livestock_status";
    const cows = livestock.filter(l => (l.animal_type || '').toLowerCase() === 'cow');
    const goats = livestock.filter(l => (l.animal_type || '').toLowerCase() === 'goat');
    const chickens = livestock.filter(l => (l.animal_type || '').toLowerCase() === 'chicken');

    const nowTime = new Date().getTime();
    const upcomingVac = vaccinations
      .filter(v => v.next_due_date && new Date(v.next_due_date).getTime() >= nowTime)
      .sort((a, b) => new Date(a.next_due_date) - new Date(b.next_due_date))[0];

    answer = `**Livestock Herd Summary (${livestock.length} animals/flocks):**\n\n` +
      `- **Cows / Cattle:** ${cows.length} (${cows.map(c => `${c.animal_id} - ${c.breed}`).join(', ')})\n` +
      `- **Goats:** ${goats.length} (${goats.map(g => `${g.animal_id} - ${g.breed}`).join(', ')})\n` +
      `- **Poultry / Chickens:** ${chickens.length} (${chickens.map(c => c.breed).join(', ')})\n\n` +
      (upcomingVac ? `⚠️ **Upcoming Vaccination Alert:** ${upcomingVac.vaccine_name} is due on **${new Date(upcomingVac.next_due_date).toLocaleDateString('en-IN')}**.` : `All vaccinations are currently up to date.`);
    return { answer, intent, sources };
  }

  // Farm Summary / Overview
  if (query.includes('summary') || query.includes('overview') || query.includes('status') || query.includes('dashboard') || query.includes('hello') || query.includes('hi')) {
    intent = "farm_summary";
    const totalAcres = farms.reduce((sum, f) => sum + (Number(f.total_area) || 0), 0);
    const readyCrops = crops.filter(c => c.status === 'ready_for_harvest').length;

    answer = `**AgriFlow Farm Operations Overview:**\n\n` +
      `- 🌾 **Farms:** ${farms.length} farms covering **${totalAcres} acres**\n` +
      `- 📐 **Fields:** ${fields.length} active plots\n` +
      `- 🌱 **Crops:** ${crops.length} crops planted (${readyCrops} ready for harvest)\n` +
      `- 🐄 **Livestock:** ${livestock.length} registered animals/flocks\n` +
      `- 💰 **Financial Status:** Income: ${formatCurrencyINR(fin.total_income)} | Expenses: ${formatCurrencyINR(fin.total_expenses)} | **Net Profit: ${formatCurrencyINR(fin.net_profit)}**\n\n` +
      `You can ask me specific details about your harvest schedule, livestock feed/vaccines, finances, or current weather!`;
    return { answer, intent, sources };
  }

  // Default intelligent response utilizing current live data
  intent = "general_qa";
  answer = `Based on your live AgriFlow records:\n` +
    `You have **${farms.length} farms** (${farms.map(f => f.name).join(', ')}), with **${crops.length} crops** cultivated and **${livestock.length} livestock** recorded.\n\n` +
    `Total income is **${formatCurrencyINR(fin.total_income)}** and net profit stands at **${formatCurrencyINR(fin.net_profit)}**.\n\n` +
    `Feel free to ask questions like:\n` +
    `- *"What crops are ready for harvest?"*\n` +
    `- *"What is my total income and profit?"*\n` +
    `- *"Which crop is performing best?"*\n` +
    `- *"How many cows and goats do I have?"*\n` +
    `- *"What is the weather today?"*`;

  return { answer, intent, sources };
};

/**
 * AI ML Predictors (Yield, Profit, Anomaly, Categorize)
 */
export const demoMLPredictor = {
  getStatus: () => ({
    status: 'ready',
    metadata: {
      version: '1.0.0-demo',
      models: ['yield_model_v1', 'profit_model_v1', 'anomaly_model_v1', 'expense_nlp_v1'],
      accuracy: 0.942,
      last_trained: '2026-09-15'
    }
  }),

  predictYield: ({ crop_type, season, area }) => {
    const acres = parseFloat(area) || 1.0;
    const crop = (crop_type || '').toLowerCase();
    const s = (season || '').toLowerCase();

    // Base yield in kg/acre
    let yieldPerAcre = 2400; // default Rice/Cereal
    if (crop.includes('tomato')) yieldPerAcre = 4200;
    else if (crop.includes('banana')) yieldPerAcre = 6500;
    else if (crop.includes('groundnut')) yieldPerAcre = 1450;
    else if (crop.includes('sugarcane')) yieldPerAcre = 32000;
    else if (crop.includes('corn') || crop.includes('maize')) yieldPerAcre = 3000;
    else if (crop.includes('urad') || crop.includes('gram') || crop.includes('pulse')) yieldPerAcre = 600;

    // Season factor
    let seasonMultiplier = 1.0;
    if (s.includes('kharif')) seasonMultiplier = 1.08;
    else if (s.includes('rabi')) seasonMultiplier = 1.04;
    else if (s.includes('summer') || s.includes('zaid')) seasonMultiplier = 0.92;

    const estimatedYieldKg = Math.round(acres * yieldPerAcre * seasonMultiplier);

    return {
      estimated_yield_kg: estimatedYieldKg,
      factors: ["Crop Type", "Season", "Area (Acres)"]
    };
  },

  predictProfit: ({ crop_type, season, area }) => {
    const acres = parseFloat(area) || 1.0;
    const crop = (crop_type || '').toLowerCase();
    const s = (season || '').toLowerCase();

    // Net profit in INR/acre
    let profitPerAcre = 26000; // default
    if (crop.includes('tomato')) profitPerAcre = 52000;
    else if (crop.includes('banana')) profitPerAcre = 68000;
    else if (crop.includes('groundnut')) profitPerAcre = 22000;
    else if (crop.includes('sugarcane')) profitPerAcre = 38000;
    else if (crop.includes('corn') || crop.includes('maize')) profitPerAcre = 24000;
    else if (crop.includes('urad') || crop.includes('gram')) profitPerAcre = 16000;

    let seasonMultiplier = 1.0;
    if (s.includes('kharif')) seasonMultiplier = 1.06;
    else if (s.includes('rabi')) seasonMultiplier = 1.02;

    const estimatedProfit = Math.round(acres * profitPerAcre * seasonMultiplier);

    return {
      estimated_profit: estimatedProfit,
      factors: ["Crop Type", "Season", "Area (Acres)"]
    };
  },

  detectAnomaly: ({ category, farm_area, amount }) => {
    const amt = parseFloat(amount) || 0;
    const area = parseFloat(farm_area) || 1.0;
    const cat = (category || 'Other').toLowerCase();

    let thresholdPerAcre = 12000;
    if (cat.includes('fertilizer')) thresholdPerAcre = 10000;
    else if (cat.includes('seed')) thresholdPerAcre = 7000;
    else if (cat.includes('labour')) thresholdPerAcre = 14000;
    else if (cat.includes('equipment')) thresholdPerAcre = 20000;
    else if (cat.includes('feed')) thresholdPerAcre = 15000;
    else if (cat.includes('transportation')) thresholdPerAcre = 6000;

    const maxExpected = thresholdPerAcre * Math.max(1, area);
    const isAnomaly = amt > maxExpected * 1.6;
    const score = isAnomaly ? -0.85 : 0.42;

    return {
      is_anomaly: isAnomaly,
      anomaly_score: score,
      reason: isAnomaly
        ? `Expense amount (₹${amt.toLocaleString('en-IN')}) is significantly higher than expected for ${category} on a ${area} acre farm.`
        : "Expense is within normal agricultural range."
    };
  },

  categorizeExpense: ({ description }) => {
    const text = (description || '').toLowerCase();
    if (!text || text.trim().length < 3) {
      return { category: "Other", confidence: 0 };
    }

    if (text.includes('seed') || text.includes('sapling') || text.includes('seedling') || text.includes('nursery') || text.includes('grain for sowing')) {
      return { category: "Seeds", confidence: 96 };
    }
    if (text.includes('urea') || text.includes('dap') || text.includes('potash') || text.includes('fertilizer') || text.includes('npk') || text.includes('manure') || text.includes('gypsum') || text.includes('compost') || text.includes('spray')) {
      return { category: "Fertilizer", confidence: 98 };
    }
    if (text.includes('tractor') || text.includes('plough') || text.includes('tiller') || text.includes('rotavator') || text.includes('equipment') || text.includes('bamboo') || text.includes('drip') || text.includes('pipe') || text.includes('wire')) {
      return { category: "Equipment", confidence: 94 };
    }
    if (text.includes('labour') || text.includes('labor') || text.includes('worker') || text.includes('wage') || text.includes('weeding') || text.includes('transplant') || text.includes('plucking')) {
      return { category: "Labour", confidence: 95 };
    }
    if (text.includes('feed') || text.includes('fodder') || text.includes('hay') || text.includes('silage') || text.includes('pellet') || text.includes('mash') || text.includes('cattle feed')) {
      return { category: "Feed", confidence: 97 };
    }
    if (text.includes('transport') || text.includes('tempo') || text.includes('lorry') || text.includes('freight') || text.includes('diesel') || text.includes('fuel') || text.includes('mandi delivery')) {
      return { category: "Transportation", confidence: 93 };
    }

    return { category: "Other", confidence: 65 };
  }
};
