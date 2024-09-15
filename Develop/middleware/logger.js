// middleware will log the type and path of each request to the server

const logger = (req, res, next) => {
    const fgMagenta = "\x1b[35m";
    switch (req.method) {
      case "GET": {
        if (req.path === "/") {
          console.info(`⬜ Navigating to webpage`);
        } else {
          console.info(`📗 ${fgMagenta}${req.method} request to ${req.path}`);
        }
        break;
      }
      case "POST": {
        console.info(`📘 ${fgMagenta}${req.method} request to ${req.path}`);
        break;
      }
      case "DELETE": {
        console.info(`📕 ${fgMagenta}${req.method} request to ${req.path}`);
        break;
      }
      default:
        console.log(`🟪${fgMagenta}${req.method} request to ${req.path}`);
    }

    next();
};

exports.logger = logger;