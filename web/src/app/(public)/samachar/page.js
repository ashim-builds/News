import SamacharClient from "./SamacharClient";

export const metadata = {
  title: "समाचार | स्मार्टसञ्चार",
  description: "नेपालका ताजा र भरपर्दा समाचारहरू। राजनीति, खेलकुद, प्रविधि, शिक्षा र अन्य विषयका समाचार।",
};

export default function SamacharPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
                        <main className="flex-1">
        <SamacharClient />
      </main>
          </div>
  );
}
