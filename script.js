// ============================================
// Қараңғы / ашық тақырыпты ауыстыру
// ============================================
function toggleTheme() {
    document.body.classList.toggle('dark');
    const themeBtn = document.getElementById('themeToggle');
    if (document.body.classList.contains('dark')) {
        themeBtn.textContent = '☀️ Ашық тақырып';
    } else {
        themeBtn.textContent = '🌙 Қараңғы тақырып';
    }
}

// ============================================
// Сұраныс санауышы (requestCount)
// ============================================
let requestCounter = 0;
const requestCountSpan = document.getElementById('requestCount');

function incrementRequestCount() {
    requestCounter++;
    requestCountSpan.textContent = requestCounter;
}

// ============================================
// API арқылы ЖИ-ге сұрақ жіберу
// ============================================
async function askAI(userMessage) {
    // ӨЗІҢІЗДІҢ Python серверіңізге сұрақ жібереді
    const response = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Сервер қатесі: ${errorData.error || 'Белгісіз қате'}`);
    }

    const data = await response.json();
    
    // Жауапты өңдеу
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else if (data.response) {
        return data.response;
    } else {
        return JSON.stringify(data);
    }
}

// ============================================
// Чат интерфейсін басқару
// ============================================
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;
    
    addMessage(userText, 'user');
    userInput.value = '';
    incrementRequestCount();
    
    const loadingMsg = document.createElement('div');
    loadingMsg.classList.add('message', 'bot');
    loadingMsg.textContent = '✍️ Жазылуда...';
    chatMessages.appendChild(loadingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        const aiResponse = await askAI(userText);
        loadingMsg.remove();
        addMessage(aiResponse, 'bot');
    } catch (error) {
        loadingMsg.remove();
        addMessage(`Қате: ${error.message}`, 'bot');
    }
}

// Оқиғалар
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
}
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Анимация
const observerOptions = { threshold: 0.2, rootMargin: '0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});