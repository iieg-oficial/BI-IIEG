"""Unit tests for services/auth.py functions."""

from services.auth import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


async def test_hash_password_returns_bcrypt_hash() -> None:
    """hash_password should return a string starting with the bcrypt prefix."""
    hashed = hash_password("mypassword")

    assert isinstance(hashed, str)
    assert hashed.startswith("$2b$") or hashed.startswith("$2a$")


async def test_verify_password_correct() -> None:
    """verify_password should return True for the correct password."""
    password = "mypassword"
    hashed = hash_password(password)

    assert verify_password(password, hashed) is True


async def test_verify_password_wrong() -> None:
    """verify_password should return False for a wrong password."""
    hashed = hash_password("mypassword")

    assert verify_password("wrongpassword", hashed) is False


async def test_create_access_token_returns_decodable_jwt() -> None:
    """create_access_token should return a JWT that can be decoded."""
    token = create_access_token(data={"sub": "user@example.com"})

    assert isinstance(token, str)
    assert len(token) > 0

    email = decode_access_token(token)
    assert email == "user@example.com"


async def test_decode_access_token_valid() -> None:
    """decode_access_token should return the email from a valid token."""
    token = create_access_token(data={"sub": "user@example.com"})

    result = decode_access_token(token)

    assert result == "user@example.com"


async def test_decode_access_token_invalid() -> None:
    """decode_access_token should return None for an invalid token."""
    result = decode_access_token("not.a.valid.token")

    assert result is None
