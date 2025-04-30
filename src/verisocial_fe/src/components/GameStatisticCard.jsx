import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadGameEventListRequest } from "../redux/actionCreators/gameCreators";
import {
  Box,
  Flex,
  Text,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

const GameStatisticCard = ({ events, loadGameEventListRequest }) => {
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      loadGameEventListRequest();
      hasFetched.current = true;
    }
  }, [loadGameEventListRequest]);

  const total = events.length;
  const correctCount = events.filter((e) => e.is_correct).length;
  const wrongCount = total - correctCount;
  const percent = total > 0 ? (correctCount / total) * 100 : 0;

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      w="80%"
      p={6}
    >
      <Box textAlign="center" mb={6}>
        <Text textStyle="h3" mb={2}>Game Statistics</Text>
      </Box>

      {/* Progress circle */}
      <Flex align="center" justify="center">
        <CircularProgress
          value={percent}
          size="120px"
          thickness="8px"
          color="purple.500"
        >
          <CircularProgressLabel>
            {Math.round(percent)}%
          </CircularProgressLabel>
        </CircularProgress>
      </Flex>

      {/* Subtitle */}
      <Box textAlign="center" mt={2} mb={6}>
        <Text fontSize="sm" color="gray.500">
          % of events correct
        </Text>
      </Box>

      {/* Stat counts */}
      <Flex px={8} justify="space-between">
        <Box textAlign="left">
          <Text fontSize="sm" color="gray.500">Correct</Text>
          <Text fontSize="xl" fontWeight="bold">
            {correctCount}
          </Text>
        </Box>
        <Box textAlign="right">
          <Text fontSize="sm" color="gray.500">Wrong</Text>
          <Text fontSize="xl" fontWeight="bold">{wrongCount}</Text>
        </Box>
      </Flex>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  events: state.game.list || [],
});

const mapDispatchToProps = {
  loadGameEventListRequest,
};


GameStatisticCard.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      event_id: PropTypes.number.isRequired,
      user_id: PropTypes.number,
      correct_image_url: PropTypes.string,
      wrong_image_url: PropTypes.string,
      is_correct: PropTypes.bool,
    })
  ).isRequired,
  loadGameEventListRequest: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(GameStatisticCard);
