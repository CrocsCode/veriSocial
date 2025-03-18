import { useState } from "react";
import { Box, Container, Heading, Text, Link } from "@chakra-ui/react";
import SignupForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);

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
                    minH="50vh"
                    minW="50vh"
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg="white"
                    zIndex={1}
                >
                    <Heading as="h2" size="lg" textAlign="center" mb={6} color={'purple.700'}>
                        {isSignUp ? "Sign Up" : "Login"}
                    </Heading>

                    {isSignUp ? <SignupForm /> : <LoginForm />}

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
};

export default LoginPage;
