import React from "react";
import {
  Box,
  Heading,
  Text,
  Avatar,
  HStack,
  Button,
  Input,
  VStack,
} from "@chakra-ui/react";

const PostFocus = ({ post, onClose }) => {
  return (
    <Box>
      <HStack mb={4} justifyContent="space-between">
        <HStack>
          <Avatar src={post.profilePicture} name={post.user} size="lg" />
          <Box>
            <Heading as="h3" size="md">
              {post.user}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {post.username}
            </Text>
          </Box>
        </HStack>
        <Text fontSize="sm" color="gray.400">
          {new Date(post.timestamp).toLocaleString()}
        </Text>
      </HStack>

      <Text mb={4}>{post.content}</Text>
      {post.image && <img src={post.image} alt="Post content" width="100%" />}

      <HStack spacing={4} mt={4}>
        <Button colorScheme="blue" size="sm">
          Like
        </Button>
        <Button colorScheme="red" size="sm">
          Report
        </Button>
      </HStack>

      {/* Comments */}
      <Box mt={6}>
        <Heading as="h4" size="md" mb={4}>
          Comments
        </Heading>

        <Box mb={4}>
          <Input placeholder="Add a comment..." size="md" />
        </Box>

        <VStack align="stretch" spacing={4}>
          {post.comments?.length > 0 ? (
            post.comments.map((comment) => (
              <Box
                key={comment.id}
                p={3}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.50"
              >
                <Text fontWeight="bold">{comment.user}</Text>
                <Text>{comment.content}</Text>
              </Box>
            ))
          ) : (
            <Text color="gray.500">No comments yet. Be the first to comment!</Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default PostFocus;
