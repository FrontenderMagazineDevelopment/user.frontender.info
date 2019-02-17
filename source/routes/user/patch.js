import Users from '../../models/Users';

export async function patch(req, res) {
  if (req.user.scope.isTeam === false) {
    res.status(401);
    res.end();
  }

  if (
    req.user.scope.isOwner === false &&
    req.user.scope.login.toLowerCase() !== req.params.github.toLowerCase()
  ) {
    res.status(401);
    res.end();
  }

  const result = await Users.updateOne({ _id: req.params.id }, req.params);

  if (!result.ok) {
    res.status(500);
    res.end();
  }

  if (!result.n) {
    res.status(404);
    res.end();
  }

  let user;
  try {
    user = await Users.findById(req.params.id);
  } catch (error) {
    res.status(404);
    res.end();
  }

  res.status(200);
  res.send(user);
  res.end();
}

export default patch;
