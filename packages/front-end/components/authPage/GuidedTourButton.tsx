import Joyride, { STATUS, Step } from "react-joyride";
import { NextRouter } from "next/router";
import Button from "../shared/Button";
import { RiGuideLine } from "react-icons/ri";
import { useMemo } from "react";
import { useState } from "react";
import { Box, Flex, Tooltip, chakra, useToast } from "@chakra-ui/react";

function getTourDirection(type: string, action: string) {
  if (type === "step:after" && action === "next") {
    return "forward";
  } else if (type === "step:after" && action === "prev") {
    return "back";
  } else {
    return undefined;
  }
}

//All these function definitions is verbose but far more readable than a dynamic solution
function setFilterByRetailerToDisabled() {
  const retailersFilterSwitch = document.querySelector(
    "#retailerFilterSwitch"
  )?.parentElement;
  if (
    retailersFilterSwitch &&
    retailersFilterSwitch.getAttribute("data-checked") !== null
  )
    (retailersFilterSwitch as HTMLElement).click();
}

function closeFiltersSection() {
  const filtersButton = document.querySelector("#filtersButton");
  const filtersDiv = document.querySelector("#filtersDiv");
  if (filtersDiv && filtersButton) (filtersButton as HTMLElement).click();
}

function retailerModalCheck6pm() {
  const checkBox6pm = document.querySelector("#retailer-modal-6pm-checkbox");
  if (checkBox6pm) (checkBox6pm as HTMLElement).click();
}

function saveAndCloseRetailerModal() {
  const retailerModalSaveButton = document.querySelector(
    "#retailer-modal-save"
  );
  if (retailerModalSaveButton) (retailerModalSaveButton as HTMLElement).click();
}

function clearRetailerModal() {
  const retailerModalClearButton = document.querySelector(
    "#retailer-modal-clear"
  );
  if (retailerModalClearButton)
    (retailerModalClearButton as HTMLElement).click();
}

function clickFiltersButton() {
  const filtersButton = document.querySelector("#filtersButton");
  if (filtersButton) (filtersButton as HTMLElement).click();
}

function clickRetailerFilterSwitch() {
  const retailersFilterSwitch = document.querySelector(
    "#retailerFilterSwitch"
  )?.parentElement;
  if (retailersFilterSwitch) (retailersFilterSwitch as HTMLElement).click();
}

function openRetailersModal() {
  const editEnabledRetailersButton = document.querySelector(
    "#editEnabledRetailersButton"
  );
  if (editEnabledRetailersButton)
    (editEnabledRetailersButton as HTMLElement).click();
}

function clickSortByButton() {
  const sortByButton = document.querySelector("#sortByButton");
  if (sortByButton) (sortByButton as HTMLElement).click();
}

function clickSortBySalesRank() {
  const sortBySalesRank = document.querySelector("#sort-by-sales-rank");
  if (sortBySalesRank) (sortBySalesRank as HTMLElement).click();
}

function clickOrderByLowToHigh() {
  const sortBySalesRank = document.querySelector("#order-by-low-to-high");
  if (sortBySalesRank) (sortBySalesRank as HTMLElement).click();
}

function clickDiscountsButton() {
  const discountsButton = document.querySelector("#discountsButton");
  if (discountsButton) (discountsButton as HTMLElement).click();
}

function enableDiscountsSwitch() {
  const enableDiscountsSwitch = document.querySelector(
    "#discounts-enabled-switch"
  )?.parentElement;
  if (!enableDiscountsSwitch?.hasAttribute("data-checked"))
    (enableDiscountsSwitch as HTMLElement).click();
}

function disableDiscountsSwitch() {
  const enableDiscountsSwitch = document.querySelector(
    "#discounts-enabled-switch"
  )?.parentElement;
  if (enableDiscountsSwitch?.hasAttribute("data-checked"))
    (enableDiscountsSwitch as HTMLElement).click();
}

function clickBuy1Get1FreeRadio() {
  const buy1Get1FreeRadio = document.querySelector(
    "#discounts-buy-1-get-1-free-radio"
  );
  if (buy1Get1FreeRadio) (buy1Get1FreeRadio as HTMLElement).click();
}

