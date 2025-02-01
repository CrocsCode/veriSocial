import React from "react";
import { Box, VStack, Text, Progress, Button } from "@chakra-ui/react";

const DailyChallengesCard = () => {
    const totalChallenges = 10;
    const completedChallenges = 4;
    const progress = (completedChallenges / totalChallenges) * 100;

    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderRadius="md"
            p={4}
            boxShadow="md"
            w="100%"
            textAlign="center"
            h="30vh"
        >
            <Text textStyle="h3" mb={2}>
                Daily Challenges
            </Text>


            <Text fontSize="1.5vh" mb={4} color="gray.600">
                Complete <strong>{totalChallenges}</strong> challenges to earn rewards!
            </Text>

            {/* Progress Bar */}
            <Box textAlign="left" mb={4}>
                <Text fontSize="1.5vh" mb={2}>
                    Progress: {completedChallenges} / {totalChallenges}
                </Text>
                <Progress value={progress} colorScheme="purple" size="md" borderRadius="md" />
            </Box>

            <VStack spacing={4}>
                <Box
                    bg="gray.100"
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    w="100%"
                    textAlign="left"
                    h="8vh"
                >
                    <Text fontSize="1.5vh" fontWeight="bold">
                        Challenge:
                    </Text>
                    <Text fontSize="1.5vh" color="gray.600">
                        Human or AI?
                    </Text>
                </Box>

                <Button
                    colorScheme="purple"
                    fontSize="1.5vh"
                    onClick={() => alert("Challenge in progress!")}
                    h="3vh"
                >
                    Begin Challenges
                </Button>
            </VStack>
        </Box>
    );
};

export default DailyChallengesCard;
