import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Notification = ({ notification }) => {
    const toast = useToast();

    useEffect(() => {
        if (notification?.message) {
            toast({
                title: notification.message,
                status: notification.status || "info",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    }, [notification, toast]);

    return null;
};

Notification.propTypes = {
    notification: PropTypes.shape({
        message: PropTypes.string,
        status: PropTypes.string,
    }),
};

const mapStateToProps = (state) => ({
    notification: state.notification,
});

export default connect(mapStateToProps)(Notification);
