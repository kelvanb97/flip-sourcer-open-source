import {
  Box,
  chakra,
  Flex,
  Spinner,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { BiHide, BiLockOpenAlt, BiShoppingBag } from "react-icons/bi";
import { PiSkull } from "react-icons/pi";
import { FaAmazon } from "react-icons/fa";
import {
  ProductInterface,
  RetailerName,
} from "../../../../../../types/Product";
import { brandDarkBlue } from "../../../../../theme";
import { isProd } from "../../../../../utils/envVars";
import mixpanelAnalytics from "../../../../../utils/analytics/mixpanelAnalytics";
import googleAnalytics from "../../../../../utils/analytics/googleAnalytics";
import { dateToDisplayDate } from "../../../../../utils/shared";
import { apiCall } from "../../../../../utils/apiCall";
import {
  genericToastError,
  ONE_DAY_IN_MS,
  retailerMap,
} from "../../../../../utils/constants";
import Image from "next/image";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShareAlt,
  AiOutlineWarning,
} from "react-icons/ai";
import { useState } from "react";
import facebookAnalytics from "../../../../../utils/analytics/facebookAnalytics";

interface ProductCardHeaderProps {
  product: ProductInterface;
  superDeleteEnabled: boolean;
  updateKeepaData: () => Promise<void>;
  keepaDataLoading: boolean;
  setProductCardVisible: (visible: boolean) => void;
  isSaved: boolean;
}

