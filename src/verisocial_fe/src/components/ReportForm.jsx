import { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Heading,
  Checkbox,
  CheckboxGroup,
  VStack,
} from "@chakra-ui/react";
import { reportPostRequest } from "../redux/actionCreators/reportCreators";
import { showNotificationRequest } from "../redux/actionCreators/notificationCreators";
import T from "../constants/text";

const ReportForm = ({ postId, onClose, reportPostRequest, showNotificationRequest }) => {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [details, setDetails] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedReasons.length === 0) {
      showNotificationRequest(T.REPORT.FORM.SELECT_ERROR_NOTIFICATION);
      setReasonError(T.REPORT.FORM.SELECT_ERROR_DISPLAY);
      return;
    }

    if (selectedReasons.includes("other") && details.trim() === "") {
      showNotificationRequest(T.REPORT.FORM.OTHER_DETAILS_ERROR_NOTIFICATION);
      setDetailsError(T.REPORT.FORM.OTHER_DETAILS_ERROR_DISPLAY);
      return;
    }

    const reportPayload = {
      post_id: postId,
      ai_content: selectedReasons.includes("ai"),
      bot_behaviour: selectedReasons.includes("bot"),
      other: selectedReasons.includes("other"),
      additional_details: details.trim(),
    };

    reportPostRequest(reportPayload);
    onClose();
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={6}>
      <Heading as="h2" size="lg" mb={4} color="purple.700">
        Report Post
      </Heading>

      <FormControl id="reason" mb={4} isInvalid={!!reasonError}>
        <FormLabel>Reason</FormLabel>
        <Box p={3} pr="10vw" bg="gray.100" borderRadius="md">
          <CheckboxGroup
            value={selectedReasons}
            onChange={(values) => {
              setSelectedReasons(values);
              if (values.length > 0) setReasonError("");
            }}
          >
            <VStack align="start">
              <Checkbox value="ai" borderColor="black" colorScheme="purple">AI Content</Checkbox>
              <Checkbox value="bot" borderColor="black" colorScheme="purple">Bot Behaviour</Checkbox>
              <Checkbox value="other" borderColor="black" colorScheme="purple">Other</Checkbox>
            </VStack>
          </CheckboxGroup>
        </Box>
        {reasonError && <FormErrorMessage>{reasonError}</FormErrorMessage>}
      </FormControl>

      <FormControl id="details" mb={4} isInvalid={!!detailsError}>
        <FormLabel>
          Additional Details{" "}
          {selectedReasons.includes("other") ? "(required)" : "(optional)"}
        </FormLabel>
        <Textarea
          placeholder="Provide more details..."
          value={details}
          onChange={(e) => {
            setDetails(e.target.value);
            if (e.target.value.trim() !== "") setDetailsError("");
          }}
          resize="none"
        />
        {detailsError && <FormErrorMessage>{detailsError}</FormErrorMessage>}
      </FormControl>

      <Button type="submit" colorScheme="red" mr={2}>
        Submit Report
      </Button>
      <Button variant="outline" colorScheme="purple" onClick={onClose}>
        Cancel
      </Button>
    </Box>
  );
};

ReportForm.propTypes = {
  postId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  reportPostRequest: PropTypes.func.isRequired,
  showNotificationRequest: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  reportPostRequest,
  showNotificationRequest,
};

export default connect(null, mapDispatchToProps)(ReportForm);
