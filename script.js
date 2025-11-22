class QuizApp {
    constructor() {
        this.questions = [
            {
                question: "What does HTML stand for?",
                options: [
                    "Hyper Text Markup Language",
                    "High Tech Modern Language",
                    "Hyper Transfer Markup Language",
                    "Home Tool Markup Language"
                ],
                correct: 0
            },
            {
                question: "Which language is used for styling web pages?",
                options: ["HTML", "JavaScript", "CSS", "Python"],
                correct: 2
            },
            {
                question: "What is JavaScript primarily used for?",
                options: [
                    "Styling web pages",
                    "Adding interactivity to web pages",
                    "Creating database tables",
                    "Server configuration"
                ],
                correct: 1
            },
            {
                question: "Which symbol is used for comments in JavaScript?",
                options: ["//", "<!-- -->", "##", "%%"],
                correct: 0
            },
            {
                question: "What does CSS stand for?",
                options: [
                    "Computer Style Sheets",
                    "Creative Style System",
                    "Cascading Style Sheets",
                    "Colorful Style Sheets"
                ],
                correct: 2
            },
            {
                question: "Which method is used to select an element by ID in JavaScript?",
                options: [
                    "document.querySelector()",
                    "document.getElementById()",
                    "document.getElementByClass()",
                    "document.findElement()"
                ],
                correct: 1
            },
            {
                question: "What is the purpose of localStorage?",
                options: [
                    "To store data on the server",
                    "To store data permanently in the browser",
                    "To create local files",
                    "To manage user sessions"
                ],
                correct: 1
            },
            {
                question: "Which HTML tag is used for the largest heading?",
                options: ["<h6>", "<heading>", "<h1>", "<head>"],
                correct: 2
            },
            {
                question: "What does API stand for?",
                options: [
                    "Application Programming Interface",
                    "Advanced Programming Instruction",
                    "Application Process Integration",
                    "Automated Programming Interface"
                ],
                correct: 0
            },
            {
                question: "Which property is used to change the background color in CSS?",
                options: ["color", "bgcolor", "background-color", "background"],
                correct: 2
            }
        ];

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 60;
        this.timer = null;
        this.selectedAnswers = new Array(this.questions.length).fill(null);

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startQuiz();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartQuiz();
        });

        document.getElementById('reviewBtn').addEventListener('click', () => {
            this.reviewAnswers();
        });
    }

    startQuiz() {
        this.showScreen('quizScreen');
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 60;
        this.selectedAnswers.fill(null);
        
        this.startTimer();
        this.loadQuestion();
    }

    startTimer() {
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.endQuiz();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        document.getElementById('timer').textContent = `Time: ${this.timeLeft}s`;
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
        
        // Update question count
        document.getElementById('questionCount').textContent = 
            `Question ${this.currentQuestionIndex + 1}/${this.questions.length}`;
        
        // Load question text
        document.getElementById('questionText').textContent = question.question;
        
        // Load options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            if (this.selectedAnswers[this.currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        // Update next button
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.disabled = this.selectedAnswers[this.currentQuestionIndex] === null;
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextBtn.textContent = 'Finish Quiz';
        } else {
            nextBtn.textContent = 'Next Question';
        }
    }

    selectOption(optionIndex) {
        this.selectedAnswers[this.currentQuestionIndex] = optionIndex;
        
        // Update UI
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            option.classList.toggle('selected', index === optionIndex);
        });
        
        // Enable next button
        document.getElementById('nextBtn').disabled = false;
    }

    nextQuestion() {
        // Move to next question or end quiz
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion();
        } else {
            this.endQuiz();
        }
    }

    endQuiz() {
        clearInterval(this.timer);
        this.calculateScore();
        this.showResults();
    }

    calculateScore() {
        this.score = 0;
        this.questions.forEach((question, index) => {
            if (this.selectedAnswers[index] === question.correct) {
                this.score++;
            }
        });
    }

    showResults() {
        this.showScreen('resultsScreen');
        
        // Update score
        document.getElementById('finalScore').textContent = this.score;
        
        // Update score message
        const scoreMessage = document.getElementById('scoreMessage');
        if (this.score === this.questions.length) {
            scoreMessage.textContent = 'Perfect! You are a web development expert!';
            scoreMessage.style.color = '#28a745';
        } else if (this.score >= this.questions.length * 0.7) {
            scoreMessage.textContent = 'Great job! You know your stuff!';
            scoreMessage.style.color = '#17a2b8';
        } else if (this.score >= this.questions.length * 0.5) {
            scoreMessage.textContent = 'Good effort! Keep learning!';
            scoreMessage.style.color = '#ffc107';
        } else {
            scoreMessage.textContent = 'Keep practicing! You\'ll get better!';
            scoreMessage.style.color = '#dc3545';
        }
        
        // Update details
        document.getElementById('correctAnswers').textContent = this.score;
        document.getElementById('wrongAnswers').textContent = this.questions.length - this.score;
        document.getElementById('timeTaken').textContent = `${60 - this.timeLeft}s`;
    }

    restartQuiz() {
        this.startQuiz();
    }

    reviewAnswers() {
        // This would show detailed review of all questions and answers
        alert('Review feature would show each question with your answer and the correct answer.');
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show target screen
        document.getElementById(screenId).classList.remove('hidden');
    }
}

// Initialize quiz app
const quizApp = new QuizApp();