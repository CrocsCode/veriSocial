import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import {
  Box,
  Text,
  Textarea,
  Button,
  IconButton,
  VStack,
  HStack,
  Image,
  CloseButton,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { FaImages } from "react-icons/fa";
import { updateCreatePostForm, submitCreatePostFormRequest, resetCreatePostForm } from "../redux/actionCreators/createPostActionCreators";
import T from "../constants/text";

const CreatePostForm = ({ postText = "", image, updateCreatePostForm, submitCreatePostFormRequest, resetCreatePostForm,
  onClose,
  isLoading,
  isSuccess
}) => {
  const [localText, setLocalText] = useState(postText);
  const debounceTimeout = useRef(null);

  const handleInputChange = (e) => {
    setLocalText(e.target.value);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      updateCreatePostForm("postText", e.target.value);
    }, 300);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        updateCreatePostForm("image", reader.result);
      };
    }
  };

  const handleSubmit = () => {
    submitCreatePostFormRequest();
  };

  useEffect(() => {
    if (isSuccess) {
      resetCreatePostForm();
      onClose();
    }
  }, [isSuccess, resetCreatePostForm, onClose]);

  return (
    <Box bg="white" w="30vw" minH="40vh" pt="2vh" p="5" borderRadius="md">
      <VStack spacing={4} align="stretch">
        <Text textAlign="left" textStyle="h3">
          Create a New Post
        </Text>

        {/* Text Input */}
        <Textarea
          placeholder={T.FORM.POST.PLACEHOLDER}
          value={localText}
          onChange={handleInputChange}
          size="lg"
          resize="none"
          h="30vh"
          focusBorderColor="purple.500"
          isDisabled={isLoading}
        />

        {/* Image Preview */}
        {image && (
          <Box position="relative">
            <Image src={image} alt="Uploaded" borderRadius="md" />
            <CloseButton
              position="absolute"
              top={1}
              right={1}
              onClick={() => updateCreatePostForm("image", null)}
              bg="white"
              isDisabled={isLoading}
            />
          </Box>
        )}

        {/* Image Upload */}
        <HStack spacing={3}>
          <label htmlFor="image-upload">
            <IconButton
              as="span"
              icon={<FaImages />}
              aria-label="Upload Image"
              size="lg"
              variant="ghost"
              colorScheme="purple"
              isDisabled={isLoading}
            />
          </label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </HStack>

        {/* Submit / Cancel */}
        <HStack justify="space-between">
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isDisabled={!localText.trim() || isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : "Post"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              resetCreatePostForm();
              onClose();
            }}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  postText: state.createPost.postText || "",
  image: state.createPost.image || null,
  isLoading: state.createPost.isLoading,
  isSuccess: state.createPost.isSuccess,
});

const mapDispatchToProps = {
  updateCreatePostForm,
  submitCreatePostFormRequest,
  resetCreatePostForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostForm);
