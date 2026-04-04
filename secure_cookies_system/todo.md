# Secure Cookies and Digital Signature System - Project TODO

## Part A: Cookie Protection using HMAC

- [x] Database schema for storing user credentials and session data
- [x] HMAC-SHA256 cookie generation with username, role, and expiration
- [x] Server-side MAC tag generation and storage
- [x] Cookie verification logic on each request
- [x] Login page UI with form validation
- [x] Successful login demonstration with valid cookie
- [x] Protected resource page (dashboard/protected content)
- [x] Cookie tampering detection page showing modification attempts
- [x] Rejection of tampered cookies with error messages
- [x] Manual cookie modification guide for demonstration

## Part B: RSA Key-Pair Generation & Digital Signature

- [x] RSA key-pair generation (2048-bit or higher)
- [x] Private key storage and management
- [x] Public key availability for verification
- [x] File upload functionality
- [x] SHA-256 based RSA signature generation
- [x] File and signature storage in database
- [x] Signature verification using public key
- [x] Key generation demonstration page
- [x] File signing demonstration page
- [x] Successful verification of original file
- [x] File modification detection (verification failure)
- [x] Detailed error messages for failed verifications

## UI and Demonstration Pages

- [x] Clean, functional design for all pages
- [x] Home/landing page with navigation
- [x] Login page (Part A)
- [x] Protected dashboard (Part A)
- [x] Cookie tampering demo page (Part A)
- [x] RSA key generation page (Part B)
- [x] File upload and signing page (Part B)
- [x] Signature verification page (Part B)
- [x] Tampered file verification demo (Part B)
- [x] Documentation/explanation pages

## Testing and Validation

- [x] Unit tests for HMAC generation and verification
- [x] Unit tests for RSA key generation
- [x] Unit tests for signature creation and verification
- [ ] Integration tests for login flow
- [ ] Integration tests for cookie validation
- [ ] Integration tests for file signing workflow
- [ ] Manual testing of tampering scenarios
- [ ] Cross-browser compatibility check

## Bonus: Attack Demonstrations (Optional +3 Marks)

- [ ] Key Substitution Attack implementation
- [ ] Message Key Substitution Attack implementation
- [ ] Attack demonstration pages
- [ ] Vulnerability explanation documentation

## Final Deliverables

- [x] Complete source code with comments
- [x] README with setup instructions
- [x] Security concept explanations
- [x] Demonstration guide for submission
- [ ] Code checkpoint saved
