import React, { useState } from "react";
import { Container, Heading, Box, Button } from "@chakra-ui/react";
import { connect } from "react-redux";
import Feed from "../components/Feed";
import PostFocus from "../components/PostFocus";


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
          <Button
            colorScheme="blue"
            mb={4}
            onClick={() => setSelectedPost(null)}
          >
            Back to Feed
          </Button>
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
