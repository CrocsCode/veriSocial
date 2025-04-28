import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { debounce } from "lodash";
import {
  Box,
  VStack,
  Text,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { FaPen } from "react-icons/fa";
import PostCard from "./PostCard";
import GameEventCard from "./GameEventCard";
import CreatePostForm from "./CreatePostForm";
import Modal from "./Modal";
import { loadFeedPageRequest } from "../redux/actionCreators/feedCreators";
import { resetCreatePostForm } from "../redux/actionCreators/createPostActionCreators";
import { loadCommentsRequest } from "../redux/actionCreators/postInteractCreators";

function Feed({ onSelectPost, loadFeedPageRequest, feed, resetCreatePostForm, loadCommentsRequest, }) {
  const { posts, loading, isLastPage, currentPage } = feed;
  const [isFetching, setIsFetching] = useState(false);
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);

  const pageSize = 8;
  const feedContainerRef = useRef(null);

  const fetchPosts = useCallback(() => {
    if (loading || isLastPage || isFetching) return;

    setIsFetching(true);
    const nextPage = currentPage + 1;
    loadFeedPageRequest(nextPage, pageSize);

    setTimeout(() => {
      setIsFetching(false);

      const container = feedContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollTop - 1;
      }
    }, 1500);
  }, [loading, isLastPage, isFetching, loadFeedPageRequest, currentPage, pageSize]);

  useEffect(() => {
    const container = feedContainerRef.current;
    if (!container) return;

    const debouncedScroll = debounce(() => {
      if (
        container.scrollTop + container.clientHeight >= container.scrollHeight - 50
      ) {
        fetchPosts();
      }
    }, 500);

    container.addEventListener("scroll", debouncedScroll);
    return () => {
      container.removeEventListener("scroll", debouncedScroll);
    };
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectPostWithComments = (post) => {
    onSelectPost(post);
    loadCommentsRequest(post.post_id, 1, 10);
  };

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
          <Text color="gray.600" fontWeight="bold">
            Create Post
          </Text>
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
          {posts.map((post, index) => {
            // for game post rendering
            if (post.post_type === "game") {
              return (
                <GameEventCard
                  key={`game-${post.post_id}-${index}`}
                  postId={post.post_id}
                  botImage={post.bot_image}
                  humanImage={post.human_image}
                  correctPostId={post.correct_post_id}
                  wrongPostId={post.wrong_post_id}
                />
              );
            }
            // else normal post
            return (
              <PostCard
                key={`post-${post.post_id}-${index}`}
                post={post}
                onClick={() => handleSelectPostWithComments(post)}
              />
            );
          })}

          {/* Skeleton Load */}
          {loading && (
            <VStack spacing={4}>
              {Array(2)
                .fill("")
                .map((_, index) => (
                  <Box
                    key={`loading-${index}`}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    boxShadow="md"
                    bg="gray.50"
                    width="100%"
                  >
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
              You&apos;ve reached the end of the feed.
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
}

Feed.propTypes = {
  onSelectPost: PropTypes.func.isRequired,
  loadFeedPageRequest: PropTypes.func.isRequired,
  feed: PropTypes.shape({
    posts: PropTypes.arrayOf(
      PropTypes.oneOfType([
        // normal post
        PropTypes.shape({
          post_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          post_type: PropTypes.oneOf(["normal"]),
        }),
        // game post
        PropTypes.shape({
          post_id: PropTypes.string,
          post_type: PropTypes.oneOf(["game"]),
          bot_image: PropTypes.string.isRequired,
          human_image: PropTypes.string.isRequired,
          correct_post_id: PropTypes.number,
          wrong_post_id: PropTypes.number,
        }),
      ])
    ),
    loading: PropTypes.bool,
    isLastPage: PropTypes.bool,
    currentPage: PropTypes.number,
  }).isRequired,
  resetCreatePostForm: PropTypes.func.isRequired,
  loadCommentsRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  feed: state.feed || { posts: [], loading: false, isLastPage: false, currentPage: 0 },
});

const mapDispatchToProps = {
  loadFeedPageRequest,
  resetCreatePostForm,
  loadCommentsRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
