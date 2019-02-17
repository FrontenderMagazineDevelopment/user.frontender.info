import Users from '../../models/Users';

export async function get(req, res) {
  if (req.params.id === 'favicon.ico') {
    res.status(204);
    res.end();
  }

  if (req.user.scope.isTeam === false) {
    res.status(401);
    res.end();
  }

  let result;
  try {
    result = await Users.findById(req.params.id);
  } catch (error) {
    res.status(404);
    res.end();
  }

  res.status(200);
  res.send(result);
  res.end();
}

export default get;
