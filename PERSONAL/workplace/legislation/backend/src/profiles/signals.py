from django.contrib.auth.signals import user_logged_in
from django.contrib.sessions.models import Session
from django.dispatch import receiver
from django.utils import timezone


@receiver(user_logged_in)
def limit_concurrent_admin_sessions(sender, user, request, **kwargs):
    """
    Limit concurrent sessions for staff/admin to 1.
    This removes existing sessions other than the current.
    """

    if not user.is_staff:
        return

    current_session_key = request.session.session_key

    other_sessions = Session.objects.exclude(
        session_key=current_session_key,
    ).filter(
        expire_date__gte=timezone.now(),
    )

    for session in other_sessions:
        if str(user.pk) == session.get_decoded().get("_auth_user_id"):
            session.delete()