function clickApplyButton() {
  const applyButton = document.querySelector("#applyFiltersButton");
  if (applyButton) (applyButton as HTMLElement).click();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface GuidedTourButtonProps {
  sidebarOpen: boolean;
  router: NextRouter;
}

export default function GuidedTourButton({
  sidebarOpen,
  router,
}: GuidedTourButtonProps) {
  const toast = useToast();
  const [stepIndex, setStepIndex] = useState(0);
  const [tourRunning, setTourRunning] = useState(false);

  const showButton = useMemo(
    () => router.pathname === "/dashboard/features/products",
    [router.pathname]
  );

  const steps: Step[] = useMemo(() => {
    if (router.pathname === "/dashboard/features/products") {
      const steps: Step[] = [
        {
          //step 1
          target: "body",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box>
                The purpose of the Products page is to help you find profitable
                products!
              </Box>
              <Box fontWeight="bold">Let{`'`}s get started!</Box>
            </Flex>
          ),
          placement: "center",
        },
        {
          //step 2
          target: "body",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box>
                There are 4 key features you are going to want to understand to
                find the most profit.
              </Box>
              <Box>We will go through each one in detail.</Box>
            </Flex>
          ),
          placement: "center",
        },
        {
          //step 3
          target: "#filtersButton",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box fontWeight="bold">1. Filtering</Box>
              <Box>
                Filters are used to narrow down the products you want to see.
                You can filter by category, price, sales rank, and more!
              </Box>
              <Box>Let{`'`}s now cover usage and some important filters!</Box>
            </Flex>
          ),
        },
        {
          //step 4
          target: "#retailerFilterSwitchContainer",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box>
                To enable or ignore a filter, simply click on the switch next to
                the filter.
              </Box>
              <Box>Let{`'`}s enable the Retailers filter.</Box>
            </Flex>
          ),
        },
        {
          //step 5
          target: "#editEnabledRetailersButtonText",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box>
                Now that we have enabled the Retailers filter, we can select
                which retailers we want to see products from.
              </Box>
              <Box>
                We will click {`"`}edit enabled retailers{`"`}
              </Box>
            </Flex>
          ),
        },
        {
          //step 6
          target: "#chakra-modal--body-retailerModal",
          content: (
            <Flex direction="column" rowGap={3}>
              From here, we can select which retailers we want to see.
            </Flex>
          ),
        },
        {
          //step 7
          target: "#retailer-modal-6pm-grid-item",
          content: (
            <Flex direction="column" rowGap={3}>
              We will select {`"`}6pm{`"`} for this example.
            </Flex>
          ),
        },
        {
          //step 8
          target: "#retailer-modal-save",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box>
                After clicking on the {`"`}6pm{`"`} checkbox, we will click{" "}
                {`"`}Save{`"`}.
              </Box>
              <Box>
                When we apply these settings, we will only see products from
                {`"`}6pm{`"`}.
              </Box>
            </Flex>
          ),
        },
        {
          //step 9
          target: "body",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box fontWeight="bold">1. Filtering Recap</Box>
              <Box>
                We opened the filters settings, enabled the Retailers filter,
                customized our enabled retailers to be set to {`"`}6pm{`"`}, and
                we saved those settings.
              </Box>
            </Flex>
          ),
          placement: "center",
        },
        {
          //step 10
          target: "#sortByButton",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box fontWeight="bold">{`2. Sort By (Sorting)`}</Box>
              <Box>
                Sorting is used to determine how the products are ordered. You
                can sort by profit, ROI, sales rank, and more!
              </Box>
              <Box>Let{`'`}s now cover Sorting!</Box>
            </Flex>
          ),
        },
        {
          //step 11
          target: "#sort-by-sales-rank-container",
          content: (
            <Flex direction="column" rowGap={3}>
              For this example we are going to click sort by {`"`}Sales Rank
              {`"`} and...
            </Flex>
          ),
        },
        {
          //step 12
          target: "#order-by-low-to-high-container",
          content: (
            <Flex direction="column" rowGap={3}>
              ...click order by {`"`}Lowest to Highest{`"`}.
            </Flex>
          ),
        },
        {
          //step 13
          target: "body",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box fontWeight="bold">{`2. Sort By (Sorting) Recap`}</Box>
              <Box>
                We opened the sort by settings, selected {`"`}Sales Rank{`"`} to
                sort by, and we selected {`"`}Lowest to Highest{`"`} to order
                by. This will order the products by sales rank from lowest to
                highest.
              </Box>
            </Flex>
          ),
          placement: "center",
        },
        {
          //step 14
          target: "#discountsButton",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box fontWeight="bold">{`3. Discounts`}</Box>
              <Box>
                Discounts are used to accurately calculate profit. If you have a
                discount code, you can enter it its value here.
              </Box>
              <Box>Let{`'`}s now cover Discounts!</Box>
            </Flex>
          ),
        },
        {
          //step 15
          target: "#discounts-enabled-switch-container",
          content: (
            <Flex direction="column" rowGap={3}>
              Firstly, we will enable the discounts filter. By clicking on the
              switch.
            </Flex>
          ),
        },
        {
          //step 16
          target: "#discounts-div",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box>
                From here we can either enter a custom discount as a flat rate
                or a percent or choose one of the common preset discounts.
              </Box>
              <Box>
                For this example we are going to select {`"`}Buy 1 get 1 free
                {`"`} from the presets.
              </Box>
            </Flex>
          ),
        },
        {
          //step 17
          target: "#discounts-buy-1-get-1-free-radio-container",
          content: (
            <Flex direction="column" rowGap={3}>
              Click on the {`"`}Buy 1 get 1 free{`"`} radio button.
            </Flex>
          ),
        },
        {
          //step 18
          target: "body",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box fontWeight="bold">{`3. Discounts Recap`}</Box>
              <Box>
                We enabled the discounts filter and selected {`"`}Buy 1 get 1
                free{`"`}. This discount will be applied to the products
                displayed when calculating profit.
              </Box>
            </Flex>
          ),
          placement: "center",
        },
        {
          //step 19
          target: "body",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box fontWeight="bold">{`4. Apply`}</Box>
              <Box>
                Now all that is left to do is click {`"`}Apply{`"`} to apply all
                of our settings. This will update the products displayed to
                match our settings.
              </Box>
            </Flex>
          ),
          placement: "center",
        },
        {
          //step 20
          target: "#applyFiltersButton",
          content: (
            <Flex direction="column" rowGap={3}>
              We will now click on {`"`}Apply{`"`}.
            </Flex>
          ),
        },
        {
          //step 21
          target: "body",
          content: (
            <Flex direction="column" rowGap={3}>
              <Box fontWeight="bold">{`Total Recap`}</Box>
              <Box>
                We will now see products from {`"`}6pm{`"`} sorted by sales rank
                from lowest to highest with the {`"`}Buy 1 get 1 free{`"`}{" "}
                discount applied.
              </Box>
              <Box>
                Customize these settings to your liking and find the best
                products for you!
              </Box>
            </Flex>
          ),
          placement: "center",
        },
      ];
      return steps;
    }
    return [];
  }, [router.pathname]);

  async function handleStep(type: "forward" | "back") {
    await sleep(100);
    if (type === "forward") setStepIndex(stepIndex + 1);
    if (type === "back") setStepIndex(stepIndex - 1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleJoyrideCallback = async (data: any) => {
    const { status, type, action } = data;
    const step = stepIndex + 1;

    console.log(data);

    //Tour closed, finished, or errored
    if (
      [STATUS.FINISHED, STATUS.SKIPPED].includes(status) ||
      action === "close" ||
      type.includes("error")
    ) {
      toast({
        title: "Tour complete!",
        description:
          "You can always watch the tour again or contact us if you have any questions.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setTourRunning(false);
      setStepIndex(0);
      return;
    }

    if (tourRunning) {
      if (router.pathname === "/dashboard/features/products") {
        const tourDirection: "forward" | "back" | undefined = getTourDirection(
          type,
          action
        );

        if (step === 1) {
          if (tourDirection === "forward") {
            closeFiltersSection();
            await handleStep("forward");
          }
          if (tourDirection === "back") await handleStep("back");
        } else if (step === 2) {
          if (tourDirection === "forward") {
            clickFiltersButton();
            await handleStep("forward");
          }
          if (tourDirection === "back") await handleStep("back");
        } else if (step === 3) {
          if (tourDirection === "forward") {
            setFilterByRetailerToDisabled();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            clickFiltersButton();
            await handleStep("back");
          }
        } else if (step === 4) {
          if (tourDirection === "forward") {
            clickRetailerFilterSwitch();
            await handleStep("forward");
          }
          if (tourDirection === "back") await handleStep("back");
        } else if (step === 5) {
          if (tourDirection === "forward") {
            openRetailersModal();
            await sleep(100);
            clearRetailerModal();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            clickRetailerFilterSwitch();
            await handleStep("back");
          }
        } else if (step === 6) {
          if (tourDirection === "forward") {
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            saveAndCloseRetailerModal();
            await handleStep("back");
          }
        } else if (step === 7) {
          if (tourDirection === "forward") {
            retailerModalCheck6pm();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            await handleStep("back");
          }
        } else if (step === 8) {
          if (tourDirection === "forward") {
            saveAndCloseRetailerModal();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            clearRetailerModal();
            await handleStep("back");
          }
        } else if (step === 9) {
          if (tourDirection === "forward") {
            clickSortByButton();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            openRetailersModal();
            await handleStep("back");
          }
        } else if (step === 10) {
          if (tourDirection === "forward") {
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            clickFiltersButton();
            await handleStep("back");
          }
        } else if (step === 11) {
          if (tourDirection === "forward") {
            clickSortBySalesRank();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            await handleStep("back");
          }
        } else if (step === 12) {
          if (tourDirection === "forward") {
            clickOrderByLowToHigh();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            await handleStep("back");
          }
        } else if (step === 13) {
          if (tourDirection === "forward") {
            clickDiscountsButton();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            await handleStep("back");
          }
        } else if (step === 14) {
          if (tourDirection === "forward") {
            disableDiscountsSwitch();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            clickSortByButton();
            await handleStep("back");
          }
        } else if (step === 15) {
          if (tourDirection === "forward") {
            enableDiscountsSwitch();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            await handleStep("back");
          }
        } else if (step === 16) {
          if (tourDirection === "forward") {
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            await handleStep("back");
          }
        } else if (step === 17) {
          if (tourDirection === "forward") {
            clickBuy1Get1FreeRadio();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            await handleStep("back");
          }
        } else if (step === 18) {
          if (tourDirection === "forward") {
            clickDiscountsButton();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            await handleStep("back");
          }
        } else if (step === 19) {
          if (tourDirection === "forward") {
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            clickDiscountsButton();
            await handleStep("back");
          }
        } else if (step === 20) {
          if (tourDirection === "forward") {
            clickApplyButton();
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            await handleStep("back");
          }
        } else if (step === 21) {
          if (tourDirection === "forward") {
            await handleStep("forward");
          }
          if (tourDirection === "back") {
            await handleStep("back");
          }
        }
      }
    }
  };

  return (
    <>
      {showButton && (
        <Tooltip
          label={"Guided Tour"}
          placement="right"
          bg="white"
          color="black"
          fontSize="md"
          hasArrow
        >
          <chakra.span>
            <Button
              minW="100%"
              size={sidebarOpen ? "sm" : "xs"}
              bg="gray.700"
              fontWeight={"normal"}
              icon={sidebarOpen ? RiGuideLine : undefined}
              iconPosition="left"
              _hover={{ bg: "gray.500" }}
              pl={sidebarOpen ? 1 : undefined}
              shadow="none"
              onClick={() => setTourRunning(!tourRunning)}
            >
              {sidebarOpen ? "Guided Tour" : <RiGuideLine />}
            </Button>
          </chakra.span>
        </Tooltip>
      )}
      <Joyride
        styles={{
          beacon: {},
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
          tooltip: {},
          tooltipContainer: {
            textAlign: "left",
          },
          buttonBack: {
            color: "dodgerblue",
          },
          buttonNext: {
            backgroundColor: "dodgerblue",
          },
        }}
        steps={steps}
        stepIndex={stepIndex}
        run={tourRunning}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        hideCloseButton={true}
        disableOverlayClose={true}
        callback={handleJoyrideCallback}
        locale={{ skip: "close" }}
      />
    </>
  );
}
