"""Custom exceptions for auth module."""

from fastapi import HTTPException, status

from consts.auth import EMAIL_ALREADY_REGISTERED, INVALID_CREDENTIALS, INVALID_TOKEN


class EmailAlreadyRegisteredException(HTTPException):
    """Raised when attempting to register with an existing email.

    Attributes:
        status_code: 409 Conflict.
        detail: Error message.
    """

    def __init__(self) -> None:
        """Initialize with 409 status and default message."""
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=EMAIL_ALREADY_REGISTERED,
        )


class InvalidCredentialsException(HTTPException):
    """Raised when login credentials are invalid.

    Attributes:
        status_code: 401 Unauthorized.
        detail: Error message.
    """

    def __init__(self) -> None:
        """Initialize with 401 status and default message."""
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_CREDENTIALS,
            headers={"WWW-Authenticate": "Bearer"},
        )


class InvalidTokenException(HTTPException):
    """Raised when a JWT token is invalid or expired.

    Attributes:
        status_code: 401 Unauthorized.
        detail: Error message.
    """

    def __init__(self) -> None:
        """Initialize with 401 status and default message."""
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=INVALID_TOKEN,
            headers={"WWW-Authenticate": "Bearer"},
        )
