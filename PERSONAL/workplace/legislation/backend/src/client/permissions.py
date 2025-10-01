from django.db.models import Q

from client.models import Client
from profiles.models import Profile


def check_approver_permission(user: Profile):
    """Check if the user is an approver"""
    if not user.groups.filter(name="approver").exists():
        return False
    return True


def check_preparer_or_approver_permission(user: Profile):
    """Check if the user is an approver or preparer"""
    if not user.groups.filter(Q(name="approver") | Q(name="preparer")).exists():
        return False
    return True


def check_add_new_team_member(request):
    """Check if the user has permission to update the team members"""
    if "team_members" in request.data and not check_approver_permission(request.user):
        return False
    return True


def check_pwc_member(user: Profile):
    """Check if the user is from PwC"""
    domain = user.email.split("@")[1]
    if domain == "pwc.com":
        return True
    return False


def check_test_user(user: Profile):
    """
    Any user without a client will be redirected to a default page.
    To prevent test users from not seeing anything, a TEST client is assigned.
    """
    if user.is_tester:
        client, _ = Client.objects.get_or_create(
            name="TEST",
            defaults={"domain": "test.example.com"},
        )

        # Add the user to the client’s team members if not already added
        client.team_members.add(user)

        # Optionally, you can save the client to persist changes
        client.save()


def check_client_allocation(user: Profile):
    """
    Checks if a user was allocated to the client of the same domain from their email.
    If not, it assigns the user to team_member and client_member.
    If no client exists with that domain, a new client is created.
    """
    # Extract the domain part of the user's email
    user_email_domain = user.email.split("@")[-1]

    try:
        client = Client.objects.get(domain=user_email_domain)

    except Client.DoesNotExist:
        # If client does not exist, create a new client with a name based on the domain
        client_name = user_email_domain.replace(".com", "")
        client = Client.objects.create(name=client_name, domain=user_email_domain)

    if user not in client.client_members.all() and user_email_domain != "pwc.com":
        client.client_members.add(user)

    client.save()


def is_team_member(user, obj: Client):
    """
    Checks if the given user is a team member of the object..
    """
    return user in obj.team_members.all()
