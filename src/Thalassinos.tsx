"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { saveAs } from "file-saver";

export default function Thalassinos() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [customerName, setCustomerName] = useState("");
  const [service, setService] = useState("");
  const [note, setNote] = useState("");

  const downloadICS = () => {
    const title = encodeURIComponent(service || "Appointment");
    const description = encodeURIComponent(note || "");
    const formattedDate = format(selectedDate, "yyyyMMdd'T'HHmmss");
    const dtEnd = format(new Date(selectedDate.getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss");
    const content = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
DTSTART:${formattedDate}
DTEND:${dtEnd}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    saveAs(blob, "appointment.ics");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Thalassinos Beauty</h1>
      <Tabs defaultValue="booking" className="w-full max-w-xl">
        <TabsList className="flex justify-around mb-4">
          <TabsTrigger value="booking">Book</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="booking">
          <Card>
            <CardContent className="space-y-4 p-4">
              <Input placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <Input placeholder="Service (e.g., Haircut)" value={service} onChange={(e) => setService(e.target.value)} />
              <Textarea placeholder="Notes" value={note} onChange={(e) => setNote(e.target.value)} />
              <Calendar selected={selectedDate} onSelect={setSelectedDate} />
              <Button onClick={downloadICS}>Download Booking</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="about">
          <Card>
            <CardContent className="p-4">
              <p>Welcome to Thalassinos Beauty! Book services, download your appointment and glow!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
