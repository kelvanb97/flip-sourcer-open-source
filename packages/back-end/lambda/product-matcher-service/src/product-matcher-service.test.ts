import { getProductMatchScore } from "../../../fargate/scraping-services/amazon-service/src/utils";
import { calculateSimilarityScore } from "./calculateSimilarityScore";

it("calculateSimilarityScore", async () => {
    const res = await calculateSimilarityScore({
        retailer: {
            productName: 'Bluebird Grain Farms Organic Whole Grain Emmer Farro -- 16 oz',
            imageUrl: 'https://www.vitacost.com/Images/Products/150/Bluebird-Grain-Farms/Bluebird-Grain-Farms-Organic-Whole-Grain-Emmer-Farro-891343002369.jpg'
        },
        amazon: {
            productName: 'Certified Organic Heirloom Wheat Whole Grain Emmer Farro Washington Pack of 2 454 g 16 oz each',
            imageUrl: 'https://m.media-amazon.com/images/I/912jQJfDWWL.jpg'
        }
    })

    console.log(res);
    expect(res).toBeDefined();
    expect(res?.score).toBeGreaterThan(0);
}, 180000);

beforeEach(() => {
    jest.resetModules();
});

it("integration: dev-product-matcher-service", async () => {
    jest.doMock("../../../shared/envVars", () => ({
        stage: "dev",
    }));

    const { stage } = require("../../../shared/envVars");

    expect(stage).toBe("dev");

    const res = await getProductMatchScore({
        retailer: {
            productName: "Call of Duty: Modern Warfare II - PlayStation 5",
            imageUrl: "https://media.gamestop.com/i/gamestop/11206901-11206901?$pdp$$&fmt=webp",
        },
        amazon: {
            productName: "Call of Duty: Modern Warfare II - PlayStation 5",
            imageUrl: "https://m.media-amazon.com/images/I/912YUVcMLjL._SX425_.jpg",
        },
    });
    console.log(res);
    expect(res).toBeDefined();
    expect(res?.score).toBeGreaterThan(0);
}, 180000);

it("integration: prod-product-matcher-service", async () => {
    jest.doMock("../../../shared/envVars", () => ({
        stage: "prod",
    }));

    const { stage } = require("../../../shared/envVars");

    expect(stage).toBe("prod");

    const res = await getProductMatchScore({
        retailer: {
            productName: "Call of Duty: Modern Warfare II - PlayStation 5",
            imageUrl: "https://media.gamestop.com/i/gamestop/11206901-11206901?$pdp$$&fmt=webp",
        },
        amazon: {
            productName: "Call of Duty: Modern Warfare II - PlayStation 5",
            imageUrl: "https://m.media-amazon.com/images/I/912YUVcMLjL._SX425_.jpg",
        },
    });
    console.log(res);
    expect(res).toBeDefined();
    expect(res?.score).toBeGreaterThan(0);
}, 180000)
