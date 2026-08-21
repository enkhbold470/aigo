import SwiftUI
import UIKit

struct OnboardingView: View {
    @Binding var hasCompletedOnboarding: Bool
    @StateObject private var viewModel = OnboardingViewModel()

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Progress Indicator
                progressBar
                    .padding(.horizontal, 20)
                    .padding(.top, 16)

                // Step Content
                TabView(selection: $viewModel.currentStep) {
                    // Step 1: Add Keyboard
                    StepView(
                        number: 1,
                        title: "Add AIGo Keyboard",
                        subtitle: "Enable the keyboard in Settings",
                        icon: "keyboard",
                        description: """
                        1. Open Settings → General → Keyboard
                        2. Tap Keyboards → Add New Keyboard
                        3. Select "AIGo Keyboard"
                        """,
                        actionTitle: "Open Settings",
                        action: { viewModel.openKeyboardSettings() },
                        canAutoAdvance: true
                    )
                    .tag(1)

                    // Step 2: Allow Full Access
                    StepView(
                        number: 2,
                        title: "Allow Full Access",
                        subtitle: "Required for AI rizz & screenshots",
                        icon: "lock.shield",
                        description: """
                        1. Tap "AIGo Keyboard" in the keyboards list
                        2. Turn on "Allow Full Access"
                        3. Confirm "Allow" on the popup
                        """,
                        actionTitle: "Open Keyboard Settings",
                        action: { viewModel.openKeyboardSettings() },
                        canAutoAdvance: true
                    )
                    .tag(2)

                    // Step 3: Test Rizz
                    StepView(
                        number: 3,
                        title: "Test Your First Rizz",
                        subtitle: "Copy a screenshot → tap rizz",
                        icon: "sparkles",
                        description: """
                        1. Take a screenshot of a chat
                        2. Tap the screenshot preview → Copy
                        3. Open Messages, switch to AIGo (🌐)
                        4. Tap "rizz" — get 3 AI replies
                        """,
                        actionTitle: "Copy Sample Screenshot",
                        action: { viewModel.copySampleScreenshot() },
                        canAutoAdvance: false
                    )
                    .tag(3)

                    // Step 4: Success
                    StepView(
                        number: 4,
                        title: "You're Ready! 🎉",
                        subtitle: "AIGo is set up and working",
                        icon: "checkmark.circle.fill",
                        description: """
                        Tap rizz anytime you have a screenshot copied.
                        Adjust your vibe in Personalize below.
                        """,
                        actionTitle: "Finish Setup",
                        action: { hasCompletedOnboarding = true },
                        canAutoAdvance: false,
                        isFinal: true
                    )
                    .tag(4)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .animation(.easeInOut, value: viewModel.currentStep)

                // Bottom Navigation
                HStack(spacing: 16) {
                    if viewModel.currentStep > 1 {
                        Button("Back") {
                            withAnimation { viewModel.currentStep -= 1 }
                        }
                        .font(.system(size: 17, weight: .medium))
                        .foregroundColor(.primary)
                    }

                    Spacer()

                    if viewModel.currentStep < 4 {
                        Button(viewModel.currentStep == 3 ? "I've Tested It" : "Next") {
                            withAnimation { viewModel.currentStep += 1 }
                        }
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(minWidth: 100, minHeight: 44)
                        .background(Color(red: 0.0, green: 0.48, blue: 1.0))
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 32)
            }
            .background(Color(UIColor.systemGroupedBackground))
            .navigationTitle("Welcome to AIGo")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    // MARK: - Progress Bar
    private var progressBar: some View {
        HStack(spacing: 8) {
            ForEach(1...4, id: \.self) { step in
                Capsule()
                    .fill(step <= viewModel.currentStep ? Color(red: 0.0, green: 0.48, blue: 1.0) : Color(UIColor.systemGray4))
                    .frame(height: 4)
                    .animation(.spring(response: 0.4), value: viewModel.currentStep)
            }
        }
    }
}

// MARK: - Step View
private struct StepView: View {
    let number: Int
    let title: String
    let subtitle: String
    let icon: String
    let description: String
    let actionTitle: String
    let action: () -> Void
    let canAutoAdvance: Bool
    let isFinal: Bool

    init(number: Int, title: String, subtitle: String, icon: String, description: String, actionTitle: String, action: @escaping () -> Void, canAutoAdvance: Bool, isFinal: Bool = false) {
        self.number = number
        self.title = title
        self.subtitle = subtitle
        self.icon = icon
        self.description = description
        self.actionTitle = actionTitle
        self.action = action
        self.canAutoAdvance = canAutoAdvance
        self.isFinal = isFinal
    }

