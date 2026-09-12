import { demoDb } from './demoDatabase';

const MOCK_AI = {
  '/ai/status': { status: 'ready', models_loaded: true },
  '/ai/yield/predict': { predicted_yield: 4200, confidence: 0.85 },
  '/ai/profit/predict': { predicted_profit: 25000, margin: 0.35, confidence: 0.9 },
  '/ai/expense/anomaly': { is_anomaly: false, confidence: 0.95 }
};

export const handleDemoRequest = async (config) => {
  const { url, method, data, params } = config;
  
  // Parse URL: remove base and query params
  const fullUrl = new URL(url, 'http://localhost');
  const pathname = fullUrl.pathname.replace('/api', '').replace(/\/+$/, '');
  
  // Combine axios params with url search params
  const queryParams = new URLSearchParams(fullUrl.search);
  if (params) {
      for (const key in params) {
          queryParams.append(key, params[key]);
      }
  }

  const respond = (status, responseData) => ({
    data: responseData,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config,
    request: {}
  });

  // Removed verbose console logging to keep browser console clean

  // Auth endpoints
  if (pathname === '/auth/login') {
    const params = new URLSearchParams(data);
    const email = params.get('username');
    const password = params.get('password');
    if (email === 'demo@farmflow.app' && password === 'FarmFlow@Demo2026') {
      return respond(200, { access_token: 'farmflow_demo_token', token_type: 'bearer' });
    }
    return Promise.reject({ response: respond(401, { detail: 'Invalid credentials' }) });
  }

  if (pathname === '/auth/me') {
    const user = await demoDb.get('users', 'demo-user-001');
    return respond(200, user);
  }

  // Dashboard endpoints
  if (pathname === '/dashboard/summary') {
    const farms = await demoDb.getAll('farms');
    const fields = await demoDb.getAll('fields');
    const crops = await demoDb.getAll('crops');
    const expenses = await demoDb.getAll('expenses');
    const income = await demoDb.getAll('income');
    const livestock = await demoDb.getAll('livestock');
    
    return respond(200, {
      total_farms: farms.length,
      total_fields: fields.length,
      active_crops: crops.filter(c => c.status !== 'harvested').length,
      total_expenses: expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
      total_income: income.reduce((sum, i) => sum + (Number(i.amount) || 0), 0),
      livestock_count: livestock.reduce((sum, l) => sum + (Number(l.count) || 0), 0)
    });
  }

  if (pathname === '/dashboard/kpis') {
    const farms = await demoDb.getAll('farms');
    const fields = await demoDb.getAll('fields');
    const crops = await demoDb.getAll('crops');
    const livestock = await demoDb.getAll('livestock');
    return respond(200, {
      total_farms: farms.length,
      total_fields: fields.length,
      active_crops: crops.filter(c => c.status !== 'harvested').length,
      total_livestock: livestock.reduce((sum, l) => sum + (Number(l.count) || 0), 0)
    });
  }

  if (pathname === '/finance/summary') {
    const expenses = await demoDb.getAll('expenses');
    const income = await demoDb.getAll('income');
    const total_expenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const total_income = income.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    return respond(200, {
      total_income,
      total_expenses,
      net_profit: total_income - total_expenses
    });
  }

  if (pathname === '/dashboard/charts/finance') {
    return respond(200, {
      time_series: [
        { date: 'Jan', income: 4000, expenses: 2400 },
        { date: 'Feb', income: 3000, expenses: 1398 },
        { date: 'Mar', income: 2000, expenses: 9800 },
        { date: 'Apr', income: 2780, expenses: 3908 },
        { date: 'May', income: 1890, expenses: 4800 },
        { date: 'Jun', income: 2390, expenses: 3800 }
      ],
      expense_categories: [
        { name: 'Seed', value: 400 },
        { name: 'Fertilizer', value: 300 },
        { name: 'Labor', value: 300 },
        { name: 'Fuel', value: 200 }
      ]
    });
  }

  if (pathname === '/dashboard/crops') {
    return respond(200, {
      status_distribution: [
        { name: 'planted', value: 4 },
        { name: 'growing', value: 3 },
        { name: 'harvesting', value: 2 }
      ],
      profitability: [
        { crop_id: '1', name: 'Wheat', status: 'growing', area: 50, area_unit: 'Acres', income: 5000, expenses: 2000, profit: 3000 },
        { crop_id: '2', name: 'Corn', status: 'harvested', area: 100, area_unit: 'Acres', income: 10000, expenses: 4000, profit: 6000 }
      ]
    });
  }

  if (pathname === '/dashboard/livestock') {
    return respond(200, {
      types_distribution: [
        { name: 'Cattle', value: 50 },
        { name: 'Sheep', value: 120 },
        { name: 'Poultry', value: 500 }
      ],
      upcoming_vaccinations: [
        { _id: '1', vaccine_name: 'FMD', animal_type: 'Cattle', animal_id: 'Herd A', next_due_date: new Date().toISOString() },
        { _id: '2', vaccine_name: 'Rabies', animal_type: 'Sheep', animal_id: 'Flock 1', next_due_date: new Date(Date.now() + 86400000).toISOString() }
      ]
    });
  }

  if (pathname === '/dashboard/recent-activity') {
    return respond(200, [
      { id: '1', type: 'Expense', title: 'Bought seeds', amount: 500, date: new Date().toISOString() },
      { id: '2', type: 'Income', title: 'Sold milk', amount: 1200, date: new Date().toISOString() }
    ]);
  }

  if (pathname === '/notifications/unread-count') {
    return respond(200, { count: 3 });
  }

  // AI endpoints
  if (pathname.startsWith('/ai/')) {
    return respond(200, MOCK_AI[pathname] || {});
  }

  // Generic REST matcher
  const parts = pathname.split('/').filter(Boolean);
  const collection = parts[0];
  const id = parts[1];
  const subresource = parts[2];
  
  const validCollections = ['farms', 'fields', 'crops', 'activities', 'expenses', 'income', 'livestock', 'notifications'];
  
  if (validCollections.includes(collection)) {
    try {
      if (method.toLowerCase() === 'get') {
        if (id) {
          if (subresource) {
            return respond(200, []);
          }
          const item = await demoDb.get(collection, id);
          return item ? respond(200, item) : Promise.reject({ response: respond(404, { detail: 'Not found' }) });
        } else {
          let items = await demoDb.getAll(collection);
          for (const [key, value] of queryParams.entries()) {
            items = items.filter(item => String(item[key]) === String(value));
          }
          return respond(200, items);
        }
      } 
      else if (method.toLowerCase() === 'post') {
        const payload = typeof data === 'string' ? JSON.parse(data) : data;
        const newItem = await demoDb.put(collection, payload);
        return respond(200, newItem);
      }
      else if (method.toLowerCase() === 'put' || method.toLowerCase() === 'patch') {
        const payload = typeof data === 'string' ? JSON.parse(data) : data;
        const existing = await demoDb.get(collection, id);
        if (!existing) return Promise.reject({ response: respond(404, { detail: 'Not found' }) });
        
        const updatedItem = await demoDb.put(collection, { ...existing, ...payload });
        return respond(200, updatedItem);
      }
      else if (method.toLowerCase() === 'delete') {
        await demoDb.delete(collection, id);
        return respond(200, { success: true });
      }
    } catch (err) {
      return Promise.reject({ response: respond(500, { detail: err.message }) });
    }
  }

  console.warn(`[Demo API] Unhandled endpoint: ${method} ${pathname}`);
  return respond(200, []);
};
