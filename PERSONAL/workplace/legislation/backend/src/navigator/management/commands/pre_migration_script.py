# pylint: disable=R1710
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.core.management.base import BaseCommand
from django.db import DatabaseError

from navigator.models import Legislation


class Command(BaseCommand):
    help = "Capture current relationships before migration (many-to-many)"
    data = None  # Store data as an instance attribute

    def handle(self, *args, **kwargs):
        self.data = {}

        # Capture the many-to-many relationships
        for legislation in Legislation.objects.all():
            legislation_id = legislation.id  # Ensure legislation_id is treated as an integer for consistency
            self.data[legislation_id] = {
                "registration_requirements": self.get_many_to_many_data(legislation, "registration_requirements"),
                "regulatory_requirements": self.get_many_to_many_data(legislation, "regulatory_requirements"),
                "reporting_requirements": self.get_many_to_many_data(legislation, "reporting_requirements"),
            }

        self.stdout.write(self.style.SUCCESS("Captured current relationships (many-to-many) successfully."))

    def get_many_to_many_data(self, legislation, relation_name):
        """
        Helper function to capture many-to-many relationship data.
        Returns a list of dictionaries with 'id' and 'description_first_5_words'.
        """
        try:
            # Get the many-to-many related manager dynamically using getattr
            related_objects = getattr(legislation, relation_name).all()

            # Check if the relation has no objects and log a warning if so
            if not related_objects.exists():
                self.stdout.write(
                    self.style.WARNING(f"Legislation {legislation.id}: No {relation_name.replace('_', ' ')} found.")
                )

            return [
                {"id": req.id, "description_first_5_words": " ".join(req.description.split()[:5])}
                for req in related_objects
            ]
        except ObjectDoesNotExist:
            self.stdout.write(
                self.style.ERROR(f"{relation_name.replace('_', ' ')} not found for legislation {legislation.id}.")
            )
        except MultipleObjectsReturned:
            self.stdout.write(
                self.style.ERROR(f"Multiple {relation_name.replace('_', ' ')} found for legislation {legislation.id}.")
            )
        except DatabaseError as db_error:
            self.stdout.write(
                self.style.ERROR(
                    f"Database error retrieving {relation_name.replace('_', ' ')}"
                    f" for legislation {legislation.id}: {str(db_error)}"
                )
            )
