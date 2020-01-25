export const SET_USER_DEVICE = 'SET_USER_DEVICE';

export function setUserDevice(payload) {
  return {
    type: SET_USER_DEVICE,
    payload
  };
}
