import React, { useState } from "react";
import { connect } from "react-redux";
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    IconButton,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { loginRequest } from "../redux/actionCreators/authCreators";

const LoginForm = ({ loginRequest }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        loginRequest({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
                <FormControl id="email" isRequired>
                    <FormLabel color={'purple.800'}>Email Address</FormLabel>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>

                <FormControl id="password" isRequired>
                    <FormLabel color={'purple.800'}>Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width="3rem">
                            <IconButton
                                icon={showPassword ? <LuEye /> : <LuEyeClosed />}
                                onClick={() => setShowPassword(!showPassword)}
                                color="purple.500"
                                bg={"transparent"}
                                _hover={{ color: "purple.800" }}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button colorScheme="purple" w="full" mt={4} type="submit">Login</Button>
            </VStack>
        </form>
    );
};

const mapDispatchToProps = {
    loginRequest
};

export default connect(null, mapDispatchToProps)(LoginForm);
