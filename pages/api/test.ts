import { NextApiRequest, NextApiResponse } from 'next';
import Url from 'url-parse';

export default (req: NextApiRequest, res: NextApiResponse ) => {
	const urlObj = Url(req.url, true);
  res.status(200).json({success: true});
}