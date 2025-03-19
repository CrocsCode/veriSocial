import { Box, VStack, Text } from "@chakra-ui/react";

const SettingsCard = () => {
    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderRadius="md"
            p="5%"
            boxShadow="md"
            w="100%"
            textAlign="left"
            minH="30vh"
        >
            {/* Statistics Section */}
            <VStack align="start" spacing={2} mb={6}>
                <Text textStyle="h3" mb={2}>
                    Settings
                </Text>
                <Box pl="10%" fontSize="md" color="gray.600">
                    <Text
                        cursor="pointer"
                        _hover={{ color: "purple.400" }}
                    >
                        Subheading 1
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{ color: "purple.400" }}
                    >
                        Subheading 2
                    </Text>
                </Box>
            </VStack>

            {/* Account Section */}
            <VStack align="start" spacing={2}>
                <Text textStyle="h3" mb={2}>
                    Account
                </Text>
                <Box pl="10%" fontSize="md" color="gray.600">
                    <Text
                        cursor="pointer"
                        _hover={{ color: "purple.400" }}
                    >
                        Subheading 1
                    </Text>
                    <Text
                        cursor="pointer"
                        _hover={{ color: "purple.400" }}
                    >
                        Subheading 2
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
};

export default SettingsCard;
