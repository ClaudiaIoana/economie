from django.core.paginator import Paginator
from requests import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView

from event.models import Event
from event.serializers import EventSerializer


class EventList(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        # Get the instance of the event
        # if "user" in self.request.GET:
        #     user = int(self.request.GET["user"])
        # instance = self.get_object()
        #
        # # Check if the current user is the creator of the event
        # if user != instance.creator.id:
        #     return Response({'detail': 'You are not allowed to update this event.'}, status=status.HTTP_403_FORBIDDEN)

        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        events = Event.objects.all()
        request_data = self.request.GET
        if 'name' in request_data:
            events = events.filter(name__icontains=request_data['name'])
        if 'starting_date' in request_data:
            events = events.filter(starting_date__lt=request_data['starting_date'])
        if 'ending_date' in request_data:
            events = events.filter(ending_date__gt=request_data['ending_date'])
        if 'creator' in request_data:
            events = events.filter(creator=request_data['creator'])
        if 'capacity' in request_data:
            events = events.filter(capacity__gte=request_data['capacity'])
        if 'location' in request_data:
            events = events.filter(location__icontains=request_data['location'])
        page_number = request_data.get('page')

        if page_number:
            paginator = Paginator(events, 10)
            page_obj = paginator.get_page(page_number)
            events = page_obj.object_list
        return events

class EventUserView(APIView):

    def get(self, request, id):
        events = Event.objects.filter(creator=id)
        request_data = self.request.GET
        if 'name' in request_data:
            events = events.filter(name__icontains=request_data['name'])
        if 'starting_date' in request_data:
            events = events.filter(starting_date__lt=request_data['starting_date'])
        if 'ending_date' in request_data:
            events = events.filter(ending_date__gt=request_data['ending_date'])
        if 'creator' in request_data:
            events = events.filter(creator=request_data['creator'])
        if 'capacity' in request_data:
            events = events.filter(capacity__gte=request_data['capacity'])
        if 'location' in request_data:
            events = events.filter(location__icontains=request_data['location'])
        page_number = request_data.get('page')

        if page_number:
            paginator = Paginator(events, 10)
            page_obj = paginator.get_page(page_number)
            events = page_obj.object_list
        serializer = EventSerializer(events, many=True)
        return events