from rest_framework import viewsets
from .models import (
    Airport, Route, Airline, Pilot, Flight, Passenger, Ticket, 
    Aircraft, CrewMember, FlightCrew, Gate, Runway, Baggage,
    Booking, Payment, DiscountCode, Maintenance, Delay, 
    WeatherReport, SecurityCheck
)
from .serializers import (
    AirportSerializer, RouteSerializer, AirlineSerializer, PilotSerializer,
    FlightSerializer, PassengerSerializer, TicketSerializer, 
    AircraftSerializer, CrewMemberSerializer, FlightCrewSerializer,
    GateSerializer, RunwaySerializer, BaggageSerializer, 
    BookingSerializer, PaymentSerializer, DiscountCodeSerializer,
    MaintenanceSerializer, DelaySerializer, WeatherReportSerializer, 
    SecurityCheckSerializer
)

class AirportViewSet(viewsets.ModelViewSet):
    queryset = Airport.objects.all()
    serializer_class = AirportSerializer


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer


class AirlineViewSet(viewsets.ModelViewSet):
    queryset = Airline.objects.all()
    serializer_class = AirlineSerializer


class PilotViewSet(viewsets.ModelViewSet):
    queryset = Pilot.objects.all()
    serializer_class = PilotSerializer


class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer


class PassengerViewSet(viewsets.ModelViewSet):
    queryset = Passenger.objects.all()
    serializer_class = PassengerSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer


class AircraftViewSet(viewsets.ModelViewSet):
    queryset = Aircraft.objects.all()
    serializer_class = AircraftSerializer


class CrewMemberViewSet(viewsets.ModelViewSet):
    queryset = CrewMember.objects.all()
    serializer_class = CrewMemberSerializer


class FlightCrewViewSet(viewsets.ModelViewSet):
    queryset = FlightCrew.objects.all()
    serializer_class = FlightCrewSerializer


class GateViewSet(viewsets.ModelViewSet):
    queryset = Gate.objects.all()
    serializer_class = GateSerializer


class RunwayViewSet(viewsets.ModelViewSet):
    queryset = Runway.objects.all()
    serializer_class = RunwaySerializer


class BaggageViewSet(viewsets.ModelViewSet):
    queryset = Baggage.objects.all()
    serializer_class = BaggageSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class DiscountCodeViewSet(viewsets.ModelViewSet):
    queryset = DiscountCode.objects.all()
    serializer_class = DiscountCodeSerializer


class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer


class DelayViewSet(viewsets.ModelViewSet):
    queryset = Delay.objects.all()
    serializer_class = DelaySerializer


class WeatherReportViewSet(viewsets.ModelViewSet):
    queryset = WeatherReport.objects.all()
    serializer_class = WeatherReportSerializer


class SecurityCheckViewSet(viewsets.ModelViewSet):
    queryset = SecurityCheck.objects.all()
    serializer_class = SecurityCheckSerializer
