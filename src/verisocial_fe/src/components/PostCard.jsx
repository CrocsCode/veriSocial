import React from "react";
import { Box, Heading, Text, Image, Avatar, HStack } from "@chakra-ui/react";

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diff = Math.floor((now - postTime) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

const PostCard = ({ post, onClick }) => {
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="gray.50"
      position="relative"
      cursor="pointer"
      onClick={onClick}
    >
      <Box
        position="absolute"
        top={2}
        right={4}
        fontSize="xs"
        color="gray.400"
      >
        {getRelativeTime(post.timestamp)}
      </Box>

      <HStack align="top" mb={4}>
        <Avatar src={post.profilePicture} name={post.user} size="md" />
        <Box>
          <Heading as="h3" size="sm" mb={1}>
            {post.user}
          </Heading>
          <Text fontSize="sm" color="gray.500" mb={1}>
            {post.username}
          </Text>
        </Box>
      </HStack>

      <Text mb={4}>{post.content}</Text>
      {post.image && <Image src={post.image} alt="Post content" borderRadius="md" mb={4} />}

      <HStack spacing={4}>
        <Text color="blue.500" fontSize="sm" cursor="pointer">
          Like
        </Text>
        <Text color="red.500" fontSize="sm" cursor="pointer">
          Report
        </Text>
        <Text color="teal.500" fontSize="sm" cursor="pointer">
          Comments
        </Text>
      </HStack>
    </Box>
  );
};

export default PostCard;
