import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../src/schema";
import { hash } from "@node-rs/argon2";

const connectionString = process.env.DATABASE_URL ?? "postgresql://techdeels:techdeels@localhost:5432/techdeels";
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  const categoryData = [
    { name: "GPU", slug: "gpu", description: "Graphics cards and GPUs" },
    { name: "CPU", slug: "cpu", description: "Processors and CPUs" },
    { name: "Laptops", slug: "laptops", description: "Laptops and notebooks" },
    { name: "Monitors", slug: "monitors", description: "Monitors and displays" },
    { name: "Peripherals", slug: "peripherals", description: "Keyboards, mice, headsets" },
    { name: "Networking", slug: "networking", description: "Routers, switches, network gear" },
    { name: "Storage", slug: "storage", description: "SSDs, HDDs, and memory" },
    { name: "Cases & Cooling", slug: "cases-cooling", description: "PC cases and cooling solutions" },
  ];

  await db.insert(schema.categories).values(categoryData).onConflictDoNothing();
  console.log("✅ Categories created");

  // Tags
  const tagData = [
    { name: "Used", slug: "used" },
    { name: "Open Box", slug: "open-box" },
    { name: "Refurbished", slug: "refurbished" },
    { name: "New", slug: "new" },
    { name: "ATX", slug: "atx" },
    { name: "mATX", slug: "matx" },
    { name: "ITX", slug: "itx" },
    { name: "Flash Sale", slug: "flash-sale" },
  ];

  await db.insert(schema.tags).values(tagData).onConflictDoNothing();
  console.log("✅ Tags created");

  // Admin user
  const adminPassword = await hash("admin123", {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const adminId = crypto.randomUUID();
  await db.insert(schema.users).values({
    id: adminId,
    username: "admin",
    email: "admin@techdeels.com",
    hashed_password: adminPassword,
    role: "admin",
    reputation: 1000,
  }).onConflictDoNothing();

  // Regular users
  const user1Password = await hash("password123", {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const user1Id = crypto.randomUUID();
  const user2Id = crypto.randomUUID();

  await db.insert(schema.users).values([
    {
      id: user1Id,
      username: "techfan42",
      email: "techfan42@example.com",
      hashed_password: user1Password,
      role: "user",
      reputation: 150,
    },
    {
      id: user2Id,
      username: "dealseeker",
      email: "dealseeker@example.com",
      hashed_password: user1Password,
      role: "user",
      reputation: 87,
    },
  ]).onConflictDoNothing();

  console.log("✅ Users created");
  console.log("   Admin: admin@techdeels.com / admin123");
  console.log("   User1: techfan42@example.com / password123");
  console.log("   User2: dealseeker@example.com / password123");

  // Get category IDs
  const cats = await db.select().from(schema.categories);
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  // Sample deals
  const dealData = [
    {
      title: "NVIDIA RTX 4070 Super 12GB — All-time Low Price",
      url: "https://www.amazon.com/dp/B0CSVBTHF3",
      price: "499.99",
      original_price: "599.99",
      store: "Amazon",
      description: "The RTX 4070 Super hits a new low. Great for 1440p gaming with DLSS 3 support.",
      image_url: null,
      status: "active",
      score: 42,
      user_id: adminId,
      category_id: catMap["gpu"],
    },
    {
      title: "AMD Ryzen 7 7700X 8-Core Processor",
      url: "https://www.newegg.com/amd-ryzen-7-7700x",
      price: "249.99",
      original_price: "399.99",
      store: "Newegg",
      description: "Excellent mid-range CPU for gaming and productivity. AM5 socket.",
      image_url: null,
      status: "active",
      score: 35,
      user_id: user1Id,
      category_id: catMap["cpu"],
    },
    {
      title: "Samsung 55\" 4K OLED Monitor — $200 Off",
      url: "https://www.bestbuy.com/samsung-oled-monitor",
      price: "799.99",
      original_price: "999.99",
      store: "Best Buy",
      description: "Stunning OLED display with 144Hz refresh rate, perfect for gaming and content creation.",
      image_url: null,
      status: "active",
      score: 28,
      user_id: user2Id,
      category_id: catMap["monitors"],
    },
    {
      title: "ASUS ROG Strix G16 Gaming Laptop — RTX 4060",
      url: "https://www.amazon.com/asus-rog-g16",
      price: "1099.99",
      original_price: "1299.99",
      store: "Amazon",
      description: "16-inch gaming laptop with RTX 4060, Intel i7-13650HX, 16GB RAM, 512GB SSD.",
      image_url: null,
      status: "active",
      score: 22,
      user_id: adminId,
      category_id: catMap["laptops"],
    },
    {
      title: "Logitech G Pro X Superlight 2 Gaming Mouse",
      url: "https://www.amazon.com/logitech-gpx-superlight-2",
      price: "129.99",
      original_price: "159.99",
      store: "Amazon",
      description: "Ultra-lightweight wireless gaming mouse. One of the best sensors on the market.",
      image_url: null,
      status: "active",
      score: 19,
      user_id: user1Id,
      category_id: catMap["peripherals"],
    },
    {
      title: "Samsung 990 Pro 2TB NVMe SSD",
      url: "https://www.amazon.com/samsung-990-pro-2tb",
      price: "139.99",
      original_price: "199.99",
      store: "Amazon",
      description: "Top-tier PCIe 4.0 NVMe SSD. 7450MB/s read, 6900MB/s write. Great for gaming.",
      image_url: null,
      status: "active",
      score: 31,
      user_id: user2Id,
      category_id: catMap["storage"],
    },
    {
      title: "TP-Link Archer AX6000 WiFi 6 Router",
      url: "https://www.amazon.com/tp-link-ax6000",
      price: "179.99",
      original_price: "279.99",
      store: "Amazon",
      description: "8-stream dual band WiFi 6 router. Great for large homes.",
      image_url: null,
      status: "active",
      score: 15,
      user_id: adminId,
      category_id: catMap["networking"],
    },
    {
      title: "Corsair iCUE H150i Elite LCD 360mm AIO Cooler",
      url: "https://www.newegg.com/corsair-h150i-elite-lcd",
      price: "159.99",
      original_price: "229.99",
      store: "Newegg",
      description: "Premium 360mm AIO with LCD display. Excellent cooling performance.",
      image_url: null,
      status: "active",
      score: 12,
      user_id: user1Id,
      category_id: catMap["cases-cooling"],
    },
    {
      title: "Intel Core i5-14600K — Price Drop",
      url: "https://www.microcenter.com/i5-14600k",
      price: "229.99",
      original_price: "309.99",
      store: "Micro Center",
      description: "14-core (6P+8E) processor. Excellent gaming CPU at this price point.",
      image_url: null,
      status: "active",
      score: 27,
      user_id: user2Id,
      category_id: catMap["cpu"],
    },
    {
      title: "LG 27GP850-B 27\" 165Hz QHD Gaming Monitor",
      url: "https://www.amazon.com/lg-27gp850",
      price: "249.99",
      original_price: "399.99",
      store: "Amazon",
      description: "1440p 165Hz Nano IPS panel. Excellent colors and response time for gaming.",
      image_url: null,
      status: "active",
      score: 38,
      user_id: adminId,
      category_id: catMap["monitors"],
    },
    {
      title: "Keychron Q3 Pro QMK/VIA Wireless Mechanical Keyboard",
      url: "https://www.keychron.com/q3-pro",
      price: "129.99",
      original_price: "169.99",
      store: "Keychron",
      description: "Premium TKL wireless mechanical keyboard with hot-swappable switches.",
      image_url: null,
      status: "active",
      score: 23,
      user_id: user1Id,
      category_id: catMap["peripherals"],
    },
    {
      title: "Crucial 32GB DDR5-5600 Kit (2x16GB)",
      url: "https://www.amazon.com/crucial-ddr5-5600",
      price: "79.99",
      original_price: "119.99",
      store: "Amazon",
      description: "Fast DDR5 memory for Intel 12th/13th/14th gen and AMD AM5 builds.",
      image_url: null,
      status: "active",
      score: 20,
      user_id: user2Id,
      category_id: catMap["storage"],
    },
  ];

  await db.insert(schema.deals).values(dealData).onConflictDoNothing();
  console.log("✅ Sample deals created");

  // Get inserted deals
  const insertedDeals = await db.select().from(schema.deals).limit(5);

  // Add some votes
  if (insertedDeals.length > 0) {
    const voteData = [];
    for (const deal of insertedDeals.slice(0, 3)) {
      voteData.push({ user_id: user1Id, deal_id: deal.id, value: 1 });
      voteData.push({ user_id: user2Id, deal_id: deal.id, value: 1 });
    }
    await db.insert(schema.votes).values(voteData).onConflictDoNothing();
    console.log("✅ Sample votes created");

    // Add some comments
    if (insertedDeals[0]) {
      const commentData = [
        {
          content: "Great deal! I just grabbed one. The performance uplift over the 4070 non-super is substantial.",
          user_id: user1Id,
          deal_id: insertedDeals[0].id,
          score: 5,
        },
        {
          content: "Does this work with PCIe 3.0 motherboards?",
          user_id: user2Id,
          deal_id: insertedDeals[0].id,
          score: 2,
        },
      ];
      await db.insert(schema.comments).values(commentData).onConflictDoNothing();

      if (insertedDeals[1]) {
        await db.insert(schema.comments).values({
          content: "Excellent price for the 7700X. Pair it with a good B650 board and you're set.",
          user_id: adminId,
          deal_id: insertedDeals[1].id,
          score: 3,
        }).onConflictDoNothing();
      }
      console.log("✅ Sample comments created");
    }
  }

  console.log("\n🎉 Database seeded successfully!");
  await client.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
