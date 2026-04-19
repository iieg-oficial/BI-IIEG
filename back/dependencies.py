"""Shared FastAPI dependencies."""

import logging
from collections.abc import AsyncGenerator

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from db import async_session_factory
from exceptions.auth import InvalidTokenException
from models.user import User
from services.auth import decode_access_token, get_user_by_email

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield an async database session.

    Yields:
        AsyncSession: An async SQLAlchemy session.
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate the current user from a JWT token.

    Args:
        token: The Bearer token from the Authorization header.
        db: Async database session.

    Returns:
        The authenticated User instance.

    Raises:
        InvalidTokenException: If the token is invalid or the user is not found.
    """
    email = decode_access_token(token)
    if email is None:
        raise InvalidTokenException()

    user = await get_user_by_email(db, email)
    if user is None:
        raise InvalidTokenException()

    return user
