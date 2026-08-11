from datetime import datetime


def create_user_document(
    first_name: str,
    last_name: str,
    email: str,
    password: str
):
    
    """
    Creates a MongoDB user document.

    This is used during register API.
    Password should already be hashed before calling this function.
    """

    return {
        "first_name": first_name,
        "last_name": last_name,
        "email": email.lower(),
        "password": password,
        "role": "customer",
        "is_active": True,        
        "is_email_verified": False,
        "last_login": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }