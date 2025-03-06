import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Box,
} from "@chakra-ui/react";

const GlobalModal = ({ isOpen, onClose, resetForm, children }) => {
    const handleClose = () => {
        if (resetForm) resetForm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} isCentered>
            <ModalOverlay />
            <ModalContent
                width="auto"
                maxWidth="fit-content"
                minH="auto"
                height="auto"
                boxShadow="lg"
                p={0}
                position="relative"
            >
                <ModalCloseButton position="absolute" top="8px" right="8px" zIndex="10" />
                <Box w="100%" h="100%">
                    {children}
                </Box>
            </ModalContent>
        </Modal>
    );
};

export default GlobalModal;
