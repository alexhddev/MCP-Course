import requests


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