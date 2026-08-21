import SwiftUI
import UIKit

struct AIGoKeyboardView: View {
    @ObservedObject var session: KeyboardSession

    @State private var rizzItems: [RizzItem] = []
    @State private var isGenerating = false
    @State private var clipboardImage: UIImage?
    @State private var errorMessage: String?
    @State private var showError = false

    var body: some View {
        VStack(spacing: 0) {
            if !session.hasFullAccess {
                fullAccessBanner
            }

            // Error Toast
            if showError, let errorMessage {
                errorToast(message: errorMessage)
                    .transition(.move(edge: .top).combined(with: .opacity))
                    .animation(.spring(response: 0.3, dampingFraction: 0.8), value: showError)
            }

            // Main Content Area
            if isGenerating {
                generatingView
            } else if clipboardImage == nil && rizzItems.isEmpty {
                initialEmptyState
            } else {
                rizzContentView
            }

            Spacer(minLength: 2)

            // Bottom Action Control Row (re-rizz + Backspace)
            bottomControlRow
                .padding(.horizontal, 14)
                .padding(.bottom, 8)
                .padding(.top, 4)
        }
        .background(Color(UIColor.systemGray5)) // Exact Apple iOS keyboard background color
        .onAppear(perform: bootstrap)
    }

    // MARK: – Error Toast
    private func errorToast(message: String) -> some View {
        Text(message)
            .font(.system(size: 12, weight: .medium, design: .default))
            .foregroundColor(.white)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .frame(maxWidth: .infinity)
            .background(Color.red.opacity(0.9))
            .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
            .padding(.horizontal, 14)
            .padding(.top, 4)
    }

    // MARK: – Full Access Banner
    private var fullAccessBanner: some View {
        Text("Enable Full Access in Settings to allow screenshot & AI rizz 🔑")
            .font(.caption2)
            .foregroundColor(.white)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .frame(maxWidth: .infinity)
            .background(Color.orange.opacity(0.9))
    }

