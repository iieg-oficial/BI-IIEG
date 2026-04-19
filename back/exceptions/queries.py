"""Custom exceptions for queries module."""

from fastapi import HTTPException, status

from consts.queries import (
    QUERY_EXECUTION_FAILED,
    QUERY_NOT_ALLOWED,
    SAVED_QUERY_ACCESS_DENIED,
    SAVED_QUERY_NOT_FOUND,
)


class QueryNotAllowedException(HTTPException):
    """Raised when a SQL statement is not a read-only SELECT.

    Attributes:
        status_code: 400 Bad Request.
        detail: Error message.
    """

    def __init__(self, detail: str = QUERY_NOT_ALLOWED) -> None:
        """Initialize with 400 status and provided or default message.

        Args:
            detail: Error detail message.
        """
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )


class QueryExecutionException(HTTPException):
    """Raised when a query fails to execute on the external database.

    Attributes:
        status_code: 400 Bad Request.
        detail: Error message.
    """

    def __init__(self, detail: str = QUERY_EXECUTION_FAILED) -> None:
        """Initialize with 400 status and provided or default message.

        Args:
            detail: Error detail message.
        """
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )


class SavedQueryNotFoundException(HTTPException):
    """Raised when a saved query is not found.

    Attributes:
        status_code: 404 Not Found.
        detail: Error message.
    """

    def __init__(self) -> None:
        """Initialize with 404 status and default message."""
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=SAVED_QUERY_NOT_FOUND,
        )


class SavedQueryAccessDeniedException(HTTPException):
    """Raised when a user tries to access a saved query they do not own.

    Attributes:
        status_code: 403 Forbidden.
        detail: Error message.
    """

    def __init__(self) -> None:
        """Initialize with 403 status and default message."""
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=SAVED_QUERY_ACCESS_DENIED,
        )
