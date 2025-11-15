import requests
from typing import List, TypedDict

# Base URL for the pizza API
BASE_URL = 'http://localhost:3000/api'


def get_daily_menu():
    try:
        response = requests.get(
            f"{BASE_URL}/daily-menu",
            headers={
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        )
        response.raise_for_status()
        menu = response.json()
        return menu["data"]
    except requests.exceptions.RequestException as error:
        return {
            'success': False,
            'message': str(error),
            'data': []
        }
    except Exception as error:
        return {
            'success': False,
            'message': f'Unknown error occurred: {str(error)}',
            'data': []
        }
    

class OrderItem(TypedDict):
    """Type definition for order item"""
    name: str
    quantity: int

class OrderDetails(TypedDict):
    """Type definition for order details"""
    sender: str
    contents: List[OrderItem]

def make_order(order_details: OrderDetails) -> str:
    try:
        response = requests.post(
            f"{BASE_URL}/orders",
            headers={
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            json=order_details         
        )
        response.raise_for_status()
        response_json = response.json()
        return {
            'order_id':response_json['data']['id']
        }
    except requests.exceptions.RequestException as error:
        return {
            'success': False,
            'message': str(error),
            'order_id': ''
        }
    except Exception as error:
        return {
            'success': False,
            'message': f'Unknown error occurred: {str(error)}',
            'order_id': ''
        }