import { assessmentService } from './assessment-service.js';

export class AssessmentEngine {
    constructor(containerIds) {
        this.containers = containerIds;
        this.session = null;
        this.assessment = null;
        // Local state for UI responsiveness
        this.currentSectionIndex = 0;
        this.currentQuestionIndex = 0;
        this.timerInterval = null;
    }

    async init(sessionId) {
        try {
            // GET /api/v1/assessment/session/:sessionId
            const { session, assessment } = await assessmentService.getSession(sessionId);
            if (!session) throw new Error('Session is null');
            if (!assessment) throw new Error('Assessment is null');

            if (session.status === 'completed') {
                alert('This assessment has already been completed.');
                window.location.href = '/candidate-assessments.html';
                return;
            }

            this.session = session;
            this.assessment = assessment;

            // Initialize Proctoring
            // POST /api/v1/assessment/session/:sessionId/proctoring/start
            await assessmentService.startProctoring(sessionId);

            this.syncStateFromSession();
            this.render();
            this.startTimer();
        } catch (error) {
            console.error('Failed to init assessment', error);
            alert('Failed to load assessment session. Returning to dashboard.');
            window.location.href = '/candidate-assessments.html';
        }
    }



    syncStateFromSession() {
        // Restore current section and question from session state (if available)
        this.currentSectionIndex = this.session.currentSectionIndex || 0;
        // In a real app, you might save question index too. For now we default to 0 on resume unless we want to find the first unanswered.
        this.currentQuestionIndex = 0;
    }

    render() {
        this.renderHeader();
        this.renderSidebar();
        this.renderCurrentQuestion();
    }

    renderHeader() {
        document.getElementById(this.containers.title).textContent = this.assessment.title;
        document.getElementById(this.containers.subtitle).textContent = `${this.assessment.company} · ${this.assessment.role}`;
    }

    renderSidebar() {
        // Section Selector (Dropdown)
        const select = document.getElementById(this.containers.sectionSelect);
        select.innerHTML = '';

        this.assessment.sections.forEach((section, index) => {
            const option = document.createElement('option');
            option.value = index;

            // Determine Phase for this section
            // Mock Mapping: Section 1&2 = Aptitude Phase. Section 3 = Coding Phase.
            // In real app, section object would have 'phase' property.
            let sectionPhase = 'aptitude';
            if (section.type === 'coding') sectionPhase = 'coding';

            // Lock Check
            let isLocked = false;
            if (this.session.currentPhase === 'aptitude' && sectionPhase !== 'aptitude') isLocked = true;

            const lockIcon = isLocked ? '🔒 ' : '';
            option.textContent = `${lockIcon}Section ${index + 1}: ${section.title}`;
            option.disabled = isLocked;
            option.selected = index === this.currentSectionIndex;
            select.appendChild(option);
        });

        select.onchange = (e) => {
            this.currentSectionIndex = parseInt(e.target.value);
            this.currentQuestionIndex = 0;
            this.renderCurrentQuestion();
            this.renderSidebar();
        };

        // Question Grid
        const grid = document.getElementById(this.containers.questionGrid);
        grid.innerHTML = '';
        const currentSection = this.assessment.sections[this.currentSectionIndex];

        if (!currentSection) {
            console.error(`Invalid section index: ${this.currentSectionIndex}`);
            return;
        }

        currentSection.questions.forEach((q, idx) => {
            const btn = document.createElement('button');
            const isCurrent = idx === this.currentQuestionIndex;
            const isAnswered = this.isAnswered(currentSection.id, q.id);

            let classes = 'aspect-square flex items-center justify-center rounded font-medium text-sm transition-all ';
            if (isCurrent) {
                classes += 'bg-primary text-white font-bold shadow-md shadow-blue-500/30 ring-2 ring-blue-200 dark:ring-blue-900';
            } else if (isAnswered) {
                classes += 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
            } else {
                classes += 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary';
            }

            btn.className = classes;
            btn.textContent = idx + 1;
            btn.onclick = () => {
                this.currentQuestionIndex = idx;
                this.renderCurrentQuestion();
                this.renderSidebar();
            };
            grid.appendChild(btn);
        });
    }