    // MARK: – Initial Empty State (When NO screenshot exists)
    private var initialEmptyState: some View {
        VStack(spacing: 12) {
            Spacer()

            // Squircle Logo Container
            ZStack {
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Color(UIColor.systemBackground))
                    .frame(width: 64, height: 64)
                    .shadow(color: .black.opacity(0.08), radius: 6, x: 0, y: 3)

                Image(systemName: "sparkles")
                    .font(.system(size: 30, weight: .semibold))
                    .foregroundColor(.primary)
            }

            VStack(spacing: 4) {
                Text("Copy a screenshot")
                    .font(.system(size: 17, weight: .bold, design: .default))
                    .foregroundColor(.primary)

                Text("Then tap rizz — AIGo reads your clipboard")
                    .font(.system(size: 13, weight: .regular, design: .default))
                    .foregroundColor(.secondary)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: – Rizz Content View (Scrollable Screenshot + Rizz Bubbles)
    private var rizzContentView: some View {
        ScrollView(.vertical, showsIndicators: true) {
            VStack(alignment: .trailing, spacing: 10) {
                // Screenshot Preview at Top Left of Scroll View (just like incoming received image)
                if let img = clipboardImage {
                    HStack {
                        Image(uiImage: img)
                            .resizable()
                            .scaledToFit()
                            .frame(maxWidth: 220, maxHeight: 160)
                            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                            .shadow(color: .black.opacity(0.12), radius: 4, y: 2)
                        Spacer()
                    }
                    .padding(.top, 6)
                    .padding(.bottom, 2)
                }

                // Rizz Message Bubbles
                ForEach(rizzItems) { item in
                    Button {
                        session.insert(item.text)
                    } label: {
                        messageBubble(tone: item.tone, text: item.text)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 4)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // Single iMessage-style Rizz Bubble (Exact 13pt Apple system font, 22pt curved corners)
    private func messageBubble(tone: String, text: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(tone)
                .font(.system(size: 10, weight: .semibold, design: .default))
                .foregroundColor(Color.white.opacity(0.85))

            Text(text)
                .font(.system(size: 13, weight: .regular, design: .default)) // Exact 13pt Apple System Font
                .foregroundColor(.white)
                .multilineTextAlignment(.leading)
        }
        .padding(.horizontal, 13)
        .padding(.vertical, 8)
        .background(Color(red: 0.0, green: 0.48, blue: 1.0)) // iMessage Blue
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous)) // Curved 22pt
        .shadow(color: Color.blue.opacity(0.18), radius: 3, y: 2)
        .frame(maxWidth: 260, alignment: .trailing)
    }

    // MARK: – Generating Spinner View
    private var generatingView: some View {
        VStack(spacing: 10) {
            Spacer()
            ProgressView()
                .scaleEffect(1.2)
            Text("Generating rizz…")
                .font(.system(size: 13, weight: .medium, design: .default))
                .foregroundColor(.secondary)
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: – Bottom Action Control Row (re-rizz + Globe + Backspace)
    private var bottomControlRow: some View {
        HStack(spacing: 8) {
            // Globe / Next Keyboard Button (leftmost)
            Button {
                session.nextKeyboard()
            } label: {
                Image(systemName: "globe")
                    .font(.system(size: 20, weight: .medium, design: .default))
                    .foregroundColor(.primary)
                    .frame(width: 44, height: 44)
                    .background(Color(UIColor.systemGray4))
                    .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Next Keyboard")

            // Main Action Button: "re-rizz"
            Button {
                generateRizz()
            } label: {
                HStack(spacing: 6) {
                    if isGenerating {
                        ProgressView()
                            .tint(.white)
                    }
                    Text(rizzItems.isEmpty ? "rizz" : "re-rizz ↺")
                        .font(.system(size: 16, weight: .semibold, design: .default))
                        .foregroundColor(.white)
                }
                .frame(maxWidth: .infinity)
                .frame(height: 44)
                .background(clipboardImage == nil ? Color(UIColor.systemGray3) : Color(white: 0.20))
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            }
            .buttonStyle(.plain)
            .disabled(isGenerating || clipboardImage == nil)

            // Backspace Button (⌫) on right
            Button {
                session.deleteBackward()
            } label: {
                Image(systemName: "delete.left")
                    .font(.system(size: 18, weight: .semibold, design: .default))
                    .foregroundColor(.primary)
                    .frame(width: 44, height: 44)
                    .background(Color(UIColor.systemGray4))
                    .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            }
            .buttonStyle(.plain)
        }
    }

    // MARK: – Bootstrap & Logic
    private func bootstrap() {
        guard session.hasFullAccess else { return }
        loadClipboardImage {
            // Immediate auto-generation on screenshot:
            if self.clipboardImage != nil && self.rizzItems.isEmpty {
                self.generateRizz()
            }
        }
    }

    private func loadClipboardImage(completion: (() -> Void)? = nil) {
        // 1. First check pasteboard image
        let state = ClipboardMonitor.shared.inspectPasteboard(hasFullAccess: session.hasFullAccess)
        if state.hasImage, let img = UIPasteboard.general.image {
            clipboardImage = img
            completion?()
            return
        }
        // No fallback to Photos; clipboard image is required
        completion?()
    }

    private func generateRizz() {
        var imageBase64: String?
        if let img = clipboardImage, let jpegData = img.jpegData(compressionQuality: 0.7) {
            imageBase64 = jpegData.base64EncodedString()
        } else if let data = ClipboardMonitor.shared.inspectPasteboard(hasFullAccess: session.hasFullAccess).imageBase64 {
            imageBase64 = data
        }

        guard let validBase64 = imageBase64 else {
            showErrorMessage("No screenshot in clipboard. Copy a screenshot first.")
            return
        }

        isGenerating = true
        errorMessage = nil

        // Pure screenshot mode (no copy text requirement)
        AIAPIClient.shared.generateRizz(
            imageBase64: validBase64,
            context: ""
        ) { result in
            DispatchQueue.main.async {
                isGenerating = false
                switch result {
                case .success(let items):
                    // Filter out canned fallback lines - only show if we got real AI responses
                    let realItems = items.filter { item in
                        !Self.isCannedFallback(item.text)
                    }
                    if realItems.isEmpty {
                        showErrorMessage("AI returned fallback. Check connection.")
                    } else {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                            rizzItems = realItems
                        }
                    }
                case .failure(let error):
                    showErrorMessage("Failed: \(error.localizedDescription)")
                }
            }
        }
    }

    private static func isCannedFallback(_ text: String) -> Bool {
        let fallbacks = [
            "there's only one way to find out",
            "i do, but you're gonna have to convince me you're worth my effort",
            "i'd love to show you just how well i can"
        ]
        return fallbacks.contains(text.lowercased())
    }

    private func showErrorMessage(_ message: String) {
        errorMessage = message
        showError = true
        // Auto-dismiss after 3 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            showError = false
        }
    }
}
