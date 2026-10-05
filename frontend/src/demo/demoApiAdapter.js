import {
  STORAGE_KEYS,
  getCollection,
  findById,
  insertItem,
  updateItem,
  deleteItem,
  setCollection,
  safeGet,
} from './demoStorage';
import {
  calculateFinancialSummary,
  calculateDashboardKPIs,
  calculateFinanceCharts,
  calculateCropAnalytics,
  calculateLivestockAnalytics,
  calculateRecentActivity,
  generateCSVBlob,
  generatePDFBlob,
  formatCurrencyINR,
} from './demoUtils';
import { answerAssistantQuery, demoMLPredictor } from './demoAI';

// Helper to normalize URL paths and extract query parameters
const parseUrl = (rawUrl, configParams = {}) => {
  let url = String(rawUrl || '');
  // Strip origin or base API if present
  url = url.replace(/^https?:\/\/[^/]+/i, '');
  if (url.startsWith('/api/')) {
    url = url.replace('/api/', '/');
  } else if (url.startsWith('api/')) {
    url = url.replace('api/', '/');
  }
  if (!url.startsWith('/')) {
    url = '/' + url;
  }

  const queryParams = { ...configParams };
  const qIdx = url.indexOf('?');
  let pathname = url;
  if (qIdx !== -1) {
    pathname = url.slice(0, qIdx);
    const qs = url.slice(qIdx + 1);
    const searchParams = new URLSearchParams(qs);
    for (const [k, v] of searchParams.entries()) {
      queryParams[k] = v;
    }
  }

  // Remove trailing slashes (except root)
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  return { pathname, params: queryParams };
};

// Response builder imitating Axios
const mockResponse = (data, status = 200, statusText = 'OK') => {
  return Promise.resolve({
    data,
    status,
    statusText,
    headers: {},
    config: {},
  });
};

const mockError = (message, status = 400) => {
  const err = new Error(message);
  err.response = {
    data: { detail: message },
    status,
    statusText: status === 404 ? 'Not Found' : 'Bad Request',
  };
  return Promise.reject(err);
};

