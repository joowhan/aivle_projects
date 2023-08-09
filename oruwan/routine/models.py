from django.db import models
from oruwanaccount.models import User

class Routine(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    routine_name = models.CharField(max_length=100)
    routine_start_date = models.DateField()
    routine_end_date = models.DateField()
    routine_start_time = models.TimeField()
    routine_end_time = models.TimeField()
    completed_routines = models.BooleanField(default=False)
    cycle = models.PositiveIntegerField(default=1)