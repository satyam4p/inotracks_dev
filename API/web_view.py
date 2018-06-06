from django.shortcuts import render, Http404, HttpResponse
import json
from Buses.models import *


def get_bus_location_ajax(request):
    user = request.user
    
    if user.is_authenticated():
        response_data = {}
        for count, bus in enumerate(Bus.objects.filter(owner=user).all()):
            response_data[count] = {
                'bus_number': bus.bus_number,
                'driver': bus.driver.name,
                'longitude': bus.location.longitude,
                'latitude': bus.location.latitude,
                'running_status': bus.running_status,
                'shifts': bus.shifts,
            }
        # print(response_data)
        return HttpResponse(
            json.dumps(response_data),
            content_type = "application/json"
            )
    else:
        return HttpResponse("Invalid Request")

def marker_update(request):
    user = request.user
    # print(user)
    if user.is_authenticated():
        try:
            bus_number = request.GET['bus_number']
            bus = Bus.objects.get(bus_number=bus_number)
            response_data = {
                'lat': bus.location.latitude,
                'lng': bus.location.longitude,
            }
            return HttpResponse(
                json.dumps(response_data),
                content_type = "application/json"
                )
        except:
            return HttpResponse("Invalid Request")
            pass
    else:
        return HttpResponse("Invalid Request")

def get_fuel_data(request):
    user = request.user
    if user.is_authenticated():
        response_data = {}
        for count, bus in enumerate(Bus.objects.filter(owner=user)):
            fuel_data = {}
            for fuel_count, bus_param in enumerate(
                    BusParameter.objects.filter(bus_number=bus.bus_number)):
                fuel_data[fuel_count] = {
                    'fuel': bus_param.fuel,
                    'time_recorded': str(bus_param.time_recorded)
                    }
            response_data[bus.bus_number] = fuel_data
        return HttpResponse(
                json.dumps(response_data),
                content_type = "application/json")
    else:
         return HttpResponse("Invalid Request")
