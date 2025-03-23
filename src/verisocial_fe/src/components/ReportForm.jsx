import { useState } from "react";
import PropTypes from "prop-types";
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

const ReportForm = ({ onClose }) => {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  // TEMP SUBMIT FUNCTIONALITY
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedReasons.length === 0) {
      setError("select at least one reason.");
      return;
    }
    console.log("Report submitted:", selectedReasons, "Details:", details);
    onClose();
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Report Post
      </Heading>
      <FormControl id="reason" mb={4} isInvalid={error !== ""}>
        <FormLabel>Reason</FormLabel>
        <Box p={3} pr="10vw" bg="gray.100" borderRadius="md">
          <CheckboxGroup
            value={selectedReasons}
            onChange={(values) => {
              setSelectedReasons(values);
              if (values.length > 0) setError("");
            }}
          >
            <VStack align="start">
              <Checkbox value="ai" borderColor="black" colorScheme="purple">AI Content</Checkbox>
              <Checkbox value="bot" borderColor="black" colorScheme="purple">Bot Behaviour</Checkbox>
              <Checkbox value="advertisement" borderColor="black" colorScheme="purple">Advertisement</Checkbox>
              <Checkbox value="spam" borderColor="black" colorScheme="purple">Spam</Checkbox>
              <Checkbox value="harassment" borderColor="black" colorScheme="purple">Harassment</Checkbox>
              <Checkbox value="inappropriate" borderColor="black" colorScheme="purple">Inappropriate Content</Checkbox>
              <Checkbox value="other" borderColor="black" colorScheme="purple">Other</Checkbox>
            </VStack>
          </CheckboxGroup>
        </Box>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
      <FormControl id="details" mb={4}>
        <FormLabel>Additional Details (optional)</FormLabel>
        <Textarea
          placeholder="Provide more details..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          resize="none"
        />
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
  onClose: PropTypes.func.isRequired,
};

export default ReportForm;
