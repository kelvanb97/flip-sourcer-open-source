import { getDom, getDomAutoParse } from "./scraperApi";

it("getDom", async () => {
    const url = "https://www.amazon.com/Lucky-Womens-Standard-Shell-Stitch/dp/B0B8F4J669";
    const res = await getDom({ url });

    expect(res).not.toBeNull();
}, 180000)

it("getDomAutoParse pdp", async () => {
    const url = "https://www.amazon.com/Lucky-Womens-Standard-Shell-Stitch/dp/B0B8F4J669";
    const res = await getDomAutoParse({ url });

    expect(res).not.toBeNull();
}, 180000)

it("getDomAutoParse catalog", async () => {
    const url = "https://www.amazon.com/s?k=test+search";
    const res = await getDomAutoParse({ url });

    console.log(res);
    expect(res).not.toBeNull();
}, 180000)
