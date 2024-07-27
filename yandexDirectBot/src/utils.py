def format_number(number, delimiter: str = ' '):
    number_str = str(int(number))
    reversed_number_str = number_str[::-1]
    parts = [reversed_number_str[i:i+3] for i in range(0, len(reversed_number_str), 3)]
    formatted_number = delimiter.join(parts)[::-1]
    return formatted_number
