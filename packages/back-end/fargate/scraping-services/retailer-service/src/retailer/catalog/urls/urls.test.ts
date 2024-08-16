import { sixpm } from "./6pm";
import { acehardware } from "./acehardware";
import { barnesandnoble } from "./barnesandnoble";
import { bestbuy } from "./bestbuy";
import { bloomingkoco } from "./bloomingkoco";
import { boscovs } from "./boscovs";
import { boxlunch } from "./boxlunch";
import { gamestop } from "./gamestop";
import { hottopic } from "./hottopic";
import { kohls } from "./kohls";
import { macys } from "./macys";
import { marshalls } from "./marshalls";
import { scheels } from "./scheels";
import { tjmaxx } from "./tjmaxx";
import { vitacost } from "./vitacost";
import { walgreens } from "./walgreens";

it("urls length test", () => {
    const testUrls = [
        ...sixpm,
        ...acehardware,
        ...barnesandnoble,
        ...bestbuy,
        ...bloomingkoco,
        ...boscovs,
        ...boxlunch,
        ...gamestop,
        ...hottopic,
        ...kohls,
        ...macys,
        ...marshalls,
        ...scheels,
        ...tjmaxx,
        ...vitacost,
        ...walgreens,
    ];

    console.log(testUrls.length);

    expect(testUrls.length).toBeGreaterThan(16);
})