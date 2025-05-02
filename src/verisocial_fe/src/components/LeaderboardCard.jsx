import { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadLeaderboardListRequest } from "../redux/actionCreators/gameCreators";
import { Box, Avatar, Text, VStack, HStack } from "@chakra-ui/react";

const BAR_MAX_HEIGHT = 12; // IN VH
const shadeByPosition = {
  1: "purple.600",
  2: "purple.400",
  3: "purple.200",
};

const LeaderboardCard = ({ leaderboardList, userRank, loadLeaderboardListRequest }) => {
  useEffect(() => {
    loadLeaderboardListRequest();
  }, [loadLeaderboardListRequest]);

  const topThree = [...leaderboardList]
    .sort((a, b) => a.position - b.position).slice(0, 3);

  const maxCount = topThree.length
    ? Math.max(...topThree.map((u) => u.correct_count)) : 1;

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderRadius="md"
      p="4%"
      boxShadow="md"
      w="85%"
      textAlign="center"
      h="35vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Text textStyle="h3" mb={2} pb={2}>
        Leaderboard
      </Text>

      <HStack justify="center" align="flex-end" spacing="4%" h="100%">
        {topThree.map(({ position, username, correct_count }) => {
          const barHeight = (correct_count / maxCount) * BAR_MAX_HEIGHT;
          const bg = shadeByPosition[position] || "purple.200";
          return (
            <VStack key={position} spacing={1}>
              <Avatar
                size="md"
                name={`${username}`}
                borderWidth="2px"
                borderColor="white"
                bg={bg}
                mb="-20px"
                zIndex={2}
              />
              <Box
                bg={bg}
                w="50px"
                h={`${barHeight}vh`}
                borderRadius="md"
                display="flex"
                justifyContent="center"
                alignItems="center"
                color="white"
              >
              </Box>
              <Text fontWeight="bold">{username}</Text>
              <Text color="purple.400" fontSize="1.5vh">{correct_count}</Text>
            </VStack>
          );
        })}
      </HStack>

      <Box textAlign="center" mt={2}>
        <Text fontSize="sm" color="gray.500" pt={2}>Your rank:</Text>
        <Text fontSize="lg" fontWeight="bold">{userRank ? `#${userRank.position}` : "N/A"}</Text>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  const data = state.game.errorLeaderboard || {};
  return {
    leaderboardList: Array.isArray(data.leaderboard) ? data.leaderboard : [],
    userRank: data.user_rank || null,
  };
};

const mapDispatchToProps = {
  loadLeaderboardListRequest,
};

LeaderboardCard.propTypes = {
  leaderboardList: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.number.isRequired,
      correct_count: PropTypes.number.isRequired,
      user_id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    })
  ).isRequired,
  userRank: PropTypes.shape({
    position: PropTypes.number.isRequired,
    correct_count: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
  }),
  loadLeaderboardListRequest: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardCard);
