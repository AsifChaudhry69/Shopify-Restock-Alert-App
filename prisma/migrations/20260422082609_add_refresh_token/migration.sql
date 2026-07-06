-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Subscription_shop_variantId_idx" ON "Subscription"("shop", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_email_variantId_key" ON "Subscription"("email", "variantId");
