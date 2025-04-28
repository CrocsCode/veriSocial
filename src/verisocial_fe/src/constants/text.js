
const T = {
    AUTH: {
        LOGIN_SUCCESS: "Login successful.",
        LOGIN_FAILURE: "Login failed. Please try again.",
        LOGIN_FAILURE_CRED: "Invalid credentials. Please try again.",
        LOGOUT_SUCCESS: "Logged out successfully.",
        LOGOUT_FAILURE: "Logout failed. Please try again.",

        REGISTER_SUCCESS: "Account created successfully! Please log in.",
        REGISTER_FAILURE: "Registration failed. Please try again.",
        REGISTER_NETWORK_ERROR: "Network error during registration. Please check your connection.",

        PASSWORD_MATCH_ERROR: "Passwords do not match."
    },
    FORM: {
        POST: {
            PLACEHOLDER: "What's on your mind?",
            SUCCESS: "Post Created.",
            FAILURE: "Failed to create Post.",
        }
    },
    INTERACTIONS: {
        POST: {
            LIKED: "Liked Post.",
            UNLIKED: "Unliked Post.",
            LIKE_ERROR: "Error with Post Likes.",
        },
        COMMENT: {
            LIKED: "Liked Comment.",
            UNLIKED: "Unliked Comment.",
            LIKE_ERROR: "Error with Comment Likes.",
            CREATE: "Successfully created Comment.",
            CREATE_FAILURE: "Failed to post comment.",
        }
    },
    GAME: {
        RESULT: {
            CORRECT: "Correct!",
            WRONG: "Better luck next time!",
        },
        ERROR: "Error in updating Game Score."
    },
    GENERAL: {
        ERROR: "Something went wrong.",
    }
};

export default T;
