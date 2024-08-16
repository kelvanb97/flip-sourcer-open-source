-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_amazonInfoId_fkey" FOREIGN KEY ("amazonInfoId") REFERENCES "AmazonInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
