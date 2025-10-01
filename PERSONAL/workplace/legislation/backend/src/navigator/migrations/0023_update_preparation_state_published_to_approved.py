from django.db import migrations


def update_published_to_approved(apps, schema_editor):
    Legislation = apps.get_model("navigator", "Legislation")
    Legislation.objects.filter(preparation_state="PUBLISHED").update(preparation_state="APPROVED")


class Migration(migrations.Migration):

    dependencies = [
        ("navigator", "0022_alter_legislation_preparation_state"),
    ]

    operations = [
        migrations.RunPython(update_published_to_approved),
    ]
