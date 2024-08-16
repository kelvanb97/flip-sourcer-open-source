// import { ScraperApiAmazonPdpJson } from "../../../../../types/ScraperApi";
// import { liveUpdatesKeepaApiKey } from "../../../../shared/envVars";
// import { getDomAutoParse } from "../scraperApi";
// import { quantitySanityCheck, getBestVariation } from "./amazonPdp";
import { getBestVariation } from "./amazonPdp";

// it("num products per category", async () => {
//     const categoryMap = {
//         "Alexa Skills": 13727921011,
//         "Appliances": 2619525011,
//         "Apps & Games": 2350149011,
//         "Arts, Crafts & Sewing": 2617941011,
//         "Audible Books & Originals": 18145289011,
//         "Automotive": 15684181,
//         "Baby Products": 165796011,
//         "Beauty & Personal Care": 3760911,
//         "Books": 283155,
//         "CDs & Vinyl": 5174,
//         "Cell Phones & Accessories": 2335752011,
//         "Clothing, Shoes & Jewelry": 7141123011,
//         "Collectibles & Fine Art": 4991425011,
//         "Digital Music": 163856011,
//         "Electronics": 172282,
//         "Everything Else": 10272111,
//         "Gift Cards": 2238192011,
//         "Grocery & Gourmet Food": 16310101,
//         "Handmade Products": 11260432011,
//         "Health & Household": 3760901,
//         "Home & Kitchen": 1055398,
//         "Industrial & Scientific": 16310091,
//         "Kindle Store": 133140011,
//         "Magazine Subscriptions": 599858,
//         "Movies & TV": 2625373011,
//         "Musical Instruments": 11091801,
//         "Office Products": 1064954,
//         "Patio, Lawn & Garden": 2972638011,
//         "Pet Supplies": 2619533011,
//         "Software": 229534,
//         "Sports & Outdoors": 3375251,
//         "Tools & Home Improvement": 228013,
//         "Toys & Games": 165793011,
//         "Video Games": 468642,
//         "Video Shorts": 9013971011,
//     }


//     const numProductsInCategoryMap: Record<string, number> = {};
//     for (const [categoryName, categoryId] of Object.entries(categoryMap)) {
//         const res = await fetch(
//             `https://api.keepa.com/category?key=${liveUpdatesKeepaApiKey}&domain=1&category=${categoryId}&parents=0`
//         );
//         const json: { categories: Record<string, { productCount: number }> } = await res.json();

//         const productCount = Object.values(json.categories)[0].productCount;
//         if (productCount) {
//             numProductsInCategoryMap[categoryName] = Object.values(json.categories)[0].productCount;
//         }
//     }

//     console.log(numProductsInCategoryMap)
//     expect(numProductsInCategoryMap).toBeDefined();
// }, 180000);


// it("getDomAutoParse amazonPdpJson", async () => {
//     process.env.LOGGING_ENABLED === "false"
//     const url = "https://www.amazon.com/dp/B09R93MDJX/";

//     const amazonPdpJson = await getDomAutoParse<ScraperApiAmazonPdpJson>({ url })

//     console.log(amazonPdpJson);

//     expect(amazonPdpJson).not.toBeNull();
//     expect(amazonPdpJson).toBeDefined();
// }, 180000);

it("get best variation", async () => {
    const retailerProductName = "Gta 4 PS4";
    const amazonVariationNames = [
        "PlayStation 4",
        "Xbox One"
    ];

    const bestVariation = await getBestVariation(retailerProductName, amazonVariationNames);

    console.log(bestVariation);

    expect(bestVariation).toBe(0);
}, 180000);

// it("quantitySantityCheck", async () => {
//     let quantitiesMatch = quantitySanityCheck(
//         "XyliChew Soft Chewing Gum Spearmint -- 60 Pieces",
//         "XyliChew Soft Chewing Gum Spearmint -- 60 Pieces (Pack of 4)"
//     );

//     console.log(quantitiesMatch);
//     expect(quantitiesMatch).toBe(false);

//     quantitiesMatch = quantitySanityCheck(
//         "XyliChew Soft Chewing Gum Spearmint -- 60 Pieces Case of: 4",
//         "XyliChew Soft Chewing Gum Spearmint -- 60 Pieces (Pack of 4)"
//     );

//     console.log(quantitiesMatch);
//     expect(quantitiesMatch).toBe(true);

//     quantitiesMatch = quantitySanityCheck(
//         "XyliChew Soft Chewing Gum Spearmint -- 60 Pieces 4ct",
//         "XyliChew Soft Chewing Gum Spearmint -- 60 Pieces (Pack of 4)"
//     );

//     console.log(quantitiesMatch);
//     expect(quantitiesMatch).toBe(true);

//     quantitiesMatch = quantitySanityCheck(
//         "Slime Tire Sealant 16 oz",
//         "Slime Value Size 10011 Tubeless Tire Sealant 16 Ounce 2 Pack"
//     );

//     console.log(quantitiesMatch);
//     expect(quantitiesMatch).toBe(false);
// })