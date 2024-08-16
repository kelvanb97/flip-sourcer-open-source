import { Badge, Tooltip } from "@chakra-ui/react";
import { Condition } from "../../../types/Product";

interface ConditionBadgeProps {
  condition: Condition;
  body: string;
  tooltip: string;
}

export default function ConditionBadge({
  condition,
  body,
  tooltip,
}: ConditionBadgeProps) {
  const type = condition.includes("fba") ? "fba" : "fbm";
  const primaryColor = type === "fba" ? "orange.500" : "blue.500";
  const secondaryColor = type === "fba" ? "orange.200" : "blue.200";

  return (
    <Tooltip label={tooltip} hasArrow placement="top-start">
      <Badge
        color={primaryColor}
        bg={secondaryColor}
        borderWidth="1px"
        borderColor={primaryColor}
        cursor="default"
      >
        {body}
      </Badge>
    </Tooltip>
  );
}
