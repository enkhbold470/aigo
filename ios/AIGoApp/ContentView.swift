import SwiftUI
import UIKit

struct ContentView: View {
    @Binding var showCamera: Bool

    // Onboarding state
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    @State private var showOnboarding = false

    // Personalization State
    @State private var gender: String = AppGroupManager.shared.gender
    @State private var sexuality: String = AppGroupManager.shared.sexuality
    @State private var age: Int = AppGroupManager.shared.age
    @State private var intent: String = AppGroupManager.shared.intent
    @State private var platform: String = AppGroupManager.shared.platform
    @State private var casingStyle: String = AppGroupManager.shared.casingStyle
    @State private var toneStyle: String = AppGroupManager.shared.toneStyle
    @State private var flirtLevel: Int = AppGroupManager.shared.flirtLevel

    // Backend URL
    @State private var serverURL: String = AppGroupManager.shared.apiBaseURL

    let genders = ["Male", "Female", "Non-binary", "Other"]
    let sexualities = ["Straight", "Gay", "Lesbian", "Bisexual", "Queer", "Other"]
    let intents = ["Fun & Hookup", "A Relationship", "Casual Date", "Neutral"]
    let platforms = ["iMessage", "Instagram DM", "Dating Apps (Tinder/Hinge/Bumble)"]
    let casingStyles = ["all lowercase", "standard casing", "ALL CAPS"]
    let toneStyles = ["Brainrot / Gen-Z Slang", "Proper English", "Playful", "Witty & Flirty"]

    var body: some View {
        Group {
            if !hasCompletedOnboarding {
                OnboardingView(hasCompletedOnboarding: $hasCompletedOnboarding)
            } else {
                mainContent
            }
        }
        .onAppear {
            if !hasCompletedOnboarding {
                showOnboarding = true
            }
        }
        // Camera sheet — opened via aigo://camera deep link from keyboard extension
        .sheet(isPresented: $showCamera) {
            CameraPickerView { image in
                image.copyToPasteboard()
                showCamera = false
            }
        }
    }

    private var mainContent: some View {
        NavigationView {
            Form {
                // MARK: – Status Card
                Section {
                    HStack(spacing: 12) {
                        ZStack {
                            Circle()
                                .fill(Color(red: 0.0, green: 0.48, blue: 1.0).opacity(0.15))
                                .frame(width: 44, height: 44)
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 22, weight: .medium))
                                .foregroundColor(Color(red: 0.0, green: 0.48, blue: 1.0))
                        }
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Rizz Ready")
                                .font(.system(size: 17, weight: .semibold, design: .default))
                                .foregroundColor(.primary)
                            Text("Keyboard is set up and connected")
                                .font(.system(size: 13, weight: .regular, design: .default))
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                    }
                    .padding(.vertical, 4)
                }

                // MARK: – Personalize Profile
                Section(header: Text("Personalize Profile")) {
                    Picker("Gender", selection: $gender) {
                        ForEach(genders, id: \.self) { Text($0) }
                    }
                    .onChange(of: gender) { _, newValue in AppGroupManager.shared.gender = newValue }

                    Picker("Sexuality", selection: $sexuality) {
                        ForEach(sexualities, id: \.self) { Text($0) }
                    }
                    .onChange(of: sexuality) { _, newValue in AppGroupManager.shared.sexuality = newValue }

                    Stepper("Age: \(age)", value: $age, in: 18...99)
                        .onChange(of: age) { _, newValue in AppGroupManager.shared.age = newValue }
                }

                // MARK: – Intent & App Context
                Section(header: Text("Dating Intent & Context")) {
                    Picker("Intent", selection: $intent) {
                        ForEach(intents, id: \.self) { Text($0) }
                    }
                    .onChange(of: intent) { _, newValue in AppGroupManager.shared.intent = newValue }

                    Picker("Platform", selection: $platform) {
                        ForEach(platforms, id: \.self) { Text($0) }
                    }
                    .onChange(of: platform) { _, newValue in AppGroupManager.shared.platform = newValue }
                }

                // MARK: – Style, Tone & Flirt Level
                Section(header: Text("Style & Tone Tuning")) {
                    Picker("Casing", selection: $casingStyle) {
                        ForEach(casingStyles, id: \.self) { Text($0) }
                    }
                    .onChange(of: casingStyle) { _, newValue in AppGroupManager.shared.casingStyle = newValue }

                    Picker("Tone", selection: $toneStyle) {
                        ForEach(toneStyles, id: \.self) { Text($0) }
                    }
                    .onChange(of: toneStyle) { _, newValue in AppGroupManager.shared.toneStyle = newValue }

                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text("Flirt Level")
                            Spacer()
                            Text("\(flirtLevel) / 5 — \(flirtLevelDescription(flirtLevel))")
                                .font(.caption.weight(.semibold))
                                .foregroundColor(.indigo)
                        }
                        Stepper(value: $flirtLevel, in: 1...5) {
                            Text("Level \(flirtLevel)")
                        }
                        .onChange(of: flirtLevel) { _, newValue in AppGroupManager.shared.flirtLevel = newValue }
                    }
                    .padding(.vertical, 4)
                }

                // MARK: – How to Use
                Section(header: Text("How to Use")) {
                    VStack(alignment: .leading, spacing: 10) {
                        Label("Take a screenshot of a chat", systemImage: "1.circle.fill")
                        Label("Tap the preview → Copy", systemImage: "2.circle.fill")
                        Label("Open Messages, switch to AIGo (🌐)", systemImage: "3.circle.fill")
                        Label("Tap rizz → tap a bubble to send", systemImage: "4.circle.fill")
                    }
                    .font(.system(size: 15, weight: .regular, design: .default))
                    .foregroundColor(.secondary)
                    .padding(.vertical, 4)
                }

                // MARK: – Privacy & Data
                Section(header: Text("Privacy & Data")) {
                    NavigationLink("Privacy Policy") {
                        PrivacyView()
                    }
                    NavigationLink("Delete My Data") {
                        DeleteDataView()
                    }
                    Button(role: .destructive) {
                        hasCompletedOnboarding = false
                    } label: {
                        Label("Reset Onboarding", systemImage: "arrow.counterclockwise")
                    }
                }

                // MARK: – AI Backend Server (Debug)
                #if DEBUG
                Section(header: Text("AI Backend Server (Debug)")) {
                    TextField("Server URL", text: $serverURL)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .onChange(of: serverURL) { _, newValue in
                            AppGroupManager.shared.apiBaseURL = newValue
                        }

                    Text("Connected to \(serverURL)")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                #endif
            }
            .navigationTitle("AIGo Personalize")
        }
    }

    private func flirtLevelDescription(_ level: Int) -> String {
        switch level {
        case 1: return "Mild & Subtle"
        case 2: return "Smooth & Teasing"
        case 3: return "Playful Banter"
        case 4: return "Bold & Direct"
        case 5: return "Unhinged & Down Bad"
        default: return "Playful"
        }
    }
}

