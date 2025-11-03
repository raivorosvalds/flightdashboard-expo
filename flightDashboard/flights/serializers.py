from rest_framework import serializers
from .models import (
    Airport, Route, Airline, Pilot, Flight, Passenger, Ticket,
    Aircraft, CrewMember, FlightCrew, Gate, Runway, Baggage,
    Booking, Payment, DiscountCode, Maintenance, Delay,
    WeatherReport, SecurityCheck
)

class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = '__all__'


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'


class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = '__all__'


class PilotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pilot
        fields = '__all__'


class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'


class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'


class AircraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aircraft
        fields = '__all__'


class CrewMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrewMember
        fields = '__all__'


class FlightCrewSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlightCrew
        fields = '__all__'


class GateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gate
        fields = '__all__'


class RunwaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Runway
        fields = '__all__'


class BaggageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Baggage
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class DiscountCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountCode
        fields = '__all__'


class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields = '__all__'


class DelaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delay
        fields = '__all__'


class WeatherReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherReport
        fields = '__all__'


class SecurityCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityCheck
        fields = '__all__'
