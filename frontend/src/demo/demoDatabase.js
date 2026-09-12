const DB_NAME = 'FarmFlowDemoDB';
const DB_VERSION = 1;

const STORES = [
  'users',
  'farms',
  'fields',
  'crops',
  'activities',
  'expenses',
  'income',
  'livestock',
  'notifications'
];

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      STORES.forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          // In MongoDB, the primary key is often _id or id. The frontend uses id or _id depending on the object.
          // We will use id for standard responses, but let's key off 'id' as it's common for frontend entities 
          // transformed from Pydantic. Let's use 'id' as keyPath to be safe, but allow autoIncrement if omitted.
          db.createObjectStore(storeName, { keyPath: '_id' });
        }
      });
    };
  });
};

export const demoDb = {
  getAll: async (storeName) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  get: async (storeName, id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  put: async (storeName, item) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      // Auto-generate ID if missing
      if (!item._id) {
          item._id = `${storeName.substring(0, 3)}-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      }
      
      store.put(item);
      tx.oncomplete = () => resolve(item);
      tx.onerror = () => reject(tx.error);
    });
  },
  delete: async (storeName, id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },
  clear: async (storeName) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },
  find: async (storeName, predicate) => {
    const all = await demoDb.getAll(storeName);
    return all.filter(predicate);
  },
  findOne: async (storeName, predicate) => {
    const all = await demoDb.getAll(storeName);
    return all.find(predicate);
  },
  resetDatabase: async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES, 'readwrite');
      STORES.forEach(store => tx.objectStore(store).clear());
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
};
