import { useEffect, useRef } from "react";
import { Box, Avatar, Heading, Text, Flex, HStack, Icon, Tooltip } from "@chakra-ui/react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { userRequest } from "../redux/actionCreators/authCreators";
import { FaRobot } from "react-icons/fa";
import { getBotScoreLevel, getFormattedBotScore, botScoreColors } from "../utils/botScore";

const ProfileCard = ({ user, userRequest }) => {
  const hasFetchedUser = useRef(false);

  useEffect(() => {
    if (!hasFetchedUser.current && user && user.user_id) {
      userRequest(user.user_id);
      hasFetchedUser.current = true;
    }
  }, [user, userRequest]);

  const botScore = user.bot_score;
  const botScoreLevel = getBotScoreLevel(botScore);
  const formattedBotScore = getFormattedBotScore(botScore);

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      w="80%"
      textAlign="center"
      minH="30vh"
      position="relative"
    >
      {/* Banner */}
      <Box bg="purple.200" h="40%" w="100%" borderTopRadius="md">
        <Text color="white" fontWeight="bold" pt={2}>
          Banner
        </Text>
      </Box>

      <Flex
        justify="center"
        align="center"
        position="absolute"
        top="40%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={2}
      >
        <Avatar
          name={user.full_name}
          borderWidth="0.5vh"
          borderColor="white"
          boxSize="10vh"
        />
      </Flex>

      {/* Content */}
      <Box position="relative" textAlign="center" p="5%" pt="17.5%">
        <Heading as="h3" size="md" noOfLines={1} fontSize="1.75vh" mb="2%">
          {user.full_name}
        </Heading>
        <Text fontSize="sm" color="gray.500" mb="2%">
          @{user.username}
        </Text>
        <Tooltip
          label={`Bot Score: (${formattedBotScore})`}
          placement="top"
          hasArrow
          fontSize="1vh"
        >
          <HStack spacing={1} justify="center" pt="2vh">
            <Text color={botScoreColors[botScoreLevel]}></Text>
            <Icon as={FaRobot} boxSize="3.5rem" color={botScoreColors[botScoreLevel]} />
          </HStack>
        </Tooltip>
      </Box>
    </Box>
  );
};

ProfileCard.propTypes = {
  user: PropTypes.shape({
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    full_name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    bio: PropTypes.string,
    bot_score: PropTypes.number,
  }).isRequired,
  userRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = { userRequest };

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCard);
