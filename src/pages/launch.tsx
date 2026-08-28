import { Flex, HStack } from "@chakra-ui/react";
import HomeButtonGroup from "@/components/home-button-group";

const LaunchPage = () => {
  return (
    <HStack p={7} pt={1} align="stretch" h="100%" spacing={6}>
      <Flex justify="flex-end" align="flex-end" minW="14.5rem" w="100%">
        <HomeButtonGroup />
      </Flex>
    </HStack>
  );
};

export default LaunchPage;
