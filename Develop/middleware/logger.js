// middleware will log the type and path of each request to the server

const logger = (req, res, next) => {
    const fgMagenta = "\x1b[35m";
    switch (req.method) {
      case "GET": {
        switch (req.path) {
          case "": {
            console.info(`⬜ Request to view existing note`);
            break;
          }
          case null: {
            console.info(`⬜ Request to view existing note`);
            break;
          }
          case undefined: {
            console.info(`⬜ Request to view existing note`);
            break;
          }
          default:
            console.info(`📗 ${fgMagenta}${req.method} request to ${req.path}`);
        }
        
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