import React, { useState } from "react";
import { Box, Heading, VStack, Text, Icon, Flex } from "@chakra-ui/react";
import { connect } from "react-redux";
import Feed from "../components/Feed";
import PostFocus from "../components/PostFocus";
import { FaArrowLeft } from "react-icons/fa";
import ProfileCard from "../components/ProfileCard";
import SettingsCard from "../components/SettingsCard";
import TrendCard from "../components/TrendCard";
import LeaderboardCard from "../components/LeaderboardCard";
import DailyChallengesCard from "../components/DailyChallengesCard";

function HomePage({ isAuthenticated }) {
  const [selectedPost, setSelectedPost] = useState(null);

  if (!isAuthenticated) {
    return (
      <Box textAlign="center" mt={6}>
        <Heading as="h2" size="lg">
          Please log in to view your feed.
        </Heading>
      </Box>
    );
  }

  return (
    <Box h="100%" bg="gray.50">
      <Flex w="100%" h="100%" align="flex-start" justify="space-between">
        {/* Left Column */}
        <VStack w="22.5%" spacing={4} h="100%" p={4} ml="5%">
          <ProfileCard />
          <SettingsCard />
        </VStack>

        {/* Main Container */}
        <Flex w="45%" h="100%" justify="space-between">
          <Box w="2px" bg="purple.500" alignSelf="stretch" ml="5%" />
          <Box w="90%" display="flex" justifyContent="center" alignItems={!selectedPost ? "center" : "flex-start"}>
            {!selectedPost ? (
              <Feed onSelectPost={(post) => setSelectedPost(post)} />
            ) : (
              <Box w="100%" m={3} bg="purple.50" p={5} pb={10} borderRadius="md" boxShadow="md">
                <Flex
                  as="button"
                  onClick={() => setSelectedPost(null)}
                  cursor="pointer"
                  spacing={2}
                  mt={4}
                  mb={4}
                  align="center"
                  transition="transform 0.2s ease-in-out"
                  _hover={{
                    transform: "scale(1.05)",
                  }}
                >
                  <Icon as={FaArrowLeft} boxSize={4} color="purple.700" />
                  <Text textStyle="label" fontWeight="bold">
                    Back to Feed
                  </Text>
                </Flex>
                <PostFocus post={selectedPost} />
              </Box>
            )}
          </Box>
          <Box w="2px" bg="purple.500" alignSelf="stretch" mr="5%" />
        </Flex>

        {/* Right Column */}
        <VStack w="22.5%" spacing={4} h="100%" p={4} mr="5%">
          <TrendCard />
          <LeaderboardCard />
          <DailyChallengesCard />
        </VStack>
      </Flex>
    </Box>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(HomePage);
