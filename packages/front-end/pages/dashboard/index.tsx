import { Flex } from "@chakra-ui/react";
import JoinOurDiscord from "../../components/dashboard/index/JoinOurDiscord";
import ScheduleADemo from "../../components/dashboard/index/ScheduleADemo";
import DemoVideo from "../../components/dashboard/index/DemoVideo";
import News from "../../components/dashboard/index/News";

export default function Dashboard() {
  return (
    <Flex wrap="wrap" columnGap={5} rowGap={5}>
      <DemoVideo />
      <ScheduleADemo />
      <JoinOurDiscord />
      <News />
    </Flex>
  );
}
