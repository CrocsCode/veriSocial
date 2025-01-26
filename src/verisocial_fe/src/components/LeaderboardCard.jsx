import React from "react";
import { Box, Avatar, Text, VStack, HStack } from "@chakra-ui/react";

const LeaderboardCard = () => {

    const leaderboardData = [
        { rank: 2, name: "Elise", level: 713, avatar: "https://via.placeholder.com/150", barHeight: "9vh", bg: "purple.400" },
        { rank: 1, name: "Amelia", level: 720, avatar: "https://via.placeholder.com/150", barHeight: "12vh", bg: "purple.600" },
        { rank: 3, name: "Said", level: 684, avatar: "https://via.placeholder.com/150", barHeight: "6vh", bg: "purple.200" },
    ];

    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderRadius="md"
            p="4%"
            boxShadow="md"
            w="100%"
            textAlign="center"
            h="30vh"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
        >
            <Text textStyle="h3" mb={2}>
                Leaderboard
            </Text>


            {/* LB Bars */}
            <HStack justify="center" align="flex-end" spacing="4%" h="100%">
                {leaderboardData.map((user) => (
                    <VStack key={user.rank} spacing="1">
                        <Avatar
                            size="md"
                            src={user.avatar}
                            name={user.name}
                            borderWidth="2px"
                            borderColor="white"
                            bg={user.bg}
                            mb="-20px"
                            zIndex={2}
                        />
                        <Box
                            bg={user.bg}
                            w="50px"
                            h={user.barHeight}
                            borderRadius="md"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            position="relative"
                            fontSize="3vh"
                        >
                        </Box>
                        <Text fontWeight="bold">
                            {user.name}
                        </Text>
                        <Text color="gray.500" fontSize="1.5vh">
                            {user.level}
                        </Text>
                    </VStack>
                ))}
            </HStack>
        </Box>
    );
};

export default LeaderboardCard;
