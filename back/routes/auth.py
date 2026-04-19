"""Routes for auth module."""

import logging

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from dependencies import get_current_user, get_db
from exceptions.auth import InvalidCredentialsException
from models.user import User
from schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from services import auth as auth_service

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger(__name__)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Register a new user account.

    Args:
        data: Registration payload with email, password and full_name.
        db: Async database session.

    Returns:
        The created user data.
    """
    user = await auth_service.register_user(db, data)
    return UserResponse.model_validate(user)


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """Authenticate a user and return a JWT token.

    Args:
        data: Login payload with email and password.
        db: Async database session.

    Returns:
        JWT access token and token type.

    Raises:
        InvalidCredentialsException: If credentials are invalid.
    """
    user = await auth_service.authenticate_user(db, data.email, data.password)
    if not user:
        raise InvalidCredentialsException()

    access_token = auth_service.create_access_token(data={"sub": user.email})
    return TokenResponse(access_token=access_token)


@router.get(
    "/me",
    response_model=UserResponse,
)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Get the current authenticated user's profile.

    Args:
        current_user: The authenticated user from the JWT token.

    Returns:
        The current user's data.
    """
    return UserResponse.model_validate(current_user)
