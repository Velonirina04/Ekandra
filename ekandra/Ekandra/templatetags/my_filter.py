from django import template

register = template.Library()

@register.filter
def split(value, arg):
    """
    Splits a string by a given argument.
    Usage: {{ value|split:" " }}
    """
    return value.split(arg)

@register.filter
def first(value):
    """
    Returns the first item of a list or string.
    Usage: {{ list|first }} or {{ string|split:" "|first }}
    """
    if isinstance(value, list) and value:
        return value[0]
    elif isinstance(value, str) and value:
        # This part handles single-word strings if 'first' is used directly on them
        return value.split(' ')[0]
    return value