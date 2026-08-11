from datetime import datetime


def create_address_document(
    user_id: str,
    full_name: str,
    phone_number: str,
    address_line_1: str,
    city: str,
    state: str,
    country: str,
    postal_code: str,
    address_line_2: str = None,
    is_default: bool = False
):
    """
    Creates a user address document.

    One user can have multiple addresses.
    """

    return {
        "user_id": user_id,
        "full_name": full_name,
        "phone_number": phone_number,
        "address_line_1": address_line_1,
        "address_line_2": address_line_2,
        "city": city,
        "state": state,
        "country": country,
        "postal_code": postal_code,
        "is_default": is_default,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }