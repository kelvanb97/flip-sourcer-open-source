import { AuthRequest, Response } from "../../types/AuthRequest";
import { FiltersSortersDiscountsInterface } from "../../../../../types/Filters";
import { Fee, ProductInterface } from "../../../../../types/Product";
import { readProduct, transformDbProduct } from "../services/product";
import { Prisma, PrismaClient } from "../../../../prisma/generated/client";
import { getMyFeesEstimateForASIN } from "../services/spAPI";
import { getKeepaData } from "../../../../shared/keepa";
import { liveUpdatesKeepaApiKey } from "../../../../shared/envVars";
import {
  GPT_TITLE_MATCH_DESIRED_SCORE,
  MATCH_FILTERS_MAP,
  MIN_LEADING_ROI,
} from "../../../../shared/constants";
import { deleteProduct } from "../../../../shared/general";
import { sesSendEmail } from "../../../../shared/aws/ses";

const prisma = new PrismaClient();

export async function getProductFeesSpecificToUser(
  req: AuthRequest<{
    purchasePrice: number;
    salePrice: number;
    asin: string;
    weightInPounds: number;
  }>,
  res: Response<{ fees: Array<Fee> | null }>
) {
  try {
    const user = req.user;
    const { refreshToken } = req.user.amazonSpApi;
    const { salePrice, asin, weightInPounds } = req.body;

    const feesRes = await getMyFeesEstimateForASIN({
      refreshToken,
      asin: asin,
      price: salePrice,
    });

    const amazonfees = feesRes.FeesEstimateResult.FeesEstimate.FeeDetailList;

    // convert amazon fees into our fee format
    const fees: Array<Fee> = amazonfees.map((fee) => ({
      from: "amazon",
      name: fee.FeeType,
      value: fee.FeeAmount.Amount,
    }));

    // use the default FBA fee in the user's settings if it's not in the response
    if (!fees.find((fee) => fee.name === "FBAFees")) {
      fees.push({
        from: "amazon",
        name: "FBAFees",
        value: user.generalSettings.defaultFbaFee,
      });
    }

    //In house fees
    fees.push({
      from: "flipsourcer",
      name: "Per unit $",
      value: user.generalSettings.perUnitCosts.flat,
    });

    fees.push({
      from: "flipsourcer",
      name: "Per unit %",
      value: (user.generalSettings.perUnitCosts.percent / 100) * salePrice,
    });

    fees.push({
      from: "flipsourcer",
      name: "Shipping weight",
      value: user.generalSettings.shippingCosts.perPound * weightInPounds,
    });

    fees.push({
      from: "flipsourcer",
      name: "Shipping per unit",
      value: user.generalSettings.shippingCosts.perUnit,
    });

    res.json({
      fees,
      status: 200,
    });
  } catch (e) {
    res.json({
      status: 500,
      message: "Error getting fees",
    });
  }
}

export async function getProduct(
  req: AuthRequest<null, { id: string }>,
  res: Response<{ product: ProductInterface | null }>
) {
  const { id } = req.params;
  const productId = parseInt(id);

  const rawProduct = await readProduct(productId);

  if (!rawProduct) {
    res.json({ product: null, status: 200 });
    return;
  }

  const product = await transformDbProduct(rawProduct);
  res.json({ product, status: 200 });
}

