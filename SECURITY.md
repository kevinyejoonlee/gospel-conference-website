# Security Review & Recommendations

## ⚠️ Critical Issues to Address

### 1. **Next.js Version (CRITICAL)**
- **Current**: Next.js 16.0.3 (released in 2023)
- **Issue**: This version is outdated and may have known security vulnerabilities
- **Recommendation**: Upgrade to Next.js 15.x (latest stable)
  ```bash
  npm install next@latest react@latest react-dom@latest
  ```

### 2. **TypeScript Build Errors Ignored (HIGH RISK)**
- **Location**: `next.config.mjs` line 4
- **Issue**: `ignoreBuildErrors: true` can hide security issues
- **Recommendation**: Remove this and fix TypeScript errors properly

### 3. **No Rate Limiting on API Routes (HIGH RISK)**
- **Issue**: API routes can be abused for DDoS or brute force attacks
- **Recommendation**: Implement rate limiting
  - Use Cloudflare Rate Limiting (recommended for Cloudflare hosting)
  - Or use `@upstash/ratelimit` or similar

### 4. **Sensitive Data in Stripe Metadata (MEDIUM)**
- **Issue**: Health card numbers, addresses stored in Stripe metadata
- **Note**: Stripe metadata is encrypted, but consider:
  - Only store necessary data
  - Consider GDPR/privacy compliance
  - Health card numbers might need special handling

## ✅ Good Security Practices Already in Place

1. ✅ Environment variables for API keys
2. ✅ Stripe webhook signature verification
3. ✅ Server-side API routes (not exposing keys to client)
4. ✅ Input validation on forms

## 🔒 Security Recommendations

### Immediate Actions

1. **Upgrade Next.js**
   ```bash
   npm install next@latest
   ```

2. **Add Rate Limiting**
   - Configure in Cloudflare Dashboard → Security → Rate Limiting
   - Or add middleware:
   ```typescript
   // middleware.ts
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'
   
   export function middleware(request: NextRequest) {
     // Add rate limiting logic here
     return NextResponse.next()
   }
   
   export const config = {
     matcher: '/api/:path*',
   }
   ```

3. **Fix TypeScript Config**
   ```javascript
   // next.config.mjs
   const nextConfig = {
     typescript: {
       ignoreBuildErrors: false, // Change to false
     },
     // ... rest of config
   }
   ```

4. **Add Input Sanitization**
   - Install: `npm install dompurify`
   - Sanitize user inputs before storing

5. **Add CORS Configuration** (if needed)
   ```javascript
   // next.config.mjs
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
             { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
           ],
         },
       ]
     },
   }
   ```

### Cloudflare Security Setup

1. **Enable Cloudflare WAF (Web Application Firewall)**
   - Go to Security → WAF
   - Enable managed rulesets
   - Block common attack patterns

2. **Configure Rate Limiting**
   - Security → Rate Limiting
   - Set limits for API routes:
     - `/api/create-checkout-session`: 10 requests/minute per IP
     - `/api/webhook`: Only allow from Stripe IPs

3. **Enable DDoS Protection**
   - Should be enabled by default
   - Verify in Security → DDoS Protection

4. **SSL/TLS Settings**
   - Use "Full (strict)" mode
   - Enable HSTS
   - Minimum TLS version: 1.2

5. **Firewall Rules**
   - Block requests to `/api/webhook` from non-Stripe IPs
   - Stripe webhook IPs: https://stripe.com/docs/ips

### Environment Variables Security

1. **Never commit `.env` files**
   - Verify `.gitignore` includes `.env*`
   - Use Cloudflare Environment Variables or Vercel Environment Variables

2. **Use different keys for test/production**
   - Test keys: `sk_test_...`
   - Production keys: `sk_live_...`

3. **Rotate keys regularly**
   - Especially if exposed or compromised

### Additional Security Measures

1. **Add Request Validation**
   ```typescript
   // app/api/create-checkout-session/route.ts
   import { z } from 'zod'
   
   const checkoutSchema = z.object({
     formData: z.object({
       email: z.string().email(),
       firstName: z.string().min(1).max(100),
       // ... other fields
     }),
     type: z.enum(['register', 'volunteer', 'donate']),
   })
   ```

2. **Add Error Logging (without exposing details)**
   - Use a service like Sentry
   - Don't expose stack traces to users

3. **Add Security Headers**
   ```javascript
   // next.config.mjs
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             { key: 'X-Frame-Options', value: 'DENY' },
             { key: 'X-Content-Type-Options', value: 'nosniff' },
             { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
             { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
           ],
         },
       ]
     },
   }
   ```

4. **Content Security Policy (CSP)**
   - Add CSP headers to prevent XSS attacks
   - Configure in Cloudflare or Next.js

## 🧪 Security Testing Checklist

Before going live:

- [ ] Upgrade Next.js to latest version
- [ ] Remove `ignoreBuildErrors: true`
- [ ] Set up Cloudflare rate limiting
- [ ] Configure Cloudflare WAF
- [ ] Test Stripe webhook with test events
- [ ] Verify environment variables are not in git
- [ ] Test form validation with malicious inputs
- [ ] Verify HTTPS is enforced
- [ ] Test rate limiting works
- [ ] Review Stripe dashboard for any exposed keys

## 📚 Resources

- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Stripe Security Guide](https://stripe.com/docs/security)
- [Cloudflare Security](https://developers.cloudflare.com/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## ⚡ Quick Fixes Priority

1. **URGENT**: Upgrade Next.js
2. **URGENT**: Remove `ignoreBuildErrors: true`
3. **HIGH**: Add rate limiting (Cloudflare)
4. **HIGH**: Configure Cloudflare WAF
5. **MEDIUM**: Add input validation/sanitization
6. **MEDIUM**: Add security headers


