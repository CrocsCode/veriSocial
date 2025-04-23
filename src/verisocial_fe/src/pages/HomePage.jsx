import { useState } from "react";
import { Box, Heading, VStack, Flex } from "@chakra-ui/react";
import { connect } from "react-redux";
import Feed from "../components/Feed";
import PostFocus from "../components/PostFocus";
import ProfileCard from "../components/ProfileCard";
import TrendCard from "../components/TrendCard";
import LeaderboardCard from "../components/LeaderboardCard";
import Modal from "../components/Modal";
import PropTypes from "prop-types";
import {
  fetchPostFocusRequest,
  resetPostFocus,
} from "../redux/actionCreators/postInteractCreators";

function HomePage({
  isAuthenticated,
  userId,
  fetchPostFocusRequest,
  resetPostFocus,
}) {
  const [isPostModalOpen, setPostModalOpen] = useState(false);

  const handleSelectPost = (post) => {
    fetchPostFocusRequest(userId, post.post_id);
    setPostModalOpen(true);
  };

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
        </VStack>

        {/* Main Container */}
        <Flex w="45%" h="100%" justify="space-between">
          <Box w="2px" bg="purple.500" alignSelf="stretch" ml="5%" />
          <Box w="90%" display="flex" justifyContent="center" alignItems="center">
            <Feed onSelectPost={handleSelectPost} />
          </Box>
          <Box w="2px" bg="purple.500" alignSelf="stretch" mr="5%" />
        </Flex>

        {/* Post Focus Modal */}
        <Modal
          isOpen={isPostModalOpen}
          onClose={() => {
            setPostModalOpen(false);
            resetPostFocus();
          }}
        >
          <PostFocus />
        </Modal>

        {/* Right Column */}
        <VStack w="22.5%" spacing={4} h="100%" p={4} mr="5%">
          <TrendCard />
          <LeaderboardCard />
        </VStack>
      </Flex>
    </Box>
  );
}

HomePage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  userId: PropTypes.number,
  fetchPostFocusRequest: PropTypes.func.isRequired,
  resetPostFocus: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  userId: state.auth.user.user_id,
});

const mapDispatchToProps = {
  fetchPostFocusRequest,
  resetPostFocus,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
