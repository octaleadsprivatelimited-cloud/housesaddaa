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
      className="fixed bottom-5 right-5 z-50 flex items-center gap-1.5 pl-2 pr-3 py-2 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.03] group"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="h-5 w-5 shrink-0" />
      <span className="font-medium text-xs hidden sm:inline">Chat with us</span>
    </a>
  );
}

export default WhatsAppButton;
