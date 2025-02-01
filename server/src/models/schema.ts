import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "super_admin"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("admin"),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Stored in paise/cents
  images: text("images").array(),
  sizes: jsonb("sizes").$type<
    Array<{
      size: string;
      inventory: number;
      sku: string; // Unique identifier for each size variant
    }>
  >(),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: integer("created_by").references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(), // Unique readable order number
  userId: text("user_id").notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  total: integer("total").notNull(), // Stored in paise/cents
  paymentStatus: paymentStatusEnum("payment_status")
    .notNull()
    .default("pending"),
  paymentId: varchar("payment_id", { length: 255 }), // Payment gateway reference
  shippingAddress: jsonb("shipping_address").notNull(),
  billingAddress: jsonb("billing_address").notNull(),
  verificationCode: text("verification_code").notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }),
  notes: text("notes"), // For admin notes
  cancelReason: text("cancel_reason"),
  processedBy: integer("processed_by").references(() => users.id), // Admin who processed the order
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  size: varchar("size", { length: 4 }).notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // Price at time of purchase
  sku: varchar("sku", { length: 100 }).notNull(), // SKU at time of purchase
  name: text("name").notNull(), // Product name at time of purchase
});

// For tracking inventory changes
export const inventoryLogs = pgTable("inventory_logs", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  size: varchar("size", { length: 4 }).notNull(),
  quantity: integer("quantity").notNull(), // Can be negative for deductions
  reason: varchar("reason", { length: 100 }).notNull(), // e.g., 'order', 'manual-adjustment', 'return'
  orderId: integer("order_id").references(() => orders.id),
  notes: text("notes"),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
