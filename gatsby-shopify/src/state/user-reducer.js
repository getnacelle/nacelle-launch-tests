import { SET_USER_DEVICE } from './user-actions';

const initialState = {
  isMobile: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DEVICE: {
      const { isMobile } = action.payload;
      return {
        ...state,
        isMobile
      };
    }
    default: {
      return state;
    }
  }
}
