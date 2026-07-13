import jwt from 'jsonwebtoken';
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Unauthorized: Missing or invalid token'
            }
        });
    }
    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded.id || !decoded.username || !decoded.roles) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Unauthorized: Invalid token format'
                }
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        let errorCode = 'UNAUTHORIZED';
        let errorMessage = 'Unauthorized: Failed to authenticate session';
        if (error.name === 'TokenExpiredError') {
            errorCode = 'TOKEN_EXPIRED';
            errorMessage = 'Unauthorized: Access token has expired';
        }
        return res.status(401).json({
            success: false,
            error: {
                code: errorCode,
                message: errorMessage
            }
        });
    }
}
export function roleGuard(allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Unauthorized: Authentication required'
                }
            });
        }
        // Check if user has at least one of the allowed roles
        const hasRole = user.roles.some(role => allowedRoles.includes(role));
        if (!hasRole) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Forbidden: Insufficient privileges'
                }
            });
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map