    var body: some View {
        VStack(spacing: 24) {
            Spacer()

            // Icon
            ZStack {
                Circle()
                    .fill(Color(red: 0.0, green: 0.48, blue: 1.0).opacity(0.15))
                    .frame(width: 100, height: 100)

                Image(systemName: icon)
                    .font(.system(size: 40, weight: .medium))
                    .foregroundColor(Color(red: 0.0, green: 0.48, blue: 1.0))
            }

            // Title & Subtitle
            VStack(spacing: 6) {
                Text(title)
                    .font(.system(size: 28, weight: .bold, design: .default))
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.center)

                Text(subtitle)
                    .font(.system(size: 17, weight: .regular, design: .default))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            .padding(.horizontal, 24)

            // Description
            Text(description)
                .font(.system(size: 15, weight: .regular, design: .default))
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
                .fixedSize(horizontal: false, vertical: true)

            Spacer()

            // Action Button
            Button(action: action) {
                Text(actionTitle)
                    .font(.system(size: 17, weight: .semibold, design: .default))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(Color(red: 0.0, green: 0.48, blue: 1.0))
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            }
            .padding(.horizontal, 32)
            .padding(.bottom, 16)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - ViewModel
@MainActor
final class OnboardingViewModel: ObservableObject {
    @Published var currentStep = 1

    func openKeyboardSettings() {
        if let url = URL(string: UIApplication.openSettingsURLString) {
            UIApplication.shared.open(url)
        }
    }

    func copySampleScreenshot() {
        // Create a realistic iMessage conversation mockup
        let renderer = UIGraphicsImageRenderer(size: CGSize(width: 390, height: 700))
        let image = renderer.image { ctx in
            let cgContext = ctx.cgContext

            // iMessage background
            UIColor.systemBackground.setFill()
            cgContext.fill(CGRect(origin: .zero, size: CGSize(width: 390, height: 700)))

            // Draw iMessage-style bubbles (incoming = left, gray; outgoing = right, blue)
            let messages: [(text: String, isIncoming: Bool, time: String, showAvatar: Bool)] = [
                ("hey! just saw your profile 😊", true, "10:41 AM", true),
                ("what's your favorite way to spend a weekend?", true, "10:41 AM", false),
                ("honestly? hiking or trying new coffee spots ☕️", false, "10:42 AM", false),
                ("you?", false, "10:42 AM", false),
                ("same energy! there's this hidden trail near me with the best views", true, "10:43 AM", false),
                ("we should go sometime 😉", true, "10:43 AM", false),
            ]

            var yPos: CGFloat = 80
            let avatarSize: CGFloat = 32
            let maxBubbleWidth: CGFloat = 260
            let horizontalPadding: CGFloat = 16
            let verticalSpacing: CGFloat = 8

            for (index, message) in messages.enumerated() {
                // Calculate text size
                let textFont = UIFont.systemFont(ofSize: 16, weight: .regular)
                let textAttributes: [NSAttributedString.Key: Any] = [
                    .font: textFont,
                    .foregroundColor: message.isIncoming ? UIColor.label : UIColor.white
                ]
                let textSize = (message.text as NSString).boundingRect(
                    with: CGSize(width: maxBubbleWidth - 32, height: .greatestFiniteMagnitude),
                    options: [.usesLineFragmentOrigin, .usesFontLeading],
                    attributes: textAttributes,
                    context: nil
                ).size

                let bubbleWidth = min(textSize.width + 32, maxBubbleWidth)
                let bubbleHeight = textSize.height + 24

                let bubbleX: CGFloat
                if message.isIncoming {
                    bubbleX = horizontalPadding
                } else {
                    bubbleX = 390 - horizontalPadding - bubbleWidth
                }

                let bubbleRect = CGRect(x: bubbleX, y: yPos, width: bubbleWidth, height: bubbleHeight)
                let cornerRadius: CGFloat = 22

                // Draw bubble background
                let bubblePath = UIBezierPath(roundedRect: bubbleRect, cornerRadius: cornerRadius)
                if message.isIncoming {
                    UIColor.systemGray5.setFill()
                } else {
                    UIColor(red: 0/255, green: 122/255, blue: 255/255, alpha: 1).setFill() // iMessage blue
                }
                bubblePath.fill()

                // Draw avatar for first incoming message
                if message.isIncoming && message.showAvatar {
                    let avatarRect = CGRect(x: horizontalPadding, y: yPos - 4, width: avatarSize, height: avatarSize)
                    let avatarPath = UIBezierPath(ovalIn: avatarRect)
                    UIColor.systemBlue.setFill()
                    avatarPath.fill()
                    // Draw initial in avatar
                    let initialAttr: [NSAttributedString.Key: Any] = [
                        .font: UIFont.systemFont(ofSize: 14, weight: .semibold),
                        .foregroundColor: UIColor.white
                    ]
                    "A".draw(in: avatarRect.insetBy(dx: 8, dy: 8), withAttributes: initialAttr)
                }

                // Draw text
                let textRect = CGRect(
                    x: bubbleRect.minX + 16,
                    y: bubbleRect.minY + 12,
                    width: bubbleRect.width - 32,
                    height: bubbleRect.height - 24
                )
                message.text.draw(in: textRect, withAttributes: textAttributes)

                // Draw time
                let timeFont = UIFont.systemFont(ofSize: 11, weight: .regular)
                let timeColor = message.isIncoming ? UIColor.tertiaryLabel : UIColor.white.withAlphaComponent(0.7)
                let timeAttr: [NSAttributedString.Key: Any] = [
                    .font: timeFont,
                    .foregroundColor: timeColor
                ]
                let timeSize = (message.time as NSString).size(withAttributes: timeAttr)
                let timeX = message.isIncoming ? bubbleRect.minX + 8 : bubbleRect.maxX - timeSize.width - 8
                let timeY = bubbleRect.maxY + 2
                message.time.draw(at: CGPoint(x: timeX, y: timeY), withAttributes: timeAttr)

                yPos += bubbleHeight + verticalSpacing
            }

            // Draw status bar hint at top
            let statusBarAttr: [NSAttributedString.Key: Any] = [
                .font: UIFont.systemFont(ofSize: 13, weight: .semibold),
                .foregroundColor: UIColor.secondaryLabel
            ]
            "iMessage".draw(at: CGPoint(x: 20, y: 35), withAttributes: statusBarAttr)
            "09:41".draw(at: CGPoint(x: 340, y: 35), withAttributes: statusBarAttr)
        }

        // Copy to pasteboard
        UIPasteboard.general.image = image

        // Haptic feedback
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
    }
}