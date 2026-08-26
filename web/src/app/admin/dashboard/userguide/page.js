"use client";

import { motion } from "framer-motion";
import { BookOpen, Layers, Newspaper, Video, Megaphone, Users, Shield } from "lucide-react";

export default function UserGuidePage() {
  const sections = [
    {
      title: "मुख्य नियन्त्रण (Dashboard)",
      icon: <Layers className="text-blue-500" size={24} />,
      content: "ड्यासबोर्डमा तपाईंले वेबसाइटको समग्र विवरण (समाचार संख्या, भिडियो, विज्ञापन आदि) देख्न सक्नुहुन्छ। यहाँबाट तपाईं सेटिङ्स र अन्य पेजहरूमा जान सक्नुहुन्छ।"
    },
    {
      title: "समाचार व्यवस्थापन (Articles)",
      icon: <Newspaper className="text-green-500" size={24} />,
      content: "यहाँबाट तपाईं नयाँ समाचार थप्न, सम्पादन गर्न र मेटाउन सक्नुहुन्छ। समाचारलाई विभिन्न कोटी (Category) मा राख्न पनि मिल्छ।"
    },
    {
      title: "भिडियो ग्यालरी (Videos)",
      icon: <Video className="text-red-500" size={24} />,
      content: "वेबसाइटमा देखिने भिडियोहरूको लिङ्क (YouTube आदि) यहाँ थप्न सकिन्छ। तपाईं भिडियोलाई शीर्षक र विवरण सहित राख्न सक्नुहुन्छ।"
    },
    {
      title: "विज्ञापन व्यवस्थापन (Ads)",
      icon: <Megaphone className="text-yellow-500" size={24} />,
      content: "विभिन्न स्थानमा (Top, Sidebar, Bottom) देखाउनको लागि विज्ञापनका तस्बिर र लिङ्कहरू यहाँबाट व्यवस्थापन गर्न सकिन्छ।"
    },
    {
      title: "साझेदार तथा टिम (Partners)",
      icon: <Users className="text-purple-500" size={24} />,
      content: "तपाईंको संस्थाका साझेदार र टिम सदस्यहरूको विवरण र तस्बिर यहाँबाट थप्न र सम्पादन गर्न सकिन्छ।"
    },
    {
      title: "सुरक्षा र सेटिङ (Security & Settings)",
      icon: <Shield className="text-gray-500" size={24} />,
      content: "सेटिङ्सबाट तपाईं आफ्नो पासवर्ड परिवर्तन गर्न सक्नुहुन्छ। सधैं आफ्नो पासवर्ड सुरक्षित राख्नुहोला र काम सकेपछि लगआउट गर्न नभुल्नुहोला।"
    }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-red-100 rounded-full">
          <BookOpen className="text-red-600" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">प्रयोगकर्ता गाइड (User Guide)</h1>
          <p className="text-gray-500 text-sm mt-1">वेबसाइट व्यवस्थापन प्रणाली कसरी प्रयोग गर्ने भन्ने बारे जानकारी</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                {section.icon}
              </div>
              <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
        <h3 className="font-bold text-blue-900 mb-2">थप मद्दत आवश्यक छ?</h3>
        <p className="text-blue-700 text-sm">
          कुनै प्राविधिक समस्या भएमा वा थप जानकारी आवश्यक परेमा कृपया विकासकर्ता (Developer) सँग सम्पर्क गर्नुहोला।
        </p>
      </div>
    </div>
  );
}
