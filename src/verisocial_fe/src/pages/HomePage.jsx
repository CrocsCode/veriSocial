import React, { useState } from "react";
import { Container, Heading, Box, Button, HStack, Icon, Text } from "@chakra-ui/react";
import { connect } from "react-redux";
import Feed from "../components/Feed";
import PostFocus from "../components/PostFocus";
import { FaArrowLeft } from "react-icons/fa";


function HomePage({ isAuthenticated }) {
  const [selectedPost, setSelectedPost] = useState(null);

  if (!isAuthenticated) {
    return (
      <Box textAlign="center" mt={6}>
        <Heading as="h2" size="lg">
          Please log in to view your feed.
        </Heading>
      </Box>
    );
  }

  return (
    <Container maxW="container.md" h="80vh" p={2}>
      {!selectedPost ? (
        <>
          <Feed onSelectPost={(post) => setSelectedPost(post)} />
        </>
      ) : (
        <Box>
          <HStack
            as="button"
            onClick={() => setSelectedPost(null)}
            cursor="pointer"
            spacing={2}
            mt={4}
            mb={4}
            align="center"
            transition="transform 0.2s ease-in-out"
            _hover={{
              transform: "scale(1.05)",
            }}
          >
            <Icon as={FaArrowLeft} boxSize={4} color="blue.500" />
            <Text color="blue.500" fontWeight="bold">
              Back to Feed
            </Text>
          </HStack>
          <PostFocus post={selectedPost} />
        </Box>
      )}
    </Container>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(HomePage);
