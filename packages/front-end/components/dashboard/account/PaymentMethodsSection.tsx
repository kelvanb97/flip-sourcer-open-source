import { Badge, Box, Flex, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PaymentMethod } from "../../../../types/Stripe";
import { apiCall } from "../../../utils/apiCall";
import { genericToastError } from "../../../utils/constants";
import Button from "../../shared/Button";
import Card from "../../shared/Card";
import AddPaymentMethod from "../shared/AddPaymentMethod";
import Modal from "../../shared/Modal";

export default function PaymentMethods() {
  const toast = useToast();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] =
    useState(false);
  const closeAddPaymentMethodModal = () => setShowAddPaymentMethodModal(false);

  async function getPaymentMethods() {
    const res = await apiCall<{
      paymentMethods: PaymentMethod[];
      status: number;
    }>("/stripe/payment-method", {
      method: "GET",
      isSessionRequest: true,
    });

    if (!res || res.status !== 200) return toast(genericToastError);

    setPaymentMethods([...res.paymentMethods]);
  }

  async function handleDeletePaymentMethod(id: string) {
    const res = await apiCall(`/stripe/payment-method/${id}`, {
      method: "DELETE",
      isSessionRequest: true,
    });

    if (!res || res.status !== 200) {
      return toast(genericToastError);
    }

    toast({
      title: "Success",
      description: "Payment method removed",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    await getPaymentMethods();
  }

  async function handleSetAsDefault(id: string) {
    const res = await apiCall(`/stripe/default-payment-method/${id}`, {
      method: "POST",
      isSessionRequest: true,
    });

    if (!res || res.status !== 200) {
      return toast(genericToastError);
    }

    toast({
      title: "Success",
      description: "Payment method set as default",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    await getPaymentMethods();
  }

  useEffect(() => {
    getPaymentMethods();
  }, []);

  return (
    <>
      {showAddPaymentMethodModal && (
        <Modal close={() => closeAddPaymentMethodModal()}>
          <AddPaymentMethod
            redirect="/dashboard/account"
            cta="Add Payment Method"
          />
        </Modal>
      )}
      <Card p={0}>
        <Box
          p={3}
          fontSize="lg"
          fontWeight={""}
          borderBottom={"1px"}
          borderColor="gray.300"
        >
          <strong>Payment Methods</strong>
        </Box>
        <Box px={3} pt={3}>
          {paymentMethods.length > 0 ? (
            paymentMethods
              .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
              .map((pm, i) => (
                <Box
                  key={`paymentMethod${i}`}
                  mb={3}
                  border="1px"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={3}
                >
                  <Flex justifyContent={"space-between"}>
                    <Box>
                      <strong>{pm.brand}</strong> ending in {pm.last4}
                    </Box>
                    <Box>
                      Expires:{` `}
                      {pm.exp_month.toString().length === 1
                        ? "0" + pm.exp_month
                        : pm.exp_month}
                      /{pm.exp_year}
                    </Box>
                  </Flex>
                  <Flex justifyContent={"space-between"}>
                    {pm.isDefault ? (
                      <Badge colorScheme="green">Default</Badge>
                    ) : (
                      <Box
                        onClick={async () => await handleSetAsDefault(pm.id)}
                        color="dodgerblue"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                      >
                        Set as default
                      </Box>
                    )}
                    {!pm.isDefault && (
                      <Box
                        onClick={async () =>
                          await handleDeletePaymentMethod(pm.id)
                        }
                        color="red.500"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                      >
                        Remove
                      </Box>
                    )}
                  </Flex>
                </Box>
              ))
          ) : (
            <Box pb={3} color="red.500">
              *No payment methods on file.
            </Box>
          )}
        </Box>
        <Flex
          p={3}
          fontWeight={""}
          borderTop={"1px"}
          borderColor="gray.300"
          direction={"row-reverse"}
        >
          <Button
            shadow="none"
            onClick={() => setShowAddPaymentMethodModal(true)}
          >
            Add Payment Method
          </Button>
        </Flex>
      </Card>
    </>
  );
}
