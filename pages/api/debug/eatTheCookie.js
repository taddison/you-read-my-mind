import {serialize} from "cookie"
import { CookieNames } from "../../../consts"

export default (req,res) => {
  let message = 'The cookie monster goes hungry...'
  
  if(req.cookies[CookieNames.Session]) {
    message = 'The cookie monster approves!  Eating that cookie...';
    res.setHeader('Set-Cookie', serialize(CookieNames.Session, '', { expires: new Date(0), path: '/'}))
  }

  res.status(200).json({message});
}