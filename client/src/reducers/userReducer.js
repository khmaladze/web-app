export const initialState = null;

export const reducer = (state, action) => {
  if (action.type === "USER") {
    return action.payload;
  }
  if (action.type === "CLEAR") {
    return null;
  }
  if (action.type === "UPDATE") {
    return {
      ...state,
      followers: action.payload.followers,
      following: action.payload.following,
    };
  }
  if (action.type === "UPDATEPIC") {
    return {
      ...state,
      image: action.payload,
    };
  }
  if (action.type === "UPDATEBACKGROUNDIMG") {
    return {
      ...state,
      backgroundImage: action.payload,
    };
  }
  if (action.type === "UPDATEBIOGRAPHY") {
    return {
      ...state,
      biography: action.payload,
    };
  }
  if (action.type === "UPDATEISFEATURED") {
    return {
      ...state,
      isFeatured: action.payload,
    };
  }
  return state;
};
