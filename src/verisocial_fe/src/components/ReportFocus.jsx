import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Box,
  Text,
  Heading,
  Divider,
  Image,
  Spinner,
  HStack,
  Tooltip,
  Spacer,
  Icon,
} from '@chakra-ui/react';
import { getBotScoreLevel, getFormattedBotScore, botScoreColors } from '../utils/botScore';
import { FaRobot } from "react-icons/fa";

const ReportFocus = ({ report, postFocus, loadingFocus }) => {
  if (!report) {
    return <Text>No report selected.</Text>;
  }

  const categories = [
    report.ai_content && 'AI Content',
    report.bot_behaviour && 'Bot Behaviour',
    report.other && 'Other',
  ].filter(Boolean);

  return (
    <Box p={4} w="40vw" maxH="70vh"
      overflowY="auto"
      sx={{
        "::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}>
      <Text textStyle="h3" pb={3}>Report Details</Text>
      <Text><strong>Report ID:</strong> {report.report_id}</Text>
      <Text><strong>User ID of Reporter:</strong> {report.reportee_id}</Text>
      <Text><strong>Reported ID:</strong> {report.reported_id}</Text>
      <Text><strong>Post ID:</strong> {report.post_id}</Text>
      <Text><strong>Date:</strong> {new Date(report.created_at).toLocaleString()}</Text>

      <Divider my={2} />
      <Text><strong>Categories: </strong>{categories.join(', ')}</Text>

      <Divider my={2} />
      <Heading size="sm" mb={1}>Additional Report Details:</Heading>
      <Text>{report.additional_details || '-'}</Text>

      <Divider my={4} />
      <Heading size="md" mb={2}>Reported Post:</Heading>

      {loadingFocus ? (
        <Spinner size="lg" />
      ) : postFocus ? (
        <Box>
          <HStack align="center" mb={2}>
            <Text>{postFocus['full-name']} (@{postFocus.username})</Text>
            <Spacer />
            <Tooltip
              label={`Bot Score: ${getFormattedBotScore(postFocus['bot-score'])}`}
              hasArrow
            >
              <HStack spacing={1} cursor="default">
                <Icon
                  as={FaRobot}
                  boxSize="1.5rem"
                  color={botScoreColors[getBotScoreLevel(postFocus['bot-score'])]}
                />

                <Text color={botScoreColors[getBotScoreLevel(postFocus['bot-score'])]}>
                  {getBotScoreLevel(postFocus['bot-score'])}
                </Text>
              </HStack>
            </Tooltip>
          </HStack>
          <Text mb={2}>{postFocus.content}</Text>
          {postFocus.base64_image && (
            <Image
              src={postFocus.base64_image}
              alt="Post image"
              borderRadius="md"
            />
          )}
        </Box>
      ) : (
        <Text>No post data available.</Text>
      )}
    </Box>
  );
};

ReportFocus.propTypes = {
  report: PropTypes.shape({
    report_id: PropTypes.number.isRequired,
    reportee_id: PropTypes.number.isRequired,
    reported_id: PropTypes.number.isRequired,
    post_id: PropTypes.number.isRequired,
    ai_content: PropTypes.bool.isRequired,
    bot_behaviour: PropTypes.bool.isRequired,
    other: PropTypes.bool.isRequired,
    additional_details: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }),
  postFocus: PropTypes.shape({
    post_id: PropTypes.number,
    username: PropTypes.string,
    'full-name': PropTypes.string,
    content: PropTypes.string,
    base64_image: PropTypes.string,
    'bot-score': PropTypes.number,
  }),
  loadingFocus: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  postFocus: state.postInteract.postFocus,
  loadingFocus: state.postInteract.loadingFocus,
});

export default connect(mapStateToProps)(ReportFocus);
