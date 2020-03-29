import { CookieNames } from "../consts";

export default request => {
  const sessionId = request.cookies[CookieNames.Session];

  if (sessionId) {
    request.sessionId = sessionId;
  }
};
