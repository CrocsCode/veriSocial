import { Box, Text } from '@chakra-ui/react';

const AdminCard = () => {
  return (
    <Box w="30%" pr={4}>
      <Text fontSize="2xl" mb={4}>
        Admin Panel
      </Text>
      <Box bg="gray.50" p={4} borderRadius="md" boxShadow="sm">
        <Text>Details, filters, or additional info can be added here.</Text>
      </Box>
    </Box>
  );
};

export default AdminCard;
