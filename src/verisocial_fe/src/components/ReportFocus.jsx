import PropTypes from 'prop-types';
import { Box, Text, Heading, Divider } from '@chakra-ui/react';

const ReportFocus = ({ report }) => {
  if (!report) {
    return <Text>No report selected.</Text>;
  }

  return (
    <Box p={4}>
      <Heading size="md" mb={2}>Report Details</Heading>
      <Text><strong>ID:</strong> {report.id}</Text>
      <Text><strong>Reporter:</strong> {report.reporter}</Text>
      <Text><strong>Date:</strong> {report.date}</Text>
      <Text><strong>Status:</strong> {report.status}</Text>
      
      <Divider my={2} />
      <Heading size="sm" mb={2}>Categories</Heading>
      <Text>{report.categories.join(', ')}</Text>
      
      <Divider my={2} />
      <Heading size="sm" mb={2}>Additional Details</Heading>
      <Text>{report.additionalDetails}</Text>
      
      <Divider my={2} />
      <Heading size="sm" mb={2}>Post Details</Heading>
      <Text><strong>Post ID:</strong> {report.post.post_id}</Text>
      <Text><strong>Username:</strong> {report.post.username}</Text>
      <Text><strong>Full Name:</strong> {report.post["full-name"]}</Text>
      <Text><strong>Content:</strong> {report.post.content}</Text>
    </Box>
  );
};

ReportFocus.propTypes = {
  report: PropTypes.object,
};

export default ReportFocus;
