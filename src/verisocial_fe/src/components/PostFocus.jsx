import { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Box,
  Heading,
  Text,
  Avatar,
  HStack,
  Icon,
  Divider,
  Image,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaFlag } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import Comments from "./Comments";

const formatBase64Image = (base64) => {
  if (!base64) return null;
  return base64.startsWith("data:image")
    ? base64
    : `data:image/jpeg;base64,${base64}`;
};

const PostFocus = ({ post = null }) => {
  // Create an initial likes value - IF post is null.
  const initialLikesComputed =
    post?.likeCount ?? Math.floor(Math.random() * 100);
  const [likeCount, setLikeCount] = useState(initialLikesComputed);
  const [isLiked, setIsLiked] = useState(false);

  if (!post) {
    return (
      <Box textAlign="center" mt={6}>
        <Heading as="h2" size="lg" color="gray.500">
          No post selected.
        </Heading>
      </Box>
    );
  }

  const {
    base64_image: base64Image,
    "created-at": createdAt,
    "full-name": fullName,
    username,
    content,
    comments,
  } = post;

  const imageSrc = formatBase64Image(base64Image);
  const readableTimestamp = new Date(createdAt).toLocaleString();

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <Box
      p="5"
      borderRadius="md"
      bg="purple.50"
      h="70vh"
      w="40vw"
      overflowY="auto"
      sx={{
        "::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {/* User Info */}
      <Box mb={4}>
        <HStack justifyContent="space-between">
          <HStack>
            <Avatar name={fullName} size="lg" />
            <Box>
              <Heading as="h3" size="md">
                {fullName}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                @{username}
              </Text>
            </Box>
          </HStack>
          <Text fontSize="sm" color="gray.400">
            {readableTimestamp}
          </Text>
        </HStack>
      </Box>

      {/* Post Content */}
      <Box mb={4}>
        <Text mb={4}>{content}</Text>
        {imageSrc && (
          <Image src={imageSrc} alt="Post content" borderRadius="md" mb={4} />
        )}
      </Box>

      {/* Buttons */}
      <Box mb={4}>
        <HStack spacing={4} mb={4}>
        <HStack spacing={1.5} cursor="pointer" onClick={handleLikeClick} role="group">
            <Icon
              as={isLiked ? FaHeart : FaRegHeart}
              boxSize={4}
              color={isLiked ? "red.500" : "blue.500"}
              transition="transform 0.2s"
              _groupHover={{ transform: "scale(1.2)" }}
              _active={{ transform: "scale(0.9)" }}
            />
            <Text fontWeight={isLiked ? "bold" : "normal"}>{likeCount}</Text>
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
      </Box>

      <Divider my={2} borderColor="gray.300" />

      {/* Comments */}
      <Box mt={6}>
        <Heading as="h4" size="md" mb={4} color="purple.600" fontWeight="bold">
          Comments
        </Heading>
        <Comments initialComments={comments || []} />
      </Box>
    </Box>
  );
}

PostFocus.propTypes = {
  post: PropTypes.shape({
    base64_image: PropTypes.string,
    "created-at": PropTypes.string,
    likeCount: PropTypes.number,
    "full-name": PropTypes.string,
    username: PropTypes.string,
    content: PropTypes.string,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        user: PropTypes.string,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        profileImage: PropTypes.string,
      })
    ),
  }),
};

export default connect()(PostFocus);