// MARK: - Privacy View
struct PrivacyView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Privacy Policy")
                    .font(.title.weight(.bold))
                Text("Last updated: \(DateFormatter.localizedString(from: Date(), dateStyle: .long, timeStyle: .none))")
                    .foregroundColor(.secondary)

                Group {
                    Text("What We Collect")
                        .font(.headline)
                    Text("""
                    • Screenshots you copy to clipboard (processed for AI rizz generation only)
                    • Personalization preferences (gender, sexuality, age, intent, tone settings)
                    • Anonymous device identifier for rate limiting
                    • Anonymous usage analytics (rizz requests count, success/failure)
                    """)

                    Text("How We Use Your Data")
                        .font(.headline)
                    Text("""
                    • Screenshots are sent to our AI backend to generate contextual replies
                    • No screenshots are stored on our servers after processing
                    • Personalization stays on your device (App Group UserDefaults)
                    • Device ID used only to enforce free tier limits
                    """)

                    Text("Data Retention")
                        .font(.headline)
                    Text("""
                    • Screenshots: processed in-memory, never persisted
                    • Request logs: aggregated analytics kept for 30 days
                    • Settings: stored locally until you delete the app
                    """)

                    Text("Your Rights")
                        .font(.headline)
                    Text("""
                    • Delete all data: use "Delete My Data" in settings
                    • Opt out of analytics: delete the app
                    • Contact: support@aigo.app
                    """)
                }
            }
            .padding(20)
        }
        .navigationTitle("Privacy Policy")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Delete Data View
struct DeleteDataView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var confirmText = ""
    @State private var isDeleting = false
    @State private var showSuccess = false

    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: "trash.circle.fill")
                .font(.system(size: 60, weight: .medium))
                .foregroundColor(.red)

            Text("Delete All Data")
                .font(.title.weight(.bold))

            Text("This will permanently delete:")
                .foregroundColor(.secondary)
            VStack(alignment: .leading, spacing: 8) {
                Label("Personalization settings", systemImage: "person.fill")
                Label("Device identifier", systemImage: "iphone")
                Label("Local request history", systemImage: "clock.arrow.circlepath")
            }
            .font(.system(size: 15))
            .foregroundColor(.secondary)

            Text("Type \"DELETE\" to confirm:")
                .font(.headline)

            TextField("DELETE", text: $confirmText)
                .textFieldStyle(.roundedBorder)
                .padding(.horizontal, 40)
                .autocapitalization(.allCharacters)

            Button(role: .destructive) {
                deleteAllData()
            } label: {
                if isDeleting {
                    ProgressView()
                        .frame(maxWidth: .infinity)
                } else {
                    Text("Delete Everything")
                        .frame(maxWidth: .infinity)
                }
            }
            .buttonStyle(.borderedProminent)
            .disabled(confirmText != "DELETE" || isDeleting)
            .padding(.horizontal, 40)

            Spacer()
        }
        .padding(20)
        .navigationTitle("Delete Data")
        .navigationBarTitleDisplayMode(.inline)
        .alert("Data Deleted", isPresented: $showSuccess) {
            Button("OK") { dismiss() }
        } message: {
            Text("All local data has been removed. You'll see onboarding again on next launch.")
        }
    }

    private func deleteAllData() {
        isDeleting = true
        let group = AppGroupManager.shared
        let defaults = UserDefaults(suiteName: AppGroupManager.appGroupID)

        // Clear App Group
        defaults?.removePersistentDomain(forName: AppGroupManager.appGroupID)

        // Clear standard UserDefaults keys
        let keys = ["hasCompletedOnboarding", "deviceId"]
        keys.forEach { UserDefaults.standard.removeObject(forKey: $0) }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            isDeleting = false
            showSuccess = true
        }
    }
}
