import React, { useState } from 'react';
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
  Button,
  HStack,
} from '@chakra-ui/react';
import Modal from '../components/Modal';
import ReportFocus from '../components/ReportFocus';

const samplePost = {
  post_id: 10,
  "user-id": 1,
  username: '@joaquinescober',
  "full-name": 'Joaquin Escober',
  content: 'AI Art Test',
};

// Dummy reports
const dummyReports = [
  {
    id: 1,
    reporter: 'User123',
    post: samplePost,
    categories: ['AI Content', 'Spam'],
    additionalDetails: 'They keep posting the same AI art repeatedly.',
    date: '2025-03-25',
    status: 'Pending',
  },
  {
    id: 2,
    reporter: 'User456',
    post: samplePost,
    categories: ['Bot Behaviour'],
    additionalDetails: 'Seems automated. Replies instantly to every comment.',
    date: '2025-03-26',
    status: 'Pending',
  },
  {
    id: 3,
    reporter: 'User789',
    post: samplePost,
    categories: ['Harassment', 'Inappropriate Content'],
    additionalDetails: 'Uses offensive language in the comments.',
    date: '2025-03-27',
    status: 'Reviewed',
  },
];

const AdminDataTable = () => {
  const rowsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(dummyReports.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentReports = dummyReports.slice(startIndex, endIndex);

  const emptyRowsCount = rowsPerPage - currentReports.length;
  const emptyRows = Array.from({ length: emptyRowsCount });

  const [isReportOpen, setReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleRowClick = (report) => {
    setSelectedReport(report);
    setReportOpen(true);
    console.log('Report:', report);
    console.log('Corresponding Post:', report.post);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <Box w="70%">
      <Text fontSize="2xl" mb={4}>
        User Reports
      </Text>
      <Box
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        p={2}

        minH="600px"
      >
        <TableContainer height="100%">
          <Table variant="simple" size="md">
            <Thead bg="gray.200">
              <Tr>
                <Th>ID</Th>
                <Th>Reporter</Th>
                <Th>Categories</Th>
                <Th>Additional Details</Th>
                <Th>Date</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentReports.map((report) => (
                <Tr
                  key={report.id}
                  _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                  onClick={() => handleRowClick(report)}
                >
                  <Td>{report.id}</Td>
                  <Td>{report.reporter}</Td>
                  <Td>{report.categories.join(', ')}</Td>
                  <Td>{report.additionalDetails}</Td>
                  <Td>{report.date}</Td>
                  <Td>{report.status}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box mt={4} p={2} borderTop="1px solid" borderColor="gray.200">
          <HStack spacing={4} justify="space-between">
            <Button onClick={handlePrevPage} disabled={currentPage === 1}>
              Prev
            </Button>
            <Text>
              Page {currentPage} of {totalPages}
            </Text>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </Button>
          </HStack>
        </Box>
      </Box>

      {/* Modal ReportFocus*/}
      <Modal isOpen={isReportOpen} onClose={() => setReportOpen(false)}>
        <ReportFocus report={selectedReport} />
      </Modal>
    </Box>
  );
};

export default AdminDataTable;
