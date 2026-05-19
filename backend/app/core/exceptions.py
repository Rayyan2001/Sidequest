"""
core/exceptions.py — application-wide exception hierarchy.
All HTTP errors raised as these; translated to JSON responses by the handler.
"""
from fastapi import HTTPException, status


class AppException(HTTPException):
    """Base for all application exceptions."""
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    detail: str = "An unexpected error occurred"

    def __init__(self, detail: str | None = None, headers: dict | None = None):
        super().__init__(
            status_code=self.__class__.status_code,
            detail=detail or self.__class__.detail,
            headers=headers,
        )


class NotFoundException(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    detail = "Resource not found"


class UnauthorizedException(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Authentication required"

    def __init__(self, detail: str | None = None):
        super().__init__(detail=detail, headers={"WWW-Authenticate": "Bearer"})


class ForbiddenException(AppException):
    status_code = status.HTTP_403_FORBIDDEN
    detail = "Access denied"


class ConflictException(AppException):
    status_code = status.HTTP_409_CONFLICT
    detail = "Resource already exists"


class BadRequestException(AppException):
    status_code = status.HTTP_400_BAD_REQUEST
    detail = "Invalid request"


class UnprocessableException(AppException):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    detail = "Validation error"


class RateLimitException(AppException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    detail = "Too many requests"


class OAuthException(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "OAuth token verification failed"
