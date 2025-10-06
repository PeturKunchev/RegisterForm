Technologies Used:

1. Node.js (without frameworks) – custom-built HTTP server using Node’s native modules.
2. PostgreSQL – relational database for users and sessions.
3. HTML, CSS, Vanilla JavaScript – frontend for registration, login, and profile.
4. bcrypt – for secure password hashing.
5. canvas – to generate a custom CAPTCHA image.
6. dotenv – for environment configuration.
7. node:test and c8 – for unit testing and full coverage reports.
8. crypto – built-in Node.js module for secure random token generation.


Module	Purpose	Key Built-in Functions:

1. http:	   Create and manage the backend server    	http.createServer(), req.on("data"), req.on("end"), res.writeHead(), res.end()
2. crypto: 	   Generate secure session tokens	        crypto.randomBytes()
3. url:	       Parse and route API paths	            Used in routing logic for path checks
4. assert: 	   Used in unit tests	                    assert.equal(), assert.deepEqual(), assert.ok()
5. node:test:  Native testing framework    	            test(), beforeEach(), afterEach()

6. fs:     	Run database migrations (via shell scripts or psql execution)   Used indirectly for reading SQL files
7. process: Handle environment variables and application lifecycle	        process.env, process.exit()
8. JSON:   	Parse and stringify HTTP bodies 	                            JSON.parse(), JSON.stringify()
9. Buffer: 	Handle binary image data (CAPTCHA)	                            canvas.toBuffer("image/png")
10. Date:   Manage session expiration         	                            new Date(), Date.now()


Implemented Functionalities:

1. Data Validation (Email, Name, Password)
Implemented in services/validators.js using regex and logical checks.

Functions:
validateEmail() ensures valid email structure.
validateName() restricts names to letters (Latin/Cyrillic) and length 2–50.
validatePassword() enforces minimum length of 8 characters.
Each function is unit tested with valid and invalid inputs.

2. Storing Data in a Relational Database (PostgreSQL):

Managed via pg library with Pool for connections (db/connection.js).
Uses parameterized queries to prevent SQL injection.
Passwords stored as bcrypt hashes.
Schema defined in db/migrations.sql:
users table for accounts.
sessions table for authentication tokens.

3. Login and Logout:

Login (routes/login.js)
Validates email, password, and CAPTCHA.
Compares password using bcrypt.compare().
Creates session with crypto.randomBytes() and saves to DB.
Sends session cookie with flags: HttpOnly, Path=/, SameSite=Lax.
Logout (routes/profile.js)
Deletes session from DB.
Sends expired cookie to invalidate session.

4. Profile Page (Name, Email, Password Update):

Handled in routes/profile.js.
Authenticated via getUserFromSession() using cookies.
Endpoints:
GET /api/profile → returns user data.
PUT /api/profile → updates email, first and last name.
PUT /api/profile/password → verifies old password, updates new hash.
POST /api/logout → removes session and clears cookie.

5. Custom CAPTCHA (No External Service):

Built from scratch in services/captcha.js using Canvas API.
Random 5-character text drawn on a noisy background.
Image returned as binary PNG via canvas.toBuffer().
Tokens tracked in memory via Map() and validated in captchaValidation.js.
No external libraries or APIs used.

6. Full Unit Test Coverage (100%):

Implemented using node:test and c8.
Every helper file tested (validators.js, security.js, responses.js, etc.).
Coverage includes both success and failure cases.
Achieved verified 100% code coverage for all functions.


Project Structure Overview
             File / Folder	Description

1. server.js	                    Entry point for backend server  (routing and HTTP handling)
2. db/connection.js	                PostgreSQL connection setup
3. db/migrations.sql	            Database schema definition
4. routes/auth.js	                Handles registration logic
5. routes/login.js	                Handles login logic
6. routes/profile.js	            Handles profile management and logout
7. services/validators.js	        Input validation utilities
8. services/security.js	            Password hashing and verification
9. services/captcha.js	            CAPTCHA generation
10. services/captchaValidation.js	CAPTCHA verification
11. services/responses.js	        Unified JSON response helpers
12. services/cors.js	            Manual CORS configuration
13. services/getUser.js	            Retrieves user from session cookie
14. tests/	                        Unit tests for all backend services
15. frontend/	                    HTML, CSS, JS frontend for registration, login, and profile