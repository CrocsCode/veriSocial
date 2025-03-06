import React from "react";
import { Box, Heading, Text, Image, Avatar, HStack, Icon } from "@chakra-ui/react";
import { FaHeart, FaFlag } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const postTime = new Date(timestamp);
  const diff = Math.floor((now - postTime) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

const formatBase64Image = (base64) => {
  if (!base64) return null;
  return base64.startsWith("data:image") ? base64 : `data:image/jpeg;base64,${base64}`;
};

const PostCard = ({ post, onClick }) => {
  const imageSrc = formatBase64Image(post.base64_image);

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="purple.50"
      position="relative"
      cursor="pointer"
      onClick={onClick}
      transition="background-color 0.2s ease"
      _hover={{
        bg: "purple.100",
      }}
      minH="5vh"
    >
      {/* Timestamp */}
      <Box position="absolute" top={2} right={4} fontSize="xs" color="gray.400">
        {getRelativeTime(post["created-at"])}
      </Box>

      {/* User Info */}
      <HStack align="top" mb={4}>
        {/* Add  src={imageSrc} Later - For Profile*/}
        <Avatar name={post["full-name"]} size="md" />
        <Box>
          <Heading as="h3" size="sm" mb={1}>
            {post["full-name"]}
          </Heading>
          <Text fontSize="sm" color="gray.500" mb={1}>
            @{post.username}
          </Text>
        </Box>
      </HStack>

      {/* Content */}
      <Text mb={4}>{post.content}</Text>

      {imageSrc && <Image src={imageSrc} alt="Post content" borderRadius="md" mb={4} />}

      {/* Buttons */}
      <HStack spacing={4}>
        <HStack color="blue.500" fontSize="sm" cursor="pointer">
          <Icon as={FaHeart} boxSize={4} />
          <Text>Like</Text>
        </HStack>

        <HStack color="teal.500" fontSize="sm" cursor="pointer">
          <Icon as={FaMessage} boxSize={4} />
          <Text>Comments</Text>
        </HStack>

        <HStack color="red.500" fontSize="sm" cursor="pointer">
          <Icon as={FaFlag} boxSize={4} />
          <Text>Report</Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default PostCard;