export default function Header({
  product,
  superDeleteEnabled,
  updateKeepaData,
  keepaDataLoading,
  setProductCardVisible,
  isSaved,
}: ProductCardHeaderProps) {
  const toast = useToast();
  const [saved, setSaved] = useState(isSaved);

  async function handleHideProduct() {
    const res = await apiCall<{ status: number }>(
      `/user/add-to-blacklist/${product.id}`,
      {
        method: "POST",
        isSessionRequest: true,
      }
    );

    if (res && res.status === 200) {
      setProductCardVisible(false);
      toast({
        title: "Product hidden",
        description: "Product hidden from view",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast(genericToastError);
    }
  }

  async function handleSavingProduct() {
    const nextSaveState = !saved;

    setSaved(nextSaveState);

    if (nextSaveState) {
      const res = await apiCall<{ status: number }>(`/user/saved-products`, {
        body: { productInfo: product },
        method: "POST",
        isSessionRequest: true,
      });

      if (!res || res.status !== 200) {
        setSaved(!nextSaveState);
        return toast({
          title: "Error",
          description: "There was an error saving the product.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      toast({
        title: "Product saved",
        description: "Product saved to your saved products",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await handleHideProduct();
    } else {
      const res = await apiCall<{ status: number }>(
        `/user/saved-products/${product.id}`,
        {
          method: "DELETE",
          isSessionRequest: true,
        }
      );

      if (!res || res.status !== 200) {
        setSaved(!nextSaveState);
        return toast({
          title: "Error",
          description: "There was an error unsaving the product.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      toast({
        title: "Product unsaved",
        description: "Product unsaved from your saved products",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setProductCardVisible(false);
    }
  }

  async function handleReportMismatch() {
    const res = await apiCall<{ status: number }>(
      `/product/${product.id}/report-mismatch`,
      {
        method: "POST",
        isSessionRequest: true,
      }
    );

    if (res && res.status === 200) {
      setProductCardVisible(false);
      toast({
        title: "Product mismatch reported",
        description: "Product mismatch reported",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast(genericToastError);
    }
  }

  async function handleSuperDelete() {
    const res = await apiCall<{ status: number }>(
      `/product/${product.id}/super-delete`,
      {
        method: "DELETE",
        isSessionRequest: true,
      }
    );

    if (!res || res.status !== 200) {
      return toast(genericToastError);
    }

    toast({
      title: "Product deleted",
      description: "Product deleted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setProductCardVisible(false);
  }

  function shouldAllowKeepaUpdate() {
    if (isSaved) return false;
    if (!product.amazonInfo.infoFromKeepa.lastKeepaPollTime) return true;
    const lastKeepaPollTime = new Date(
      product.amazonInfo.infoFromKeepa.lastKeepaPollTime
    ).getTime();
    if (lastKeepaPollTime < Date.now() - ONE_DAY_IN_MS) return true;
  }

  return (
    <Flex
      bg="dodgerblue"
      roundedTop="md"
      p={3}
      justifyContent="space-between"
      flexWrap="wrap"
    >
      <Flex columnGap={2} my="auto">
        <Tooltip
          label={`Link to ${
            retailerMap[product.retailerInfo.siteName as RetailerName]
          } product page`}
          hasArrow
          placement="top-start"
        >
          <chakra.span
            maxW="32px"
            maxH="32px"
            cursor="pointer"
            bg="white"
            borderWidth="0px"
            borderColor="white"
            _hover={{ bg: brandDarkBlue, color: "white" }}
            p={1}
            rounded="md"
            shadow={"md"}
            onClick={() => {
              mixpanelAnalytics.trackEvent("Products: View Retailer Page", {
                retailerLink: product.retailerInfo.productLink,
              });
              googleAnalytics.trackEvent(
                "User",
                "Products: View Retailer Page"
              );
              facebookAnalytics.trackEvent("Products: View Retailer Page");
              window.open(product.retailerInfo.productLink, "_blank");
            }}
          >
            <BiShoppingBag size="24px" />
          </chakra.span>
        </Tooltip>
        <Tooltip
          label="Link to Amazon product page"
          hasArrow
          placement="top-start"
        >
          <chakra.span
            maxW="32px"
            maxH="32px"
            cursor="pointer"
            bg="white"
            _hover={{ bg: brandDarkBlue, color: "white" }}
            p={1}
            rounded="md"
            shadow={"md"}
            onClick={() => {
              mixpanelAnalytics.trackEvent("Products: View Amazon Page", {
                amazonLink: product.amazonInfo.productLink,
              });
              googleAnalytics.trackEvent("User", "Products: View Amazon Page");
              facebookAnalytics.trackEvent("Products: View Amazon Page");
              window.open(product.amazonInfo.productLink, "_blank");
            }}
          >
            <FaAmazon size="24px" />
          </chakra.span>
        </Tooltip>
        <Tooltip label="Check gating status" hasArrow placement="top-start">
          <chakra.span
            maxW="32px"
            maxH="32px"
            cursor="pointer"
            bg="white"
            _hover={{ bg: brandDarkBlue, color: "white" }}
            p={1}
            rounded="md"
            shadow={"md"}
            onClick={() => {
              mixpanelAnalytics.trackEvent("Products: View Gating Page", {
                gatingLink: `https://sellercentral.amazon.com/product-search/search?q=${product.amazonInfo.asin}`,
              });
              googleAnalytics.trackEvent("User", "Products: View Gating Page");
              facebookAnalytics.trackEvent("Products: View Gating Page");
              window.open(
                `https://sellercentral.amazon.com/product-search/search?q=${product.amazonInfo.asin}`,
                "_blank"
              );
            }}
          >
            <BiLockOpenAlt size="24px" />
          </chakra.span>
        </Tooltip>
        <Tooltip label="Share product" hasArrow placement="top-start">
          <chakra.span
            maxW="32px"
            maxH="32px"
            cursor="pointer"
            bg="white"
            _hover={{ bg: brandDarkBlue, color: "white" }}
            p={1}
            rounded="md"
            shadow={"md"}
            onClick={() => {
              const flipsourcerProductLink = isProd
                ? `https://www.flipsourcer.com/dashboard/features/products/${product.id}`
                : `localhost:4000/dashboard/features/products/${product.id}`;
              navigator.clipboard.writeText(flipsourcerProductLink);
              mixpanelAnalytics.trackEvent("Products: Copy Share Link", {
                flipsourcerProductLink,
              });
              googleAnalytics.trackEvent("User", "Products: Copy Share Link");
              facebookAnalytics.trackEvent("Products: Copy Share Link");
              toast({
                title: "Copied to clipboard",
                description: "Product link copied to clipboard",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            <AiOutlineShareAlt size="24px" />
          </chakra.span>
        </Tooltip>
        <Tooltip
          label={
            saved ? (
              <Box>
                <Box>Hide product</Box>
                <Box mt={1} borderTop="1px solid">
                  You may not hide products that you have saved
                </Box>
              </Box>
            ) : (
              "Hide product"
            )
          }
          hasArrow
          placement="top-start"
        >
          <chakra.span
            maxW="32px"
            maxH="32px"
            cursor={saved ? "not-allowed" : "pointer"}
            bg={saved ? "gray.300" : "white"}
            color={saved ? "gray.500" : "black"}
            _hover={saved ? {} : { bg: brandDarkBlue, color: "white" }}
            p={1}
            rounded="md"
            shadow={"md"}
            onClick={async () => {
              if (saved) return;
              await handleHideProduct();
            }}
          >
            <BiHide size="24px" />
          </chakra.span>
        </Tooltip>
        {shouldAllowKeepaUpdate() && (
          <Tooltip label="Update Keepa Data" hasArrow placement="top-start">
            <chakra.span
              maxW="32px"
              maxH="32px"
              cursor="pointer"
              bg="white"
              _hover={{ bg: brandDarkBlue, color: "white" }}
              p={1}
              rounded="md"
              shadow={"md"}
              onClick={async () => await updateKeepaData()}
            >
              {keepaDataLoading ? (
                <Spinner
                  color="dodgerblue"
                  height="24px"
                  width="24px"
                  textAlign={"center"}
                />
              ) : (
                <Image
                  src={"/images/logos/keepa.png"}
                  alt="keepa logo"
                  width="24px"
                  height="24px"
                  style={{ margin: "auto" }}
                />
              )}
            </chakra.span>
          </Tooltip>
        )}
        <Tooltip
          label={
            <Box>
              <Box>Report product mismatch</Box>
              <Box mt={1} borderTop="1px solid">
                We do our best to match products, but sometimes we get it wrong.
                Reporting a product mismatch helps us improve our matching
                algorithm.
              </Box>
              <Box mt={1} fontWeight="bold" borderTop="1px solid">
                Reporting a mismatch will hide the product from view.
              </Box>
            </Box>
          }
          hasArrow
          placement="top-start"
        >
          <chakra.span
            maxW="32px"
            maxH="32px"
            cursor={saved ? "not-allowed" : "pointer"}
            bg={saved ? "gray.300" : "white"}
            color={saved ? "gray.500" : "red.600"}
            _hover={saved ? {} : { bg: "red.200" }}
            p={1}
            rounded="md"
            shadow={"md"}
            onClick={async () => {
              if (saved) return;
              await handleReportMismatch();
            }}
          >
            <AiOutlineWarning
              size="24px"
              color={saved ? "gray.500" : "red.600"}
            />
          </chakra.span>
        </Tooltip>
        {superDeleteEnabled && (
          <Tooltip
            label={
              <Box>
                <Box>Permanently delete product</Box>
                <Box mt={1} fontWeight="bold" borderTop="1px solid">
                  We can see all products removed, any abuse of this feature
                  will result in account termination.
                </Box>
              </Box>
            }
            hasArrow
            placement="top-start"
          >
            <chakra.span
              maxW="32px"
              maxH="32px"
              cursor="pointer"
              bg="white"
              color="red.600"
              _hover={{ bg: "red.200" }}
              p={1}
              rounded="md"
              shadow={"md"}
              onClick={async () => {
                await handleSuperDelete();
              }}
            >
              <PiSkull size="24px" color="red.600" />
            </chakra.span>
          </Tooltip>
        )}
      </Flex>
      <Flex columnGap={5}>
        <Tooltip
          label={
            product.matchScoreBreakdown.textSimilarityScore &&
            product.matchScoreBreakdown.imageSimilarityScore ? (
              <Box>
                <Box>
                  {`t: ${product.matchScoreBreakdown.textSimilarityScore.toFixed(
                    2
                  )}, ${product.gptTitleMatchScore}`}
                </Box>
                <Box>
                  {"i: " +
                    product.matchScoreBreakdown.imageSimilarityScore.toFixed(2)}
                </Box>
              </Box>
            ) : null
          }
          hasArrow
          placement="top-start"
        >
          <Box
            textAlign={"center"}
            fontSize={"lg"}
            color="white"
            my="auto"
            cursor="default"
          >
            <Box>{product.matchScore === 100 ? 99 : product.matchScore}%</Box>
            <Box mt={-1} fontSize={"xs"} textAlign="right">
              {product.matchType !== "upc" ? "non-upc" : "upc"} match
            </Box>
          </Box>
        </Tooltip>
        <Box fontSize={"lg"} color="white" my="auto">
          <Box>{dateToDisplayDate(product.updatedAt, true)}</Box>
          <Box mt={-1} fontSize={"xs"} textAlign="right">
            last updated
          </Box>
        </Box>
        <Box
          fontSize={"lg"}
          color="white"
          my="auto"
          maxH="max-content"
          _hover={{ color: brandDarkBlue }}
        >
          {saved ? (
            <AiFillHeart
              size="32px"
              cursor="pointer"
              onClick={async () => await handleSavingProduct()}
            />
          ) : (
            <AiOutlineHeart
              size="32px"
              cursor="pointer"
              onClick={async () => await handleSavingProduct()}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
