// Predefined chatbot replies (Aapka original text bot waisa hi hai)
const replies = [
  { keys:['hi','hello','hey'], reply:'Hi there! 👋 How can I help you today?' },
  { keys:['book','ride','cab','taxi'], reply:'To book a ride, use the "Search a Ride" form on the home page. Enter pickup, destination, date & time.' },
  { keys:['price','cost','fare','charge'], reply:'Fares start from ₹200 for bikes and go up to ₹450 for luxury vans. Exact price shows after search.' },
  { keys:['cancel','refund'], reply:'You can cancel free of charge up to 5 minutes before pickup. Refunds process in 3-5 business days.' },
  { keys:['login','sign in','signin'], reply:'Click the Login button in the top-right corner. New here? Sign Up first!' },
  { keys:['signup','sign up','register','account'], reply:'Head to the Sign Up page from the navbar to create your account.' },
  { keys:['contact','support','help','phone','email'], reply:'Reach us at support@swiftride.demo or +91 98765 43210. Support is 24/7.' },
  { keys:['vehicle','car','bike','van','suv'], reply:'We offer Mini Cabs, Sedans, SUVs, Bikes, Autos and Luxury Vans. Pick one from the vehicles section.' },
  { keys:['payment','pay','card','upi'], reply:'We accept UPI, credit/debit cards, wallets and cash on ride.' },
  { keys:['safe','safety','driver'], reply:'All drivers are background-verified and rides are GPS-tracked in real-time.' },
  { keys:['thanks','thank you'], reply:'You\'re welcome! Enjoy your ride 🚖' },
  { keys:['bye'], reply:'Goodbye! Have a safe journey. 👋' },
];

function botReply(msg) {
  const m = msg.toLowerCase();
  for (const r of replies) if (r.keys.some(k => m.includes(k))) return r.reply;
  return "I'm not sure about that. Try asking about booking, pricing, vehicles, or contact info.";
}

document.addEventListener('DOMContentLoaded', () => {
  const callToggle = document.getElementById('callToggle');
  const chatToggle = document.getElementById('chatToggle');
  const win    = document.getElementById('chatWindow');
  const close  = document.getElementById('chatClose');
  const form   = document.getElementById('chatForm');
  const input  = document.getElementById('chatInput');
  const body   = document.getElementById('chatBody');
  const voiceBtn = document.getElementById('voiceBtn');
  const statusText = document.getElementById('listeningStatus');
  
  if (!chatToggle) return;

  const addMsg = (text, cls) => {
    const el = document.createElement('div');
    el.className = 'chat-msg ' + cls;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  };

  // -------------- AI: Speech-to-Text (Voice Input) --------------
  let recognition = null;
  let isListening = false;
  
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      voiceBtn.classList.add('listening');
      voiceBtn.textContent = '🔴';
      callToggle.classList.add('listening');
      if(statusText) statusText.style.display = 'block';
    };
    recognition.onend = () => {
      isListening = false;
      voiceBtn.classList.remove('listening');
      voiceBtn.textContent = '🎤';
      callToggle.classList.remove('listening');
      if(statusText) statusText.style.display = 'none';
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.value = transcript;
      form.dispatchEvent(new Event('submit'));
    };
  }

  if (voiceBtn && recognition) {
    voiceBtn.addEventListener('click', () => {
      if (isListening) recognition.stop();
      else recognition.start();
    });
  } else if (voiceBtn) {
    voiceBtn.disabled = true;
    voiceBtn.title = 'Voice input not supported on this browser (Use Chrome/Edge)';
  }

  // -------------- AI: Text-to-Speech (AI Voice Reply) --------------
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // -------------- Button Logic --------------
  // 1. Yellow Chat Button: Only opens window for Text
  chatToggle.addEventListener('click', () => {
    win.classList.toggle('open');
    if (win.classList.contains('open') && !body.hasChildNodes()) {
      addMsg('Hi! I\'m the SwiftRide assistant. Ask me about booking, pricing, or vehicles.', 'bot');
    }
  });

  // 2. Green Call Button: Opens window AND starts microphone automatically
  callToggle.addEventListener('click', () => {
    if (!win.classList.contains('open')) {
      win.classList.add('open');
      if (!body.hasChildNodes()) {
        addMsg('Hi! I\'m the SwiftRide assistant. Ask me about booking, pricing, or vehicles.', 'bot');
      }
    }
    setTimeout(() => {
      if (voiceBtn && recognition && !isListening) {
        voiceBtn.click();
      }
    }, 500);
  });

  close.addEventListener('click', () => win.classList.remove('open'));

  // -------------- Form Submit (Text or Voice) --------------
  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    
    const reply = botReply(text);
    setTimeout(() => {
      addMsg(reply, 'bot');
      speakText(reply); 
    }, 400);
  });
});