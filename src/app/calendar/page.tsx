
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarDays, Tag, Users, Briefcase, LinkIcon, UserCircle } from "lucide-react";
import type { CalendarEvent, CalendarEventType, EventTypeConfig } from "@/lib/types";
import { initialProjects, initialClients, initialConsultants } from "@/lib/mockData";
import { EVENT_TYPE_CONFIG } from '@/lib/constants';
import { format, parseISO, isSameDay, startOfDay, endOfDay, parse } from 'date-fns';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [filterState, setFilterState] = useState<Record<CalendarEventType, boolean>>({
    'Project Milestone': true,
    'Project Deadline': true,
    'Client Meeting': true,
    'Consultant Assignment': true,
    'General Task': true,
    'Holiday': true,
    'Other': true,
  });

  useEffect(() => {
    const aggregatedEvents: CalendarEvent[] = [];

    // Process Projects for Milestones and Deadlines
    initialProjects.forEach(project => {
      project.milestones?.forEach(milestone => {
        aggregatedEvents.push({
          id: `milestone-${project.id}-${milestone.id}`,
          title: `${project.name}: ${milestone.name}`,
          start: parseISO(milestone.dueDate),
          allDay: true,
          type: 'Project Milestone',
          description: milestone.description || `Milestone for project ${project.name}`,
          source: 'project',
          sourceId: project.id,
          relatedLink: `/projects/${project.id}`,
        });
      });
      aggregatedEvents.push({
        id: `deadline-${project.id}`,
        title: `${project.name} - Deadline`,
        start: parseISO(project.endDate),
        allDay: true,
        type: 'Project Deadline',
        description: `Final deadline for project ${project.name}.`,
        source: 'project',
        sourceId: project.id,
        relatedLink: `/projects/${project.id}`,
      });
    });

    // Process Clients for Meetings
    initialClients.forEach(client => {
      client.meetings?.forEach((meeting, index) => {
        let startDateTime = parseISO(meeting.date);
        let endDateTime;
        if (meeting.time) {
            const [hours, minutes] = meeting.time.split(':').map(Number);
            startDateTime.setHours(hours, minutes, 0, 0);
        }
         if (meeting.endDate) {
            endDateTime = parseISO(meeting.endDate);
            if(meeting.endTime) {
                 const [endHours, endMinutes] = meeting.endTime.split(':').map(Number);
                 endDateTime.setHours(endHours, endMinutes, 0, 0);
            }
        }

        aggregatedEvents.push({
          id: `meeting-${client.id}-${meeting.id || index}`,
          title: meeting.title || `Meeting with ${client.companyName}`,
          start: startDateTime,
          end: endDateTime,
          allDay: !meeting.time,
          type: 'Client Meeting',
          description: meeting.description || `Meeting related to ${client.companyName}.`,
          source: 'client',
          sourceId: client.id,
          relatedLink: `/clients/${client.id}`,
          attendees: meeting.attendees,
          location: meeting.location,
        });
      });
    });

    // Process Consultants for Assignments
    initialConsultants.forEach(consultant => {
      if (consultant.currentProject && consultant.status === 'On Project') {
        const assignedProject = initialProjects.find(p => p.id === consultant.currentProject);
        if (assignedProject) {
          aggregatedEvents.push({
            id: `assignment-${consultant.id}-${assignedProject.id}`,
            title: `${consultant.name} on ${assignedProject.name}`,
            start: parseISO(assignedProject.startDate),
            end: parseISO(assignedProject.endDate), // Assignments are typically ranges
            allDay: true, // Assuming full-day assignments for simplicity
            type: 'Consultant Assignment',
            description: `${consultant.name} assigned to project ${assignedProject.name}.`,
            source: 'consultant',
            sourceId: consultant.id,
            relatedLink: `/consultants/${consultant.id}`,
          });
        }
      }
    });
    setAllEvents(aggregatedEvents);
  }, []);

  const handleFilterChange = (type: CalendarEventType) => {
    setFilterState(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => filterState[event.type]);
  }, [allEvents, filterState]);

  const eventsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return filteredEvents.filter(event => 
        isSameDay(event.start, selectedDate) || 
        (event.end && selectedDate >= startOfDay(event.start) && selectedDate <= endOfDay(event.end))
    ).sort((a,b) => a.start.getTime() - b.start.getTime());
  }, [selectedDate, filteredEvents]);

  const dayModifiers = useMemo(() => {
    const modifiers: Record<string, Date[]> = {};
    filteredEvents.forEach(event => {
      const modifierKey = `event-${event.type.replace(/\s+/g, '-').toLowerCase()}`;
      if (!modifiers[modifierKey]) {
        modifiers[modifierKey] = [];
      }
      modifiers[modifierKey].push(event.start);
      // For multi-day events, ideally, we'd mark all days in range.
      // react-day-picker handles ranges for 'selected' or custom range modifiers.
      // For simple dot indicators on start dates:
      // if (event.end && !isSameDay(event.start, event.end)) {
      //   // Could add logic here if needed to mark all days in a range
      // }
    });
    return modifiers;
  }, [filteredEvents]);

  const dayModifiersClassNames = useMemo(() => {
    const classNames: Record<string, string> = {};
    Object.keys(EVENT_TYPE_CONFIG).forEach(typeKey => {
      const eventType = typeKey as CalendarEventType;
      const config = EVENT_TYPE_CONFIG[eventType];
      // Base class for the dot container
      classNames[`event-${eventType.replace(/\s+/g, '-').toLowerCase()}`] = 
        `day-with-event relative before:content-[''] before:absolute before:left-1/2 before:-bottom-1.5 before:-translate-x-1/2 before:w-1.5 before:h-1.5 before:rounded-full ${config.color}`;
    });
    return classNames;
  }, []);
  
  const renderDayContent = (day: Date) => {
    const dayEvents = filteredEvents.filter(event => isSameDay(event.start, day));
    if (dayEvents.length === 0) return <>{format(day, 'd')}</>;

    const uniqueEventTypesOnDay = Array.from(new Set(dayEvents.map(e => e.type)));

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {format(day, 'd')}
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex space-x-0.5">
          {uniqueEventTypesOnDay.slice(0,3).map(eventType => ( // Max 3 dots
            <span
              key={eventType}
              className={`block w-1.5 h-1.5 rounded-full ${EVENT_TYPE_CONFIG[eventType]?.color || 'bg-gray-400'}`}
            />
          ))}
        </div>
      </div>
    );
  };


  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarDays className="h-8 w-8 text-primary" />
            Unified Calendar
          </h1>
          <p className="text-muted-foreground">
            View and manage schedules, appointments, and project timelines.
          </p>
        </div>
        {/* Placeholder for "Add Event" button in future */}
        {/* <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button> */}
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Event Filters</CardTitle>
          <CardDescription>Select event types to display on the calendar.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-6 gap-y-3">
          {Object.entries(EVENT_TYPE_CONFIG).map(([type, config]) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`filter-${type}`}
                checked={filterState[type as CalendarEventType]}
                onCheckedChange={() => handleFilterChange(type as CalendarEventType)}
                className={`border-2 ${config.borderColor || 'border-gray-300'}`}
                style={{backgroundColor: filterState[type as CalendarEventType] ? `hsl(var(--${config.color.split('-')[1]}-hsl))` : 'transparent'}}
              />
              <Label htmlFor={`filter-${type}`} className="flex items-center gap-2 cursor-pointer">
                <span className={`w-3 h-3 rounded-sm ${config.color}`}></span>
                {config.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardContent className="p-0 md:p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full p-0"
              classNames={{
                day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md',
                day_today: 'bg-accent text-accent-foreground rounded-md font-bold',
                caption_label: "text-lg font-medium",
                head_cell: "w-full",
                table: "w-full", 
                // cell: "w-full aspect-square", // Makes cells square, adjust based on preference
              }}
              modifiers={dayModifiers}
              // modifiersClassNames={dayModifiersClassNames} // Using renderDayContent for more control over dots
              renderDayContent={renderDayContent}
              numberOfMonths={1}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle>
              Events on: {selectedDate ? format(selectedDate, 'PPP') : 'Select a date'}
            </CardTitle>
            <CardDescription>Details for the selected day.</CardDescription>
          </CardHeader>
          <ScrollArea className="h-[400px] lg:h-[calc(100%-7rem)]"> {/* Adjust height as needed */}
            <CardContent className="space-y-3">
              {eventsOnSelectedDate.length > 0 ? (
                eventsOnSelectedDate.map(event => (
                  <div key={event.id} className="p-3 border rounded-md hover:shadow-md transition-shadow bg-card/80">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm leading-tight">{event.title}</h4>
                        <Badge 
                            variant="outline" 
                            className={cn(
                                `text-xs px-2 py-0.5 ${EVENT_TYPE_CONFIG[event.type]?.textColor || 'text-foreground'} ${EVENT_TYPE_CONFIG[event.type]?.borderColor || 'border-muted'}`,
                                EVENT_TYPE_CONFIG[event.type]?.color
                            )}
                        >
                            {EVENT_TYPE_CONFIG[event.type]?.label || event.type}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {event.allDay ? 'All day' : 
                       `${format(event.start, 'p')}${event.end ? ` - ${format(event.end, 'p')}` : ''}`}
                    </p>
                    {event.description && <p className="text-xs text-muted-foreground mb-1.5">{event.description}</p>}
                    
                    <div className="flex flex-wrap gap-2 text-xs mt-1.5">
                        {event.attendees && event.attendees.length > 0 && (
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="flex items-center text-muted-foreground gap-1"><Users className="h-3.5 w-3.5"/> {event.attendees.length}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{event.attendees.join(', ')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {event.location && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="flex items-center text-muted-foreground gap-1"><Briefcase className="h-3.5 w-3.5"/> {event.location.substring(0,20)}{event.location.length > 20 && '...'}</span>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{event.location}</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {event.relatedLink && (
                           <Button variant="link" size="sm" asChild className="h-auto p-0 text-xs">
                             <a href={event.relatedLink} target="_blank" rel="noopener noreferrer">
                               <LinkIcon className="mr-1 h-3 w-3" /> View Details
                             </a>
                           </Button>
                        )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No events scheduled for this day.</p>
              )}
            </CardContent>
          </ScrollArea>
          <CardFooter className="text-xs text-muted-foreground pt-4 border-t">
            All times are displayed in your local timezone.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
