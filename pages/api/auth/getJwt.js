import jwt from 'next-auth/jwt'

const secret = process.env.JWT_SECRET

export default async (req, res) => {
  try {
    const token = await jwt.getToken({req, secret})
    res.send(token || {status: false})
  }
  catch(err) {
    res.status(505).send(err);
  }
}