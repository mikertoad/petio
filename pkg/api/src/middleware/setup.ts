import { conf } from "../app/config";

export default (req, res, next) => {
  if (conf.get("general.setup") === false) {
    const path = req.path;
    if (path.startsWith("/api")) {
      if (
        path !== "/" &&
        !path.includes("/api/setup") &&
        path !== "/api/config"
      ) {
        res.status(401).send("You need to complete setup to access this url");
        return;
      }
    }
  }
  next();
};
