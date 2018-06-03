from django.apps import AppConfig


class BusesConfig(AppConfig):
    name = 'Buses'

    def ready(self):
        import Buses.signals
