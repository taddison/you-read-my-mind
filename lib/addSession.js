import { SESSION_COOKIE_NAME } from "../consts";

export default request => {
  const sessionId = request.cookies[SESSION_COOKIE_NAME];

  if (sessionId) {
    request.sessionId = sessionId;
  }
};
