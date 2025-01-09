import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    Text,
    Link,
} from "@chakra-ui/react";
import { connect } from "react-redux";
import { loginRequest } from "../redux/actionCreators/authCreators";

function LoginPage({ loginRequest }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignUp) {
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            console.log("Sign-Up Request:", { email, password });
        } else {
            loginRequest({ email, password });
        }
    };

    return (
        <Box
            position="relative"
            minH="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
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
            <Container
                centerContent
                minH="100vh"
                minW="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgGradient="linear(to-tr, blue.400, purple.500, pink.300)"
                margin={0}
            >
                <Box
                    minH={"50vh"}
                    minW={"50vh"}
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg="white"
                    zIndex={1}
                >
                    <Heading as="h2" size="lg" textAlign="center" mb={6}>
                        {isSignUp ? "Sign Up" : "Login"}
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

                            {/* Confirm Password */}
                            {isSignUp && (
                                <FormControl id="confirm-password" isRequired>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <Input
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </FormControl>
                            )}

                            {/* Submit Button */}
                            <Button colorScheme="blue" w="full" mt={4} type="submit" bgGradient="linear(to-r, blue.500, purple.600, pink.400)">
                                {isSignUp ? "Sign Up" : "Login"}
                            </Button>
                        </VStack>
                    </form>

                    {/* Toggle */}
                    <Text mt={6} textAlign="center" fontSize="sm">
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        <Link
                            color="blue.500"
                            fontWeight="bold"
                            onClick={() => setIsSignUp(!isSignUp)}
                            cursor="pointer"
                        >
                            {isSignUp ? "Login" : "Sign Up"}
                        </Link>
                    </Text>
                </Box>
            </Container>
        </Box>
    );
}

const mapDispatchToProps = {
    loginRequest,
};

export default connect(null, mapDispatchToProps)(LoginPage);
