import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Text,
  HStack,
  Input,
  VStack,
  Avatar,
  InputGroup,
  InputRightElement,
  IconButton,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaFlag, FaArrowRight } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

function Comments({ initialComments = [] }) {
  const [localComments, setLocalComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(), // TEMP
      user: "TempUser",
      profileImage: "/path/to/avatar.png", // TEMP
      content: commentText,
      createdAt: new Date().toISOString(),
      liked: false,
      likeCount: 0,
    };

    setLocalComments([...localComments, newComment]);
    setCommentText("");
  };

  const handleCommentLike = (id) => {
    setLocalComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === id) {
          const isLiked = comment.liked || false;
          const count = comment.likeCount || 0;
          return {
            ...comment,
            liked: !isLiked,
            likeCount: isLiked ? count - 1 : count + 1,
          };
        }
        return comment;
      })
    );
  };

  return (
    <Box>
      {/* Comment Input*/}
      <Box as="form" onSubmit={handleCommentSubmit} mb={4}>
        <InputGroup>
          <Input
            placeholder="Add a comment..."
            size="md"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              type="submit"
              variant="ghost"
              aria-label="Send comment"
              icon={<FaArrowRight />}
              size="sm"
            />
          </InputRightElement>
        </InputGroup>
      </Box>

      {/* Comment List */}
      <VStack align="stretch" spacing={4}>
        {localComments.length > 0 ? (
          localComments.map((comment) => {
            const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            });
            return (
              <Box
                key={comment.id}
                px={3}
                bg="transparent"
              >
                <HStack align="start" spacing={3}>
                  <Avatar
                    size="sm"
                    name={comment.user}
                    src={comment.profileImage}
                  />
                  <Box>
                    <HStack spacing={2}>
                      <Text fontWeight="bold">@{comment.user}</Text>
                      <Text color="gray.500" fontSize="xs">
                        {timeAgo}
                      </Text>
                    </HStack>
                    <Text>{comment.content}</Text>
                    <HStack mt={2} spacing={4}>
                      <HStack
                        spacing={1.5}
                        cursor="pointer"
                        onClick={() => handleCommentLike(comment.id)}
                        role="group"
                      >
                        <Icon
                          as={comment.liked ? FaHeart : FaRegHeart}
                          boxSize={4}
                          color={comment.liked ? "red.500" : "blue.500"}
                          transition="transform 0.2s"
                          _groupHover={{ transform: "scale(1.2)" }}
                          _active={{ transform: "scale(0.9)" }}
                        />
                        <Text fontSize="sm" fontWeight={comment.liked ? "bold" : "normal"}>
                          {comment.likeCount || 0}
                        </Text>
                      </HStack>
                      <HStack spacing={1.5} cursor="pointer">
                        <Icon as={FaFlag} boxSize={4} color="red.500" />
                        <Text fontSize="sm">Report</Text>
                      </HStack>
                    </HStack>
                  </Box>
                </HStack>
                <Divider pt={5} borderColor="gray.300" />
              </Box>
            );
          })
        ) : (
          <Text color="gray.500">
            No comments yet. Be the first to comment!
          </Text>
        )}
      </VStack>
    </Box>
  );
}

Comments.propTypes = {
  initialComments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      user: PropTypes.string,
      content: PropTypes.string,
      createdAt: PropTypes.string,
      profileImage: PropTypes.string,
    })
  ),
};

export default Comments;
