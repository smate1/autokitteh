// AutoKitteh Landing Page Interactivity

document.addEventListener('DOMContentLoaded', () => {
	// Handle view toggle functionality
	const toggleOptions = document.querySelectorAll('.toggle-option')
	const viewContents = document.querySelectorAll('.view-content')

	toggleOptions.forEach(option => {
		option.addEventListener('click', () => {
			const targetView = option.getAttribute('data-view')

			// Remove active class from all options
			toggleOptions.forEach(opt => opt.classList.remove('active'))
			// Add active class to clicked option
			option.classList.add('active')

			// Hide all view contents
			viewContents.forEach(content => content.classList.remove('active'))
			// Show target view content
			const targetContent = document.querySelector(
				`.view-content.${targetView}-view`
			)
			if (targetContent) {
				targetContent.classList.add('active')
			}
		})
	})

	// Handle demo input interaction
	const demoInput = document.querySelector(
		'.demo-input-modern'
	) as HTMLTextAreaElement
	const demoSendBtn = document.querySelector(
		'.demo-send-btn'
	) as HTMLButtonElement
	const suggestionChips = document.querySelectorAll('.suggestion-chip')

	// Handle suggestion chips
	suggestionChips.forEach(chip => {
		chip.addEventListener('click', () => {
			const chipText = chip.textContent?.trim()
			if (chipText && demoInput) {
				// Simple mapping of chip text to example prompts
				const prompts: Record<string, string> = {
					Webhook:
						'When webhook is received, send a Slack message to #alerts channel',
					'Email AI':
						'When new email arrives, analyze sentiment and categorize by priority',
					'AI Agent':
						'When GitHub issue is created, analyze requirements and suggest implementation approach',
					'Reddit Summary':
						'Monitor /r/programming for posts about automation, summarize daily and post to Slack',
				}

				demoInput.value =
					prompts[chipText] || `Create automation for ${chipText}`
				demoInput.focus()
			}
		})
	})

	// Handle demo send button
	demoSendBtn?.addEventListener('click', () => {
		const inputValue = demoInput?.value?.trim()
		if (inputValue) {
			// Simple demo response - in real app this would call API
			showDemoResponse(inputValue)
		}
	})

	// Handle Enter key in demo input
	demoInput?.addEventListener('keydown', e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			demoSendBtn?.click()
		}
	})

	// Smooth scrolling for navigation links
	const navLinks = document.querySelectorAll('a[href^="#"]')
	navLinks.forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault()
			const targetId = link.getAttribute('href')?.substring(1)
			const targetElement = targetId ? document.getElementById(targetId) : null

			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				})
			}
		})
	})

	// Add fade-in animation on scroll
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px',
	}

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('fade-in')
			}
		})
	}, observerOptions)

	// Observe elements for animation
	const animatedElements = document.querySelectorAll(
		'.workflow-step, .benefit-highlight, .comparison-item, .use-case-card, .deployment-card, .screenshot-card'
	)
	animatedElements.forEach(el => observer.observe(el))

	// Handle mobile menu (if needed)
	const navToggle = document.querySelector('.nav-toggle')
	const navLinks_mobile = document.querySelector('.nav-links')

	navToggle?.addEventListener('click', () => {
		navLinks_mobile?.classList.toggle('active')
	})

	// Add hover effects for cards
	const cards = document.querySelectorAll(
		'.benefit-card, .comparison-item, .use-case-card, .deployment-card'
	)

	cards.forEach(card => {
		const cardElement = card as HTMLElement
		cardElement.addEventListener('mouseenter', () => {
			cardElement.style.transform = 'translateY(-8px)'
		})

		cardElement.addEventListener('mouseleave', () => {
			cardElement.style.transform = 'translateY(0)'
		})
	})
})

// Show demo response function
function showDemoResponse(prompt: string) {
	// Create or find demo output element
	let outputElement = document.querySelector('.demo-output') as HTMLElement

	if (!outputElement) {
		outputElement = document.createElement('div') as HTMLElement
		outputElement.classList.add('demo-output')

		const demoSection = document.querySelector('.demo-section')
		demoSection?.appendChild(outputElement)
	}

	// Simple demo response based on prompt
	const responses: Record<string, string> = {
		webhook: `
# AutoKitteh Workflow Generated

@ak.trigger.webhook(path="/alerts")
def handle_alert(event):
    message = event.data.get("message", "Alert received")
    severity = event.data.get("severity", "info")

    slack.send_message(
        channel="#alerts",
        text=f"🚨 {severity.upper()}: {message}",
        blocks=[
            {
                "type": "section",
                "text": {"type": "mrkdwn", "text": message}
            }
        ]
    )

    return {"status": "sent", "channel": "#alerts"}`,
		email: `
# AI Email Processor

@ak.trigger.email_received
def process_email(email):
    # Analyze email sentiment and content
    analysis = ai.analyze_text(email.body, [
        "sentiment", "priority", "category", "action_required"
    ])

    if analysis.priority == "high":
        slack.notify_team(f"High priority email: {email.subject}")

    # Auto-categorize and respond
    if analysis.category == "support":
        support.create_ticket(email, priority=analysis.priority)

    return analysis`,
		default: `
# Generated Workflow

@ak.trigger.schedule("0 9 * * *")  # Daily at 9 AM
def daily_automation():
    # Your automation logic here
    data = external_api.fetch_data()
    processed = ai.process(data)

    if processed.requires_attention:
        slack.send_message(
            channel="#team",
            text=f"Daily report: {processed.summary}"
        )

    return {"status": "completed", "items": len(data)}`,
	}

	// Find best matching response
	const lowerPrompt = prompt.toLowerCase()
	let response = responses.default

	if (lowerPrompt.includes('webhook') || lowerPrompt.includes('slack')) {
		response = responses.webhook
	} else if (lowerPrompt.includes('email') || lowerPrompt.includes('ai')) {
		response = responses.email
	}

	// Animate the response
	outputElement.style.opacity = '0'
	outputElement.innerHTML = `<pre><code>${response}</code></pre>`

	setTimeout(() => {
		outputElement.style.opacity = '1'
		outputElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
	}, 100)
}

// Export for potential use
export { showDemoResponse }
