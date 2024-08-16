import { Box, Flex, useToast } from "@chakra-ui/react";
import { ProductInterface } from "../../../../../../types/Product";
import Analysis from "./Analysis";
import Header from "./Header";
import Images from "./Images";
import OtherOffers from "./OtherOffers";
import Specs from "./Specs";
import { GeneralSettings } from "../../../../../../types/User";
import { Discount } from "../../../../../../types/Filters";
import KeepaCharts from "./KeepaCharts/KeepaCharts";
import KeepaDetails from "./KeepaDetails";
import { useState } from "react";
import { apiCall } from "../../../../../utils/apiCall";

interface ProductCardProps {
  product: ProductInterface;
  superDeleteEnabled: boolean;
  isSaved: boolean;
  isMetric: boolean;
  generalSettings: GeneralSettings;
  discount: Discount;
}

export default function ProductCard({
  product: incomingProduct,
  superDeleteEnabled,
  isSaved,
  isMetric,
  generalSettings,
  discount,
}: ProductCardProps) {
  const [product, setProduct] = useState(incomingProduct);
  const [keepaDataLoading, setKeepaDataLoading] = useState(false);
  const [productCardVisible, setProductCardVisible] = useState(true);
  const toast = useToast();

  if (!Object.keys(product.amazonInfo.lowestOfferByCondition)[0]) return null;

  async function updateKeepaData() {
    setKeepaDataLoading(true);

    const res = await apiCall<{
      product: ProductInterface;
      status: number;
    }>(`/product/${product.id}/update-keepa-data`, {
      method: "POST",
      isSessionRequest: true,
    });

    setKeepaDataLoading(false);
    if (!res || res.status !== 200) {
      toast({
        title: "Error",
        description: "There was an error updating the Keepa data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const { product: updatedProduct } = res;
    setProduct({ ...updatedProduct });
  }

  return (
    <>
      {productCardVisible ? (
        <Box rounded="md" shadow="xl" bg="white">
          <Header
            product={product}
            superDeleteEnabled={superDeleteEnabled}
            updateKeepaData={updateKeepaData}
            keepaDataLoading={keepaDataLoading}
            setProductCardVisible={setProductCardVisible}
            isSaved={isSaved}
          />
          <Flex p={3} overflowX="scroll" roundedBottom="md">
            <Images
              product={product}
              discount={discount}
              minW="400px"
              maxW="400px"
              pr={5}
              borderRightWidth="1px"
              borderRightColor="gray.300"
            />
            <Analysis
              product={product}
              generalSettings={generalSettings}
              discount={discount}
              minW="390px"
              maxW="390px"
              px={5}
              borderRightWidth="1px"
              borderRightColor="gray.300"
            />
            <KeepaCharts
              product={product}
              keepaDataLoading={keepaDataLoading}
              graphOneHeight={320}
              graphTwoHeight={200}
              minW="910px"
              maxW="1200px"
              px={5}
              borderRightWidth="1px"
              borderRightColor="gray.300"
            />
            <OtherOffers
              product={product}
              minW="380px"
              maxW="380px"
              px={5}
              borderRightWidth="1px"
              borderRightColor="gray.300"
            />
            <KeepaDetails
              product={product}
              keepaDataLoading={keepaDataLoading}
              minW="600px"
              maxW="600px"
              px={5}
              borderRightWidth="1px"
              borderRightColor="gray.300"
            />
            <Specs
              product={product}
              isMetric={isMetric}
              minW="250px"
              maxW="250px"
              px={5}
            />
          </Flex>
        </Box>
      ) : null}
    </>
  );
}
