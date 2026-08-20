import ArthaClient from "./ArthaClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "अर्थ / कृषि | स्मार्टसञ्चार",
  description: "नेपालका अर्थ, कृषि, बैंकिङ, सुन/चाँदी, विनिमयदर, शेयर बजार र व्यापारसँग सम्बन्धित ताजा समाचार।",
};

export default function ArthaPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-1">
        <ArthaClient />
      </main>
    </div>
  );
}
