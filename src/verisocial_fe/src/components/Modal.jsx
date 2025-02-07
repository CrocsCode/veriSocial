import React from "react";
import { connect } from "react-redux";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import { closeModalRequest } from "../redux/actionCreators/modalCreators";
import { resetCreatePostForm } from "../redux/actionCreators/createPostActionCreators";

const GlobalModal = ({ isOpen, closeModalRequest, resetCreatePostForm, children }) => {
    const handleClose = () => {
        resetCreatePostForm();
        closeModalRequest();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} isCentered>
            <ModalOverlay />
            <ModalContent width="auto" maxWidth="fit-content" minH="auto" height="auto" p={4}>
                <ModalCloseButton />
                <ModalBody>{children}</ModalBody>
            </ModalContent>
        </Modal>
    );
};

const mapStateToProps = (state) => ({
    isOpen: state.modal.isOpen,
});

const mapDispatchToProps = {
    closeModalRequest,
    resetCreatePostForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalModal);
