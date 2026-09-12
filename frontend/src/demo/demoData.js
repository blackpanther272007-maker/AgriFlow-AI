import { demoDb } from './demoDatabase';

export const DEMO_USER = {
  _id: "demo-user-001",
  email: "demo@farmflow.app",
  name: "Demo Farmer",
  role: "farmer",
  isDemo: true
};

export const DEMO_DATA = {
  users: [DEMO_USER],
  farms: [
    { _id: 'farm-1', user_id: 'demo-user-001', name: 'Green Valley Farm', location: 'Tamil Nadu', area: 12, unit: 'acres', soil_type: 'Loamy', created_at: new Date().toISOString() }
  ],
  fields: [
    { _id: 'field-1', farm_id: 'farm-1', user_id: 'demo-user-001', name: 'Field A - North', area: 5, unit: 'acres', crop_type: 'Rice', status: 'active' },
    { _id: 'field-2', farm_id: 'farm-1', user_id: 'demo-user-001', name: 'Field B - South', area: 4, unit: 'acres', crop_type: 'Tomato', status: 'active' },
    { _id: 'field-3', farm_id: 'farm-1', user_id: 'demo-user-001', name: 'Field C - East', area: 3, unit: 'acres', crop_type: 'Groundnut', status: 'fallow' }
  ],
  crops: [
    { _id: 'crop-1', field_id: 'field-1', farm_id: 'farm-1', user_id: 'demo-user-001', name: 'Rice', variety: 'Basmati 370', planted_date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(), expected_harvest_date: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(), status: 'growing' },
    { _id: 'crop-2', field_id: 'field-2', farm_id: 'farm-1', user_id: 'demo-user-001', name: 'Tomato', variety: 'Roma', planted_date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(), expected_harvest_date: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString(), status: 'growing' }
  ],
  activities: [
    { _id: 'act-1', farm_id: 'farm-1', field_id: 'field-1', user_id: 'demo-user-001', type: 'Land Preparation', date: new Date(Date.now() - 35 * 24 * 3600 * 1000).toISOString(), description: 'Ploughing and leveling', status: 'completed' },
    { _id: 'act-2', farm_id: 'farm-1', field_id: 'field-1', user_id: 'demo-user-001', type: 'Seed Sowing', date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(), description: 'Sowing Basmati seeds', status: 'completed' },
    { _id: 'act-3', farm_id: 'farm-1', field_id: 'field-1', user_id: 'demo-user-001', type: 'Irrigation', date: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(), description: 'First watering', status: 'completed' },
    { _id: 'act-4', farm_id: 'farm-1', field_id: 'field-2', user_id: 'demo-user-001', type: 'Fertilizer Application', date: new Date().toISOString(), description: 'Applied NPK', status: 'pending' }
  ],
  expenses: [
    { _id: 'exp-1', farm_id: 'farm-1', user_id: 'demo-user-001', category: 'Seeds', amount: 5000, date: new Date(Date.now() - 35 * 24 * 3600 * 1000).toISOString(), description: 'Rice seeds' },
    { _id: 'exp-2', farm_id: 'farm-1', user_id: 'demo-user-001', category: 'Fertilizer', amount: 3000, date: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(), description: 'NPK Fertilizer' },
    { _id: 'exp-3', farm_id: 'farm-1', user_id: 'demo-user-001', category: 'Labour', amount: 8000, date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), description: 'Field preparation labour' }
  ],
  income: [
    { _id: 'inc-1', farm_id: 'farm-1', user_id: 'demo-user-001', category: 'Crop Sale', amount: 45000, date: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(), description: 'Previous season rice sale' }
  ],
  livestock: [
    { _id: 'live-1', farm_id: 'farm-1', user_id: 'demo-user-001', type: 'Cow', count: 5, breed: 'Holstein', status: 'healthy', health_status: 'healthy' },
    { _id: 'live-2', farm_id: 'farm-1', user_id: 'demo-user-001', type: 'Goat', count: 12, breed: 'Boer', status: 'healthy', health_status: 'healthy' }
  ],
  notifications: [
    { _id: 'notif-1', user_id: 'demo-user-001', title: 'Irrigation Reminder', message: 'Field A needs irrigation tomorrow.', type: 'alert', read: false, created_at: new Date().toISOString() },
    { _id: 'notif-2', user_id: 'demo-user-001', title: 'Weather Alert', message: 'Heavy rain expected in 2 days.', type: 'warning', read: false, created_at: new Date().toISOString() }
  ]
};

export const seedDemoData = async () => {
  const users = await demoDb.getAll('users');
  if (users.length === 0) {
    console.log("Seeding Demo Database...");
    for (const [storeName, items] of Object.entries(DEMO_DATA)) {
      for (const item of items) {
        await demoDb.put(storeName, item);
      }
    }
  }
};
