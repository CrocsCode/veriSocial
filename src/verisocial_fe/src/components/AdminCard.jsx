import { Box, Text } from '@chakra-ui/react';

const AdminCard = () => {
  return (
    <Box w="30%" pr={4}>
      <Text fontSize="2xl" mb={4} color="purple.700">Admin Panel</Text>
      <Box bg="purple.100" p={4} borderRadius="md" boxShadow="sm">
        <Text>List of Reports</Text>
      </Box>
    </Box>
  );
};

export default AdminCard;
