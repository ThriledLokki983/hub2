# pylint: disable=C0301, R0913
from django.core.management import call_command
from django.core.management.base import BaseCommand

from navigator.management.commands.post_migration_script import Command as PostMigrationCommand
from navigator.management.commands.pre_migration_script import Command as PreMigrationCommand


class Command(BaseCommand):
    help = "Compare relationships before and after migration"

    def handle(self, *args, **kwargs):
        # Run pre-migration command and get data from its instance attribute
        pre_migration_cmd = PreMigrationCommand()
        call_command(pre_migration_cmd)
        pre_migration_data = pre_migration_cmd.data

        # Run post-migration command and get data from its instance attribute
        post_migration_cmd = PostMigrationCommand()
        call_command(post_migration_cmd)
        post_migration_data = post_migration_cmd.data

        if pre_migration_data is None or post_migration_data is None:
            self.stdout.write(self.style.ERROR("Failed to retrieve pre- or post-migration data."))
            return

        discrepancies = []

        # Compare the two data structures
        for legislation_id, relationships_before in pre_migration_data.items():
            legislation_id_int = int(legislation_id)  # Ensure legislation_id is treated as an integer
            relationships_after = post_migration_data.get(legislation_id_int)

            if relationships_after is None:
                discrepancies.append(
                    f"Legislation {legislation_id_int} exists in pre-migration, but is missing in post-migration."
                )
                continue

            # Check registration requirements
            self.compare_requirements(
                legislation_id_int,
                "registration_requirements",
                relationships_before["registration_requirements"],
                relationships_after["registration_requirements"],
                discrepancies,
            )

            # Check regulatory requirements
            self.compare_requirements(
                legislation_id_int,
                "regulatory_requirements",
                relationships_before["regulatory_requirements"],
                relationships_after["regulatory_requirements"],
                discrepancies,
            )

            # Check reporting requirements
            self.compare_requirements(
                legislation_id_int,
                "reporting_requirements",
                relationships_before["reporting_requirements"],
                relationships_after["reporting_requirements"],
                discrepancies,
            )

        # Output results with detailed information
        if discrepancies:
            self.stdout.write(self.style.ERROR("Discrepancies found:"))
            for discrepancy in discrepancies:
                self.stdout.write(self.style.ERROR(discrepancy))
        else:
            self.stdout.write(self.style.SUCCESS("No discrepancies found. The migration was successful."))

    def compare_requirements(self, legislation_id, requirement_type, pre_reqs, post_reqs, discrepancies):
        """
        Helper function to compare requirements before and after migration.
        """
        pre_req_ids = {req["id"] for req in pre_reqs}
        post_req_ids = {req["id"] for req in post_reqs}

        # Find requirements missing post-migration
        missing_reqs = pre_req_ids - post_req_ids
        for req_id in missing_reqs:
            discrepancies.append(
                f"Legislation {legislation_id}: {requirement_type.replace('_', ' ').capitalize()} requirement {req_id} "
                f"exists in pre-migration, but is missing in post-migration."
            )

        # Find any mismatched descriptions (if IDs match but descriptions differ)
        for req_before in pre_reqs:
            req_after = next((req for req in post_reqs if req["id"] == req_before["id"]), None)
            if req_after and req_before["description_first_5_words"] != req_after["description_first_5_words"]:
                discrepancies.append(
                    f"Legislation {legislation_id}: {requirement_type.replace('_', ' ').capitalize()} requirement {req_before['id']} "
                    f"has mismatched descriptions. Pre-migration: '{req_before['description_first_5_words']}', "
                    f"Post-migration: '{req_after['description_first_5_words']}'"
                )
