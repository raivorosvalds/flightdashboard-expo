from django.contrib import admin
from django.urls import path
from django.urls import path, include
from rest_framework import routers
from flights.views import (
    AirportViewSet, RouteViewSet, AirlineViewSet, PilotViewSet, 
    FlightViewSet, PassengerViewSet, TicketViewSet, AircraftViewSet, 
    CrewMemberViewSet, FlightCrewViewSet, GateViewSet, 
    RunwayViewSet, BaggageViewSet, BookingViewSet, 
    PaymentViewSet, DiscountCodeViewSet, MaintenanceViewSet, 
    DelayViewSet, WeatherReportViewSet, SecurityCheckViewSet
)

# Create a router and register our viewsets with it
router = routers.DefaultRouter()
router.register(r'airports', AirportViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'airlines', AirlineViewSet)
router.register(r'pilots', PilotViewSet)
router.register(r'flights', FlightViewSet)
router.register(r'passengers', PassengerViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'aircrafts', AircraftViewSet)
router.register(r'crew_members', CrewMemberViewSet)
router.register(r'flight_crews', FlightCrewViewSet)
router.register(r'gates', GateViewSet)
router.register(r'runways', RunwayViewSet)
router.register(r'baggage', BaggageViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'discount_codes', DiscountCodeViewSet)
router.register(r'maintenances', MaintenanceViewSet)
router.register(r'delays', DelayViewSet)
router.register(r'weather_reports', WeatherReportViewSet)
router.register(r'security_checks', SecurityCheckViewSet)

# Wire up our API using automatic URL routing.
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
