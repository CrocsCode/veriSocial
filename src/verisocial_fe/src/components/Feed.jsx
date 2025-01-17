import React, { useState, useEffect, useRef } from "react";
import { Box, VStack, Text, Skeleton, SkeletonText, SkeletonCircle, Icon, HStack } from "@chakra-ui/react";
import { FaPen } from "react-icons/fa";
import PostCard from "./PostCard";
import mockPosts from "../pages/mockPosts.json";

const Feed = ({ onSelectPost }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const feedContainerRef = useRef(null);

  // Temp
  const fetchPosts = () => {
    if (!hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      const currentPosts = posts.length;
      const newPosts = mockPosts.slice(currentPosts, currentPosts + 4);

      setPosts([...posts, ...newPosts]);
      if (currentPosts + newPosts.length >= mockPosts.length) {
        setHasMore(false);
      }

      setIsLoading(false);
    }, 1500);
  };

  const handleScroll = () => {
    const container = feedContainerRef.current;
    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 50
    ) {
      fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const container = feedContainerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [posts]);

  return (
    <Box>
      {/* Add Post Box */}
      <Box
        border="2px dashed"
        borderColor="gray.400"
        borderRadius="md"
        p={6}

        mb="1.5vh"
        mt="0.5vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        cursor="pointer"
        bg="gray.50"
        onClick={() => alert("post create")}
        transition="transform 0.2s ease-in-out"
        _hover={{
          transform: "scale(1.02)",
        }}
      >
        <HStack>
          <Icon as={FaPen} boxSize={5} color="gray.600" />
          <Text color="gray.600" fontWeight="bold">
            Create Post
          </Text>
        </HStack>
      </Box>


      {/* Feed Container */}
      <Box
        ref={feedContainerRef}
        h="80vh"
        overflowY="auto"
        bg="white"
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
              key={post.id}
              post={post}
              onClick={() => onSelectPost(post)}
            />
          ))}

          {/* Skeleton Load */}
          {isLoading &&
            Array(2)
              .fill("")
              .map((_, index) => (
                <Box
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  boxShadow="md"
                  bg="gray.50"
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
          {!hasMore && posts.length < 4 && <Box h="50vh" />}
          {!hasMore && (
            <Text textAlign="center" fontSize="lg" color="gray.500">
              You've reached the end of the feed.
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Feed;
