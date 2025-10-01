import logging
import uuid

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def add_many_to_many_relations(instance, related_data, related_fields_provided=dict):
    # todo: Review this related_fields_provided variable as it was enforced here but not changed in the calls.
    # todo: Because of that the param is empty, what whas the intention here?
    for field, items in related_data.items():  # pylint: disable=R1702
        if related_fields_provided[field]:
            model = getattr(instance, field)
            # Clear existing relations only if new data is provided for this field
            model.clear()

            if items is not None:
                for item in items:
                    obj = None
                    # Check if 'id' is present in the item and try to get the object by 'id'
                    if "id" in item:
                        try:
                            obj = model.model.objects.get(id=item["id"])
                        except model.model.DoesNotExist:
                            obj = None
                    # If 'id' is not present or object not found by 'id', try to get the object by other fields
                    if not obj:
                        try:
                            obj = model.model.objects.get(**item)
                        except model.model.MultipleObjectsReturned:
                            # Handle case where multiple objects are returned
                            obj = model.model.objects.filter(**item).first()
                        except model.model.DoesNotExist:
                            obj = None
                    # If object is still not found, create a new one
                    if not obj:
                        obj = model.model.objects.create(**item)
                    # Add the object to the many-to-many relation
                    model.add(obj)


def is_uuid(value):
    try:
        uuid.UUID(str(value))
        return True
    except ValueError:
        return False
