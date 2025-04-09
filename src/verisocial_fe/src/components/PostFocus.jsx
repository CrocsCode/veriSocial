import { useEffect, useState } from "react";
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
  Tooltip,
  Spacer,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaFlag, FaRobot } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { isValid, format } from "date-fns";
import Comments from "./Comments";
import Modal from "./Modal";
import ReportForm from "./ReportForm";
import { likePostRequest } from "../redux/actionCreators/postInteractCreators";
import { getBotScoreLevel, getFormattedBotScore, botScoreColors } from "../utils/botScore";

const formatBase64Image = (base64) => {
  if (!base64) return null;
  return base64.startsWith("data:image")
    ? base64
    : `data:image/jpeg;base64,${base64}`;
};

const PostFocus = ({ post, loadingFocus, likePostRequest }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isReportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (post) {
      setLikeCount(post["likes-count"] ?? 0);
      setIsLiked(!!post["is-liked"]);
    }
  }, [post]);

  if (loadingFocus) {
    return <Box p="5" borderRadius="md" bg="purple.50" textAlign="center">Loading post...</Box>;
  }

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
    "bot-score": botScore,
    post_id: postId,
    "comment-count": commentCount,
  } = post;

  const imageSrc = formatBase64Image(base64Image);
  const date = new Date(createdAt);
  const exactTimestamp = isValid(date)
  ? format(date, 'MMM dd, yyyy HH:mm')
    : "Unknown time";

  const postBotScoreLevel = getBotScoreLevel(botScore);
  const formattedPostBotScore = getFormattedBotScore(botScore);

  const userBotScore = post["user_bot_score"];
  const userBotScoreLevel = getBotScoreLevel(userBotScore);

  const handleLikeClick = (e) => {
    e.stopPropagation();

    // Optimistic UI update
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }

    if (postId) {
      likePostRequest(postId);
    }
  };

  const handleReportClick = (e) => {
    e.stopPropagation();
    setReportOpen(true);
  };

  return (
    <>
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
              <Tooltip
                label={`User Bot Score: ${
                  userBotScore != null ? userBotScore.toFixed(3) : "N/A"
                }`}
                placement="top"
                hasArrow
              >
                <Avatar
                  name={fullName}
                  size="lg"
                  borderWidth="0.3vh"
                  borderStyle="solid"
                  borderColor={botScoreColors[userBotScoreLevel]}
                />
              </Tooltip>
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
              {exactTimestamp}
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
            {/* Like */}
            <HStack spacing={1.5} cursor="pointer" onClick={handleLikeClick} role="group">
              <Icon
                as={isLiked ? FaHeart : FaRegHeart}
                boxSize={4}
                color={isLiked ? "red.500" : "blue.500"}
                transition="transform 0.2s"
                _groupHover={{ transform: "scale(1.2)" }}
                _groupActive={{ transform: "scale(0.9)" }}
              />
              <Text fontWeight={isLiked ? "bold" : "normal"}>{likeCount}</Text>
            </HStack>

            {/* Reply */}
            <HStack color="teal.500" fontSize="sm" cursor="pointer">
              <Icon as={FaMessage} boxSize={4} />
              <Text fontWeight="bold">{commentCount}</Text>
            </HStack>

            {/* Report */}
            <HStack
              color="red.500"
              fontSize="sm"
              cursor="pointer"
              onClick={handleReportClick}
              role="group"
            >
              <Icon
                as={FaFlag}
                boxSize={4}
                transition="transform 0.2s"
                _groupHover={{ transform: "scale(1.2)" }}
                _groupActive={{ transform: "scale(0.9)", color: "red.700" }}
              />
            </HStack>

            <Spacer />

            {/* Bot Score */}
            <Tooltip
              label={`Bot Score: (${formattedPostBotScore})`}
              placement="top"
              hasArrow
              fontSize="1vh"
            >
              <HStack spacing={1} cursor="default">
                <Icon
                  as={FaRobot}
                  boxSize="1.5rem"
                  color={botScoreColors[postBotScoreLevel]}
                />
                <Text color={botScoreColors[postBotScoreLevel]}>
                  {postBotScoreLevel}
                </Text>
              </HStack>
            </Tooltip>
          </HStack>
        </Box>

        <Divider my={2} borderColor="gray.300" />

        {/* Comments Section */}
        <Box mt={6}>
          <Heading as="h4" size="md" mb={4} color="purple.600" fontWeight="bold">
            Comments
          </Heading>
          <Comments initialComments={comments || []} postFocusId={post.post_id} />
        </Box>
      </Box>

      {isReportOpen && (
        <Modal isOpen={isReportOpen} onClose={() => setReportOpen(false)}>
          <ReportForm onClose={() => setReportOpen(false)} />
        </Modal>
      )}
    </>
  );
};

PostFocus.propTypes = {
  post: PropTypes.shape({
    post_id: PropTypes.number,
    base64_image: PropTypes.string,
    "created-at": PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    "full-name": PropTypes.string,
    username: PropTypes.string,
    content: PropTypes.string,
    "bot-score": PropTypes.number,
    "likes-count": PropTypes.number,
    "is-liked": PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    comments: PropTypes.array,
    "comment-count": PropTypes.number,
    "user_bot_score": PropTypes.number,
  }),
  loadingFocus: PropTypes.bool,
  likePostRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.postInteract.postFocus,
  loadingFocus: state.postInteract.loadingFocus,
});

const mapDispatchToProps = {
  likePostRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostFocus);
