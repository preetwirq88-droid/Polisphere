from fastapi import APIRouter, HTTPException, Depends, status
from app.database import get_database
from app.security import verify_password, create_access_token
from app.models.admin_user import AdminLoginRequest, TokenResponse, AdminUserResponse
from app.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Auth"])

@router.post("/login", response_model=TokenResponse)
async def admin_login(payload: AdminLoginRequest):
    db = get_database()
    admin = await db.admin_users.find_one({"email": payload.email.lower().strip()})
    
    if not admin or not verify_password(payload.password, admin.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = create_access_token(subject=admin["email"])
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        admin_name=admin.get("name", "Admin"),
        admin_email=admin["email"]
    )

@router.get("/me", response_model=AdminUserResponse)
async def get_admin_profile(current_admin: dict = Depends(get_current_admin)):
    return AdminUserResponse(
        id=current_admin["id"],
        email=current_admin["email"],
        name=current_admin.get("name", "Admin"),
        created_at=current_admin.get("created_at")
    )
