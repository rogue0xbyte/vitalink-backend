export function authenticateToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        // If no bearer token provided
        res.status(401).json({'message': 'Unauthorized'});
    }
}