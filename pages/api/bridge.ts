// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "isomorphic-fetch";

type Data = {
  data: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { url } = JSON.parse(req.body);

  const data = await fetch(url).then((res) => res.json());

  res.status(200).json({ data });
}
