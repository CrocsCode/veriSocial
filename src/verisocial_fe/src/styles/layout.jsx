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
  };

  return (
    <Flex direction="column" h="100vh">
      {/* Header */}
      {isAuthenticated && (
        <Box as="header" bg="purple.600" color="white" h="5vh" px={6}>
          <Flex justify="space-between" align="center" h="100%">
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

      {/* Main Content */}
      <Box as="main" flex="1" overflow="auto" >
        {isAuthenticated ? (
          <Outlet />
        ) : (
          <Box bg="white" textAlign="center" h="100%">
            <WelcomePage />
          </Box>
        )}
      </Box>

      {/* Footer */}
      {isAuthenticated && (
        <Box
          as="footer"
          bg="purple.600"
          color="white"
          h="5vh"
          px={6}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
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
