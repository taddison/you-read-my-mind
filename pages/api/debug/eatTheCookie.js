import {serialize} from "cookie"
import { SESSION_COOKIE_NAME } from "../../../consts"

export default (req,res) => {
  let message = 'The cookie monster goes hungry...'
  
  if(req.cookies[SESSION_COOKIE_NAME]) {
    message = 'The cookie monster approves!  Eating that cookie...';
    res.setHeader('Set-Cookie', serialize(SESSION_COOKIE_NAME, '', { expires: new Date(0), path: '/'}))
  }

  res.status(200).json({message});
}