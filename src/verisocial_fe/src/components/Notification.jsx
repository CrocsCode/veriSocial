import { useEffect, useRef } from "react";
import { useToast } from "@chakra-ui/react";
import { connect } from "react-redux";

const Notification = ({ notification }) => {
    const toast = useToast();
    const hasShown = useRef(false);

    useEffect(() => {
        if (notification.message && !hasShown.current) {
            hasShown.current = true;
            toast({
                title: notification.message,
                status: notification.status || "info",
                duration: 3000,
                isClosable: true,
                position: "top",
                onCloseComplete: () => {
                    hasShown.current = false;
                }
            });
        }
    }, [notification, toast]);

    return null;
};

const mapStateToProps = (state) => ({
    notification: state.notification,
});

export default connect(mapStateToProps)(Notification);
