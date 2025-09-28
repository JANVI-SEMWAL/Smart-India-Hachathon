import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: string;
  attendees: number;
  rating: number;
  featured: boolean;
  tags: string[];
  eventType?: string;
  culturalSignificance?: string;
  activities?: string[];
  duration?: string;
  ageGroup?: string;
  language?: string;
}

interface Calendar2025Props {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const Calendar2025: React.FC<Calendar2025Props> = ({ events, onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = January, 11 = December
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get days in month and starting day of week
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const formatDate = (month: number, day: number) => {
    const year = 2025;
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMonth(prev => prev > 0 ? prev - 1 : 11);
    } else {
      setCurrentMonth(prev => prev < 11 ? prev + 1 : 0);
    }
  };

  const renderCalendar = () => {
    const year = 2025;
    const daysInMonth = getDaysInMonth(currentMonth, year);
    const firstDay = getFirstDayOfMonth(currentMonth, year);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(currentMonth, day);
      const dayEvents = getEventsForDate(dateString);
      const isSelected = selectedDate === dateString;
      const isToday = dateString === new Date().toISOString().split('T')[0];

      days.push(
        <div
          key={day}
          className={`h-12 border border-border/20 p-1 cursor-pointer transition-all hover:bg-accent/50 ${
            isSelected ? 'bg-primary text-primary-foreground' : ''
          } ${isToday ? 'ring-2 ring-primary/50' : ''}`}
          onClick={() => setSelectedDate(dateString)}
        >
          <div className="flex items-center justify-between h-full">
            <span className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <div className="flex flex-col gap-0.5">
                {dayEvents.slice(0, 2).map((event, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      event.featured ? 'bg-yellow-500' : 'bg-primary'
                    }`}
                    title={event.title}
                  />
                ))}
                {dayEvents.length > 2 && (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" title={`+${dayEvents.length - 2} more events`} />
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">
          {months[currentMonth]} 2025
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            disabled={currentMonth === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            disabled={currentMonth === 11}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card className="travel-card">
            <CardContent className="p-6">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Regular Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-muted-foreground">Featured Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                  <span className="text-muted-foreground">More Events</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Events */}
        <div className="lg:col-span-1">
          <Card className="travel-card h-fit">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                {selectedDate ? (
                  <>
                    Events on {new Date(selectedDate).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </>
                ) : (
                  'Select a date to view events'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map(event => (
                    <div
                      key={event.id}
                      className="border border-border/50 rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => onEventClick?.(event)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-foreground text-sm line-clamp-2">
                            {event.title}
                          </h4>
                          <Badge className="bg-primary/10 text-primary text-xs">
                            {event.price}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{event.attendees} going</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {event.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No events scheduled for this date</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Click on a date to view events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar2025;
