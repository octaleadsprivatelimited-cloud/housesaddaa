import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '916301575658';
  const message = encodeURIComponent('Hi, I\'m interested in your properties. Please share more details.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 pl-3 pr-4 py-3 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 shrink-0" />
      <span className="font-medium text-sm hidden sm:inline">Chat with us</span>
    </a>
  );
}

export default WhatsAppButton;
