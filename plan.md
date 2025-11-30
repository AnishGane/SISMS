1. Landing Page with a hero section, services that is provided by my system, footer, some helpful CTAs with the images od the the pages that my system has(initially out demo images).
2. after get started CTA for eg:, then there should be a part like multi part forms like step 1 about yourslef (intros like.), step 2 like where you heard about us, about your business related stuff and info., step 3 proced to login page/sign(register) page, in Login it should have email, password, forget password and toggle password functionalities, and a role select which have 2 options(admin and staff) and a sign up button and login page link, that login page should have name, email, password, confirm password, same role and password functionalities as of the register page and a link for signu page and login button.
3. if role === admin then it should display the dashboard page for admin and if staff then products view page(which is read-only for staff), and all the other needed functionalities, pages and charts realted stuff that should be displayed for an admin and also related pages and things that staff can do.
4. the admin should have staff managament section where he can assign the email and password for their staff for thei store(that has store name and location) then only the staff should be able to login. NOTE: staff doesnot have rights to signup because admin is the only for the staff creation and deletion process.
5. project is all about Smart Inventory and Sales management system(SISMS), also Admin / Owner — manage products, staff, view reports. Staff / Salesperson — create sales, view product search & stock, view suggested reorders
6. Algorithm 1: Reorder suggestion using moving average demand + safety stock, Algorithm 2: Intelligent product search (TF-IDF ranking + Levenshtein fuzzy fallback)
7. Models:
   i. order.model.js: // models/Order.js

   ```
    import mongoose from "mongoose";

    const OrderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true },
    category: { type: String },
    qty: { type: Number, required: true },
    price: { type: Number, required: true }, // unit price at order time
    total: { type: Number, required: true }, // qty * price
    description: { type: String }, // optional detailed description
    });

    const OrderSchema = new mongoose.Schema({
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    customerName: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }, // change from User → Staff
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // add store reference
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "completed",
    },
    createdAt: { type: Date, default: Date.now },
    });

    const OrderModel =
    mongoose.models.order || mongoose.model("Order", OrderSchema);

    export default OrderModel;
   ```

   ii. product.model.js: import mongoose from "mongoose";

   ```
   import SaleSchema from "./sale.model.js";

   const ProductSchema = new mongoose.Schema({
   name: { type: String, required: true },
   sku: { type: String, unique: true },
   category: { type: String, required: true },
   description: { type: String, required: true },
   image: { type: String, default: "" },
   price: { type: Number, required: true },
   cost: { type: Number, required: true },
   stock: { type: Number, default: 0 },
   reorderLevel: { type: Number, default: 10 },
   leadTimeDays: { type: Number, default: 7 },
   store: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // add store
   salesHistory: [SaleSchema],
   createdAt: { type: Date, default: Date.now },
   });

   const ProductModel =
   mongoose.models.product || mongoose.model("Product", ProductSchema);

   export default ProductModel;
   ```

   iii. sale.model.js: import mongoose from "mongoose";

   ```

   const SaleSchema = new mongoose.Schema({
   orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
   productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
   productName: { type: String, required: true }, // snapshot
   category: { type: String },
   qty: { type: Number, required: true },
   price: { type: Number, required: true },
   total: { type: Number, required: true },
   soldBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }, // change from User → Staff
   store: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // add store reference
   date: { type: Date, default: Date.now },
   discount: { type: Number, default: 0 },
   tax: { type: Number, default: 0 },
   });

   export default SaleSchema;
   ```

iv. user.model.js: // user.model.js

```
    import mongoose from "mongoose";

    // Admin model
    const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    storeName: { type: String, required: true },
    storeAddress: { type: String },
    createdAt: { type: Date, default: Date.now },
    });

    export const AdminModel =
    mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

    // Staff model
    const StaffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "staff" },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    createdAt: { type: Date, default: Date.now },
    });

    export const StaffModel =
    mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
```

These are my current models for my project , make sure they are as it is required for the proper functioning of my project and make or imporove or give suggestion to make it even more better and align with the real world project database. 
8. Add more functionalities so that it will be closer to the real world solution for an inventory problem out there. 8. I also have question that can is use both admin and staff folder related stuffs like pages, routing, components, apis and other things in one main folder **client** and in src to put admin and staff folder and things in there. i am confused here, let me know about it.
