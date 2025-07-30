const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next(); // ✅ Allow access if admin
    } else {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default isAdmin;
