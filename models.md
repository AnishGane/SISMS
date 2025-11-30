### admin.model.js

```
| Field                       | Meaning                                            |
| --------------------------- | -------------------------------------------------- |
| `name`                      | Store owner’s name                                 |
| `email`, `password`         | Credentials for login                              |
| `role`                      | Always `"admin"`                                   |
| `storeName`, `storeAddress` | The store identity shown in invoices, dashboards   |
| `phone`, `avatar`           | Optional profile information                       |
| `storeCurrency`, `timezone` | Localization settings – useful for real businesses |
| `lowStockAlert`             | Whether the admin wants notifications              |
| `isActive`                  | If false, the admin’s account is suspended         |
| `createdAt`, `updatedAt`    | Auditing timestamps                                |

```

### staff.model.js

Purpose:

- Staff users cannot sign up.
- Admins create staff accounts for their store. Staff can:
- Create sales (orders)
- Check products (read-only or limited write)
- See stock levels
- Use intelligent search

```
| Field                       | Meaning                                                                     |
| --------------------------- | --------------------------------------------------------------------------- |
| `name`, `email`, `password` | Staff identity & credentials                                                |
| `role`                      | Always `"staff"`                                                            |
| `store`                     | Reference to **Admin → store owner**                                        |
| `phone`, `avatar`           | Optional profile/contact                                                    |
| `permissions`               | Future extension: different staff roles (cashier, inventory clerk, manager) |
| `isActive`                  | If staff is fired/deactivated                                               |

```

### product.model.js

```
| Field                             | Description                                         |
| --------------------------------- | --------------------------------------------------- |
| `name`, `category`, `description` | Basic product information                           |
| `sku`                             | Unique product identifiers                                      |
| `price`                           | Selling price                                       |
| `cost`                            | Buying price from suppliers                         |
| `unit`                            | pcs, kg, liter, etc.                                |
| `stock`                           | Current available stock                             |
| `reorderLevel`                    | When stock goes below this, you should reorder      |
| `leadTimeDays`                    | Supplier delivery days                              |
| `location`                        | Where the item is stored (Rack B2, Freezer-1, etc.) |
| `supplier`                        | Links product to supplier info                      |
| `salesHistory`                    | Embedded snapshot of sales (small history)          |
| `avgDailySales`                   | Used for intelligent reorder algorithm              |
| `lastReorderDate`                 | Useful for forecasting                              |
| `store`                           | Which admin/store owns this product                 |

This model supports:
- Intelligent search (TF-IDF + fuzzy match)
- Reorder suggestion algorithm
- Stock management
- Sales analytics
- Supplier-based purchase orders

```

### sale.model.js (Embedded sales history for product)

It is used inside:

- Product’s salesHistory
- Orders (summary)
- Or a future Sale collection

```
| Field                      | Description                                                         |
| -------------------------- | ------------------------------------------------------------------- |
| `productName`, `category`  | Snapshot (even if product is edited later, history remains correct) |
| `qty`, `price`, `total`    | Sale details                                                        |
| `soldBy`                   | Staff responsible                                                   |
| `store`                    | Admin/Store                                                         |
| `date`                     | Timestamp                                                           |
| `discount`, `tax`          | Item-level adjustments                                              |
| `isReturned`, `returnDate` | For returns/refunds                                                 |

```

### order.model.js (Actual sales/Billing)

Whenever a staff sells items → an Order is created.

```
| Field                     | Meaning                             |
| ------------------------- | ----------------------------------- |
| `invoiceNo`               | Unique bill number                  |
| `items[]`                 | List of products sold               |
| `total`                   | Total after calculating item totals |
| `discount`, `tax`         | Order-level adjustments             |
| `customerName`            | Optional                            |
| `createdBy`               | Staff who made the sale             |
| `paymentType`             | cash, card, esewa, khalti           |
| `paidAmount`, `remaining` | Billing split                       |
| `store`                   | Admin/store                         |
| `status`                  | completed, cancelled, refunded      |

```

**Why important**

- Used to decrease stock
- Used for staff performance tracking
- Used for sales reporting and daily summary
- Used for business analytics

### stockAdjustment.model.js (Stock Adjustment Model)

**Real stores face:**

- Damaged items
- Expired items
- Missing/stolen stock
- Manual corrections
  Every stock change must be logged with proof & accountability.

```
| Field                            | Description                        |
| -------------------------------- | ---------------------------------- |
| `product`                        | Which product was adjusted         |
| `qtyChange`                      | +5, -3, etc.                       |
| `reason`                         | damage, expiry, stolen, correction |
| `adjustedBy` & `adjustedByModel` | Admin/Staff who changed            |
| `store`                          | Store reference                    |
| `note`                           | Optional explanation               |
```

### supplier.model.js(Supplier Model)

**Purpose**
Stores buy products from suppliers.
This model tracks:

- Suppliers
- Contacts
- What products they supply

```
| Field                       | Meaning           |
| --------------------------- | ----------------- |
| `name`                      | Supplier’s name   |
| `phone`, `email`, `address` | Contact details   |
| `contactPerson`             | Who to call       |
| `products[]`                | Products supplied |
| `store`                     | Admin/store owner |
```

**Required for:**

- Purchase orders
- Reorder suggestions
- Cost tracking

### purchaseOrder.model.js

When admin orders new stock from a supplier, a Purchase Order (PO) is created.

Example:
"We need 50 cartons of Milk at Rs. 40 cost price."

```
| Field          | Meaning                      |
| -------------- | ---------------------------- |
| `poNo`         | Purchase order number        |
| `supplier`     | Supplier reference           |
| `products[]`   | Items requested              |
| `qty` & `cost` | What is being bought         |
| `status`       | ordered, received, cancelled |
| `receivedAt`   | When stock arrived           |
| `createdBy`    | Admin who placed order       |
| `store`        | Store link                   |
```

### notification.model.js

**System-wide alerts for:**

- Low stock
- New orders
- Staff activities
- System reminders

```
| Field               | Description                    |
| ------------------- | ------------------------------ |
| `user`, `userModel` | Who receives this notification |
| `message`           | Text                           |
| `type`              | low_stock, order, system       |
| `isRead`            | Whether opened                 |
| `store`             | Store reference                |
```
