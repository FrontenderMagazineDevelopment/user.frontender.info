import Users from '../../models/Users';

export async function get(req, res) {
  if (req.user.scope.isOwner === false) {
    res.status(401);
    res.end();
  }
  if (req.url === '/favicon.ico') {
    res.state(204);
    res.end();
  }
  const result = await Users.find();
  res.status(200);
  res.send(result);
  res.end();
}

export default get;
