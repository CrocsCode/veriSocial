import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Box,
  Heading,
  Text,
  Image,
  Avatar,
  HStack,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaFlag, FaRobot } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { formatDistanceToNowStrict } from "date-fns";
import Modal from "./Modal";
import ReportForm from "./ReportForm";
import { likePostRequest } from "../redux/actionCreators/postInteractCreators";
import { getBotScoreLevel, getFormattedBotScore, botScoreColors } from "../utils/botScore";

const getRelativeTime = (timestamp) =>
  `${formatDistanceToNowStrict(new Date(timestamp))} ago`;

const PostCard = ({ post, onClick, likePostRequest }) => {
  const [likeCount, setLikeCount] = useState(post["likes-count"] !== undefined ? post["likes-count"] : 0);
  const [isLiked, setIsLiked] = useState(post["is-liked"] != null ? post["is-liked"] : 0);
  const [isReportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    setLikeCount(post["likes-count"] ?? 0);
    setIsLiked(post["is-liked"] != null ? post["is-liked"] : 0);
  }, [post]);

  const imageSrc = post.base64_image;

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (isLiked === 1) {
      setIsLiked(0);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(1);
      setLikeCount((prev) => prev + 1);
    }
    likePostRequest(post.post_id);
  };

  const handleReportClick = (e) => {
    e.stopPropagation();
    setReportOpen(true);
  };

  // Bot Score Display and Levels
  const botScore = post["bot-score"];
  const botScoreLevel = getBotScoreLevel(botScore);
  const formattedBotScore = getFormattedBotScore(botScore);
  const userBotScore = post["user_bot_score"];
  const userBotScoreLevel = getBotScoreLevel(userBotScore);

  return (
    <>
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
        minH="5vh"
      >
        {/* Timestamp */}
        <Box position="absolute" top={2} right={4} fontSize="xs" color="gray.400">
          {getRelativeTime(post["created-at"])}
        </Box>

        {/* User Info */}
        <HStack align="top" mb={4}>
          <Tooltip
            label={`User Bot Score: ${userBotScore != null ? userBotScore.toFixed(3) : "N/A"}`}
            placement="top"
            hasArrow
          >
            <Avatar
              name={post["full-name"]}
              size="md"
              borderWidth="0.3vh"
              borderStyle="solid"
              borderColor={botScoreColors[userBotScoreLevel]}
            />
          </Tooltip>
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
        {imageSrc && (
          <Image src={imageSrc} alt="Post content" borderRadius="md" mb={4} />
        )}

        {/* Buttons */}
        <HStack spacing={4}>
          <HStack spacing={1.5} cursor="pointer" onClick={handleLikeClick} role="group">
            <Icon
              as={isLiked === 1 ? FaHeart : FaRegHeart}
              boxSize={4}
              color={isLiked === 1 ? "red.500" : "blue.500"}
              transition="transform 0.2s"
              _groupHover={{ transform: "scale(1.2)" }}
              _groupActive={{ transform: "scale(0.9)" }}
            />
            <Text fontWeight={isLiked === 1 ? "bold" : "normal"}>{likeCount}</Text>
          </HStack>

          <HStack color="teal.500" fontSize="sm" cursor="pointer">
            <Icon as={FaMessage} boxSize={4} />
          </HStack>

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
        </HStack>

        {/* Bot Score Icon */}
        <Box position="absolute" bottom={4} right={4}>
          <Tooltip
            label={`Bot Score: (${formattedBotScore})`}
            placement="top"
            hasArrow
            fontSize="1vh"
          >
            <HStack spacing={1}>
              <Icon as={FaRobot} boxSize="1.5rem" color={botScoreColors[botScoreLevel]} />
              <Text color={botScoreColors[botScoreLevel]}>{botScoreLevel}</Text>
            </HStack>
          </Tooltip>
        </Box>
      </Box>

      {isReportOpen && (
        <Modal isOpen={isReportOpen} onClose={() => setReportOpen(false)}>
          <ReportForm postId={post.post_id} onClose={() => setReportOpen(false)} />
        </Modal>
      )}
    </>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    base64_image: PropTypes.string,
    "likes-count": PropTypes.number,
    "created-at": PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    "full-name": PropTypes.string,
    username: PropTypes.string,
    content: PropTypes.string,
    "bot-score": PropTypes.number,
    "is-liked": PropTypes.number,
    post_id: PropTypes.number,
    "user_bot_score": PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  likePostRequest: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  likePostRequest,
};

export default connect(null, mapDispatchToProps)(PostCard);
