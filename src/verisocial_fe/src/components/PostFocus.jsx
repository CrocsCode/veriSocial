import React from "react";
import { connect } from "react-redux";
import {
  Box,
  Heading,
  Text,
  Avatar,
  HStack,
  Input,
  VStack,
  Icon,
  Divider,
  Image,
} from "@chakra-ui/react";
import { FaHeart, FaFlag } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

const formatBase64Image = (base64) => {
  if (!base64) return null;
  return base64.startsWith("data:image") ? base64 : `data:image/jpeg;base64,${base64}`;
};

const PostFocus = ({ post }) => {
  if (!post) {
    return (
      <Box textAlign="center" mt={6}>
        <Heading as="h2" size="lg" color="gray.500">
          No post selected.
        </Heading>
      </Box>
    );
  }

  const imageSrc = formatBase64Image(post.base64_image);
  const readableTimestamp = new Date(post["created-at"]).toLocaleString();

  return (
    <Box p="5" borderRadius="md" bg="purple.50" h="70vh" w="40vw">
      {/* User Info */}
      <HStack mb={4} justifyContent="space-between">
        <HStack>
          <Avatar src={imageSrc} name={post["full-name"]} size="lg" />
          <Box>
            <Heading as="h3" size="md">
              {post["full-name"]}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              @{post.username}
            </Text>
          </Box>
        </HStack>
        <Text fontSize="sm" color="gray.400">
          {readableTimestamp}
        </Text>
      </HStack>

      {/* Post Content */}
      <Text mb={4}>{post.content}</Text>
      {imageSrc && <Image src={imageSrc} alt="Post content" borderRadius="md" mb={4} />}

      {/* Buttons */}
      <HStack spacing={4} mb={4}>
        <HStack color="blue.500" fontSize="sm" cursor="pointer">
          <Icon as={FaHeart} boxSize={4} />
          <Text>Like</Text>
        </HStack>

        <HStack color="teal.500" fontSize="sm" cursor="pointer">
          <Icon as={FaMessage} boxSize={4} />
          <Text>Reply</Text>
        </HStack>

        <HStack color="red.500" fontSize="sm" cursor="pointer">
          <Icon as={FaFlag} boxSize={4} />
          <Text>Report</Text>
        </HStack>
      </HStack>

      <Divider my={6} borderColor="gray.300" />

      {/* Comments */}
      <Box mt={6}>
        <Heading as="h4" size="md" mb={4} color="blue.500" fontWeight="bold">
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

const mapStateToProps = (state, ownProps) => ({
  post: ownProps.post || null,
});

export default connect(mapStateToProps)(PostFocus);