    renderCurrentQuestion() {
        if (!this.assessment || !this.assessment.sections) {
            console.error("Assessment data invalid");
            return;
        }

        const section = this.assessment.sections[this.currentSectionIndex];

        if (!section) {
            console.error(`Invalid section index: ${this.currentSectionIndex}`);
            document.getElementById(this.containers.mainContent).innerHTML = `<div class="p-8 text-center text-red-500">Error: Section not found</div>`;
            return;
        }

        const question = section.questions[this.currentQuestionIndex];

        if (!question) {
            console.error(`Invalid question index: ${this.currentQuestionIndex} for section ${this.currentSectionIndex}`);
            document.getElementById(this.containers.mainContent).innerHTML = `<div class="p-8 text-center text-red-500">Error: Question not found</div>`;
            return;
        }

        const container = document.getElementById(this.containers.mainContent);

        // --- RENDER CONTENT BASED ON TYPE ---
        let contentHtml = '';
        if (section.type === 'coding') {
            this.renderCodingQuestion(container, question, section.id);
            return; // Coding has its own layout/buttons
        } else if (section.type === 'mcq') {
            contentHtml = this.getMCQHtml(question, section.id);
        } else if (section.type === 'subjective') {
            contentHtml = this.getSubjectiveHtml(question, section.id);
        }

        // --- WRAPPER WITH NAVIGATION ---
        container.innerHTML = `
            <div class="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#1a202c]">
                ${contentHtml}
                <!-- Navigation Bar -->
                <div class="border-t border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <button id="prev-btn" class="px-4 py-2 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-sm transition-colors ${this.currentQuestionIndex === 0 ? 'invisible' : ''}">
                        Previous
                    </button>
                    <button id="next-btn" class="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors duration-200 flex items-center gap-2 shadow-md shadow-blue-500/20">
                        <span>Next Question</span>
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        `;

        // Attach Event Listeners
        this.attachQuestionListeners(section.type, section.id, question.id);

        // Configure Next/Submit Button
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');

        prevBtn.onclick = () => {
            this.currentQuestionIndex--;
            this.render();
        };

        const isLastQuestionInSection = this.currentQuestionIndex === section.questions.length - 1;

        if (isLastQuestionInSection) {
            // Check if this is also the last section of the PHASE
            // For MVP: Section 2 is end of Aptitude. Section 3 is Coding.
            const isEndOfAptitude = section.id === 'sec-2';

            if (isEndOfAptitude) {
                nextBtn.innerHTML = `<span>Submit Section</span><span class="material-symbols-outlined text-sm">check_circle</span>`;
                nextBtn.onclick = () => this.submitPhase('aptitude');
            } else {
                nextBtn.innerHTML = `<span>Next Section</span><span class="material-symbols-outlined text-sm">skip_next</span>`;
                nextBtn.onclick = () => {
                    // Move to next section
                    this.currentSectionIndex++;
                    this.currentQuestionIndex = 0;
                    this.render();
                };
            }
        } else {
            nextBtn.onclick = () => {
                this.currentQuestionIndex++;
                this.render();
            };
        }
    }

    // --- HTML GENERATORS ---

