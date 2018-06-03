from geopy.distance import geodesic
import datetime


def get_distance_in_km(lprev, lnew):
    # l = (lat, lon) tuple

    distace = geodesic(lprev, lnew)
    distace_in_km = distace.km

    return distace_in_km


def get_speed_in_kmph(lprev, lnew, tprev, tnew):
    # l = (lat, lon) tuple of lattitude and logitude
    # t = datetime.datetime object

    distance_in_km = get_distance_in_km(lprev, lnew)

    diff = tnew - tprev
    diff_in_sec = diff.seconds
    diff_in_hr = diff_in_sec / 3600
    try:
    	speed_in_kmph = distance_in_km / diff_in_hr
    except:
        speed_in_kmph=0

    return speed_in_kmph
