document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initThemeToggle();
    initSidebar();
    initNavigation();
    initProgressTracking();
    initDashboardCharts();
    initEventCreator();
    initDataLayerStudio();
    initQuizSystem();
    initAuditTools();
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme based on saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        document.documentElement.setAttribute('data-color-scheme', 'light');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
    
    // Toggle theme on click
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        
        // Toggle icons
        if (newTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
        
        // Save preference for future visits
        localStorage.setItem('theme', newTheme);
    });
}

// Sidebar Functionality
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });
    
    // Submenu toggle
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');
    
    hasSubmenuItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle current submenu
            item.classList.toggle('open');
            
            // Close other submenus when opening a new one
            hasSubmenuItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('open')) {
                    otherItem.classList.remove('open');
                }
            });
        });
    });
    
    // Handle submenu item clicks
    const submenuLinks = document.querySelectorAll('.submenu a');
    
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the section ID
            const sectionId = this.getAttribute('data-section');
            
            // Navigate to the section
            navigateToSection(sectionId);
            
            // If on mobile, close sidebar
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
}

// Navigation Functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const quickActions = document.querySelectorAll('.quick-actions .btn');
    
    // Handle main navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If it has submenu, the submenu handler will take care of it
            if (this.parentElement.classList.contains('has-submenu')) {
                return;
            }
            
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
            
            // Update active state
            navLinks.forEach(nl => nl.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Handle quick action buttons
    quickActions.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
            
            // Update active state in nav
            navLinks.forEach(nl => {
                if (nl.getAttribute('data-section') === sectionId) {
                    nl.classList.add('active');
                } else {
                    nl.classList.remove('active');
                }
            });
        });
    });
}

// Navigate to a specific section
function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Add to recent activity
        addActivity(`Visited ${targetSection.querySelector('h1').textContent}`);
    }
}

// Progress Tracking
function initProgressTracking() {
    // Sample progress data
    const progress = {
        dashboard: 100,
        ga4Learning: 10,
        gtmMastery: 5,
        eventCreator: 0,
        datalayerStudio: 0,
        quizCenter: 0,
        auditTools: 0,
        debuggingGuide: 0,
        resources: 0
    };
    
    // Calculate overall progress
    const totalModules = Object.keys(progress).length;
    const overallProgress = Object.values(progress).reduce((a, b) => a + b, 0) / totalModules;
    
    // Update progress bar
    const progressBar = document.getElementById('overall-progress');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${overallProgress}%`;
        progressText.textContent = `${Math.round(overallProgress)}% Complete`;
    }
    
    // Handle mark as complete buttons
    const completeButtons = document.querySelectorAll('.mark-complete');
    
    completeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            
            if (section) {
                // Find the progress element in this section
                const progressFill = section.querySelector('.progress-fill');
                const progressText = progressFill.nextElementSibling;
                
                // Update to 100%
                progressFill.style.width = '100%';
                progressFill.setAttribute('data-progress', '100');
                progressText.textContent = '100% Complete';
                
                // Update overall progress
                progress[sectionId] = 100;
                const newOverallProgress = Object.values(progress).reduce((a, b) => a + b, 0) / totalModules;
                
                document.getElementById('overall-progress').style.width = `${newOverallProgress}%`;
                document.getElementById('progress-text').textContent = `${Math.round(newOverallProgress)}% Complete`;
                
                // Add to activity
                addActivity(`Completed ${section.querySelector('h1').textContent}`);
                
                // Disable button
                this.disabled = true;
                this.textContent = 'Completed!';
                
                // Update streak
                updateStreak();
            }
        });
    });
}

// Add to recent activity
function addActivity(text) {
    const activityList = document.getElementById('activity-list');
    
    if (activityList) {
        const now = new Date();
        const timeText = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <span class="activity-icon">📝</span>
            <span class="activity-text">${text}</span>
            <span class="activity-time">${timeText}</span>
        `;
        
        // Insert at the top
        activityList.insertBefore(activityItem, activityList.firstChild);
        
        // Remove oldest if more than 5
        if (activityList.children.length > 5) {
            activityList.removeChild(activityList.lastChild);
        }
    }
}

// Update streak counter
function updateStreak() {
    const streakCount = document.getElementById('streak-count');
    const streakCountQuiz = document.getElementById('streak-count-quiz');
    
    if (streakCount) {
        // Normally we'd use localStorage for streak tracking
        // Here we'll just increment for demo purposes
        let currentStreak = parseInt(streakCount.textContent) || 0;
        currentStreak += 1;
        streakCount.textContent = currentStreak;
        
        if (streakCountQuiz) {
            streakCountQuiz.textContent = currentStreak;
        }
    }
}

