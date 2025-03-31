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
import { formatDistanceToNowStrict } from "date-fns";
import { connect } from "react-redux";
import { likePostRequest, createCommentRequest } from "../redux/actionCreators/postInteractCreators";

function Comments({ initialComments = [], postFocusId, likePostRequest, createCommentRequest }) {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const content = commentText;
    createCommentRequest({ post_id: postFocusId, content });

    setCommentText("");
  };

  const handleCommentLike = (comment) => {
    likePostRequest(comment.postId, comment.id);
  };

  return (
    <Box>
      {/* Comment Input */}
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
        {initialComments.length > 0 ? (
          initialComments.map((comment) => {
            const timeAgo = formatDistanceToNowStrict(new Date(comment.createdAt), {
              addSuffix: true,
            });
            return (
              <Box key={comment.id} px={3} bg="transparent">
                <HStack align="start" spacing={3}>
                  <Avatar size="sm" name={comment.user} src={comment.profileImage} />
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
                        onClick={() => handleCommentLike(comment)}
                        role="group"
                      >
                        <Icon
                          as={comment.liked ? FaHeart : FaRegHeart}
                          boxSize={4}
                          color={comment.liked ? "red.500" : "blue.500"}
                          transition="transform 0.2s"
                          _groupHover={{ transform: "scale(1.2)" }}
                          _groupActive={{ transform: "scale(0.9)" }}
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
          <Text color="gray.500">No comments yet. Be the first to comment!</Text>
        )}
      </VStack>
    </Box>
  );
}

Comments.propTypes = {
  initialComments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      user: PropTypes.string,
      content: PropTypes.string,
      createdAt: PropTypes.string,
      profileImage: PropTypes.string,
      liked: PropTypes.bool,
      likeCount: PropTypes.number,
    })
  ),
  likePostRequest: PropTypes.func.isRequired,
  createCommentRequest: PropTypes.func.isRequired,
  postFocusId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => {
  const rawComments = state.postInteract.comments || [];
  const initialComments = rawComments.map((comment) => ({
    id: comment["comment-id"],
    postId: comment.post_id,
    user: comment.username,
    content: comment.content,
    createdAt: comment["created-at"],
    profileImage: "",
    liked: comment["is-liked"] === 1,
    likeCount: comment["likes-count"],
  }));

  return { initialComments };
};

const mapDispatchToProps = {
  likePostRequest,
  createCommentRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
