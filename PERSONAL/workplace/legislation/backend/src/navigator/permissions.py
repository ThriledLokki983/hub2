from rest_framework import permissions

from navigator.models import Legislation


class CanChangePreparationState(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        transitions = {
            "preparer": {
                Legislation.PreparationState.CREATED: [
                    Legislation.PreparationState.IN_REVIEW,
                    Legislation.PreparationState.CREATED,
                ],
                Legislation.PreparationState.IN_REVIEW: [
                    Legislation.PreparationState.CREATED,
                    Legislation.PreparationState.IN_REVIEW,
                ],
            },
            "approver": {
                Legislation.PreparationState.CREATED: [
                    Legislation.PreparationState.IN_REVIEW,
                    Legislation.PreparationState.APPROVED,
                    Legislation.PreparationState.CREATED,
                ],
                Legislation.PreparationState.IN_REVIEW: [
                    Legislation.PreparationState.CREATED,
                    Legislation.PreparationState.APPROVED,
                    Legislation.PreparationState.IN_REVIEW,
                ],
                Legislation.PreparationState.APPROVED: [
                    Legislation.PreparationState.IN_REVIEW,
                    Legislation.PreparationState.CREATED,
                    Legislation.PreparationState.APPROVED,
                ],
            },
        }

        new_state = request.data.get("preparation_state")
        if not new_state:
            return True  # Allow changes to other fields

        user_groups = request.user.groups.values_list("name", flat=True)
        for group in user_groups:
            if group in transitions and obj.preparation_state in transitions[group]:
                if new_state in transitions[group][obj.preparation_state]:
                    return True

        return False
