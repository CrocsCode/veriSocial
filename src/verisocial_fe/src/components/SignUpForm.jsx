import { useState } from "react";
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
import { registerRequest } from "../redux/actionCreators/authCreators";
import { showNotificationRequest } from "../redux/actionCreators/notificationCreators";
import { validatePassword } from "../utils/passwordValidation";
import PropTypes from "prop-types";

const SignupForm = ({ registerRequest, showNotificationRequest }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            showNotificationRequest(passwordErrors.join("\n"), "error");
            return;
        }

        if (password !== confirmPassword) {
            showNotificationRequest("Passwords must match.", "error");
            return;
        }

        registerRequest({ email, password, confirmPassword, name });
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
                <FormControl id="name" isRequired>
                    <FormLabel color={'purple.800'}>Full Name</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>

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
                            type={showPassword1 ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width="3rem">
                            <IconButton
                                icon={showPassword1 ? <LuEye /> : <LuEyeClosed />}
                                onClick={() => setShowPassword1(!showPassword1)}
                                color="purple.500"
                                bg={"transparent"}
                                _hover={{ color: "purple.800" }}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl id="confirm-password" isRequired>
                    <FormLabel color={'purple.800'}>Confirm Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showPassword2 ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <InputRightElement width="3rem">
                            <IconButton
                                icon={showPassword2 ? <LuEye /> : <LuEyeClosed />}
                                onClick={() => setShowPassword2(!showPassword2)}
                                color="purple.500"
                                bg={"transparent"}
                                _hover={{ color: "purple.800" }}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button colorScheme="purple" w="full" mt={4} type="submit">
                    Sign Up
                </Button>
            </VStack>
        </form>
    );
};

SignupForm.propTypes = {
    registerRequest: PropTypes.func.isRequired,
    showNotificationRequest: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
    registerRequest,
    showNotificationRequest
};

export default connect(null, mapDispatchToProps)(SignupForm);
