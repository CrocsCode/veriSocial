import { Button, Box } from "@chakra-ui/react"
import Layout from "../styles/layout"
import { connect } from "react-redux"
import { logout } from "../redux/actionCreators/authCreators"

function HomePage({ logout }) {

    const handleLogout = () => {
        logout();
        console.log("Attempted Logout");
    }

    return (
        <>
            <Layout>
                Logged in View
                <Button background='primary.300' onClick={handleLogout}>Log Out</Button>
                <Box
                    data-state="open"
                    _open={{
                        animation: "slide-from-top 500ms",
                    }}
                    background={'primary.100'}
                    minH={'70vh'}
                >
                    Sample Container
                </Box>
            </Layout>
        </>
    )
}

const mapDispatchToProps = {
    logout,
};

export default connect(null, mapDispatchToProps)(HomePage);