// Dashboard Charts
function initDashboardCharts() {
    const progressChartElement = document.getElementById('progressChart');
    
    if (progressChartElement) {
        const progressChart = new Chart(progressChartElement, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Not Started'],
                datasets: [{
                    data: [10, 15, 75],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#ECEBD5'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Event Creator Functionality
function initEventCreator() {
    const eventNameInput = document.getElementById('event-name');
    const addParamButton = document.getElementById('add-parameter');
    const parametersList = document.getElementById('parameters-list');
    const generateCodeButton = document.getElementById('generate-code');
    const saveEventButton = document.getElementById('save-event');
    const generatedCodeBlock = document.getElementById('generated-code');
    const savedEventsList = document.getElementById('saved-events-list');
    
    // Add event parameter row
    if (addParamButton) {
        addParamButton.addEventListener('click', function() {
            const paramRow = document.createElement('div');
            paramRow.className = 'parameter-row';
            paramRow.innerHTML = `
                <input type="text" placeholder="Parameter name" class="param-name">
                <select class="param-type">
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                </select>
                <input type="text" placeholder="Value" class="param-value">
                <button class="btn-remove">×</button>
            `;
            
            parametersList.appendChild(paramRow);
            
            // Add event listener to remove button
            paramRow.querySelector('.btn-remove').addEventListener('click', function() {
                parametersList.removeChild(paramRow);
            });
        });
    }
    
    // Generate code button
    if (generateCodeButton) {
        generateCodeButton.addEventListener('click', function() {
            if (!eventNameInput || !eventNameInput.value.trim()) {
                alert('Please enter an event name');
                return;
            }
            
            const eventName = eventNameInput.value.trim();
            const parameters = {};
            const paramRows = parametersList.querySelectorAll('.parameter-row');
            
            paramRows.forEach(row => {
                const paramName = row.querySelector('.param-name').value.trim();
                const paramType = row.querySelector('.param-type').value;
                let paramValue = row.querySelector('.param-value').value.trim();
                
                if (paramName) {
                    // Convert value based on type
                    if (paramType === 'number') {
                        paramValue = Number(paramValue);
                    } else if (paramType === 'boolean') {
                        paramValue = paramValue.toLowerCase() === 'true';
                    }
                    
                    parameters[paramName] = paramValue;
                }
            });
            
            // Generate GTM compatible code
            const code = `// Google Tag (gtag.js) implementation
gtag('event', '${eventName}', ${JSON.stringify(parameters, null, 2)});

// Google Tag Manager dataLayer implementation
dataLayer.push({
  'event': '${eventName}',
  ${Object.entries(parameters).map(([key, value]) => {
    if (typeof value === 'string') return `'${key}': '${value}'`;
    return `'${key}': ${value}`;
  }).join(',\n  ')}
});`;
            
            generatedCodeBlock.textContent = code;
            
            // Validate event name (matches GA4 pattern)
            const validationStatus = document.getElementById('validation-status');
            const namePattern = /^[a-z][a-z_]{0,39}$/;
            
            if (namePattern.test(eventName)) {
                validationStatus.innerHTML = '<p>✅ Event configuration is valid</p>';
                validationStatus.style.background = 'rgba(var(--color-success-rgb, 33, 128, 141), 0.1)';
                validationStatus.style.borderColor = 'rgba(var(--color-success-rgb, 33, 128, 141), 0.3)';
            } else {
                validationStatus.innerHTML = '<p>❌ Event name must be lowercase with underscores only, and start with a letter</p>';
                validationStatus.style.background = 'rgba(var(--color-error-rgb, 192, 21, 47), 0.1)';
                validationStatus.style.borderColor = 'rgba(var(--color-error-rgb, 192, 21, 47), 0.3)';
            }
        });
    }
    
    // Save event button
    if (saveEventButton) {
        saveEventButton.addEventListener('click', function() {
            if (!eventNameInput || !eventNameInput.value.trim()) {
                alert('Please generate an event first');
                return;
            }
            
            const eventName = eventNameInput.value.trim();
            const code = generatedCodeBlock.textContent;
            
            // Create event card
            const eventCard = document.createElement('div');
            eventCard.className = 'card';
            eventCard.innerHTML = `
                <div class="card__body">
                    <h4>${eventName}</h4>
                    <div class="btn-group" style="margin-top: var(--space-12);">
                        <button class="btn btn--sm btn--primary load-event">Load</button>
                        <button class="btn btn--sm btn--outline delete-event">Delete</button>
                    </div>
                </div>
            `;
            
            savedEventsList.appendChild(eventCard);
            
            // Store event data
            eventCard.dataset.eventName = eventName;
            eventCard.dataset.eventCode = code;
            
            // Add to recent activity
            addActivity(`Saved event: ${eventName}`);
            
            // Add event listeners to buttons
            eventCard.querySelector('.load-event').addEventListener('click', function() {
                eventNameInput.value = eventCard.dataset.eventName;
                generatedCodeBlock.textContent = eventCard.dataset.eventCode;
            });
            
            eventCard.querySelector('.delete-event').addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this event?')) {
                    savedEventsList.removeChild(eventCard);
                }
            });
        });
    }
    
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get all tab buttons with the same parent
            const siblings = Array.from(this.parentElement.querySelectorAll('.tab-btn'));
            
            // Remove active class from all buttons
            siblings.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // If this is code tabs, change the code display
            if (this.parentElement.classList.contains('code-tabs')) {
                const tabName = this.getAttribute('data-tab');
                // Here you would update the code preview based on tab
                // For demo purposes, we'll just add a comment
                if (generatedCodeBlock && generatedCodeBlock.textContent) {
                    if (tabName === 'gtag') {
                        generateCodeButton.click(); // Regenerate code
                    } else if (tabName === 'gtm') {
                        generatedCodeBlock.textContent = generatedCodeBlock.textContent.replace(
                            '// Google Tag (gtag.js) implementation', 
                            '// GTM Implementation'
                        );
                    } else if (tabName === 'measurement') {
                        generatedCodeBlock.textContent = generatedCodeBlock.textContent.replace(
                            '// Google Tag (gtag.js) implementation', 
                            '// Measurement Protocol Implementation'
                        );
                    }
                }
            }
        });
    });
}

