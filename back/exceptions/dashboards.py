"""Custom exceptions for dashboards module."""

from fastapi import HTTPException, status

from consts.dashboards import DASHBOARD_ACCESS_DENIED, DASHBOARD_NOT_FOUND


class DashboardNotFoundException(HTTPException):
    """Raised when a dashboard is not found.

    Attributes:
        status_code: 404 Not Found.
        detail: Error message.
    """

    def __init__(self) -> None:
        """Initialize with 404 status and default message."""
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=DASHBOARD_NOT_FOUND,
        )


class DashboardAccessDeniedException(HTTPException):
    """Raised when a user tries to access a dashboard they do not own.

    Attributes:
        status_code: 403 Forbidden.
        detail: Error message.
    """

    def __init__(self) -> None:
        """Initialize with 403 status and default message."""
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=DASHBOARD_ACCESS_DENIED,
        )