export const demoApiAdapter = {
  async get(rawUrl, config = {}) {
    const { pathname, params } = parseUrl(rawUrl, config.params);

    // 1. Auth & Current User
    if (pathname === '/auth/me') {
      const settings = safeGet(STORAGE_KEYS.SETTINGS, {});
      return mockResponse(settings.user || {
        _id: 'user_demo_001',
        name: 'Ramesh Kumar',
        email: 'ramesh.farmer@agriflow.demo',
        role: 'Farmer',
      });
    }

    // 2. Farms
    if (pathname === '/farms') {
      const farms = getCollection(STORAGE_KEYS.FARMS);
      return mockResponse(farms);
    }
    const farmMatch = pathname.match(/^\/farms\/([^/]+)$/);
    if (farmMatch) {
      const farm = findById(STORAGE_KEYS.FARMS, farmMatch[1]);
      if (!farm) return mockError('Farm not found', 404);
      return mockResponse(farm);
    }

    // 3. Fields
    if (pathname === '/fields') {
      const fields = getCollection(STORAGE_KEYS.FIELDS);
      const filtered = fields.filter((f) => !params.farm_id || f.farm_id === params.farm_id);
      return mockResponse(filtered);
    }
    const fieldMatch = pathname.match(/^\/fields\/([^/]+)$/);
    if (fieldMatch) {
      const field = findById(STORAGE_KEYS.FIELDS, fieldMatch[1]);
      if (!field) return mockError('Field not found', 404);
      return mockResponse(field);
    }

    // 4. Crops
    if (pathname === '/crops') {
      let crops = getCollection(STORAGE_KEYS.CROPS);
      if (params.farm_id) crops = crops.filter((c) => c.farm_id === params.farm_id);
      if (params.field_id) crops = crops.filter((c) => c.field_id === params.field_id);
      if (params.status) crops = crops.filter((c) => c.status === params.status);
      return mockResponse(crops);
    }
    const cropMatch = pathname.match(/^\/crops\/([^/]+)$/);
    if (cropMatch) {
      const crop = findById(STORAGE_KEYS.CROPS, cropMatch[1]);
      if (!crop) return mockError('Crop not found', 404);
      return mockResponse(crop);
    }

    // 5. Activities
    if (pathname === '/activities') {
      let acts = getCollection(STORAGE_KEYS.ACTIVITIES);
      if (params.farm_id) acts = acts.filter((a) => a.farm_id === params.farm_id);
      if (params.field_id) acts = acts.filter((a) => a.field_id === params.field_id);
      if (params.crop_id) acts = acts.filter((a) => a.crop_id === params.crop_id);
      if (params.activity_type) acts = acts.filter((a) => a.activity_type === params.activity_type);
      return mockResponse(acts);
    }
    const actMatch = pathname.match(/^\/activities\/([^/]+)$/);
    if (actMatch) {
      const act = findById(STORAGE_KEYS.ACTIVITIES, actMatch[1]);
      if (!act) return mockError('Activity not found', 404);
      return mockResponse(act);
    }

    // 6. Livestock & Child Records
    if (pathname === '/livestock/vaccinations/upcoming') {
      const lsData = calculateLivestockAnalytics({});
      return mockResponse(lsData.upcoming_vaccinations);
    }
    if (pathname === '/livestock') {
      let ls = getCollection(STORAGE_KEYS.LIVESTOCK);
      if (params.farm_id) ls = ls.filter((l) => l.farm_id === params.farm_id);
      if (params.animal_type) ls = ls.filter((l) => l.animal_type === params.animal_type);
      if (params.status) ls = ls.filter((l) => l.status === params.status);
      if (params.gender) ls = ls.filter((l) => l.gender === params.gender);
      if (params.breed) ls = ls.filter((l) => (l.breed || '').toLowerCase().includes(params.breed.toLowerCase()));
      return mockResponse(ls);
    }
    // Child records: /livestock/:id/feed, /livestock/:id/medical, /livestock/:id/vaccinations, /livestock/:id/production
    const lsChildMatch = pathname.match(/^\/livestock\/([^/]+)\/(feed|medical|vaccination|vaccinations|production)$/);
    if (lsChildMatch) {
      const [, livestockId, recordType] = lsChildMatch;
      const keyMap = {
        feed: STORAGE_KEYS.FEED_RECORDS,
        medical: STORAGE_KEYS.MEDICAL_RECORDS,
        vaccination: STORAGE_KEYS.VACCINATION_RECORDS,
        vaccinations: STORAGE_KEYS.VACCINATION_RECORDS,
        production: STORAGE_KEYS.PRODUCTION_RECORDS,
      };
      const records = getCollection(keyMap[recordType]).filter((r) => r.livestock_id === livestockId);
      return mockResponse(records);
    }
    const lsMatch = pathname.match(/^\/livestock\/([^/]+)$/);
    if (lsMatch) {
      const animal = findById(STORAGE_KEYS.LIVESTOCK, lsMatch[1]);
      if (!animal) return mockError('Livestock not found', 404);
      return mockResponse(animal);
    }

    // 7. Expenses
    if (pathname === '/expenses') {
      let expenses = getCollection(STORAGE_KEYS.EXPENSES);
      if (params.farm_id) expenses = expenses.filter((e) => e.farm_id === params.farm_id);
      if (params.field_id) expenses = expenses.filter((e) => e.field_id === params.field_id);
      if (params.crop_id) expenses = expenses.filter((e) => e.crop_id === params.crop_id);
      if (params.category) expenses = expenses.filter((e) => e.category === params.category);
      return mockResponse(expenses);
    }
    const expMatch = pathname.match(/^\/expenses\/([^/]+)$/);
    if (expMatch) {
      const exp = findById(STORAGE_KEYS.EXPENSES, expMatch[1]);
      if (!exp) return mockError('Expense not found', 404);
      return mockResponse(exp);
    }

    // 8. Income
    if (pathname === '/income') {
      let income = getCollection(STORAGE_KEYS.INCOME);
      if (params.farm_id) income = income.filter((i) => i.farm_id === params.farm_id);
      if (params.field_id) income = income.filter((i) => i.field_id === params.field_id);
      if (params.crop_id) income = income.filter((i) => i.crop_id === params.crop_id);
      if (params.source) income = income.filter((i) => i.source === params.source);
      return mockResponse(income);
    }
    const incMatch = pathname.match(/^\/income\/([^/]+)$/);
    if (incMatch) {
      const inc = findById(STORAGE_KEYS.INCOME, incMatch[1]);
      if (!inc) return mockError('Income not found', 404);
      return mockResponse(inc);
    }

    // 9. Finance Summary
    if (pathname === '/finance/summary') {
      const summary = calculateFinancialSummary(params);
      return mockResponse(summary);
    }

    // 10. Dashboard
    if (pathname === '/dashboard/kpis') {
      return mockResponse(calculateDashboardKPIs(params));
    }
    if (pathname === '/dashboard/charts/finance') {
      return mockResponse(calculateFinanceCharts(params));
    }
    if (pathname === '/dashboard/crops') {
      return mockResponse(calculateCropAnalytics(params));
    }
    if (pathname === '/dashboard/livestock') {
      return mockResponse(calculateLivestockAnalytics(params));
    }
    if (pathname === '/dashboard/recent-activity') {
      const limit = parseInt(params.limit, 10) || 10;
      return mockResponse(calculateRecentActivity(params, limit));
    }

    // 11. Reports
    if (pathname === '/reports/financial/preview') {
      const summary = calculateFinancialSummary(params);
      return mockResponse(summary);
    }
    const farmPreviewMatch = pathname.match(/^\/reports\/farm\/([^/]+)\/preview$/);
    if (farmPreviewMatch) {
      const farmId = farmPreviewMatch[1];
      const farm = findById(STORAGE_KEYS.FARMS, farmId);
      if (!farm) return mockError('Farm not found', 404);
      const fields = getCollection(STORAGE_KEYS.FIELDS).filter((f) => f.farm_id === farmId);
      const crops = getCollection(STORAGE_KEYS.CROPS).filter((c) => c.farm_id === farmId && !['harvested', 'sold', 'completed'].includes(c.status));
      const livestock = getCollection(STORAGE_KEYS.LIVESTOCK).filter((l) => l.farm_id === farmId && !['Sold', 'Deceased'].includes(l.status));
      return mockResponse({
        farm_name: farm.name,
        total_area: `${farm.total_area} ${farm.area_unit || 'acres'}`,
        field_count: fields.length,
        active_crops: crops.length,
        active_livestock: livestock.length,
      });
    }

    if (pathname === '/reports/financial/csv') {
      const expenses = getCollection(STORAGE_KEYS.EXPENSES);
      const income = getCollection(STORAGE_KEYS.INCOME);
      const rows = [];
      expenses.forEach((e) => rows.push([e.expense_date?.slice(0, 10), 'Expense', e.category, e.amount, e.payment_mode, e.description]));
      income.forEach((i) => rows.push([i.income_date?.slice(0, 10), 'Income', i.source, i.amount, i.payment_mode, i.description]));
      const blob = generateCSVBlob(['Date', 'Type', 'Category / Source', 'Amount (INR)', 'Payment Mode', 'Description'], rows);
      return mockResponse(blob);
    }

    if (pathname === '/reports/financial/pdf') {
      const fin = calculateFinancialSummary(params);
      const summaryLines = [
        ['Total Income', `INR ${fin.total_income.toLocaleString('en-IN')}`],
        ['Total Expenses', `INR ${fin.total_expenses.toLocaleString('en-IN')}`],
        ['Net Profit / Loss', `INR ${fin.net_profit.toLocaleString('en-IN')}`],
      ];
      const expenses = getCollection(STORAGE_KEYS.EXPENSES);
      const detailRows = expenses.map((e) => [e.expense_date?.slice(0, 10) || '', e.category || 'General', `INR ${e.amount}`, e.payment_mode || 'Cash']);
      const blob = generatePDFBlob('AgriFlow AI - Financial Statement', summaryLines, detailRows, ['Date', 'Category', 'Amount', 'Mode']);
      return mockResponse(blob);
    }

    const farmReportMatch = pathname.match(/^\/reports\/farm\/([^/]+)\/(pdf|csv)$/);
    if (farmReportMatch) {
      const [, farmId, format] = farmReportMatch;
      const farm = findById(STORAGE_KEYS.FARMS, farmId) || { name: 'Farm Report', total_area: 0 };
      const fields = getCollection(STORAGE_KEYS.FIELDS).filter((f) => f.farm_id === farmId);
      const crops = getCollection(STORAGE_KEYS.CROPS).filter((c) => c.farm_id === farmId);

      if (format === 'csv') {
        const rows = crops.map((c) => [c.name, c.variety || '', c.status, c.area, c.expected_yield || 'N/A']);
        const blob = generateCSVBlob(['Crop Name', 'Variety', 'Status', 'Area (Acres)', 'Expected Yield (kg)'], rows);
        return mockResponse(blob);
      } else {
        const summaryLines = [
          ['Farm Name', farm.name],
          ['Location', farm.location || 'Tamil Nadu'],
          ['Total Area', `${farm.total_area} acres`],
          ['Total Fields', String(fields.length)],
          ['Cultivated Crops', String(crops.length)],
        ];
        const detailRows = crops.map((c) => [c.name, c.variety || '-', c.status, `${c.area} acres`]);
        const blob = generatePDFBlob(`Farm Report - ${farm.name}`, summaryLines, detailRows, ['Crop', 'Variety', 'Status', 'Area']);
        return mockResponse(blob);
      }
    }

    // 12. Notifications
    if (pathname === '/notifications/unread-count') {
      const notifs = getCollection(STORAGE_KEYS.NOTIFICATIONS);
      const count = notifs.filter((n) => !n.is_read).length;
      return mockResponse({ count });
    }
    if (pathname === '/notifications') {
      const notifs = getCollection(STORAGE_KEYS.NOTIFICATIONS);
      return mockResponse(notifs);
    }

    // 13. AI Status & Conversations
    if (pathname === '/ai/status') {
      return mockResponse(demoMLPredictor.getStatus());
    }
    if (pathname === '/ai/health' || pathname === '/ai/config_status') {
      return mockResponse({
        AI_PROVIDER: 'Demo Deterministic AI',
        AI_MODEL: 'AgriFlow Local Expert v1',
        AI_API_KEY_configured: true,
        available: true,
      });
    }
    if (pathname === '/ai/conversations') {
      const convs = getCollection(STORAGE_KEYS.CONVERSATIONS);
      return mockResponse(convs);
    }
    const convMsgMatch = pathname.match(/^\/ai\/conversations\/([^/]+)$/);
    if (convMsgMatch) {
      const convId = convMsgMatch[1];
      const msgs = getCollection(STORAGE_KEYS.MESSAGES).filter((m) => m.conversation_id === convId);
      return mockResponse(msgs);
    }

    console.warn(`[AgriFlow Demo API] Unhandled GET endpoint: ${pathname}`);
    return mockResponse([]);
  },

  async post(rawUrl, data = {}, config = {}) {
    const { pathname, params } = parseUrl(rawUrl, config.params);

    // Auth Login / Register / Google
    if (pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth/google') {
      return mockResponse({
        access_token: 'agriflow_demo_bearer_token',
        token_type: 'bearer',
      });
    }

    // Create Farm
    if (pathname === '/farms') {
      const created = insertItem(STORAGE_KEYS.FARMS, data, 'farm');
      return mockResponse(created, 201);
    }

    // Create Field
    if (pathname === '/fields') {
      const fieldData = {
        ...data,
        farm_id: data.farm_id || params.farm_id,
      };
      const created = insertItem(STORAGE_KEYS.FIELDS, fieldData, 'field');
      return mockResponse(created, 201);
    }

    // Create Crop
    if (pathname === '/crops') {
      const created = insertItem(STORAGE_KEYS.CROPS, data, 'crop');
      return mockResponse(created, 201);
    }

    // Create Activity
    if (pathname === '/activities') {
      const totalCost = (Number(data.labour_cost) || 0) + (Number(data.equipment_cost) || 0) + (Number(data.other_cost) || 0);
      const actData = {
        ...data,
        total_cost: Math.round(totalCost * 100) / 100,
      };
      const created = insertItem(STORAGE_KEYS.ACTIVITIES, actData, 'act');
      return mockResponse(created, 201);
    }

    // Create Livestock
    if (pathname === '/livestock') {
      const typePrefix = (data.animal_type || 'ANM').slice(0, 3).toUpperCase();
      const existingCount = getCollection(STORAGE_KEYS.LIVESTOCK).filter((l) => l.animal_type === data.animal_type).length;
      const animalId = `${typePrefix}-${String(existingCount + 1).padStart(3, '0')}`;
      const lsData = {
        ...data,
        animal_id: data.animal_id || animalId,
      };
      const created = insertItem(STORAGE_KEYS.LIVESTOCK, lsData, 'ls');
      return mockResponse(created, 201);
    }

    // Create Livestock Child Records (/livestock/:id/feed, /livestock/:id/medical, etc.)
    const lsPostMatch = pathname.match(/^\/livestock\/([^/]+)\/(feed|medical|vaccination|vaccinations|production)$/);
    if (lsPostMatch) {
      const [, livestockId, recordType] = lsPostMatch;
      const keyMap = {
        feed: STORAGE_KEYS.FEED_RECORDS,
        medical: STORAGE_KEYS.MEDICAL_RECORDS,
        vaccination: STORAGE_KEYS.VACCINATION_RECORDS,
        vaccinations: STORAGE_KEYS.VACCINATION_RECORDS,
        production: STORAGE_KEYS.PRODUCTION_RECORDS,
      };
      const rec = {
        ...data,
        livestock_id: livestockId,
      };
      if (recordType === 'production' && rec.quantity && rec.selling_price) {
        rec.income = Math.round(Number(rec.quantity) * Number(rec.selling_price) * 100) / 100;
      }
      const created = insertItem(keyMap[recordType], rec, recordType.slice(0, 4));
      return mockResponse(created, 201);
    }

    // Create Expense
    if (pathname === '/expenses') {
      const created = insertItem(STORAGE_KEYS.EXPENSES, data, 'exp');
      return mockResponse(created, 201);
    }

    // Create Income
    if (pathname === '/income') {
      const created = insertItem(STORAGE_KEYS.INCOME, data, 'inc');
      return mockResponse(created, 201);
    }

    // AI Predictors
    if (pathname === '/ai/yield/predict') {
      return mockResponse(demoMLPredictor.predictYield(data));
    }
    if (pathname === '/ai/profit/predict') {
      return mockResponse(demoMLPredictor.predictProfit(data));
    }
    if (pathname === '/ai/expense/anomaly') {
      return mockResponse(demoMLPredictor.detectAnomaly(data));
    }
    if (pathname === '/ai/expense/categorize') {
      return mockResponse(demoMLPredictor.categorizeExpense(data));
    }

    // AI Conversations & Chat
    if (pathname === '/ai/conversations') {
      const newConv = insertItem(STORAGE_KEYS.CONVERSATIONS, {
        title: 'New Conversation',
        title_source: 'default',
      }, 'conv');
      return mockResponse(newConv, 201);
    }

    if (pathname === '/ai/chat') {
      const messageText = data.message || '';
      let convId = data.conversation_id;

      if (!convId) {
        const conv = insertItem(STORAGE_KEYS.CONVERSATIONS, {
          title: messageText.slice(0, 45) + (messageText.length > 45 ? '...' : ''),
          title_source: 'auto',
        }, 'conv');
        convId = conv.id || conv._id;
      }

      // Store user message
      insertItem(STORAGE_KEYS.MESSAGES, {
        conversation_id: convId,
        role: 'user',
        content: messageText,
      }, 'msg');

      // Generate intelligent answer from current localStorage data
      const aiResult = await answerAssistantQuery(messageText);

      // Store assistant message
      insertItem(STORAGE_KEYS.MESSAGES, {
        conversation_id: convId,
        role: 'assistant',
        content: aiResult.answer,
        sources: aiResult.sources || [],
      }, 'msg');

      // Update conversation updated_at
      updateItem(STORAGE_KEYS.CONVERSATIONS, convId, { updated_at: new Date().toISOString() });

      return mockResponse({
        answer: aiResult.answer,
        conversation_id: convId,
        intent: aiResult.intent,
        sources: aiResult.sources || [],
      });
    }

    console.warn(`[AgriFlow Demo API] Unhandled POST endpoint: ${pathname}`);
    return mockResponse({ success: true }, 201);
  },

  async put(rawUrl, data = {}) {
    const { pathname } = parseUrl(rawUrl);

    // Put Crop
    const cropMatch = pathname.match(/^\/crops\/([^/]+)$/);
    if (cropMatch) {
      const updated = updateItem(STORAGE_KEYS.CROPS, cropMatch[1], data);
      return mockResponse(updated || data);
    }

    // Put Activity
    const actMatch = pathname.match(/^\/activities\/([^/]+)$/);
    if (actMatch) {
      const updated = updateItem(STORAGE_KEYS.ACTIVITIES, actMatch[1], data);
      return mockResponse(updated || data);
    }

    // Put Livestock
    const lsMatch = pathname.match(/^\/livestock\/([^/]+)$/);
    if (lsMatch) {
      const updated = updateItem(STORAGE_KEYS.LIVESTOCK, lsMatch[1], data);
      return mockResponse(updated || data);
    }

    // Put Livestock Child Records: /livestock/feed/:id, /livestock/medical/:id, etc.
    const lsRecMatch = pathname.match(/^\/livestock\/(feed|medical|vaccination|vaccinations|production)\/([^/]+)$/);
    if (lsRecMatch) {
      const [, recordType, id] = lsRecMatch;
      const keyMap = {
        feed: STORAGE_KEYS.FEED_RECORDS,
        medical: STORAGE_KEYS.MEDICAL_RECORDS,
        vaccination: STORAGE_KEYS.VACCINATION_RECORDS,
        vaccinations: STORAGE_KEYS.VACCINATION_RECORDS,
        production: STORAGE_KEYS.PRODUCTION_RECORDS,
      };
      const updated = updateItem(keyMap[recordType], id, data);
      return mockResponse(updated || data);
    }

    // Put Expense
    const expMatch = pathname.match(/^\/expenses\/([^/]+)$/);
    if (expMatch) {
      const updated = updateItem(STORAGE_KEYS.EXPENSES, expMatch[1], data);
      return mockResponse(updated || data);
    }

    // Put Income
    const incMatch = pathname.match(/^\/income\/([^/]+)$/);
    if (incMatch) {
      const updated = updateItem(STORAGE_KEYS.INCOME, incMatch[1], data);
      return mockResponse(updated || data);
    }

    console.warn(`[AgriFlow Demo API] Unhandled PUT endpoint: ${pathname}`);
    return mockResponse(data);
  },

  async patch(rawUrl, data = {}) {
    const { pathname } = parseUrl(rawUrl);

    // Notifications read-all
    if (pathname === '/notifications/read-all') {
      const notifs = getCollection(STORAGE_KEYS.NOTIFICATIONS);
      notifs.forEach((n) => { n.is_read = true; });
      setCollection(STORAGE_KEYS.NOTIFICATIONS, notifs);
      return mockResponse({ success: true, count: notifs.length });
    }

    // Notification read single
    const notifReadMatch = pathname.match(/^\/notifications\/([^/]+)\/read$/);
    if (notifReadMatch) {
      const updated = updateItem(STORAGE_KEYS.NOTIFICATIONS, notifReadMatch[1], { is_read: true });
      return mockResponse(updated || { is_read: true });
    }

    // Rename Conversation: /ai/conversations/:id
    const convMatch = pathname.match(/^\/ai\/conversations\/([^/]+)$/);
    if (convMatch) {
      const updated = updateItem(STORAGE_KEYS.CONVERSATIONS, convMatch[1], {
        title: data.title,
        title_source: data.source || 'manual',
      });
      return mockResponse(updated || data);
    }

    console.warn(`[AgriFlow Demo API] Unhandled PATCH endpoint: ${pathname}`);
    return mockResponse(data);
  },

  async delete(rawUrl) {
    const { pathname } = parseUrl(rawUrl);

    // Delete Farm
    const farmMatch = pathname.match(/^\/farms\/([^/]+)$/);
    if (farmMatch) {
      deleteItem(STORAGE_KEYS.FARMS, farmMatch[1]);
      return mockResponse(null, 204);
    }

    // Delete Field
    const fieldMatch = pathname.match(/^\/fields\/([^/]+)$/);
    if (fieldMatch) {
      deleteItem(STORAGE_KEYS.FIELDS, fieldMatch[1]);
      return mockResponse(null, 204);
    }

    // Delete Crop
    const cropMatch = pathname.match(/^\/crops\/([^/]+)$/);
    if (cropMatch) {
      deleteItem(STORAGE_KEYS.CROPS, cropMatch[1]);
      return mockResponse(null, 204);
    }

    // Delete Activity
    const actMatch = pathname.match(/^\/activities\/([^/]+)$/);
    if (actMatch) {
      deleteItem(STORAGE_KEYS.ACTIVITIES, actMatch[1]);
      return mockResponse(null, 204);
    }

    // Delete Livestock Child Record: /livestock/:recordType/:id
    const lsRecMatch = pathname.match(/^\/livestock\/(feed|medical|vaccination|vaccinations|production)\/([^/]+)$/);
    if (lsRecMatch) {
      const [, recordType, id] = lsRecMatch;
      const keyMap = {
        feed: STORAGE_KEYS.FEED_RECORDS,
        medical: STORAGE_KEYS.MEDICAL_RECORDS,
        vaccination: STORAGE_KEYS.VACCINATION_RECORDS,
        vaccinations: STORAGE_KEYS.VACCINATION_RECORDS,
        production: STORAGE_KEYS.PRODUCTION_RECORDS,
      };
      deleteItem(keyMap[recordType], id);
      return mockResponse(null, 204);
    }

    // Delete Livestock Animal
    const lsMatch = pathname.match(/^\/livestock\/([^/]+)$/);
    if (lsMatch) {
      deleteItem(STORAGE_KEYS.LIVESTOCK, lsMatch[1]);
      return mockResponse(null, 204);
    }

    // Delete Expense
    const expMatch = pathname.match(/^\/expenses\/([^/]+)$/);
    if (expMatch) {
      deleteItem(STORAGE_KEYS.EXPENSES, expMatch[1]);
      return mockResponse(null, 204);
    }

    // Delete Income
    const incMatch = pathname.match(/^\/income\/([^/]+)$/);
    if (incMatch) {
      deleteItem(STORAGE_KEYS.INCOME, incMatch[1]);
      return mockResponse(null, 204);
    }

    // Delete Notification
    const notifMatch = pathname.match(/^\/notifications\/([^/]+)$/);
    if (notifMatch) {
      deleteItem(STORAGE_KEYS.NOTIFICATIONS, notifMatch[1]);
      return mockResponse(null, 204);
    }

    // Delete Conversation
    const convMatch = pathname.match(/^\/ai\/conversations\/([^/]+)$/);
    if (convMatch) {
      const convId = convMatch[1];
      deleteItem(STORAGE_KEYS.CONVERSATIONS, convId);
      // Delete child messages
      const msgs = getCollection(STORAGE_KEYS.MESSAGES).filter((m) => m.conversation_id !== convId);
      setCollection(STORAGE_KEYS.MESSAGES, msgs);
      return mockResponse(null, 204);
    }

    console.warn(`[AgriFlow Demo API] Unhandled DELETE endpoint: ${pathname}`);
    return mockResponse(null, 204);
  },

  // Interceptors stub
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} },
  },
};

export default demoApiAdapter;
