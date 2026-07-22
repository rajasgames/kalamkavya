export const config = {
  matcher: '/:path*',
};

export default function middleware(req: Request) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    try {
      const authValue = basicAuth.split(' ')[1];
      // Decode Base64 auth string (user:password)
      const [user, pwd] = atob(authValue).split(':');

      // Reads credentials from Vercel Environment Variables, with default fallback
      const expectedUser = process.env.BASIC_AUTH_USER || 'admin';
      const expectedPwd = process.env.BASIC_AUTH_PASSWORD || 'kalam-kavya2026';

      if (user === expectedUser && pwd === expectedPwd) {
        return new Response(null, {
          headers: {
            'x-middleware-next': '1',
          },
        });
      }
    } catch {
      // Invalid base64 or auth format
    }
  }

  return new Response('Access Restricted: Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Kalam Kavya Beta Access"',
    },
  });
}
