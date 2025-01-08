import React from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
} from "@chakra-ui/react";
import { connect } from "react-redux";
import { loginRequest } from "../redux/actionCreators/authCreators";
import { useState } from "react";

function LoginPage({ loginRequest }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        loginRequest({ email, password });
    };

    return (
        <Container
            centerContent
            minH="100vh"
            minW="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg="gray.50"
            p={4}
            margin={0}
        >
            <Box
                w="full"
                maxW="sm"
                p={6}
                borderRadius="md"
                boxShadow="lg"
                bg="white"
            >
                <Heading as="h2" size="lg" textAlign="center" mb={6}>
                    Login
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        {/* Email Input */}
                        <FormControl id="email" isRequired>
                            <FormLabel>Email Address</FormLabel>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>

                        {/* Password Input */}
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>

                        {/* Submit Button */}
                        <Button colorScheme="blue" w="full" mt={4} type="submit">
                            Submit
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Container>
    );
}

const mapDispatchToProps = {
    loginRequest,
}

export default connect(null, mapDispatchToProps)(LoginPage);
