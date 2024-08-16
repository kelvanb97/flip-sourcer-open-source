import { Box, Flex, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { apiCall } from "../../../../utils/apiCall";
import { ProductInterface } from "../../../../../types/Product";
import ProductCard from "../../../../components/dashboard/features/products/productCard/ProductCard";
import Loader from "../../../../components/shared/Loader";
import FiltersHeader, {
  getDefaultDiscounts,
  getDefaultFilters,
  getDefaultSorters,
} from "../../../../components/dashboard/features/products/filtersHeader/FiltersHeader";
import { setLocalStorageVar } from "../../../../utils/localstorage";
import { FiltersSortersDiscountsInterface } from "../../../../../types/Filters";
import Pagination, {
  getDefaultPageSize,
} from "../../../../components/shared/Pagination";
import { UserContext } from "../../../../providers/UserProvider";
import Alert from "../../../../components/shared/Alert";

export default function Products() {
  const toast = useToast();
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(getDefaultPageSize());
  const [numResults, setNumResults] = useState(0);
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [filtersSortersDiscounts, setFiltersSortersDiscounts] =
    useState<FiltersSortersDiscountsInterface>({
      filters: getDefaultFilters(),
      sorters: getDefaultSorters(),
      discounts: getDefaultDiscounts(),
    });

  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  function handleSetFiltersSortersDiscounts(
    newFiltersSortersDiscounts: FiltersSortersDiscountsInterface
  ) {
    setLocalStorageVar(
      "filters",
      JSON.stringify(newFiltersSortersDiscounts.filters)
    );
    setLocalStorageVar(
      "sorters",
      JSON.stringify(newFiltersSortersDiscounts.sorters)
    );
    setLocalStorageVar(
      "discounts",
      JSON.stringify(newFiltersSortersDiscounts.discounts)
    );
    setFiltersSortersDiscounts(newFiltersSortersDiscounts);
    setPage(0);
  }

  async function getProducts() {
    setLoading(true);

    const res = await apiCall<{
      products: ProductInterface[];
      hasNextPage: boolean;
      numResults: number;
      status: number;
    }>("/product", {
      method: "POST",
      isSessionRequest: true,
      body: {
        filtersSortersDiscounts,
        page,
        pageSize,
      },
    });

    if (!res || res.status !== 200) {
      setLoading(false);
      return toast({
        title: "Error",
        description: "Failed to get products",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    setHasNextPage(res.hasNextPage);
    setNumResults(res.numResults);
    setProducts(res.products);
    setLoading(false);
  }

  useEffect(() => {
    getProducts();
  }, [page, filtersSortersDiscounts]);

  const isMetric = useMemo(
    () => user?.generalSettings?.measurementSystem === "metric",
    [user?.generalSettings?.measurementSystem]
  );

  return (
    <>
      <FiltersHeader
        filtersSortersDiscounts={filtersSortersDiscounts}
        handleSetFiltersSortersDiscounts={handleSetFiltersSortersDiscounts}
      />
      {loading || !user ? (
        <Loader />
      ) : (
        <Flex direction="column" rowGap={3} p={3}>
          <Flex>
            {numResults <= 0 && (
              <Box>
                <Alert
                  type="error"
                  message="Check to make sure your filters are not too restrictive!"
                />
              </Box>
            )}
          </Flex>
          {products.map((product, index) => (
            <ProductCard
              key={`productCard${index}`}
              product={product}
              superDeleteEnabled={user.superDelete}
              isSaved={false}
              discount={filtersSortersDiscounts.discounts}
              isMetric={isMetric}
              generalSettings={user.generalSettings}
            />
          ))}
        </Flex>
      )}
      <Pagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        page={page}
        setPage={setPage}
        hasNextPage={hasNextPage}
        numResults={numResults}
      />
    </>
  );
}
