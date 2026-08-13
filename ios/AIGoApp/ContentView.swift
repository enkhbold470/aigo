import SwiftUI
import UIKit

struct ContentView: View {
    @Binding var showCamera: Bool

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
        NavigationView {
            Form {
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

                // MARK: – Backend Server Settings
                Section(header: Text("AI Backend Server")) {
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
            }
            .navigationTitle("AIGo Personalize")
        }
        // Camera sheet — opened via aigo://camera deep link from keyboard extension
        .sheet(isPresented: $showCamera) {
            CameraPickerView { image in
                image.copyToPasteboard()
                showCamera = false
            }
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
