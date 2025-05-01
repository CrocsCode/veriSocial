import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
} from '@chakra-ui/react';
import Modal from './Modal';
import ReportFocus from './ReportFocus';
import { reportListRequest } from '../redux/actionCreators/reportCreators';
import { fetchPostFocusRequest, resetPostFocus } from '../redux/actionCreators/postInteractCreators';

const AdminDataTable = ({
  userId,
  reports,
  loading,
  error,
  reportListRequest,
  fetchPostFocusRequest,
  resetPostFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    reportListRequest();
  }, [reportListRequest]);

  if (loading) {
    return (
      <Box textAlign="center" p={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8}>
        <Text color="red.500">Error loading reports: {error}</Text>
      </Box>
    );
  }

  const handleRowClick = (r) => {
    setSelectedReport(r);
    fetchPostFocusRequest(userId, r.post_id);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetPostFocus();
  };

  return (
    <Box w="80%">
      <Text fontSize="2xl" mb={4} color="purple.700">User Reports</Text>
      <Box borderWidth="1px" borderRadius="md" boxShadow="md" p={2}>
        <TableContainer>
          <Table variant="simple" size="md">
            <Thead bg="purple.100">
              <Tr>
                <Th>ID</Th>
                <Th>Categories</Th>
                <Th>Details</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reports.map((r) => {
                const cats = [
                  r.ai_content && 'AI Content',
                  r.bot_behaviour && 'Bot Behaviour',
                  r.other && 'Other',
                ].filter(Boolean);

                return (
                  <Tr
                    key={r.report_id}
                    _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                    onClick={() => handleRowClick(r)}
                  >
                    <Td>{r.report_id}</Td>
                    <Td>{cats.join(', ')}</Td>
                    <Td>{r.additional_details || '-'}</Td>
                    <Td>{new Date(r.created_at).toLocaleString()}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ReportFocus report={selectedReport} />
      </Modal>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  userId: state.auth.user.user_id,
  reports: state.report.data,
  loading: state.report.loading,
  error: state.report.error,
});

const mapDispatchToProps = {
  reportListRequest,
  fetchPostFocusRequest,
  resetPostFocus,
}

AdminDataTable.propTypes = {
  userId: PropTypes.number.isRequired,
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      report_id: PropTypes.number.isRequired,
      post_id: PropTypes.number.isRequired,
      ai_content: PropTypes.bool.isRequired,
      bot_behaviour: PropTypes.bool.isRequired,
      other: PropTypes.bool.isRequired,
      additional_details: PropTypes.string,
      created_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  reportListRequest: PropTypes.func.isRequired,
  fetchPostFocusRequest: PropTypes.func.isRequired,
  resetPostFocus: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDataTable);