    getMCQHtml(question, sectionId) {
        const savedAnswer = this.session.answers[sectionId]?.[question.id];
        return `
            <div class="max-w-3xl mx-auto w-full p-8 overflow-y-auto flex-1">
                <div class="mb-8">
                    <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase rounded tracking-wide">Multiple Choice</span>
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2">${question.text}</h2>
                </div>
                <div class="space-y-4">
                    ${question.options.map((opt, idx) => `
                        <label class="flex items-center p-4 border rounded-lg cursor-pointer transition-all ${savedAnswer == idx ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'}">
                            <input type="radio" name="mcq" value="${idx}" class="form-radio text-primary w-5 h-5" ${savedAnswer == idx ? 'checked' : ''}>
                            <span class="ml-3 text-slate-700 dark:text-slate-300">${opt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getSubjectiveHtml(question, sectionId) {
        const savedAnswer = this.session.answers[sectionId]?.[question.id] || '';
        return `
            <div class="max-w-3xl mx-auto w-full p-8 overflow-y-auto flex-1">
                <div class="mb-8">
                    <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase rounded tracking-wide">Subjective</span>
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2">${question.text}</h2>
                </div>
                <div>
                    <textarea 
                        id="subjective-input"
                        class="w-full h-64 p-4 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                        placeholder="Type your answer here..."
                    >${savedAnswer}</textarea>
                    <div class="flex justify-between mt-2 text-xs text-slate-500">
                            <span>Min: ${question.minLength} chars</span>
                            <span id="char-count">${savedAnswer.length} chars</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderCodingQuestion(container, question, sectionId) {
        const savedCode = this.session.answers[sectionId]?.[question.id] || question.starterCode;

        container.innerHTML = `
            <div class="flex-1 flex overflow-hidden">
                <!-- Problem Description -->
                <div class="w-5/12 overflow-y-auto bg-white dark:bg-[#1a202c] border-r border-slate-200 dark:border-slate-800 flex flex-col">
                    <div class="p-6">
                        <span class="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase rounded tracking-wide mb-2 inline-block">Coding Challenge</span>
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">${question.title}</h2>
                        <div class="prose dark:prose-invert prose-slate prose-sm max-w-none">
                            <p>${question.text}</p>
                            ${question.testCases.map((tc, i) => `
                                <h3 class="font-bold mt-4">Example ${i + 1}:</h3>
                                <div class="bg-slate-100 dark:bg-slate-800 p-3 rounded font-mono text-xs">
                                    <strong>Input:</strong> ${tc.input}<br>
                                    <strong>Output:</strong> ${tc.output}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <!-- Code Editor (Mock) -->
                <div class="flex-1 flex flex-col bg-editor-bg text-slate-300">
                    <div class="h-12 bg-editor-sidebar border-b border-white/10 flex items-center justify-between px-4">
                        <span class="text-sm font-medium text-slate-200">main.js</span>
                    </div>
                    <textarea 
                        id="code-editor"
                        class="flex-1 bg-editor-bg text-slate-300 font-mono text-sm p-4 border-none resize-none focus:ring-0"
                        spellcheck="false"
                    >${savedCode}</textarea>
                    <div class="h-16 bg-editor-bg border-t border-white/10 flex items-center justify-between px-6">
                        <button class="px-4 py-2 rounded text-slate-300 font-semibold text-sm hover:bg-white/10" onclick="alert('Running validation...')">Run Tests</button>
                        <button class="px-6 py-2 rounded bg-primary text-white font-semibold text-sm shadow-lg shadow-blue-900/50" id="save-code-btn">Submit & Save</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('code-editor').addEventListener('input', (e) => {
            this.saveAnswer(sectionId, question.id, e.target.value);
        });

        document.getElementById('save-code-btn').addEventListener('click', () => {
            const code = document.getElementById('code-editor').value;
            this.saveAnswer(sectionId, question.id, code);
            // Mock submission of code session
            // In real world, we might call submitCodingSolution
            this.showNotification("Code saved successfully!", "success");
        });
        // The original submit-code-btn logic is removed from here as per instruction.
        // If the intention was to have a separate submit button for the phase, it would need to be re-added.
        // For now, only the save functionality is kept.
    }

    // --- EVENT HANDLERS ---

    attachQuestionListeners(type, sectionId, questionId) {
        if (type === 'mcq') {
            const inputs = document.querySelectorAll('input[name="mcq"]');
            inputs.forEach(input => {
                input.addEventListener('change', (e) => {
                    this.saveAnswer(sectionId, questionId, e.target.value);
                    this.renderSidebar();
                });
            });
        } else if (type === 'subjective') {
            const textarea = document.getElementById('subjective-input');
            const count = document.getElementById('char-count');
            textarea.addEventListener('input', (e) => {
                const val = e.target.value;
                count.textContent = `${val.length} chars`;
                this.saveAnswer(sectionId, questionId, val);
            });
        }
    }

    saveAnswer(sectionId, questionId, value) {
        // PATCH /api/v1/assessment/session/:sessionId/save-progress
        // We accumulate locally first to avoid button lag, then sync
        if (!this.session.answers[sectionId]) this.session.answers[sectionId] = {};
        this.session.answers[sectionId][questionId] = value;

        // Debounce network call in real app. For now direct call.
        assessmentService.saveProgress(this.session.id, {
            [sectionId]: { [questionId]: value }
        });
    }

    isAnswered(sectionId, questionId) {
        const val = this.session.answers[sectionId]?.[questionId]; // Fixed optional chaining for safety
        return val !== undefined && val !== null && val !== '';
    }

    // --- PHASE MANAGEMENT ---

    async submitPhase(phaseName) {
        if (!confirm(`Are you sure you want to submit the ${phaseName} section? You cannot return to it.`)) return;

        try {
            // POST /api/v1/assessment/session/:sessionId/submit
            const result = await assessmentService.submitSession(this.session.id);

            if (result.success) {
                this.session.currentPhase = result.nextPhase;

                if (result.nextPhase === 'coding') {
                    // Unlock coding section
                    this.session.codingSessionId = result.codingSessionId;
                    this.currentSectionIndex = 2; // Move to coding section
                    this.currentQuestionIndex = 0;
                    alert("Aptitude Submitted. Starting Coding Challenge.");
                    this.render();
                } else if (result.nextPhase === 'interview') {
                    this.startAIInterview();
                }
            }
        } catch (error) {
            console.error(error);
            alert('Submission failed. Please try again.');
        }
    }

    startTimer() {
        const timerEl = document.getElementById(this.containers.timer);
        const durationSeconds = (this.assessment.duration || 60) * 60; // Default to 60 mins if missing

        // Calculate remaining based on start time
        const startTime = new Date(this.session.startTime).getTime();
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        let remaining = durationSeconds - elapsedSeconds;

        if (remaining < 0) remaining = 0;

        // Visual update function
        const updateDisplay = () => {
            if (remaining <= 0) {
                clearInterval(this.timerInterval);
                if (timerEl) timerEl.textContent = "00:00:00";
                // Auto-submit or lock if time runs out (optional requirement)
                return;
            }

            const h = Math.floor(remaining / 3600);
            const m = Math.floor((remaining % 3600) / 60);
            const s = remaining % 60;

            if (timerEl) timerEl.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            remaining--;
        };

        updateDisplay(); // Initial call
        this.timerInterval = setInterval(updateDisplay, 1000);
    }

    async submitAssessment() {
        clearInterval(this.timerInterval);

        try {
            // Ensure any final data is saved
            // ...

            // Notify User
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification("Assessment Submitted", { body: "You are now transitioning to the AI Interview." });
            } else {
                alert("Assessment Submitted Successfully!");
            }

            // Show Toast/Banner in UI (better than alert)
            this.showNotification("Assessment submitted successfully! Preparing AI Interview...", "success");

            this.startAIInterview();
        } catch (e) {
            console.error(e);
            this.showNotification("Error submitting assessment", "error");
        }
    }

    showNotification(message, type = 'info') {
        // Simple toast implementation or use global component if available
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-4 rounded shadow-lg text-white font-bold transition-opacity duration-500 z-50 ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    startAIInterview() {
        // Hide assessment container, show AI interview container
        document.getElementById(this.containers.assessmentWrapper).classList.add('hidden');
        const aiContainer = document.getElementById(this.containers.aiWrapper);
        aiContainer.classList.remove('hidden');

        // Render Interview
        aiContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-8">
                <div class="w-32 h-32 rounded-full bg-blue-600 animate-pulse flex items-center justify-center mb-8">
                    <span class="material-symbols-outlined text-6xl">mic</span>
                </div>
                <h2 class="text-3xl font-bold mb-4">AI Interview Phase</h2>
                <p class="text-slate-400 max-w-md text-center mb-8">
                    "Hi there! I've reviewed your code. Let's discuss your approach to the Two Sum problem. Can you explain your time complexity?"
                </p>
                <div class="flex gap-4">
                    <button class="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors" onclick="window.location.href='/candidate-assessments.html'">
                        <span class="material-symbols-outlined text-2xl">call_end</span>
                    </button>
                    <button class="w-16 h-16 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
                         <span class="material-symbols-outlined text-2xl">mic_off</span>
                    </button>
                </div>
            </div>
        `;
    }
}
