from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import AddressCreate, AddressResponse, UserResponse, UserUpdate, PasswordChange
from .. import crud
from .deps import get_current_user

router = APIRouter(prefix="/api/v1/profile", tags=["profile"])


@router.get("", response_model=UserResponse)
def get_profile(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("", response_model=UserResponse)
def update_profile(data: UserUpdate, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = crud.update_user(db, user_id, first_name=data.first_name, last_name=data.last_name, phone=data.phone)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(data: PasswordChange, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not crud.verify_password(data.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    new_hash = crud.hash_password(data.new_password)
    crud.update_user(db, user_id, password_hash=new_hash)
    return {"message": "Password changed successfully"}


# --- Addresses ---


@router.get("/addresses", response_model=list[AddressResponse])
def get_addresses(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_user_addresses(db, user_id)


@router.post("/addresses", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
def create_address(data: AddressCreate, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_address(
        db, user_id,
        full_name=data.full_name, phone=data.phone, street=data.street,
        city=data.city, state=data.state, zip_code=data.zip_code,
        country=data.country, is_default=data.is_default
    )


@router.put("/addresses/{address_id}", response_model=AddressResponse)
def update_address(
    address_id: int, data: AddressCreate,
    user_id: int = Depends(get_current_user), db: Session = Depends(get_db)
):
    address = crud.update_address(
        db, address_id, user_id,
        full_name=data.full_name, phone=data.phone, street=data.street,
        city=data.city, state=data.state, zip_code=data.zip_code,
        country=data.country, is_default=data.is_default
    )
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    return address


@router.delete("/addresses/{address_id}", status_code=status.HTTP_200_OK)
def delete_address(address_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    address = crud.delete_address(db, address_id, user_id)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    return {"message": "Address deleted"}
