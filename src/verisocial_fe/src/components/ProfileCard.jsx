import React from "react";
import { Box, Avatar, Heading, Text, Flex, Button, HStack } from "@chakra-ui/react";
import { connect } from "react-redux";


const ProfileCard = ({ user }) => {
    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderRadius="md"
            boxShadow="md"
            w="100%"
            textAlign="center"
            minH="30vh"
            position="relative"
        >
            {/* Banner */}
            <Box
                bg="purple.200"
                h="30%"
                w="100%"
                borderTopRadius="md"
            >
                <Text color="white" fontWeight="bold" pt={2}>
                    Banner
                </Text>
            </Box>

            <Flex
                justify="center"
                align="center"
                position="absolute"
                top="30%"
                left="17.5%"
                transform="translate(-50%, -50%)"
                zIndex={2}
            >
                <Avatar
                    src="https://via.placeholder.com/150"
                    name={user.full_name}
                    borderWidth="0.5vh"
                    borderColor="white"
                    boxSize="7vh"
                />

            </Flex>

            {/* Content */}
            <Box position="relative" textAlign="left" p="5%" pt="15%">
                <HStack spacing={2} mb="2%">
                    <Heading as="h3" size="md" noOfLines={1}>
                        {user.full_name}
                    </Heading>
                    <Text fontSize="sm" mb="-1%" color="gray.500">
                        {user.username}
                    </Text>
                </HStack>

                {/* Bio Box */}
                <Box
                    bg="gray.100"
                    borderWidth="1px"
                    borderRadius="md"
                    p={3}
                    mb={4}
                    textAlign="left"
                    minH="10vh"
                    mt="1%"
                >
                    <Text fontSize="sm" color="gray.600">
                        {user.bio}
                    </Text>
                </Box>

                <Button
                    position="absolute"
                    top="0"
                    right="0"
                    bg="transparent"
                    fontSize="lg"
                    fontWeight="bold"
                    _hover={{ bg: "transparent", color: "purple.400" }}
                    _focus={{ boxShadow: "none" }}
                >
                    ...
                </Button>
            </Box>

        </Box>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(ProfileCard);
