import Users from '../../models/Users';

export async function del(req, res) {
  if (req.user.scope.isOwner === false) {
    res.status(401);
    res.end();
  }

  const result = await Users.remove({ _id: req.params.id });

  if (!result.result.ok) {
    res.status(500);
    res.end();
  }

  if (!result.result.n) {
    res.status(404);
    res.end();
  }

  res.status(204);
  res.end();
}

export default del;
