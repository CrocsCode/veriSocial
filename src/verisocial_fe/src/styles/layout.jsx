import React from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { connect } from "react-redux";
import { logout } from "../redux/actionCreators/authCreators";
import { Outlet } from "react-router-dom";
import WelcomePage from "../pages/WelcomePage";

const Layout = ({ isAuthenticated, logout }) => {
  const handleLogout = () => {
    logout();
    console.log("Attempted Logout");
  }

  return (
    <Flex direction="column" minH="100vh">
      {isAuthenticated && (
        <Box as="header" bg="primary.600" color="white" py={4} px={6}>
          <Flex justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="bold">
              VeriSocial - Placeholder Nav
            </Text>
            <Button
              colorScheme="white"
              variant="outline"
              size="sm"
              _hover={{ bg: "whiteAlpha.300" }}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Flex>
        </Box>
      )}

      <Box as="main" flex="1">
        {isAuthenticated ? (
          <Outlet />
        ) : (
          <Box bg="white" textAlign="center" minW="md">
            <WelcomePage />
          </Box>
        )}
      </Box>

      {isAuthenticated && (
        <Box as="footer" bg="blue.600" color="white" py={4} px={6} textAlign="center">
          <Text fontSize="sm">&copy; 2025 VeriSocial. All rights reserved.</Text>
        </Box>
      )}
    </Flex>
  );
};

const mapDispatchToProps = {
  logout,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);

