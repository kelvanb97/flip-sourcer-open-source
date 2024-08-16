import { Box, Flex, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { apiCall } from "../../../../utils/apiCall";
import { ProductInterface } from "../../../../../types/Product";
import ProductCard from "../../../../components/dashboard/features/products/productCard/ProductCard";
import Loader from "../../../../components/shared/Loader";
import { useRouter } from "next/router";
import Alert from "../../../../components/shared/Alert";
import Button from "../../../../components/shared/Button";
import { BsGlobe2 } from "react-icons/bs";
import { UserContext } from "../../../../providers/UserProvider";

export default function Product() {
  const toast = useToast();
  const { user } = useContext(UserContext);
  const [product, setProduct] = useState<ProductInterface | null>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function getProduct() {
    setLoading(true);
    const { id: productId } = router.query;

    const res = await apiCall<{
      product: ProductInterface | null;
      status: number;
    }>(`/product/${productId}`, {
      method: "GET",
      isSessionRequest: true,
    });

    if (!res || res.status !== 200) {
      return toast({
        title: "Error",
        description: "Failed to get products",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    setProduct(res.product);
    setLoading(false);
  }

  useEffect(() => {
    if (router.query.id) getProduct();
  }, [router.query.id]);

  const isMetric = useMemo(
    () => user?.generalSettings.measurementSystem === "metric",
    [user?.generalSettings.measurementSystem]
  );

  return (
    <>
      <Box
        position="sticky"
        top="0"
        left="0"
        zIndex={1}
        w="100%"
        bg="gray.800"
        color="white"
        p={3}
      >
        <Button
          flavor="outline"
          icon={BsGlobe2}
          iconPosition="right"
          onClick={() => router.push("/dashboard/features/products")}
        >
          View all products
        </Button>
      </Box>
      {loading || !user ? (
        <Loader />
      ) : (
        <Flex direction="column" rowGap={3} p={3}>
          {product ? (
            <ProductCard
              product={product}
              superDeleteEnabled={user.superDelete}
              isSaved={false}
              isMetric={isMetric}
              generalSettings={user.generalSettings}
              discount={{
                enabled: false,
                type: "flat",
                flat: 0,
                percent: 0,
              }}
            />
          ) : (
            <Alert type="error" message="Product not found" />
          )}
        </Flex>
      )}
    </>
  );
}
