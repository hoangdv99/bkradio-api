export default (req, res) => {
  return res.status(200).json({
    user: {
      username: req.user.username,
      roleId: req.user.roleId,
      userId: req.user.id      
    }
  })
}
