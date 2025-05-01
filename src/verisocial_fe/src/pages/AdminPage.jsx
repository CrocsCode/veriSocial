import { Flex } from '@chakra-ui/react';
import AdminCard from '../components/AdminCard';
import AdminDataTable from '../components/AdminDataTable';

const AdminPage = () => {
  return (
    <Flex p={4}>
      <AdminCard />
      <AdminDataTable />
    </Flex>
  );
};

export default AdminPage;
