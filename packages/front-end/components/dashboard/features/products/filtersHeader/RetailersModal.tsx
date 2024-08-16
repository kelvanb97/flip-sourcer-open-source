import { Checkbox, Flex, GridItem, SimpleGrid, chakra } from "@chakra-ui/react";
import { retailerMap } from "../../../../../utils/constants";
import { FiltersInterface } from "../../../../../../types/Filters";
import Modal from "../../../../shared/Modal";
import Button from "../../../../shared/Button";

interface RetailersModalProps {
  filters: FiltersInterface;
  setFilters: (filters: FiltersInterface) => void;
  close: () => void;
}

export default function RetailersModal({
  filters,
  setFilters,
  close,
}: RetailersModalProps) {
  return (
    <Modal id="retailerModal" close={close}>
      <>
        <SimpleGrid columns={[2, 2, 3]} columnGap={2}>
          {Object.entries(retailerMap).map(
            ([retailerName, retailerDisplayName]) => (
              <GridItem
                id={`retailer-modal-${retailerName}-grid-item`}
                key={`retailer-${retailerName}`}
              >
                <Checkbox
                  id={`retailer-modal-${retailerName}-checkbox`}
                  isChecked={filters.retailerList.includes(retailerName)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,
                        retailerList: [...filters.retailerList, retailerName],
                      });
                    } else {
                      setFilters({
                        ...filters,
                        retailerList: filters.retailerList.filter(
                          (x) => x !== retailerName
                        ),
                      });
                    }
                  }}
                >
                  <chakra.span fontSize={["sm", "sm", "md"]}>
                    {retailerDisplayName}
                  </chakra.span>
                </Checkbox>
              </GridItem>
            )
          )}
        </SimpleGrid>
        <Flex justifyContent={"space-between"} mt={5}>
          <Button
            id="retailer-modal-clear"
            flavor={"default"}
            bg="gray.200"
            color="black"
            shadow="none"
            _hover={{ bg: "gray.300" }}
            onClick={() => {
              setFilters({
                ...filters,
                retailerList: [],
              });
            }}
          >
            Clear
          </Button>
          <Button
            id="retailer-modal-save"
            flavor="default"
            shadow="none"
            onClick={() => close()}
          >
            Save
          </Button>
        </Flex>
      </>
    </Modal>
  );
}
