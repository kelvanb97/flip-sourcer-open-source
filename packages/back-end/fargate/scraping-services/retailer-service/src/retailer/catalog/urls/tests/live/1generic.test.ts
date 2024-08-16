import { getDom } from "../../../../../../../shared/scraperApi";

it("1 generic test", async () => {
    const catalogUrl = "https://www.newegg.com/p/N82E16823201124?Item=N82E16823201124"

    await getDom({ url: catalogUrl });
}, 180000);
