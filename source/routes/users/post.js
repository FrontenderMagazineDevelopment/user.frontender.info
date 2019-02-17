import Users from '../../models/Users';

export async function post(req, res) {
  if (req.user.scope.isOwner === false) {
    res.status(401);
    res.end();
  }

  const user = new Users(req.params);
  let result;
  try {
    result = await user.save();
  } catch (error) {
    res.status(400);
    res.send(error.message);
    res.end();
  }

  res.link('Location', `${process.env.config}${result._id}`);
  res.header('content-type', 'json');
  res.status(201);
  res.send(result);
  res.end();
}

export default post;
