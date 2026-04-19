"""Custom exceptions for connections module."""

from fastapi import HTTPException, status

from consts.connections import (
    CONNECTION_ACCESS_DENIED,
    CONNECTION_NOT_FOUND,
    CONNECTION_TEST_FAILED,
)


class ConnectionNotFoundException(HTTPException):
    """Raised when a connection is not found.

    Attributes:
        status_code: 404 Not Found.
        detail: Error message.
    """

    def __init__(self) -> None:
        """Initialize with 404 status and default message."""
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=CONNECTION_NOT_FOUND,
        )


class ConnectionAccessDeniedException(HTTPException):
    """Raised when a user tries to access a connection they do not own.

    Attributes:
        status_code: 403 Forbidden.
        detail: Error message.
    """

    def __init__(self) -> None:
        """Initialize with 403 status and default message."""
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=CONNECTION_ACCESS_DENIED,
        )


class ConnectionTestFailedException(HTTPException):
    """Raised when testing an external database connection fails.

    Attributes:
        status_code: 400 Bad Request.
        detail: Error message.
    """

    def __init__(self, detail: str = CONNECTION_TEST_FAILED) -> None:
        """Initialize with 400 status and provided or default message.

        Args:
            detail: Error detail message.
        """
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )
