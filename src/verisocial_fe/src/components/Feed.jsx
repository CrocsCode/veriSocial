import React, { useState, useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import { debounce } from "lodash";
import { Box, VStack, Text, Skeleton, SkeletonText, SkeletonCircle, Icon, HStack } from "@chakra-ui/react";
import { FaPen } from "react-icons/fa";
import PostCard from "./PostCard";
import CreatePostForm from "./CreatePostForm";
import Modal from "./Modal";
import { loadFeedPageRequest } from "../redux/actionCreators/feedCreators";
import { resetCreatePostForm } from "../redux/actionCreators/createPostActionCreators";

const Feed = ({ onSelectPost, loadFeedPageRequest, feed, resetCreatePostForm }) => {
  const { posts, loading, isLastPage } = feed;
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const pageSize = 8;
  const feedContainerRef = useRef(null);
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);

  const fetchPosts = () => {
    if (loading || isLastPage || isFetching) return;

    setIsFetching(true);
    loadFeedPageRequest(currentPage, pageSize);

    setTimeout(() => {
      setCurrentPage((prevPage) => prevPage + 1);
      setIsFetching(false);

      const container = feedContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollTop - 1;
      }
    }, 1500);
  };

  const debouncedHandleScroll = useCallback(
    debounce(() => {
      const container = feedContainerRef.current;
      if (container && container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
        fetchPosts();
      }
    }, 500),
    [fetchPosts]
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const container = feedContainerRef.current;
    container.addEventListener("scroll", debouncedHandleScroll);
    return () => container.removeEventListener("scroll", debouncedHandleScroll);
  }, [debouncedHandleScroll]);

  return (
    <Box w="80%" height="100%">
      <Box
        border="2px dashed"
        borderColor="gray.400"
        borderRadius="md"
        p={6}
        mb="1.5vh"
        mt="3%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        cursor="pointer"
        bg="gray.50"
        onClick={() => setCreatePostOpen(true)}
        transition="transform 0.2s ease-in-out"
        _hover={{ transform: "scale(1.02)" }}
        height="7.5%"
      >
        <HStack>
          <Icon as={FaPen} boxSize={5} color="gray.600" />
          <Text color="gray.600" fontWeight="bold">Create Post</Text>
        </HStack>
      </Box>

      {/* Create Post */}
      <Modal
        isOpen={isCreatePostOpen}
        onClose={() => setCreatePostOpen(false)}
        resetForm={resetCreatePostForm}
      >
        <CreatePostForm onClose={() => setCreatePostOpen(false)} />
      </Modal>

      {/* Feed Container */}
      <Box
        ref={feedContainerRef}
        h="85%"
        overflowY="auto"
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <VStack spacing={4} align="stretch">
          {posts.map((post) => (
            <PostCard
              key={post.post_id}
              post={post}
              onClick={() => onSelectPost(post)}
            />
          ))}

          {/* Skeleton Load */}
          {loading && (
            <VStack spacing={4}>
              {Array(2)
                .fill("")
                .map((_, index) => (
                  <Box key={`loading-${index}`} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="gray.50">
                    <Box display="flex" alignItems="center" mb={4}>
                      <SkeletonCircle size="10" mr={4} />
                      <Box>
                        <Skeleton height="16px" width="120px" mb={2} />
                        <Skeleton height="12px" width="100px" />
                      </Box>
                    </Box>
                    <SkeletonText noOfLines={4} spacing="4" />
                  </Box>
                ))}
            </VStack>
          )}

          {!loading && isLastPage && (
            <Text textAlign="center" fontSize="lg" color="gray.500">
              You've reached the end of the feed.
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  feed: state.feed || { posts: [], loading: false, isLastPage: false },
});

const mapDispatchToProps = {
  loadFeedPageRequest,
  resetCreatePostForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
