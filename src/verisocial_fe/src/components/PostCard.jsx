import { useState } from "react";
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
import PropTypes from "prop-types";
import { formatDistanceToNowStrict } from "date-fns";

const getRelativeTime = (timestamp) =>
  `${formatDistanceToNowStrict(new Date(timestamp))} ago`;

const formatBase64Image = (base64) => {
  if (!base64) return null;
  return base64.startsWith("data:image") ? base64 : `data:image/jpeg;base64,${base64}`;
};

const PostCard = ({ post, onClick }) => {
  const imageSrc = formatBase64Image(post.base64_image);
  const initialLikes = post.likeCount !== undefined ? post.likeCount : Math.floor(Math.random() * 100); // TEMP
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  // Bot Score Display and Levels
  const botScore = post["bot-score"];
  const botScoreLevel = botScore != null ? Math.max(1, Math.ceil(botScore * 5)) : 1;
  const formattedBotScore = botScore != null ? botScore.toFixed(3) : "N/A";

  const botScoreColors = {
    1: "#7ABD7E",
    2: "#b6d7a8",
    3: "#F8D66D",
    4: "#FFB54C",
    5: "#e06666",
  };

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
      _hover={{ bg: "purple.100" }}
      minH="5vh"
    >
      {/* Timestamp */}
      <Box position="absolute" top={2} right={4} fontSize="xs" color="gray.400">
        {getRelativeTime(post["created-at"])}
      </Box>

      {/* User Info */}
      <HStack align="top" mb={4}>
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
          <Text>Comments</Text>
        </HStack>

        <HStack color="red.500" fontSize="sm" cursor="pointer">
          <Icon as={FaFlag} boxSize={4} />
          <Text>Report</Text>
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
            <Text color={botScoreColors[botScoreLevel]}>
              {botScoreLevel}
            </Text>
          </HStack>
        </Tooltip>
      </Box>
    </Box>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    base64_image: PropTypes.string,
    likeCount: PropTypes.number,
    "created-at": PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    "full-name": PropTypes.string,
    username: PropTypes.string,
    content: PropTypes.string,
    "bot-score": PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PostCard;
