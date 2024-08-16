import { Box, Flex } from "@chakra-ui/react";
import { UserInterfaceDisplay } from "../../../../types/User";
import Card from "../../shared/Card";

interface ProfileProps {
  user: UserInterfaceDisplay;
}

export default function Profile({ user }: ProfileProps) {
  return (
    <Card p={0}>
      <Box
        p={3}
        fontSize="lg"
        fontWeight={""}
        borderBottom={"1px"}
        borderColor="gray.300"
      >
        <strong>Profile</strong>
      </Box>
      <Flex flexDir="column" rowGap={2} py={3}>
        <Flex px={3}>
          <Box>Name:</Box>
          <Box ml={3}>{user.name}</Box>
        </Flex>
        <Flex px={3}>
          <Box>Email:</Box>
          <Box ml={3}>{user.email}</Box>
        </Flex>
      </Flex>
    </Card>
  );
}
