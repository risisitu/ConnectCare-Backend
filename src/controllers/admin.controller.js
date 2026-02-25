const jwt = require('jsonwebtoken');

class AdminController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Hardcoded admin credentials
            const ADMIN_EMAIL = 'connectcarea@gmail.com';
            const ADMIN_PASSWORD = '35hWi45!';

            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                // Generate JWT token
                const token = jwt.sign(
                    { id: 'admin-1', email: ADMIN_EMAIL, role: 'admin' },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                return res.json({
                    success: true,
                    data: {
                        id: 'admin-1',
                        email: ADMIN_EMAIL,
                        role: 'admin',
                        token
                    }
                });
            }

            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = AdminController;
