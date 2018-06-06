from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.exceptions import ObjectDoesNotExist

from helper import speed
from .models import Location, BusParameter


@receiver(pre_save, sender=Location)
def new_location_being_saved(sender, instance, *args, **kwargs):
    # values of new location through instance
    bus_number = instance.bus_number
    latitude = instance.latitude
    longitude = instance.longitude
    coord = (latitude, longitude)
    time_recorded = instance.time_recorded

    # get previous latest location of this bus number
    try:
        prev_location = Location.objects.filter(bus_number=bus_number).latest('time_recorded')
    except ObjectDoesNotExist:
        return
    prev_latitude = prev_location.latitude
    prev_longitude = prev_location.longitude
    prev_coord = (prev_latitude, prev_longitude)
    prev_time_recorded = prev_location.time_recorded

    # get busparam of this bus number
    try:
        bus_param = BusParameter.objects.get(bus_number=bus_number)
    except ObjectDoesNotExist:
        return

    # calculate new distace and speed
    distance_traveled = speed.get_distance_in_km(prev_coord, coord)
    total_distance_traveled = distance_traveled + bus_param.distance
    new_speed = speed.get_speed_in_kmph(prev_coord, coord, prev_time_recorded, time_recorded)

    # hook it up with busparam
    bus_param.speed = new_speed
    bus_param.distance = total_distance_traveled
    bus_param.save()

    return