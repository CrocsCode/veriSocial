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
      w="100%"
      textAlign="center"
      minH="30vh"
      position="relative"
    >
      {/* Banner */}
      <Box bg="purple.200" h="30%" w="100%" borderTopRadius="md">
        <Text color="white" fontWeight="bold" pt={2}>
          Banner
        </Text>
      </Box>

      <Flex
        justify="center"
        align="center"
        position="absolute"
        top="30%"
        left="17.5%"
        transform="translate(-50%, -50%)"
        zIndex={2}
      >
        <Avatar
          src="https://via.placeholder.com/150"
          name={user.full_name}
          borderWidth="0.5vh"
          borderColor="white"
          boxSize="7vh"
        />
      </Flex>

      {/* Content */}
      <Box position="relative" textAlign="left" p="5%" pt="15%">
        <HStack spacing={2} mb="2%">
          <Heading as="h3" size="md" noOfLines={1}>
            {user.full_name}
          </Heading>
          <Text fontSize="sm" mb="-1%" color="gray.500">
            {user.username}
          </Text>
        </HStack>

        {/* Bio Box */}
        <Box
          bg="gray.100"
          borderWidth="1px"
          borderRadius="md"
          p={3}
          mb={4}
          textAlign="left"
          minH="10vh"
          mt="1%"
        >
          <Text fontSize="sm" color="gray.600">
            {user.bio}
          </Text>
        </Box>

        {/* Bot Icon */}
        <Box position="absolute" top="0" right="0" p={2}>
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
