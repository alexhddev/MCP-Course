import { Request, Response, NextFunction } from 'express';
import { checkToken } from './CoolOathClient'

// OAuth 2.1 configuration
const WWW_HEADER = {
    "WWW-Authenticate": `Bearer realm="OAuth", resource_metadata="http://localhost:8000/.well-known/oauth-protected-resource"`
};


// Public paths that don't require authentication
const PUBLIC_PATHS = [".well-known", "/health", "/authorize", "/token"];

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        // Allow public access to OAuth discovery, health, authorization, and token endpoints
        if (PUBLIC_PATHS.some(path => req.path.includes(path))) {
            return next();
        }
        // Extract Bearer token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401)
                .set(WWW_HEADER)
                .json({ error: "Missing Bearer token" });
            return;
        }

        const token = authHeader.split("Bearer ")[1].trim();
        //check the token
        const isValid = await checkToken(token)
        if (!isValid) {
            res.status(401)
                .set(WWW_HEADER)
                .json({ error: "Invalid token" });
            return;
        }

        return next()

    } catch (error) {
        console.error('Authentication failed:', error);
        res.status(401)
            .set(WWW_HEADER)
            .json({ error: "Authentication failed" });
        return;
    }
}