// DataLayer Studio
function initDataLayerStudio() {
    const datalayerEditor = document.getElementById('datalayer-editor');
    const validateBtn = document.getElementById('validate-datalayer');
    const exportBtn = document.getElementById('export-datalayer');
    const clearBtn = document.getElementById('clear-builder');
    const outputDisplay = document.getElementById('output-display');
    const validationResults = document.getElementById('validation-results');
    const templateButtons = document.querySelectorAll('.template-btn');
    const toolButtons = document.querySelectorAll('.tool-btn');
    
    // DataLayer templates
    const templates = {
        basic: `dataLayer.push({
  "event": "custom_event",
  "event_category": "user_engagement",
  "event_action": "click",
  "event_label": "signup_button"
});`,
        ecommerce: `dataLayer.push({
  "event": "purchase",
  "ecommerce": {
    "transaction_id": "T_12345",
    "value": 99.99,
    "tax": 8.49,
    "shipping": 5.99,
    "currency": "USD",
    "items": [
      {
        "item_id": "SKU_123",
        "item_name": "Premium Analytics Course",
        "item_category": "Education",
        "price": 99.99,
        "quantity": 1
      }
    ]
  }
});`,
        user: `dataLayer.push({
  "event": "user_data",
  "user_id": "U123456789",
  "user_properties": {
    "account_type": "premium",
    "signup_date": "2023-05-15",
    "lifetime_value": 299.97
  }
});`,
        custom: `dataLayer.push({
  "event": "custom_event",
  "custom_dimension1": "value1",
  "custom_dimension2": "value2",
  "custom_metric1": 123
});`
    };
    
    // Load template
    if (templateButtons) {
        templateButtons.forEach(button => {
            button.addEventListener('click', function() {
                const template = this.getAttribute('data-template');
                if (templates[template] && datalayerEditor) {
                    datalayerEditor.value = templates[template];
                    updateOutput(templates[template]);
                }
            });
        });
    }
    
    // Quick add tools
    if (toolButtons) {
        toolButtons.forEach(button => {
            button.addEventListener('click', function() {
                const addType = this.getAttribute('data-add');
                
                if (!datalayerEditor) return;
                
                let snippetToAdd = '';
                
                switch (addType) {
                    case 'event':
                        snippetToAdd = `"event": "custom_event",\n  `;
                        break;
                    case 'ecommerce':
                        snippetToAdd = `"ecommerce": {\n    "items": []\n  },\n  `;
                        break;
                    case 'user':
                        snippetToAdd = `"user_properties": {\n    "user_id": "",\n    "user_type": ""\n  },\n  `;
                        break;
                    case 'item':
                        snippetToAdd = `{\n  "item_id": "",\n  "item_name": "",\n  "price": 0,\n  "quantity": 1\n}`;
                        break;
                    case 'promotion':
                        snippetToAdd = `{\n  "promotion_id": "",\n  "promotion_name": "",\n  "creative_name": "",\n  "creative_slot": ""\n}`;
                        break;
                }
                
                // Insert at cursor position or at beginning
                const cursorPos = datalayerEditor.selectionStart;
                const currentValue = datalayerEditor.value;
                datalayerEditor.value = currentValue.slice(0, cursorPos) + snippetToAdd + currentValue.slice(cursorPos);
                
                updateOutput(datalayerEditor.value);
            });
        });
    }
    
    // Update output on input
    if (datalayerEditor) {
        datalayerEditor.addEventListener('input', function() {
            updateOutput(this.value);
        });
    }
    
    // Update the output display
    function updateOutput(code) {
        if (!outputDisplay) return;
        
        try {
            // Remove dataLayer.push wrapper for JSON parsing
            const jsonStr = code.replace(/dataLayer\.push\(/, '').replace(/\);$/, '');
            const jsonObj = JSON.parse(jsonStr);
            
            // Format nicely
            outputDisplay.textContent = JSON.stringify(jsonObj, null, 2);
        } catch (e) {
            // If parsing fails
            outputDisplay.textContent = '// Invalid JSON structure';
        }
    }
    
    // Validate button
    if (validateBtn) {
        validateBtn.addEventListener('click', function() {
            if (!datalayerEditor || !validationResults) return;
            
            try {
                // Remove dataLayer.push wrapper for JSON parsing
                const jsonStr = datalayerEditor.value.replace(/dataLayer\.push\(/, '').replace(/\);$/, '');
                const jsonObj = JSON.parse(jsonStr);
                
                // Check for required fields
                let issues = [];
                
                // Event validation
                if (!jsonObj.event) {
                    issues.push('Missing "event" parameter');
                } else if (!/^[a-z][a-z_]{0,39}$/.test(jsonObj.event)) {
                    issues.push('"event" name must be lowercase with underscores only');
                }
                
                // Ecommerce validation
                if (jsonObj.ecommerce) {
                    if (jsonObj.event === 'purchase' && !jsonObj.ecommerce.transaction_id) {
                        issues.push('Purchase events require a transaction_id');
                    }
                    
                    if (jsonObj.ecommerce.items && !Array.isArray(jsonObj.ecommerce.items)) {
                        issues.push('ecommerce.items must be an array');
                    }
                }
                
                // Show validation results
                if (issues.length > 0) {
                    validationResults.innerHTML = `
                        <p style="color: var(--color-error);">❌ Validation failed:</p>
                        <ul style="padding-left: var(--space-20); margin-top: var(--space-8);">
                            ${issues.map(issue => `<li>${issue}</li>`).join('')}
                        </ul>
                    `;
                } else {
                    validationResults.innerHTML = `
                        <p style="color: var(--color-success);">✅ DataLayer structure is valid</p>
                    `;
                }
            } catch (e) {
                validationResults.innerHTML = `
                    <p style="color: var(--color-error);">❌ Invalid JSON structure:</p>
                    <p style="margin-top: var(--space-8); font-family: var(--font-family-mono); font-size: var(--font-size-sm);">${e.message}</p>
                `;
            }
        });
    }
    
    // Export button
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            if (!datalayerEditor) return;
            
            // Create a temporary input to copy from
            const tempInput = document.createElement('textarea');
            tempInput.value = datalayerEditor.value;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Show confirmation
            alert('DataLayer code copied to clipboard!');
            
            // Add to activity
            addActivity('Exported DataLayer code');
        });
    }
    
    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (datalayerEditor) {
                datalayerEditor.value = '';
                updateOutput('');
            }
        });
    }
}

