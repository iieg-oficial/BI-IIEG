"""Business logic for auth module."""

import logging
from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from consts.auth import JWT_ALGORITHM, JWT_SUBJECT_KEY
from exceptions.auth import EmailAlreadyRegisteredException
from models.user import User
from schemas.auth import RegisterRequest

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt.

    Args:
        password: The plain-text password to hash.

    Returns:
        The bcrypt-hashed password string.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against its hash.

    Args:
        plain_password: The plain-text password to verify.
        hashed_password: The stored bcrypt hash.

    Returns:
        True if the password matches, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Fetch a user by email address.

    Args:
        db: Async database session.
        email: The email address to search for.

    Returns:
        The User instance if found, None otherwise.
    """
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def register_user(db: AsyncSession, data: RegisterRequest) -> User:
    """Register a new user account.

    Args:
        db: Async database session.
        data: Registration data with email, password and full_name.

    Returns:
        The newly created User instance.

    Raises:
        EmailAlreadyRegisteredException: If the email is already in use.
    """
    existing = await get_user_by_email(db, data.email)
    if existing:
        logger.warning("Registration attempt with existing email: %s", data.email)
        raise EmailAlreadyRegisteredException()

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    logger.info("User registered: %s", user.email)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    """Authenticate a user by email and password.

    Args:
        db: Async database session.
        email: The user's email address.
        password: The plain-text password to verify.

    Returns:
        The User instance if credentials are valid, None otherwise.
    """
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a signed JWT access token.

    Args:
        data: Payload data to encode in the token.
        expires_delta: Optional custom expiration time delta.

    Returns:
        The encoded JWT string.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    token: str = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token


def decode_access_token(token: str) -> str | None:
    """Decode a JWT access token and extract the subject.

    Args:
        token: The JWT token string to decode.

    Returns:
        The subject (email) from the token, or None if invalid.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[JWT_ALGORITHM])
        email: str | None = payload.get(JWT_SUBJECT_KEY)
        return email
    except jwt.JWTError:
        logger.warning("Failed to decode JWT token")
        return None
