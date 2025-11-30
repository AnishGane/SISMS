// controllers/admin/admin.controller.js

export const getAdminProfile = (req, res) => {
  // return admin's own profile
};

export const updateAdminProfile = (req, res) => {
  // update name, phone, avatar, storeAddress, etc.
};

export const updateStoreSettings = (req, res) => {
  // update storeName, storeCurrency, timezone, lowStockAlert
};

export const changePassword = (req, res) => {
  // oldPassword + newPassword check
};

export const getStoreDetails = (req, res) => {
  // send admin's storeName, address, settings, etc.
};