// Quiz System Functionality
function initQuizSystem() {
    const quizCategories = document.querySelectorAll('.category-btn');
    const quizInterface = document.getElementById('quiz-interface');
    const quizResults = document.getElementById('quiz-results');
    const endQuizButton = document.getElementById('end-quiz');
    const submitAnswerButton = document.getElementById('submit-answer');
    const nextQuestionButton = document.getElementById('next-question');
    const retakeQuizButton = document.getElementById('retake-quiz');
    const newQuizButton = document.getElementById('new-quiz');
    
    // Sample quiz questions
    const quizQuestions = [
        {
            id: 1,
            question: "What is the maximum number of custom dimensions allowed in a GA4 property?",
            options: ["25", "50", "75", "100"],
            correct: 1,
            difficulty: "intermediate",
            explanation: "GA4 allows up to 50 custom dimensions per property for detailed user and event tracking.",
            category: "ga4"
        },
        {
            id: 2,
            question: "Which trigger type is most appropriate for tracking single-page application navigation?",
            options: ["Page View", "History Change", "DOM Ready", "Window Loaded"],
            correct: 1,
            difficulty: "advanced",
            explanation: "History Change trigger fires when the URL changes without a full page reload, perfect for SPAs.",
            category: "gtm"
        },
        {
            id: 3,
            question: "What is the event name used in GA4 for tracking file downloads with enhanced measurement?",
            options: ["download", "file_download", "click_download", "page_download"],
            correct: 1,
            difficulty: "beginner",
            explanation: "GA4 Enhanced Measurement uses 'file_download' as the standard event name for download tracking.",
            category: "ga4"
        },
        {
            id: 4,
            question: "Which field is required for a valid GA4 purchase event?",
            options: ["transaction_id", "user_id", "promotion_id", "item_category"],
            correct: 0,
            difficulty: "intermediate",
            explanation: "A transaction_id is required for any GA4 purchase event to avoid duplication and ensure proper attribution.",
            category: "ga4"
        },
        {
            id: 5,
            question: "In GTM, which variable returns data without any modifications?",
            options: ["Data Layer Variable", "Custom JavaScript Variable", "Lookup Table Variable", "GA Settings Variable"],
            correct: 0,
            difficulty: "beginner",
            explanation: "Data Layer Variables access dataLayer information directly without any transformation or modification.",
            category: "gtm"
        },
        {
            id: 6,
            question: "What is the correct method to handle cross-domain tracking in GA4?",
            options: [
                "Add domains in the Google Analytics interface under 'Property Settings'",
                "Set linker parameters in the GA4 config tag in GTM",
                "Configure each domain as a separate data stream in the same GA4 property",
                "Use the 'allowLinker' parameter with the domains list in the gtag config"
            ],
            correct: 2,
            difficulty: "advanced",
            explanation: "In GA4, you should configure each domain as a separate data stream within the same property to properly track cross-domain journeys.",
            category: "ga4"
        }
    ];
    
    let currentQuiz = {
        questions: [],
        currentQuestionIndex: 0,
        correctAnswers: 0,
        selectedCategory: '',
        selectedDifficulty: ''
    };
    
    // Start quiz based on category
    if (quizCategories) {
        quizCategories.forEach(categoryBtn => {
            categoryBtn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                const difficulty = this.getAttribute('data-difficulty');
                
                // Filter questions by category and difficulty
                const filteredQuestions = quizQuestions.filter(q => 
                    q.category === category && 
                    q.difficulty === difficulty
                );
                
                // Shuffle questions and pick 5
                const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, Math.min(5, shuffled.length));
                
                // Start quiz with these questions
                startQuiz(selected, category, difficulty);
            });
        });
    }
    
    // Start quiz with selected questions
    function startQuiz(questions, category, difficulty) {
        if (!quizInterface) return;
        
        currentQuiz = {
            questions: questions,
            currentQuestionIndex: 0,
            correctAnswers: 0,
            selectedCategory: category,
            selectedDifficulty: difficulty
        };
        
        // Show quiz interface and hide categories
        quizInterface.style.display = 'block';
        quizResults.style.display = 'none';
        
        const quizCategoriesElem = document.querySelector('.quiz-categories');
        if (quizCategoriesElem) {
            quizCategoriesElem.style.display = 'none';
        }
        
        // Show first question
        showQuestion(0);
        
        // Update progress
        updateQuizProgress(0, questions.length);
    }
    
    // Show a specific question
    function showQuestion(index) {
        if (index >= currentQuiz.questions.length) {
            showQuizResults();
            return;
        }
        
        const question = currentQuiz.questions[index];
        const questionText = document.getElementById('question-text');
        const optionsList = document.getElementById('options-list');
        const questionDifficulty = document.getElementById('question-difficulty');
        const answerFeedback = document.getElementById('answer-feedback');
        
        if (questionText && optionsList && questionDifficulty) {
            questionText.textContent = question.question;
            questionDifficulty.textContent = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
            optionsList.innerHTML = '';
            
            // Create options
            question.options.forEach((option, i) => {
                const optionBtn = document.createElement('button');
                optionBtn.className = 'option';
                optionBtn.textContent = option;
                optionBtn.dataset.index = i;
                
                optionBtn.addEventListener('click', function() {
                    // Remove selected class from all options
                    optionsList.querySelectorAll('.option').forEach(opt => 
                        opt.classList.remove('selected')
                    );
                    
                    // Add selected class to this option
                    this.classList.add('selected');
                    
                    // Enable submit button
                    if (submitAnswerButton) {
                        submitAnswerButton.disabled = false;
                    }
                });
                
                optionsList.appendChild(optionBtn);
            });
            
            // Reset feedback and buttons
            if (answerFeedback) {
                answerFeedback.style.display = 'none';
            }
            
            if (submitAnswerButton && nextQuestionButton) {
                submitAnswerButton.style.display = 'block';
                submitAnswerButton.disabled = true;
                nextQuestionButton.style.display = 'none';
            }
        }
        
        // Update question counter
        const questionCounter = document.getElementById('question-counter');
        if (questionCounter) {
            questionCounter.textContent = `Question ${index + 1} of ${currentQuiz.questions.length}`;
        }
    }
    
    // Handle answer submission
    if (submitAnswerButton) {
        submitAnswerButton.addEventListener('click', function() {
            const optionsList = document.getElementById('options-list');
            const answerFeedback = document.getElementById('answer-feedback');
            
            if (!optionsList) return;
            
            const selectedOption = optionsList.querySelector('.option.selected');
            
            if (!selectedOption) {
                alert('Please select an answer');
                return;
            }
            
            const selectedIndex = parseInt(selectedOption.dataset.index);
            const currentQuestion = currentQuiz.questions[currentQuiz.currentQuestionIndex];
            const isCorrect = selectedIndex === currentQuestion.correct;
            
            // Mark options
            optionsList.querySelectorAll('.option').forEach((option, index) => {
                if (index === currentQuestion.correct) {
                    option.classList.add('correct');
                } else if (index === selectedIndex && !isCorrect) {
                    option.classList.add('incorrect');
                }
            });
            
            // Show feedback
            if (answerFeedback) {
                answerFeedback.innerHTML = `
                    <h4>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h4>
                    <p>${currentQuestion.explanation}</p>
                `;
                answerFeedback.style.display = 'block';
                answerFeedback.className = 'answer-feedback ' + (isCorrect ? 'correct-feedback' : 'incorrect-feedback');
            }
            
            // Update quiz state
            if (isCorrect) {
                currentQuiz.correctAnswers++;
                
                // Update streak for correct answers
                const streakElem = document.getElementById('streak-count-quiz');
                if (streakElem) {
                    let streak = parseInt(streakElem.textContent) || 0;
                    streak++;
                    streakElem.textContent = streak;
                }
            }
            
            // Update buttons
            this.style.display = 'none';
            if (nextQuestionButton) {
                nextQuestionButton.style.display = 'block';
            }
        });
    }
    
    // Next question button
    if (nextQuestionButton) {
        nextQuestionButton.addEventListener('click', function() {
            currentQuiz.currentQuestionIndex++;
            
            // Update progress
            updateQuizProgress(
                currentQuiz.currentQuestionIndex, 
                currentQuiz.questions.length
            );
            
            // Show next question or results
            if (currentQuiz.currentQuestionIndex < currentQuiz.questions.length) {
                showQuestion(currentQuiz.currentQuestionIndex);
            } else {
                showQuizResults();
            }
        });
    }
    
    // End quiz early
    if (endQuizButton) {
        endQuizButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to end this quiz early?')) {
                showQuizResults();
            }
        });
    }
    
    // Update quiz progress bar
    function updateQuizProgress(current, total) {
        const progressBar = document.getElementById('quiz-progress');
        
        if (progressBar) {
            const percentage = Math.round((current / total) * 100);
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    // Show quiz results
    function showQuizResults() {
        if (!quizResults || !quizInterface) return;
        
        quizInterface.style.display = 'none';
        quizResults.style.display = 'block';
        
        const finalScore = document.getElementById('final-score');
        const totalQuestions = document.getElementById('total-questions');
        const correctCount = document.getElementById('correct-count');
        const incorrectCount = document.getElementById('incorrect-count');
        const percentageScore = document.getElementById('percentage-score');
        
        if (finalScore) finalScore.textContent = currentQuiz.correctAnswers;
        if (totalQuestions) totalQuestions.textContent = currentQuiz.questions.length;
        if (correctCount) correctCount.textContent = currentQuiz.correctAnswers;
        if (incorrectCount) incorrectCount.textContent = currentQuiz.questions.length - currentQuiz.correctAnswers;
        
        if (percentageScore) {
            const percentage = Math.round((currentQuiz.correctAnswers / currentQuiz.questions.length) * 100);
            percentageScore.textContent = `${percentage}%`;
            
            // Update overall score on dashboard
            const quizScore = document.getElementById('quiz-score');
            if (quizScore) {
                quizScore.textContent = `${percentage}%`;
            }
            
            // Update quizzes completed
            const quizzesCompleted = document.getElementById('quizzes-completed');
            if (quizzesCompleted) {
                const completed = parseInt(quizzesCompleted.textContent) || 0;
                quizzesCompleted.textContent = completed + 1;
            }
        }
        
        // Add to recent activity
        addActivity(`Completed ${currentQuiz.selectedDifficulty} ${currentQuiz.selectedCategory} quiz`);
    }
    
    // Retake quiz button
    if (retakeQuizButton) {
        retakeQuizButton.addEventListener('click', function() {
            // Start with the same questions
            startQuiz(
                currentQuiz.questions, 
                currentQuiz.selectedCategory, 
                currentQuiz.selectedDifficulty
            );
        });
    }
    
    // Try different quiz button
    if (newQuizButton) {
        newQuizButton.addEventListener('click', function() {
            if (quizResults) quizResults.style.display = 'none';
            
            const quizCategoriesElem = document.querySelector('.quiz-categories');
            if (quizCategoriesElem) {
                quizCategoriesElem.style.display = 'block';
            }
        });
    }
}

// Audit Tools Functionality
function initAuditTools() {
    // Sample audit data
    const auditData = {
        ga4: [
            {
                category: "Account Structure",
                items: [
                    {id: "ga4_01", text: "Property hierarchy properly configured", weight: 5, completed: false},
                    {id: "ga4_02", text: "Data retention set to maximum (14 months)", weight: 8, completed: false},
                    {id: "ga4_03", text: "BigQuery export configured", weight: 10, completed: false}
                ]
            },
            {
                category: "Data Quality",
                items: [
                    {id: "ga4_04", text: "Internal traffic filtering enabled", weight: 7, completed: false},
                    {id: "ga4_05", text: "Bot filtering activated", weight: 6, completed: false},
                    {id: "ga4_06", text: "Cross-domain tracking implemented", weight: 9, completed: false}
                ]
            }
        ],
        gtm: [
            {
                category: "Container Health",
                items: [
                    {id: "gtm_01", text: "Container snippet properly installed", weight: 10, completed: false},
                    {id: "gtm_02", text: "No duplicate or conflicting tags", weight: 8, completed: false},
                    {id: "gtm_03", text: "Proper tag sequencing configured", weight: 7, completed: false}
                ]
            }
        ]
    };
    
    const auditButtons = document.querySelectorAll('.audit-btn');
    const auditCategories = document.getElementById('audit-categories');
    const saveAuditButton = document.getElementById('save-audit');
    const generateReportButton = document.getElementById('generate-report');
    const resetAuditButton = document.getElementById('reset-audit');
    
    let currentAuditType = 'ga4'; // Default to GA4
    
    // Handle audit type selection
    if (auditButtons) {
        auditButtons.forEach(button => {
            button.addEventListener('click', function() {
                auditButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                currentAuditType = this.getAttribute('data-audit');
                renderAuditCategories(currentAuditType);
            });
        });
    }
    
    // Render audit categories and items
    function renderAuditCategories(auditType) {
        if (!auditCategories || !auditData[auditType]) return;
        
        auditCategories.innerHTML = '';
        
        auditData[auditType].forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'audit-category';
            
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.innerHTML = `
                <h3 class="category-title">${category.category}</h3>
                <span class="category-score">0/${calculateMaxCategoryScore(category)}</span>
            `;
            
            // Make category header toggleable
            categoryHeader.addEventListener('click', function() {
                categoryElement.classList.toggle('open');
            });
            
            const categoryItems = document.createElement('div');
            categoryItems.className = 'category-items';
            
            category.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'audit-item';
                itemElement.innerHTML = `
                    <input type="checkbox" id="${item.id}" class="audit-checkbox" data-weight="${item.weight}">
                    <label for="${item.id}" class="audit-text">${item.text}</label>
                    <span class="audit-weight">Weight: ${item.weight}</span>
                `;
                
                // Add event listener to checkbox for score calculation
                const checkbox = itemElement.querySelector('.audit-checkbox');
                checkbox.addEventListener('change', function() {
                    // Update the item's completed status
                    const categoryIndex = auditData[auditType].findIndex(c => c.category === category.category);
                    const itemIndex = auditData[auditType][categoryIndex].items.findIndex(i => i.id === item.id);
                    auditData[auditType][categoryIndex].items[itemIndex].completed = this.checked;
                    
                    // Update the category score
                    updateCategoryScore(categoryElement, auditData[auditType][categoryIndex]);
                    
                    // Update overall audit progress
                    updateAuditProgress(auditType);
                });
                
                categoryItems.appendChild(itemElement);
            });
            
            categoryElement.appendChild(categoryHeader);
            categoryElement.appendChild(categoryItems);
            auditCategories.appendChild(categoryElement);
        });
    }
    
    // Calculate maximum possible score for a category
    function calculateMaxCategoryScore(category) {
        return category.items.reduce((total, item) => total + item.weight, 0);
    }
    
    // Calculate current score for a category
    function calculateCurrentCategoryScore(category) {
        return category.items.reduce((total, item) => total + (item.completed ? item.weight : 0), 0);
    }
    
    // Update category score display
    function updateCategoryScore(categoryElement, category) {
        const categoryScore = categoryElement.querySelector('.category-score');
        if (categoryScore) {
            const currentScore = calculateCurrentCategoryScore(category);
            const maxScore = calculateMaxCategoryScore(category);
            categoryScore.textContent = `${currentScore}/${maxScore}`;
        }
    }
    
    // Update overall audit progress
    function updateAuditProgress(auditType) {
        const auditScore = document.getElementById('audit-score');
        const completedItems = document.getElementById('completed-items');
        const auditProgressBar = document.getElementById('audit-progress-bar');
        
        if (!auditData[auditType] || !auditScore || !completedItems || !auditProgressBar) return;
        
        let totalItems = 0;
        let completedCount = 0;
        let totalWeight = 0;
        let totalScore = 0;
        
        // Calculate totals
        auditData[auditType].forEach(category => {
            totalItems += category.items.length;
            category.items.forEach(item => {
                totalWeight += item.weight;
                if (item.completed) {
                    completedCount++;
                    totalScore += item.weight;
                }
            });
        });
        
        // Update display
        auditScore.textContent = `${totalScore}/${totalWeight}`;
        completedItems.textContent = `${completedCount}/${totalItems}`;
        
        // Update progress bar
        const percentage = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
        auditProgressBar.style.width = `${percentage}%`;
    }
    
    // Save audit button
    if (saveAuditButton) {
        saveAuditButton.addEventListener('click', function() {
            alert('Audit progress saved!');
            addActivity(`Saved ${currentAuditType.toUpperCase()} audit progress`);
        });
    }
    
    // Generate report button
    if (generateReportButton) {
        generateReportButton.addEventListener('click', function() {
            // Show the report section
            const auditReport = document.getElementById('audit-report');
            if (auditReport) {
                auditReport.style.display = 'block';
            }
            
            // Calculate report data
            const currentAuditData = auditData[currentAuditType];
            let totalWeight = 0;
            let totalScore = 0;
            let criticalIssues = 0;
            let mediumIssues = 0;
            let lowIssues = 0;
            
            if (!currentAuditData) return;
            
            // Calculate totals
            currentAuditData.forEach(category => {
                category.items.forEach(item => {
                    totalWeight += item.weight;
                    if (item.completed) {
                        totalScore += item.weight;
                    } else {
                        // Categorize issues by weight
                        if (item.weight >= 9) {
                            criticalIssues++;
                        } else if (item.weight >= 6) {
                            mediumIssues++;
                        } else {
                            lowIssues++;
                        }
                    }
                });
            });
            
            // Update report elements
            const reportScore = document.getElementById('report-score');
            const criticalIssuesElem = document.getElementById('critical-issues');
            const mediumIssuesElem = document.getElementById('medium-issues');
            const lowIssuesElem = document.getElementById('low-issues');
            const recommendationsElem = document.getElementById('recommendations');
            
            if (reportScore) reportScore.textContent = totalScore;
            if (criticalIssuesElem) criticalIssuesElem.textContent = criticalIssues;
            if (mediumIssuesElem) mediumIssuesElem.textContent = mediumIssues;
            if (lowIssuesElem) lowIssuesElem.textContent = lowIssues;
            
            // Generate recommendations
            if (recommendationsElem) {
                recommendationsElem.innerHTML = '<h3>Top Recommendations</h3>';
                
                let recommendations = [];
                
                currentAuditData.forEach(category => {
                    category.items
                        .filter(item => !item.completed && item.weight >= 7) // Show only important items
                        .forEach(item => {
                            recommendations.push(`
                                <div class="recommendation-item">
                                    <h4>${item.text}</h4>
                                    <span class="recommendation-weight">Priority: ${item.weight}/10</span>
                                </div>
                            `);
                        });
                });
                
                if (recommendations.length > 0) {
                    recommendationsElem.innerHTML += recommendations.join('');
                } else {
                    recommendationsElem.innerHTML += '<p>No critical issues found. Great job!</p>';
                }
            }
            
            // Add to activity
            addActivity(`Generated ${currentAuditType.toUpperCase()} audit report`);
        });
    }
    
    // Reset audit button
    if (resetAuditButton) {
        resetAuditButton.addEventListener('click', function() {
            if (!confirm('Are you sure you want to reset this audit? All progress will be lost.')) {
                return;
            }
            
            // Reset data
            auditData[currentAuditType].forEach(category => {
                category.items.forEach(item => {
                    item.completed = false;
                });
            });
            
            // Re-render categories
            renderAuditCategories(currentAuditType);
            
            // Update progress
            updateAuditProgress(currentAuditType);
            
            // Hide report if visible
            const auditReport = document.getElementById('audit-report');
            if (auditReport) {
                auditReport.style.display = 'none';
            }
            
            // Add to activity
            addActivity(`Reset ${currentAuditType.toUpperCase()} audit`);
        });
    }
    
    // Initialize with GA4 audit
    renderAuditCategories(currentAuditType);
    
    // Initialize audit progress
    updateAuditProgress(currentAuditType);
}