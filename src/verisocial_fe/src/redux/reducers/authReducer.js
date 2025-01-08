const initialState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      console.log("Success")
      return { ...state, loading: false, isAuthenticated: true, token: action.payload };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, token: null };
    default:
      return state;
  }
}
