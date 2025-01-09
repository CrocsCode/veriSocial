import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { connect } from "react-redux";
import { Outlet } from "react-router-dom";
import WelcomePage from "../pages/WelcomePage";

const Layout = ({ isAuthenticated }) => {
  return (
    <Flex direction="column" minH="100vh">
      {isAuthenticated && (
        <Box as="header" bg="primary.600" color="white" py={4} px={6}>
          <Text fontSize="xl" fontWeight="bold">
            VeriSocial - Logged In
          </Text>
        </Box>
      )}

      <Box as="main" flex="1">
        {isAuthenticated ? (
          <Outlet />
        ) : (
          <Box
            bg="white"
            textAlign="center"
            minW="md"
          >
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

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Layout);
