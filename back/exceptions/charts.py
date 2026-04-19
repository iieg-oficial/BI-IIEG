"""Custom exceptions for charts module."""

from fastapi import HTTPException, status

from consts.charts import CHART_ACCESS_DENIED, CHART_NOT_FOUND


class ChartNotFoundException(HTTPException):
    """Raised when a chart is not found.

    Attributes:
        status_code: 404 Not Found.
        detail: Error message.
    """

    def __init__(self) -> None:
        """Initialize with 404 status and default message."""
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=CHART_NOT_FOUND,
        )


class ChartAccessDeniedException(HTTPException):
    """Raised when a user tries to access a chart they do not own.

    Attributes:
        status_code: 403 Forbidden.
        detail: Error message.
    """

    def __init__(self) -> None:
        """Initialize with 403 status and default message."""
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=CHART_ACCESS_DENIED,
        )
