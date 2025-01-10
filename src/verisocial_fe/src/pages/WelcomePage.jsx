import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { connect } from "react-redux";
import { navigate } from "../routes/navigation";

function WelcomePage() {
    return (
        <Box
            position="relative"
            minH="100vh"
            bgGradient="linear(to-r, blue.500, purple.600, pink.400)"
            overflow="hidden"
            _before={{
                content: '""',
                position: "absolute",
                top: "-100px",
                left: "-150px",
                width: "30rem",
                height: "30rem",
                bg: "white",
                opacity: 0.05,
                transform: "rotate(45deg)",
                zIndex: 0,
            }}
            _after={{
                content: '""',
                position: "absolute",
                bottom: "-100px",
                right: "-150px",
                width: "55rem",
                height: "40rem",
                bg: "black",
                opacity: 0.05,
                transform: "rotate(-45deg)",
                zIndex: 0,
            }}
        >
            <Flex
                direction={{ base: "column", md: "row" }}
                minH="100vh"
                align="center"
                justify="center"
            >
                {/* L SIDE */}
                <Flex
                    flex="1"
                    direction="column"
                    align="center"
                    justify="center"
                    textAlign="center"
                    p={8}
                    color="white"
                >
                    <Heading as="h1" size="2xl" mb={4} zIndex={1}>
                        Welcome to VeriSocial
                    </Heading>
                    <Text fontSize="lg" mb={6} zIndex={1}>
                        Join us now and experience the best social platform!
                    </Text>
                </Flex>

                {/* R SIDE */}
                <Flex
                    flex="1"
                    direction="column"
                    align="center"
                    justify="center"
                    p={8}
                    borderRadius="md"
                    minH="50vh"
                    minW="30vw"
                >
                    <Heading
                        as="h2"
                        size="lg"
                        mb={6}
                        color="white"
                        cursor="pointer"
                        onClick={() => navigate("/login")}
                        transform="scale(1)"
                        transition="transform 0.2s ease-in-out"
                        _hover={{
                            transform: "scale(1.1)",
                        }}
                        zIndex={1}
                    >
                        {/* Ready to Join? */}
                        Join today!
                    </Heading>
                </Flex>
            </Flex>
        </Box>
    );
}

export default connect(null, null)(WelcomePage);
