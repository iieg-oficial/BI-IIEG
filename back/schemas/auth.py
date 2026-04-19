"""Pydantic schemas for auth module."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    """Schema for user registration request.

    Attributes:
        email: Valid email address.
        password: User password (min 8 characters).
        full_name: User display name.
    """

    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=1)


class LoginRequest(BaseModel):
    """Schema for user login request.

    Attributes:
        email: Valid email address.
        password: User password.
    """

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for JWT token response.

    Attributes:
        access_token: The JWT access token.
        token_type: Token type, always "bearer".
    """

    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Schema for user data response.

    Attributes:
        id: User primary key.
        email: User email address.
        full_name: User display name.
        created_at: Account creation timestamp.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    created_at: datetime
