import React, { useState } from "react";
import { Box, Heading, VStack, Text, Icon, Flex } from "@chakra-ui/react";
import { connect } from "react-redux";
import Feed from "../components/Feed";
import PostFocus from "../components/PostFocus";
import ProfileCard from "../components/ProfileCard";
import SettingsCard from "../components/SettingsCard";
import TrendCard from "../components/TrendCard";
import LeaderboardCard from "../components/LeaderboardCard";
import DailyChallengesCard from "../components/DailyChallengesCard";
import Modal from "../components/Modal";

function HomePage({ isAuthenticated }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostModalOpen, setPostModalOpen] = useState(false);

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
            <Box w="90%" display="flex" justifyContent="center" alignItems="center">
              <Feed
                onSelectPost={(post) => {
                  setSelectedPost(post);
                  setPostModalOpen(true);
                }}
              />
            </Box>
            <Box w="2px" bg="purple.500" alignSelf="stretch" mr="5%" />
          </Flex>

        {/* Post Focus Modal */}
        <Modal
          isOpen={isPostModalOpen}
          onClose={() => {
            setPostModalOpen(false);
            setSelectedPost(null);
          }}
        >
          <PostFocus post={selectedPost} />
        </Modal>

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
