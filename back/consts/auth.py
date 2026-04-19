"""Constants and messages for auth module."""

# JWT
JWT_ALGORITHM: str = "HS256"
TOKEN_TYPE: str = "bearer"
JWT_SUBJECT_KEY: str = "sub"

# Error messages
EMAIL_ALREADY_REGISTERED: str = "Email already registered"
INVALID_CREDENTIALS: str = "Invalid email or password"
NOT_AUTHENTICATED: str = "Not authenticated"
INACTIVE_USER: str = "Inactive user account"
INVALID_TOKEN: str = "Could not validate credentials"
