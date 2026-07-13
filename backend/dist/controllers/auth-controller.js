import { AuthService } from '../services/auth-service.js';
export class AuthController {
    authService = new AuthService();
    async login(req, res) {
        const { username, password } = req.body;
        try {
            const authResult = await this.authService.login(username, password);
            return res.status(200).json({
                success: true,
                data: authResult,
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
        catch (err) {
            if (err.message === 'INVALID_CREDENTIALS') {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid username or password'
                    }
                });
            }
            return res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: `Login processing failed: ${err.message}`
                }
            });
        }
    }
    async logout(req, res) {
        const { refreshToken } = req.body;
        try {
            await this.authService.logout(refreshToken);
            return res.status(200).json({
                success: true,
                data: { message: 'Logged out successfully' },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: `Logout failed: ${err.message}`
                }
            });
        }
    }
    async refresh(req, res) {
        const { refreshToken } = req.body;
        try {
            const authResult = await this.authService.refresh(refreshToken);
            return res.status(200).json({
                success: true,
                data: authResult,
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
        catch (err) {
            if (err.message === 'INVALID_REFRESH_TOKEN') {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_REFRESH_TOKEN',
                        message: 'Provided refresh token is invalid'
                    }
                });
            }
            if (err.message === 'REFRESH_TOKEN_REUSED_ALARM') {
                return res.status(403).json({
                    success: false,
                    error: {
                        code: 'REFRESH_TOKEN_REUSE',
                        message: 'Security warning: Refresh token has already been used and is revoked'
                    }
                });
            }
            if (err.message === 'EXPIRED_REFRESH_TOKEN') {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'REFRESH_TOKEN_EXPIRED',
                        message: 'Session expired: Refresh token has expired'
                    }
                });
            }
            return res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: `Refresh processing failed: ${err.message}`
                }
            });
        }
    }
    async me(req, res) {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Access denied: Authentication required'
                }
            });
        }
        try {
            const currentUser = await this.authService.getCurrentUser(user.id);
            return res.status(200).json({
                success: true,
                data: {
                    user: currentUser
                },
                meta: {
                    timestamp: new Date().toISOString()
                }
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: `Profile retrieval failed: ${err.message}`
                }
            });
        }
    }
}
//# sourceMappingURL=auth-controller.js.map