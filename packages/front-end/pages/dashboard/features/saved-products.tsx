import { Box, Flex, Heading, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { DarkModeContext } from "../../../providers/DarkModeProvider";
import { ProductInterface } from "../../../../types/Product";
import Loader from "../../../components/shared/Loader";
import ProductCard from "../../../components/dashboard/features/products/productCard/ProductCard";
import { apiCall } from "../../../utils/apiCall";
import Pagination, {
  getDefaultPageSize,
} from "../../../components/shared/Pagination";
import { UserContext } from "../../../providers/UserProvider";

export default function SavedProducts() {
  const toast = useToast();
  const { darkModeColor } = useContext(DarkModeContext);
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(getDefaultPageSize());
  const [numResults, setNumResults] = useState(0);
  const [products, setProducts] = useState<ProductInterface[]>([]);

  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  async function getSavedProducts() {
    setLoading(true);

    const res = await apiCall<{
      products: ProductInterface[];
      hasNextPage: boolean;
      numResults: number;
      status: number;
    }>("/user/list-saved-products", {
      method: "POST",
      isSessionRequest: true,
      body: {
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
    getSavedProducts();
  }, [page]);

  const isMetric = useMemo(
    () => user?.generalSettings?.measurementSystem === "metric",
    [user?.generalSettings?.measurementSystem]
  );

  return (
    <Box>
      <Heading p={3} as="h3" size="lg" color={darkModeColor}>
        Saved Products
      </Heading>
      {loading || !user ? (
        <Loader />
      ) : (
        <Flex direction="column" rowGap={3} p={3}>
          {products.map((product, index) => (
            <ProductCard
              key={`productCard${index}`}
              product={product}
              superDeleteEnabled={user.superDelete}
              isSaved={true}
              discount={{
                enabled: false,
                type: "flat",
                flat: 0,
                percent: 0,
              }}
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
    </Box>
  );
}
