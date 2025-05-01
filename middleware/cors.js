module.exports = (req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'https://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, UPDATE, DELETE");
    next();
}
