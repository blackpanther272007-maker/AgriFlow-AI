import { INITIAL_DEMO_DATA } from './demoData';

export const STORAGE_PREFIX = 'agriflow_demo_';

export const STORAGE_KEYS = {
  FARMS: `${STORAGE_PREFIX}farms`,
  FIELDS: `${STORAGE_PREFIX}fields`,
  CROPS: `${STORAGE_PREFIX}crops`,
  LIVESTOCK: `${STORAGE_PREFIX}livestock`,
  FEED_RECORDS: `${STORAGE_PREFIX}feed_records`,
  MEDICAL_RECORDS: `${STORAGE_PREFIX}medical_records`,
  VACCINATION_RECORDS: `${STORAGE_PREFIX}vaccination_records`,
  PRODUCTION_RECORDS: `${STORAGE_PREFIX}production_records`,
  ACTIVITIES: `${STORAGE_PREFIX}activities`,
  EXPENSES: `${STORAGE_PREFIX}expenses`,
  INCOME: `${STORAGE_PREFIX}income`,
  NOTIFICATIONS: `${STORAGE_PREFIX}notifications`,
  CONVERSATIONS: `${STORAGE_PREFIX}conversations`,
  MESSAGES: `${STORAGE_PREFIX}messages`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
};

// Safe JSON parser with corruption fallback
export const safeGet = (key, fallback = null) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[AgriFlow Demo] Corrupted localStorage data for key "${key}". Restoring default.`, error);
    return fallback;
  }
};

export const safeSet = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[AgriFlow Demo] Failed to set localStorage key "${key}":`, error);
  }
};

export const safeRemove = (key) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[AgriFlow Demo] Failed to remove key "${key}":`, error);
  }
};

/**
 * Initialize demo data in localStorage if not already present.
 * If force = true, overwrites existing demo data with initial seeds.
 */
export const initDemoData = (force = false) => {
  if (typeof window === 'undefined') return;

  const datasetMap = {
    [STORAGE_KEYS.FARMS]: INITIAL_DEMO_DATA.farms,
    [STORAGE_KEYS.FIELDS]: INITIAL_DEMO_DATA.fields,
    [STORAGE_KEYS.CROPS]: INITIAL_DEMO_DATA.crops,
    [STORAGE_KEYS.LIVESTOCK]: INITIAL_DEMO_DATA.livestock,
    [STORAGE_KEYS.FEED_RECORDS]: INITIAL_DEMO_DATA.feed_records,
    [STORAGE_KEYS.MEDICAL_RECORDS]: INITIAL_DEMO_DATA.medical_records,
    [STORAGE_KEYS.VACCINATION_RECORDS]: INITIAL_DEMO_DATA.vaccination_records,
    [STORAGE_KEYS.PRODUCTION_RECORDS]: INITIAL_DEMO_DATA.production_records,
    [STORAGE_KEYS.ACTIVITIES]: INITIAL_DEMO_DATA.activities,
    [STORAGE_KEYS.EXPENSES]: INITIAL_DEMO_DATA.expenses,
    [STORAGE_KEYS.INCOME]: INITIAL_DEMO_DATA.income,
    [STORAGE_KEYS.NOTIFICATIONS]: INITIAL_DEMO_DATA.notifications,
    [STORAGE_KEYS.CONVERSATIONS]: INITIAL_DEMO_DATA.conversations,
    [STORAGE_KEYS.MESSAGES]: INITIAL_DEMO_DATA.messages,
    [STORAGE_KEYS.SETTINGS]: INITIAL_DEMO_DATA.settings,
  };

  Object.entries(datasetMap).forEach(([storageKey, defaultItems]) => {
    if (force || localStorage.getItem(storageKey) === null) {
      safeSet(storageKey, defaultItems);
    }
  });
};

/**
 * Completely resets AgriFlow Demo data without affecting other applications.
 */
export const resetDemoData = () => {
  if (typeof window === 'undefined') return;

  // Clear all AgriFlow demo keys only
  Object.values(STORAGE_KEYS).forEach((k) => safeRemove(k));

  // Re-seed original dataset
  initDemoData(true);

  // Dispatch global event so active components can refresh their state
  window.dispatchEvent(new CustomEvent('agriflow:demo-reset'));
};

/**
 * Generic collection helpers
 */
export const getCollection = (key) => {
  const data = safeGet(key, null);
  if (data === null) {
    // Self-healing: if collection is missing, re-seed and return default
    initDemoData(false);
    return safeGet(key, []);
  }
  return Array.isArray(data) ? data : [];
};

export const setCollection = (key, items) => {
  safeSet(key, items);
};

export const findById = (key, id) => {
  const items = getCollection(key);
  return items.find((item) => (item._id || item.id) === id) || null;
};

export const insertItem = (key, item, prefix = 'item') => {
  const items = getCollection(key);
  const now = new Date().toISOString();
  const newItem = {
    ...item,
    _id: item._id || item.id || `${prefix}_demo_${Date.now().toString().slice(-6)}`,
    created_at: item.created_at || now,
    updated_at: now,
  };
  // Ensure id property matches _id for compatibility
  if (!newItem.id) newItem.id = newItem._id;
  items.unshift(newItem);
  setCollection(key, items);
  return newItem;
};

export const updateItem = (key, id, updates) => {
  const items = getCollection(key);
  const index = items.findIndex((item) => (item._id || item.id) === id);
  if (index === -1) return null;

  const updated = {
    ...items[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  items[index] = updated;
  setCollection(key, items);
  return updated;
};

export const deleteItem = (key, id) => {
  const items = getCollection(key);
  const filtered = items.filter((item) => (item._id || item.id) !== id);
  const deleted = filtered.length !== items.length;
  setCollection(key, filtered);
  return deleted;
};

// Automatically ensure demo data exists upon module import
if (typeof window !== 'undefined') {
  initDemoData(false);
}