export async function getProducts(
  req: AuthRequest<{
    filtersSortersDiscounts: FiltersSortersDiscountsInterface;
    page: number;
    pageSize: number;
  }>,
  res: Response<{
    products: ProductInterface[];
    hasNextPage: boolean;
    numResults: number;
  }>
) {
  const { productBlackList } = req.user;
  const { filtersSortersDiscounts, page, pageSize } = req.body;
  const { filters, sorters } = filtersSortersDiscounts;
  const { enabledMap: filtersEnabledMap } = filters;

  //Product ID Blacklist
  const productIdBlackListFilter: Prisma.ProductWhereInput = {
    id: {
      notIn: productBlackList.map(Number),
    },
  };

  // Blockers
  const lowestOfferByConditionExistsFilter = {
    valueByCondition: {
      some: {
        type: "lowest-offer-by-condition",
      },
    },
  };

  //Should match the keepa-poller, because if we go too far back there is no Keepa data
  const roiConstraint = {
    valueByCondition: {
      some: {
        type: "roi-by-condition",
        value: { gt: MIN_LEADING_ROI },
      },
    },
  };

  const gptTitleMatchScore = {
    gptTitleMatchScore: {
      gte: GPT_TITLE_MATCH_DESIRED_SCORE,
    },
  };

  const prismaBlockers: Array<Prisma.ProductWhereInput> = [
    lowestOfferByConditionExistsFilter,
    roiConstraint,
    gptTitleMatchScore,
  ];

  //Filters
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prismaFilters: Array<Prisma.ProductWhereInput> = [];
  if (filters) {
    const profitFilter = filtersEnabledMap.profit
      ? {
          valueByCondition: {
            some: {
              type: "profit-by-condition",
              value: { gt: filters.profit },
              condition:
                filters.condition === "all" ? undefined : filters.condition,
            },
          },
        }
      : {};

    const roiFilter = filtersEnabledMap.roi
      ? {
          valueByCondition: {
            some: {
              type: "roi-by-condition",
              value: { gt: filters.roi },
              condition: filters.condition === "all" ? {} : filters.condition,
            },
          },
        }
      : {};

    const categoryFilter =
      filters.category === "All" || !filtersEnabledMap.category
        ? {}
        : {
            amazonInfo: {
              category: {
                contains: filters.category.toString(),
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          };

    const conditionFilter =
      filters.condition === "all" || !filtersEnabledMap.condition
        ? {}
        : {
            valueByCondition: {
              some: {
                condition: filters.condition,
              },
            },
          };

    const salesRankFilter = filtersEnabledMap.salesRank
      ? filters.salesRank.type === "flat"
        ? {
            amazonInfo: {
              salesRankFlat: {
                lt: filters.salesRank.flat,
              },
            },
          }
        : {
            amazonInfo: {
              salesRankPercent: {
                lt: filters.salesRank.percent,
              },
            },
          }
      : {};

    const amazonOnListingFilter = filtersEnabledMap.amazonOnListing
      ? {
          amazonInfo: {
            amazonOnListing: filters.amazonOnListing,
          },
        }
      : {};

    const hasBuyBoxFilter = filtersEnabledMap.hasBuyBox
      ? {
          amazonInfo: {
            hasBuyBox: filters.hasBuyBox,
          },
        }
      : {};

    const numSellersFbaFilter = filtersEnabledMap.numSellersFba
      ? {
          amazonInfo: {
            countOfRetrievedLiveOffersFba: {
              lt: filters.numSellersFba,
            },
          },
        }
      : {};

    const numSellersFbmFilter = filtersEnabledMap.numSellersFbm
      ? {
          amazonInfo: {
            countOfRetrievedLiveOffersFbm: {
              lt: filters.numSellersFbm,
            },
          },
        }
      : {};

    const includedKeywordsFilter = filtersEnabledMap.keywords
      ? {
          OR: [
            ...filters.keywords.map((includedKeyword) => ({
              retailerInfo: {
                productName: {
                  contains: includedKeyword,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            })),
            ...filters.keywords.map((includedKeyword) => ({
              amazonInfo: {
                productName: {
                  contains: includedKeyword,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            })),
          ],
        }
      : {};

    const excludedKeyWordsFilter = filtersEnabledMap.excludedKeywords
      ? {
          NOT: {
            OR: [
              ...filters.excludedKeywords.map((excludedKeyword) => ({
                retailerInfo: {
                  productName: {
                    contains: excludedKeyword,
                    mode: "insensitive" as Prisma.QueryMode,
                  },
                },
              })),
              ...filters.excludedKeywords.map((excludedKeyword) => ({
                amazonInfo: {
                  productName: {
                    contains: excludedKeyword,
                    mode: "insensitive" as Prisma.QueryMode,
                  },
                },
              })),
            ],
          },
        }
      : {};

    const retailerFilter = filtersEnabledMap.retailerList
      ? {
          retailerInfo: {
            siteName: {
              in: filters.retailerList,
            },
          },
        }
      : {};

    const matchFilter = filtersEnabledMap.match
      ? filters.match.type === "all"
        ? {
            matchScore: {
              gte: MATCH_FILTERS_MAP[filters.match.confidence].matchScore,
            },
            gptTitleMatchScore: {
              gte: MATCH_FILTERS_MAP[filters.match.confidence]
                .gptTitleMatchScore,
            },
          }
        : {
            matchType: "upc",
          }
      : {};

    prismaFilters = [
      profitFilter,
      roiFilter,
      categoryFilter,
      conditionFilter,
      salesRankFilter,
      amazonOnListingFilter,
      hasBuyBoxFilter,
      numSellersFbaFilter,
      numSellersFbmFilter,
      includedKeywordsFilter,
      excludedKeyWordsFilter,
      retailerFilter,
      matchFilter,
    ];
  }

  // Sort
  let prismaSortClause: Prisma.ProductOrderByWithRelationInput = {};
  if (sorters) {
    if (sorters.sorter === "profit") {
      prismaSortClause = {
        highestProfitByCondition:
          sorters.sortType === "lowToHigh" ? "asc" : "desc",
      };
    } else if (sorters.sorter === "roi") {
      prismaSortClause = {
        highestRoiByCondition:
          sorters.sortType === "lowToHigh" ? "asc" : "desc",
      };
    } else if (sorters.sorter === "salesRank") {
      prismaSortClause = {
        amazonInfo: {
          salesRankFlat: sorters.sortType === "lowToHigh" ? "asc" : "desc",
        },
      };
    } else if (sorters.sorter === "lastUpdated") {
      prismaSortClause = {
        updatedAt: sorters.sortType === "lowToHigh" ? "asc" : "desc",
      };
    }
  }

  const rawProducts = await prisma.product.findMany({
    take: pageSize + 1,
    skip: pageSize * page,
    where: {
      AND: [productIdBlackListFilter, ...prismaBlockers, ...prismaFilters],
    },
    include: {
      amazonInfo: true,
      valueByCondition: true,
      retailerInfo: {
        include: {
          retailerHistoricalData: true,
        },
      },
    },
    orderBy: prismaSortClause,
  });

  const numResults = await prisma.product.count({
    where: {
      AND: [productIdBlackListFilter, ...prismaBlockers, ...prismaFilters],
    },
  });

  const hasNextPage = rawProducts.length > pageSize;

  const productPromises = rawProducts
    .slice(0, pageSize)
    .map(async (rawProduct) => {
      const product = await transformDbProduct(rawProduct);
      return product;
    });

  const products = await Promise.all(productPromises);

  res.json({
    products,
    hasNextPage,
    numResults,
    status: 200,
  });
}

export async function updateKeepaData(
  req: AuthRequest<null, { id: string }>,
  res: Response<{ product: ProductInterface | null }>
) {
  const { id } = req.params;
  const productId = parseInt(id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      amazonInfo: true,
      valueByCondition: true,
      retailerInfo: {
        include: {
          retailerHistoricalData: true,
        },
      },
    },
  });

  if (!product) {
    res.json({
      status: 404,
      message: "Product not found",
    });
    return;
  }

  const { keepaDataPayload } = await getKeepaData(
    liveUpdatesKeepaApiKey,
    product.amazonInfo.asin,
    product.retailerInfoId,
    prisma
  );

  if (!keepaDataPayload) {
    res.json({
      status: 404,
      message: "Keepa data not found",
    });
    return;
  }

  await prisma.amazonInfo.update({
    where: {
      id: product.amazonInfo.id,
    },
    data: keepaDataPayload,
  });

  const dbProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      amazonInfo: true,
      valueByCondition: true,
      retailerInfo: {
        include: {
          retailerHistoricalData: true,
        },
      },
    },
  });

  if (!dbProduct) {
    res.json({
      status: 404,
      message: "Product not found",
    });
    return;
  }

  const transformedProduct = await transformDbProduct(dbProduct);

  res.json({
    product: transformedProduct,
    status: 200,
  });
}

export async function reportMismatch(
  req: AuthRequest<null, { id: string }>,
  res: Response
) {
  const { id } = req.params;

  sesSendEmail({
    subject: "Product Mismatch",
    body: `Reported product mismatch by: ${req.user.email} 
    https://www.flipsourcer.com/dashboard/features/products/${id}`,
  });

  res.json({ status: 200 });
}

export async function superDeleteProduct(
  req: AuthRequest<null, { id: string }>,
  res: Response
) {
  const { id } = req.params;
  const { email, superDelete } = req.user;

  if (!superDelete) {
    res.json({ status: 403, message: "User does not have super delete" });
    return;
  }

  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      amazonInfo: true,
      retailerInfo: true,
    },
  });

  if (!product) {
    res.json({ status: 404, message: "Product not found" });
    return;
  }

  await deleteProduct({
    productId: product.id,
    retailerInfoId: product.retailerInfoId,
    prisma,
  });

  sesSendEmail({
    subject: "Product Super Delete",
    body: `${email} super deleted product
    Retailer: ${product.retailerInfo.productLink}
    Amazon: ${product.amazonInfo.productLink}`,
  });

  res.json({ status: 200 });
}
