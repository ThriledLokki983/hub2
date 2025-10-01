# pylint: disable=W0718
from django.core.management.base import BaseCommand

from navigator.models import Legislation, RegistrationRequirement, RegulatoryRequirement, ReportingRequirement


class Command(BaseCommand):
    help = "Capture relationships after migration (foreign keys)"
    data = None  # Store data as an instance attribute

    def handle(self, *args, **kwargs):
        self.data = {}

        # Capture the foreign key relationships
        for legislation in Legislation.objects.all():
            legislation_id = legislation.id  # Ensure the ID is an integer for consistency
            self.data[legislation_id] = {
                "registration_requirements": [],
                "regulatory_requirements": [],
                "reporting_requirements": [],
            }

            # Handle registration requirements (foreign key relationship)
            try:
                registration_reqs = RegistrationRequirement.objects.filter(legislation=legislation)
                if not registration_reqs.exists():
                    self.stdout.write(
                        self.style.WARNING(
                            f"Legislation {legislation_id}: No registration requirements found post-migration."
                        )
                    )
                self.data[legislation_id]["registration_requirements"] = [
                    {"id": req.id, "description_first_5_words": " ".join(req.description.split()[:5])}
                    for req in registration_reqs
                ]
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"Error retrieving registration requirements for legislation {legislation_id}: {str(e)}"
                    )
                )

            # Handle regulatory requirements (foreign key relationship)
            try:
                regulatory_reqs = RegulatoryRequirement.objects.filter(legislation=legislation)
                if not regulatory_reqs.exists():
                    self.stdout.write(
                        self.style.WARNING(
                            f"Legislation {legislation_id}: No regulatory requirements found post-migration."
                        )
                    )
                self.data[legislation_id]["regulatory_requirements"] = [
                    {"id": req.id, "description_first_5_words": " ".join(req.description.split()[:5])}
                    for req in regulatory_reqs
                ]
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"Error retrieving regulatory requirements for legislation {legislation_id}: {str(e)}"
                    )
                )

            # Handle reporting requirements (foreign key relationship)
            try:
                reporting_reqs = ReportingRequirement.objects.filter(legislation=legislation)
                if not reporting_reqs.exists():
                    self.stdout.write(
                        self.style.WARNING(
                            f"Legislation {legislation_id}: No reporting requirements found post-migration."
                        )
                    )
                self.data[legislation_id]["reporting_requirements"] = [
                    {"id": req.id, "description_first_5_words": " ".join(req.description.split()[:5])}
                    for req in reporting_reqs
                ]
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"Error retrieving reporting requirements for legislation {legislation_id}: {str(e)}"
                    )
                )

        self.stdout.write(self.style.SUCCESS("Captured relationships (foreign keys) after migration successfully."))
