// controllers/admin/admin.controller.js

export const getAdminProfile = (req: Request, res: Response) => {
  // return admin's own profile
};

export const updateAdminProfile = (req: Request, res: Response) => {
  // update name, phone, avatar, storeAddress, etc.
};

export const updateStoreSettings = (req: Request, res: Response) => {
  // update storeName, storeCurrency, timezone, lowStockAlert
};

export const changePassword = (req: Request, res: Response) => {
  // oldPassword + newPassword check
};

export const getStoreDetails = (req: Request, res: Response) => {
  // send admin's storeName, address, settings, etc.
};
