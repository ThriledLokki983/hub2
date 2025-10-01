from functools import wraps


def login_exempt(view_func):
    """Marks a view as being exempt from login requirements."""

    @wraps(view_func)
    def wrapped_view(*args, **kwargs):
        return view_func(*args, **kwargs)

    wrapped_view.login_exempt = True
    return wrapped_view
