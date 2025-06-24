import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format, isWithinInterval, subDays, addDays } from "date-fns";
import { saveAs } from 'file-saver';

export default function Thalassinos() {
  const [lang, setLang] = useState("en");
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);

  const t = {
    en: {
      title: "Thalassinos - Nea Plagia, Chalkidiki",
      subtitle: "Seaside Taverna | Greek Cuisine | Est. 1985",
      menu: "Menu",
      book: "Book a Table",
      gallery: "Gallery",
      about: "Our Story",
      menuIntro: "Explore our authentic Greek seafood dishes, meze, fresh salads, and house specials.",
      bookTitle: "Book a Table",
      name: "Your Name",
      email: "Your Email",
      msg: "Message or special request",
      bookNow: "Book Now",
      galleryIntro: "Coming soon: Enjoy a visual taste of the sea and our cuisine.",
      aboutText: "Since 1985, Thalassinos has welcomed locals and travelers to experience the flavors of the Aegean. Nestled by the shore in Nea Plagia, our family-run taverna celebrates Greek hospitality, fresh ingredients, and cherished traditions passed through generations.",
      footer: "All rights reserved."
    },
    gr: {
      title: "Θαλασσινός - Νέα Πλάγια, Χαλκιδική",
      subtitle: "Παραθαλάσσια Ταβέρνα | Ελληνική Κουζίνα | Από το 1985",
      menu: "Μενού",
      book: "Κράτηση",
      gallery: "Γκαλερί",
      about: "Η Ιστορία μας",
      menuIntro: "Ανακαλύψτε αυθεντικά ελληνικά πιάτα θαλασσινών, μεζέδες, φρέσκες σαλάτες και σπεσιαλιτέ.",
      bookTitle: "Κράτηση Τραπεζιού",
      name: "Το Όνομά σας",
      email: "Το Email σας",
      msg: "Μήνυμα ή ειδικό αίτημα",
      bookNow: "Κράτηση",
      galleryIntro: "Σύντομα κοντά σας: Ζήστε τη θάλασσα και την κουζίνα μέσα από εικόνες.",
      aboutText: "Από το 1985, ο Θαλασσινός καλωσορίζει ντόπιους και ταξιδιώτες να ζήσουν τις γεύσεις του Αιγαίου. Δίπλα στη θάλασσα στη Νέα Πλάγια, η οικογενειακή μας ταβέρνα τιμά τη φιλοξενία, τα φρέσκα υλικά και τις παραδόσεις μας.",
      footer: "Όλα τα δικαιώματα διατηρούνται."
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const filtered = bookings.filter(b => isWithinInterval(new Date(b.date), {
        start: subDays(new Date(), 3),
        end: addDays(new Date(), 3)
      }));

      if (filtered.length > 0) {
        const csv = `Date,Name,Email,Message\n` + filtered.map(b => `${b.date},${b.name},${b.email},${b.message}`).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        saveAs(blob, `thalassinos-bookings-${format(new Date(), 'yyyyMMdd')}.csv`);

        // Note: sending the email must be handled server-side
      }
    }, 3600000); // every hour
    return () => clearInterval(interval);
  }, [bookings]);

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 font-sans">
      <header className="bg-white shadow p-6 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t[lang].title}</h1>
            <p className="text-sm mt-1">{t[lang].subtitle}</p>
          </div>
          <Button variant="ghost" onClick={() => setLang(lang === 'en' ? 'gr' : 'en')}>
            {lang === 'en' ? 'GR' : 'EN'}
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid grid-cols-4 bg-white mb-4 shadow rounded">
            <TabsTrigger value="menu">{t[lang].menu}</TabsTrigger>
            <TabsTrigger value="book">{t[lang].book}</TabsTrigger>
            <TabsTrigger value="gallery">{t[lang].gallery}</TabsTrigger>
            <TabsTrigger value="about">{t[lang].about}</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <Card>
              <CardContent className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{t[lang].menu}</h2>
                <p>{t[lang].menuIntro}</p>
                <ul className="list-disc pl-5">
                  <li>Grilled Octopus</li>
                  <li>Fresh Fried Calamari</li>
                  <li>Greek Salad with Feta</li>
                  <li>Moussaka</li>
                  <li>Catch of the Day</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="book">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">{t[lang].bookTitle}</h2>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded border" />
                <Input placeholder={t[lang].name} value={name} onChange={e => setName(e.target.value)} />
                <Input type="email" placeholder={t[lang].email} value={email} onChange={e => setEmail(e.target.value)} />
                <Textarea placeholder={t[lang].msg} value={message} onChange={e => setMessage(e.target.value)} />
                <Button onClick={() => {
                  const newBooking = { date: format(date, 'yyyy-MM-dd'), name, email, message };
                  setBookings([...bookings, newBooking]);
                  alert(`${t[lang].bookNow}: ${format(date, 'PPP')}`);
                }}>
                  {t[lang].bookNow}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardContent className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{t[lang].gallery}</h2>
                <p>{t[lang].galleryIntro}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-100 h-32 rounded shadow" />
                  <div className="bg-blue-100 h-32 rounded shadow" />
                  <div className="bg-blue-100 h-32 rounded shadow" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardContent className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{t[lang].about}</h2>
                <p>{t[lang].aboutText}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white p-4 text-center shadow-inner mt-10">
        <p className="text-sm">© {new Date().getFullYear()} Thalassinos Taverna. {t[lang].footer}</p>
      </footer>
    </div>
  );
}
