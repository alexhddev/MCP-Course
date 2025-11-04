import random
from typing import List

happy_quotes = [
    'Joy is not found, it is created.',
    'Small moments build great lives.',
    'Hope grows wherever we plant it.'
]

sad_quotes = [
    'Some silences are never filled.',
    'Not all journeys lead us home.',
    'Time heals, but memory remains.'
]

neutral_quotes = [
    'Change arrives whether we\'re ready or not.',
    'Every choice closes a thousand doors.',
    'We are all both teacher and student.'
]

# Combine all quotes
all_quotes = happy_quotes + sad_quotes + neutral_quotes


def get_happy_quote() -> str:
    """Return a random happy quote."""
    index = random.randint(0, len(happy_quotes) - 1)
    return happy_quotes[index]


def get_sad_quote() -> str:
    """Return a random sad quote."""
    index = random.randint(0, len(sad_quotes) - 1)
    return sad_quotes[index]


def get_quotes(number_of_quotes: int) -> List[str]:
    """
    Return a specified number of random quotes from all collections.
    
    Args:
        number_of_quotes: The number of quotes to return
        
    Returns:
        A list of random quotes
        
    Raises:
        ValueError: If requested number exceeds available quotes
    """
    if number_of_quotes > len(all_quotes):
        raise ValueError(f'''Requested number of quotes ({number_of_quotes}) exceeds available quotes ({len(all_quotes)}).''')
    
    # Create a copy and shuffle it
    shuffled_quotes = all_quotes.copy()
    random.shuffle(shuffled_quotes)
    
    return shuffled_quotes[:number_of_quotes]