from django.db import models
from users.models import InoDriver
from django.utils.translation import ugettext_lazy as _

# Create your models here.


class UpdateStatus(models.Model):
    bus_number = models.CharField(max_length=100)
    previous_driver = models.ForeignKey(InoDriver, related_name="PreviousDriver")
    new_driver = models.ForeignKey(InoDriver, related_name="NewDriver")
    # previous_driver_name = models.CharField(_('Previous Driver Name'), max_length=130, blank=True)
    # new_driver_name = models.CharField(_('New Driver Name'), max_length=130, blank=True)
    # phone_number = models.BigIntegerField(null=True, blank=True)
    departure_time = models.DateTimeField()

    # def save(self, mode, *args, **kwargs):
    #     if mode == "allot":
    #     elif mode == "maintain":
    #         pass
    #     super(UpdateStatus, self).save(*args, **kwargs)